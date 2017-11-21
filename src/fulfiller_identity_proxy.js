'use strict';

const axios = require('axios');
const AWSXRayMock = require("./aws_xray_mock");

const schemeRegex = /\w+:\/\//;

class FulfillerIdentityProxy {

  constructor(url, authenticator, xray) {
    if (schemeRegex.test(url)) {
      throw new Error("The URL cannot contain a scheme.");
    }
    this.apiUrl = url;
    this.authenticator = authenticator ? authenticator : { getAuthorization: () => Promise.resolve() };
    this.xray = xray ? xray : AWSXRayMock;
  }

  get url() {
    return `https://${this.apiUrl}`;
  }

  callFulfillerIdentity(method, callOptions) {
    let self = this;
    return new Promise((resolve, reject) => {
      self.xray.captureAsyncFunc('FulfillerIdentity.getFulfillerById', function (subsegment) {
        self.authenticator.getAuthorization().then((authorization) => {
          let options = {
            timeout: 3000,
            method: method,
            headers: {
              'Authorization': authorization,
              'Content-Type': 'application/json'
            }
          };
          if (callOptions && callOptions.data) {
            options.data = callOptions.data;
          }
          if (callOptions && callOptions.fulfillerId) {
            subsegment.addAnnotation("FulfillerId", callOptions.fulfillerId);
          }
          options.url = (callOptions && callOptions.fulfillerId) ? `${self.url}/v1/fulfillers/${callOptions.fulfillerId}` : `${self.url}/v1/fulfillers`;
          axios(options)
            .then(function (res) {
              subsegment.addMetadata("response", res.data);
              subsegment.close();
              resolve(res.data);
            })
            .catch(function (err) {
              subsegment.close(err);
              reject(err);
            });
        });
      });
    });
  }
}

module.exports = FulfillerIdentityProxy;

'use strict';

const request = require("request");
const rp = require("request-promise");
const AWSXRayMock = require("./aws_xray_mock");

class FulfillerIdentityProxy {

  constructor(url, authenticator, xray) {
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
            method: method,
            headers: {
              'Authorization': authorization
            },
            json: true
          };
          if (callOptions && callOptions.data) {
            options.body = callOptions.data;
          }
          options.uri = (callOptions && callOptions.fulfillerId) ? `${self.url}/v1/fulfillers/${callOptions.fulfillerId}` : `${self.url}/v1/fulfillers`;
          rp(options)
            .then(function (parsedBody) {
              subsegment.addMetadata("response", parsedBody);
              subsegment.close();
              resolve(parsedBody);
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

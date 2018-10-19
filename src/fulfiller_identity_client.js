const axios = require('axios');
const axiosRetry = require('axios-retry');
const FulfillerNotFoundError = require("./errors/fulfiller_not_found_error");
const XRayProxy = require("./xray_proxy");
const Fulfiller = require("./fulfiller");
const FulfillerContact = require("./fulfillerContact");

const AWSXRayMock = require('./aws_xray_mock');

/**
 * The main class exposing client methods.
 */
class FulfillerIdentityClient {

  constructor(authorization, options) {
    const awsXRay = (options && options.AWSXRay) ? options.AWSXRay : AWSXRayMock;
    if (typeof authorization === "undefined") {
      this.authorizer = { getAuthorization: () => Promise.resolve("") };
    } else if (typeof authorization === "string") {
      this.authorizer = { getAuthorization: () => Promise.resolve(authorization.startsWith('Bearer ') ? authorization : 'Bearer ' + authorization) };
    } else if (typeof authorization === "function") {
      this.authorizer = { getAuthorization: () => Promise.resolve(authorization()) };
    } else {
      throw new Error("The authorization should be either a string, a function that returns a string, or a function that returns a Promise");
    }
    this.baseUrl = (options && options.url) ? options.url : "https://fulfilleridentity.trdlnk.cimpress.io";
    this.xrayPRoxy = new XRayProxy(this.authorizer, awsXRay);
    
    axiosRetry(axios, {
        retries: options.retries && options.retries >= 0 ? options.retries : 3,
        retryDelay: retryCount => options.retryDelayInMs && options.retryDelayInMs >= 0 ? options.retryDelayInMs : 1000
    });
  }

  getUrl() {
    return this.baseUrl;
  }

  /**
   * Returns an array of fulfiller objects that meet the criteria expesses in options
   * @param options Criteria for the query
   * {
   * showArchived: boolean
   * fulfillerName: string
   * noCache: boolean
   * }
   */
  getFulfillers(options) {
    return this.xrayPRoxy
      .capturePromise('FulfillerIdentity.getFulfillers', this._getFulfillers.bind(this), [], options);
  }

  _getFulfillers(authorization, subsegment, options) {
    let queryParameters = [];
    if (options && options.showArchived)
      queryParameters.push(`showArchived=${options.showArchived}`);

    if (options && options.fulfillerName)
      queryParameters.push(`fulfillerName=${options.fulfillerName}`);

    if (options && options.noCache)
      queryParameters.push(`noCache=${Math.random()}`);


    const url = `${this.baseUrl}/v1/fulfillers${queryParameters.length ? "?" + queryParameters.join('&') : ""}`;
    return this.makeRequest(authorization, 'GET', url)
      .then(res => {
        subsegment.addMetadata("response", res.data);
        return res.data;
      })
      .then(parsedBody => parsedBody.map(f => new Fulfiller(f.fulfillerId, f.internalFulfillerId, f.name, f.email, f.phone, f.language, f.links, f.archived)))
      .catch((err) => Promise.reject(new Error("Unable to get fulfillers: " + err.message)));
  }

  /**
   * Returns an array of fulfiller objects that meet the criteria expesses in options
   * @param fulfillerId Id of the fulfiller to retrieve
   * @param options Criteria for the query
   * {
   * noCache: boolean
   * }
   */
  getFulfiller(fulfillerId, options) {
    return this.xrayPRoxy
      .capturePromise('FulfillerIdentity.getFulfillerById', this._getFulfiller.bind(this), [], fulfillerId, options);
  }

  _getFulfiller(authorization, subsegment, fulfillerId, options) {

    if (options && options.noCache)
      queryParameters.push(`noCache=${Math.random()}`);

    const url = `${this.baseUrl}/v1/fulfillers/${fulfillerId}${options && options.noCache ? `?noCache=${Math.random()}` : ""}`;

    subsegment.addAnnotation("FulfillerId", fulfillerId);
    return this.makeRequest(authorization, 'GET', url)
      .then(res => {
        subsegment.addMetadata("response", res.data);
        return res.data;
      })
      .then(f => new Fulfiller(f.fulfillerId, f.internalFulfillerId, f.name, f.email, f.phone, f.language, f.links, f.archived))
      .catch((err) => Promise.reject(err.response && err.response.status === 404 ?
        new FulfillerNotFoundError(`Fulfiller ${fulfillerId} does not exits`) :
        new Error("Unable to get fulfiller: " + err.message)));
  }


  /**
   * Returns an array of fulfiller objects that meet the criteria expesses in options
   * @param fulfillerId Id of the fulfiller to retrieve
   * @param options Criteria for the query
   * {
   * noCache: boolean
   * }
   */
  getFulfillerContacts(fulfillerId, options) {
    return this.xrayPRoxy
      .capturePromise('FulfillerIdentity.getFulfillerContacts', this._getFulfillerContacts.bind(this), [], fulfillerId, options);
  }

  _getFulfillerContacts(authorization, subsegment, fulfillerId, options) {

    const url = `${this.baseUrl}/v1/fulfillers/${fulfillerId}/contacts${options && options.noCache ? `?noCache=${Math.random()}` : ""}`;

    subsegment.addAnnotation("FulfillerId", fulfillerId);
    return this.makeRequest(authorization, 'GET', url)
      .then(res => {
        subsegment.addMetadata("response", res.data);
        return res.data;
      })
      .then(parsedBody => parsedBody.map(f => new FulfillerContact(f.id, f.createdAt, f.createdBy, f.defaultContact, f.email, f.language, f.name, f.phone, f.technicalContact, f.links)))
      .catch((err) => Promise.reject(err.response && err.response.status === 404 ?
        new FulfillerNotFoundError(`Fulfiller ${fulfillerId} does not exits`) :
        new Error("Unable to get fulfiller contacts: " + err.message)));
  }

  /**
   * Saves changes made to a fulfiller object.
   * @param fulfiller Fufiller object, either retrieved via getFulfiller or getFulfillers or using new Fulfiller statement
   */
  saveFulfiller(fulfiller) {
    return this.xrayPRoxy
      .capturePromise('FulfillerIdentity.saveFulfiller', this._saveFulfiller.bind(this), [], fulfiller);
  }

  _saveFulfiller(authorization, subsegment, fulfiller) {
    const fulfillerId = fulfiller.fulfillerId || fulfiller.internalFulfillerId;
    if (fulfillerId) {
    subsegment.addAnnotation("FulfillerId", fulfillerId);
      return this.makeRequest(authorization, 'PUT', `${this.baseUrl}/v1/fulfillers/${fulfillerId}`, fulfiller)
        .then((f) => Promise.resolve())
        .catch((err) => Promise.reject(new Error("Unable to update fulfiller: " + err.message)));
    } else {
      return this.makeRequest(authorization, 'POST', `${this.baseUrl}/v1/fulfillers`, fulfiller)
        .then((f) => Promise.resolve())
        .catch((err) => Promise.reject(new Error("Unable to create fulfiller: " + err.message)));
    }
  }

  makeRequest(authorization, method, url, body, timeout = 3000) {
    let params = {
      timeout,
      method,
      url,
      headers: { 'Content-Type': 'application/json' }
    };

    if (authorization) {
      params.headers.Authorization = authorization;
    }
    if (body) {
      params.data = body;
    }
    return axios(params);
  }
}

module.exports = FulfillerIdentityClient;

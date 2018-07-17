'use strict';

const AWSXRayMock = require("./aws_xray_mock");

class XRayProxy {

  constructor(authenticator, xray) {
    this.authenticator = authenticator ? authenticator : { getAuthorization: () => Promise.resolve() };
    this.xray = xray ? xray : AWSXRayMock;
  }

  /**
   * This method captures the promise pased by parameter within xRay, the promise will receive
   * by parameter the result of the authenticator passed in the constructor as first argument, a subsegment
   * for adding further annotations and all the rest of arguments passed to this function
   * 
   * @param {*} segmentName String, // X-Ray segment name
   * @param {*} promise Wrapped function
   * @param {*} annotations  Array<Object> // Annotations to be included, {key, value}
   */
  capturePromise(segmentName, promise, annotations) {
      return new Promise(resolve => {
        this.xray
          .captureAsyncFunc(segmentName, subsegment => {
            resolve(this.authenticator
              .getAuthorization()
              .then(authorization => {
                const args = Object.keys(arguments).map(a => arguments[a]);
                annotations
                  .forEach(annotation => subsegment.addAnnotation(annotation.key, annotation.value));
                return promise(authorization, subsegment, ...args.slice(3));
              })
              .then(result => {
                subsegment.close();
                return result;
              })
              .catch(err => {
                subsegment.close(err);
                return Promise.reject(err);
              }));
          });
      });
  }
}

module.exports = XRayProxy;

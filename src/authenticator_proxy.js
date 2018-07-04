'use strict';

const AWSXRayMock = require("./aws_xray_mock");

class AuthenticatorProxy {

  constructor(authenticator, xray) {
    this.authenticator = authenticator ? authenticator : { getAuthorization: () => Promise.resolve() };
    this.xray = xray ? xray : AWSXRayMock;
  }

  /**
   * @param {*} segmentName String, // X-Ray segment name
   * @param {*} promise Wrapped function
   * @param {*} annotations  Array<Object> // Annotations to be included, {key, value}
   */
  xRayCapture(segmentName, promise, annotations) {
    return new Promise((resolve, reject) => {
      this.xray
        .captureAsyncFunc(segmentName, subsegment => {
          resolve(this.authenticator
            .getAuthorization()
            .then(authorization => {
              annotations
                .forEach(annotation => subsegment.addAnnotation(annotation.key, annotation.value));
              return promise(authorization, subsegment, ...Object.values(arguments).slice(3));
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

module.exports = AuthenticatorProxy;

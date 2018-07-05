'use strict';

const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const XRayProxy = require("../src/xray_proxy");

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("XRayProxy", function () {

  this.timeout(10000);

  describe("capturePromise", function () {

    it("It's correctly wrapped", function (done) {
      const annotations = []
      let token = "Bearer e2bce1a36815415fac1674e645502547"
      let xrayMock = require('../src/aws_xray_mock');
      let proxy = new XRayProxy({ getAuthorization: () => Promise.resolve(token) }, xrayMock);
      let promiseCalled = false
      let promise = (authorization, subsegment, myVar, myVar2) => {
        promiseCalled = true

        expect(authorization).to.equals(token);
        expect(myVar).to.equals("ABC");
        expect(myVar2).to.equals(1234);

        return Promise.resolve("OK")
      }

      proxy
        .capturePromise("MySegment", promise, annotations, "ABC", 1234)
        .then(result => {
          expect(promiseCalled).to.equals(true);
          expect(result).to.equals("OK");
          done()
        })
    });


    it("When wrapped promise fails it's correctly cached", function (done) {
      const annotations = []
      let token = "Bearer e2bce1a36815415fac1674e645502547"
      let xrayMock = require('../src/aws_xray_mock');
      let proxy = new XRayProxy({ getAuthorization: () => Promise.resolve("") }, xrayMock);
      let promise = () => Promise.reject("KO")

      proxy
        .capturePromise("MySegment", promise, annotations, "ABC", 1234)
        .then(result => { })
        .catch(err => {
          expect(err).to.equals("KO");
          done()
        })
    });


    it("Annotations are added", function (done) {
      const annotations = [{ key: "Annotation1", value: "value1" }]
      let token = "Bearer e2bce1a36815415fac1674e645502547"
      let xrayMock = {
        captureAsyncFunc: function (arg, cb) {
          cb({
            addAnnotation: (key, value) => {
              expect(key).to.equals("Annotation1");
              expect(value).to.equals("value1");
              done()
            },
            addMetadata: function () {
            },
            addError: function () {
            },
            close: function () {
            }
          });
        }, captureAWS: function (arg) {
          return arg;
        }
      };
      let proxy = new XRayProxy({ getAuthorization: () => Promise.resolve(token) }, xrayMock);
      let promise = (authorization, subsegment, myVar, myVar2) => Promise.resolve("OK")
      proxy
        .capturePromise("MySegment", promise, annotations, "ABC", 1234)
        .then(result => {
        })
    });
  });

});
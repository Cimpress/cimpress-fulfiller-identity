'use strict';

const sinon = require("sinon");
const nock = require('nock');
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const FulfillerIdentityProxy = require("../src/fulfiller_identity_proxy");

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("Fulfiller Identity proxy", function () {

  this.timeout(10000);

  let testedObject = null;

  beforeEach(function () {
    nock('https://dummy.fulfilleridentity.url',
      {
        reqheaders: {
          'Authorization': 'Bearer e2bce1a36815415fac1674e645502547'
        }
      })
      .get('/v1/fulfillers/863d0757-037a-4c9c-a6e1-c91b302c68da')
      .reply(200, {
        fulfillerId: "863d0757-037a-4c9c-a6e1-c91b302c68da",
        id: 19,
        name: "SomeName",
        email: "dummy@cimpress.com",
        phone: "",
        language: "en-US"
      });

    nock('https://dummy.fulfilleridentity.url')
      .get('/v1/fulfillers/863d0757-037a-4c9c-a6e1-c91b302c68da')
      .reply(401, "Unauthorized");
  });

  describe("callFulfillerIdentity", function () {

    it("makes the call to underlying service", function () {
      testedObject = new FulfillerIdentityProxy("dummy.fulfilleridentity.url", { getAuthorization: () => Promise.resolve("Bearer e2bce1a36815415fac1674e645502547") });
      return expect(testedObject.callFulfillerIdentity("GET", { fulfillerId: "863d0757-037a-4c9c-a6e1-c91b302c68da" })).to.eventually.deep.equal({
        fulfillerId: "863d0757-037a-4c9c-a6e1-c91b302c68da",
        id: 19,
        name: "SomeName",
        email: "dummy@cimpress.com",
        phone: "",
        language: "en-US"
      })
    });

    it("when authorizer is not provided, attempts to connect without authorization header", function () {
      testedObject = new FulfillerIdentityProxy("dummy.fulfilleridentity.url");
      return expect(testedObject.callFulfillerIdentity("GET", { fulfillerId: "863d0757-037a-4c9c-a6e1-c91b302c68da" })).be.rejectedWith('401 - "Unauthorized"');
    });

  });

});
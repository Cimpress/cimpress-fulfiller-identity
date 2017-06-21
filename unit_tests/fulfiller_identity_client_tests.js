'use strict';

const sinon = require("sinon");
const nock = require('nock');
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const FulfillerIdentityClient = require("../src/fulfiller_identity_client");
const Fulfiller = require("../src/fulfiller");
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
      .get('/v1/fulfillers')
      .reply(200, [{
        fulfillerId: "a3efe4wef",
        internalFulfillerId: 19,
        name: "SomeName1",
        email: "dummy1@cimpress.com",
        phone: "",
        language: "en-US"
      },{
        fulfillerId: "99bd65d34851",
        internalFulfillerId: 20,
        name: "SomeName2",
        email: "dummy2@cimpress.com",
        phone: "",
        language: "en-US"
      }])
      .get('/v1/fulfillers/19')
      .reply(200, {
        fulfillerId: "a3efe4wef",
        internalFulfillerId: 19,
        name: "SomeName1",
        email: "dummy1@cimpress.com",
        phone: "",
        language: "en-US"
      })
      .post('/v1/fulfillers')
      .reply(200)
      .put('/v1/fulfillers/9146d8ba-aa6e-43c8-90c1-091cb745f5f0')
      .reply(200);

    nock('https://dummy.fulfilleridentity.url')
      .get('/v1/fulfillers')
      .reply(401, "Unauthorized")
      .post('/v1/fulfillers')
      .reply(401, "Unauthorized")
      .get('/v1/fulfillers/19')
      .reply(401, "Unauthorized")
      .put('/v1/fulfillers/9146d8ba-aa6e-43c8-90c1-091cb745f5f0')
      .reply(401, "Unauthorized")
  });

  describe("getFulfillers", function () {

    it("fetches the list of fulfillers", function () {
      testedObject = new FulfillerIdentityClient("Bearer e2bce1a36815415fac1674e645502547", { url: "dummy.fulfilleridentity.url" });
      return expect(testedObject.getFulfillers()).to.eventually.have.length(2);
    });

  });

  describe("getFulfiller", function () {

    it("fetches the fulfiller", function () {
      testedObject = new FulfillerIdentityClient("Bearer e2bce1a36815415fac1674e645502547", { url: "dummy.fulfilleridentity.url" });
      return expect(testedObject.getFulfiller(19)).to.eventually.deep.equal(new Fulfiller("a3efe4wef", 19, "SomeName1", "dummy1@cimpress.com", "", "en-US"));
    });

  });

  describe("saveFulfiller", function () {

    it("creates the fulfiller", function () {
      let fulfiller = new Fulfiller("9146d8ba-aa6e-43c8-90c1-091cb745f5f0", 1234, "Test Fulfiller", "test@fulfiller.com", "123432434", "en-us");
      testedObject = new FulfillerIdentityClient("Bearer e2bce1a36815415fac1674e645502547", { url: "dummy.fulfilleridentity.url" });
      return expect(testedObject.saveFulfiller(fulfiller)).to.be.fulfilled;
    });

    it("updates the fulfiller", function () {
      let fulfiller = new Fulfiller(null, null, "Test Fulfiller", "test@fulfiller.com", "123432434", "en-us");
      testedObject = new FulfillerIdentityClient("Bearer e2bce1a36815415fac1674e645502547", { url: "dummy.fulfilleridentity.url" });
      return expect(testedObject.saveFulfiller(fulfiller)).to.be.fulfilled;
    });

  });

});
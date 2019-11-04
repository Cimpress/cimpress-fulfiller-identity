'use strict';

const nock = require('nock');
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const FulfillerIdentityClient = require("../src/fulfiller_identity_client");
const Fulfiller = require("../src/fulfiller");
const FulfillerNotFoundError = require("../src/errors/fulfiller_not_found_error");

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("Fulfiller Identity Client", function () {

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
      }, {
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
      .reply(200)
      .get('/v1/fulfillers/2131324134')
      .reply(404)
      .get('/v1/fulfillers/ar7jp3dnj/contacts')
      .reply(200, [
        {
          "id": "6c92ff0d-23ab-46fe-98ad-66a09a3a1bac",
          "createdAt": "2017-10-17T19:18:01.237756",
          "createdBy": "adfs|rrishi@cimpress.com",
          "links": {
            "self": {
              "href": "https://fulfilleridentity.trdlnk.cimpress.io/v1/fulfillers/ar7jp3dnj/contacts/6c92ff0d-23ab-46fe-98ad-66a09a3a1bac",
              "rel": "self"
            },
            "up": {
              "href": "https://fulfilleridentity.trdlnk.cimpress.io/v1/fulfillers/ar7jp3dnj/contacts",
              "rel": "contacts"
            },
            "fulfiller": {
              "href": "https://fulfilleridentity.trdlnk.cimpress.io/v1/fulfillers/ar7jp3dnj",
              "rel": "fulfiller"
            }
          },
          "defaultContact": true,
          "email": "msworders@cimpress.com",
          "language": "en-US",
          "name": "Default",
          "phone": "7813238086",
          "technicalContact": true
        }
      ]);

    nock('https://dummy.fulfilleridentity.url')
      .get('/v1/fulfillers')
      .reply(401, "Unauthorized")
      .post('/v1/fulfillers')
      .reply(401, "Unauthorized")
      .get('/v1/fulfillers/19')
      .reply(401, "Unauthorized")
      .put('/v1/fulfillers/9146d8ba-aa6e-43c8-90c1-091cb745f5f0')
      .reply(401, "Unauthorized")
      .get('/v1/fulfillers/ar7jp3dnj/contacts')
      .reply(401, "Unauthorized")
  });

  describe("getFulfillers", function () {

    it("fetches the list of fulfillers", function (done) {
      testedObject = new FulfillerIdentityClient('Bearer e2bce1a36815415fac1674e645502547', { url: "https://dummy.fulfilleridentity.url" });
      testedObject
        .getFulfillers()
        .then(res => {
          expect(res.length).to.equal(2);
          done()
        })
    });

  });


  describe("getFulfiller", function () {

    it("fetches the fulfiller", function () {
      testedObject = new FulfillerIdentityClient("Bearer e2bce1a36815415fac1674e645502547", { url: "https://dummy.fulfilleridentity.url" });
      return expect(testedObject.getFulfiller(19)).to.eventually.deep.equal(new Fulfiller("a3efe4wef", 19, "SomeName1", "dummy1@cimpress.com", "", "en-US"));
    });

    it("indicates that fulfiller doesn't exist", function () {
      testedObject = new FulfillerIdentityClient("Bearer e2bce1a36815415fac1674e645502547", { url: "https://dummy.fulfilleridentity.url" });
      return expect(testedObject.getFulfiller(2131324134)).to.be.rejectedWith(FulfillerNotFoundError, "Fulfiller 2131324134 does not exist");
    });

  });

  describe("saveFulfiller", function () {

    it("creates the fulfiller", function () {
      let fulfiller = new Fulfiller("9146d8ba-aa6e-43c8-90c1-091cb745f5f0", 1234, "Test Fulfiller", "test@fulfiller.com", "123432434", "en-us");
      testedObject = new FulfillerIdentityClient("Bearer e2bce1a36815415fac1674e645502547", { url: "https://dummy.fulfilleridentity.url" });
      return expect(testedObject.saveFulfiller(fulfiller)).to.be.fulfilled;
    });

    it("updates the fulfiller", function () {
      let fulfiller = new Fulfiller(null, null, "Test Fulfiller", "test@fulfiller.com", "123432434", "en-us");
      testedObject = new FulfillerIdentityClient("Bearer e2bce1a36815415fac1674e645502547", { url: "https://dummy.fulfilleridentity.url" });
      return expect(testedObject.saveFulfiller(fulfiller)).to.be.fulfilled;
    });

  });


  describe("getFulfillerContacts", function () {

    it("fetches the list of fulfiller contacts", function (done) {
      testedObject = new FulfillerIdentityClient('Bearer e2bce1a36815415fac1674e645502547', { url: "https://dummy.fulfilleridentity.url" });
      testedObject
        .getFulfillerContacts("ar7jp3dnj")
        .then(res => {
          expect(res.length).to.equal(1);
          done()
        })
    });

  });

});

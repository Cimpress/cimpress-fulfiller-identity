'use strict';

const sinon = require("sinon");
const nock = require('nock');
const chai = require('chai');
const expect = chai.expect;
const Fulfiller = require("../src/fulfiller");

describe("Fulfiller object", function () {

  this.timeout(10000);

  let testedObject = null;

  beforeEach(function () {
    testedObject = new Fulfiller("f621a65689ac", 1323123, "Test Fulfiller", "test@fulfiller.com", "555324412", "en-us")
  });

  describe("has working property", function () {

    it("fulfillerId", function () {
      expect(testedObject).to.have.property("fulfillerId", "f621a65689ac");
      expect(() => testedObject.fulfillerId = "0c8fe1e3-f1ac-4c11-9195-553fe391c95e").to.throw("Cannot set property fulfillerId of #<Fulfiller> which has only a getter");
    });

    it("internalFulfillerId", function () {
      expect(testedObject).to.have.property("internalFulfillerId", 1323123);
      expect(() => testedObject.internalFulfillerId = 12312123).to.throw("Cannot set property internalFulfillerId of #<Fulfiller> which has only a getter");
    });

    it("name", function () {
      expect(testedObject).to.have.property("name", "Test Fulfiller");
      testedObject.name = "Test Fulfiller Updated";
      expect(testedObject).to.have.property("name", "Test Fulfiller Updated");
    });

    it("email", function () {
      expect(testedObject).to.have.property("email", "test@fulfiller.com");
      testedObject.email = "test2@fulfiller.com";
      expect(testedObject).to.have.property("email", "test2@fulfiller.com");
    });

    it("phone", function () {
      expect(testedObject).to.have.property("phone", "555324412");
      testedObject.phone = "123324412";
      expect(testedObject).to.have.property("phone", "123324412");
    });

    it("language", function () {
      expect(testedObject).to.have.property("language", "en-us");
      testedObject.language = "pl-pl";
      expect(testedObject).to.have.property("language", "pl-pl");
    });

    it("archived", function () {
      expect(testedObject).to.have.property("archived", false);
      testedObject.archived = true;
      expect(testedObject).to.have.property("archived", true);
    });

  });

  describe("serializes to JSON in a way that complies with the microservice", function () {

    it("archived", function () {
      expect(JSON.parse(JSON.stringify(testedObject))).to.be.deep.equal({
        "fulfillerId": "f621a65689ac",
        "internalFulfillerId": 1323123,
        "name": "Test Fulfiller",
        "email": "test@fulfiller.com",
        "phone": "555324412",
        "language": "en-us",
        "archived": false
      });
    });

  });

});
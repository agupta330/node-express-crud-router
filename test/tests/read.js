(function() {
  "use strict";

  var expect = require('expect');
  var fixtures = require("../fixtures.js");

  var defaultModelData = fixtures.defaultModelData;
  var baseUrl = fixtures.baseUrl;
  var currentDocument;


  module.exports = function() {

    beforeEach(function(done) {

      fixtures.request({
          url: baseUrl,
          method: "put",
          json: defaultModelData
        })
        .then(function(result) {
          currentDocument = result;
        })
        .then(function() {
          done();
        })
        .catch(function(err) {
          done(err);
        })

    });


    it(' - should return single document by its id', function(done) {

      var url = baseUrl + "/" + currentDocument._id;

      fixtures.request({
          url: url,
          method: "get",
          json: true
        })
        .then(function(result) {
          expect(result).toEqual(currentDocument);
        })
        .then(function() {
          done();
        })
        .catch(function(err) {
          done(err);
        })

    });


    it(' - should return documents by criteria ', function(done) {

      var url = baseUrl;

      var qs = {
        criteria: {
          _id: currentDocument._id
        }
      };

      fixtures.request({
          url: url,
          method: "get",
          json: true,
          qs: qs
        })
        .then(function(result) {
          expect(result).toBeAn("array");
          expect(result[0]).toEqual(currentDocument);
        })
        .then(function() {
          done();
        })
        .catch(function(err) {
          done(err);
        })

    });

    it(' - should skip first document and return second document with limit 1', function(done) {

      var url = baseUrl;

      var qs = {
        skip: 0,
        limit: 10
      }

      var firstDoc = null;
      var secondDoc = null;

      fixtures.request({
          url: url,
          method: "get",
          json: true,
          qs: qs
        })
        .then(function(result) {
          expect(result).toBeAn("array");
          expect(result.length).toBeMoreThan(1);
          firstDoc = result[0];
          secondDoc = result[1];
        })
        .then(function () {
          qs.skip = 1;
          qs.limit = 1;
          return fixtures.request({
              url: url,
              method: "get",
              json: true,
              qs: qs
            })
        })
        .then(function(result) {
          expect(result).toBeAn("array");
          expect(result.length).toBe(1);
          expect(result[0]).toNotEqual(firstDoc);
          expect(result[0]).toEqual(secondDoc);
        })
        .then(function() {
          done();
        })
        .catch(function(err) {
          done(err);
        })

    });

  };

}());

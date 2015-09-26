(function() {
  "use strict";

  var expect = require('expect');
  var fixtures = require("../fixtures.js");
  var us = require('underscore');
  var supertest = require('supertest');

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

      supertest(fixtures.app)
        .get("/api/users/"+currentDocument._id)
        .expect(200, currentDocument)
        .end(function(err, res) {
          done(err);
        });

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

    it(' - should return documents in different sort orders', function(done) {

      var data = us.clone(defaultModelData);

      var qs = {
        sort: {
          counter: "asc"
        }
      };

      fixtures.request({
          url: baseUrl,
          method: "put",
          json: data
        })
        .then(function () {
          data.counter++
        })
        .then(function () {
          return fixtures.request({
              url: baseUrl,
              method: "put",
              json: data
            })
        })
        .then(function () {
          data.counter++
        })
        .then(function () {
          return fixtures.request({
              url: baseUrl,
              method: "put",
              json: data
            })
        })
        .then(function () {
          qs.sort.counter = "asc";
          return fixtures.request({
              url: baseUrl,
              method: "get",
              json: true,
              qs: qs
            })
        })
        .then(function(result) {
          expect(result).toBeAn("array");
          expect(result[0].counter).toBe(1);
        })
        .then(function () {
          qs.sort.counter = "desc";
          return fixtures.request({
              url: baseUrl,
              method: "get",
              json: true,
              qs: qs
            })
        })
        .then(function(result) {
          expect(result).toBeAn("array");
          expect(result[0].counter).toBe(3);
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

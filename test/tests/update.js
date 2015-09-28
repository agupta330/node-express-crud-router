(function() {
  "use strict";

  var expect = require('expect');
  var fixtures = require("../fixtures.js");
  var supertest = require('supertest');

  var defaultModelData = fixtures.defaultModelData;
  var baseUrl = fixtures.baseUrl;
  var currentDocument;


  module.exports = function() {

    beforeEach(function(done) {

      supertest(fixtures.app)
        .post('/api/users')
        .expect(200)
        .expect(function(res) {
          currentDocument = res.body;
        })
        .send(defaultModelData)
        .end(function(err, res) {
          done(err);
        });

    });


    it(' - should update with valid data', function(done) {

      var updateData = {};
      updateData.name = "My updated testmodel name";

      var url = "/api/users/" + currentDocument._id;

      supertest(fixtures.app)
        .put(url)
        .expect(200)
        .expect(function(res) {
          var result = res.body;
          expect(result._id).toBe(currentDocument._id);
          expect(result.desc).toBe(currentDocument.desc);
          expect(result.ident).toBe(currentDocument.ident);
          expect(result.name).toBe(updateData.name);
        })
        .send(updateData)
        .end(function(err, res) {
          done(err);
        });

    });

  };

}());

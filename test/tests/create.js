(function() {
  "use strict";

  var expect = require('expect');
  var fixtures = require("../fixtures.js");
  var supertest = require('supertest');

  var defaultModelData = fixtures.defaultModelData;

  module.exports = test;

  function test() {

    it(' - should create valid document with _id property', function(done) {

      var obj = defaultModelData;

      supertest(fixtures.app)
        .post("/api/users")
        .expect(200)
        .expect(function(res) {
          var result = res.body;
          expect(result._id).toExist("Property _id does not exist");
          expect(result.name).toBe(obj.name, "Property name does not match " + obj.name);
          expect(result.desc).toBe(obj.desc);
          expect(result.ident).toBe(obj.ident);
        })
        .send(defaultModelData)
        .end(function(err, res) {
          done(err);
        });

    });


    it(' - should return http 400 because of invalid property', function(done) {


      // leave out obj.desc field
      var obj = {
        name: defaultModelData.name,
        ident: defaultModelData.ident
      };

      supertest(fixtures.app)
        .post("/api/users")
        .expect(400)
        .send(obj)
        .end(function(err, res) {
          done(err);
        });


    });

  };

}());

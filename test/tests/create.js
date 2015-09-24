(function() {
  "use strict";

  var expect = require('expect');
  var fixtures = require("../fixtures.js");
  var request = require("request");

  var defaultModelData = fixtures.defaultModelData;
  var baseUrl = fixtures.baseUrl

  module.exports = test;

  function test() {

    it(' - should create valid document with _id property', function(done) {

      var url = baseUrl;

      var obj = defaultModelData;

      fixtures
        .request({
          url: url,
          method: "post",
          json: defaultModelData
        })
        .then(function(result) {
          expect(result._id).toExist("Property _id does not exist");
          expect(result.name).toBe(obj.name, "Property name does not match " + obj.name);
          expect(result.desc).toBe(obj.desc);
          expect(result.ident).toBe(obj.ident);
        })
        .then(function() {
          done();
        })
        .catch(function(err) {
          done(err);
        })

    });


    it(' - should return http 400 because of invalid property', function(done) {


      // leave out obj.desc field
      var obj = {
        name: defaultModelData.name,
        ident: defaultModelData.ident
      };

			var url = baseUrl;

      fixtures
        .request({
          url: url,
          method: "post",
          json: obj
        })
        .then(function() {
          done(new Error("Code should not be executed"));
        })
        .catch(function(err) {
          expect(err.response.statusCode).toBe(400);
          done();
        })


    });

  };

}());

(function() {
  "use strict";

  var expect = require('expect');
  var fixtures = require("../fixtures.js");

  var defaultModelData = fixtures.defaultModelData;
  var baseUrl = fixtures.baseUrl;
  var currentDocument;


  module.exports = function() {

    beforeEach(function(done) {

      var obj = defaultModelData;
      var url = fixtures.baseUrl;

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
          currentDocument = result;
        })
        .then(function() {
          done();
        })
        .catch(function(err) {
          done(err);
        })

    });


    it(' - should update with valid data', function(done) {

      var url = baseUrl + "/" + currentDocument._id;

      var updateData = {};
      updateData.name = "My updated testmodel name";

      fixtures
        .request({
          url: url,
          method: "put",
          json: updateData
        })
        .then(function(result) {
          expect(result._id).toBe(currentDocument._id);
          expect(result.desc).toBe(currentDocument.desc);
          expect(result.ident).toBe(currentDocument.ident);
          expect(result.name).toBe(updateData.name);
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

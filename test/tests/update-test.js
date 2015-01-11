(function() {
  "use strict";

  var expect = require('expect.js');
  var fixtures = require("../fixtures.js");
  var logger = require("../../lib/logger.js");
  var request = require("request");

  var testModelData = fixtures.TestModelData;
  var baseUrl = fixtures.host.getBaseUrl();


  module.exports = function() {

    beforeEach(function(done) {
      request.put(baseUrl, function(err, res, result) {

        expect(err).not.to.be.ok();
        expect(res.statusCode).to.be(200);

        done();

      }).json(testModelData);
    });


    it('#update - with valid data', function(done) {

      var url = baseUrl;

      request.get(url, function(err, res, result) {

        expect(err).not.to.be.ok();
        expect(res.statusCode).to.be(200);

        var item = result[0];
        var id = item._id;
        var updateData = {};
        updateData.name = "My updated testmodel name";

        request.post(url + "/" + id, function(err, res, result) {

          expect(err).not.to.be.ok();
          expect(res.statusCode).to.be(200);

          expect(result.name).to.be.ok();
          expect(result.name).to.be(updateData.name);

          done();

        }).json(updateData);

      }).json();

    });


    it('#update - with invalid data', function(done) {

      var url = baseUrl;

      request.get(url, function(err, res, result) {

        expect(err).not.to.be.ok();
        expect(res.statusCode).to.be(200);

        var item = result[0];
        var id = item._id;
        var updateData = {};
        updateData.name = "My updated testmodel name";

        request.post(url + "/" + id, function(err, res, result) {

          expect(err).not.to.be.ok();
          expect(res.statusCode).to.be(200);

          expect(result.name).to.be.ok();
          expect(result.name).to.be(updateData.name);

          done();

        }).json(updateData);

      }).json();

    });



  };

}());

(function() {
  "use strict";

  var expect = require('expect');
  var fixtures = require("../fixtures.js");
  var request = require("request");

  var defaultModelData = fixtures.defaultModelData;
  var baseUrl = fixtures.baseUrl


  module.exports = function() {

    it(' - should delete existing single document', function(done) {

      var url = baseUrl;

      var data = defaultModelData;

      request.post(url, function(err, res, result) {

        expect(err).toNotExist();
        expect(res.statusCode).toBe(200);

        var id = result._id;

        request.del(url + "/" + id, function(err2, res2, result2) {

          expect(err2).toNotExist();
          expect(res2.statusCode).toBe(200);

          expect(result2.model._id).toBe(id);
          expect(result2.deleted).toBe(true);

          done();

        }).json()

      }).json(data);

    });



    it(' - should return http 400 because of invalid objectId', function(done) {

      var url = baseUrl;
      var id = "InvalidId";

      request.del(url + "/" + id, function(err, res, result) {

        expect(err).toNotExist();
        expect(res.statusCode).toBe(400);

        done();

      }).json()

    });



    it(' - should remove all documents', function(done) {

      var url = baseUrl;

      request.del(url, function(err, res, result) {

        expect(err).toNotExist();
        expect(res.statusCode).toBe(200);

        expect(result).toBeAn("array");
        expect(result.length).toBe(0);

        request.get(url, function(err2, res2, result2) {

          expect(err2).toNotExist();
          expect(res2.statusCode).toBe(200);
          expect(result2).toBeAn("array");
          expect(result2.length).toBe(0);

          done();

        }).json()

      }).json();

    });


  };

}());

(function() {
  "use strict";

  var expect = require('expect.js');
  var fixtures = require("../fixtures.js");
  var logger = require("../../lib/logger.js");
  var request = require("request");

  var testModelData = fixtures.TestModelData;
  var baseUrl = fixtures.host.getBaseUrl();


  module.exports = function() {

    it('#remove - existing object', function(done) {

      var url = baseUrl;

      logger.debug("Request on url ", url);

      request.get(url, function(err, res, result) {

        expect(err).not.to.be.ok();
        expect(res.statusCode).to.be(200);

        var id = result[0]._id;

        logger.debug("Remove id ", id);

        request.del(url + "/" + id, function(err2, res2, result2) {

          expect(err2).not.to.be.ok();
          expect(res2.statusCode).to.be(200);

          expect(result2.model._id).to.be.eql(id);
          expect(result2.deleted).to.be.ok();

          done();

        }).json()

      }).json();

    });



    it('#remove - with invalid object id', function(done) {

      var url = baseUrl;
      var id = "InvalidId";

      logger.debug("Request on url ", url + "/" + id);
      logger.debug("Remove id ", id);

      request.del(url + "/" + id, function(err, res, result) {

        expect(err).not.to.be.ok();
        expect(res.statusCode).to.be(500);

        done();

      }).json()

    });



    it('#removeAll', function(done) {

      var url = baseUrl;

      request.del(url, function(err, res, result) {

        expect(err).not.to.be.ok();
        expect(res.statusCode).to.be(200);

        expect(result.deletedAll).to.be.ok();

        request.get(url, function(err2, res2, result2) {

          expect(err2).not.to.be.ok();
          expect(res2.statusCode).to.be(200);

          expect(result2).to.be.empty()

          done();

        }).json()

      }).json();

    });


  };

}());

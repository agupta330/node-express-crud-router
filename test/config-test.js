(function () {
	"use strict";

	var expect = require('expect.js');
	var fixtures = require("./fixtures.js");
	var logger = require("../lib/logger.js");
	var request = require("request");

	var testModelData = fixtures.TestModelData;
	var baseUrl = fixtures.host.getBaseUrl();


	module.exports = function () {

		it('#config get', function (done) {

			var url = baseUrl + "/config";

			request.get(url, function (err, res, result) {

				expect(err).not.to.be.ok();
				expect(res.statusCode).to.be(200);

				expect(result.loglevel).to.be.ok();

				done();

			}).json();

		});


		it('#config update - loglevel DEBUG', function (done) {

			var url = baseUrl + "/config";

			var config = {
				loglevel: "INFO"
			}

			request.post(url, function (err, res, result) {

				expect(err).not.to.be.ok();
				expect(res.statusCode).to.be(200);

				expect(result.loglevel).to.be(config.loglevel);

				done();

			}).json(config);

		});

	};

}());
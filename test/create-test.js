(function () {
	"use strict";

	var expect = require('expect.js');
	var fixtures = require("./fixtures.js");
	var logger = require("../lib/logger.js");
	var request = require("request");

	var testModelData = fixtures.TestModelData;
	var baseUrl = fixtures.host.getBaseUrl();


	module.exports = function () {

		it('#create - with valid data', function (done) {

			var obj = testModelData;
			var url = baseUrl;

			logger.debug("Request on url ", url);
			logger.debug("Request with data ", obj);

			request.put(url, function (err, res, result) {

				expect(err).not.to.be.ok();
				expect(res.statusCode).to.be(200);

				expect(result._id).to.be.ok();
				expect(result.name).to.eql(obj.name);
				expect(result.desc).to.eql(obj.desc);
				expect(result.ident).to.eql(obj.ident);

				done();

			}).json(obj);

		});


		it('#create - with missing desc attr', function (done) {


			// leave obj.desc field
			var obj = {
				name: testModelData.name,
				ident: testModelData.ident
			};

			var url = baseUrl;

			logger.debug("Request on url ", url);
			logger.debug("Request with data ", obj);

			expect(obj.desc).not.to.be.ok();

			request.put(url, function (err, res, result) {

				expect(err).not.to.be.ok();
				expect(res.statusCode).to.be(500);

				done();

			}).json(obj);

		});

	};

}());
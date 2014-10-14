(function () {
	"use strict";

	var expect = require('expect.js');
	var fixtures = require("./fixtures.js");
	var logger = require("../lib/logger.js");
	var request = require("request");

	var testModelData = {
		name: "TestModel",
		desc: "TestModel description"
	}

	var port = 3333;
	var baseUrl = "http://localhost:3333/test";


	module.exports = function () {

		it('create', function (done) {

			var obj = testModelData;
			var url = baseUrl;

			request.put(url, function (err, res, result) {

				expect(err).not.to.be.ok();
				expect(res.statusCode).to.be(200);

				expect(result._id).to.be.ok();
				expect(result.name).to.eql(obj.name);
				expect(result.desc).to.eql(obj.desc);

				done();

			}).json(obj);

		});

	};

}());
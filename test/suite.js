(function () {
	"use strict";

	var expect = require('expect.js');
	var fixtures = require("./fixtures.js");
	var logger = require("../lib/logger.js");
	var request = require("request");
	var mongoose = require("mongoose");

	var server;

	var testData = fixtures.TestModelData;
	var baseUrl = fixtures.host.getBaseUrl();
	var port = fixtures.host.port;

	// logger.setLevel("DEBUG");


	describe('Model creation', require("./tests/create-test.js"));
	describe('Model search', require("./tests/find-test.js"));
	describe('Model update', require("./test/update-test.js"));
	describe('Model removal', require("./tests/remove-test.js"));
	describe('Model config', require("./tests/config-test.js"));


	before(function (done) {

		mongoose.connect('mongodb://localhost/test');
		mongoose.set("debug", false);

		var app = fixtures.TestApp;
		var TestModel = fixtures.TestModel;
		var TestRouter = fixtures.TestRouter;

		var path = fixtures.host.path;
		app.use("/" + path, new TestRouter({
			model: TestModel
		}));

		app.use(function (err, req, res, next) {
			// console.log("ERRROR: ", err);
			res.status(500).json({
				statusCode: 500,
				message: err.toString()
			});
		});

		server = app.listen(port, function () {

			request.put(baseUrl, function (err, res, result) {

				expect(err).not.to.be.ok();
				expect(res.statusCode).to.be(200);

				done();

			}).json(testData);

		});

	});



	after(function (done) {

		this.timeout(3000);

		var url = baseUrl;
		var search = {
			"ident": testData.ident
		}

		request.post(url, function (err, res, result) {

			expect(err).not.to.be.ok();
			expect(res.statusCode).to.be(200);

			var counter = 0;

			if (result.length === 0) {
				done();
			} else {
				result.forEach(function (item) {
					request.del(url + "/" + item._id, function (err2, res2, result2) {
						expect(err2).not.to.be.ok();
						expect(res2.statusCode).to.be(200);
						counter++;
						if (counter === result.length) {
							done();
						}
					});

				});

			}

		}).json(search);

	});


}());

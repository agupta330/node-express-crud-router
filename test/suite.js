(function () {
	"use strict";

	var expect = require('expect.js');
	var fixtures = require("./fixtures.js");
	var logger = require("../lib/logger.js");
	var request = require("request");
	var mongoose = require("mongoose");

	var server;

	var testModelData = {
		name: "TestModel",
		desc: "TestModel description"
	}

	var port = 3333;
	var baseUrl = "http://localhost:3333/test";

	describe('Model creation test.', require("./create-test.js"));


	before(function (done) {

		// this.timeout(3000);

		mongoose.connect('mongodb://localhost/test');

		var app = fixtures.TestApp;
		var TestModel = fixtures.TestModel;
		var TestRouter = fixtures.TestRouter;

		app.use("/test", new TestRouter({
			model: TestModel
		}));

		server = app.listen(port, function () {
			done();
		});

	});



	after(function (done) {

		this.timeout(3000);

		var url = baseUrl;
		var search = {
			"desc": testModelData.desc
		}

		var tasks = [];

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
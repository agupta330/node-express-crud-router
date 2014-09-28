/*global describe,it*/
(function () {
	"use strict";

	var expect = require('expect.js');
	var times = require('../lib/backend/services/times.js');
	var app = require("../lib/app.js");
	var logger = require("../lib/logger.js");
	var request = require("request");

	var server;

	var testCar = {
		name: "TestName",
		number: "TestNumber",
		desc: "TestDesc123"
	}

	var port = 3333;

	var baseUrl = "http://localhost:3333/cars";

	before(function (done) {

		this.timeout(5000);

		server = app.listen(port, function () {
			//logger.debug("Test server listening on port " + port);

			request.put(baseUrl, function (err, res, result) {
				logger.debug(err);
				expect(err).not.to.be.ok();
				expect(res.statusCode).to.be(200);
				done();

			}).json(testCar);


		});
	});

	after(function (done) {

		var url = baseUrl;
		var search = {
			"name": testCar.desc
		}

		request.post(url, function (err, res, result) {

			expect(res.statusCode).to.be(200);

			result.forEach(function (item) {
				request.del(url + "/" + item._id, function (err, res, result) {
					expect(err).not.to.be.ok();
					expect(res.statusCode).to.be(200);
				})
			});

			setTimeout(function () {
				done();
			}, 1900);

		}).json(search);

	});

	describe('Car router module test.', function () {

		it('find', function (done) {

			var url = baseUrl;

			request.get(url, function (err, res, result) {

				//logger.debug("find result: ", result);

				expect(err).not.to.be.ok();
				expect(res.statusCode).to.be(200);
				expect(result).to.be.an("array");

				done();

			}).json();

		});

		it('search', function (done) {

			var obj = testCar;
			obj.name = "MeinTestName123Abc";
			var url = baseUrl;

			request.put(url, function (err, res, result) {

				expect(err).not.to.be.ok();

				var search = {
					name: obj.name
				}

				request.post(baseUrl, function (err, res, result) {

					// logger.debug("search result: ", result);

					expect(err).not.to.be.ok();
					expect(res.statusCode).to.be(200);
					expect(result).to.be.an("array");
					expect(result[0].name).to.be.eql(search.name);

					done();

				}).json(search);


			}).json(obj);


		});


		it('create', function (done) {

			var obj = testCar;
			var url = baseUrl;

			request.put(url, function (err, res, result) {

				//logger.debug("create result: ", result);

				expect(err).not.to.be.ok();
				expect(res.statusCode).to.be(200);
				expect(result._id).to.be.ok();
				expect(result.name).to.eql(obj.name);
				expect(result.number).to.eql(obj.number);
				expect(result.desc).to.eql(obj.desc);

				done();

			}).json(obj);

		});

		it('remove', function (done) {

			var url = baseUrl;

			request.get(url, function (err, res, result) {

				expect(err).not.to.be.ok();
				expect(res.statusCode).to.be(200);

				var id = result[0]._id;
				var urlDel = url + "/" + id;

				request.del(urlDel, function (err2, res2, result2) {

					// logger.debug("RESULT 2: ", result2.model._id);

					expect(err2).not.to.be.ok();
					expect(res2.statusCode).to.be(200);
					expect(result2.model._id).to.be.eql(id);
					expect(result2.deleted).to.be.ok();
					done();

				}).json()

			}).json();

		});

	});

}());
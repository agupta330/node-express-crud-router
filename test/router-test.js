(function () {
	"use strict";

	var expect = require('expect.js');
	var fixtures = require("./fixtures.js");
	var logger = require("./logger.js");
	var request = require("request");
	var mongoose = require("mongoose");
	mongoose.connect('mongodb://localhost/test');

	var server;

	var testModelData = {
		name: "TestModel",
		desc: "TestModel description"
	}

	var port = 3333;
	var baseUrl = "http://localhost:3333/test";

	before(function (done) {

		this.timeout(5000);

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
			}, 2900);

		}).json(search);

	});

	describe('Router module test.', function () {

		it('config - loglevel DEBUG', function (done) {

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

		it('update', function (done) {

			var url = baseUrl;

			request.get(url, function (err, res, result) {

				expect(err).not.to.be.ok();
				expect(res.statusCode).to.be(200);

				var item = result[0];
				var id = item._id;
				var updateData = {};
				updateData.name = "My updated testmodel name";

				request.post(url + "/" + id, function (err, res, result) {

					expect(err).not.to.be.ok();
					expect(res.statusCode).to.be(200);

					expect(result.name).to.be.ok();
					expect(result.name).to.be(updateData.name);

					done();

				}).json(updateData);

			}).json();

		});

		it('find - by id', function (done) {

			var url = baseUrl;

			request.get(url, function (err, res, result) {

				expect(err).not.to.be.ok();
				expect(res.statusCode).to.be(200);

				var item = result[0];
				var id = item._id;

				request.get(url + "/" + id, function (err, res, result) {

					expect(err).not.to.be.ok();
					expect(res.statusCode).to.be(200);

					expect(result._id).to.be.ok();
					expect(result._id).to.be(id);

					done();

				}).json();

			}).json();

		});


		it('find - with defaults', function (done) {

			var url = baseUrl;

			request.get(url, function (err, res, result) {

				expect(err).not.to.be.ok();
				expect(res.statusCode).to.be(200);

				expect(result).to.be.an("array");

				done();

			}).json();

		});

		it('find - with skip', function (done) {

			var url = baseUrl;

			request.put(url, function (err, res, result) {

				expect(err).not.to.be.ok();
				expect(res.statusCode).to.be(200);

				var len = -1;
				request.get(url, function (err, res, result) {

					expect(err).not.to.be.ok();
					expect(res.statusCode).to.be(200);

					var len = result.length;
					expect(len).to.be.above(1);

					request.get(url, function (err, res, result) {

						expect(err).not.to.be.ok();
						expect(res.statusCode).to.be(200);

						var expected = len - 1;
						expect(result.length).to.be(expected);

						done();

					}).qs({
						skip: 1
					}).json();

				}).json();

			}).json(testModelData);

		});

		it('find - with search params', function (done) {

			var url = baseUrl;
			var obj = testModelData;
			obj.name = "MeinTestModel123";

			request.put(url, function (err, res, result) {

				expect(err).not.to.be.ok();
				expect(res.statusCode).to.be(200);

				var search = {
					name: obj.name
				}

				request.post(baseUrl, function (err, res, result) {

					expect(err).not.to.be.ok();
					expect(res.statusCode).to.be(200);

					expect(result).to.be.an("array");
					expect(result[0].name).to.be.eql(search.name);

					done();

				}).json(search);

			}).json(obj);

		});


		it('remove', function (done) {

			var url = baseUrl;

			request.get(url, function (err, res, result) {

				expect(err).not.to.be.ok();
				expect(res.statusCode).to.be(200);

				var id = result[0]._id;

				request.del(url + "/" + id, function (err2, res2, result2) {

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
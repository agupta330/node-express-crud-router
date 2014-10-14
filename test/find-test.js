(function () {
	"use strict";

	var expect = require('expect.js');
	var fixtures = require("./fixtures.js");
	var logger = require("../lib/logger.js");
	var request = require("request");

	var testModelData = fixtures.TestModelData;
	var baseUrl = fixtures.host.getBaseUrl();


	module.exports = function () {

		beforeEach(function (done) {
			request.put(baseUrl, function (err, res, result) {

				expect(err).not.to.be.ok();
				expect(res.statusCode).to.be(200);

				done();

			}).json(testModelData);
		});


		it('#find - by id', function (done) {

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


		it('#find - with defaults', function (done) {

			var url = baseUrl;

			request.get(url, function (err, res, result) {

				expect(err).not.to.be.ok();
				expect(res.statusCode).to.be(200);

				expect(result).to.be.an("array");

				done();

			}).json();

		});

		it('#find - with skip', function (done) {

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

		it('#find - with limit', function (done) {

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

						expect(result.length).to.be(1);

						done();

					}).qs({
						limit: 1
					}).json();

				}).json();

			}).json(testModelData);

		});



		it('#find - with skip and limit', function (done) {

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
					var mainResult = result;

					request.get(url, function (err, res, result) {

						expect(err).not.to.be.ok();
						expect(res.statusCode).to.be(200);

						expect(result.length).to.be(1);
						expect(result[0]._id).to.eql(mainResult[1]._id);

						done();

					}).qs({
						skip: 1,
						limit: 1
					}).json();

				}).json();

			}).json(testModelData);

		});



		it('#find - with search params', function (done) {

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


	};

}());
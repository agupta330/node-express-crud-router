(function () {
	"use strict";

	var express = require("express");
	var bodyParser = require("body-parser");
	var logger = require("./logger.js");
	var mongoose = require("mongoose");

	var app = express();

	app.use(bodyParser.urlencoded({
		extended: false
	}));

	app.use(bodyParser.json());

	app.use(function (err, req, res, next) {
		logger.error(err);
		res.status(500).json({
			statusCode: 500,
			error: err
		});
	});

	exports.TestApp = app;

	var Schema = mongoose.Schema;

	var TestSchema = new Schema({
		name: "string",
		desc: "string",
	});

	exports.TestModel = mongoose.model("TestModel", TestSchema);

	exports.TestRouter = require("../lib/router.js");


}());
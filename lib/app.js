(function () {
	"use strict";

	var express = require("express");
	var serveStatic = require("serve-static");
	var bodyParser = require("body-parser");
	var logger = require("./logger.js");
	var fs = require("fs");
	var path = require("path");
	var mongoose = require("mongoose");

	mongoose.connect('mongodb://localhost/myapp');


	var app = express();
	app.use(bodyParser.urlencoded({
		extended: false
	}));
	app.use(bodyParser.json());

	app.use(function (err, req, res, next) {
		if (err) {
			res.status(500).json({
				error: err
			});
		}
	});

	var dir = "./lib/backend/router";

	fs.readdir(dir, function (err, files) {

		if (err) {
			throw new Error(err);
		}

		files.forEach(function (item) {
			var file = dir + "/" + item;

			//logger.debug("require file : ", file);

			var router = require("." + file);
			app.use(router);

		});
	});


	module.exports = app;

}());
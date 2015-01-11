(function() {
	"use strict";

	var express = require("express");
	var bodyParser = require("body-parser");
	var logger = require("../lib/logger.js");

	var app = express();

	app.set("json spaces", 2);

	app.use(bodyParser.urlencoded({
		extended: false
	}));

	app.use(bodyParser.json());

	app.use(function(err, req, res, next) {
		logger.error(err);
	})

	exports.TestApp = app;

	var ResourceBuilder = require(__dirname + "/../lib/ResourceBuilder.js");

	var r = new ResourceBuilder({
		modelRootFolder: __dirname + '/models',
	})

	app.use("/api", r.router("users"));

	exports.TestModelData = {
		name: "TestModel",
		desc: "TestModel description",
		ident: "TestAbcdef123Qwe"
	}

	function Connection() {
		this.port = 31313;
		this.host = "localhost";
		this.path = "api/users";
		this.getBaseUrl = function() {
			return "http://" + this.host + ":" + this.port + "/" + this.path;
		}
	};

	exports.host = new Connection();


}());

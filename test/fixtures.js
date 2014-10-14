(function () {
	"use strict";

	var express = require("express");
	var bodyParser = require("body-parser");
	var logger = require("../lib/logger.js");
	var mongoose = require("mongoose");

	var app = express();

	app.use(bodyParser.urlencoded({
		extended: false
	}));

	app.use(bodyParser.json());

	exports.TestApp = app;

	var Schema = mongoose.Schema;

	var TestSchema = new Schema({
		name: {
			type: String,
			required: true
		},
		desc: {
			type: String,
			required: true
		},
		ident: {
			type: String,
			default: "abcdef123qwe",
			required: true
		}
	});

	exports.TestModel = mongoose.model("TestModel", TestSchema);

	exports.TestRouter = require("../lib/router.js");

	exports.TestModelData = {
		name: "TestModel",
		desc: "TestModel description",
		ident: "TestAbcdef123Qwe"
	}

	function con() {
		this.port = 31313;
		this.host = "localhost";
		this.path = "test";
		this.getBaseUrl = function () {
			return "http://" + this.host + ":" + this.port + "/" + this.path;
		}
	};

	exports.host = new con();


}());
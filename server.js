(function () {
	"use strict";

	var app = require("./lib/app.js");
	var log = require("./lib/logger.js");

	app.listen(3000, function () {
		log.info("Server listening on port 3000");
	});

	module.exports = app;

}());
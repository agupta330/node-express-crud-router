(function () {
	"use strict";

	var logger = require(__dirname + "/logger.js");
	var bodyParser = require("body-parser");
	var router = require("express").Router();
	var Controller = require("./controller.js");

	function DefaultRouter(controller, name) {


		router.use(bodyParser.urlencoded({
			extended: false
		}));

		router.use(bodyParser.json());

		router.use(isJSONContentType);


		name = name || "model";
		name = name.toLowerCase();

		logger.info("Initializing model:" , "/"+name);

		router.param("id", controller.paramById);

		router.route("/"+name)
			.get(controller.find)
			.put(controller.create)
			.delete(controller.removeAll)
			.post(controller.find);


		router.route("/"+name+"/:id")
			.get(controller.findById)
			.delete(controller.remove)
			.post(controller.update)
			.put(controller.update);

		return router;

	};

	function isJSONContentType(req, res, next) {

		logger.debug("---------- NEW REQUEST ----------");
		logger.debug("URL: ", req.originalUrl);

		var pattern = /PUT|POST/;
		var type = req.method.toUpperCase();
		logger.debug("Request type: ", type);

		var isPutOrPost = pattern.test(type);
		logger.debug("Request is put or post: ", isPutOrPost);

		var isJson = req.is("json");
		logger.debug("Request is json: ", isJson);

		if (isPutOrPost === true && isJson === false) {

			var type = req.get("Content-Type");
			logger.debug("Request content-type is: ", type);

			res.status(400).json({
				code: 400,
				message: "Bad request. Must be Content-Type application/json but is " +
					type
			});

		} else {
			next();
		}

	}

	module.exports = DefaultRouter;


}());

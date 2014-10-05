(function () {
	"use strict";

	var logger = require("./logger.js");

	module.exports = MyRouter;

	function MyRouter(opts) {

		var bodyParser = require("body-parser");
		var router = require("express").Router();
		var Controller = require("./controller.js");

		router.use(bodyParser.urlencoded({
			extended: false
		}));

		router.use(bodyParser.json());

		router.use(isJSONContentType);

		var modelController = new Controller(opts.model);

		router.param("id", modelController.paramById);

		router.route("/config")
			.post(modelController.config)
			.put(modelController.config)

		router.route("/")
			.get(modelController.find)
			.put(modelController.create)
			.post(modelController.find);

		router.route("/:id")
			.get(modelController.findById)
			.delete(modelController.remove)
			.post(modelController.update)
			.put(modelController.update);

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

}());
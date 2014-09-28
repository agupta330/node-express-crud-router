(function () {
	"use strict";

	var router = require("express").Router();

	var routePreffix = "/api";

	router.route(routePreffix + "/1.0/").get(function (req, res, next) {
		// res.format({
		// 	"default": function () {
		// 		res.status(200).json({
		// 			message: "Hello!"
		// 		});
		// 	}
		// });

		res.status(200).json({
			"message": "Hello!"
		});

	});

	module.exports = router;

}());
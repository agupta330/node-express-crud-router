(function () {
	"use strict";

	var Router = require("express").Router();
	var Controller = require("./controller.js");

	module.exports = MyRouter;

	function MyRouter(opts) {

		// var model = opts.model;
		// var controller = new Controller(model);

		var obj = {};
		obj.router = require("express").Router();
		obj.controller = new Controller(opts.model);

		obj.router.param("id", obj.controller.paramById);

		obj.router.route("/")
			.get(obj.controller.find)
			.put(obj.controller.create)
			.post(obj.controller.find);

		obj.router.route("/:id")
			.get(obj.controller.findById)
			.delete(obj.controller.remove);

		return obj.router;

	};

}());
(function () {
	"use strict";

	var Router = require("express").Router();
	var CarController = require("../controller/car-controller.js");

	Router.param("id", CarController.paramById);

	Router.route("/cars")
		.get(CarController.find)
		.put(CarController.create)
		.post(CarController.find);

	Router.route("/cars/:id")
		.get(CarController.findById)
		.delete(CarController.remove);


	module.exports = Router;

}());
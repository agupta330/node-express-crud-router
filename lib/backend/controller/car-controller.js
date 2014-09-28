(function () {
	"use strict";

	var CarModel = require("../model/car-model.js");
	var logger = require("../../logger.js");

	exports.paramById = function (req, res, next, id) {

		CarModel.findById(id).exec(function (err, result) {
			if (err) {
				return next(new Error(err));
			}
			if (!result) {
				return next(new Error("No result available"));
			}
			req.car = result;
			next();
		})

	}

	exports.create = function (req, res, next) {

		//logger.debug("Request CarModel.create(): ", req.body);

		var car = new CarModel(req.body);

		car.save(function (err, model, numberAfftected) {
			if (err) {
				return next(new Error(err));
			}
			res.status(200).json(model);
		});

	}

	exports.remove = function (req, res, next) {

		// logger.debug("Request CarModel.remove()");

		var car = req.car;

		if (!car) {
			return next(new Error("Invalid object to remove"));
		}

		car.remove(function (err) {
			if (err) {
				return next(new Error(err));
			}

			var ret = {
				deleted: true,
				model: car
			};
			res.status(200).json(ret);
		});

	}

	exports.findById = function (req, res, next) {
		if (req.car) {
			res.status(200).json(req.car);
		} else {
			res.status(404).json({
				code: 404,
				message: "Requested object could not be found"
			});
		}

	}

	exports.find = function (req, res, next) {

		var limit = req.query.limit || 25;
		var skip = req.query.limit || 0;
		var search = req.body || null;

		//logger.debug("Request CarModel.find()");

		CarModel.find(search).skip(skip).limit(limit).exec(function (err, result) {
			if (err) {
				return next(new Error(err));
			}
			if (!result) {
				res.status(404).json({
					code: 404,
					message: "No result available"
				});
			} else {
				res.status(200).json(result);
			}

		});

	}

}());
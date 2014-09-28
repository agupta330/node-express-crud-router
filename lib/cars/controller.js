(function () {
	"use strict";

	// var this.model = require("./model.js");
	// var logger = require("../../logger.js");
	// var mongoose = require("mongoose");

	module.exports = Controller;

	function Controller(model) {

		// this.model = mongoose.model(modelName);
		var obj = {};
		obj.model = model;
		obj.paramById = paramById.bind(obj);
		obj.create = create.bind(obj);
		obj.remove = remove.bind(obj);
		obj.findById = findById.bind(obj);
		obj.find = find.bind(obj);
		return obj;

	}

	function count(req, res, next) {
		//TODO impl
	}


	function find(req, res, next) {

		var limit = req.query.limit || 25;
		var skip = req.query.skip || 0;
		var search = req.body || null;

		this.model.find(search).skip(skip).limit(limit).exec(function (err, result) {
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

	function paramById(req, res, next, id) {

		this.model.findById(id).exec(function (err, result) {
			if (err) {
				return next(new Error(err));
			}
			if (!result) {
				return next(new Error("No result available"));
			}
			req.model = result;
			next();
		})

	}

	function create(req, res, next) {

		//logger.debug("Request this.model.create(): ", req.body);

		var model = new this.model(req.body);

		model.save(function (err, model, numberAfftected) {
			if (err) {
				return next(new Error(err));
			}
			res.status(200).json(model);
		});

	}

	function remove(req, res, next) {

		// logger.debug("Request this.model.remove()");

		var model = req.model;

		if (!model) {
			return next(new Error("Invalid object to remove"));
		}

		model.remove(function (err) {
			if (err) {
				return next(new Error(err));
			}

			var ret = {
				deleted: true,
				model: model
			};
			res.status(200).json(ret);
		});

	}

	function findById(req, res, next) {
		if (req.model) {
			res.status(200).json(req.model);
		} else {
			res.status(404).json({
				code: 404,
				message: "Requested object could not be found"
			});
		}

	}



}());
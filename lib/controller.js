(function () {
	"use strict";

	// var this.model = require("./model.js");
	var logger = require("./logger.js");
	// var mongoose = require("mongoose");

	module.exports = Controller;

	function Controller(model) {

		var obj = {};
		obj.model = model;
		obj.paramById = paramById.bind(obj);
		obj.create = create.bind(obj);
		obj.remove = remove.bind(obj);
		obj.removeAll = removeAll.bind(obj);
		obj.findById = findById.bind(obj);
		obj.find = find.bind(obj);
		obj.update = update.bind(obj);
		obj.config = config.bind(obj);
		return obj;

	}

	function paramById(req, res, next, id) {

		logger.debug("...paramById()");

		if (!id) {
			return next(new Error("Requested id is undefined"));
		}

		this.model.findById(id).exec(function (err, result) {

			if (err) {
				return next(new Error(err));
			}

			if (!result) {
				res.status(404).json({
					code: 404,
					message: "No objects found"
				});
			} else {
				req.model = result;
				next();
			}

		});


	};

	function config(req, res, next) {

		var body = req.body;

		if (!body) {
			return next(new Error("Request body is undefined"));
		}

		logger.debug("config(), req.body: ", body);

		var level = body.loglevel || "INFO";
		logger.setLevel(level);

		var ret = {
			loglevel: level
		}

		res.status(200).json(ret);

	}


	function find(req, res, next) {

		var limit = req.query.limit || 25;
		var skip = req.query.skip || 0;
		var search = req.body || null;

		logger.debug("find(), search: ", search);

		this.model.find(search).skip(skip).limit(limit).exec(function (err, result) {
			if (err) {
				return next(new Error(err));
			}
			if (!result) {
				res.status(404).json({
					code: 404,
					message: "No objects found"
				});
			} else {
				res.status(200).json(result);
			}

		});

	};

	function create(req, res, next) {

		var body = req.body;

		logger.debug("create(), body: ", body);

		if (!body) {
			return next(new Error("Request body is not defined"));
		}

		var Model = this.model;
		var newModel = new Model(body);

		logger.debug("New model saved will be ", newModel);

		newModel.save(function (err, model2, numberAfftected) {
			if (err) {
				return next(new Error(err));
			}
			res.status(200).json(model2);
		});

	};

	function update(req, res, next) {

		var body = req.body;
		if (!body) {
			return next(new Error("Request body is undefined"));
		}

		logger.debug("update(), body: ", body);

		var id = req.params.id;
		if (!id) {
			return next(new Error("Request id is undefined"));
		}

		logger.debug("update(), id: ", id);

		var Model = this.model;

		var query = {
			_id: id
		};

		Model.update(query, body, null, function (err, numberAfftected) {

			if (err) {
				return next(new Error(err));
			}

			Model.findById(id).exec(function (err, result) {
				if (err) {
					return next(new Error(err));
				}
				res.status(200).json(result);
			});

		});

	};

	function removeAll(req, res, next) {

		var model = this.model;

		if (!model) {
			return next(new Error("Invalid model object. Can not remove anything"));
		}

		logger.warn("removeAll()");

		model.find().remove(function (err) {

			if (err) {
				return next(new Error(err));
			}

			var ret = {
				deletedAll: true
			};

			res.status(200).json(ret);

		});

	};

	function remove(req, res, next) {

		var model = req.model;

		if (!model) {
			return next(new Error("Invalid object to remove"));
		}

		logger.debug("remove(), model: ", model);

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

	};

	function findById(req, res, next) {

		if (req.model) {

			res.status(200).json(req.model);

		} else {

			res.status(404).json({
				code: 404,
				message: "No objects found"
			});

		}

	};



}());
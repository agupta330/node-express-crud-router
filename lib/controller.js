/**
 * Copyright (c) 2014 by Dennis Ahaus (dennis.ahaus@gmail.com)
 * Licensed under MIT license
 */
(function () {
	"use strict";

	var logger = require("./logger.js");

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
		obj.updateConfig = updateConfig.bind(obj);
		obj.getConfig = getConfig.bind(obj);
		return obj;

	}

	/**
	 * express special function. Attach the model instance
	 * associated with the given model id to the request object.
	 */
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

	/**
	 * Update the model configuration
	 */
	function updateConfig(req, res, next) {

		var body = req.body;

		if (!body) {
			return next(new Error("Request body is undefined"));
		}

		logger.debug("updateConfig(), req.body: ", body);

		var level = body.loglevel || "INFO";
		logger.setLevel(level);

		var ret = {
			loglevel: level
		}

		res.status(200).json(ret);

	}

	/**
	 * Get the current model config
	 */
	function getConfig(req, res, next) {

		var level = logger.level.levelStr

		var config = {
			loglevel: level
		}

		logger.debug("getConfig(), current config is: ", config);

		res.status(200).json(config);

	}


	/**
	 * Find model instances with search critearia.
	 * There are two paramaters which can be used to
	 * limit the output.
	 */
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

	/**
	 * Create a new model instance
	 */
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

	/**
	 * Update the model instance
	 */
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

	/**
	 * Remove (delete) all model instances from persistence layer
	 */
	function removeAll(req, res, next) {

		var model = this.model;

		if (!model) {
			return next(new Error("Invalid model object. Can not remove anything"));
		}

		logger.debug("removeAll() was called by host ", req.ip, " at " + Date.now());

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

	/**
	 * Remove the requested model instance
	 */
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

	/**
	 * Find a model instance by its ID
	 */
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
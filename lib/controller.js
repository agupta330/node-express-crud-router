/**
 * Copyright (c) 2014 by Dennis Ahaus (dennis.ahaus@gmail.com)
 * Licensed under MIT license
 */
(function() {
	"use strict";

	var logger = require("./logger.js");
	var util = require("util");

	var inspect = function(text, obj) {
		var data = util.inspect(obj, {
			showHidden: true,
			depth: null
		});
		logger.debug(text, obj);
	}

	module.exports = Controller;

	function Controller(datasource) {

		this.Model = datasource;

		this.paramById = paramById.bind(this);
		this.create = create.bind(this);
		this.remove = remove.bind(this);
		this.removeAll = removeAll.bind(this);
		this.findById = findById.bind(this);
		this.find = find.bind(this);
		this.update = update.bind(this);

		this.getDataSource = function() {
			return this.Model;
		}

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

		this.Model.findById(id).exec(function(err, result) {

			if (err) {
				return next(new Error(err));
			}

			if (!result) {
				res.status(404).json({
					code: 404,
					message: "Object not found"
				});
			} else {
				req.model = result;
				next();
			}

		});


	};


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

		this.Model.find(search).skip(skip).limit(limit).exec(function(err,
			result) {
			if (err) {
				return next(new Error(err));
			}
			if (!result) {
				res.status(404).json({
					code: 404,
					message: "Object not found"
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

		var Model = this.Model;
		var newModel = new Model(body);

		logger.debug("New model will be ", newModel);

		newModel.save(function(err, resultModel, numberAfftected) {
			if (err) {

				logger.error(err);
				if (err.name === "ValidationError") {
					return res.status(400).json({
						code: 400,
						message: err
					})
				}
				return res.status(500).json({
					code: 500,
					message: JSON.stringify(err)
				})
			}
			logger.debug("New model just saved is: ", resultModel);
			res.status(200).json(resultModel);
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

		var Model = this.Model;

		var query = {
			_id: id
		};

		Model.update(query, body, null, function(err, numberAfftected) {

			if (err) {
				return next(new Error(err));
			}

			Model.findById(id).exec(function(err, result) {
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

		var Model = this.Model;

		if (!Model) {
			return next(new Error("Invalid model object. Can not remove anything"));
		}

		logger.debug("removeAll() was called by host ", req.ip, " at " + Date.now());

		Model.find().remove(function(err) {

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

		model.remove(function(err) {

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

/**
 * Copyright (c) 2014 by Dennis Ahaus (dennis.ahaus@gmail.com)
 * Licensed under MIT license
 */
(function() {
  "use strict";

  class Controller {

    /**
     *
     */
    constructor(model) {
      if (!model) {
        throw new Error("Provided model can not be undefined");
      }

      this._model = model;
    }

    /**
     *
     */
    getModel() {
      return this._model;
    }

    /**
     *
     */
    paramById(req, res, next, id) {

      if (!id) {
        return next(new Error("Requested id is undefined"));
      }

      this.getModel()
        .findById(id)
        .exec(function(err, result) {

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
     *
     */
    find(req, res, next) {

      var limit = req.query.limit || 25;
      var skip = req.query.skip || 0;
      var criteria = req.query.criteria || req.query.criteria || req.query.selection || "{}";
      var sort = req.query.sort;

      // console.log("FILTER:", criteria);
      if (typeof criteria === "string") {
        try {
          criteria = JSON.parse(criteria);
        } catch (err) {
          return next(err);
        }
      }

      var query = this.getModel()
        .find(criteria)
        .skip(skip)
        .limit(limit);

      if (sort != null) {
        query = query.sort(sort);
      }

      query
        .exec(function(err, result) {
          if (err) {
            return next(err);
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
     *
     */
    create(req, res, next) {


      if (!req.body) {
        return next(new Error("Request body is not defined"));
      }

      var Model = this.getModel();
      var newModel = new Model(req.body);

      newModel.save(function(err, resultModel, numberAfftected) {
        if (err) {
          if (err.name === "ValidationError") {
            err.code = 400;
            return next(err);
          }
          return next(err);
        }
        res.status(200).json(resultModel);
      });

    };

    /**
     *
     */
    update(req, res, next) {

      var body = req.body;

      if (!body) {
        return next(new Error("Request body is undefined"));
      }

      var id = req.params.id;

      if (!id) {
        return next(new Error("Request id is undefined"));
      }

      this.getModel()
        .findByIdAndUpdate(id, {
          $set: body
        }, function(err, result) {
          if (err) {
            return next(err);
          }
          res.status(200).json(result);
        });

    };

    /**
     *
     */
    removeAll(req, res, next) {

      this.getModel()
        .remove(function(err) {
          if (err) {
            return next(err);
          }
          res.status(200).json([]);
        });

    };

    /**
     * Remove the requested model instance
     */
    remove(req, res, next) {

      var model = req.model;

      if (!model) {
        return next(new Error("Invalid object to remove"));
      }

      model.remove(function(err) {

        if (err) {
          return next(err);
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
    findById(req, res, next) {

      if (req.model) {

        res.status(200).json(req.model);

      } else {

        res.status(404).json({
          code: 404,
          message: "No objects found"
        });

      }

    };

  }

  module.exports = Controller;

}());

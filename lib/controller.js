/**
 * Copyright (c) 2014 by Dennis Ahaus (dennis.ahaus@gmail.com)
 * Licensed under MIT license
 */
var errors = require('./errors.js');
var IllegalArgumentError = errors.IllegalArgumentError;
var Http404Error = errors.Http404Error;;

class Controller {

  /**
   *
   */
  constructor(model) {

    if (!model) {
      throw new IllegalArgumentError("Provided model can not be undefined")
    }

    this._model = model;
  }

  getModel() {
    return this._model;
  }

  create(data, next) {
    this.getModel().create(data).exec(next);
  };

  findById(id, next) {
    this.getModel().findById(id).exec(next);
  };

  findByCriteria(criteria = {}, options = {}, next) {

    var limit = parseInt(options.limit, 10) || 25;
    var skip = parseInt(options.skip, 10) || 0;
    var sort = options.orderBy || options.orderby || '{}';

    this.getModel().find(criteria).skip(skip).limit(limit).sort(sort).exec(next);

  };

  updateById(id, data, next) {
    this.getModel().findByIdAndUpdate(id, data).exec(next);
  }

  updateByCriteria(criteria, data, next) {
    this.getModel().update(criteria, data, { multi: true }).exec(next);
  }

  removeById(id, next) {
    this.getModel().findByIdAndRemove(id).exec(next);
  }

  removeByCriteria(criteria, next) {
    this.getModel().deleteMany(criteria).exec(next);
  }

}

module.exports = Controller;

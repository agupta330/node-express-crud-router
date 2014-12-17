"use strict";

(function() {

  var Datasource = require(__dirname + "/datasource/datasource.js").MongoDb;
  var Controller = require(__dirname + "/controller.js");
  var Router = require(__dirname + "/router.js");
  var config = require(__dirname + "/../server/config");
  var logger = require(__dirname +"/logger");

  function Model(args) {

    var def = args;
    def.plurals = def.plurals.toLowerCase();

    var properties = def.properties;
    var datasource = new Datasource(properties, def.name);
    var controller = new Controller(datasource);

    var preffix = def.plurals;
    var router = new Router(controller, preffix);

    this.path = function (str) {
      return def.plurals
    }.bind(this);

    this.name = function () {
      return def.name ;
    }.bind(this);

    this.router = function () {
      return router;
    }.bind(this);

    this.description = function () {
      return def.description || "";
    }.bind(this);

  }

  Model.init = function (app) {

    var models = require(__dirname + "/../server/models");

    var api = {};

    models.forEach(function (modelData) {
      var model = new Model(modelData);
      app.use(config.restApiPrefix, model.router());
      api[model.name()] = describe(model);
    })

    app.use(config.restApiPrefix, function (req,res) {
      res.status(200).json(api);
    })

  }

  module.exports = Model;

  function describe(model) {
    var path = config.restApiPrefix + "/" + model.path();
    return {
      path:path.toLowerCase(),
      description:model.description() || ""
    }
  }

}());

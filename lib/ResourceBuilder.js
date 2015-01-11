"use strict";

(function() {

	var datasources = require(__dirname + "/datasources.js");
	var Controller = require(__dirname + "/controller.js");
	var Router = require(__dirname + "/router.js");
	var logger = require(__dirname + "/logger");
	var path = require("path");

	function getDatasourceByName(name) {
		if (name.toLowerCase() === "mongodb") {
			return datasources.MongoDb;
		}
	}

	function ResourceBuilder(args) {

			this.datasourceName = args.datasource;
			this.modelsRootFolder = args.modelRootFolder;

			this.router = function(args) {

				var modelName = args.modelName || args;

				var currentModelRootFolder = path.resolve("" + this.modelsRootFolder,
					"" + modelName);

				var modelSchemaObject = require(path.join(currentModelRootFolder,
					modelName + ".json"));

				var Datasource = getDatasourceByName(modelSchemaObject.datasource);

				var ds = new Datasource(modelSchemaObject.properties, modelName);

				var controller = new Controller(ds);
				var router = new Router(controller, modelName);

				var modelDecorator = require(path.join(currentModelRootFolder,
					modelName +
					".js"));

				modelDecorator(router, ds);

				return router;

			}.bind(this)


		} // end ResourceBuilder


	module.exports = ResourceBuilder;

}());

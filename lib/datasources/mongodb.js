(function() {
	"use strict";


	var mongoose = require("mongoose");
	var Schema = mongoose.Schema;

	function MongoDbDatasource(schemaModel, name) {
		var schema = new Schema(schemaModel);
		return mongoose.model(name, schema);
	}

	module.exports = MongoDbDatasource;

}());

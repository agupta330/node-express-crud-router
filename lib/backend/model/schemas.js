(function () {
	"use strict";

	var mongoose = require("mongoose");
	var Schema = mongoose.Schema;

	var EntitySchema = new Schema({
		name: "string",
		description: "string",
		bookings: []
	});

	exports.Entity = mongoose.model('Entity', EntitySchema);

}());
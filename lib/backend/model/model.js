(function () {
	"use strict";

	var mongoose = require("mongoose");
	var Schema = mongoose.Schema;

	var CarSchema = new Schema({
		name: "string",
		number: "string",
		desc: "string",
		bookings: [],
	});

	module.exports = mongoose.model('Car', CarSchema);

}());
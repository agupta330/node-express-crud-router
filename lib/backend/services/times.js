(function () {
	"use strict";

	var moment = require("moment");
	var utils = require("util");

	module.exports = function (data) {

		return new Times(data);

	}

	function Times(data) {

		var self = this;
		this.target = data;

		this.isOverlappedBy = function (periods, cb) {

			var err = null;
			try {

				periods.forEach(function (p) {
					_validatePeriod(p);
					var data = {
						target: self.target,
						period: p
					};
					p.overlapps = _overlapps(data);
				});

				periods.target = this.target;

			} catch (_err) {
				err = _err;
			}


			if (cb) {
				if (err) {
					cb(err, null);
				} else {
					cb(null, periods);
				}
				return this;
			} else {
				if (err) {
					throw err;
				}
				return periods;
			}
		}
	};


	function _validatePeriod(p) {

		if (!p) {
			throw new Error("Found an invalid period");
		}

		if (!p.start || !_isDate(p.start)) {
			throw new Error("Property 'start' of period '" + utils.inspect(p) +
				"' is not a valid date: ");
		}

		if (!p.end || !_isDate(p.end)) {
			throw new Error("Property 'end' of period '" + utils.inspect(p) +
				"' is not a valid Date");
		}

	}

	function _isDate(date) {

		if (!date) {
			return false;
		};

		var str = Object.prototype.toString.call(date);
		if (str !== "[object Date]") {
			return false;
		}

		if (date.toString() === "Invalid Date") {
			return false;
		}

		return true;
	}

	function _overlapps(obj) {

		var start1 = obj.target.start;
		var end1 = obj.target.end;
		var start2 = obj.period.start;
		var end2 = obj.period.end;

		// 1 >>---s------e---
		// 2 >>---s------e---
		if (moment(start1).isSame(start2) || moment(end1).isSame(end2)) {
			return true;
		}

		// 1 >>---s------e------
		// 2 >>------s------e---
		if (moment(start2).isAfter(start1) && moment(start2).isBefore(end1)) {
			return true;
		}

		// 1 >>------s------e---
		// 2 >>---s------e------
		if (moment(start2).isBefore(start1) && moment(end2).isAfter(start1)) {
			return true;
		}

		return false;
	}

}());
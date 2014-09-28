/*global describe,it*/
(function () {
	"use strict";

	var expect = require('expect.js'),
		times = require('../lib/backend/services/times.js');

	describe('Times module test.', function () {

		it('overlapps() with valid dates', function () {

			// Objektname = new Date(Jahr, Monat, Tag, Stunden, Minuten, Sekunden);

			var periods = []

			var target = {
				start: new Date(2014, 1, 1),
				end: new Date(2014, 2, 1),
			}

			// target: ---s------e------
			// period: ------s------e---
			var date1 = {
				start: new Date(2014, 1, 15),
				end: new Date(2014, 2, 15)
			};
			periods.push(date1);

			// target: ---s------e---
			// period: -----s-e------
			var date2 = {
				start: new Date(2014, 1, 1),
				end: new Date(2014, 1, 12),
			};
			periods.push(date2);

			// target: ---s------e---
			// period: -s-----e------
			var date3 = {
				start: new Date(2013, 12, 15),
				end: new Date(2014, 1, 15),
			};
			periods.push(date3);

			// target: ---s------e----------
			// period: ------------s-e------
			var date4 = {
				start: new Date(2014, 3, 10),
				end: new Date(2014, 3, 12),
			};
			periods.push(date4);

			times(target).isOverlappedBy(periods, function (err, result) {
				expect(err).not.to.be.ok();
				expect(result).to.have.length(periods.length);
				expect(result[0].overlapps).to.be(true);
				expect(result[1].overlapps).to.be(true);
				expect(result[2].overlapps).to.be(true);
				expect(result[3].overlapps).to.be(false);
			});

			var result = times(target).isOverlappedBy(periods);
			expect(result).to.have.length(periods.length);
			expect(result[0].overlapps).to.be(true);
			expect(result[1].overlapps).to.be(true);
			expect(result[2].overlapps).to.be(true);
			expect(result[3].overlapps).to.be(false);

		});


		it('overlapps() with invalid dates', function () {

			// Objektname = new Date(Jahr, Monat, Tag, Stunden, Minuten, Sekunden);

			var periods = []

			var target = {
				start: new Date(2014, 1, 1),
				end: new Date(2014, 2, 1),
			}

			// target: ---s------e------
			// period: ------s------e---
			var date1 = {
				start: new Date(2014, "A", 15),
				end: new Date(2014, 2, 15)
			};
			periods.push(date1);

			// target: ---s------e---
			// period: -----s-e------
			times(target).isOverlappedBy(periods, function (err, result) {
				expect(result).not.to.be.ok();
				expect(err).to.be.ok();
			});


			var fn = times(target).isOverlappedBy;
			expect(fn).withArgs(periods).to.throwException();



		});

	});

}());
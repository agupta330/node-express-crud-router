(function() {
  "use strict";

  var express = require("express");
  var bodyParser = require("body-parser");
  var expect = require('expect');
	var request = require('request');

  var app = express();

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json());

  exports.app = app;

  exports.defaultModelSchemaJson = {
    name: {
      type: "string",
      required: true
    },
    desc: {
      type: "string",
      required: true
    },
		counter: {
			type: "number",
			required: false,
			"default": 1
		},
    ident: {
      type: "string",
      required: true,
      "default": "TestAbcdef123Qwe"
    },
  }

  exports.defaultModelData = {
    name: "TestModel",
    desc: "TestModel description",
    ident: "TestAbcdef123Qwe",
		counter: 1
  }

  exports.port = 31313;
  exports.host = "localhost";
  exports.path = "/api/users";
  exports.baseUrl = "http://" + exports.host + ":" + exports.port + exports.path;

  exports.request = function doRequest(opts) {

    return new Promise(function(resolve, reject) {

      request(opts, function(err, res, result) {

        try {
          expect(err).toNotExist();
          expect(res.statusCode).toBe(200);
          return resolve(result);
        } catch (err) {
					err.response = res
					err.body = result;
          return reject(err);
        }

      });

    });
  }

}());

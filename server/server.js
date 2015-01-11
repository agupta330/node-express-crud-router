(function() {
  "use strict";

  var mongoose = require("mongoose");
  mongoose.connect('mongodb://localhost/test');
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function(callback) {
    console.log("mongoose connection works");
  });

  var express = require("express");
  var config = require(__dirname + "/config");
  var ResourceBuilder = require(__dirname + "/../lib/ResourceBuilder.js");

  var app = express();
  app.set("json spaces", 2);

  var r = new ResourceBuilder({
    modelRootFolder: __dirname + '/models',
  })

  app.use("/api", r.router("users"));

  var port = config.port;
  app.listen(port, function() {
    console.log("Server listen in port %s", port);
  })

}());

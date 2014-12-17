(function() {
  "use strict";

  var express = require("express");
  var config = require(__dirname + "/config");
  var Model = require(__dirname + "/../lib/model.js");

  var app = express();
  app.set("json spaces", 2);

  Model.init(app);

  var port = config.port;
  app.listen(port, function () {
    console.log("Server listen in port %s", port);
  })

}());

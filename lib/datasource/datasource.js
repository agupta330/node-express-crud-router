(function() {
  "use strict";

  var mongoose = require("mongoose");
  var Schema = mongoose.Schema;

  mongoose.connect('mongodb://localhost/test');
  mongoose.set("debug", false);


  function MongoDbDatasource(schema, name) {
    var _schema =  new Schema(schema);
    return mongoose.model(name, _schema);
  }

  exports.MongoDb = MongoDbDatasource;

}());

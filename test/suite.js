(function() {
  "use strict";

  var expect = require('expect');
  var fixtures = require("./fixtures.js");
  var request = require("request");
  var mongoose = require("mongoose");
  var Schema = require('mongoose').Schema;
  var RouterFactory = require("../index.js").RouterFactory;
  var S = require('string');

  var server;

  var defaultModelData = fixtures.defaultModelData;
  var baseUrl = fixtures.baseUrl;
  var port = fixtures.port;


  describe('Model creation (create)', require("./tests/create.js"));
  describe('Model selection (read)', require("./tests/read.js"));
  describe('Model updateting (update)', require("./tests/update.js"));
  describe('Model deletion (delete)', require("./tests/delete.js"));


  before(function(done) {

    mongoose.set("debug", false);

    var db = mongoose.connection;

    db.on('error', function(err) {
      console.error(err);
      done(err);
    });

    mongoose.connect('mongodb://localhost/node-express-crud-router-test');

    var userSchema = new Schema(fixtures.defaultModelSchemaJson);
    userSchema
      .virtual("id")
      .get(function() {
        return this._id;
      })

    var userModel = mongoose.model("user", userSchema);
    var userRouter = RouterFactory.create({
      path: "users",
      model: userModel
    });

    var app = fixtures.app;

    app.use("/api", userRouter);

    app.use(function(err, req, res, next) {

      // console.error("----------------- EXPRESS ERROR ---------------");
      // console.error("Express error: ", err.message);
      // console.error("Express error stack: ", err.stack);
      // console.error("Express error stack: ", err.name);
      // console.error("-----------------------------------------------");

      var code = err.code || 500;

      if (S(err.message).startsWith("CastError")) {
        code = 400;
      }
      res
        .status(code)
        .json({
          code: code,
          message: err.toString()
        });
    });

    new Promise(function(resolve) {
        server = app.listen(port, function() {
          resolve();
        });

      })
      .then(function() {
        return fixtures
          .request({
            url: fixtures.baseUrl,
            method: "delete",
            json: true
          })
      })
      .then(function() {
        done();
      })
      .catch(function(err) {
        done(err);
      })

  });


  after(function(done) {

    this.timeout(3000);

    fixtures
      .request({
        url: fixtures.baseUrl,
        method: "delete",
        json: true
      })
      .then(function(result) {
        expect(result).toEqual([]);
      })
      .then(function() {
        exit(done);
      })
      .catch(function(err) {
        exit(done, err);
      })

  });

  function exit(done, err) {
    mongoose.disconnect();
    server.close();
    if (err) return done(err);
    done();
  }


}());

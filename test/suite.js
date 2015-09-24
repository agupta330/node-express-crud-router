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
  describe('Model deletion (delete)', require("./tests/delete.js"));
  // describe('Model update', require("./tests/update-test.js"));


  before(function(done) {

    mongoose.set("debug", false);

    var db = mongoose.connection;

    db.on('error', function(err) {
      console.error(err);
      done(err);
    });

    mongoose.connect('mongodb://localhost/test');

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


    server = app.listen(port, function() {
      done();
    });

  });


  after(function(done) {

    this.timeout(3000);

    var opts = {
      url: fixtures.baseUrl,
      method: "get",
      qs: {
        filter: {
          "ident": defaultModelData.ident
        }
      },
      json: true
    }

    request(opts, function(err, res, result) {

      expect(err).toNotExist("Expect request error to not exist");
      expect(res.statusCode).toBe(200, "Expect http status code to be 200 but was " + res.statusCode);
      expect(result).toBeAn("array", "Expect response result to be an array but was: " + (typeof result));

      var counter = 0;

      if (result.length === 0) {
        exit(done);
      } else {
        result.forEach(function(item) {
          var url = opts.url + "/" + item._id;
          request.del(url, function(err2, res2, result2) {
            expect(err2).toNotExist("Error while request to delete single item");
            expect(res2.statusCode).toBe(200);
            counter++;
            if (counter === result.length) {
              exit(done);
            }
          });

        });

      }

    });

  });

  function exit(done) {
    mongoose.disconnect();
    server.close();
    done();
  }


}());

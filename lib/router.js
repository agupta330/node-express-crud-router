(function() {
  "use strict";

  var bodyParser = require("body-parser");
  var Controller = require("./controller.js");

  module.exports = Router;

  function Router(name, controller, fnBefore, fnAfter) {

    var router = require("express").Router();

    if (fnBefore && typeof fnBefore === "function") {
      fnBefore(name, controller, router);
    }

    // router.param("id",function (req, res, next, id) {
    //   controller.paramById(req, res, next, id);
    // });

    router
      .route("/" + name)
      .get(function(req, res, next) {
        controller.find(req, res, next);
      })
      .put(function(req, res, next) {
        if (req.query.criteria != null) {
          controller.update(req, res, next);
        }else{
          controller.create(req, res, next);
        }
      })
      .delete(function(req, res, next) {
        controller.removeAll(req, res, next);
      })
      .post(function(req, res, next) {
        controller.create(req, res, next);
      });


    router
      .route("/" + name + "/:id")
      .get(function(req, res, next) {
        controller.findById(req, res, next);
      })
      .delete(function(req, res, next) {
        controller.remove(req, res, next);
      })
      .post(function(req, res, next) {
        controller.update(req, res, next);
      })
      .put(function(req, res, next) {
        controller.update(req, res, next);
      });

    if (fnAfter && typeof fnAfter === "function") {
      fnAfter(name, controller, router);
    }

    return router;

  };

}());

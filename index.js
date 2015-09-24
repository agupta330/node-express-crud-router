(function() {
  'use strict';

  var Controller = require('./lib/controller.js');
  var Router = require('./lib/router.js');

  function create(opts) {
    var controller = new Controller(opts.model);
    var router = new Router(opts.path, controller, opts.before, opts.after);
    return router;
  }

  exports.Controller = Controller
  exports.Router = Router
  exports.RouterFactory = {
    create: create
  };

}());

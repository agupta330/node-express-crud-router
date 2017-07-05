
class RouteBuilder {

  constructor(path, controller, router) {
    this._path = path;
    this._controller = controller;
    this._router = router;
  }

  build() {

    this._router.param(':id', (id, req, res, next) => {
      req.id = id;
      next();
    })

    this._router
      .route(this._path)
      .get((req, res, next) => {
        this._controller.find(req, res, next);
      })
      .put((req, res, next) => {
        if (req.query.criteria != null) {
          this._controller.update(req, res, next);
        } else {
          this._controller.create(req, res, next);
        }
      })
      .delete((req, res, next) => {
        this._controller.removeAll(req, res, next);
      })
      .post((req, res, next) => {
        this._controller.create(req, res, next);
      });


    this._router
      .route(this._path + '/:id')
      .get((req, res, next) => {
        this._controller.findById(req, res, next);
      })
      .delete((req, res, next) => {
        this._controller.remove(req, res, next);
      })
      .post((req, res, next) => {
        this._controller.update(req, res, next);
      })
      .put((req, res, next) => {
        this._controller.update(req, res, next);
      });

    return this;

  };

}

module.exports = RouteBuilder;

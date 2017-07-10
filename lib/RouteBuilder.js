
class RouteBuilder {

  constructor(path, controller, router) {
    this._path = path;
    this._controller = controller;
    this._router = router;
  }

  build() {

    this._router.param('id', (req, res, next, id) => {
      req.id = id;
      next();
    })

    this._router
      .route(this._path)
      .get((req, res, next) => {
        const criteria = req.query.criteria;
        this._controller.findByCriteria(criteria, undefined, (error, result) => {
          res.status(200).json(result);
        });
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
        const data = req.body;
        this._controller.create(data, (error, result) => {
          res.status(201).send(result);
        });
      });


    this._router
      .route(this._path + '/:id')
      .get((req, res, next) => {
        const id = req.id;
        this._controller.findById(id, (error, result) => {
          res.status(200).json(result);
        });
      })
      .delete((req, res, next) => {
        this._controller.remove(req, res, next);
      })
      .post((req, res, next) => {
        this._controller.update(req, res, next);
      })
      .put((req, res, next) => {
        const id = req.id;
        const data = req.body;
        this._controller.updateById(id, data, (error, result) => {
          res.status(200).json(result);
        });
      });

    return this._router;

  };

}

module.exports = RouteBuilder;

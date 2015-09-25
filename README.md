# A node.js express generic crud router / controller

[![Build status](https://travis-ci.org/DennisAhaus/node-express-crud-router.svg)](https://travis-ci.org/DennisAhaus/node-express-crud-router)

![Dependencies](https://david-dm.org/DennisAhaus/node-express-crud-router.svg)

## Install

`npm install node-express-crud-router`

## Getting started
### Create a crud router
We use mongoose schema as model but you can also use another model definition as well. We will refer to that later on.

```js
var Schema = require('mongoose').Schema;
var RouterFactory = require('node-express-crud-router').RouterFactory;

// Connect to the mongodb
// ... mongoose.connect(...)...

// Create the schema
var userSchema = new Schema({... Your schema definition here...});

// Create the correspondig model
var userModel = mongoose.model("user", userSchema);

// Create the express crud router
var userRouter = RouterFactory.create({
  path: "users",
  model: userModel
});

var app = require('express')();
app.use("/api", userRouter);
// Now http://server:port/api/users is available
```

### RouterFactory.create(opts);

```js
var opts = {
  path: //The http url routing path valid for this router
  model: // Model used by the controller to execute the request
  before: // function((path, controller, router){...}
  after: // function(path, controller, router){...}
}
```

> The `before` and `after` options are called before creating the router and after creating the router. Here you can intercept the router/controller creation process;

The default router is expecting a defined api on the model. This api is derived from mongoose model api.

### Expected model api
Since this implementation is heaviliy influenced by mongoose project (and was intended to be used with mongodb at first time) we use that api as default. But you welcome to implement your own model api where you can delegate the operations to another persistence api. here is the api your model have to implement:

```js

// Find single model by id
model
  .findById(id)
  .exec(function (err, result) {

  })

// Find models by criteria with limit and skip options
model
  .find({...})
  .sort({...})
  .skip(int)
  .limit(int)
  .exec(function (err, result) {

  })

// Create new model object and persist model
new model({data})
 .save(function (err, result) {

 })

// Update single model data
model
  .findByIdAndUpdate(id,
    {update data},
    function(err, result) {

    })

// Remove all models
model
  .remove(function(err) {

  })

// Remove single model found by id
model.findById(id,
    function (err, result) {
      result.remove(function (err) {

      })
    })
```

If you provide such a model you can use your own operations on crud request to the router.

### REST API
#### All models: `http://yourServer:port/api/YourModelName/[?skip=<int>&limit=<int>&criteria=<JSON>&sort=<JSON>]`
--> GET: Get list of available models
- skip: skips <int> models from the top of the result list. Default is 0
- limit: limits the amount of retruning models to <limit>. Default is 25
- criteria: criteria is a json doc filter the result with a query
- sort: sorts the result output by given json doc criteria
- Returns an array of available models

--> PUT/POST: Create new model
- Returns the created model
- If an errors occurs returns with http 4XX or 5XX with error message

--> DELETE: Deletes all available models
- Returns an empty array on success

#### Single model:  `http://yourServer:port/YourModel/<model-id>`
--> GET: Get the referenced model

--> DELETE: Delete the referenced model
- Return the model with new property `{deleted:true}`

--> PUT/POST: Update the referenced model
- Returns the updated model

### Usage examples
`GET http://server:port/modelName`
- Returns JSON [{<your model>}, {<your model>}, ...]

`GET http://server:port/modelName?skip=10&limit=5`
- Returns JSON [{<your model>}, {<your model>}, ...]. The first 10 items will be skipped (not part of the result) and only 5 items will be returned. This also depends on the amount of available data. If there are only 3 items in database [] will be returned because of skip parameter which will skip the first 10 items.

`GET http://server:port/modelName/<modelId>`
- Returns JSON {<your model>}

`DELETE http://server:port/modelName/<modelId>`
- Returns JSON {<your model>, "deleted":"true"}

`POST/PUT http://server:port/modelName/<modelId>`
- body: {new data}
- Returns JSON {<your updated model with new data>}

## Testing
`npm test`

> Before running the test you have to start a mongodb on standard port

## Contributing
New contributors are welcome. If you have any feater requests or bugs, please put that on github project issues.

## Maintainers
- Dennis Ahaus (dennisahaus.github.io)

## License
Copyright (c) 2015 Licensed under the MIT license. Other dependency modules may have other licenses. See license file

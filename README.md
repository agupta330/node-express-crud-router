# A node.js express generic crud router / controller
[![Build status](https://travis-ci.org/DennisAhaus/node-express-crud-router.svg?branch=master)](https://travis-ci.org/DennisAhaus/node-express-crud-router)

![Dependencies](https://david-dm.org/DennisAhaus/node-express-crud-router.svg)

## Install
`npm install node-express-crud-router`

## Issues and enhancements
Please open an issue for bugs and/or enhancement requests here [https://github.com/DennisAhaus/node-express-crud-router/issues](https://github.com/DennisAhaus/node-express-crud-router/issues).

As much issues we get as much we can improve this implementation.

### Roadmap
Please have a look at [https://github.com/DennisAhaus/node-express-crud-router/milestones](https://github.com/DennisAhaus/node-express-crud-router/milestones) to see the upcoming roadmap/milestones

## Getting started
### Create a crud router
We use mongoose schema as model but you can also use another model definition as well. We will refer to that later on.

```js

// Create the model ... We use mongoose/mongodb model here
// But you can also implment your own model if you want
var userSchema = new require('mongoose').Schema({... Your schema definition here...});
var userModel = mongoose.model("user", userSchema);

// Create the crud router
var RouterFactory = require('node-express-crud-router').RouterFactory;
var userRouter = RouterFactory.create({
  path: "users",
  model: userModel
});

// Add router to your express app
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

## REST API
### Url schema

```js
http://yourServer:port/api/<YourModelName>/<ModelId>?skip=<int>&limit=<int>&criteria=<JSON>&sort=<JSON>
```

#### Url query parameters
`skip=<int>`

Skips <int> models from the top of the result list.

Example:

```js
http://yourServer:port/api/yourModelName?skip=5
```

`limit=<int>`

Limits the amount of returning models to  <int>.

Example:

```js
http://yourServer:port/api/yourModelName?limit=5
```

`criteria=<JSON>`

Provide a json object which will be used as selection condition (like where clause).

Example:

```js
http://yourServer:port/api/yourModelName?criteria={price:{'$gt':25}}
```

`sort=<JSON>`

Provide a json object which will be used as projection like sql-where clause).

Example:

```js
http://yourServer:port/api/yourModelName?sort={price:'desc'}
```

> Please beware of the syntax. The criteria and sort syntax depends an the persistance layer / controller / model combination you use. The syntax used hereis the default for mongodb usage.

### HTTP Verbs
All operations will return http status 200 on success. If there is any error we return http status 4XX / 5XX and an error message body with error explanation.

#### GET /modelName
- Criteria, sort, limit and skip parameters can be used
- Returns an array of available models

Example

```js
GET http://server:port/modelName

// Returns
[
  {your model 1},
  {your model 2},
  // ...
]
```

#### POST /modelName
- Creates (persists) the provided http body
- Returns the persisted model object with new id property assigned

Example

```js
POST http://server:port/modelName
{'name':'test'}

// Returns
{
  _id: ..., // in case of mongodb usage
  name: 'test'
}
```

#### PUT /modelName?criteria=&lt;JSON&gt;
- Updates all entities found by criteria (bulk update)
- Returns the number of affected entities

Example

```js
PUT http://server:port/modelName?criteria=<JSON>
{'name':'test'}

// Returns
{
  numberAffected: ...
}
```

#### DELETE /model
- Deletes all available models
- Returns number of affected entities

Example

```js
DELETE http://server:port/modelName

// Returns
{
  numberAffected: ...
}
```

#### DELETE /model?criteria=&lt;JSON&gt;
- Deletes all available models selected by criteria (bulk delete)
- Returns number of affected entities

Example

```js
DELETE http://server:port/modelName

// Returns
{
  numberAffected: ...
}
```

------

#### GET /modelName/modelId
- Returns single model JSON object referenced by the modelId

Example

```js
GET http://server:port/modelName/modelId

// Returns
{your model referenced by id}
```

#### DELETE /modelName/modelId
- Deletes single model referenced by modelId
- Returns following json object

Example

```js
DELETE http://server:port/modelName/modelId

// Returns
{
  delete: true,
  model: {deleted model object}
}
```

#### PUT,POST /modelName/modelId
- Updates the referenced model
- Returns the updated model

Example:

```js
POST http://server:port/api/modelName/modelId
{'name':'test123'}

// Returns
{
  // ...,
  name: 'test123'
}
```

### Additional usage examples
`GET http://server:port/modelName?skip=10&limit=5`
- Returns JSON [{<your model>}, {<your model>}, ...]. The first 10 items will be skipped (not part of the result) and only 5 items will be returned. This also depends on the amount of available data. If there are only 3 items in database [] will be returned because of skip parameter which will skip the first 10 items.

### Implement your own model
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

// Create new model object and persist
model
  .create({data},function (err, result) {

 })

// Update single model data
model
  .findByIdAndUpdate(id,{update data})
    .exec(function(err, result) {

    })

// Update bulk data
model
  .update({criteria},{update data}, {options}) // options: {multi: true}
    .exec(function(err, result) {

    })

// Remove all models or by selection criteria (bulk delete)
model
  .remove(null || <JSON criteria>)
  .exec(function(err) {

  })

// Remove single model found by id
model.findByIdAndRemove(id)
    .exec(function (err, removedDoc) {

    })
```

If you provide such a model you can use your own operations on crud requests to the router.

## Testing
`npm test`

> Before running the test you have to start a mongodb on standard port. This will fixed in future releases

## Contributing
New contributors are welcome. If you have any further requests, bugs or ideas please put that on github project issues. Pull requests are welcome.

## Maintainers
Dennis Ahaus (dennisahaus.github.io)

## License
Copyright (c) 2015 Licensed under the MIT license. Other dependency modules may have other licenses. See license file

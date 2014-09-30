> The best module ever.


## Install

npm: Install the module with: `express-mongodb-crud`

## Getting started

First you have to install node.js and mongodb. After adding the router
to express you can use a new default rest based api:

### REST API

* http://yourServer:port/YourModel[?skip=&lt;int&gt;&limit=&lt;int&gt;]
 * GET --> Get list of available models
   * skip param skips <int> models from the top of the result list
   * skip default is 0
   * limit param limits <int> models from the bottom of the result list
   * limit default is 25
   * Returns an array of available models
 * PUT --> Create new model
   * Returns the created model
 * POST --> Search with criterias
   * HTTP BODY: {<mongoose search criteria>}
   * Returns the matching models

* http://yourServer:port/YourModel/<model-id>
 * GET --> Get the referenced model
 * DELETE --> Delete the referenced model
 * POST --> Update the referenced model
 * PUT --> Update the referenced model

## Usage

```js

var express = require('express');
var mongoose = require('mongoose');

var app = express();
var Schema = mongoose.Schema;
var MySchema = new Schema({
  name: "string",
  desc: "string",
});

var MyModel = mongoose.model("MyModel", MySchema);
var MyRouter = require('express-mongodb-crud');
app.use("/MyModel", new MyRouter({
  model: MyModel
}));

app.listen(3000, function () {
  done();
});

```

After starting the server the rest interface will be available.

## Contributing

* Dennis Ahaus
* New contributors are welcome


## License

Copyright (c) 2014
Licensed under the MIT license.

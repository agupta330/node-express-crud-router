> The best module ever.


## Install

`npm install https://github.com/DennisAhaus/express-mongodb-crud --save`

## Getting started

First you have to install node.js and mongodb. After adding the router
to express (expressjs.com) you can use the rest based CRUD api.

## Usage

```js

// import requirements
var express = require('express');
var mongoose = require('mongoose');

// create express server
var app = express();

// create the model
var Schema = mongoose.Schema;
var MySchema = new Schema({
  name: "string",
  desc: "string",
});
var MyModel = mongoose.model("MyModel", MySchema);

// create the crud router and add to express app
var MyRouter = require('express-mongodb-crud');
app.use("/MyModel", new MyRouter({
  model: MyModel
}));

app.listen(3000, function () {
  done();
});

```

After starting the server the rest interface will be available with url
http://localhost:3000/MyModel.


### REST API

* http://yourServer:port/YourModel/[?skip=&lt;int&gt;&limit=&lt;int&gt;]
  * GET --> Get list of available models
    * skip param skips <int> models from the top of the result list
    * skip default is 0
    * limit param limits <int> models from the bottom of the result list
    * limit default is 25
    * Returns an array of available models

  * PUT --> Create new model
    * Returns the created model

  * POST --> Search with criterias
    * HTTP BODY: {&lt;mongoose search criteria&gt;}
    * Returns the matching models

* http://yourServer:port/YourModel/<model-id>
  * GET --> Get the referenced model
  * DELETE --> Delete the referenced model
  * POST --> Update the referenced model
  * PUT --> Update the referenced model

## Contributing

New contributors are welcome. Just send an email.

## Maintainers

* Dennis Ahaus (dennis.ahaus.github.io)


## License

Copyright (c) 2014
Licensed under the MIT license.

https://github.com/DennisAhaus/express-mongodb-crud/LICENSE.md

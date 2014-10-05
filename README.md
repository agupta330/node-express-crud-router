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
   * HTTP BODY: {<mongoose search criteria>}
   * Returns the matching models

* http://yourServer:port/YourModel/<model-id>
 * GET --> Get the referenced model
 * DELETE --> Delete the referenced model
 * POST --> Update the referenced model
 * PUT --> Update the referenced model

## Contributing

* Dennis Ahaus
* New contributors are welcome


## License

Copyright (c) 2014
Licensed under the MIT license.

License

(The MIT License)

Copyright (c) by Dennis Ahaus <dennis.ahaus@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the 'Software'), to deal in the Software without restriction, including without
limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

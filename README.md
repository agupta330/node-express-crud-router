An express-mongodb-CRUD (create-read-update-delete) generic router

Install
-------

Latest stable version:<br>`npm install https://github.com/DennisAhaus/express-mongodb-crud/tarball/master --save`

Selected version: <br>`npm install https://github.com/DennisAhaus/express-mongodb-crud/tarball/[version] --save`<br> Example: https://github.com/DennisAhaus/express-mongodb-crud/tarball/0.0.1<br> > For the list of available versions see <br> https://github.com/DennisAhaus/express-mongodb-crud/releases

Getting started
---------------

First you have to install node.js and mongodb. After adding the router to express (expressjs.com) you can use the rest based CRUD api.

### Usage

#### Create model data:

Create a new folder where your model can be exist in. Create a subfolder yourModelName. In that sub folder create yourModel.js and a yourModel.json.

Your model.json shoulf contain the Schema definition:

```js
{
  name: {
    type String,
    required:true
    }
}
```

The yourModel.js should export a function like this:

```js
module.exports = funtion(router, model){
  //...
}


```

The express router and the datasource is injected. For a mongodb datasoure the injected model will be the original mongoose model.

```js

// import requirements
var express = require('express');
var mongoose = require('mongoose');

// create express server
var app = express();

// Create the crud router and give the model root
// folder you have created before. The root folder here
// is that folder which contains you models
// folder name.
var Resource = require('express-mongodb-crud');
var resource = new Resource({
  modelRootFolder: __dirname + '/models'
})

// Add the resource router to express app
app.use("/api", resource.router("yourModelName"));


app.listen(3000, function () {
  done();
});

```

After starting the server the rest interface will be available with url http://localhost:3000/api/YourModelname.

### REST API

-	`http://yourServer:port/api/YourModelName/[?skip=<int>&limit=<int>]`

	-	GET --> Get list of available models

		-	skip param skips <int> models from the top of the result list
		-	skip default is 0
		-	limit param limits <int> models from the bottom of the result list
			-	limit default is 25
			-	Returns an array of available models

	-	PUT --> Create new model

		-	Returns the created model

	-	POST --> Search with criterias

		-	HTTP BODY: {&lt;mongoose search criteria&gt;\}

		-	Returns the matching models

	-	DELETE --> Delete all available models

-	`http://yourServer:port/YourModel/<model-id>`

	-	GET --> Get the referenced model
	-	DELETE --> Delete the referenced model
	-	POST --> Update the referenced model
	-	PUT --> Update the referenced model

### API usage examples

-	`GET http://server:port/modelName`

	-	returns JSON [{&lt;your model&gt;}, {&lt;your model&gt;}, ...]

-	`GET http://server:port/modelName?skip=10&limit=5`

	-	returns JSON [{&lt;your model&gt;}, {&lt;your model&gt;}, ...]. The first 10 items will be skipped (not part of the result) and only 5 items will be returned. This also depends on the amount of available data. If there are only 3 items in database [] will be returned because of skipping parameter will skip the first 10 items.

-	`GET http://server:port/modelName/<modelId>`

	-	returns JSON {&lt;your model&gt;\}

-	`DELETE http://server:port/modelName/<modelId>`

	-	returns JSON {&lt;your model&gt;, "deleted":"true"}

-	`POST http://server:port/modelName/<modelId>` body: {new data}

	-	returns JSON {&lt;your model with new data&gt;\}

-	`POST http://server:port/modelName/config` body: {loglevel:"DEBUG"}

	-	returns JSON {loglevel:"DEBUG"}, updates the model configuration

Testing
-------

`npm test` with mocha

Contributing
------------

New contributors are welcome.

Maintainers
-----------

-	Dennis Ahaus (dennisahaus.github.io)

Change log
----------

-	0.1.0

	-	Remove config model
	-	Create new router (ResourceBuilder) API
	-	Now you have to create the models by declaration
	-	The router and the model are injected in yourModel.js. Here you are able to create custom methods

-	0.0.2

	-	Fix issue#1 https://github.com/DennisAhaus/express-mongodb-crud/issues/1
	-	Create new test lib struc for better maintainence of tests

-	0.0.1

	-	Initial release

Roadmap
-------

-	Create API inspectacle api for browser based resources

License
-------

Copyright (c) 2014 Licensed under the MIT license.

https://github.com/DennisAhaus/express-mongodb-crud/blob/master/LICENSE.md

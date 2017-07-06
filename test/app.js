
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Controller = require('../index').Controller;
const DummyModel = require('./DummyModel');
const RouteBuilder = require('../index').RouteBuilder;

const model = new DummyModel();
const controller = new Controller(model);
new RouteBuilder('/api/entities', controller, router).build();

const app = express();
app.use(bodyParser.json());
app.use(router);

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message,
            stacktrace: error.stack
        }
    })
})
app.model = model;

module.exports = app;
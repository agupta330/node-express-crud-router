(function() {
  "use strict";

  var expect = require('expect');
  var fixtures = require("../fixtures.js");
  var supertest = require('supertest');
  var us = require('underscore');

  var defaultModelData = fixtures.defaultModelData;
  var baseUrl = fixtures.baseUrl;
  var currentDocument;


  module.exports = function() {

    beforeEach(function(done) {

      supertest(fixtures.app)
        .post('/api/users')
        .expect(200)
        .expect(function(res) {
          currentDocument = res.body;
        })
        .send(defaultModelData)
        .end(function(err, res) {
          done(err);
        });

    });


    it(' - should update with valid data', function(done) {

      var updateData = {};
      updateData.name = "My updated testmodel name";

      var url = "/api/users/" + currentDocument._id;

      supertest(fixtures.app)
        .put(url)
        .expect(200)
        .expect(function(res) {
          var result = res.body;
          expect(result._id).toBe(currentDocument._id);
          expect(result.desc).toBe(currentDocument.desc);
          expect(result.ident).toBe(currentDocument.ident);
          expect(result.name).toBe(updateData.name);
        })
        .send(updateData)
        .end(function(err, res) {
          done(err);
        });

    });

    it(' - should execute bulk update with returning numberAffected', function(done) {

      var removeAll = supertest(fixtures.app)
        .delete('/api/users')
        .expect(200);

      var data1 = us.clone(defaultModelData);
      data1.counter = 1;
      var add1 = supertest(fixtures.app)
        .post('/api/users')
        .expect(200)
        .send(data1);

      var data2 = us.clone(defaultModelData);
      data2.counter = 2;
      var add2 = supertest(fixtures.app)
        .post('/api/users')
        .expect(200)
        .send(data2);

      var data3 = us.clone(defaultModelData);
      data3.counter = 2;
      var add3 = supertest(fixtures.app)
        .post('/api/users')
        .expect(200)
        .send(data3);

      var getBeforeUpdate = supertest(fixtures.app)
        .get('/api/users')
        .expect(200)
        .expect(function(res) {
          expect(res.body.length).toBe(3);
          expect(res.body[0].counter).toBe(1);
          expect(res.body[1].counter).toBe(2);
          expect(res.body[2].counter).toBe(2);
        })

      var criteria = {
        counter: 2
      }

      var doUpdate = supertest(fixtures.app)
        .put('/api/users?criteria=' + JSON.stringify(criteria))
        .expect(200, {
          numberAffected: 2
        })
        .send({
          counter: 1234
        });

      var getAfterUpdate = supertest(fixtures.app)
        .get('/api/users')
        .expect(200)
        .expect(function(res) {
          expect(res.body.length).toBe(3);
          expect(res.body[0].counter).toBe(1);
          expect(res.body[1].counter).toBe(1234);
          expect(res.body[2].counter).toBe(1234);
        })

      removeAll.end(function(err0) {
        add1.end(function(err1) {
          add2.end(function(err2) {
            add3.end(function(err3) {
              getBeforeUpdate.end(function(err4) {
                doUpdate.end(function(err5) {
                  getAfterUpdate.end(function(err6) {
                    done(err0 || err1 || err2 || err3 || err4 || err5 || err6);
                  })
                })
              })
            })
          })
        })
      })


    });

  };

}());

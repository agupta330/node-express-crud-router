(function() {
  "use strict";

  var expect = require('expect');
  var fixtures = require("../fixtures.js");
  var us = require('underscore');
  var supertest = require('supertest');

  var defaultModelData = fixtures.defaultModelData;
  var currentDocument;


  module.exports = function() {

    beforeEach(function(done) {

      supertest(fixtures.app)
        .put("/api/users")
        .expect(200)
        .send(defaultModelData)
        .end(function(err, res) {
          expect(res.body._id).toExist();
          currentDocument = res.body;
          done(err);
        });


    });


    it(' - should return single document by its id', function(done) {

      supertest(fixtures.app)
        .get("/api/users/" + currentDocument._id)
        .expect(200, currentDocument)
        .end(function(err, res) {
          done(err);
        });

    });


    it(' - should return documents by criteria ', function(done) {

      var url = "/api/users/?criteria=" + JSON.stringify({
        _id: currentDocument._id
      });

      supertest(fixtures.app)
        .get(url)
        .expect(200, [currentDocument])
        .end(function(err, res) {
          done(err);
        });

    });

    it(' - should return documents in different sort orders', function(done) {

      var deleteAll = supertest(fixtures.app)
        .delete('/api/users')
        .expect(200)

      var data1 = us.clone(defaultModelData);

      data1.counter = 888;
      var add1 = supertest(fixtures.app)
        .post('/api/users')
        .expect(200)
        .send(data1)


      var data2 = us.clone(defaultModelData);

      data2.counter = 999;
      var add2 = supertest(fixtures.app)
        .post('/api/users')
        .expect(200)
        .send(data2)

      var sort1Param = {
        counter: 'asc'
      };

      var sort1 = supertest(fixtures.app)
        .get("/api/users/?sort=" + JSON.stringify(sort1Param))
        .expect(200)
        .expect(function(res) {
          expect(res.body[0].counter).toBe(888);
        })


      var sort2Param = {
        counter: 'desc'
      };

      var sort2 = supertest(fixtures.app)
        .get("/api/users/?sort=" + JSON.stringify(sort2Param))
        .expect(200)
        .expect(function(res) {
          expect(res.body[0].counter).toBe(999);
        })

      deleteAll.end(function(err0) {
        add1.end(function(err1) {
          add2.end(function(err2) {
            sort1.end(function(err3) {
              sort2.end(function(err4) {
                done(err0 || err1 || err2 || err3 || err4 || null);
              })
            })
          })
        })
      })

    });

    it(' - should skip first document and return second document with limit 1', function(done) {

      var sort = {
        counter: "desc"
      }

      supertest(fixtures.app)
        .get("/api/users/?skip=1&limit=1&sort=" + JSON.stringify(sort))
        .expect(200)
        .expect(function(res) {
          expect(res.body.length).toBe(1);
          expect(res.body[0].counter).toBe(888);
        })
        .end(function(err) {
          done(err);
        })

    });

  };

}());

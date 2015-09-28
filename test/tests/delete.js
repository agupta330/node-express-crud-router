(function() {
  "use strict";

  var expect = require('expect');
  var fixtures = require("../fixtures.js");
  var supertest = require('supertest');
  var us = require('underscore');

  var defaultModelData = fixtures.defaultModelData;

  module.exports = function() {

    it(' - should delete existing single document', function(done) {

      var data = defaultModelData;

      supertest(fixtures.app)
        .post("/api/users")
        .expect(200)
        .send(data)
        .end(function(err1, res) {

          supertest(fixtures.app)
            .delete("/api/users/" + res.body._id)
            .expect(200)
            .expect(function(res) {
              expect(res.body.model.name).toBe(data.name);
              expect(res.body.deleted).toBe(true);
            })
            .end(function(err2) {
              done(err1 || err2);
            })

        });

    });



    it(' - should return http 400 because of invalid objectId', function(done) {

      supertest(fixtures.app)
        .delete("/api/users/invalid")
        .expect(400)
        .end(function(err) {
          done(err);
        })

    });



    it(' - should remove all documents', function(done) {

      supertest(fixtures.app)
        .delete("/api/users")
        .expect(200)
        .end(function(err1, res) {

          supertest(fixtures.app)
            .get("/api/users")
            .expect(200, [])
            .end(function(err2) {
              done(err1 || err2);
            })

        });

    });

    it(' - should remove all documents by criteria', function(done) {

      var removeAll = supertest(fixtures.app)
        .delete("/api/users")
        .expect(200, []);

      var data1 = us.clone(defaultModelData);
      data1.counter = 1;
      var add1 = supertest(fixtures.app)
        .post("/api/users")
        .expect(200)
        .send(data1);

      var data2 = us.clone(defaultModelData);
      data2.counter = 2;
      var add2 = supertest(fixtures.app)
        .post("/api/users")
        .expect(200)
        .send(data2);

      var data3 = us.clone(defaultModelData);
      data3.counter = 2;
      var add3 = supertest(fixtures.app)
        .post("/api/users")
        .expect(200)
        .send(data3);

      var criteria = {
        counter: 2
      };

      var removeSelected = supertest(fixtures.app)
        .delete("/api/users?criteria=" + JSON.stringify(criteria))
        .expect(200);


      var selectRest = supertest(fixtures.app)
        .get("/api/users")
        .expect(200)
        .expect(function(res) {
          expect(res.body.length).toBe(1);
          expect(res.body[0].counter).toBe(1);
        })

      // var result = Bacon
      // .once(true)
      // .flatMap(function () {
      //   return Bacon.fromNodeCallback(removeAll.end);
      // })
      // .flatMap(function () {
      //   return Bacon.fromNodeCallback(add1.end);
      // })
      // .flatMap(function () {
      //   return Bacon.fromNodeCallback(add2.end);
      // })
      // .flatMap(function () {
      //   return Bacon.fromNodeCallback(add3.end);
      // })
      // .flatMap(function () {
      //   return Bacon.fromNodeCallback(removeSelected.end);
      // })
      // .flatMap(function () {
      //   return Bacon.fromNodeCallback(selectRest.end);
      // })
      //
      // result.onError(function (err) {
      //   done(err);
      // })
      //
      // result.onEnd(function () {
      //   done();
      // })
      //
      // result.onValue();

      removeAll.end(function(err0) {
        add1.end(function(err1) {
          add2.end(function(err2) {
            add3.end(function(err3) {
              removeSelected.end(function(err4) {
                selectRest.end(function(err5) {
                  done(err0 || err1 || err2 || err3 || err4 || err5);
                });
              })
            })
          })
        })
      })


    });


  };

}());

(function() {
  "use strict";

  var expect = require('expect');
  var fixtures = require("../fixtures.js");
  var supertest = require('supertest');

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


  };

}());

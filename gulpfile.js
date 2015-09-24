(function() {
  'use strict';
  var gulp = require('gulp');
  var mocha = require('gulp-mocha');
  var cover = require('gulp-coverage');

  gulp.task('test', function() {

    return gulp
      .src('test/suite.js', {
        read: false
      })
      // .pipe(cover.instrument({
      //   pattern: ['lib/**/*.js']
      // }))
      // gulp-mocha needs filepaths so you can't have any plugins before it
      .pipe(mocha({
        reporter: 'spec'
      }))
      // .pipe(cover.gather())
      // .pipe(cover.format())
      // .pipe(gulp.dest('reports/coverage'));
  });

}());

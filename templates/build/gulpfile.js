/*!
 * HTML Templates
 * CSS Adaptive Framework and HTML5 Basic Templates
 *
 * Dual licensed under the MIT or GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */

'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    chokidar = require('chokidar'),
    less = require('gulp-less'),
    lessReporter = require('gulp-less-reporter'),
    cleanCSS = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify');


var rootPath = '../';


// Compile LESS
gulp.task('less', function (done) {
  gulp
    .src(rootPath + 'css/less/_styles.less')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(less({
      // All calculations within brackets only
      strictMath: 'on'
    })).on('error', lessReporter)
    .pipe(cleanCSS({
      // Reorganize different-selector different-rules rulesets
      level: {
        2: {
          restructureRules: true
        }
      }
    }))
    .pipe(concat('styles.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(rootPath + 'css'))
    .on('end', function () {
      done();
    });
});


// Pack JS
gulp.task('js', function (done) {
  // Follow a certain order of files
  gulp
    .src([
      rootPath + 'js/jquery.js',
      rootPath + 'js/*/*.js',
      rootPath + 'js/config.js',
      rootPath + 'js/!(main|scripts)*.js',
      rootPath + 'js/main.js'
    ])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('scripts.js'))
    .pipe(uglify()
      .on('error', function (error) {
        done(error);
      }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(rootPath + 'js'))
    .on('end', function () {
      done();
    });
});


// Optimize images


// Live reload


// Watch and build for production
gulp.task('watch', function () {
  chokidar.watch('css/**/*.less', {
    cwd: rootPath
  }).on('all', function () {
    gulp.start('less');
  });
  chokidar.watch('js/**/*.js', {
    cwd: rootPath
  }).on('all', function () {
    gulp.start('js');
  });
});
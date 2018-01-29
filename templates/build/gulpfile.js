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


var paths = {
  rootPath: '../',

  css: {
    watch: 'css/**/*.less',
    src: 'css/less/_styles.less',
    dest: 'css',
    result: 'styles.css'
  },

  js: {
    watch: 'js/**/*.js',
    src: [
      'js/jquery.js',
      'js/*/*.js',
      'js/config.js',
      'js/!(main|scripts)*.js',
      'js/main.js'
    ],
    dest: 'js',
    result: 'scripts.js'
  }
};


// Compile LESS
gulp.task('less', function (done) {
  gulp
    .src(paths.css.src, {
      cwd: paths.rootPath
    })
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
    .pipe(concat(paths.css.result))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.rootPath + paths.css.dest))
    .on('end', function () {
      done();
    });
});


// Pack JS
gulp.task('js', function (done) {
  // Follow a certain order of files
  gulp
    .src(paths.js.src, {
      cwd: paths.rootPath
    })
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat(paths.js.result))
    .pipe(uglify()
      .on('error', function (error) {
        done(error);
      }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.rootPath + paths.js.dest))
    .on('end', function () {
      done();
    });
});


// Optimize images


// Live reload


// Watch and build for production
gulp.task('watch', function () {
  function watcher(pathToWatch, task) {
    chokidar.watch(pathToWatch, {
      cwd: paths.rootPath
    }).on('all', function () {
      gulp.start(task);
    });
  }

  watcher(paths.css.watch, 'less');
  watcher(paths.js.watch, 'js');
});
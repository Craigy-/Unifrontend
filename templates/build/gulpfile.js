/*!
 * HTML Templates
 * CSS Adaptive Framework and HTML5 Basic Templates
 *
 * Dual licensed under the MIT or GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */

'use strict';

// Includes
var gulp = require('gulp'),
    watch = require('gulp-chokidar')(gulp),
    browserSync = require('browser-sync'),
    bsReload = browserSync.reload,
    gp = require('gulp-load-plugins')({
      rename: {
        'gulp-clean-css': 'cleanCSS'
      }
    });

// File paths
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
    // Follow a certain order of files
    src: [
      'js/jquery.js',
      'js/*/*.js',
      'js/config.js',
      'js/!(main|scripts)*.js',
      'js/main.js'
    ],
    dest: 'js',
    result: 'scripts.js'
  },

  html: {
    watch: '*.htm*'
  }
};


// Compile LESS
gulp.task('less', function (done) {
  gulp
    .src(paths.css.src, {
      cwd: paths.rootPath
    })
    .pipe(gp.plumber())
    .pipe(gp.sourcemaps.init())
    .pipe(gp.less({
      // All calculations within brackets only
      strictMath: 'on'
    })).on('error', gp.lessReporter)
    .pipe(gp.autoprefixer())
    .pipe(gp.cleanCSS({
      // Reorganize different-selector different-rules rulesets
      level: {
        2: {
          restructureRules: true
        }
      }
    }))
    .pipe(gp.concat(paths.css.result))
    .pipe(gp.sourcemaps.write('.'))
    .pipe(gulp.dest(paths.rootPath + paths.css.dest))
    .on('end', function () {
      bsReload();
      done();
    });
});


// Pack JS
gulp.task('js', function (done) {
  gulp
    .src(paths.js.src, {
      cwd: paths.rootPath
    })
    .pipe(gp.plumber())
    .pipe(gp.sourcemaps.init())
    .pipe(gp.concat(paths.js.result))
    .pipe(gp.uglify()
      .on('error', function (error) {
        done(error);
      }))
    .pipe(gp.sourcemaps.write('.'))
    .pipe(gulp.dest(paths.rootPath + paths.js.dest))
    .on('end', function () {
      bsReload();
      done();
    });
});


// Optimize images


// Tasks
gulp.task('bs', function () {
  browserSync({
    notify: false,
    server: {
      baseDir: paths.rootPath,
      index: 'index.htm'
    }
  });
});

gulp.task('watch', ['bs', 'less', 'js'], function () {
  watch(paths.css.watch, {
    cwd: paths.rootPath
  }, 'less');
  watch(paths.js.watch, {
    cwd: paths.rootPath
  }, 'js');
  watch(paths.html.watch, {
    cwd: paths.rootPath
  }).on('change', bsReload);
});
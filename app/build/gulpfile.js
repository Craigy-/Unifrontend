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
    args = require('yargs').argv,
    del = require('del'),
    gulpif = require('gulp-if'),
    watch = require('gulp-chokidar')(gulp),
    cache = require('gulp-cache'),
    gp = require('gulp-load-plugins')({
      overridePattern: false,
      pattern: [
        'browser-*',
        'imagemin-*',
      ],
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

  images: {
    watch: 'images/**/*',
    src: 'images/**/*',
    dest: 'images'
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
    .pipe(gulpif(!args.dev, gp.sourcemaps.init()))
    .pipe(gp.less({
      // All calculations within brackets only
      strictMath: 'on'
    })).on('error', gp.lessReporter)
    .pipe(gp.autoprefixer())
    .pipe(gp.cleanCSS({
      // Formats output in a really nice way or not
      format: args.dev ? 'beautify' : false,
      // Reorganize different-selector different-rules rulesets
      level: {
        2: {
          restructureRules: true
        }
      }
    }))
    .pipe(gp.concat(paths.css.result))
    .pipe(gulpif(!args.dev, gp.sourcemaps.write('.')))
    .pipe(gulp.dest(paths.rootPath + paths.css.dest))
    .on('end', function () {
      gp.browserSync.reload();
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
    .pipe(gulpif(!args.dev, gp.sourcemaps.init()))
    .pipe(gp.concat(paths.js.result))
    .pipe(gulpif(!args.dev, gp.uglify()
      .on('error', function (error) {
        done(error);
      })))
    .pipe(gulpif(!args.dev, gp.sourcemaps.write('.')))
    .pipe(gulp.dest(paths.rootPath + paths.js.dest))
    .on('end', function () {
      gp.browserSync.reload();
      done();
    });
});


// Optimize images
gulp.task('images', function () {
  return gulp.src(paths.images.src, {
    cwd: paths.rootPath
    })
    .pipe(cache(gp.imagemin([
      gp.imagemin.gifsicle({
        interlaced: true
      }),
      gp.imagemin.svgo({
        plugins: [{
          removeViewBox: false
        }]
      })], {
        use: [
          gp.imageminJpegoptim({
            progressive: true,
            max: 85,
            stripAll: true
          }),
          gp.imageminPngquant({
            quality: '65-80',
            speed: 5
          })
        ]
      })))
    .pipe(gulp.dest(paths.rootPath + paths.images.dest));
});


// Live reload
gulp.task('live', function () {
  gp.browserSync({
    notify: false,
    server: {
      baseDir: paths.rootPath,
      index: 'index.htm'
    }
  });
});


// Some clean-ups for development mode
gulp.task('clean--dev', function () {
  return del([paths.rootPath + '/**/*.map'], {
    force: true
  });
});



// Public tasks

// Build for production
gulp.task('build', ['clear', 'less', 'js', 'images']);

// Watch files for change
gulp.task('watch', args.dev ? ['clean--dev', 'live', 'less', 'js'] : ['clear', 'live', 'less', 'js', 'images'], function () {
  // Watch CSS
  watch(paths.css.watch, {
    cwd: paths.rootPath
  }, 'less');
  // Watch JS
  watch(paths.js.watch, {
    cwd: paths.rootPath
  }, 'js');
  // Watch images
  gulpif(!args.dev, watch(paths.images.watch, {
    cwd: paths.rootPath
  }, 'images'));
  // Watch HTML
  watch(paths.html.watch, {
    cwd: paths.rootPath
  }).on('change', gp.browserSync.reload);
});

// Clear cache
gulp.task('clear', function () {
  return cache.clearAll();
})

// Default
gulp.task('default', ['build']);
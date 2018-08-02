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
    rename = require('gulp-rename'),
    del = require('del'),
    gulpif = require('gulp-if'),
    watch = require('gulp-chokidar')(gulp),
    cache = require('gulp-cache'),
    gp = require('gulp-load-plugins')({
      overridePattern: false,
      pattern: [
        'browser-*',
        'imagemin-*',
        'less-*'
      ],
      rename: {
        'gulp-clean-css': 'cleanCSS'
      }
    });

// File paths
var paths = {
  rootPath: '../',

  css: {
    watch: [
      'css/**/*.less',
      'css/**/*.css',
      '!css/**/*.min.css',
      '!css/styles.css'
    ],
    src: {
      vendor: [
        'css/**/*.css',
        '!css/**/*.min.css',
        '!css/styles.css'
      ],
      custom: 'css/less/_styles.less'
    },
    dest: 'css',
    result: {
      vendor: '.min', // just a suffix
      custom: 'styles.css'
    }
  },

  js: {
    watch: 'js/src/**/*.js',
    src: {
      // Follow a certain order of files
      vendor: [
        'js/src/jquery.js',
        'js/src/plugins/*.js',
        'js/src/plugins/**/*.js'
      ],
      custom: [
        'js/src/config.js',
        'js/src/main.js'
      ]
    },
    dest: 'js',
    result: {
      vendor: 'vendor.js',
      custom: 'custom.js'
    }
  },

  images: {
    watch: '+(images|temp)/**/*',
    src: '+(images|temp)/**/*'
  },

  html: {
    watch: '*.htm*'
  }
};



// Make CSS
function makeCSS(done, compileLESS) {
  return gulp.src(compileLESS ? paths.css.src.custom : paths.css.src.vendor, {
    cwd: paths.rootPath
    })
    .pipe(gp.plumber())
    .pipe(gulpif(!compileLESS, rename({
      suffix: paths.css.result.vendor
    })))
    .pipe(gulpif((!args.dev && compileLESS), gp.sourcemaps.init()))
    .pipe(gulpif(compileLESS, gp.less({
      // All calculations within brackets only
      strictMath: 'on',
      plugins: [
        // List/Array manipulation
        // https://github.com/seven-phases-max/less-plugin-lists
        new gp.lessPluginLists()
      ]
    }))).on('error', gp.lessReporter)
    .pipe(gp.autoprefixer())
    .pipe(gp.cleanCSS({
      // Process '@import' inlining rules or not
      inline: compileLESS ? false : 'local',
      // Formats output in a really nice way or not
      format: args.dev ? 'beautify' : false,
      // Reorganize different-selector different-rules rulesets
      level: {
        2: {
          restructureRules: true
        }
      }
    }))
    .pipe(gulpif(compileLESS, gp.concat(paths.css.result.custom)))
    .pipe(gulpif((!args.dev && compileLESS), gp.sourcemaps.write('.')))
    .pipe(gulp.dest(paths.rootPath + paths.css.dest))
    .on('end', function () {
      if (done) {
        gp.browserSync.reload();
        done();
      }
    });
}

gulp.task('css', function (done) {
  // Pack all vendor CSS
  makeCSS();

  // Compile LESS and pack the resulting CSS
  makeCSS(done, true);
});


// Pack JS
function packJS(done, custom) {
  return gulp
    .src(custom ? paths.js.src.custom : paths.js.src.vendor, {
      cwd: paths.rootPath
    })
    .pipe(gp.plumber())
    .pipe(gulpif(!args.dev, gp.sourcemaps.init()))
    .pipe(gp.concat(custom ? paths.js.result.custom : paths.js.result.vendor))
    .pipe(gulpif(!args.dev, gp.uglify()
      .on('error', function (error) {
        console.log(error);
      })))
    .pipe(gulpif(!args.dev, gp.sourcemaps.write('.')))
    .pipe(gulp.dest(paths.rootPath + paths.js.dest))
    .on('end', function () {
      if (done) {
        gp.browserSync.reload();
        done();
      }
    });
}

gulp.task('js', function (done) {
  // Pack vendor JS (will not be executed with '--custom' flag)
  if (!args.custom) {
    packJS();
  }

  // Pack custom JS
  packJS(done, true);
});


// Optimize images
gulp.task('images', function () {
  var ioConfig = {
    jpg: {
      progressive: true,
      stripAll: true
    }
  };

  // The best images optimization will be enabled with '--extreme' flag
  if (args.extreme) {
    ioConfig = {
      png: {
        quality: '60-80',
        speed: 1
      },
      jpg: {
        progressive: true,
        max: 85,
        stripAll: true
      }
    };
  }

  gulp.src(paths.images.src, {
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
      }),
      gp.imageminJpegoptim(ioConfig.jpg),
      gp.imageminPngquant(ioConfig.png)
    ])))
    .pipe(gulp.dest(paths.rootPath));
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
gulp.task('clean', function () {
  return del([paths.rootPath + '/**/*.map'], {
    force: true
  });
});



// Public tasks

// Build for production
gulp.task('build', args.dev ? ['clean', 'css', 'js'] : ['clear', 'css', 'js', 'images']);

// Watch files for change
gulp.task('watch', args.dev ? ['clean', 'live', 'css', 'js'] : ['clear', 'css', 'js'], function () {
  // Watch LESS and vendor CSS
  watch(paths.css.watch, {
    cwd: paths.rootPath
  }, 'css');
  // Watch JS
  watch(paths.js.watch, {
    cwd: paths.rootPath
  }, 'js');
  // Watch images
  if (!args.dev) {
    watch(paths.images.watch, {
      cwd: paths.rootPath
    }, 'images');
  }
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
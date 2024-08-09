/*!
 * Unifrontend
 * Responsive CSS Framework and Sample HTML Templates
 * https://github.com/Craigy-/Unifrontend
 *
 * Dual licensed under the MIT or GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */

'use strict';

// Includes
var gulp = require('gulp'),
    args = require('yargs').argv,
    cache = require('gulp-cache'),
    del = require('del'),
    gulpif = require('gulp-if'),
    rename = require('gulp-rename'),
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
      vendor: [
        'js/src/plugins/**/*.js'
      ],
      custom: [
        'js/src/config.js',
        'js/src/_common.js',
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
  return gulp
    .src(compileLESS ? paths.css.src.custom : paths.css.src.vendor, {
      cwd: paths.rootPath
    })
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
      // Rebase URLs or not
      rebase: !!compileLESS,
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
    .pipe(gulpif(!args.dev, gp.sourcemaps.init()))
    .pipe(gulpif(!custom, gp.sort({
      // Follow a certain order (files in subdirectories must be in the end)
      comparator: function (file1, file2) {
        var isInSubDir = function (path) {
          var arr = path.split(/\\|\//);
          return (arr[arr.length - 2] != 'plugins') ? 1 : -1;
        };
        return (isInSubDir(file1.path) > isInSubDir(file2.path)) ? 1 : (isInSubDir(file1.path) < isInSubDir(file2.path) ? -1 : file1.path.localeCompare(file2.path));
      }
    })))
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


// Clear cache
gulp.task('clear', function () {
  return cache.clearAll();
});



// Public tasks

// Build
gulp.task('build', args.dev ? gulp.series('clean', gulp.parallel('css', 'js')) : gulp.series('clear', gulp.parallel('css', 'js', 'images')));

// Watch
gulp.task('watch', function () {
  // Watch LESS and vendor CSS
  gulp.watch(paths.css.watch, {
    cwd: paths.rootPath
  }, gulp.parallel('css'));
  // Watch JS
  gulp.watch(paths.js.watch, {
    cwd: paths.rootPath
  }, gulp.parallel('js'));
  // Watch HTML
  gulp.watch(paths.html.watch, {
    cwd: paths.rootPath
  }).on('change', gp.browserSync.reload);
});

// Default
gulp.task('default', gulp.series('build', gulp.parallel('live', 'watch')));
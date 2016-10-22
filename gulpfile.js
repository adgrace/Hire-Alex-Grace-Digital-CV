// generated on 2016-10-09 using generator-webapp 2.2.0
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');
const del = require('del');
const wiredep = require('wiredep').stream;
const runSequence = require('run-sequence');
const $ = gulpLoadPlugins();
const reload = browserSync.reload;
// added
const clean = require('gulp-clean');
const cssimport = require("gulp-cssimport");
const glob = require("glob");
const rename = require("gulp-rename");
const md5 = require("gulp-md5-plus");
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const imageminJpegtran = require('imagemin-jpegtran');
const optipng = require('gulp-optipng');
var optoptions = ['-o5'];
const responsive = require('gulp-responsive');
const ftp = require('vinyl-ftp');
const gutil = require('gulp-util');
const minimist = require('minimist');
const realFavicon = require ('gulp-real-favicon');
const fs = require('fs');

// favicon.ico generator ------------------------------------------------------------------------------------------------------
// File where the favicon markups are stored
var FAVICON_DATA_FILE = 'faviconData.json';

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task('generate-favicon', function(done) {
  realFavicon.generateFavicon({
    masterPicture: 'alexgrace.png',
    dest: '.tmp/dist/images/favicon',
    iconsPath: '/',
    design: {
      ios: {
        pictureAspect: 'backgroundAndMargin',
        backgroundColor: '#ffffff',
        margin: '0%',
        assets: {
          ios6AndPriorIcons: false,
          ios7AndLaterIcons: false,
          precomposedIcons: false,
          declareOnlyDefaultIcon: true
        },
        appName: 'Hire Alex Grace: Digital CV'
      },
      desktopBrowser: {},
      windows: {
        pictureAspect: 'noChange',
        backgroundColor: '#ffffff',
        onConflict: 'override',
        assets: {
          windows80Ie10Tile: false,
          windows10Ie11EdgeTiles: {
            small: false,
            medium: true,
            big: false,
            rectangle: false
          }
        },
        appName: 'Hire Alex Grace: Digital CV'
      },
      androidChrome: {
        pictureAspect: 'backgroundAndMargin',
        margin: '0%',
        backgroundColor: '#ffffff',
        themeColor: '#ffffff',
        manifest: {
          name: 'Hire Alex Grace: Digital CV',
          display: 'standalone',
          orientation: 'notSet',
          onConflict: 'override',
          declared: true
        },
        assets: {
          legacyIcon: false,
          lowResolutionIcons: false
        }
      },
      safariPinnedTab: {
        pictureAspect: 'silhouette',
        themeColor: '#5bbad5'
      }
    },
    settings: {
      scalingAlgorithm: 'Mitchell',
      errorOnImageTooSmall: false
    },
    markupFile: FAVICON_DATA_FILE
  }, function() {
    done();
  });
});

// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
gulp.task('inject-favicon-markups', ['generate-favicon'], function() {
  return gulp.src([ '.tmp/dist/index.html' ])
    .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
    .pipe(gulp.dest('dist'));
});

gulp.task('movehtml', ['inject-favicon-markups'], function() {
  return gulp.src([ '.tmp/dist/index.html' ])
    .pipe(clean({force: true}))
});

//------------------------------------------------------------------------------------------------------------------------

gulp.task('styles', () => {
  return gulp.src('app/styles/*.css')
    .pipe($.sourcemaps.init())
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('scripts', () => {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(reload({stream: true}));
});

function lint(files, options) {
  return gulp.src(files)
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint(options))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('lint', () => {
  return lint('app/scripts/**/*.js', {
    fix: true
  })
    .pipe(gulp.dest('app/scripts'));
});
gulp.task('lint:test', () => {
  return lint('test/spec/**/*.js', {
    fix: true,
    env: {
      mocha: true
    }
  })
    .pipe(gulp.dest('test/spec'));
});

gulp.task('html', ['styles', 'scripts'], () => {
  return gulp.src('app/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cssimport({})))
    .pipe($.if('*.css', $.cssnano({safe: true, autoprefixer: false})))
    .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest('.tmp/dist'));
});

gulp.task('preimage', function () {
  return gulp.src('app/images/**/*')
    .pipe(responsive({
      'waitrose-logo.png': {
        width: 213,
        height: 44
      },
      'tribe-logo.png': {
        width: 265,
        height: 96
      },
      'surrey-logo.png': {
          width: 398,
          height: 118
      },
      'hollister-logo.png': {
        width: 109,
        height: 44
      },
      'deutsche-logo.png': {
        width: 228,
        height: 44
      },
      'chew-logo.png': {
        width: 109,
        height: 126
      },
      'jpmorganchase-logo.png': {
        width: 352,
        height: 44
      },
      'alex-grace-mobile.jpg': {
        width: 736,
        height: 867
      },
      'alex-grace.jpg': {
        width: '100%',
        height: '100%'
      },
      'intl-tel-input/*.png': {
        width: '100%',
        height: '100%'
      }
    }))
    .pipe(gulp.dest('.tmp/images'));
});

gulp.task('images', ['preimage'], () => {
  return gulp.src('.tmp/images/**/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant(), optipng(optoptions), imageminJpegtran()]
    }))
    .pipe(gulp.dest('.tmp/dist/images'));
});

gulp.task('downloads', () => {
  return gulp.src('app/downloads/**/*')
    .pipe(gulp.dest('.tmp/dist/downloads'));
});

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
    .concat('app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/dist/fonts'))
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('.tmp/dist'));
});

gulp.task('cache-control', () => {
  gulp.src(".tmp/dist/**/*")
    .pipe($.if('*.pdf', md5(10,'dist/index.html')))
    .pipe($.if('images/*-logo.png', md5(10,'dist/index.html')))
    .pipe($.if('images/*.jpeg', md5(10,'dist/styles/main.css')))
    .pipe($.if('*.css', md5(10,'dist/index.html')))
    .pipe($.if('*.js', md5(10,'dist/index.html')))
    .pipe(gulp.dest("dist"));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', () => {
  runSequence(['clean', 'wiredep'], ['styles', 'scripts', 'fonts'], () => {
    browserSync({
      notify: false,
      port: 9000,
      server: {
        baseDir: ['.tmp', 'app'],
        routes: {
          '/bower_components': 'bower_components'
        }
      }
    });

    gulp.watch([
      'app/*.html',
        'app/images/**/*',
      '.tmp/fonts/**/*'
    ]).on('change', reload);

    gulp.watch('app/styles/**/*.css', ['styles']);
    gulp.watch('app/scripts/**/*.js', ['scripts']);
    gulp.watch('app/fonts/**/*', ['fonts']);
    gulp.watch('bower.json', ['wiredep', 'fonts']);
  });
});

gulp.task('serve:dist', () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  });
});

gulp.task('serve:test', ['scripts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/scripts': '.tmp/scripts',
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch('test/spec/**/*.js').on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
});

// inject bower components
gulp.task('wiredep', () => {
  gulp.src('app/*.html')
    .pipe(wiredep({
      exclude: ['bootstrap.js'],
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('build-task', function(callback) {
  runSequence(['lint', 'html', 'images', 'downloads', 'fonts', 'extras'], 'movehtml', 'cache-control', callback);
});

gulp.task('build', ['build-task'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', () => {
  runSequence(['clean', 'wiredep'], 'build');
});

gulp.task('deploy', function() {
  var args = minimist(process.argv.slice(2));
  var remotePath = '/';
  var conn = ftp.create({
    host: 'ftp.hirealexgrace.com',
    user: args.user,
    password: args.password
    });

  conn.rmdir('/', function (err) {
    return gulp.src(['dist/**/*'])
      .pipe( conn.newer(remotePath))
      .pipe( conn.dest(remotePath)); 
  });
});
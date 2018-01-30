'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer  = require('gulp-autoprefixer'),
    browserSync  = require('browser-sync'), // Asynchronous browser loading on .scss file changes
    reload       = browserSync.reload,
    concat = require('gulp-concat'),
    concatCss = require('gulp-concat-css'),
    plumber = require('gulp-plumber'),
    rename = require("gulp-rename"),
    cssmin = require('gulp-cssmin'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    notify = require('gulp-notify'),
    minify = require('gulp-minify'),
    cleanCss = require('gulp-clean-css'),
    util = require('gulp-util'),
    runSequence = require('run-sequence'),
    purify = require('gulp-purifycss'),
    sprity = require('sprity'),
    gulpif = require('gulp-if'),
    duration = require('gulp-duration'),
    watch = require('gulp-watch'),
    fs = require('fs'),
    replace = require('gulp-replace'),
    critical = require('critical').stream,
    cache = require('gulp-cache'),
    psi = require('psi'),
    site = 'http://1b228afc.ngrok.io/special-pages/black-friday',
    key = '',
    changed = require('gulp-changed'),
    imagemin = require('gulp-tinypng'),
    tiny = require('gulp-tinypng-nokey'),
    newer = require('gulp-newer'),
    ngrok = require('ngrok'),
    checkCSS = require( 'gulp-check-unused-css' ),
    replaceInHtml = require('gulp-replace-task'),
    hash = require('gulp-hash-filename'),
    sufix = 'ver=' + new Date().getTime(),
    clean = require('gulp-clean');

//----------------------------------------------------------
// Config
//----------------------------------------------------------

var config = {
    dist: '',
    htmlin: 'sources/html/',
    assets_echo: 'footer.php',
    phpin: [
        '/*.php',
        '/partials/*.php'
    ],
    scssin: 'sources/scss/**/*.scss',
    scssout: 'sources/css/',
    distcss: 'css/',
    distimg: 'img/',
    inlineout: 'css/inlines/',
    jsin:[
        'sources/plugins/jquery-1.12.4/jquery-1.12.4.js',
        'sources/plugins/bootstrap-sass-3.3.7/assets/javascripts/bootstrap/dropdown.js',
        'sources/plugins/tableSorter/jquery.tablesorter.js',
        'sources/plugins/jQuery.lozad/lozad.min.js',
        'sources/plugins/jquery-ui-1.12.1.custom/jquery-ui.min.js',
        'sources/plugins/bootstrap-sass-3.3.7/assets/javascripts/bootstrap/modal.js',
        'sources/plugins/ekkoLightbox/ekko-lightbox.min.js',
        'sources/plugins/ekkoLightbox/anchor.js',

        'sources/js/*.js'
    ],
    jsout: 'js/',
    spritein: 'sources/img/sprite/',
    spriteout: 'img/sprite/',
    spritescssout: 'sources/scss/',
    prod: !!util.env.prod,
};


//----------------------------------------------------------
// REMOVE OLD FILE
//----------------------------------------------------------


gulp.task('removeOldFile', function () {
    return gulp.src(
        [
            config.distcss,
            !config.distcss +'/inlines',
            config.jsout,
            config.spriteout
        ],
        { read: false }
    ).pipe(clean());
});


//----------------------------------------------------------
// GULP WATCH
//----------------------------------------------------------

gulp.task('watch',

    function (event) {
    gulp.watch('sources/js/*.js', ['buildJS']);

    var files = [
        '/' + config.scssout + '/*.css',
        './*.php'
    ];

    browserSync.init(files, {
        proxy: "http://picodi.dev/company/",
        notify: true
    });

    gulp.watch('sources/scss/**/*.scss', [

        'buildSass',
        'purifyCustomCSS',
        'concat',

    ]).on('change', browserSync.reload);

    gulp.watch('sources/js/*.js', ['buildJS','javascript-version',]);
    gulp.watch('./*.php').on('change', browserSync.reload);
});


//----------------------------------------------------------
// GULP SASS -- TASK FOR STYLESHEET
//----------------------------------------------------------

gulp.task('buildSass', function () {
    return gulp.src(config.scssin)
        .pipe(sass())
        .pipe(autoprefixer('last 2 version', '> 1%', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.scssout))

});


//----------------------------------------------------------
// GULP SASS -- TASK FOR STYLESHEET
//----------------------------------------------------------

gulp.task('purifyCustomCSS', function () {
    return gulp.src(config.scssout + 'main.css')
    .pipe(purify([
        config.jsout + 'main.min.js',
        config.htmlin + '*.html'
    ]))
    .pipe(cleanCss({
        debug: true,
        keepSpecialComments: 0,
        beautify: true,
        restructuring: true,
        mediaMerging: true
    }, function (details) {
        console.log(details.name + ' Errors: ' + details.errors);
        console.log(details.name + ' Size before (kB): ' + details.stats.originalSize);
        console.log(details.name + ' Size after (kB): ' + details.stats.minifiedSize);
        console.log(details.name + ' Less a percentage of: ' + details.stats.efficiency);
    }))
        .pipe(gulp.dest(config.scssout))
});

//----------------------------------------------------------
// GULP CONCAT -- TASK FOR STYLESHEET
//----------------------------------------------------------

gulp.task('concat', function () {
    return gulp.src(config.scssout + '*.css')
        .pipe(concatCss("style.css"))
        .pipe(cssmin())
        .pipe(hash({
            "format": "{name}." + sufix + ".min.css"
        }))
        .pipe(gulp.dest(config.distcss))

});


//----------------------------------------------------------
// GULP CRITICAL -- TASK FOR STYLESHEET
//----------------------------------------------------------

gulp.task('buildCritical', function () {
    return gulp.src( config.htmlin + '*.html' )
        .pipe(critical({
            base: config.htmlin,
            css: config.distcss + 'style.' + sufix + '.min.css',
            minify: true,
            width: 1920,
            height: 1280,
            ignore: ['img',/url\(/]
        }))
        .pipe(rename({extname: ".min.css"}))
        .pipe(gulp.dest( config.distcss + 'inlines/' ));
});


//----------------------------------------------------------
// GULP JS
//----------------------------------------------------------

gulp.task('buildJS', function() {
    return gulp.src(config.jsin)
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(hash({
            "format": "{name}." + sufix + ".min.js"
        }))
        .pipe(gulp.dest(config.jsout))
});


//----------------------------------------------------------
// GULP SPRITE + TINY PNG
//----------------------------------------------------------

gulp.task('buildSprite', function () {
    return sprity.src({
        name: 'sprite.' + sufix,
        src: config.spritein + '*.{png,jpg}',
        style: config.spritescssout + '/sprite.scss',
        cssPath: '../img/sprite',
        cachebuster: "?<...>",
        margin: 1,
    })
        .pipe(gulpif('*.png',
            gulp.dest(config.spriteout),
            gulp.dest( config.spritescssout)
        ))
        .pipe(gulpif('*.png',
            gulp.dest(config.spriteout)
        ))
});

// Compress sprite.png file
// ------------------------------------------------------
gulp.task('compressSprite', function () {
    return gulp.src(config.spriteout + '*.png')
        .pipe(imagemin('03o58K4FUtnBoZX6oItpqAW_LYvpRwoi'))
        .pipe(gulp.dest(config.spriteout));
});


//----------------------------------------------------------
// GULP TINY IMAGES
//----------------------------------------------------------

gulp.task('tinypng', function () {
    gulp.src(config.distimg + '*.png')
        .pipe(imagemin('03o58K4FUtnBoZX6oItpqAW_LYvpRwoi'))
        .pipe(gulp.dest(config.distimg));
});

gulp.task('tinypngAll', function () {
    gulp.src(config.distimg + '/uploads/2018/01/*.*')
        .pipe(imagemin('03o58K4FUtnBoZX6oItpqAW_LYvpRwoi'))
        .pipe(gulp.dest(config.distimg + '/uploads/2018/01/'));
});

//----------------------------------------------------------
// GULP TINY PSI
//----------------------------------------------------------

gulp.task('psi', ['psi-seq'], function() {
    console.log('Woohoo! Check out your page speed scores!')
    process.exit();
})


gulp.task('ngrok-url', function(cb) {
    return ngrok.connect(80, function (err, url) {
        site = url;
        console.log('serving your tunnel from: ' + site);
        cb();
    });
});


gulp.task('psi-seq', function (cb) {
    return runSequence(
        'ngrok-url',
        'psi-desktop',
        'psi-mobile',
        cb
    );
});


gulp.task('psi-desktop', function (cb) {
    psi(site, {
        nokey: 'true',
        strategy: 'desktop'
    }, cb);
});

gulp.task('psi-mobile', function (cb) {
    psi(site, {
        nokey: 'true',
        strategy: 'mobile'
    }, cb);
});


//----------------------------------------------------------
// BROWSER-SYNC
//----------------------------------------------------------

gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "picodi.dev/company"
    });
});

//----------------------------------------------------------
// CHANGE ASSETS VERSION
//----------------------------------------------------------

gulp.task('style-version', function () {
    return gulp.src(config.assets_echo)
        .pipe(replaceInHtml({
            patterns: [{
                match: /(?=ver=)(.*?)(?=\.min.css)/g,
                replacement: sufix
            }]
        }))
        .pipe(gulp.dest(config.dist));
});

gulp.task('javascript-version', function () {
    return gulp.src(config.assets_echo)
        .pipe(replaceInHtml({
            patterns: [{
                match: /(?=ver=)(.*?)(?=\.min.js)/g,
                replacement: sufix
            }]
        }))
        .pipe(gulp.dest(config.dist));
});

//----------------------------------------------------------
// GULP BUILD-ALL
//----------------------------------------------------------

gulp.task('build', function(callback) {
    runSequence(
        'removeOldFile',
        'buildSprite',
        'compressSprite',
        'buildSass',
        [
            'purifyCustomCSS',
            'concat',
        ],
        'buildJS',
        'javascript-version',
        'style-version',
        'buildCritical',
        callback);


})








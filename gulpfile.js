'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer  = require('gulp-autoprefixer'),
    browserSync  = require('browser-sync'), // Asynchronous browser loading on .scss file changes
    concat = require('gulp-concat'),
    rename = require("gulp-rename"),
    cssmin = require('gulp-cssmin'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    cleanCss = require('gulp-clean-css'),
    util = require('gulp-util'),
    runSequence = require('run-sequence'),
    purify = require('gulp-purifycss'),
    sprity = require('sprity'),
    gulpif = require('gulp-if'),
    watch = require('gulp-watch'),
    critical = require('critical').stream,
    imagemin = require('gulp-tinypng'),
    hash = require('gulp-hash-filename');

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
    scssout: 'css/',
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
        proxy: "http://localhost/rimart/",
        notify: true
    });

    gulp.watch('sources/scss/**/*.scss', [

        'buildSass',
        'purifyCustomCSS',

    ]).on('change', browserSync.reload);

    gulp.watch('sources/js/*.js', ['buildJS']);
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
        .pipe(cssmin())
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
// BROWSER-SYNC
//----------------------------------------------------------

gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "http://localhost:3000/rimart/"
    });
});



//----------------------------------------------------------
// GULP BUILD-ALL
//----------------------------------------------------------

gulp.task('build', function(callback) {
    runSequence(
        // 'buildSprite',
        'buildSass',
        [
            'purifyCustomCSS',
        ],
        'buildJS',
        'buildCritical',
        callback);


})








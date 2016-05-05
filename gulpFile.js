(function () {

    'use strict';

    var bower = require('bower'),
        concat = require('gulp-concat'),
        del = require('del'),
        gulp = require('gulp'),
        gulpConfig = require('./configuration/gulpConfig'),
        gUtil = require('gulp-util'),
        jshint = require('gulp-jshint'),
        jshintStylish = require('jshint-stylish'),
        rename = require('gulp-rename'),
        //scss = require('gulp-sass'),
        sourcemaps = require('gulp-sourcemaps'),
        traceur = require('gulp-traceur'),
        zip = require('gulp-zip'),
        forceDeploy = require('gulp-jsforce-deploy'),
        mainBowerFiles = require('gulp-main-bower-files'),
        uglify = require('gulp-uglify'),
        gulpFilter = require('gulp-filter'),
        gulpIgnore = require('gulp-ignore'),
        debug = require('gulp-debug');


    var files = gulpConfig.files,
        directories = gulpConfig.directories;

    var definitions = [];
    var define = function (name, description, isWorkflow) {
        definitions.push({ name: name, description: description, isWorkflow: isWorkflow });
    };

    /*************************************************************/
    define('help','show help info for each gulp task and workflow');
    /*************************************************************/
    gulp.task('help',function(){

        gUtil.log('----------------------------------------');
        gUtil.log('GULP Tasks and Workflows: ');
        gUtil.log('----------------------------------------');

        var columnSpace = "                      ";
        Object.keys(definitions).map(function(key){
            var def = definitions[key],
                name = gUtil.colors.yellow(def.name + columnSpace.substring(0, 20 - def.name.length)),
                description = gUtil.colors.white(def.description);
            if (def.isWorkflow) {
                gUtil.log('----------------------------------------');
            }
            gUtil.log(name + ' : ' + description);
        });

    });

    /*  *   *   *   *   *   *   *   *   *

     T A S K S

     *  *   *   *   *   *   *   *   *   */

    /*************************************************************/
    define('bower','install bower dependencies');
    /*************************************************************/
    gulp.task('bower', function() {
        return bower.commands.install();
    });

    /*************************************************************/
    define('cleanVendor','clean up dist vendor folder by removing all files');
    /*************************************************************/
    gulp.task('cleanVendor', [], function(cb) {
       return  del(directories.dist.root, cb);       
    });

    /*************************************************************/
    define('vendorJs','create the vendorJs js file');
    /*************************************************************/
    gulp.task('vendorJs', ['cleanVendor'], function() {
    //gulp.task('vendorJs', function() {
        var filterJS = gulpFilter('**/*.js', { restore: true });
        return gulp.src(files.bower)
            .pipe(mainBowerFiles({
                overrides: {
                    'bootstrap': {
                        main: [
                            './dist/js/bootstrap.js',
                            './dist/css/*.min.*',
                            './dist/fonts/*.*'
                        ]
                    },
					'angular-spinner': {
						main: [
							'./angular-spinner.js'					
						]
					},
                    'bootstrap-formhelpers': {
                        main: [
                            './dist/js/bootstrap-formhelpers.js',
                            './dist/css/*.min.*',
                            './dist/img/*.*'
                        ]                        
                    }
                }
            }))
            .pipe(filterJS)
            //.pipe(concat('vendor.js'))
            //.pipe(uglify())            
            .pipe(filterJS.restore)
            .pipe(gulp.dest(directories.dist.root));
    });   
   
    /*************************************************************/
    define('copyStaticResources','move all required static resources to SFDC folder');
    /*************************************************************/
    gulp.task('copyStaticResources', ['vendorJs', 'concatJs', 'concatCss'], function() {
        gulp.src(files.dist.vendor.js)
            .pipe(gulpIgnore.exclude("app.js"))                
            .pipe(zip('VendorJs.resource'))
            .pipe(gulp.dest(directories.dist.sfdcStaticResources));

        var condition = '*.js';
        gulp.src('./dist/**/*')
            .pipe(gulpIgnore.exclude(condition))
            //.pipe(debug())            
            .pipe(zip('VendorCss.resource'))
            .pipe(gulp.dest(directories.dist.sfdcStaticResources));

        gulp.src(files.src.images)
            .pipe(zip('Images.resource'))
            .pipe(gulp.dest(directories.dist.sfdcStaticResources));

        
        gulp.src(directories.dist.root + files.dist.js)
            .pipe(rename({
                basename: 'AppJs',
                extname: '.resource'
            }))
            .pipe(gulp.dest(directories.dist.sfdcStaticResources));

       return  gulp.src(directories.dist.root + files.dist.css)
            .pipe(rename({
                basename: 'AppCss',
                extname: '.resource'
            }))
            .pipe(gulp.dest(directories.dist.sfdcStaticResources));
    });

//     /*************************************************************/
//     define('getVendorFiles','move all vendor files in build folder');
//     /*************************************************************/
//     gulp.task('getVendorFiles', ['bower'], function() {
// 
//         return gulp.src(files.vendor)
//             .pipe(gulp.dest(directories.dist.vendor));
//     });

    /*************************************************************/
    define('jshint','hint all js code');
    /*************************************************************/
    gulp.task('jshint', function() {

        return gulp.src(files.src.js)
            .pipe(jshint())
            .pipe(jshint.reporter(jshintStylish))
            .pipe(jshint.reporter('fail'));
    });
    
    /*************************************************************/
    define('concatJs','concat all js application files into one');
    /*************************************************************/
    gulp.task('concatJs', ['jshint', 'cleanVendor'], function() {

        return gulp.src(files.src.js)
            .pipe(concat(files.dist.js))
            .pipe(gulp.dest(directories.dist.root));
    });

    /*************************************************************/
    define('concatCss','concat all js application files into one');
    /*************************************************************/
    gulp.task('concatCss', ['cleanVendor'], function() {

        return gulp.src(files.src.css)        
            .pipe(concat(files.dist.css))
            .pipe(gulp.dest(directories.dist.root));
    });

//     /*************************************************************/
//     define('scss','compile all scss files down to a single css file');
//     /*************************************************************/
//     gulp.task('scss', [], function() {
// 
//         return gulp.src(files.src.scss)
//             .pipe(sourcemaps.init())
//             .pipe(scss())
//             .pipe(concat('app.css'))
//             .pipe(sourcemaps.write())
//             .pipe(gulp.dest(directories.dist.root));
//     });

    /*************************************************************/
    define('traceur','compile ES6 code to ES5');
    /*************************************************************/
    gulp.task('traceur', function () {

        var traceurConfig = { modules: 'amd'};

        return gulp.src(files.src.es6)
            .pipe(sourcemaps.init())
            .pipe(traceur(traceurConfig))
            //.pipe(concat(files.dist.js))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(directories.dist.root));
    });

    /*************************************************************/
    define('deployFrontend','deploy pages, labels and static resources to salesforce');
    /*************************************************************/
    gulp.task('deployFrontend', ['jshint', 'cleanVendor', 'concatJs', 'concatCss','copyStaticResources'], function() {
        //gUtil.log(gulp.src(directories.sf + '**', { base: "." }));
        return gulp.src(directories.sf + '**', { base: "." })
         .pipe(zip('pkg.zip'))
         .pipe(forceDeploy({
           username: 'fhoehn@ngRemote.com',
           password: '<password>',
           loginUrl: 'https://login.salesforce.com', 
           pollTimeout: 300*1000,
           pollInterval: 10*1000,
           version: '34.0'
         }));
    });


    /*  *   *   *   *   *   *   *   *   *

     W O R K F L O W S

     *  *   *   *   *   *   *   *   *   */

    /*************************************************************/
    define('sfdcBuild', 'use it to build the app for a Salesforce sandbox', true);
    /*************************************************************/
    gulp.task('sfdcBuild', ['jshint', 'cleanVendor','concatJs', 'concatCss','copyStaticResources', 'deployFrontend']);
})();

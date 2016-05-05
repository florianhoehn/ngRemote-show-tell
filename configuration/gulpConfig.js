(function () {
    'use strict';

    var GLOBS = {
        css: '**/*.css',
        js: '**/*.js',
        modulejs: '**/*.module.js',
        scss: '**/*.scss',
        png: '**/*.png',
        jpg: '**/*.jpg'
    };

    var NG_DIST_DIR = './dist/',
        NG_SRC_DIR = './src/';

    var SFDC_DIR = './pkg/';

    var directories = {
        dist: {
            root: NG_DIST_DIR,
            vendor: NG_DIST_DIR,
            sfdcStaticResources: SFDC_DIR + 'staticresources/'
        },
        sf: SFDC_DIR
    };

    var files = {
        dist: {
            vendor: {
                js: directories.dist.vendor + GLOBS.js,
                css: directories.dist.root
            },
            js: 'app.js',
            css: 'app.css'
        },
        src: {
            js: [
                NG_SRC_DIR + GLOBS.modulejs,
                NG_SRC_DIR + GLOBS.js,
            ],
            scss: NG_SRC_DIR + GLOBS.scss,
            css: NG_SRC_DIR + 'css/' + GLOBS.css,
            images: [
                NG_SRC_DIR + 'images/' + GLOBS.png,
                NG_SRC_DIR + 'images/' + GLOBS.jpg
            ]
        },
        bower: './bower.json'
    };

    module.exports = {
        directories: directories,
        files: files
    };

})();
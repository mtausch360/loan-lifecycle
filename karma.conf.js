var webpackConfig = require('./webpack.config.js');
webpackConfig.entry = {};

module.exports = function(config) {
    config.set({
        // ... normal karma configuration
        frameworks: ['jasmine'],
        browsers: ['PhantomJS'],
        files: [
            // './public/app.js',
            // './spec/*_spec.js',
            './node_modules/lodash/lodash.js',
            './spec/**/*_spec.js'
            // each file acts as entry point for the webpack configuration
        ],
        logLevel: config.LOG_INFO,

        preprocessors: {
            // add webpack as preprocessor
            // './public/app.js': ['webpack', 'babel'],
            // './spec/*_spec.js': ['webpack', 'babel'],
            './spec/**/*_spec.js': ['webpack', 'babel']
        },

        webpack: webpackConfig,

        webpackMiddleware: {
            // webpack-dev-middleware configuration
            // i. e.
            noInfo: false
        }
    });
};
var webpackConfig = require('./webpack.config.js');
webpackConfig.entry = {};

module.exports = function(config) {
    config.set({
        // ... normal karma configuration
        frameworks: ['jasmine'],
        browsers: ['PhantomJS'],
        files: [{ pattern: 'spec.bundle.js', watched: false }],
        logLevel: config.LOG_INFO,

        preprocessors: { 'spec.bundle.js': ['webpack', 'babel'] },

        webpack: webpackConfig,

        webpackMiddleware: {
            // webpack-dev-middleware configuration
            // i. e.
            noInfo: false
        },

        singleRun: true
    });
};
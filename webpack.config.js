var path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './public/app.js',
    output: {
        path: __dirname + "/public/dist/",
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            { test: /\.js?$/,
              loader: 'babel-loader',
              query: {
                presets: ['es2015']
              }
            }
        ]
    }
};
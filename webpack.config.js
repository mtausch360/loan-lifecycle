var path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: [
    './public/app.js',
    {
      pattern: 'style.bundle.js',
      watched: true
    }
  ],
  output: {
    path: __dirname + "/public/dist/",
    filename: 'bundle.js'
  },
  module: {
    //eslint
    preLoaders: [{
      test: /\.js$/,
      loader: "eslint-loader",
<<<<<<< HEAD
      exclude: /(node_modules|dist)/
=======
      exclude: /(node_modules|bundle.js)/
>>>>>>> 226d7fb19d099eac264fe61e6669ea854f7ce862
    }],

    loaders: [{
      test: /\.js?$/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    }, {
      test: /\.html$/,
      loader: 'raw'
    }, {
      test: /\.less$/,
      loader: "style!css!less",
    }, {
      test: /\.css$/,
      loader: "style!css",
    }]
  }
};

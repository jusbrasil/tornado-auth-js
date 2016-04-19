var webpack = require('webpack');
var path =  require('path');

var baseConfig = {
  entry: {
    'tornado-auth': './index.js'
  },

  output: {
    path: './dist',
    filename: '[name].js',
    library: 'ReactComponents',
    libraryTarget: 'umd'
  },

  // Transform source code using Babel and React Hot Loader
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: ['es2015']
        },
      },
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
    ],
  },

  // Automatically transform files with these extensions
  resolve: {
    extensions: ['', '.js'],
  },

  externals: {
    'crypto': 'crypto'
  },
};

module.exports = baseConfig;

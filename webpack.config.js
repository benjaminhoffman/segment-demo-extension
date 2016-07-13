const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    background: path.join(__dirname, './src/background'),
    popup: path.join(__dirname, './src/popup'),
    content: path.join(__dirname, './src/content'),
    "analytics-node": path.join(__dirname, './src/analytics-node'),
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].js',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        SEGMENT_WRITE_KEY: `'${process.env.SEGMENT_WRITE_KEY || ''}'`
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/popup.html',
      filename: 'popup.html'
    })
  ],
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      query: {
        presets: ['es2015', 'stage-0']
      },
      exclude: /node_modules/
    }]
  }
};

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');
const WebpackBrowserPlugin = require('webpack-browser-plugin');
const merge = require('webpack-merge');

const dashboard = new Dashboard();

const webpackBaseConfig = require('./webpack.config');

module.exports = merge(webpackBaseConfig, {
  devtool: 'eval',
  entry: {
    app: [
      'react-hot-loader/patch',
      // activate HMR for React

      'webpack-dev-server/client?http://local.mymvs.info',
      // bundle the client for webpack-dev-server
      // and connect to the provided endpoint

      'webpack/hot/only-dev-server',
      // bundle the client for hot reloading
      // only- means to only hot reload for successful updates

      path.join(__dirname, '../front/app')
      // the entry point of our app
    ]
  },
  output: {
    path: path.join(__dirname, 'public/'),
    filename: 'js/[name].dev.js',
    publicPath: '/'
  },
  devServer: {
    hot: true,
    // enable HMR on the server

    contentBase: path.join(__dirname, '.'),
    // match the output path

    publicPath: '/',
    // match the output `publicPath`

    inline: true,
    compress: true,
    historyApiFallback: true,
    port: 80,
    host: 'local.mymvs.info',
    proxy: {
      '/api/**': {
        target: 'http://local.mymvs.info:3080/',
        secure: false
      },
      '/': {
        target: 'http://local.mymvs.info:3080/',
        secure: false
      }
    },
    quiet: true
  },
  plugins: [
    new DashboardPlugin(dashboard.setData),
    new webpack.HotModuleReplacementPlugin(),
    new WebpackBrowserPlugin({
      port: 80,
      url: 'http://local.mymvs.info',
      browser: 'Chrome'
    }),
    new ExtractTextPlugin({
      filename: 'css/[name].css',
      disable: false,
      allChunks: true
    })
  ]
});

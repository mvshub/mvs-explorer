const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const { exec } = require('shelljs');

const webpackBaseConfig = require('./webpack.config');
const versionConfig = require(path.join(__dirname, '../server/config/version.json'));

exec(`rm -rf ${path.join(__dirname, '../dist/css')} ${path.join(__dirname, '../dist/js')}`);

const appVersion = Date.now().toString();

versionConfig.appVersion = appVersion;

fs.writeFileSync(path.join(__dirname, '../server/config/version.json'), JSON.stringify(versionConfig, null, 2));

module.exports = merge(webpackBaseConfig, {
  entry: {
    app: path.join(__dirname, '../front/app')
  },
  output: {
    path: path.join(__dirname, '../dist/'),
    filename: `js/[name]_${appVersion}.js`,
    publicPath: process.env.BETA ? '//s.weituibao.com/beta/novel/' : '//s.weituibao.com/release/novel/'
  },
  plugins: [
    new ExtractTextPlugin({
      filename: `css/[name]_${appVersion}.css`,
      disable: false,
      allChunks: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_debugger: true,
        drop_console: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    })
  ]
});

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const { exec } = require('shelljs');

const versionConfig = require(path.join(__dirname, '../server/config/version.json'));

exec(`rm -rf ${path.join(__dirname, '../dist/vendor')}`);

const vendorJsVersion = Date.now().toString();

versionConfig.vendorJsVersion = vendorJsVersion;

fs.writeFileSync(path.join(__dirname, '../server/config/version.json'), JSON.stringify(versionConfig, null, 2));

module.exports = {
  entry: {
    vendor: ['babel-polyfill', 'react', 'react-dom', 'dva', 'antd'],
  },
  output: {
    path: path.join(__dirname, '../dist/vendor/'),
    filename: `[name]_${vendorJsVersion}.min.js`,
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '../dist/vendor/manifest.json'),
      name: '[name]',
      context: __dirname
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_debugger: true,
        drop_console: false
      }
    })
  ]
};

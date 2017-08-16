var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
var bundleConfig = require("../" + config.build.dll + "/bundle-config.json")

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: 'index.html',
    //   inject: true
    // }),
    new FriendlyErrorsPlugin()
  ]
})

const params = {
  libJsName: bundleConfig.libs.js ? '../' + config.build.dll + '/' + bundleConfig.libs.js : '', 
  libCssName: bundleConfig.libs.css ? '../' + config.build.dll + '/' + bundleConfig.libs.css : '',
  env: config.dev.env,
}

utils.setHtmlOutputPlugin(utils.getEntries('./src/module/**/index.ejs'), params).forEach(function(item) {
  webpackConfig.plugins.push(new HtmlWebpackPlugin(item));
});

module.exports = webpackConfig
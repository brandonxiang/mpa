var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var MultipageWebpackPlugin = require('multipage-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var bundleConfig = require("../" + config.build.dllFolder + "/bundle-config.json")

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

var env = {{#if_or unit e2e}}process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : {{/if_or}}config.build.env

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),

    new MultipageWebpackPlugin({
      bootstrapFilename: utils.assetsPath('js/manifest.[chunkhash].js'),
      templateFilename: '[name].html',
      templatePath: config.build.assetsRoot + config.build.assetsHtml,
      htmlTemplatePath: resolve('src/module/[name]/index.ejs'),
      htmlWebpackPluginOptions: {
          inject: true,
          minify: {
            removeComments: true,
            removeAttributeQuotes: true,
            minifyJS: true,
            minifyCSS: true,
            collapseWhitespace: true,
            removeOptionalTags: true,
            removeScriptTypeAttributes: true,
            processConditionalComments: true,
          },
          // favicon: utils.assetsPath('img/icons/favicon.ico'),
          chunksSortMode: 'auto',
          libJsName: bundleConfig.libs.js ? '../' + config.build.dllFolder + '/' + bundleConfig.libs.js : '', 
          libCssName: bundleConfig.libs.css ? '../' + config.build.dllFolder + '/' + bundleConfig.libs.css : '',
          env: config.dev.env,
      }
    }),

    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

if (config.build.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig

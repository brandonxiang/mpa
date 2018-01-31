'use strict'
const path = require('path')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const packageConfig = require('../package.json')
const fs = require('fs')

exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}


const getEntries = function (pageDir, entryPath) {
  var whiteList = undefined;
  var blackList = undefined;
  if (process.env.NODE_ENV === 'production') {
    var moduleArray = process.argv.slice(2);
    if (moduleArray.length !== 0) {
      whiteList = moduleArray;
    } 
    blackList = config.build.blackList;
  }

  var entry = {};
  var pageDirPath = path.join(__dirname, '..', pageDir);
  fs.readdirSync(pageDirPath)
    // 发现文件夹，就认为是页面模块
    .filter(function (f) {
      var isDirectory = fs.statSync(path.join(pageDirPath, f)).isDirectory();
      if (whiteList) return whiteList.indexOf(f) > -1 && isDirectory;
      if (blackList) return blackList.indexOf(f) === -1 && isDirectory;
      return isDirectory;
    })
    .forEach(function (f) {
      entry[path.basename(f)] = [pageDir, f, entryPath].join('/');
    });
  return entry;
};

exports.getEntries = getEntries

exports.setMultipagePlugin = function (webpackConfig, pageDir, entryPath, htmlOptions) {
  
    const bundleConfig = require(`../${config.dll.path}/bundle-config.json`)
    const libJsName =  bundleConfig.libs.js ? `../${config.dll.path}/${bundleConfig.libs.js}` : ''
    const libCssName = bundleConfig.libs.css ? `../${config.dll.path}/${bundleConfig.libs.css}` : ''
  
    const pages = getEntries(pageDir, entryPath)
    if (!webpackConfig.plugins) {
      webpackConfig.plugins = []
    }
    for (let pathname in pages) {
      const opt = Object.assign({}, {
        filename: 'module/' + pathname + '.html',
        template: pages[pathname],
        chunks: ['manifest', 'vendor', pathname],
        libJsName,
        libCssName,
      }, htmlOptions);
      webpackConfig.plugins.push(new HtmlWebpackPlugin(opt))
    }
    return webpackConfig
  }
  
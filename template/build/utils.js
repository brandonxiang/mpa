var path = require('path')
var config = require('../config')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var glob = require('glob')

exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    var loaders = [cssLoader]
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
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}

/**
 * 各个模块下面的js/css/html文件不能使用相同的名字,页面中会引用所有模块的CSS和JS文件
 * 如现有架构中每个模块的main.js，需要重命令为模块的名字,例：
 * { 'module/classmates/classmates': './src/module/classmates/main.js',
  'module/login/login': './src/module/login/main.js' }
 * @param globPath
 * @return {{}}
 */
exports.getEntries = function (globPath) {
  let entries = {},
    basename,
    tmp,
    pathname;
  glob.sync(globPath).forEach((entry) => {
    basename = path.basename(entry, path.extname(entry));
    tmp = entry.split('/').splice(-3);
    pathname = tmp.slice(0, 2).join('/'); // 正确输出js路径
    entries[pathname] = entry;
  });

  return entries;
};


exports.setHtmlOutputPlugin = function (pages, params) {
  let htmlPlugins = [];
  for (let pathname in pages) {

    let arr = ['manifest', 'vendor', pathname];
    const plugin = Object.assign({}, {
      filename: pathname + '.html',
      template: pages[pathname],
      inject: true,
      minify: {
        removeComments: true,         // 带html注释
        collapseWhitespace: true,
        minifyJS: true,
        minifyCSS: true,
      },
      hash: false,
      chunks: arr,
      chunksSortMode: 'dependency'
    },
      params
    );
    htmlPlugins.push(plugin);
  }
  return htmlPlugins;
}
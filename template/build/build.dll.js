var path              = require('path');
var utils             = require('./utils')

var webpack           = require('webpack');
var config            = require('../config')
var utils             = require('./utils')
var dllConfig         = require('./webpack.dll.conf');

var chalk             = require('chalk')
var rm                = require('rimraf')
var ora = require('ora')
var spinner = ora({
  color: 'green',
  text: 'DLL Packages are being built......'
})
spinner.start()
rm(path.resolve(__dirname, '../' + config.build.dll),  err => {
  if (err) throw err
  webpack(dllConfig,function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
          colors: true,
          modules: false,
          children: false,
          chunks: false,
          chunkModules: false
        }) + '\n\n')

    console.log(chalk.cyan('DLL Packages are built.\n'))
  })
});

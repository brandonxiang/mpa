# vue-multi

It is a vue template for multipage project powered by [vue-cli](https://github.com/vuejs/vue-cli).

## Usage

``` bash
$ npm install -g vue-cli
$ vue init -c http://git-ma.paic.com.cn/PaicFE/mpa.git my-project
$ cd my-project
$ npm install
$ npm run build:dll
$ npm run dev
$ npm run build
```

## Features

- [multipage-webpack-plugin](https://github.com/mutualofomaha/multipage-webpack-plugin) 
- DllReferencePlugin
- [ejs-compiled-loader](https://github.com/bazilio91/ejs-compiled-loader)
- `--nomap` command line for no productionSourceMap
- whitelist for package-building

## Usage

#### DLL Package build

```bash
npm run build:dll
```
> DLL Package is placed in `static` folder. If you want to pack more repos into DLL Package, 

#### Template EJS

Please place your own ejs template into `ejs` folder.

- [head](template/src/ejs/head.ejs) header in html
- [loading](template/src/ejs/loading.ejs) globally loading plugins  
- [rem](template/src/ejs/rem.ejs) suitable in rem unit


#### No Production SourceMap

```bash
npm run build --nomap
```

#### WhiteList for Package-building

In the `config/index.js`, you can filter those packages which you want to build based on a whiteList.

```javascript
whiteList: ['Hello', 'eCommand', 'Pingan'],
```

Or

you can filtr them using a commandline.

```
npm run build Hello eCommand Pingan
```

## Licence

[MIT](LICENSE)






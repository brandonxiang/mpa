# mpa

It is a vue template for multipage project powered by [vue-cli](https://github.com/vuejs/vue-cli).

## Usage

``` bash
$ npm install -g vue-cli
$ vue init brandonxiang/mpa my-project
$ cd my-project
$ npm install
$ npm run build:dll
$ npm run dev
$ npm run build
```

## Features

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

#### BlackList for Package-building

In the `config/index.js`, you can filter those packages which you want to build based on a whiteList.

```javascript
blackList: ['Hello', 'eCommand', 'Pingan'],
```

Or

you can filtr them using a commandline.

```
npm run build Hello eCommand Pingan
```

## Licence

[MIT](LICENSE)

## 中文文档

我记得去年很多人看了我《用Webpack构建Vue》一篇文章，但是因为webpack和vue升级速度很快，那文章很快就过时了。学习vue最好的教材莫过于[vue-cli](https://github.com/vuejs/vue-cli)直接生成的单页面项目。可惜的是它不过是一个单页面的项目，在我们的实际生产环境中，往往都是较为分散的页面，为的是保证项目的解耦。

> [饿了么的 PWA 升级实践](https://huangxuan.me/2017/07/12/upgrading-eleme-to-pwa/)正讲到饿了么的超大型SPA如何解耦成MPA的过程。

## 多页面脚手架

> github源码在此，记得点星: 
https://github.com/brandonxiang/mpa

#### 特点

- 多个入口
- DllReferencePlugin 利用控制多页面常用包
- CommonsChunkPlugin 控制多页面的公用包
- ejs模版语言控制html
- --nomap 命令控制sourceMap
- whitelist 控制专门打包

#### 使用方法

```bash
$ npm install -g vue-cli
$ vue init brandonxiang/mpa my-project
$ cd my-project
$ npm install
$ npm run build:dll
$ npm run dev
$ npm run build
```

#### 用法

第一点，JS包的大小直接影响着首屏弱网情况下的页面加载情况，DllReferencePlugin和CommonsChunkPlugin就有效拆分公用包的大小，每个包控制在100k左右。

dll打包在`config`中的`dll.js`中控制，把公共全量使用的npm包写入配置文件：

```
module.exports = {
  path: 'static/dll',
  libs: [
    'vue/dist/vue.esm.js',
    'vue-router',
  ],
}
```

在`npm run dev`和`npm run build`前使用`npm run build:dll`去打固定dll包，提高打包调试的效率。

第二点，模版语言在html-webpack-plugin中的使用，将一些关键代码内联拼接在html中。例如：

- header中的meta（包括dns预解析等）
- loading全局插件
- 计算rem的单位
- 关键全局样式

第三点，黑名单的打包

在`config/index.js`配置黑名单，有些项目将不会打包。

```javascript
blackList: ['Hello', 'eCommand', 'Pingan'],
```

同时，我们也可以专门指定打几个包。

```
npm run build Hello eCommand Pingan
```

## 性能优化

参考[【技术研究】vue项目的性能优化之路](https://www.jianshu.com/p/40b04701c571)

## Webpack3 的升级

Webpack的版本升级速度真的是非常快，快得无法想象。有幸经历1到2和2到3的升级，体验了一步一步的性能优化。同期无论是 [rollup]() 还是 [parcel]() 的出现，他们的优缺点很好地反哺了webpack的优化点。parcel的出现又一次让人反思“wbepack的配置是不是太过于繁琐”，但是parcel由不够成熟，而且tree-shaking和scope-hoisting的缺席。所以，现在前端工程化中，能投入生产的还是webpack，我也相信webpack4会变得更好。

[多页面脚手架](https://github.com/brandonxiang/mpa)正是采用全新的webpack3构建，里面包含它的“内容不变hash值不变”的特性，欢迎大家指点评论。

转载，请表明出处。[总目录前段收集器](http://www.jianshu.com/p/c1e3b96c1293)

![微信公众号](http://upload-images.jianshu.io/upload_images/685800-b90086f21952919c.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)











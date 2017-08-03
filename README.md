# smart-modularity-fis3
一个基于 FIS3 与 Vue、关注开发过程与开发体验提升的多页面模块化构建方案。

该构建方案依赖于 FIS3 构建工具，如需了解更多 FIS3 信息，请访问 [FIS3 官网](https://fex.baidu.com/fis3/)

## 安装
目前没有实现脚手架工具，暂时需要手动 copy 项目源码到本地。

## smart-modularity-fis3 能力
1. **纯前端模板编译构建**。通过继承 layout 模板，我们只需要编写每个页面的私有部分，框架会自动构建出 HTML。
2. **vue 组件同名资源自动依赖**。每个文件夹就是一个组件，每个组件的 `.js`、`.tpl`（vue template）、`.scss`文件会自动加入依赖，不需要显式依赖。
3. **smart scope（智能命名空间）**。针对每个 vue 组件文件（js、tpl、scss），我编写了一个预处理脚本，用以将文件中的 SCOPE 占位符替换为唯一标识的组件id，这样在进行组件开发时我们就不需要花时间在思考命名和防止命名空间的冲突上。我们采用 BEM 命名规则，SCOPE 替代了 Block 部分。
4. **CSS3 autoprefixer**。CSS3 浏览器前缀补齐，借助 fis3 的社区插件实现。
5. **eslint**。我编写了一份适配于 FIS3 的编译脚本以及比较完善的 lint 校验配置。
6. **资源定位**。借助 FIS3 的能力，我们可以规定每类文件甚至每个文件的产出路径，在构建时 FIS3 会自动修改其他文件对于这些资源的引用路径，这样我们开发时只需要关注源码路径即可。
7. **资源合并**。在产出生产环境包时，当前的合并规则是：每个页面通用的 lib 文件合成一个 js 文件，其他文件以页面纬度分别进行合并（filename.js、filename.css）。
8. **dev watch + livereload**。文件监听，增量编译，热刷新。
9. 组件按需加载。通过构建时创建资源依赖表，真正做到按需加载。
10. 一些通用特性，如生产环境添加哈希值，压缩，es6 编译，打包离线包等等都已实现。

## 目录规范
```
smart-modularity-fis3
├── fis-conf // fis 辅助配置文件
│   ├── lint // lint 规则配置
│   │   ├── config.js
│   │   └── index.js
│   ├──eslint.js // 适配 fis3 的 lint 编译脚本
│   ├── release-config.js // 产出目录配置
│   ├── smart-scope.js // 智能作用域实现脚本
│   └── tpl-base-url.js // 模板资源路径转换脚本
│
├── src
│   ├── components // 组件
│   │   ├── component // 全局组件
│   │   │   └── header
│   │   │        ├── header.js
│   │   │        ├── header.scss
│   │   │        └── header.tpl
│   │   ├── pages // 页面入口组件
│   │   │   └── home
│   │   │         ├── tab
│   │   │         │   ├── tab.js
│   │   │         │   ├── tab.scss
│   │   │         │   └── tab.tpl
│   │   │         ├── home.js
│   │   │         ├── home.scss
│   │   │         └── home.tpl
│   │   ├── image // 媒体文件
│   │   └── util // 存放工具文件，如 js、tool.scss
│   └── views // 视图文件
│        ├── pages // 页面模板文件
│        │   ├── layout
│        │   │   ├── layout.scss
│        │   │   └── layout.swig
│        │   └── home
│        │        └── home.swig
│        └── lib // 页面 lib 文件
│
├── fis-conf.js // fis3 配置文件
└── package.json
```
`src/components`：存放 vue 组件文件。
`src/views`：存放视图模板文件。

## 开发构建命令
开启静态服务器：
```
$ npm run server-start
// 或
$ fis3 server start
```

watch + livereload：
```
$ npm run watch
// 或
$ fis3 release -wclL
```
四个指令分别代表：`w`=>`watch`，`c`=>`clean`，`l`=>`lint`，`L`=>'livereload'。

## 开发流程及构建原理介绍
我们的页面组件基于 Vue 组件构建。

当我们需要开发一个新页面，我们要做的事情非常简单，只需两步。假设我们现在需要新建一个名为`home.html`的新页面：

第一步， 在`src/views`目录下创建`src/views/home/home.swig`文件，并依赖目标入口 Vue 组件，推荐使用同名入口组件。
```HTML
{% extends '../layout/layout.swig' %} <!-- 继承 layout 模板 -->

{% block title %}HOME{% endblock %}

{% block content %}
  <div id="root"></div>
{% endblock %}

{% block script %}
  <script type="text/javascript">
   //  依赖入口组件
    require('home/home.js').init($('#root')[0]);
  </script>
{% endblock %}
```

第二步，在`src/components/pages`文件夹中创建我们的入口组件（包括`js`、`scss`、`tpl`）。
`src/components/pages/home/home.js`：
```Javascript
var _ = require('../../util/util');
var header = require('../../component/header/header');
var empty = require('../../component/empty/empty');

exports.init = function (el) {
    new Vue({
        el: el,
        template: __inline('./home.tpl'),
        data: {
            activePanel: 1,
        },
        components: {
            'v-header': header,
            'v-empty': empty,
        },
    });
}
```
`src/components/pages/home/home.tpl`：
```HTML
<div class="SCOPE">
  <v-header></v-header>
  <div class="SCOPE_content">
    <div class="SCOPE_part" >
      <v-empty text="暂无看点数据"></v-empty>
    </div>
  </div>
</div>
```
`src/components/pages/home/home.scss`：
```
.SCOPE {
  margin: 0 auto;
  padding-top: 65px;

  &_content {
    border-radius: 2px;
    transition: all 0.1s;
    transform: translate(0,0);
  }
}
```
只需两步，页面即可初始化完成。

我们在构建时，以目录规范作为约束，将`src/components`中的组件文件都注册成了模块组件，并利用组件名（format：`组件父目录/组件名`，如`home/home.js`）作为模块 ID，在页面依赖组件后，构建工具会自动在 HTML 中添加组件 js 的引用。所以在 swig 模板文件中，我们可以很方便地依赖`src/components`中的模块，而不需要显式注入 script 的引用。

另外在`src/components`中创建组件时，我们只需要把关注点放在模块自身的编写上即可，构建工具会完成模块在资源表上的注册。

### swig 模板编译流程
下面介绍模板编译流程：

模板文件`layout.swig`：
```HTML
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="format-detection" content="telephone=no">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
    <meta name="wap-font-scale" content="no">
    <link rel="shortcut icon" href="xxx">
    <title>{% block title %}{% endblock %}</title>
    <script type="text/javascript">
        var t0 = Date.now();
        window._timePoints = [t0];
    </script><!--ignore-->
    <link rel="stylesheet" href="./layout/layout.scss">
    {% block style %}{% endblock %}
  </head>
  <body>
    {% block content %}{% endblock %}
    <script type="text/javascript">window._timePoints[1] = Date.now();</script><!--ignore-->
    <script src="../lib/mod/mod.js"></script>
    <script src="../lib/zepto/zepto.js"></script>
    <script src="../lib/vue/vue.js"></script>
    {% block script %}{% endblock %}
  </body>
</html>
```
在`layout.swig`中，我们可以做一些全局打点操作，引入页面报错插件或者通用 lib 文件。

**布局模板在一些位置安插了私有块，当我们需要新建一个页面时，只需要继承布局模板，再书写页面私有块即可。通过继承模板的特性，就可以很好地做到页面公共部分的抽离。**

例如我们现在要新建一个 home 页面，我们只需创建同名模板文件：
文件 `home.swig`：
```
{% extends '../layout/layout.swig' %}

{% block title %}HOME{% endblock %}

{% block content %}
  <div id="root"></div>
{% endblock %}

{% block script %}
  <script type="text/javascript">
   // 同步依赖，配合packager后所有依赖文件在构建时将会被一并打包
    require('home/home.js').init($('#root')[0]);
  </script>
{% endblock %}
```
经过构建以后，就会自动生成 HTML 文件。

FIS3 社区中的 swig 模板引擎的能力存在一点缺陷：include 或 extend 时做的事情比较单一，只负责板块的替换，而没有关注到资源路径的重新定位。可以想象，当 layout 模板文件和我们的页面模板文件的目录层级不一致时，就会存在编译出来的 HTML 文件定位不到 layout 引用资源的问题。

为了解决这个问题，我简单编写了一个路径替换脚本，我们在编译时可以设定资源 base 路径，脚本会通过判断 layout 文件和页面文件的目录层级关系再去修改资源路径。


### Vue 组件同名资源自动依赖与智能命名空间
这两者的组合可以让我们完全关注到组件本身的开发上，而不需要将精力放在组件资源依赖和防止命名冲突上。

在这套构建方案约定的开发规范中，一个组件就应该是一个文件夹，例如我们现在需要开发一个全局的 header 组件。

我们只需要像下面这样编写组件代码：

`src/components/component/header/header.js`：
```Javascript
module.exports = Vue.extend({
  template: __inline('./header.tpl'),
});
```

`src/components/component/header/header.tpl`：
```HTML
<nav class="SCOPE">
  <p class="SCOPE_title">QQ看点</p>
</nav>
```

`src/components/component/header/header.scss`：
```css
.SCOPE {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 65px
  text-align: center;
  background-color: #13bbfa;

  &_title {
    font-size: 18px;
    color: #fff;
    height: 65px;
    line_height: 65px;
  }
}
```
页面引入组件后，视觉效果与 DOM 片段如下：
![](https://github.com/gisonyeung/smart-modularity-fis3/readme-image/demo1.png)

DOM：
![](https://github.com/gisonyeung/smart-modularity-fis3/readme-image/demo2.png)

SCSS 文件会自动依赖到同名 vue 组件中，而文件中的 SCOPE 占位符会被自动替换成以组件 ID 为标识的字符串。

有了这两个特性，开发效率和开发体验倍涨。

### 资源定位
资源定位是 FIS3 一个很重要的特性，也是我个人比较喜欢的一个点。

通过编写 FIS3 的 match 规则，我们可以匹配到任何我们希望进行资源定位的 A 类（为方便区分自己取的名字）文件（HTML/CSS/JS）。另一方面，我们可以规定所有 B 类文件的构建产出路径（HTML/CSS/JS/MEDIA），当 B 类文件的产出路径改变时，FIS3 会在构建过程中自动去找到那些有引用到 B 类文件的 A 类文件，并修改它们对于 B 类文件的引用路径。

举个比较简单的例子：

我在 demo 的`empty`组件中引用了一张 empty 情景图：

`empty.tpl`：
```HTML
<div class="SCOPE">
  <img src="../../image/empty.png">
  <p>{{ text || '暂无数据' }}</p>
</div>
```
在`fis-conf.js`中，我们规定了对 IMG 文件的产出路径：
```
// [img]
fis.match('(*).{png,jepg,jpg,webp,gif}', {
    release: `/${release_config.child.static}/image/$1$2`
});
```
在最后构建出来的 HTML 文件中，对这个图片的资源引用就会自动被修改：
![](https://github.com/gisonyeung/smart-modularity-fis3/readme-image/demo3.png)

引用 FIS3 官网上对于资源定位的一段介绍：

>资源定位能力，可以有效地分离开发路径与部署路径之间的关系，工程师不再关心资源部署到线上之后去了哪里，变成了什么名字，这些都可以通过配置来指定。而工程师只需要使用相对路径来定位自己的开发资源即可。这样的好处是资源可以发布到任何静态资源服务器的任何路径上，而不用担心线上运行时找不到它们，而且代码具有很强的可移植性，甚至可以从一个产品线移植到另一个产品线而不用担心线上部署不一致的问题。

### 资源合并
在资源定位能力的基础上，FIS3 让我们可以很方便地根据需求做一些资源合并、资源压缩和 hash 操作。例如，我们可以规定当前页面上全部或部分`css`与`js`文件各自合并成一个 bundle，在规定 bundle 产出路径以后，FIS3 会自动替换掉页面上对于这些文件的引用。

例如，在开发环境下，我们的 HTML 文件引用如下：
![](https://github.com/gisonyeung/smart-modularity-fis3/readme-image/demo4.png)

我们目前在缓存粒度和 HTTP 请求数两者的折衷中做的打包方案是：每个页面通用的几个 lib 文件打包成一个 lib.bundle，其他文件以页面为纬度按文件类型打包。

生产环境下 FIS3 相关配置：
```Javascript
// 将 lib 中的js全部打包到一个文件中
fis3.match('src/views/lib/**/**.js', {
  packTo: `/${release_config.child.static}/pkg/lib.bundle.js`,
  parser: false,
})
// 生产环境增加 hash
.match('*.{js,css,png,jpeg,jpg,webp,gif}', {
  useHash: true
})
.match('::packager', {
  // npm install [-g] fis3-postpackager-loader
  // 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
  // API: https://github.com/fex-team/fis3-postpackager-loader
  postpackager: fis.plugin('loader', {
    resourceType: 'mod',
    useInlineMap: true, // 异步依赖时，资源映射表内嵌
    // 将每个页面中除 lib.bundle 以外的文件打包
    allInOne: {
      js: function(file) {
         return `/${release_config.child.static}/js/${file.filename}_aio.js`;
      },
      css: function(file) {
         return `/${release_config.child.static}/css/${file.filename}_aio.css`;
      },
      includeAsyncs: true, // 打包异步依赖
    }
  }),
  packager: fis.plugin('map'),
})
```

最后，看到生产环境的 HTML 页面引用如下：
![](https://github.com/gisonyeung/smart-modularity-fis3/readme-image/demo5.png)


### 一些其他的基本点
1. 增量编译。这是 fis3 原生支持的特性，在我们开启 watch 命令以后，增量编译就会被自动启动。
2. CSS3 Autoprefixer。CSS3 浏览器前缀自动补全，这是依靠插件实现的功能，我们书写 CSS3 时就不再需要手动去查 CSS3 hack。
3. Node 端同构直出。Node 端目前没有做，因为小组当前的业务暂时没有架设代理服务器。但是这个构建方案是对同构直出友好的，我们只需要在 Node 端渲染模板，在 HTML 主模块的 init 函数中传入 vue 组件初始化时需要的 data，就可以完成直出渲染，客户端拿到 HTML 时无须再请求这些数据，省去几次 HTTP 来回。


关于该构建方案的技术博客，敬请移步 [杨子聪的个人博客](http://www.yangzicong.com/article/12)。
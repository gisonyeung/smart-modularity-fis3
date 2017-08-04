# smart-modularity-fis3
一个基于 FIS3 与 Vue，关注开发过程提升开发体验的多页面模块化构建方案。

该构建方案依赖于 FIS3 构建工具，如需了解更多 FIS3 信息，请访问 [FIS3 官网](https://fex.baidu.com/fis3/)

## 安装
目前没有实现脚手架工具，暂时需要手动 copy 项目源码到本地。

## smart-modularity-fis3 能力
1. **纯前端模板编译构建**。通过继承 layout 模板，我们只需要编写每个页面的私有部分，在构建时会自动 HTML。
2. **vue 组件同名资源自动依赖**。每个组件就是一个文件夹，每个组件的三类文件`*.js`、`*.tpl`（vue template）、`*.scss`会自动相互依赖，不需要显式依赖。
3. **smart scope（智能命名空间）**。针对每个 vue 组件文件（js、tpl、scss），我编写了一个预处理脚本，用以将文件中的 SCOPE 占位符替换为唯一标识的组件 ID，这样在进行组件开发时我们就不需要花时间在思考命名和防止命名空间的冲突上。我们采用 BEM 命名规则，SCOPE 占位符替代了 Block 部分。
4. **CSS3 autoprefixer**。CSS3 浏览器前缀补齐，借助 FIS3 的社区插件实现。
5. **eslint**。我编写了一份适配于 FIS3 的编译脚本以及比较完善的 lint 校验配置。
6. **资源定位**。借助 FIS3 的能力，我们可以规定每类文件甚至每个文件的产出路径，在构建时 FIS3 会自动修改其他文件对于这些资源的引用路径，这样我们开发时只需要关注源码路径即可。
7. **资源合并**。在产出生产环境包时，当前的合并规则是：每个页面通用的 lib 文件合成一个 js 文件，其他文件以页面纬度分别进行合并（filename.js、filename.css）。
8. **dev watch + livereload**。文件监听，增量编译，热刷新。
9. **组件按需加载**。通过构建时创建资源依赖表，真正做到按需加载。
10. 剩下的一些通用特性，如生产环境添加哈希值，压缩，es6 编译，打包离线包等等都有相关实现。

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
* `fis-conf`：存放 FIS3 相关的配置文件
* `src/components`：存放 vue 组件文件。
* `src/components/component`：存放全局组件。
* `src/components/pages`：存放页面入口组件与页面私有组件。
* `src/components/util`：存放组件通用的工具文件，如` util.js`、`tool.scss`。
* `src/views`：存放视图模板文件。

## 开发构建命令
开发时开启 watch + livereload：
```
$ npm run watch
// 或
$ fis3 release -wclL
```
四个指令分别代表：
* `w`=>`watch` 文件监听；
* `c`=>`clean` 清除缓存；
* `l`=>`lint` lint 校验；
* `L`=>`livereload` 自动刷新。

开启静态服务器：
```
$ npm run server-start
// 或
$ fis3 server start
```


## 开发流程及构建原理介绍
当我们需要开发一个新页面时，我们要做的事情非常简单，只需两步。假设我们要新建一个名为`home.html`的新页面：

第一步， 在`src/views`目录下创建`src/views/home/home.swig`文件，并依赖入口 vue 组件。
```
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

home 组件入口 js 文件`src/components/pages/home/home.js`：
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
组件模板文件`src/components/pages/home/home.tpl`：
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
组件样式`src/components/pages/home/home.scss`：
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
就这样，便完成了页面的初始化。

值得一提的是，我们在构建时，以目录规范作为约束，将`src/components`中的组件文件都注册成了全局模块组件，并利用组件名作为模块 ID，这样在依赖组件时我们就不需要书写完整的依赖路径，并且**在页面依赖入口组件后，构建工具会自动在构建完成的 HTML 中添加入口组件 js 的引用，我们无需显式引用**。

**所以在 Swig 模板文件中，我们可以很方便地依赖`src/components`中的组件模块，而不需要显式注入 script 的引用。**

另外在`src/components`中创建组件时，我们只需要把关注点放在模块自身的编写上即可，构建工具会完成模块在资源表上的注册。


关于该构建方案更详细的技术博客，敬请移步 [杨子聪的个人博客](http://www.yangzicong.com/article/13)。
/*
 * created by gisonyang on 2017/07/29
 */

// 构建目录配置
var release_config = require('./fis-conf/release-config');

// css smart scope placeholder
var smartScopePlaceholder = 'SCOPE';
fis.set('scope-placeholder', smartScopePlaceholder);
var ss = require('./fis-conf/smart-scope');

// swig 模板资源路径预处理器
var addBaseUrl = require('./fis-conf/tpl-base-url');

// hook 插件，添加模块化支持
// npm install [-g] fis3-hook-module
fis.hook('module', {
    mode: 'mod'
});

// 构建忽略目录
fis.set('project.ignore',[
    'node_modules/**',
    `${release_config.child.static}/**`, 
    'fis-conf/**', 
    'src/views/lib/**', 
    'fis-conf.js', 
    'package.json',
    'offline/**',
    `${release_config.root}/**`,
    '*.log',
    '.eslintrc',
    '.gitignore',
    'test/**'
]);

//components下面的所有js资源都是组件化资源
fis.match("src/components/**", {
    isMod: true,
    release: `/${release_config.child.static}/$0`,
    useSameNameRequire: true,
});

// tpl 文件已经内联，不产出
fis.match("*.tpl", {
    release: false
})

// [html] *.swig => *.html
fis.match('(*).swig', {
    parser: fis.plugin('swig2', {tagControls: ['{%', '%}']}),
    preprocessor: addBaseUrl('src/views/pages'), // swig 模板执行 extends 语句时不会进行资源定位，所以需要自己写一个预处理器
    rExt: '.html',
    isHtmlLike: true,
    useCache: false,
    useSameNameRequire: true,
})
// 不产出 layout.html
fis.match('**/layout.swig', {
    release: false
});

fis.match('*.vue', {
    isMod: true,
    rExt: 'js',
    useSameNameRequire: true,
    parser: fis.plugin('vue-component', {
        // vue@2.x runtimeOnly 
        runtimeOnly: true,          // vue@2.x 有runtimeOnly模式，为ture时，template会在构建时转为render方法 
        // styleNameJoin 
        styleNameJoin: '',          // 样式文件命名连接符 `component-xx-a.css` 
        extractCSS: true,           // 是否将css生成新的文件, 如果为false, 则会内联到js中 
        // css scoped 
        cssScopedIdPrefix: '_v-',   // hash前缀：_v-23j232jj 
        cssScopedHashType: 'sum',   // hash生成模式，num：使用`hash-sum`, md5: 使用`fis.util.md5` 
        cssScopedHashLength: 8,     // hash 长度，cssScopedHashType为md5时有效 
        cssScopedFlag: '__vuec__',  // 兼容旧的ccs scoped模式而存在，此例子会将组件中所有的`__vuec__`替换为 `scoped id`，不需要设为空 
    }),
    postprocessor: ss.vue
});

fis.match('*.vue:js', {
    isMod: true,
    rExt: 'js',
    useSameNameRequire: true,
    lint: require('./fis-conf/eslint.js'),
    parser: fis.plugin('babel'),
});



fis.match('*.vue:scss', {
    // fis-parser-node-sass 插件进行解析
    // npm install [-g] fis3-parser-node-sass
    parser: fis.plugin('node-sass'),
    // CSS3 自动前缀
    preprocessor : fis.plugin("autoprefixer",{
        "browsers": ["Android >= 2.1", "iOS >= 4", "ie >= 8", "firefox >= 15"],
        "cascade": true,
    }),
    // smart scope
    postprocessor: ss.css,
    isCssLike: true,
    // .scss 文件后缀构建后被改成 .css 文件
    rExt: '.css',
});


// [css] *.scss => *.css
fis.match('*.scss', {
    // fis-parser-node-sass 插件进行解析
    // npm install [-g] fis3-parser-node-sass
    parser: fis.plugin('node-sass'),
    // CSS3 自动前缀
    preprocessor : fis.plugin("autoprefixer",{
        "browsers": ["Android >= 2.1", "iOS >= 4", "ie >= 8", "firefox >= 15"],
        "cascade": true,
    }),
    // smart scope
    postprocessor: ss.css,
    isCssLike: true,
    // .scss 文件后缀构建后被改成 .css 文件
    rExt: '.css',
});
// 不产出 util 中的css
fis.match('src/components/util/*.scss', {
    release: false
})

// component组件资源id支持简写
fis.match(/^\/src\/components\/(component|pages|util)\/(.*)$/i, {
    id : '$2'
});

// tpl smart scope
fis.match('*.tpl', {
    postprocessor: ss.tpl,
    useCache: false
});

// [js] js smart scope & lint
fis.match('*.js', {
    lint: require('./fis-conf/eslint.js'),
    parser: ss.js,
});

// [img]
fis.match('(*).{png,jepg,jpg,webp,gif}', {
    release: `/${release_config.child.static}/image/$1$2`
});

fis.match('::packager', {
    // npm install [-g] fis3-postpackager-loader
    // 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
    postpackager: fis.plugin('loader', {
        resourceType: 'mod',
        useInlineMap: true, // 资源映射表内嵌
    }),
    packager: fis.plugin('map'),
})

// 生产环境下CSS、JS压缩合并，并产出项目
// 使用方法 fis3 release prod
release_pipe(fis.media('prod'))
    // 将项目产出到 ./${release_config.root} 目录 
    .match('**', {
       // npm install [-g] fis3-deploy-skip-packed
        deploy: [
            fis.plugin('skip-packed', {
              skipPackedToPkg: true, // 过滤掉被打包的文件
              skipPackedToAIO: true, // 滤掉被 AllInOne 打包的文件
              skipPackedToCssSprite: true, // 过滤掉被 css sprite 合并的文件
            }),
            fis.plugin('local-deliver', {
                to: `./${release_config.root}`
            }),
        ]
    });

// 产出 zip
// 使用方法 fis3 release zip
release_pipe(fis.media('zip'))
    // 将产出文件打包成 zip
    .match('**', { 
        // npm install [-g] fis3-deploy-zip
        // npm install [-g] fis3-deploy-skip-packed
        deploy: [
            fis.plugin('skip-packed', {
              skipPackedToPkg: true, // 过滤掉被打包的文件
              skipPackedToAIO: true, // 滤掉被 AllInOne 打包的文件
              skipPackedToCssSprite: true, // 过滤掉被 css sprite 合并的文件
            }),
            fis.plugin('zip', {
                filename: 'offline.zip'
            }),
            fis.plugin('local-deliver', {
                to: './offline'
            }),
        ]
    });


function release_pipe(head) {
    return head
        .match('(*).swig',{
            release: `/${release_config.child.pages}`,
            optimizer: fis.plugin('html-minifier')     
        })
        .match('**/layout.swig', {
            release: false
        })
        // npm install [-g] fis3-parser-babel
        // npm install [-g] babel-core
        .match('*.js', {
            // es6 => es5
            parser: fis.plugin('babel'),
            optimizer: fis.plugin('uglify-js')
        })
        // 将 lib 中的js全部打包到一个文件中
        .match('src/views/lib/**/**.js', {
            packTo: `/${release_config.child.static}/pkg/lib.bundle.js`,
            parser: false,
        })
        // 生产环境增加 hash
        .match('*.{js,css,png,jpeg,jpg,webp,gif}', {
            useHash: true
        })
        .match('*.scss', {
            // compress css
            optimizer: fis.plugin('clean-css')
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
};
/*
 * created by gisonyang on 2017/07/29
 */

// css smart scope placeholder
var smartScopePlaceholder = 'SCOPE';
fis.set('scope-placeholder', smartScopePlaceholder);
var ss = require('./fis-conf/smart-scope');

// hook 插件，模块化支持
// npm install [-g] fis3-hook-module
fis.hook('module', {
    mode: 'mod'
});

// 构建忽略目录
fis.set('project.ignore',[
	'node_modules/**',
    'public/**', 
    'fis-conf/**', 
    'src/views/lib/**', 
    'fis-conf.js', 
    'package.json',
    'offline/**',
    'dist/**',
    '*.log',
    '.eslintrc',
    '.gitignore',
]);

//components下面的所有js资源都是组件化资源
fis.match("src/components/**", {
    isMod: true,
    release: '/public/$0',
    useSameNameRequire: true,
});

// *.swig => *.html
fis.match('*.swig', {
	parser: fis.plugin('swig2', {tagControls: ['{%', '%}']}),
	rExt: '.html',
	isHtmlLike: true,
	useCache: false,
	useSameNameRequire: true,
})

// *.scss => *.css
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
	rExt: '.css'
});

//component组件资源id支持简写
fis.match(/^\/src\/components\/(component|pages|util)\/(.*)$/i, {
    id : '$2'
});

// tpl smart scope
fis.match('*.tpl', {
    postprocessor: ss.tpl,
    useCache: false
});

// js smart scope & lint
fis.match('*.js', {
    lint: require('./fis-conf/eslint.js'),
    parser: ss.js
});

// 将 lib 中的js全部打包到一个文件中
fis.match('src/views/lib/**/**.js', {
    packTo: '/public/pkg/lib.bundle.js'
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

//生产环境下CSS、JS压缩合并，并产出项目
//使用方法 fis3 release prod
fis.media('prod')
    .match('**.js', {
        optimizer: fis.plugin('uglify-js')
    })
    .match('**.css', {
        optimizer: fis.plugin('clean-css')
    })
    .match('::packager', {
        // npm install [-g] fis3-postpackager-loader
        // 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
        postpackager: fis.plugin('loader', {
            resourceType: 'mod',
            useInlineMap: true, // 资源映射表内嵌
            // 将每个页面中除 lib.bundle 以外的文件打包
            allInOne: {
                js: function(file) {
                    return "/public/js/" + file.filename + '_aio.js';
                },
                css: function(file) {
                    return "/public/css/" + file.filename + '_aio.css';
                }
            }
        }),
        packager: fis.plugin('map'),
    })
    // 将项目产出到 ./dist 目录 
    .match('**', {
       // npm install [-g] fis3-deploy-skip-packed
        deploy: [
            fis.plugin('skip-packed', {
              skipPackedToPkg: true, // 过滤掉被打包的文件
              skipPackedToAIO: true, // 滤掉被 AllInOne 打包的文件
              skipPackedToCssSprite: true, // 过滤掉被 css sprite 合并的文件
            }),
            fis.plugin('local-deliver', {
                to: './dist'
            }),
        ]
    });

//产出 zip
//使用方法 fis3 release zip
fis.media('zip')
    .match('**.js', {
        optimizer: fis.plugin('uglify-js')
    })
    .match('**.css', {
        optimizer: fis.plugin('clean-css')
    })
    .match('::packager', {
        // npm install [-g] fis3-postpackager-loader
        // 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
        postpackager: fis.plugin('loader', {
            resourceType: 'mod',
            useInlineMap: true, // 资源映射表内嵌
            // 将每个页面中除 lib.bundle 以外的文件打包
            allInOne: {
                js: function(file) {
                    return "/public/js/" + file.filename + '_aio.js';
                },
                css: function(file) {
                    return "/public/css/" + file.filename + '_aio.css';
                }
            }
        }),
        packager: fis.plugin('map'),
    })
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


// 构建目录配置
var release_config = {
    root: 'dist', // 产出目录
    child: {
        static: 'static', // 静态资源目录
        pages: 'pages/$1/$1.html' // 页面目录
    }
}

module.exports = release_config;
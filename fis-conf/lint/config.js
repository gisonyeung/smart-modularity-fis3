// 需要检查的目录
var roots = [
    'src/components',
    'src/views/',
];

// 不校验的文件
var excludes = [
    /^\/src\/views\/lib\//,
];

// 全局变量
var globals = {
    // 客户端
    client: [
        '__inline',
        '__uri',
        'SCOPE',
        '$',
        'Vue',
        'define',
        'require',
    ],
    // 服务端
    // server: [
    //     'Promise',
    // ],
};

Object.getOwnPropertyNames(globals).forEach(function (key) {
    var res = {};

    globals[key].forEach(function (item) {
        res[item] = false;
    });

    globals[key] = res;
});

// 错误规则
var rules = {
    // 一般规则
    'no-undef': '变量未定义',
    'no-dupe-args': '函数参数重名',  // function (arg1, arg1)
    'no-dupe-keys': '对象属性重名',  // { key1: 'value1', key1: 'value2' }
    'no-duplicate-case': 'case重复',  // case 1: case 1:
    'no-constant-condition': '条件表达式为常量',  // if (true)
    'no-debugger': '禁止使用debugger',
    'no-func-assign': '禁止给函数赋值',  // foo = 0; function foo () {}
    'no-invalid-regexp': '正则语法错误',  // /[/
    'no-unreachable': '永远不会执行的代码',  // return; console.log('unreachable')
    'use-isnan': 'NaN要用isNaN()来判断',
    'valid-typeof': 'typeof类型拼错了',  // typeof foo === 'strin'
    'no-self-assign': '自己给自己赋值',  // foo = foo
    'no-self-compare': '自己跟自己比较',  // foo === foo
    'no-unmodified-loop-condition': '疑似手滑写的死循环',  // for (var i = 0; i < 10; j++)
    'no-shadow-restricted-names': '禁止用保留字当变量名',  // var Date
    // 奇葩规则
    'no-sparse-arrays': '数组多打了逗号',  // [1, , 2]
    'no-unexpected-multiline': '没加分号导致的潜在错误',
    'no-unsafe-finally': '可能出乎意料的finally语句',
    'no-octal-escape': '疑似手滑写的八进制编码',  // '\101' === 'A'
    'no-octal': '疑似手滑写的八进制数字',  // 010 === 8
};

exports.eslint = function (type) {
    var config = {
        parserOptions: {
            sourceType: 'module',
        },
        env: {
            commonjs: true,
        },
        rules: (function (rules) {
            var res = {};

            for (var key in rules) res[key] = 1;

            return res;
        })(rules),
    };

    switch (type) {
        case 'client':
            config.globals = globals.client;
            config.env.browser = true;
            break;
        case 'server':
            config.globals = globals.server;
            config.env.node = true;
            break;
        default:
            // do nothing
    }

    return config;
};

exports.excludes = excludes;
exports.globals = globals;
exports.roots = roots;
exports.rules = rules;
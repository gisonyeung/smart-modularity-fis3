var config = require('./lint/config');

module.exports = function (content, file, settings) {
    if (fis.compile.settings.watchFirstCompiling) return;

    var linter = require('eslint').linter;

    var isServerCode = !!file.id.match(/^server\//);
    var globals = config.globals[isServerCode ? 'server' : 'client'];

    for (var i = 0; i < config.excludes.length; i++) {
        var exclude = config.excludes[i];
        if (exclude.test(file.subpath)) return;
    }

    var res = linter.verify(content, {
        parserOptions: {
            sourceType: 'module',
        },
        env: {
            node: true,
            browser: true,
            es6: true,
            commonjs: true,
        },
        globals: globals,
        rules: (function (rules) {
            var res = {};

            for (var key in rules) res[key] = 1;

            return res;
        })(config.rules),
    })

    res.forEach(function (item) {
        if (item.ruleId) {
            console.log('\n[eslint][' + file.subpath + '][' + item.line + ':' + item.column + '][' + config.rules[item.ruleId] + '][' + item.message + ']:\n' + item.source);
        } else {
            console.log('\n[eslint][' + file.subpath + '][' + item.line + ':' + item.column + '][' + item.message + ']:\n' + item.source);
        }
    });

    if (res.length > 0 && fis.compile.settings.test) process.exit(1);
};
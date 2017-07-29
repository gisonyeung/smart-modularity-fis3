var fs = require('fs');
var path = require('path');
var linter = require('eslint').linter;
var config = require('./config');

var root = path.resolve(__dirname, '..');
var failed = false;

config.roots.forEach(function (r) {
    var file = path.resolve(root, r);

    (function process (file) {
        var excludes = config.excludes;
        
        for (var i = 0; i < excludes.length; i++) {
            if (excludes[i].test(getSubPath(file))) return;
        }
        
        if (fs.statSync(file).isDirectory()) {
            fs.readdirSync(file).forEach(function (subFile) {
                process(path.resolve(file, subFile));
            });
        } else {
            if (!file.match(/\.js$/)) return;
            
            var isServer = file.indexOf(path.resolve(root, 'server')) === 0;
            var type = isServer ? 'server' : 'client';
            var content = fs.readFileSync(file).toString();
            var res = linter.verify(content, config.eslint(type));

            res.forEach(function (item) {
                var subPath = getSubPath(file);
                
                if (item.ruleId) {
                    console.log('\n[eslint][' + subPath + '][' + item.line + ':' + item.column + '][' + config.rules[item.ruleId] + '][' + item.message + ']:\n' + item.source);
                } else {
                    console.log('\n[eslint][' + subPath + '][' + item.line + ':' + item.column + '][' + item.message + ']:\n' + item.source);
                }
            });

            if (res.length > 0) failed = true;
        }
    })(file);
});

if (failed) process.exit(1);

function getSubPath(file) {
    return file.substr(root.length);
}
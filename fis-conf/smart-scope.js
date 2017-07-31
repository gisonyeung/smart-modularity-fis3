/*
 * smart scope 预处理器
 * created by gisonyang on 2017/07/27
 */

var componentsRe = new RegExp('^components\\/')
var scopePlaceholder = fis.get('scope-placeholder')
var scopePlaceholderRe = new RegExp(scopePlaceholder, 'g')

exports.tpl = extend(function () {
    var that = this
    var re = new RegExp(scopePlaceholder + '(?:\\(([^\\)]*)\\))?', 'g')
    return this.content.replace(/class="([^"]+)"/g, function (m, classList) {
        return 'class="' + classList.replace(re, function (m, p1) {
            return that.replace(p1)
        }) + '"'
    })
})

exports.css = extend(function () {
    var that = this
    var re = new RegExp('\\.' + scopePlaceholder + '(?:\\(([^\\)]*)\\))?', 'g')

    return this.content.replace(re, function (m, p1) {
        return '.' + that.replace(p1)
    })
})

exports.js = extend(function () {
    var that = this
    var re = new RegExp(scopePlaceholder + '(?:\\((?:\'([^\\)]*)\')?\\))', 'g')

    return this.content.replace(re, function (m, p1) {
        return '\'' + that.replace(p1) + '\''
    })
})

function extend(fn) {
    return function (content, file) {
        var path =  file.toString().replace(fis.project.getProjectPath() + '/', '').replace(componentsRe, '').replace(/\/[^\/]+$/, '')
        if (!componentsRe.test(file.id)) {
            return fn.call({
                content: content,
                replace: replace,
            })
        } else {
           return content
        }

        function replace(p) {
            return resolve(path, p || '').replace(/\//g, '-')
        }
    }
}

function resolve(a, b) {
    var nodes = a.split('/')
    var bNodes = b ? b.split('/') : []

    bNodes.forEach(function (node) {
        if (node === '..') nodes.pop()
        else if (node === '.') return
        else nodes.push(node)
    })

    return nodes.join('/')
}
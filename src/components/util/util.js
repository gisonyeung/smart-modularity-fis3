var testUtil = () => {
	console.log('testUtil');
}
exports.testUtil = testUtil;

var qs = (function (search) {
    if (search[0] === '?') search = search.substr(1);

    var res = {};

    search.split('&').forEach(function (pairStr) {
        var kv = pairStr.split('=');
        var key = kv[0];
        var value = kv[1];

        if (key && value) res[key] = value;
    });

    return res;
})(location.search);
exports.qs = qs;

// var loadScript = (src, cb) => {
//     var script = document.createElement('script');
//     script.src = src;

//     script.onload = function () {
//         cb();
//     };

//     script.onerror = function (err) {
//         cb(err);
//     }

//     document.body.appendChild(script);
// }
// exports.loadScript = loadScript;
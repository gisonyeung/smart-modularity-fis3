var _ = require('../../util/util');
var header = require('../../component/header/header');
var tab = require('./tab/tab');


exports.init = function (el) {

	new Vue({
        el: el,
        template: __inline('./home.tpl'),
        data: {
            uin: 'uin',
        },
        components: {
            'v-header': header,
            'v-tab': tab
        },
        ready: function () {
            alert('[vue]:ready')
        }
    });

}
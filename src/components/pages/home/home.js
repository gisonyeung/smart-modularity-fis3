var _ = require('../../util/util');
var header = require('../../component/header/header');
var empty = require('../../component/empty/empty');
var tab = require('./tab/tab');

exports.init = function (el) {

    window.vBus = new Vue();

    new Vue({
        el: el,
        template: __inline('./home.tpl'),
        data: {
            activePanel: 1,
        },
        components: {
            'v-header': header,
            'v-tab': tab,
            'v-empty': empty,
        },
        created: function () {
            window.vBus.$on('togglePanel', (key) => {
                this.activePanel = key;
            });
        }
    });

}
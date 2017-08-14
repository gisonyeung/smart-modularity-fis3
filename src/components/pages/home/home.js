var _ = require('../../util/util');
var header = require('../../component/header/header.vue');
var empty = require('../../component/empty/empty.vue');
var tab = require('./tab/tab.vue');
var vBus = require('../../util/vBus');
var loading = require('../../component/loading/loading.vue');

exports.init = function (el) {

  new Vue({
    el: el,
    template: __inline('./home.tpl'),
    data: {
      activePanel: 1,
      isLoading: false,
      timerId: null,
      panels: [
        { key: 1, name: '看点', emptyName: '看点' },
        { key: 2, name: '视频', emptyName: '视频' },
        { key: 3, name: '关注', emptyName: '关注' },
        { key: 4, name: '我的', emptyName: '个人' },
      ]
    },
    components: {
      'v-header': header,
      'v-tab': tab,
      'v-empty': empty,
      'v-loading': loading,
    },
    created: function () {
      vBus.$on('togglePanel', (key) => {
        this.activePanel = key;
        this.isLoading = true;

        clearTimeout(this.timerId);
        this.timerId = setTimeout( () => {
          this.isLoading = false;
        }, 500);
      });
    },
    methods: {
      goback() {
        alert('goback');
      },
    }
  });

}
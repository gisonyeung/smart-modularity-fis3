var _ = require('../../util/util');
var header = require('../../component/header/header.vue');
var button = require('../../component/button/button.vue');
var interestSelector = require('./interest-selector/interest-selector.vue');
var vBus = require('../../util/vBus');

exports.init = function (el) {

  new Vue({
    el: el,
    template: __inline('./interest.tpl'),
    data: {
      disabled: true,
      items: ['娱乐','时尚范','视频','二次元','吃货','美容','科技达人','汽车','幽默','股票','时事','社会热点','旅游','军事迷','游戏','星座','运动'],
    },
    components: {
      'v-header': header,
      'v-button': button,
      'v-interest-selector': interestSelector,
    },
    methods: {
      doSetting() {
        alert('设置完成');
      },
      onChange(list) {
        this.disabled = !list.length;
      },
    }
  });

}
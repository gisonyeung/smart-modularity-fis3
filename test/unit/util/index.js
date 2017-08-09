import Vue from 'vue'

let util = {};

util.getVm = function(Component, propsData) {
  const Ctor = Vue.extend(Component)
  return new Ctor({ propsData: propsData }).$mount()
}

util.getRenderedText = function(Component, selector, propsData) {
  const Ctor = Vue.extend(Component)
  const vm = new Ctor({ propsData: propsData }).$mount()
  return selector ? vm.$el.querySelector(selector).textContent : vm.$el.textContent
}


export default util;
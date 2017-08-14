import Vue from 'vue'
import button from '@/component/button/button.vue'
import _ from '../util';

describe('button.vue', () => {

  it('disabled 为 false 时点击 button 应触发函数', () => {
  	var vm = _.getVm(button)
    expect(vm.clickHandler())
      .toEqual(true)
  })

  it('disabled 为 true 时点击 button 不触发函数', () => {
  	var vm = _.getVm(button, { disabled: true })
    expect(vm.clickHandler())
      .toEqual(false)
  })
  
})

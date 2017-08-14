import Vue from 'vue'
import empty from '@/component/empty/empty.vue'
import _ from '../util';

describe('empty.vue', () => {

  it('empty text 为空时应显示"暂无数据"', () => {
    expect(_.getRenderedText(empty, '.SCOPE p'))
      .toEqual('暂无数据')
  })

  it('传入 empty text 时应显示正确字符串', () => {
    expect(_.getRenderedText(empty, '.SCOPE p', { text: '暂无视频数据' }))
      .toEqual('暂无视频数据')
  })
  
})

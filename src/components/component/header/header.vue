<template>
  <nav 
    class="SCOPE" 
    :style="{
      backgroundColor: backgrounColor,
      height: heightPx,
      position: positionType
    }"
  >
    <i 
      class="icon icon-goback"
      v-if="hasGoback"
      :style="{
        paddingTop: heightPx,
      }"
      @click="gobackHandler"
    ></i>
    <h1 
      class="SCOPE_title"
      :style="{
        height: heightPx,
        lineHeight: heightPx,
        fontSize: fontSizePx,
      }"
    >{{ title }}</h1>
  </nav>
</template>

<script>
export default {
  props: {
    title: { default: '' },
    backgrounColor: {
      type: String,
      default: '#13bbfa'
    },
    height: {
      type: Number | String,
      default: 55
    },
    hasGoback: {
      type: Boolean,
      dafault: false
    },
    onGoback: {
      type: Function,
      default: function() {}
    },
    fontSize: {
      type: Number | String,
      default: 16
    },
    isFixed: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    heightPx: function() {
      return this.height + 'px'
    },
    fontSizePx: function() {
      return this.fontSize + 'px'
    },
    positionType: function() {
      return this.isFixed ? 'fixed' : 'static'
    },
  },
  methods: {
    gobackHandler(e) {
      this.onGoback(e);
    },
  }


}
</script>

<style lang="scss">

@import "../../util/tool.scss";

.SCOPE {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 55px;
  overflow: hidden;
  background-color: #13bbfa;
  text-align: center;

  &_title {
    display: inline-block;
    margin: 0;
    height: 55px;
    line-height: 55px;
    font-size: 16px;
    font-weight: 400;
    color: #fff;
  }

  .icon-goback {
    position: absolute;
    left: 10px;
    z-index: 10;
    @include bgsize(20px, 55px);
    @include bgimg_center('../../image/icon-goback.png');
  }
}

</style>
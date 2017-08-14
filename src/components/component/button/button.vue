<template>
  <button 
    :class="{SCOPE: true, disabled: disabled}"
    @click="clickHandler"
  >{{ text }}</button>
</template>

<script>

export default {
  data() {
    return {}
  },
  props: {
    text: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    onClick: {
      type: Function,
      default: function() {}
    }
  },
  methods: {
    clickHandler(e) {
      if (this.disabled) return false;
      this.onClick(e);
      return true;
    },
  },
}

</script>

<style lang="scss">
@import '../../util/tool.scss';
  .SCOPE {
    background-color: $themeColor;
    font-size: 14px;
    padding: 8px 20px;
    border: none;
    color: #fff;
    border-radius: 3px;
    @include transition;

    &:active {
      background-color: darken($themeColor, 3%);
    }

    &.disabled {
      background-color: #e4e4e4;
      color: #aaa;
    }

  }
</style>
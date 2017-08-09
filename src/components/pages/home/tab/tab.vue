<template>
  <ul class="SCOPE">
    <li 
      v-for="item in items"
      :key="item.key"
      :class="activePanel === item.key ? 'active' : ''"
      @click="toggleTab(item.key)"
    >
      {{item.name}}
    </li>
  </ul>
</template>

<script>
var vBus = require('../../../util/vBus');

export default {
  props: ['activePanel'],
  data: function() {
    return {
      items: [
        { key: 1, name: '看点' },
        { key: 2, name: '视频' },
        { key: 3, name: '关注' },
        { key: 4, name: '我的' },
      ]
    }
  },
  methods: {
    toggleTab(key) {
      vBus.$emit('togglePanel', key);
    },
  }
}
</script>

<style lang="scss">
@import "../../../util/tool.scss";

.SCOPE {
    margin: 0;
    padding: 0;
  list-style-type: none;
    font-size: 15px;
    color: #333;
    @extend %clearfix;

  li {
        display: inline-block;
        padding: 10px 0;
        width: 25%;
        float: left;
        text-align: center;
        border-bottom: 2px solid transparent;
        @include transition;

        &.active {
            border-color: $themeColor;
            color: $themeColor;
            background-color: #fff!important;;
        }

        &:hover {
            background-color: rgba(#ccc, 0.2);
        }
  }
}
</style>
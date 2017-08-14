<template>
	<div class="SCOPE">
    <div 
      v-for="(items, index) in itemsBlock"
      class="SCOPE_row"
      :key="index"
    >
      <span
        v-for="(item, i) in items"
        :class="{SCOPE_item: true, active: item.isActive}"
        :key="i"
        @click="onSelect(index,i)"
      >{{item.text}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    onChange: {
      type: Function,
      default: function() {}
    },
    items: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      itemsBlock: [],
      activeItems: [],
    }
  },
  watch: {
    items: function() {
      this.updateBlock();
    },
  },
  methods: {
    updateBlock() {
      let newBlock = [];
      this.itemsBlock.splice(0);
      for (let i = 1; i <= this.items.length; i++) {
        if (i % 5 == 1 || i % 5 == 3) {
          newBlock = [];
        }
        newBlock.push({ text: this.items[i-1], isActive: false });
        if (i % 5 == 2 || i % 5 == 0) {
          this.itemsBlock.push(newBlock);
        }
      }
    },
    onSelect(index,i) {
      let status = !this.itemsBlock[index][i].isActive;
      let text = this.itemsBlock[index][i].text;
      this.itemsBlock[index][i].isActive = status;

      if (status == false) {
        let j = this.activeItems.indexOf(text);
        this.activeItems.splice(j, 1);
      } else {
        this.activeItems.push(text);
      }

      this.onChange(this.activeItems);
    },
  },
  created() {
    this.updateBlock();
  },
}
</script>

<style lang="scss">
@import "../../../util/tool.scss";

.SCOPE {
  margin-top: 30px;

  &_row {
    text-align: center;
  }
  
  &_item {
    display: inline-block;
    padding: 6px 25px;
    margin-left: 10px;
    margin-top: 10px;
    border: 1px solid #ddd;
    border-radius: 20px;
    font-size: 13px;

    &:first-child {
      margin-left: 0;
    }

    &.active {
      border-color: $themeColor;
      color: $themeColor;
    }
  }
}
</style>
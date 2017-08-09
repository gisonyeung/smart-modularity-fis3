<template>
  <div class="SCOPE">
    <img src="../../image/empty.png">
    <p>{{ text || '暂无数据' }}</p>
  </div>
</template>

<script>
export default {
  props: ['text']
}
</script>

<style lang="scss">
.SCOPE {
  margin-top: 40px;
  text-align: center;

  p {
    font-size: 15px;
    color: #cdcdcd;
  }
}
</style>
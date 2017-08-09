<template>
  <nav class="SCOPE">
    <i class="SCOPE_brand"></i>
    <h1 class="SCOPE_title">QQ看点</h1>
  </nav>
</template>

<script>
export default {

}
</script>

<style lang="scss">

@import "../../util/tool.scss";

.SCOPE {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 65px;
  overflow: hidden;
  background-color: #13bbfa;
  text-align: center;

  &_brand {
    position: relative;
    top: 10px;
    @include bgsize(34px, 34px);
    @include bgimg('../../image/readinjoy_icon.png');
  }

  &_title {
    display: inline-block;
    margin: 0;
    height: 65px;
    line-height: 65px;
    font-size: 17px;
    font-weight: 400;
    color: #fff;
  }
}

</style>
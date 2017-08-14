<div class="SCOPE">
  <v-header
    title="阅读兴趣设置"
    :hasGoback="true"
  />
  <div class="SCOPE_content">
    <div class="top">
      <h1>猜你喜欢</h1>
      <p>根据你的选择，为你优先推送专属内容</p>
    </div>
    <div class="main">
      <v-interest-selector
        :items="items"
        :onChange="onChange"
      />
    </div>
  </div>
  <div class="SCOPE_setting">
    <v-button
      text="立即体验"
      :style="{
        width: '100%'
      }"
      :onClick="doSetting"
      :disabled="disabled"
    />
  </div>
</div>
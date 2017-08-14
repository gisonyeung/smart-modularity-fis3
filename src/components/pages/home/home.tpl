<div class="SCOPE">
  <v-header
    title="QQ看点"
    :hasGoback="true"
    :onGoback="goback"
  ></v-header>
  <v-tab
    :activePanel="activePanel"
    :items="panels"
  ></v-tab>
  <v-loading
    v-if="isLoading === true"
    :marginTop="25"
  ></v-loading>
  <div v-else class="SCOPE_content">
    <template v-for="panel in panels">
      <div 
        class="SCOPE_part"
        v-if="activePanel == panel.key"
      >
        <v-empty :text="'暂无' + panel.emptyName + '数据'"></v-empty>
      </div>
    </template>
  </div>
</div>
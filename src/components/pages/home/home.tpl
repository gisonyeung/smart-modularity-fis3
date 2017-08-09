<div class="SCOPE">
  <v-header
  ></v-header>
  <v-tab
    :activePanel="activePanel"
  ></v-tab>
  <v-loading
    v-if="isLoading === true"
    :marginTop="25"
  ></v-loading>
  <div v-else class="SCOPE_content">
    <div 
      class="SCOPE_part"
      v-if="activePanel == 1"
    >
      <v-empty text="暂无看点数据"></v-empty>
    </div>
    <div 
      class="SCOPE_part"
      v-if="activePanel == 2"
    >
      <v-empty 
        text="暂无视频数据" 
      ></v-empty>
    </div>
    <div 
      class="SCOPE_part"
      v-if="activePanel == 3"
    >
      <v-empty text="暂无关注数据"></v-empty>
    </div>
    <div 
      class="SCOPE_part"
      v-if="activePanel == 4"
    >
      <v-empty text="暂无个人数据"></v-empty>
    </div>

  </div>
</div>
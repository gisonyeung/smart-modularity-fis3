<ul class="SCOPE">
  <li 
    v-for="item in items"
    :key="item.key"
    :class="activeIndex === item.key ? 'active' : ''"
    @click="toggleTab(item.key)"
  >
    {{item.name}}
  </li>
</ul>
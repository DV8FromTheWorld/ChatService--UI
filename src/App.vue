<template>
  <div class="app">
    <Sidebar />
    <main class="app__main-content">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import Sidebar from '@/components/Sidebar.vue'

export default defineComponent({
  components: {
    Sidebar
  }
})
</script>

<style lang="stylus">
  //Probably should eventually remove/replace this nested '.app' with the top level `#app-container`
  .app
    width 100%
    height 100%
    display flex
</style>

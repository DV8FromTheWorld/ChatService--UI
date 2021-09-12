<template>
  <nav class="sidebar">
    <!-- Circle needed for accessing private channels -->
    <button
      v-for="guild of guildList"
      :key="guild.id"
      class="sidebar__guild">
      <span>{{getPlaceholderGuildIconFromName(guild.name)}}</span>
    </button>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState } from 'vuex'

export default defineComponent({
  data() {
    return {

    }
  },
  computed: {
    guildList() {
      return Object.values(this.guilds)
    },

    ...mapState({
      guilds: state => state.guilds
    })
  },
  methods: {
    getPlaceholderGuildIconFromName(guildName: string) : string {
      return guildName.split(' ').map(word => word[0]).join('')
    }
  }
})
</script>

<style lang="stylus">
  .sidebar
    display flex
    flex-direction column
    align-items center
    padding 1rem
    height 100%
    width 7.5rem
    background-color black

    &__guild
      border-radius 50%
      height 5rem
      width @height
      cursor pointer
      text-align center

      & + &
        margin-top 10px
</style>

<template>
  <div>
    <nav class="channel-selector">
      <div class="guild-details-header">
        Default Guild
      </div>

      <!-- TODO these should be buttons, but we need a real reset style sheet.  -->
      <div
        v-for="channel of channels"
        :key="channel.id"
        class="channel"
        :class="{
        'channel--current': channel.id === currentChannelId
      }"
        @click="handleChannelSelection(channel.id)">
        {{channel.name}}
      </div>

      <button @click="handleNewChannelCreate">
        + Create New Channel
      </button>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapGetters, mapState } from 'vuex'
import Channel from '@/entities/state/Channel'

export default defineComponent({

  computed: {
    ...mapState({
      currentChannelId: 'currentChannelId'
    }),
    ...mapGetters({
      currentChannel: 'currentChannel',
      messages: 'currentChannelMessageList',
      users: 'getOnlineUsers'
    }),
    channels() : Array<Channel> {
      return Object.values(this.$store.state.channels)
    }
  },
  methods: {
    handleChannelSelection(channelId: string) {
      this.$store.commit({
        type: 'CHANGE_CURRENT_CHANNEL',
        channelId
      })
    },
    async handleNewChannelCreate() {
      const channelName = prompt('Enter new channel new')
      if (!channelName) {
        return
      }

      await this.$services.channelService.createChannel(channelName)
    }
  }
})
</script>

<style lang="stylus" scoped>
  .channel-selector
    display flex
    flex-direction column
    width 20rem
    background-color gray
    height 100%

  .guild-details-header
    border-bottom 1px solid black
    padding 1rem

  .channel
    padding .5rem
    margin .5rem
    border-radius 3px
    cursor pointer

    & + &
      margin-top 0

    &:hover
      background rgba(255,255,255, .2)

    &:active,
    &--current,
    &--current:hover
      background rgba(255,255,255, .3)

</style>

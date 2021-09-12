<template>
  <main class="channel-page">
    <ChannelSelector />
    <section>
      <section>
        <header>
          <h2>Chat Log</h2>
          <small>Connected Users: {{totalOnlineUsers}}</small>
        </header>

        <div id="chat-log">
          <div
            v-for="message of messages"
            :key="message.id"
            :data-message-id="message.id">
            <span>{{message.content}}</span>
            <span>{{message.createdAt}}</span>
          </div>
        </div>
      </section>

      <section>
        <form @submit.prevent="handleChatSubmit">
          <div>
            <label>Send a Message!</label>
            <input v-model="messageInput" type="text" />
          </div>
          <button type="submit">
            Submit Message
          </button>
        </form>
      </section>
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import ChannelSelector from '@/components/ChannelSelector.vue'

import Channel from '@/entities/state/Channel'

import { mapGetters } from 'vuex'

export default defineComponent({
  components: {
    ChannelSelector
  },
  data() {
    return {
      //Local state
      messageInput: '',
      channelInput: ''
    }
  },
  computed: {
    ...mapGetters({
      currentChannel: 'currentChannel',
      messages: 'currentChannelMessageList',
      users: 'getOnlineUsers'
    }),
    channels() : Array<Channel> {
      return Object.values(this.$store.state.channels)
    },
    totalOnlineUsers() : number {
      return Object.values(this.users).length
    }
  },
  methods: {
    async handleChatSubmit() {
      if (!this.currentChannel) {
        alert("You aren't in a channel currently. Pick a channel to talk")
        return
      }

      const messageContent = this.messageInput
      this.messageInput = '' //Clear the input now that we are sending the message

      await this.$services.messageService.sendMessage(this.currentChannel.id, messageContent)
    }
  }
})
</script>

<style lang="stylus">
  .channel-page
    display flex
    height 100%
</style>

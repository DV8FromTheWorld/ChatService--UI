<template>
  <main>
    <section>
      <header>
        <h2>Chat Log</h2>
        <small>Connected Users: {{totalOnlineUsers}}</small>
      </header>

      <section>
        <h3>Pick a channel to talk in!</h3>
        <div>
          <button
            v-for="channel of channels"
            :key="channel.id"
            @click="handleChannelSelection(channel.id)">
            {{channel.name}}
          </button>
        </div>
        <form @submit.prevent="handleChannelSubmit">
          <div>
            <label>Create a Channel!</label>
            <input v-model="channelInput" type="text" />
          </div>
          <button type="submit">
            Submit Channel
          </button>
        </form>
      </section>

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
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Channel from '@/entities/state/Channel'
import Message from '@/entities/state/Message'
import User from '@/entities/state/User'

import { mapGetters } from 'vuex'

export default defineComponent({
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
    },
    async handleChannelSubmit() {
      const channelName = this.channelInput
      this.channelInput = ''

      await this.$services.channelService.createChannel(channelName)
    },
    handleChannelSelection(channelId: string) {
      this.$store.commit({
        type: 'CHANGE_CURRENT_CHANNEL',
        channelId
      })
    }
  }
})
</script>

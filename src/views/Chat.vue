<template>
  <main>
    <section>
      <header>
        <h2>Chat Log</h2>
        <small>Connected Users: {{activeUsers}}</small>
      </header>
      <section>
        {{channels.map(channel => channel.name).join(', ')}}
      </section>
      <div id="chat-log">
        <div
          v-for="message of messages"
          :key="message.id"
          :data-message-id="message.id">
          <span>{{message.content}}</span>
          <span>{{message.updatedAt}}</span>
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
  </main>
</template>

<script lang="ts">
// TODO : REMOVE THIS ESLINT-DISABLE. This is only here for the initial conversion to TS + Vue3. Austin will remove this before adding more features.
/* eslint-disable */
import { defineComponent } from 'vue'

interface Message {
  id: string,
  content: string,
  updatedAt: string
}

interface Channel {
  id: string,
  name: string,
  updateAt: string
}

interface WebsocketData {
  type: string,
  data?: any
}

export default defineComponent({
  created() {
    this.setupWebsocket()
  },
  unmounted() {
    if (this.webSocket) {
      this.webSocket.close(1000)
    }
  },
  data() {
    return {
      //Likely will move to a global service
      webSocket: null as unknown as WebSocket,
      userId: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 7),

      //Eventually these will likely move to the global VueX store
      messages: [] as Array<Message>,
      channels: [] as Array<Channel>,
      activeUsers: 0,

      //Local state
      messageInput: '',
      channelInput: ''
    }
  },
  methods: {
    setupWebsocket() {
      const url = "ws://localhost:8085"
      this.webSocket = new WebSocket(url)

      this.webSocket.addEventListener("open", (event: Event) => {
        console.log("websocket successfully opened", event)
      })

      this.webSocket.addEventListener("error", (event: Event) => {
        console.log("websocket encountered an error: ", event)
      })

      this.webSocket.addEventListener("message", (event: MessageEvent) => {
        const dataEvent = JSON.parse(event.data)
        this.handleEvent(dataEvent)
      })

      this.webSocket.addEventListener("close", (event: CloseEvent) => {
        console.log("websocket has closed!", event)
      })
    },
    sendThroughWebsocket(websocketData: WebsocketData) {
      this.webSocket.send(JSON.stringify(websocketData))
    },
    handleChatSubmit() {
      const messageContent = this.messageInput
      this.messageInput = "" //Clear the input now that we are sending the message

      this.sendThroughWebsocket({
        type: 'REST_CREATE_MESSAGE',
        data: {
          content: messageContent
        }
      })
    },
    handleChannelSubmit() {
      const channelName = this.channelInput
      this.channelInput = ""

      this.sendThroughWebsocket({
        type: 'REST_CREATE_CHANNEL',
        data: {
          name: channelName
        }
      })
    },
    handleEvent(event: MessageEvent) {
      switch (event.type) {
        case "IDENTIFY": {
          this.sendThroughWebsocket({
            type: "IDENTIFY_RESPONSE",
            data: {
              userId: this.userId
            }
          })
          break
        }

        case "READY": {
          const {connectedUserTotal, currentMessages, channels } = event.data

          this.channels = Object.values(channels)
          this.messages = currentMessages
          this.activeUsers = connectedUserTotal

          break
        }

        case "MESSAGE_CREATE": {
          const { message } = event.data

          this.messages.push(message)
          break
        }

        case "MESSAGE_UPDATE": {
          const { message } = event.data

          const messageIdx = this.messages.findIndex(msg => msg.id === message.id)
          if (messageIdx === -1) {
            return
          }

          this.messages[messageIdx] = message
          break;
        }

        case "MESSAGE_DELETE": {
          const { messageId } = event.data

          this.messages = this.messages.filter(msg => msg.id !== messageId)

          break
        }

        case "CHANNEL_CREATE": {
          const { channel } = event.data

          this.channels.push(channel)

          break
        }

        case "USER_CONNECTED": {
          const { user } = event.data

          this.activeUsers++

          break
        }

        case "USER_DISCONNECTED": {
          const { user } = event.data

          this.activeUsers--

          break
        }
      }
    }
  }
})
</script>

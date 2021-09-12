import { createStore, Store } from 'vuex'

import Guild from '@/entities/state/Guild'
import Channel from '@/entities/state/Channel'
import User from '@/entities/state/User'
import Message from '@/entities/state/Message'

interface MessageCache {
  channel: Channel,
  messageIdList: Array<string>
  messageMap: Map<string, Message>
}

export interface GlobalState {
  currentChannelId: string | null
  connectedUsers: number

  users: Record<string, User>
  guilds: Record<string, Guild>
  channels: Record<string, Channel>
  messages: Record<string, MessageCache>
}

export type GlobalStore = Store<GlobalState>

export default createStore<GlobalState>({
  state: {
    currentChannelId: null,
    connectedUsers: 0,

    users: {},
    guilds: {
      default: {
        id: 'default',
        name: 'Default Guild',
        createdAt: new Date().toISOString()
      }
    },
    channels: {},
    messages: {}
  },
  mutations: {
    READY(state, payload) {
      state.users = payload.users
      state.channels = payload.channels

      const channelList = Object.values(payload.channels) as Array<Channel>
      if (channelList.length) {
        state.currentChannelId = channelList[0].id
      }
    },
    CHANGE_CURRENT_CHANNEL(state, payload) {
      state.currentChannelId = payload.channelId
    },
    CHANNEL_UPSERT(state, payload) {
      const channel: Channel = payload.channel
      state.channels[channel.id] = channel
    },
    CHANNEL_DELETE(state, payload) {
      const channelId: string = payload.channelId
      delete state.channels[channelId]
      delete state.messages[channelId]

      //This probably don't belong in the mutation
      if (state.currentChannelId === channelId) {
        state.currentChannelId = null
      }
    },
    MESSAGE_CREATE(state, payload) {
      const message: Message = payload.message
      const channel: Channel = message.channel

      const messageCache = getMessageCache(state, channel)

      messageCache.messageIdList = [...messageCache.messageIdList, message.id]
      // messageCache.messageIdList.push(message.id)
      messageCache.messageMap.set(message.id, message)
    },
    MESSAGE_UPDATE(state, payload) {
      const message: Message = payload.message
      const channel: Channel = message.channel

      const messageCache = getMessageCache(state, channel)

      if (!messageCache.messageMap.has(message.id)) {
        return
      }

      messageCache.messageMap.set(message.id, message)
    },
    MESSAGE_DELETE(state, payload) {
      const messageId: string = payload.messageId
      const channel: Channel = payload.channel

      const messageCache = getMessageCache(state, channel)

      if (!messageCache.messageMap.has(messageId)) {
        return
      }

      messageCache.messageMap.delete(messageId)
      messageCache.messageIdList = messageCache.messageIdList.filter(msgId => msgId !== messageId)
    },
    USER_CREATE(state, payload) {
      const user: User = payload.user

      state.users[user.id] = user
    },
    USER_DELETE(state, payload) {
      const userId: string = payload.userId

      delete state.users[userId]
    }
  },
  actions: {
  },
  getters: {
    currentChannel(state) {
      if (!state.currentChannelId) {
        return null
      }

      return state.channels[state.currentChannelId]
    },
    currentChannelMessageList(state, getters) {
      if (!getters.currentChannel) {
        return []
      }

      const messageCache = getMessageCache(state, getters.currentChannel)

      return messageCache.messageIdList.map(messageId => messageCache.messageMap.get(messageId))
    },
    getOnlineUsers(state) {
      return state.users
    }
  }
})

function getMessageCache(state: GlobalState, channel: Channel) : MessageCache {
  if (!state.messages[channel.id]) {
    state.messages[channel.id] = {
      channel,
      messageIdList: [],
      messageMap: new Map<string, Message>()
    }
  }

  //Always return via retrieving from state that way the Proxy.get setup by VueX sees ours dependence correctly.
  return state.messages[channel.id]
}

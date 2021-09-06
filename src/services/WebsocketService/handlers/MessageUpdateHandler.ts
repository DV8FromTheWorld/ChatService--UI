import BaseHandler from '@/services/WebsocketService/handlers/BaseHandler'
import { WebsocketReceivePayload } from '@/services/WebsocketService/WebsocketService'

import SocketMessage from '@/entities/websocket/SocketMessage'
import Message from '@/entities/state/Message'
import { GlobalState } from '@/store'
import User from '@/entities/state/User'
import Channel from '@/entities/state/Channel'

interface MessageUpdatePayload {
  message: SocketMessage
}

export default class MessageUpdateHandler extends BaseHandler {
  handle(payload: WebsocketReceivePayload) {
    const { message: socketMessage } = payload.data as MessageUpdatePayload

    //TODO should SocketMessage include a full-fledged user?
    const state: GlobalState = this.store.state

    const author: User = state.users[socketMessage.authorId]
    if (!author) {
      //TODO handle this better probably
      console.error(`Could not find user in cache when building message for userId: ${socketMessage.authorId}`)
      return
    }

    const channel: Channel = state.channels[socketMessage.channelId]
    if (!channel) {
      //TODO handle this better probably
      console.error(`Could not find channel in cache when building message for channelId: ${socketMessage.channelId}`)
      return
    }

    const message: Message = {
      id: socketMessage.id,
      content: socketMessage.content,

      author,
      channel,

      createdAt: socketMessage.createdAt,
      updatedAt: socketMessage.updatedAt
    }

    this.store.commit({
      type: 'MESSAGE_UPDATE',
      message
    })
  }
}

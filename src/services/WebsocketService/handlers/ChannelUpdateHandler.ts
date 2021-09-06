import BaseHandler from '@/services/WebsocketService/handlers/BaseHandler'
import { WebsocketReceivePayload } from '@/services/WebsocketService/WebsocketService'

import SocketChannel from '@/entities/websocket/SocketChannel'

export default class ChannelUpdateHandler extends BaseHandler {
  handle(payload: WebsocketReceivePayload) {
    const channel: SocketChannel = payload.data as SocketChannel

    //TODO: we shouldn't be sticking SocketChannel straight into state. It should be a state.Channel.
    this.store.commit({
      type: 'CHANNEL_UPSERT',
      channel
    })
  }
}

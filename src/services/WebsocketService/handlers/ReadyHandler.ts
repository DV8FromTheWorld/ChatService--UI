import BaseHandler from '@/services/WebsocketService/handlers/BaseHandler'
import { WebsocketReceivePayload } from '@/services/WebsocketService/WebsocketService'
import SocketChannel from '@/entities/websocket/SocketChannel'
import User from '@/entities/state/User'

interface ReadyPayload {
  users: Record<string, User>
  channels: Record<string, SocketChannel>
}

export default class ReadyHandler extends BaseHandler {
  handle(payload: WebsocketReceivePayload) {
    const { users, channels } = payload.data as ReadyPayload

    this.store.commit({
      type: 'READY',
      users: users,
      channels: channels
    })
  }
}

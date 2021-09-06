import BaseHandler from '@/services/WebsocketService/handlers/BaseHandler'
import { WebsocketReceivePayload } from '@/services/WebsocketService/WebsocketService'
import SocketUser from '@/entities/websocket/SocketUser'
import User from '@/entities/state/User'

interface UserConnectedPayload {
  user: SocketUser
}

export default class UserConnectedHandler extends BaseHandler {
  handle(payload: WebsocketReceivePayload) {
    const { user: socketUser } = payload.data as UserConnectedPayload

    const user: User = {
      id: socketUser.id,
      name: socketUser.id
    }

    this.store.commit({
      type: 'USER_CREATE',
      user
    })
  }
}

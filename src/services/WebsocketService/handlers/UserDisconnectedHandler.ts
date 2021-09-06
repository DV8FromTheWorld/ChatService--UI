import BaseHandler from '@/services/WebsocketService/handlers/BaseHandler'
import { WebsocketReceivePayload } from '@/services/WebsocketService/WebsocketService'

interface UserDisconnectedPayload {
  userId: string
}

export default class UserDisconnectedHandler extends BaseHandler {
  handle(payload: WebsocketReceivePayload) {
    const { userId } = payload.data as UserDisconnectedPayload

    this.store.commit({
      type: 'USER_DELETE',
      userId
    })
  }
}

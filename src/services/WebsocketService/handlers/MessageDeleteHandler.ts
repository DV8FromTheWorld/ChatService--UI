import BaseHandler from '@/services/WebsocketService/handlers/BaseHandler'
import { WebsocketReceivePayload } from '@/services/WebsocketService/WebsocketService'

interface MessageDeleteDispatchPayload {
  messageId: string
  channelId: string
}

export default class MessageDeleteHandler extends BaseHandler {
  handle(payload: WebsocketReceivePayload) {
    const { messageId, channelId } = payload.data as MessageDeleteDispatchPayload

    //TODO should we ignore the event if we know we don't have the channel cached?

    this.store.commit({
      type: 'MESSAGE_DELETE',
      messageId,
      channelId
    })
  }
}

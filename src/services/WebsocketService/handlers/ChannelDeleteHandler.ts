import BaseHandler from '@/services/WebsocketService/handlers/BaseHandler'
import { WebsocketReceivePayload } from '@/services/WebsocketService/WebsocketService'

interface ChannelDeletePayload {
  channelId: string
}

export default class ChannelDeleteHandler extends BaseHandler {
  handle(payload: WebsocketReceivePayload) {
    const { channelId } = payload.data as ChannelDeletePayload

    this.store.commit({
      type: 'CHANNEL_DELETE',
      channelId
    })
  }
}

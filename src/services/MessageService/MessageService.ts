import AbstractService from '@/services/AbstractService'

export default class MessageService extends AbstractService {
  async sendMessage(channelId: string, content: string) : Promise<unknown> {
    return this.services.websocketService.sendPayload({
      type: 'REST_CREATE_MESSAGE',
      data: {
        channelId,
        content
      }
    })
  }
}

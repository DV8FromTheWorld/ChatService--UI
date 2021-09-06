import AbstractService from '@/services/AbstractService'

export default class ChannelService extends AbstractService {
  async createChannel(name: string) : Promise<unknown> {
    return this.services.websocketService.sendPayload({
      type: 'REST_CREATE_CHANNEL',
      data: {
        name: name
      }
    })
  }
}

import WebsocketService from '@/services/WebsocketService/WebsocketService'
import ChannelService from '@/services/ChannelService/ChannelService'
import MessageService from '@/services/MessageService/MessageService'
import { GlobalStore } from '@/store'

export interface GlobalServices {
  channelService: ChannelService
  messageService: MessageService
  websocketService: WebsocketService
}

export default class ServiceManager {
  private readonly store: GlobalStore
  private readonly services: GlobalServices = {} as GlobalServices

  constructor(store: GlobalStore) {
    this.store = store

    this.services.channelService = new ChannelService(store, this.services)
    this.services.messageService = new MessageService(store, this.services)
    this.services.websocketService = new WebsocketService(store, this.services)

    this.services = Object.freeze(this.services)
  }

  getServices() : GlobalServices {
    return this.services
  }
}

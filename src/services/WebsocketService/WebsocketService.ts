import { GlobalStore } from '@/store'
import { SocketHandler } from '@/services/WebsocketService/handlers/BaseHandler'
import ReadyHandler from '@/services/WebsocketService/handlers/ReadyHandler'
import MessageCreateHandler from '@/services/WebsocketService/handlers/MessageCreateHandler'
import MessageUpdateHandler from '@/services/WebsocketService/handlers/MessageUpdateHandler'
import MessageDeleteHandler from '@/services/WebsocketService/handlers/MessageDeleteHandler'
import ChannelCreateHandler from '@/services/WebsocketService/handlers/ChannelCreateHandler'
import ChannelUpdateHandler from '@/services/WebsocketService/handlers/ChannelUpdateHandler'
import ChannelDeleteHandler from '@/services/WebsocketService/handlers/ChannelDeleteHandler'
import UserConnectedHandler from '@/services/WebsocketService/handlers/UserConnectedHandler'
import UserDisconnectedHandler from '@/services/WebsocketService/handlers/UserDisconnectedHandler'
import { GlobalServices } from '@/services/ServiceManager'
import AbstractService from '@/services/AbstractService'

export interface WebsocketSendPayload {
  type: string
  data?: unknown
}

export interface WebsocketReceivePayload {
  type: string,
  data?: unknown
}

export default class WebsocketService extends AbstractService {
  // @ts-ignore
  private websocket: WebSocket
  private handlers: Record<string, SocketHandler> = {}

  constructor(store: GlobalStore, services: GlobalServices) {
    super(store, services)
    this.setupHandlers()
    this.setupWebsocket()
  }

  async sendPayload(payload: WebsocketSendPayload) {
    await this.websocket.send(JSON.stringify(payload))
  }

  private setupWebsocket() : void {
    const url = 'ws://localhost:8085'
    this.websocket = new WebSocket(url)

    this.websocket.addEventListener('open', (event: Event) => {
      console.log('websocket successfully opened', event)
    })

    this.websocket.addEventListener('error', (event: Event) => {
      console.log('websocket encountered an error: ', event)
    })

    this.websocket.addEventListener('message', (event: MessageEvent) => {
      const dataEvent = JSON.parse(event.data)
      this.handleEvent(dataEvent)
    })

    this.websocket.addEventListener('close', (event: CloseEvent) => {
      console.log('websocket has closed!', event)
    })
  }

  private setupHandlers() : void {
    /* eslint-disable dot-notation */
    this.handlers['READY'] = new ReadyHandler(this, this.store)
    this.handlers['MESSAGE_CREATE'] = new MessageCreateHandler(this, this.store)
    this.handlers['MESSAGE_UPDATE'] = new MessageUpdateHandler(this, this.store)
    this.handlers['MESSAGE_DELETE'] = new MessageDeleteHandler(this, this.store)
    this.handlers['CHANNEL_CREATE'] = new ChannelCreateHandler(this, this.store)
    this.handlers['CHANNEL_UPDATE'] = new ChannelUpdateHandler(this, this.store)
    this.handlers['CHANNEL_DELETE'] = new ChannelDeleteHandler(this, this.store)
    this.handlers['USER_CONNECTED'] = new UserConnectedHandler(this, this.store)
    this.handlers['USER_DISCONNECTED'] = new UserDisconnectedHandler(this, this.store)
  }

  private handleEvent(receivePayload: WebsocketReceivePayload) : void {
    if (receivePayload.type === 'IDENTIFY') {
      this.sendPayload({
        type: 'IDENTIFY_RESPONSE',
        data: {
          name: 'Cool User',
          id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 12)
        }
      })
    }
    else {
      const handler = this.handlers[receivePayload.type]
      if (!handler) {
        console.error(`Received event that no handler is registered for: '${receivePayload.type}'`)
        return
      }

      handler.handle(receivePayload)
    }
  }
}

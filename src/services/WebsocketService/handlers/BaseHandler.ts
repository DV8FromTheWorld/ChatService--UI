import WebsocketService, { WebsocketReceivePayload } from '@/services/WebsocketService/WebsocketService'
import { GlobalStore } from '@/store'

export interface SocketHandler {
  handle(payload: WebsocketReceivePayload) : void
}

export default abstract class BaseHandler implements SocketHandler {
  protected readonly store: GlobalStore
  protected readonly websocket: WebsocketService

  constructor(websocket: WebsocketService, store: GlobalStore) {
    this.websocket = websocket
    this.store = store
  }

  abstract handle(payload: WebsocketReceivePayload) : void
}

import { GlobalServices } from '@/services/ServiceManager'
import { GlobalStore } from '@/store'

export default class AbstractService {
  protected readonly store: GlobalStore
  protected readonly services: GlobalServices

  constructor(store: GlobalStore, services: GlobalServices) {
    this.store = store
    this.services = services
  }
}

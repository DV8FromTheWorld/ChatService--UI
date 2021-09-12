import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store, { GlobalStore } from './store'
import ServiceManager, { GlobalServices } from '@/services/ServiceManager'

import './styles/index.styl'

const serviceManager = new ServiceManager(store)

const vueApp = createApp(App)
  .use(store)
  .use(router)

vueApp.config.globalProperties.$services = serviceManager.getServices()

vueApp.mount('#app-container')

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $services: GlobalServices,
    $store: GlobalStore
  }
}

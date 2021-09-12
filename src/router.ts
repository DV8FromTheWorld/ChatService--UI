import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import Channel from './views/Channel.vue'

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // }
  {
    path: '/',
    name: 'Channel',
    component: Channel
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

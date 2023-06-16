import { createRouter, createWebHistory } from 'vue-router'

import Login from '../components/LoginComponent.vue'
import PageNotFound from '../components/PageNotFound.vue'
import Pinturas from '../components/PinturasComponent.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/Pinturas',
    name: 'Pinturas',
    component: Pinturas
  },
  {
    path: '/:catchAll(.*)*',
    name: "PageNotFound",
    component: PageNotFound,
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})

export { router }
import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'

import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import ResetPasswordPage from '../views/ResetPasswordPage.vue'
import AlbumPage from '../views/AlbumPage.vue'
import CollectionPage from '../views/CollectionPage.vue'
import ProfilePage from '../views/ProfilePage.vue'
import AboutPage from '../views/AboutPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },

  {
    path: '/login',
    component: LoginPage
  },

  {
    path: '/register',
    component: RegisterPage
  },

  {
    path: '/reset',
    component: ResetPasswordPage
  },

  {
    path: '/album',
    component: AlbumPage
  },

  {
    path: '/collection',
    component: CollectionPage
  },

  {
    path: '/profile',
    component: ProfilePage
  },

  {
    path: '/about',
    component: AboutPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
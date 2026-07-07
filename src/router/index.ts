import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'

import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import ResetPasswordPage from '../views/ResetPasswordPage.vue'
import AlbumPage from '../views/AlbumPage.vue'
import CollectionPage from '../views/CollectionPage.vue'
import ProfilePage from '../views/ProfilePage.vue'
import AboutPage from '../views/AboutPage.vue'
import { isAuthenticated } from '@/utils/storage.utils'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },

  {
    path: '/login',
    meta: {
      public: true
    },
    component: LoginPage
  },

  {
    path: '/register',
    meta: {
      public: true
    },
    component: RegisterPage
  },

  {
    path: '/reset',
    meta: {
      public: true
    },
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

router.beforeEach(to => {
  if (to.meta.public || isAuthenticated()) {
    return true
  }

  return '/login'
})

export default router

import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'

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
    component: () => import('../views/LoginPage.vue')
  },

  {
    path: '/register',
    meta: {
      public: true
    },
    component: () => import('../views/RegisterPage.vue')
  },

  {
    path: '/reset',
    meta: {
      public: true
    },
    component: () => import('../views/ResetPasswordPage.vue')
  },

  {
    path: '/album',
    component: () => import('../views/AlbumPage.vue')
  },

  {
    path: '/collection',
    component: () => import('../views/CollectionPage.vue')
  },

  {
    path: '/achievements',
    component: () => import('../views/AchievementsPage.vue')
  },

  {
    path: '/profile',
    component: () => import('../views/ProfilePage.vue')
  },

  {
    path: '/about',
    component: () => import('../views/AboutPage.vue')
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

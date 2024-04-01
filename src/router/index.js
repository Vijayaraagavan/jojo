import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Info from '@/components/home/Info.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/app',
      name: 'dashboards',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/components/home/Dashboard.vue'),
      children: [
        {
          path: 'info',
          name: 'info',
          component: Info
        },
        {
          path: 'transaction/new',
          name: 'newTransaction',
          component: () => import('@/components/transaction/Create.vue')
        },
        {
          path: 'transactions',
          name: 'transactions',
          component: () => import('@/components/transaction/List.vue')
        },
        {
          path: 'splitTransactions',
          name: 'splitTransactions',
          component: () => import('@/components/transaction/GroupList.vue')
        },
        {
          path: 'teams',
          name: 'teams',
          component: () => import('@/components/splits/Home.vue')
        },
        {
          path: 'split/:groupId',
          name: 'split',
          component: () => import('@/components/splits/Split.vue')
        },
        {
          path: 'split/transaction/:tId',
          name: 'splitUpdate',
          component: () => import('@/components/splits/Update.vue')
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/components/settings/Home.vue')
        },
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/components/dashboard/Home.vue')
        }
      ]
    },
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('@/components/home/Home.vue'),
      children: [
        {
          name: 'login',
          path: 'login',
          component: () => import('@/components/home/Login.vue')
        },
        {
          path: 'signup',
          components: {
            default: () => import('@/components/home/SignUp.vue'),
            helper: () => import('@/components/home/SignUp.vue')
          }
        }
      ]
    }
  ]
})

export default router

import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

const router = createRouter({
  history: createWebHashHistory('/'),
  routes: [
    {
      path: '/',
      component: Layout,
      redirect: '/network-node',
      children: [
        {
          path: '/network-node',
          name: 'NetworkNode',
          meta: { title: '首页' },
          component: () => import('@/views/network-node.vue')
        },
        {
          path: '/system-api',
          name: 'SystemApi',
          meta: { title: '接口' },
          component: () => import('@/views/system-api.vue')
        }
      ]
    },

    { path: '/:catchAll(.*)', redirect: '/' }
  ],
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition ? savedPosition : { top: 0, left: 0 }
  }
})

export default router

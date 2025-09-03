/**
 * @description vue-router
 * @extends https://router.vuejs.org/zh/installation.html
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout/index.vue'
import { isString } from '@/utils/is'

/** vue-router实例 */
const router = createRouter({
  history: createWebHashHistory('/'),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/common/login.vue')
    },
    {
      path: '/',
      component: Layout,
      redirect: '/admin-dashboard',
      children: [
        {
          path: '/admin-dashboard',
          name: 'AdminDashboard',
          meta: { title: '系统管理工作台' },
          component: () => import('@/views/admin/admin-dashboard.vue')
        },
        {
          path: '/sales-dashboard',
          name: 'SalesDashboard',
          meta: { title: '销售工作台' },
          component: () => import('@/views/sales/sales-dashboard.vue')
        }
      ]
    },
    {
      // 重定向路由：https://router.vuejs.org/zh/guide/migration/#%E5%88%A0%E9%99%A4%E4%BA%86-%EF%BC%88%E6%98%9F%E6%A0%87%E6%88%96%E9%80%9A%E9%85%8D%E7%AC%A6%EF%BC%89%E8%B7%AF%E7%94%B1
      path: '/:catchAll(.*)',
      redirect: '/'
    }
  ],
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition ? savedPosition : { top: 0, left: 0 }
  }
})

router.beforeEach(async (to, _from, next) => {
  // 更新页面标题
  document.title = isString(to.meta?.title)
    ? to.meta.title
    : import.meta.env.VITE_TITLE

  next()
})

export default router

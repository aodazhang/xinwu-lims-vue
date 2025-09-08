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
        // 系统管理
        {
          path: '/admin-dashboard',
          name: 'AdminDashboard',
          meta: { title: '系统管理工作台' },
          component: () => import('@/views/admin/admin-dashboard.vue')
        },
        {
          path: '/user-management',
          name: 'UserManagement',
          meta: { title: '用户管理' },
          component: () => import('@/views/admin/user-management.vue')
        },

        // 业务管理
        {
          path: '/sales-dashboard',
          name: 'SalesDashboard',
          meta: { title: '销售工作台' },
          component: () => import('@/views/sales/sales-dashboard.vue')
        },
        {
          path: '/sales-detail',
          name: 'SalesDetail',
          meta: { title: '销售订单详情' },
          component: () => import('@/views/sales/sales-detail.vue'),
          props: route => ({
            orderId: route.query.orderId
          })
        },
        {
          path: '/sales-form',
          name: 'SalesForm',
          meta: { title: '销售订单' },
          component: () => import('@/views/sales/sales-form.vue'),
          props: route => ({
            orderId: route.query.orderId
          })
        },
        {
          path: '/customer-management',
          name: 'CustomerManagement',
          meta: { title: '客户管理' },
          component: () => import('@/views/sales/customer-management.vue')
        },
        {
          path: '/customer-detail',
          name: 'CustomerDetail',
          meta: { title: '客户详情' },
          component: () => import('@/views/sales/customer-detail.vue'),
          props: route => ({
            customerId: route.query.customerId
          })
        },
        {
          path: '/review-dashboard',
          name: 'ReviewDashboard',
          meta: { title: '订单审核工作台' },
          component: () => import('@/views/sales/review-dashboard.vue')
        },
        {
          path: '/review-detail',
          name: 'ReviewDetail',
          meta: { title: '订单审核详情' },
          component: () => import('@/views/sales/review-detail.vue'),
          props: route => ({
            orderId: route.query.orderId
          })
        },

        // 现场作业
        {
          path: '/sampling-dashboard',
          name: 'SamplingDashboard',
          meta: { title: '采样调度工作台' },
          component: () => import('@/views/sample/sampling-dashboard.vue')
        },
        {
          path: '/sampling-detail',
          name: 'SamplingDetail',
          meta: { title: '采样调度详情' },
          component: () => import('@/views/sample/sampling-detail.vue'),
          props: route => ({
            taskId: route.query.taskId
          })
        },
        {
          path: '/sampler-dashboard',
          name: 'SamplerDashboard',
          meta: { title: '采样工作台' },
          component: () => import('@/views/sample/sampler-dashboard.vue')
        },
        {
          path: '/sampler-detail',
          name: 'SamplerDetail',
          meta: { title: '采样详情' },
          component: () => import('@/views/sample/sampler-detail.vue'),
          props: route => ({
            taskId: route.query.taskId
          })
        },
        {
          path: '/sample-dashboard',
          name: 'SampleDashboard',
          meta: { title: '样品管理工作台' },
          component: () => import('@/views/sample/sample-dashboard.vue')
        },
        {
          path: '/sample-detail',
          name: 'SampleDetail',
          meta: { title: '样品详情' },
          component: () => import('@/views/sample/sample-detail.vue'),
          props: route => ({
            orderId: route.query.orderId
          })
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

<template>
  <div>
    <!-- 页面头部 -->
    <common-title title="销售工作台" content="首页 / 销售工作台" />

    <!-- 统计卡片 -->
    <div class="md-grid-13 mb-8 gap-5">
      <div
        class="rounded-xl bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      >
        <div class="mb-2 text-sm text-gray-500">当月订单数</div>
        <div class="text-3xl font-bold text-gray-800">
          {{ stats.monthlyOrders }}
        </div>
      </div>
      <div
        class="rounded-xl bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      >
        <div class="mb-2 text-sm text-gray-500">当月业绩</div>
        <div class="text-3xl font-bold text-gray-800">
          ¥{{ stats.monthlyRevenue.toLocaleString() }}
        </div>
      </div>
      <div
        class="rounded-xl bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      >
        <div class="mb-2 text-sm text-gray-500">当月实收金额</div>
        <div class="text-3xl font-bold text-gray-800">
          ¥{{ stats.monthlyReceived.toLocaleString() }}
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="mb-6 flex flex-wrap gap-4">
      <button
        class="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30"
        @click="createOrder"
      >
        创建订单
      </button>
      <button
        class="rounded-lg border border-indigo-500 bg-white px-6 py-3 text-sm font-medium text-indigo-500 transition-all duration-200 hover:bg-gray-50"
        @click="manageCustomers"
      >
        客户管理
      </button>
    </div>

    <!-- 订单列表 -->
    <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
      <h3 class="text-xl font-bold text-gray-800">订单列表</h3>
      <div class="flex flex-wrap items-center gap-3">
        <!-- 项目编号搜索 -->
        <div class="relative">
          <svg
            class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            v-model="searchFilters.projectId"
            type="text"
            class="w-48 rounded-md border border-gray-300 py-2 pl-9 pr-9 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="项目编号精确查询"
          />
          <svg
            v-if="searchFilters.projectId"
            @click="searchFilters.projectId = ''"
            class="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform cursor-pointer text-gray-400 transition-colors hover:text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>

        <!-- 客户名称搜索 -->
        <div class="relative">
          <svg
            class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            v-model="searchFilters.customerName"
            type="text"
            class="w-48 rounded-md border border-gray-300 py-2 pl-9 pr-9 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="客户名称模糊查询"
          />
          <svg
            v-if="searchFilters.customerName"
            @click="searchFilters.customerName = ''"
            class="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform cursor-pointer text-gray-400 transition-colors hover:text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>

        <!-- 状态筛选 -->
        <select
          v-model="searchFilters.status"
          class="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">全部状态</option>
          <option value="pending">待审核</option>
          <option value="approved">已审核</option>
          <option value="sampling">采样中</option>
          <option value="testing">检测中</option>
          <option value="completed">已完成</option>
        </select>

        <!-- 搜索按钮 -->
        <button
          @click="performSearch"
          class="flex items-center gap-1 rounded-md bg-indigo-500 px-4 py-2 text-sm text-white transition-all duration-200 hover:bg-indigo-600"
        >
          <svg
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          搜索
        </button>
      </div>
    </div>

    <div
      class="relative min-h-96 overflow-hidden rounded-xl bg-white shadow-sm"
    >
      <!-- 加载状态 -->
      <div
        v-if="loading"
        class="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-90"
      >
        <div
          class="border-3 h-10 w-10 animate-spin rounded-full border-gray-200 border-t-indigo-500"
        ></div>
      </div>

      <!-- 空状态 -->
      <div
        v-if="!loading && filteredOrders.length === 0"
        class="py-15 text-center"
      >
        <div class="mb-4 text-5xl text-gray-300">📋</div>
        <div class="mb-2 text-base text-gray-500">暂无订单数据</div>
        <div class="text-sm text-gray-400">请调整查询条件后重试</div>
      </div>

      <!-- 订单表格 -->
      <div v-if="!loading && filteredOrders.length > 0">
        <table class="w-full">
          <thead class="border-b border-gray-200 bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">
                项目编号
              </th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">
                客户名称
              </th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">
                受检单位
              </th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">
                检测类型
              </th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">
                检测点数
              </th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">
                项目金额
              </th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">
                状态
              </th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">
                创建时间
              </th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="order in paginatedOrders"
              :key="order.id"
              class="border-b border-gray-100 transition-colors hover:bg-gray-50"
            >
              <td class="px-4 py-3 text-sm">
                <span
                  class="cursor-pointer font-medium text-indigo-500 hover:underline"
                  @click="viewOrder(order.id)"
                >
                  {{ order.projectId }}
                </span>
                <span
                  v-if="order.urgent"
                  class="ml-2 rounded bg-red-500 px-1.5 py-0.5 text-xs font-bold text-white"
                  >急</span
                >
              </td>
              <td class="px-4 py-3 text-sm text-gray-800">
                {{ order.customerName }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-800">
                {{ order.inspectedUnit }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-800">
                {{ order.testType }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-800">
                {{ order.testPoints }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-800">
                ¥{{ order.amount.toLocaleString() }}
              </td>
              <td class="px-4 py-3 text-sm">
                <span
                  :class="getStatusClass(order.status)"
                  class="inline-block rounded px-2 py-1 text-xs font-medium"
                >
                  {{ getStatusText(order.status) }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-800">
                {{ order.createTime }}
              </td>
              <td class="px-4 py-3 text-sm">
                <div class="flex gap-2">
                  <button
                    @click="viewOrder(order.id)"
                    class="rounded border border-indigo-500 px-2 py-1 text-xs text-indigo-500 transition-all hover:bg-indigo-500 hover:text-white"
                  >
                    查看
                  </button>
                  <button
                    v-if="order.status === 'pending'"
                    @click="editOrder(order.id)"
                    class="rounded border border-indigo-500 px-2 py-1 text-xs text-indigo-500 transition-all hover:bg-indigo-500 hover:text-white"
                  >
                    编辑
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页控件 -->
      <div
        v-if="!loading && filteredOrders.length > 0"
        class="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 bg-white px-5 py-4"
      >
        <div class="text-sm text-gray-500">
          显示
          <strong class="font-semibold text-gray-800">{{ startRecord }}</strong>
          -
          <strong class="font-semibold text-gray-800">{{ endRecord }}</strong>
          条， 共
          <strong class="font-semibold text-gray-800">{{
            totalRecords
          }}</strong>
          条记录
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="goToPage(1)"
            :disabled="currentPage === 1"
            class="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-500 transition-all hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              class="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <polyline points="11 17 6 12 11 7"></polyline>
              <polyline points="18 17 13 12 18 7"></polyline>
            </svg>
            首页
          </button>
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            class="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-500 transition-all hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              class="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            上一页
          </button>

          <div class="flex gap-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              :class="{
                'border-indigo-500 bg-indigo-500 text-white':
                  page === currentPage,
                'border-gray-300 bg-white text-gray-500 hover:border-gray-400 hover:bg-gray-50':
                  page !== currentPage
              }"
              class="min-w-9 rounded-md border px-3 py-1.5 text-center text-sm transition-all"
            >
              {{ page }}
            </button>
          </div>

          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-500 transition-all hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            下一页
            <svg
              class="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
          <button
            @click="goToPage(totalPages)"
            :disabled="currentPage === totalPages"
            class="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-500 transition-all hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            末页
            <svg
              class="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <polyline points="13 17 18 12 13 7"></polyline>
              <polyline points="6 17 11 12 6 7"></polyline>
            </svg>
          </button>
          <div class="ml-4 flex items-center gap-2">
            <span class="text-sm text-gray-500">跳转到</span>
            <input
              v-model.number="jumpPage"
              type="number"
              :min="1"
              :max="totalPages"
              class="w-12 rounded border border-gray-300 px-2 py-1.5 text-center text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="页码"
            />
            <button
              @click="jumpToPage"
              class="rounded bg-indigo-500 px-3 py-1.5 text-sm text-white transition-all hover:bg-indigo-600"
            >
              GO
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import CommonTitle from '@/components/common-title.vue'

defineOptions({ name: 'SalesDashboard' })

// 响应式数据
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const jumpPage = ref<number | null>(null)

// 统计数据
const stats = ref({
  monthlyOrders: 68,
  monthlyRevenue: 285600,
  monthlyReceived: 198200
})

// 搜索筛选条件
const searchFilters = ref({
  projectId: '',
  customerName: '',
  status: ''
})

// 所有订单数据
const allOrders = ref([
  {
    id: 1,
    projectId: 'XW-2024-001',
    customerName: '广州环保科技有限公司',
    inspectedUnit: '广州某工厂',
    testType: '水质检测',
    testPoints: 5,
    amount: 12800,
    status: 'pending',
    createTime: '2024-01-15',
    urgent: true
  },
  {
    id: 2,
    projectId: 'XW-2024-002',
    customerName: '深圳科技发展有限公司',
    inspectedUnit: '深圳某园区',
    testType: '土壤检测',
    testPoints: 8,
    amount: 25600,
    status: 'approved',
    createTime: '2024-01-14',
    urgent: false
  },
  {
    id: 3,
    projectId: 'XW-2024-003',
    customerName: '东莞制造业集团',
    inspectedUnit: '东莞某车间',
    testType: '噪声检测',
    testPoints: 12,
    amount: 18900,
    status: 'sampling',
    createTime: '2024-01-13',
    urgent: false
  },
  {
    id: 4,
    projectId: 'XW-2024-004',
    customerName: '佛山环境工程公司',
    inspectedUnit: '佛山某厂区',
    testType: '大气检测',
    testPoints: 6,
    amount: 15200,
    status: 'testing',
    createTime: '2024-01-12',
    urgent: true
  },
  {
    id: 5,
    projectId: 'XW-2024-005',
    customerName: '中山工业园区',
    inspectedUnit: '中山某企业',
    testType: '综合检测',
    testPoints: 15,
    amount: 38500,
    status: 'completed',
    createTime: '2024-01-11',
    urgent: false
  }
])

// 过滤后的订单数据
const filteredOrders = computed(() => {
  let filtered = allOrders.value

  if (searchFilters.value.projectId) {
    filtered = filtered.filter(order =>
      order.projectId.includes(searchFilters.value.projectId)
    )
  }

  if (searchFilters.value.customerName) {
    filtered = filtered.filter(order =>
      order.customerName.includes(searchFilters.value.customerName)
    )
  }

  if (searchFilters.value.status) {
    filtered = filtered.filter(
      order => order.status === searchFilters.value.status
    )
  }

  return filtered
})

// 分页相关计算属性
const totalRecords = computed(() => filteredOrders.value.length)
const totalPages = computed(() =>
  Math.ceil(totalRecords.value / pageSize.value)
)
const startRecord = computed(() => (currentPage.value - 1) * pageSize.value + 1)
const endRecord = computed(() =>
  Math.min(currentPage.value * pageSize.value, totalRecords.value)
)

// 当前页显示的订单
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredOrders.value.slice(start, end)
})

// 可见页码
const visiblePages = computed(() => {
  const pages: number[] = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      if (total > 5) {
        pages.push(total)
      }
    } else if (current >= total - 3) {
      pages.push(1)
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push(total)
    }
  }

  return pages
})

// 方法
const performSearch = () => {
  loading.value = true
  currentPage.value = 1

  // 模拟搜索延迟
  setTimeout(() => {
    loading.value = false
  }, 500)
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const jumpToPage = () => {
  if (
    jumpPage.value &&
    jumpPage.value >= 1 &&
    jumpPage.value <= totalPages.value
  ) {
    currentPage.value = jumpPage.value
    jumpPage.value = null
  }
}

const getStatusClass = (status: string) => {
  const statusClasses = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    sampling: 'bg-blue-100 text-blue-800',
    testing: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800'
  }
  return (
    statusClasses[status as keyof typeof statusClasses] ||
    'bg-gray-100 text-gray-800'
  )
}

const getStatusText = (status: string) => {
  const statusTexts = {
    pending: '待审核',
    approved: '已审核',
    sampling: '采样中',
    testing: '检测中',
    completed: '已完成'
  }
  return statusTexts[status as keyof typeof statusTexts] || status
}

const createOrder = () => {
  // 跳转到创建订单页面
  console.log('创建订单')
}

const manageCustomers = () => {
  // 跳转到客户管理页面
  console.log('客户管理')
}

const viewOrder = (orderId: number) => {
  // 查看订单详情
  console.log('查看订单:', orderId)
}

const editOrder = (orderId: number) => {
  // 编辑订单
  console.log('编辑订单:', orderId)
}

// 监听搜索条件变化，自动搜索
watch(
  () => [
    searchFilters.value.projectId,
    searchFilters.value.customerName,
    searchFilters.value.status
  ],
  () => {
    currentPage.value = 1
  },
  { deep: true }
)

// 组件挂载时初始化数据
onMounted(() => {
  // 可以在这里调用API获取真实数据
})
</script>

<style scoped>
/* 如果需要额外的自定义样式，可以在这里添加 */
</style>

<template>
  <div>
    <!-- 页面头部 -->
    <common-title title="销售工作台" content="首页 / 销售工作台" />

    <!-- 统计卡片 -->
    <common-stats :model="statsData" />

    <!-- 操作按钮 -->
    <div class="mt-5 flex flex-wrap gap-4">
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

    <!-- 筛选 -->
    <common-filter title="订单列表" @filter="performSearch">
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
    </common-filter>

    <!-- 订单列表 -->
    <common-table
      :config="tableConfig"
      :items="tableColumns"
      :model="paginatedOrders"
    >
      <!-- 项目编号列 -->
      <template #projectId="{ scope }">
        <span
          class="cursor-pointer font-medium text-indigo-500 hover:underline"
          @click="viewOrder(scope.id)"
        >
          {{ scope.projectId }}
        </span>
        <span
          v-if="scope.urgent"
          class="ml-2 rounded bg-red-500 px-1.5 py-0.5 text-xs font-bold text-white"
        >
          加急
        </span>
      </template>

      <!-- 项目金额列 -->
      <template #amount="{ scope }">
        ¥{{ scope.amount.toLocaleString() }}
      </template>

      <!-- 状态列 -->
      <template #status="{ scope }">
        <span
          :class="getStatusClass(scope.status)"
          class="inline-block rounded px-2 py-1 text-xs font-medium"
        >
          {{ getStatusText(scope.status) }}
        </span>
      </template>

      <!-- 操作列 -->
      <template #actions="{ scope }">
        <div class="flex gap-2">
          <button
            @click="viewOrder(scope.id)"
            class="rounded border border-indigo-500 px-2 py-1 text-xs text-indigo-500 transition-all hover:bg-indigo-500 hover:text-white"
          >
            查看
          </button>
          <button
            v-if="scope.status === 'pending'"
            @click="editOrder(scope.id)"
            class="rounded border border-indigo-500 px-2 py-1 text-xs text-indigo-500 transition-all hover:bg-indigo-500 hover:text-white"
          >
            编辑
          </button>
        </div>
      </template>
    </common-table>

    <!-- 分页控件 -->
    <common-pagination
      :total="totalRecords"
      :current="currentPage"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import CommonTitle from '@/components/common-title.vue'
import CommonStats from '@/components/common-stats.vue'
import CommonFilter from '@/components/common-filter.vue'
import CommonTable from '@/components/common-table.vue'
import CommonPagination from '@/components/common-pagination.vue'

defineOptions({ name: 'SalesDashboard' })

const router = useRouter()

// 响应式数据
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)

// 表格配置
const tableConfig = {
  rowKey: 'id',
  selection: false
}

// 表格列配置
const tableColumns = [
  {
    label: '项目编号',
    props: 'projectId',
    minWidth: 150,
    slotName: 'projectId'
  },
  {
    label: '客户名称',
    props: 'customerName',
    minWidth: 150
  },
  {
    label: '受检单位',
    props: 'inspectedUnit',
    minWidth: 150
  },
  {
    label: '检测类型',
    props: 'testType',
    minWidth: 100
  },
  {
    label: '检测点数',
    props: 'testPoints',
    minWidth: 80,
    align: 'center' as const
  },
  {
    label: '项目金额',
    props: 'amount',
    minWidth: 100,
    align: 'right',
    slotName: 'amount'
  },
  {
    label: '状态',
    props: 'status',
    minWidth: 80,
    align: 'center',
    slotName: 'status'
  },
  {
    label: '创建时间',
    props: 'createTime',
    minWidth: 100
  },
  {
    label: '操作',
    props: 'actions',
    minWidth: 120,
    align: 'center',
    slotName: 'actions'
  }
]

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

// 统计数据适配公共组件
const statsData = computed(() => [
  {
    label: '当月订单数',
    value: stats.value.monthlyOrders
  },
  {
    label: '当月业绩',
    value: `¥${stats.value.monthlyRevenue.toLocaleString()}`
  },
  {
    label: '当月实收金额',
    value: `¥${stats.value.monthlyReceived.toLocaleString()}`
  }
])

// 分页相关计算属性
const totalRecords = computed(() => filteredOrders.value.length)

// 当前页显示的订单
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredOrders.value.slice(start, end)
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

const handlePageChange = (page: number) => {
  currentPage.value = page
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

const manageCustomers = () => {
  // 跳转到客户管理页面
  console.log('客户管理')
}

const viewOrder = (orderId: number) => {
  // 查看订单详情
  router.push({
    path: '/order-detail',
    query: { orderId: orderId.toString() }
  })
}

const createOrder = () => {
  // 跳转到创建订单页面
  router.push('/create-order')
}

const editOrder = (orderId: number) => {
  // 编辑订单
  router.push({
    path: '/create-order',
    query: { orderId: orderId.toString() }
  })
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

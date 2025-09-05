<template>
  <div>
    <!-- 页面标题 -->
    <common-title title="样品管理工作台" content="首页 / 样品管理工作台" />

    <!-- 统计卡片 -->
    <common-stats :model="statsData" />

    <!-- 搜索和筛选栏 -->
    <common-filter title="待接收样品订单" @filter="loadOrders">
      <!-- 搜索框 -->
      <div class="relative">
        <svg
          class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          class="w-48 rounded-lg border border-gray-300 bg-white px-9 py-2 text-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          placeholder="输入项目编号查询"
          maxlength="20"
          @keypress.enter="loadOrders"
        />
      </div>

      <!-- 状态查询 -->
      <select
        v-model="statusFilter"
        class="w-48 cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
      >
        <option value="">全部</option>
        <option value="urgent">紧急</option>
        <option value="today">今日到样</option>
      </select>
    </common-filter>

    <!-- 订单列表 -->
    <common-table
      :config="tableConfig"
      :items="tableColumns"
      :model="orderList"
      @current-change="loadOrders"
    >
      <!-- 状态列插槽 -->
      <template #status="{ scope }">
        <div class="flex gap-2">
          <span
            :class="[
              'rounded-full px-3 py-1 text-xs font-medium',
              scope.isUrgent
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            ]"
          >
            {{ scope.isUrgent ? '紧急' : '普通' }}
          </span>
          <span
            class="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700"
          >
            待接收
          </span>
        </div>
      </template>

      <!-- 操作列插槽 -->
      <template #actions="{ scope }">
        <button
          class="rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/30"
          @click="viewOrderDetail(scope.id)"
        >
          查看详情
        </button>
      </template>
    </common-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toolSleep } from '@/utils/tool'
import CommonTitle from '@/components/common-title.vue'
import CommonStats from '@/components/common-stats.vue'
import CommonFilter from '@/components/common-filter.vue'
import CommonTable from '@/components/common-table.vue'

defineOptions({ name: 'SampleDashboard' })

/**
 * 订单数据接口
 */
interface Order {
  id: string
  customer: string
  sampleCount: number
  sampler: string
  testType: string
  expectedTime: string
  isUrgent: boolean
  status: 'waiting' | 'received' | 'processing'
}

const router = useRouter()

// 响应式数据
const allOrders = ref<Order[]>([])
const orderList = ref<Order[]>([])
const searchQuery = ref('')
const statusFilter = ref('')
const loading = ref(false)

// 表格配置
const tableConfig = ref({
  loading: false,
  rowKey: 'id',
  selection: false,
  pagination: true,
  total: 0,
  current: 1
})

// 表格列配置
const tableColumns = [
  { label: '订单编号', props: 'id', minWidth: 120 },
  { label: '客户名称', props: 'customer', minWidth: 180 },
  { label: '样品数量', props: 'sampleCount', minWidth: 100 },
  { label: '采样员', props: 'sampler', minWidth: 100 },
  { label: '检测项目', props: 'testType', minWidth: 150 },
  { label: '预计到样', props: 'expectedTime', minWidth: 120 },
  { label: '状态', props: 'status', minWidth: 120, slotName: 'status' },
  { label: '操作', props: 'actions', minWidth: 100, slotName: 'actions' }
]

// 统计数据
const statsData = computed(() => [
  {
    label: '待接收样品',
    value: allOrders.value.filter(order => order.status === 'waiting').length,
    trend: '↑ 12% 较昨日',
    trendUp: true
  },
  {
    label: '今日已接收',
    value: 156, // 模拟数据
    trend: '↑ 8% 较昨日',
    trendUp: true
  },
  {
    label: '待处理订单',
    value: allOrders.value.filter(order => order.status === 'processing')
      .length,
    trend: '↓ 5% 较昨日',
    trendUp: false
  }
])

// 过滤订单数据
const filterOrders = () => {
  let filtered = allOrders.value

  // 按搜索关键词过滤
  if (searchQuery.value) {
    const keyword = searchQuery.value.toLowerCase()
    filtered = filtered.filter(order =>
      order.id.toLowerCase().includes(keyword)
    )
  }

  // 按状态筛选
  if (statusFilter.value === 'urgent') {
    filtered = filtered.filter(order => order.isUrgent)
  } else if (statusFilter.value === 'today') {
    const today = new Date().toISOString().split('T')[0]
    filtered = filtered.filter(order => order.expectedTime.includes(today))
  }

  // 更新表格配置
  tableConfig.value.total = filtered.length
  orderList.value = filtered
}

/**
 * 加载订单数据
 */
const loadOrders = async (): Promise<void> => {
  try {
    tableConfig.value.loading = true
    await loadOrdersData()
    filterOrders()
  } catch (error) {
    console.error('加载订单数据失败:', error)
  } finally {
    tableConfig.value.loading = false
  }
}

/**
 * 查看订单详情
 * @param orderId 订单ID
 */
const viewOrderDetail = (orderId: string): void => {
  router.push({
    path: '/sample-detail',
    query: {
      orderId
    }
  })
}

/**
 * 加载订单数据
 */
const loadOrdersData = async (): Promise<void> => {
  try {
    loading.value = true
    await toolSleep(500) // 模拟网络延迟

    // 模拟订单数据
    allOrders.value = [
      {
        id: 'XW2024031501',
        customer: '深圳市某某自来水公司',
        sampleCount: 8,
        sampler: '李采样',
        testType: '生活饮用水常规',
        expectedTime: '10:30',
        isUrgent: true,
        status: 'waiting'
      },
      {
        id: 'XW2024031502',
        customer: '福田区某酒店',
        sampleCount: 5,
        sampler: '王技术',
        testType: '二次供水检测',
        expectedTime: '11:00',
        isUrgent: false,
        status: 'waiting'
      },
      {
        id: 'XW2024031503',
        customer: '罗湖区某小区物业',
        sampleCount: 12,
        sampler: '张工程',
        testType: '游泳池水质检测',
        expectedTime: '14:00',
        isUrgent: true,
        status: 'waiting'
      },
      {
        id: 'XW2024031504',
        customer: '宝安区某工厂',
        sampleCount: 10,
        sampler: '陈专员',
        testType: '工业废水检测',
        expectedTime: '15:30',
        isUrgent: false,
        status: 'waiting'
      },
      {
        id: 'XW2024031505',
        customer: '南山区某学校',
        sampleCount: 6,
        sampler: '刘检测',
        testType: '校园饮用水检测',
        expectedTime: '09:00',
        isUrgent: false,
        status: 'received'
      },
      {
        id: 'XW2024031506',
        customer: '龙岗区某医院',
        sampleCount: 15,
        sampler: '周采样',
        testType: '医疗废水检测',
        expectedTime: '16:00',
        isUrgent: true,
        status: 'processing'
      }
    ]
  } catch (error) {
    console.error('加载订单数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadOrders()
})
</script>

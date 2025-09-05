<template>
  <div>
    <!-- 页面头部 -->
    <common-title title="订单审核工作台" content="首页 / 订单审核工作台" />

    <!-- 统计卡片 -->
    <common-stats :model="statsData" />

    <!-- 筛选 -->
    <common-filter title="待审核订单列表" @filter="handleFilter">
      <input
        v-model="searchKeyword"
        type="text"
        class="w-48 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        placeholder="搜索项目编号"
        @input="handleSearch"
      />
      <label
        class="flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 transition-all duration-200 hover:border-indigo-500 hover:bg-gray-50"
      >
        <input v-model="urgentOnly" type="checkbox" class="cursor-pointer" />
        <span class="cursor-pointer text-sm text-gray-700">
          仅显示加急订单
        </span>
      </label>
    </common-filter>

    <!-- 待审核订单列表 -->
    <common-table
      :config="tableConfig"
      :items="tableColumns"
      :model="filteredOrders"
      @current-change="loadOrdersData"
    >
      <!-- 订单号列 -->
      <template #orderIdSlot="{ scope }">
        <div
          class="cursor-pointer font-bold text-indigo-600 hover:underline"
          @click="viewOrderDetail(scope.id)"
        >
          {{ scope.id }}
        </div>
      </template>

      <!-- 检测类型列 -->
      <template #testTypeSlot="{ scope }">
        <span
          :class="
            isStandardTest(scope.testType)
              ? 'font-medium text-emerald-600'
              : 'text-gray-800'
          "
        >
          {{ scope.testType }}
        </span>
      </template>

      <!-- 加急状态列 -->
      <template #urgentSlot="{ scope }">
        <span
          v-if="scope.isUrgent"
          class="inline-block rounded bg-red-500 px-2 py-1 text-xs font-bold text-white"
        >
          加急
        </span>
        <span v-else class="text-gray-400">-</span>
      </template>

      <!-- 操作列 -->
      <template #actionSlot="{ scope }">
        <div class="flex gap-2">
          <button
            class="rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/30"
            @click="viewOrderDetail(scope.id)"
          >
            查看详情
          </button>
          <button
            class="rounded-md bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/30"
            @click="approveOrder(scope.id)"
          >
            快速通过
          </button>
          <button
            class="rounded-md border border-red-500 bg-white px-3 py-1.5 text-xs font-medium text-red-500 transition-all duration-200 hover:bg-red-50"
            @click="rejectOrder(scope.id)"
          >
            驳回
          </button>
        </div>
      </template>
    </common-table>

    <!-- 驳回弹窗 -->
    <common-modal-reject ref="rejectModalRef" @refresh="loadOrdersData" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CommonTitle from '@/components/common-title.vue'
import CommonFilter from '@/components/common-filter.vue'
import CommonTable from '@/components/common-table.vue'
import CommonStats from '@/components/common-stats.vue'
import CommonModalReject from '@/components/common-modal-reject.vue'

defineOptions({ name: 'ReviewDashboard' })

interface Order {
  id: string
  customer: string
  unit: string
  testType: string
  submitTime: string
  isUrgent: boolean
}

const router = useRouter()

// 响应式数据
const allOrders = ref<Order[]>([])
const filteredOrders = ref<Order[]>([])
const searchKeyword = ref('')
const urgentOnly = ref(false)
const rejectModalRef = ref<InstanceType<typeof CommonModalReject> | null>(null)

// 统计数据
const statsData = computed(() => [
  {
    label: '待审核订单数',
    value: filteredOrders.value.length
  },
  {
    label: '加急订单数',
    value: filteredOrders.value.filter(order => order.isUrgent).length
  },
  {
    label: '今日已审核',
    value: 28 // 模拟数据
  }
])

// 表格配置
const tableConfig = ref({
  rowKey: 'id',
  selection: false,
  loading: false,
  pagination: true,
  total: 0,
  current: 1
})

// 表格列配置
const tableColumns = [
  {
    label: '订单号',
    props: 'id',
    minWidth: 180,
    slotName: 'orderIdSlot'
  },
  {
    label: '客户名称',
    props: 'customer',
    minWidth: 150
  },
  {
    label: '受检单位',
    props: 'unit',
    minWidth: 120
  },
  {
    label: '检测类型',
    props: 'testType',
    minWidth: 120,
    slotName: 'testTypeSlot'
  },
  {
    label: '提交时间',
    props: 'submitTime',
    minWidth: 140
  },
  {
    label: '加急状态',
    props: 'isUrgent',
    minWidth: 80,
    align: 'center',
    slotName: 'urgentSlot'
  },
  {
    label: '操作',
    props: 'action',
    minWidth: 240,
    align: 'center',
    slotName: 'actionSlot'
  }
]

// 生成测试数据
const generateTestOrders = (): Order[] => {
  const customers = [
    '深圳科技创新中心',
    '广州医药研究院',
    '东莞食品加工厂',
    '佛山纺织工厂',
    '惠州建材公司',
    '中山物流园区',
    '珠海电子科技园',
    '江门化工厂',
    '肇庆制药公司',
    '清远饮料厂',
    '韶关钢铁厂',
    '湛江海产品加工厂',
    '茂名石化公司',
    '阳江五金厂',
    '云浮石材厂',
    '潮州陶瓷厂',
    '汕头玩具厂',
    '揭阳塑料制品厂',
    '梅州农产品公司',
    '河源电子厂',
    '汕尾渔业公司',
    '惠州电池厂',
    '东莞家具厂',
    '中山灯饰城',
    '佛山陶瓷城',
    '广州汽车制造厂',
    '深圳生物科技园',
    '珠海航空产业园'
  ]

  const units = [
    '生产车间A区',
    '生产车间B区',
    '办公楼一层',
    '办公楼二层',
    '办公楼三层',
    '实验室',
    '研发中心',
    '仓储区域',
    '食堂',
    '宿舍楼',
    '净化车间',
    '无菌室',
    '包装车间',
    '原料仓库',
    '成品仓库',
    '质检中心',
    '污水处理站',
    '锅炉房',
    '配电室',
    '停车场'
  ]

  const testTypes = [
    '洁净室环境',
    '生活饮用水',
    '工业废水',
    '噪音检测',
    '空气质量',
    '50325-2020',
    '18883-2022',
    '土壤检测',
    '食品接触材料',
    '化学品检测',
    '微生物检测',
    '重金属检测',
    '有机污染物',
    '放射性检测',
    'VOCs检测'
  ]

  const orders: Order[] = []
  const today = new Date()

  for (let i = 0; i < 30; i++) {
    const isUrgent = Math.random() < 0.3
    const submitTime = new Date(today)
    submitTime.setHours(today.getHours() - Math.floor(Math.random() * 72))

    orders.push({
      id: `XW${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${String(100 + i).padStart(3, '0')}`,
      customer: customers[Math.floor(Math.random() * customers.length)],
      unit: units[Math.floor(Math.random() * units.length)],
      testType: testTypes[Math.floor(Math.random() * testTypes.length)],
      submitTime: formatDateTime(submitTime),
      isUrgent
    })
  }

  // 按提交时间倒序排序（最新的在前）
  orders.sort((a, b) => {
    // 先按加急状态排序
    if (a.isUrgent && !b.isUrgent) return -1
    if (!a.isUrgent && b.isUrgent) return 1
    // 再按时间排序
    return new Date(b.submitTime).getTime() - new Date(a.submitTime).getTime()
  })

  return orders
}

// 格式化日期时间
const formatDateTime = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// 判断是否为标准检测
const isStandardTest = (testType: string): boolean => {
  return testType.includes('50325') || testType.includes('18883')
}

// 搜索处理
const handleSearch = () => {
  applyFilters()
}

// 过滤处理
const handleFilter = () => {
  applyFilters()
}

// 应用过滤条件
const applyFilters = () => {
  let filtered = [...allOrders.value]

  // 应用加急过滤
  if (urgentOnly.value) {
    filtered = filtered.filter(order => order.isUrgent)
  }

  // 应用搜索过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(
      order =>
        order.id.toLowerCase().includes(keyword) ||
        order.customer.toLowerCase().includes(keyword) ||
        order.unit.toLowerCase().includes(keyword) ||
        order.testType.toLowerCase().includes(keyword)
    )
  }

  filteredOrders.value = filtered
}

// 订单操作
const viewOrderDetail = (orderId: string) => {
  // 跳转到订单详情页面
  router.push({
    path: '/review-detail',
    query: {
      orderId
    }
  })
}

const approveOrder = async (orderId: string) => {
  if (confirm(`确定要通过订单 ${orderId} 吗？`)) {
    try {
      // 模拟审核请求
      await new Promise(resolve =>
        setTimeout(resolve, 500 + Math.random() * 500)
      )
      loadOrdersData()
    } catch (error) {
      console.error('审核失败:', error)
    } finally {
    }
  }
}

const rejectOrder = (orderId: string) => {
  rejectModalRef.value?.open(orderId)
}

// 加载订单数据
const loadOrdersData = async () => {
  try {
    tableConfig.value.loading = true
    // 模拟网络请求延迟
    await new Promise(resolve =>
      setTimeout(resolve, 1000 + Math.random() * 1000)
    )
    allOrders.value = generateTestOrders()
    applyFilters()
    tableConfig.value.total = filteredOrders.value.length
  } catch (error) {
    console.error('加载订单数据失败:', error)
  } finally {
    tableConfig.value.loading = false
  }
}

// 初始化
onMounted(() => {
  loadOrdersData()
})
</script>

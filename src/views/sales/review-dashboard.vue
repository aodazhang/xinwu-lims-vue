<template>
  <div>
    <!-- 页面头部 -->
    <common-title title="订单审核工作台" content="首页 / 订单审核工作台" />

    <!-- 统计卡片 -->
    <div class="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      <div
        class="rounded-xl bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      >
        <div class="mb-2 text-sm text-gray-500">待审核订单数</div>
        <div class="text-3xl font-bold text-gray-800">
          {{ stats.pending }}
        </div>
      </div>
      <div
        class="rounded-xl bg-gradient-to-br from-yellow-100 to-yellow-200 p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      >
        <div class="mb-2 text-sm text-gray-500">加急订单数</div>
        <div class="text-3xl font-bold text-yellow-800">
          {{ stats.urgent }}
        </div>
      </div>
      <div
        class="rounded-xl bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      >
        <div class="mb-2 text-sm text-gray-500">今日已审核</div>
        <div class="text-3xl font-bold text-gray-800">
          {{ stats.approved }}
        </div>
      </div>
    </div>

    <!-- 搜索栏 -->
    <div
      class="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
    >
      <h3 class="text-xl font-bold text-gray-800">待审核订单列表</h3>
      <div class="flex flex-col gap-3 sm:flex-row">
        <input
          v-model="searchKeyword"
          type="text"
          class="w-64 rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="搜索项目编号..."
          @input="handleSearch"
        />
        <label
          class="flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 transition-all duration-200 hover:border-indigo-500 hover:bg-gray-50"
        >
          <input
            v-model="urgentOnly"
            type="checkbox"
            class="cursor-pointer"
            @change="handleFilter"
          />
          <span class="cursor-pointer text-sm text-gray-700"
            >仅显示加急订单</span
          >
        </label>
      </div>
    </div>

    <!-- 订单卡片列表 -->
    <div
      v-if="paginatedOrders.length > 0"
      class="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3"
    >
      <div
        v-for="order in paginatedOrders"
        :key="order.id"
        class="relative overflow-hidden rounded-xl bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        :class="{
          'before:absolute before:left-0 before:right-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-red-500 before:to-red-600':
            order.isUrgent
        }"
      >
        <!-- 订单头部 -->
        <div class="mb-4 flex items-start justify-between">
          <div
            class="cursor-pointer text-base font-bold text-indigo-600 hover:underline"
            @click="viewOrderDetail(order.id)"
          >
            {{ order.id }}
          </div>
          <span
            v-if="order.isUrgent"
            class="rounded bg-red-500 px-2 py-1 text-xs font-bold text-white"
          >
            加急
          </span>
        </div>

        <!-- 订单信息 -->
        <div class="mb-4 flex flex-col gap-2">
          <div class="flex gap-2 text-sm">
            <span class="min-w-20 text-gray-500">客户名称：</span>
            <span class="flex-1 font-medium text-gray-800">{{
              order.customer
            }}</span>
          </div>
          <div class="flex gap-2 text-sm">
            <span class="min-w-20 text-gray-500">受检单位：</span>
            <span class="flex-1 font-medium text-gray-800">{{
              order.unit
            }}</span>
          </div>
          <div class="flex gap-2 text-sm">
            <span class="min-w-20 text-gray-500">检测类型：</span>
            <span
              class="flex-1 font-medium"
              :class="
                isStandardTest(order.testType)
                  ? 'text-emerald-600'
                  : 'text-gray-800'
              "
            >
              {{ order.testType }}
            </span>
          </div>
          <div class="flex gap-2 text-sm">
            <span class="min-w-20 text-gray-500">提交时间：</span>
            <span class="flex-1 font-medium text-gray-800">{{
              order.submitTime
            }}</span>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex gap-2.5 border-t border-gray-200 pt-4">
          <button
            class="flex-1 rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30"
            @click="viewOrderDetail(order.id)"
          >
            查看详情
          </button>
          <button
            class="flex-1 rounded-md bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/30"
            @click="approveOrder(order.id)"
          >
            快速通过
          </button>
          <button
            class="flex-1 rounded-md border border-red-500 bg-white px-4 py-2.5 text-sm font-medium text-red-500 transition-all duration-200 hover:bg-red-50"
            @click="rejectOrder(order.id)"
          >
            驳回
          </button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="py-15 mt-10 rounded-xl bg-white text-center">
      <div class="mb-4 text-6xl text-gray-300">📋</div>
      <div class="mb-2 text-xl font-bold text-gray-500">暂无待审核订单</div>
      <div class="text-sm text-gray-400">当前页面没有需要审核的订单</div>
    </div>

    <!-- 分页控件 -->
    <common-pagination
      :total="filteredOrders.length"
      :current="currentPage"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CommonTitle from '@/components/common-title.vue'
import CommonPagination from '@/components/common-pagination.vue'

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
const currentPage = ref(1)
const searchKeyword = ref('')
const urgentOnly = ref(false)
const loading = ref(false)

// 统计数据
const stats = computed(() => ({
  pending: filteredOrders.value.length,
  urgent: filteredOrders.value.filter(order => order.isUrgent).length,
  approved: 28 // 模拟数据
}))

// 分页计算
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * 10
  const end = start + 10
  return filteredOrders.value.slice(start, end)
})

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
  currentPage.value = 1
}

// 分页方法
const handlePageChange = (page: number) => {
  currentPage.value = page
}

// 订单操作
const viewOrderDetail = (orderId: string) => {
  // 跳转到订单详情页面
  console.log('查看订单详情:', orderId)
  // router.push(`/order-review/${orderId}`)
}

const approveOrder = (orderId: string) => {
  if (confirm(`确定要通过订单 ${orderId} 吗？`)) {
    loading.value = true

    setTimeout(() => {
      // 从列表中移除该订单
      const index = allOrders.value.findIndex(o => o.id === orderId)
      if (index !== -1) {
        allOrders.value.splice(index, 1)
        applyFilters()

        // 如果当前页没有数据了，返回上一页
        const totalPages = Math.ceil(filteredOrders.value.length / 10) || 1
        if (currentPage.value > totalPages) {
          currentPage.value = totalPages
        }

        alert(`订单 ${orderId} 已通过审核！`)
      }
      loading.value = false
    }, 500)
  }
}

const rejectOrder = (orderId: string) => {
  const reason = prompt(`请输入驳回订单 ${orderId} 的原因：`)
  if (reason) {
    loading.value = true

    setTimeout(() => {
      // 从列表中移除该订单
      const index = allOrders.value.findIndex(o => o.id === orderId)
      if (index !== -1) {
        allOrders.value.splice(index, 1)
        applyFilters()

        // 如果当前页没有数据了，返回上一页
        const totalPages = Math.ceil(filteredOrders.value.length / 10) || 1
        if (currentPage.value > totalPages) {
          currentPage.value = totalPages
        }

        alert(`订单 ${orderId} 已被驳回！\n驳回原因：${reason}`)
      }
      loading.value = false
    }, 500)
  }
}

// 初始化
onMounted(() => {
  allOrders.value = generateTestOrders()
  filteredOrders.value = [...allOrders.value]
})
</script>

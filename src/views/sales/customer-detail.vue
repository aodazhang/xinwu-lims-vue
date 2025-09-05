<template>
  <div v-loading="loading">
    <!-- 页面头部 -->
    <common-title
      :title="`${customerData.id} ${customerData.name}`"
      content="销售工作台 / 客户管理 / 客户详情"
    >
      <button
        class="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        @click="exportCustomerInfo"
      >
        导出客户信息
      </button>
      <button
        class="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
        @click="showEditModal"
      >
        编辑客户
      </button>
    </common-title>

    <!-- 内容布局 -->
    <div class="mt-5 grid grid-cols-1 gap-5 md:grid-cols-[1fr_380px]">
      <!-- 左侧主信息区 -->
      <div class="space-y-5">
        <!-- 客户基本信息 -->
        <common-detail-card title="客户基本信息">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-500">客户编号</span>
              <span class="text-sm font-medium text-gray-900">{{
                customerData.id
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-500">客户名称</span>
              <span class="text-sm font-medium text-gray-900">{{
                customerData.name
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-500">客户联系人</span>
              <span class="text-sm font-medium text-gray-900">{{
                customerData.contactName
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-500">客户联系电话</span>
              <span class="text-sm font-medium text-gray-900">{{
                customerData.contactPhone
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-500">客户地址</span>
              <span class="text-sm font-medium text-gray-900">{{
                customerData.address
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-500">客户分类</span>
              <span class="text-sm font-medium text-gray-900">{{
                customerData.category
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-500">客户来源</span>
              <span class="text-sm font-medium text-gray-900">{{
                customerData.source
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-500">客户状态</span>
              <span
                class="text-sm font-medium"
                :class="getStatusColor(customerData.status)"
                >{{ customerData.status }}</span
              >
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-500">所属行业</span>
              <span class="text-sm font-medium text-gray-900">{{
                customerData.industry
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-500">创建时间</span>
              <span class="text-sm font-medium text-gray-900">{{
                customerData.createdAt
              }}</span>
            </div>
          </div>
        </common-detail-card>

        <!-- 客户订单列表 -->
        <common-detail-card title="订单历史">
          <template #control>
            <button
              class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              @click="showCreateOrder"
            >
              新建订单
            </button>
          </template>
          <div class="space-y-3">
            <div
              v-for="order in orderList"
              :key="order.orderNumber"
              class="cursor-pointer rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100"
              @click="goToOrderDetail(order.orderNumber)"
            >
              <div class="mb-2 flex items-center justify-between">
                <span class="text-sm font-semibold text-indigo-600">{{
                  order.orderNumber
                }}</span>
                <span
                  class="rounded-full px-2 py-1 text-xs font-medium"
                  :class="getOrderStatusClass(order.status)"
                >
                  {{ order.status }}
                </span>
              </div>
              <div class="flex flex-nowrap items-center gap-4">
                <div class="flex-auto">
                  <div class="text-sm text-gray-900">{{ order.unit }}</div>
                  <div class="mt-1 text-xs text-gray-500">{{ order.type }}</div>
                </div>
                <div class="text-center text-sm text-gray-900">
                  {{ order.points }}点
                </div>
                <div class="text-center text-gray-400">
                  <svg
                    class="mx-auto h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6 3l4 4-4 4v-8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </common-detail-card>
      </div>

      <!-- 右侧统计区 -->
      <div class="space-y-5">
        <!-- 统计卡片 -->
        <div class="grid grid-cols-2 gap-4">
          <div class="rounded-xl bg-white p-5 text-center shadow-sm">
            <div
              class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-xl text-white"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
                />
              </svg>
            </div>
            <div class="mb-1 text-2xl font-bold text-gray-900">
              {{ stats.orderCount }}
            </div>
            <div class="text-sm text-gray-500">订单数量</div>
          </div>

          <div class="rounded-xl bg-white p-5 text-center shadow-sm">
            <div
              class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-green-600 text-xl text-white"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"
                />
              </svg>
            </div>
            <div class="mb-1 text-2xl font-bold text-gray-900">
              {{ stats.totalAmount }}
            </div>
            <div class="text-sm text-gray-500">订单金额</div>
          </div>
        </div>

        <!-- 客户状态详情 -->
        <common-detail-card title="客户状态详情">
          <div class="space-y-3">
            <div
              class="flex items-center justify-between rounded-lg bg-gray-50 p-3"
            >
              <span class="text-sm text-gray-500">首次下单时间</span>
              <span class="text-sm font-semibold text-gray-900">{{
                statusDetails.firstOrderDate
              }}</span>
            </div>
            <div
              class="flex items-center justify-between rounded-lg bg-gray-50 p-3"
            >
              <span class="text-sm text-gray-500">最近下单时间</span>
              <span class="text-sm font-semibold text-gray-900">{{
                statusDetails.lastOrderDate
              }}</span>
            </div>
            <div
              class="flex items-center justify-between rounded-lg bg-gray-50 p-3"
            >
              <span class="text-sm text-gray-500">平均订单金额</span>
              <span class="text-sm font-semibold text-gray-900">{{
                statusDetails.avgOrderAmount
              }}</span>
            </div>
            <div
              class="flex items-center justify-between rounded-lg bg-gray-50 p-3"
            >
              <span class="text-sm text-gray-500">订单完成率</span>
              <span class="text-sm font-semibold text-gray-900">{{
                statusDetails.completionRate
              }}</span>
            </div>
            <div
              class="flex items-center justify-between rounded-lg bg-gray-50 p-3"
            >
              <span class="text-sm text-gray-500">已收款金额</span>
              <span class="text-sm font-semibold text-gray-900">{{
                statusDetails.paidAmount
              }}</span>
            </div>
            <div
              class="flex items-center justify-between rounded-lg bg-gray-50 p-3"
            >
              <span class="text-sm text-gray-500">待收款金额</span>
              <span class="text-sm font-semibold text-gray-900">{{
                statusDetails.pendingAmount
              }}</span>
            </div>
          </div>
        </common-detail-card>

        <!-- 负责销售 -->
        <common-detail-card title="负责销售">
          <common-detail-person :persons="[salesPerson]" />
        </common-detail-card>
      </div>
    </div>

    <!-- 编辑客户弹窗 -->
    <common-modal-customer ref="customerModalRef" @refresh="loadCustomerData" />

    <!-- 成功提示 -->
    <div
      v-if="showSuccessToast"
      class="fixed right-5 top-5 z-50 flex transform items-center gap-3 rounded-lg bg-white p-4 shadow-lg transition-transform"
      :class="showSuccessToast ? 'translate-x-0' : 'translate-x-full'"
    >
      <div
        class="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-sm text-white"
      >
        ✓
      </div>
      <div class="text-sm text-gray-900">客户信息更新成功</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CommonTitle from '@/components/common-title.vue'
import CommonDetailCard from '@/components/common-detail-card.vue'
import CommonDetailPerson from '@/components/common-detail-person.vue'
import CommonModalCustomer from '@/components/common-modal-customer.vue'

// 路由相关
const route = useRoute()
const router = useRouter()

// Props
const props = defineProps<{ customerId?: string }>()

// 响应式数据
const loading = ref(true)
const showSuccessToast = ref(false)
const customerModalRef = ref<InstanceType<typeof CommonModalCustomer> | null>(
  null
)

// 客户数据
const customerData = reactive({
  id: 'KH202504231001',
  name: '广州环保科技有限公司',
  contactName: '王经理',
  contactPhone: '13800138001',
  address: '广州市天河区科技园A栋3楼',
  category: '渠道',
  source: '自己开发',
  status: '已成交',
  industry: '室内净化',
  createdAt: '2025-08-15 10:30'
})

// 订单列表
const orderList = ref([
  {
    orderNumber: 'XW250903-100',
    status: '采样中',
    unit: '广州环保科技总部',
    type: '室内空气质量 | 委托检测（采样）',
    points: 12
  },
  {
    orderNumber: 'XW250820-089',
    status: '已完成',
    unit: '广州环保科技分部',
    type: '室内空气质量 | 委托检测（采样）',
    points: 8
  },
  {
    orderNumber: 'XW250815-067',
    status: '已完成',
    unit: '广州环保科技办公楼',
    type: '生活饮用水水质检测 | 委托检测（送样）',
    points: 6
  }
])

// 统计数据
const stats = reactive({
  orderCount: 15,
  totalAmount: '¥128,900'
})

// 状态详情
const statusDetails = reactive({
  firstOrderDate: '2024-06-15',
  lastOrderDate: '2025-09-03',
  avgOrderAmount: '¥8,593',
  completionRate: '93.3%',
  paidAmount: '¥115,670',
  pendingAmount: '¥13,230'
})

// 销售人员
const salesPerson = reactive({
  name: '张三',
  role: '销售人员'
})

// 方法
const getStatusColor = (status: string) => {
  switch (status) {
    case '已成交':
      return 'text-green-600'
    case '公海':
      return 'text-blue-600'
    case '跟进中':
      return 'text-yellow-600'
    default:
      return 'text-gray-600'
  }
}

const getOrderStatusClass = (status: string) => {
  switch (status) {
    case '采样中':
      return 'bg-blue-100 text-blue-800'
    case '已完成':
      return 'bg-green-100 text-green-800'
    case '待处理':
      return 'bg-yellow-100 text-yellow-800'
    case '检测中':
      return 'bg-purple-100 text-purple-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// 数据转换辅助函数
const getSourceValue = (source: string) => {
  const sourceMap: Record<string, string> = {
    自己开发: 'self',
    渠道: 'channel',
    转介绍: 'referral',
    老客户: 'old',
    美团点评: 'meituan',
    天猫: 'tmall',
    百度: 'baidu',
    抖音: 'douyin',
    腾讯地图: 'tencent',
    代理商: 'agent'
  }
  return sourceMap[source] || 'self'
}

const getStatusValue = (status: string) => {
  const statusMap: Record<string, string> = {
    已成交: 'active',
    公海: 'public',
    跟进中: 'following'
  }
  return statusMap[status] || 'active'
}

const getIndustryValue = (industry: string) => {
  const industryMap: Record<string, string> = {
    室内净化: 'indoor',
    空调清洗: 'ac',
    检测行业: 'testing',
    环保设备: 'env'
  }
  return industryMap[industry] || 'indoor'
}

const loadCustomerData = async () => {
  try {
    loading.value = true

    // 获取客户 ID，优先使用路由参数，其次使用 props
    const customerId = (route.params.id as string) || props.customerId

    if (!customerId) {
      console.error('未找到客户 ID')
      return
    }

    // 模拟 API 调用延迟
    await new Promise(resolve => setTimeout(resolve, 800))

    // 模拟从后端获取数据
    const customerMap: Record<string, any> = {
      KH202504231001: {
        id: 'KH202504231001',
        name: '广州环保科技有限公司',
        contactName: '王经理',
        contactPhone: '13800138001',
        address: '广州市天河区科技园A栋3楼',
        category: '渠道',
        source: '自己开发',
        status: '已成交',
        industry: '室内净化',
        createdAt: '2025-08-15 10:30'
      },
      KH202504231002: {
        id: 'KH202504231002',
        name: '深圳创新工业园',
        contactName: '李主任',
        contactPhone: '13800138002',
        address: '深圳市南山区科技园B区',
        category: '渠道',
        source: '渠道',
        status: '已成交',
        industry: '检测行业',
        createdAt: '2025-08-16 14:20'
      },
      KH202504251003: {
        id: 'KH202504251003',
        name: '佛山制造企业',
        contactName: '张总',
        contactPhone: '13800138003',
        address: '佛山市顺德区工业园',
        category: '个体户',
        source: '转介绍',
        status: '跟进中',
        industry: '环保设备',
        createdAt: '2025-08-17 09:15'
      }
    }

    if (customerMap[customerId]) {
      Object.assign(customerData, customerMap[customerId])
    } else {
      console.error(`未找到客户数据: ${customerId}`)
    }
  } catch (error) {
    console.error('加载客户数据失败:', error)
  } finally {
    loading.value = false
  }
}

const showEditModal = () => {
  // 转换数据格式并打开公共弹窗组件
  const customerFormData = {
    customerName: customerData.name,
    contactName: customerData.contactName,
    contactPhone: customerData.contactPhone,
    address: customerData.address,
    category: customerData.category === '个体户' ? 'individual' : 'channel',
    source: getSourceValue(customerData.source),
    status: getStatusValue(customerData.status),
    industry: getIndustryValue(customerData.industry)
  }
  customerModalRef.value?.open(customerFormData)
}

const exportCustomerInfo = () => {
  // 实际应该调用后端API生成导出文件
  alert(`导出客户 ${customerData.name} 的信息`)
}

const goToOrderDetail = (orderNumber: string) => {
  router.push({
    path: '/sales-detail',
    query: {
      orderId: orderNumber
    }
  })
}

const showCreateOrder = () => {
  router.push({
    path: '/sales-form',
    query: {
      customer: customerData.id
    }
  })
}

// 生命周期
onMounted(() => {
  loadCustomerData()
})
</script>

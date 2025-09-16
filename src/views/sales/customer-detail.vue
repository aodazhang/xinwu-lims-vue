<template>
  <div v-loading="loading">
    <!-- 页面头部 -->
    <common-title
      :title="`${customerData.customerCode} - ${customerData.customerName}`"
      content="销售工作台 / 客户管理 / 客户详情"
    >
      <!-- <button
        class="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        @click="exportCustomerInfo"
      >
        导出客户信息
      </button> -->
      <button
        class="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
        @click="onClickEdit"
      >
        编辑客户
      </button>
    </common-title>

    <!-- 内容布局 md:grid-cols-[1fr_380px] -->
    <div class="mt-5 grid grid-cols-1 gap-5">
      <!-- 左侧主信息区 -->
      <div class="space-y-5">
        <!-- 客户基本信息 -->
        <common-detail-card title="客户基本信息">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-500">客户编号</span>
              <span class="text-sm font-medium text-gray-900">{{
                customerData.customerCode
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-500">客户名称</span>
              <span class="text-sm font-medium text-gray-900">{{
                customerData.customerName
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-500">客户联系人</span>
              <span class="text-sm font-medium text-gray-900">{{
                customerData.contactPerson
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
                customerData.customerAddress
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-500">客户分类</span>
              <span class="text-sm font-medium text-gray-900">{{
                customerData.customerCategoryName
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-500">客户来源</span>
              <span class="text-sm font-medium text-gray-900">{{
                customerData.customerSourceName
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-500">客户状态</span>
              <span
                class="text-sm font-medium"
                :class="getStatusColor(customerData.customerStatusName)"
                >{{ customerData.customerStatusName }}</span
              >
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-500">所属行业</span>
              <span class="text-sm font-medium text-gray-900">{{
                customerData.industryName
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-500">创建时间</span>
              <span class="text-sm font-medium text-gray-900">{{
                dateToString(customerData.createTime, 'YYYY-MM-DD HH:mm')
              }}</span>
            </div>
          </div>
        </common-detail-card>

        <!-- 客户订单列表 -->
        <!-- <common-detail-card title="订单历史">
          <template #control>
            <button
              class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              @click="onClickOrderAdd"
            >
              新建订单
            </button>
          </template>
          <div class="space-y-3">
            <div
              v-for="order in orderList"
              :key="order.orderNumber"
              class="cursor-pointer rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100"
              @click="onClickOrderDetail(order.orderNumber)"
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
        </common-detail-card> -->
      </div>

      <!-- 右侧统计区 -->
      <div class="space-y-5">
        <!-- 统计卡片 -->
        <!-- <div class="grid grid-cols-2 gap-4">
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
        </div> -->

        <!-- 客户状态详情 -->
        <!-- <common-detail-card title="客户状态详情">
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
        </common-detail-card> -->

        <!-- 负责销售 -->
        <!-- <common-detail-card title="负责销售">
          <common-detail-person :persons="[salesPerson]" />
        </common-detail-card> -->
      </div>
    </div>

    <!-- 编辑客户弹窗 -->
    <common-modal-customer ref="customerModalRef" @refresh="loadDataDetail" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// import { useRouter } from 'vue-router'
import { isObject } from '@/utils/is'
import { dateToString } from '@/utils/date'
import api from '@/api'
import CommonTitle from '@/components/common-title.vue'
import CommonDetailCard from '@/components/common-detail-card.vue'
// import CommonDetailPerson from '@/components/common-detail-person.vue'
import CommonModalCustomer from '@/components/common-modal-customer.vue'

defineOptions({ name: 'CustomerDetail' })

// Props
const props = defineProps<{ customerId?: number | string }>()

// 路由相关
// const router = useRouter()

// 响应式数据
const loading = ref(true)
const customerModalRef = ref<InstanceType<typeof CommonModalCustomer> | null>(
  null
)

// 客户数据
const customerData = ref<SalesCustomer>({
  id: 0,
  createTime: '',
  updateTime: '',
  customerCode: '',
  customerName: '',
  contactPerson: '',
  contactPhone: '',
  customerAddress: '',
  customerCategoryId: 0,
  customerCategoryCode: '',
  customerCategoryName: '',
  customerSourceId: 0,
  customerSourceCode: '',
  customerSourceName: '',
  customerStatusId: 0,
  customerStatusCode: '',
  customerStatusName: '',
  industryId: 0,
  industryCode: '',
  industryName: ''
})

// const orderList = ref([
//   {
//     orderNumber: 'XW250903-100',
//     status: '采样中',
//     unit: '广州环保科技总部',
//     type: '室内空气质量 | 委托检测（采样）',
//     points: 12
//   },
//   {
//     orderNumber: 'XW250820-089',
//     status: '已完成',
//     unit: '广州环保科技分部',
//     type: '室内空气质量 | 委托检测（采样）',
//     points: 8
//   },
//   {
//     orderNumber: 'XW250815-067',
//     status: '已完成',
//     unit: '广州环保科技办公楼',
//     type: '生活饮用水水质检测 | 委托检测（送样）',
//     points: 6
//   }
// ])

// 统计数据
// const stats = ref({
//   orderCount: 15,
//   totalAmount: '¥128,900'
// })

// 状态详情
// const statusDetails = ref({
//   firstOrderDate: '2024-06-15',
//   lastOrderDate: '2025-09-03',
//   avgOrderAmount: '¥8,593',
//   completionRate: '93.3%',
//   paidAmount: '¥115,670',
//   pendingAmount: '¥13,230'
// })

// 销售人员
// const salesPerson = ref({
//   name: '张三',
//   role: '销售人员'
// })

// 获取状态样式类
const getStatusColor = (status: string) => {
  const statusClasses = {
    已成交: ' text-green-600',
    公海: ' text-blue-600',
    跟进中: ' text-yellow-600'
  }
  return statusClasses[status as keyof typeof statusClasses] || 'text-gray-600'
}

// const getOrderStatusClass = (status: string) => {
//   switch (status) {
//     case '采样中':
//       return 'bg-blue-100 text-blue-800'
//     case '已完成':
//       return 'bg-green-100 text-green-800'
//     case '待处理':
//       return 'bg-yellow-100 text-yellow-800'
//     case '检测中':
//       return 'bg-purple-100 text-purple-800'
//     default:
//       return 'bg-gray-100 text-gray-800'
//   }
// }

const onClickEdit = () => {
  // 转换数据格式并打开公共弹窗组件
  customerModalRef.value?.open(customerData.value)
}

// const exportCustomerInfo = () => {
//   // 实际应该调用后端API生成导出文件
//   alert(`导出客户 ${customerData.value.customerName} 的信息`)
// }

// const onClickOrderAdd = () => {
//   router.push({
//     path: '/sales-form',
//     query: {
//       customer: customerData.value.id
//     }
//   })
// }

// const onClickOrderDetail = (orderId: string) => {
//   router.push({
//     path: '/sales-detail',
//     query: {
//       orderId
//     }
//   })
// }

// 处理数据请求
const loadDataDetail = async () => {
  try {
    loading.value = true

    const res = await api.loadCustomersDetail(+props.customerId)
    customerData.value = isObject(res)
      ? { ...customerData.value, ...res }
      : customerData.value
  } catch (error) {
    console.error('加载客户数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  loadDataDetail()
})
</script>

<template>
  <div v-loading="loading">
    <!-- 订单头部信息 -->
    <common-title
      :title="orderData.orderNumber"
      content="订单审核工作台 / 订单审核详情"
    />

    <!-- 信息卡片 -->
    <div class="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
      <!-- 销售信息 -->
      <div class="rounded-xl bg-white p-5 shadow-sm">
        <h3
          class="mb-3 flex items-center border-b border-gray-200 pb-3 text-base font-semibold text-gray-900"
        >
          <div
            class="mr-3 h-5 w-1 rounded bg-gradient-to-b from-indigo-500 to-purple-600"
          ></div>
          业务信息
        </h3>
        <div class="space-y-3">
          <div class="flex justify-between border-b border-gray-100 py-2">
            <span class="text-sm text-gray-600">销售人员</span>
            <span class="text-sm font-medium text-gray-900">{{
              orderData.salesperson
            }}</span>
          </div>
          <div class="flex justify-between py-2">
            <span class="text-sm text-gray-600">提交时间</span>
            <span class="text-sm font-medium text-gray-900">{{
              orderData.submitTime
            }}</span>
          </div>
        </div>
      </div>

      <!-- 客户信息 -->
      <div class="rounded-xl bg-white p-5 shadow-sm">
        <h3
          class="mb-3 flex items-center border-b border-gray-200 pb-3 text-base font-semibold text-gray-900"
        >
          <div
            class="mr-3 h-5 w-1 rounded bg-gradient-to-b from-indigo-500 to-purple-600"
          ></div>
          客户信息
        </h3>
        <div class="space-y-3">
          <div class="flex justify-between border-b border-gray-100 py-2">
            <span class="text-sm text-gray-600">客户名称</span>
            <span class="text-sm font-medium text-gray-900">{{
              orderData.customer.name
            }}</span>
          </div>
          <div class="flex justify-between border-b border-gray-100 py-2">
            <span class="text-sm text-gray-600">客户联系人</span>
            <span class="text-sm font-medium text-gray-900">{{
              orderData.customer.contact
            }}</span>
          </div>
          <div class="flex justify-between py-2">
            <span class="text-sm text-gray-600">客户联系电话</span>
            <span class="text-sm font-medium text-gray-900">{{
              orderData.customer.phone
            }}</span>
          </div>
        </div>
      </div>

      <!-- 检测信息 -->
      <div class="rounded-xl bg-white p-5 shadow-sm">
        <h3
          class="mb-3 flex items-center border-b border-gray-200 pb-3 text-base font-semibold text-gray-900"
        >
          <div
            class="mr-3 h-5 w-1 rounded bg-gradient-to-b from-indigo-500 to-purple-600"
          ></div>
          检测信息
        </h3>
        <div class="space-y-3">
          <div class="flex justify-between border-b border-gray-100 py-2">
            <span class="text-sm text-gray-600">受检单位</span>
            <span class="text-sm font-medium text-gray-900">{{
              orderData.testing.unit
            }}</span>
          </div>
          <div class="flex justify-between border-b border-gray-100 py-2">
            <span class="text-sm text-gray-600">采样地址</span>
            <span class="text-sm font-medium text-gray-900">{{
              orderData.testing.address
            }}</span>
          </div>
          <div class="flex justify-between border-b border-gray-100 py-2">
            <span class="text-sm text-gray-600">服务类型</span>
            <span class="text-sm font-medium text-gray-900">{{
              orderData.testing.serviceType
            }}</span>
          </div>
          <div class="flex justify-between border-b border-gray-100 py-2">
            <span class="text-sm text-gray-600">检测类型</span>
            <span class="text-sm font-semibold text-green-600">{{
              orderData.testing.testType
            }}</span>
          </div>
          <div class="flex justify-between py-2">
            <span class="text-sm text-gray-600">检测内容</span>
            <span class="text-sm font-medium text-green-600">{{
              orderData.testing.testContent
            }}</span>
          </div>
        </div>
      </div>

      <!-- 财务信息 -->
      <div class="rounded-xl bg-white p-5 shadow-sm">
        <h3
          class="mb-3 flex items-center border-b border-gray-200 pb-3 text-base font-semibold text-gray-900"
        >
          <div
            class="mr-3 h-5 w-1 rounded bg-gradient-to-b from-indigo-500 to-purple-600"
          ></div>
          财务信息
        </h3>
        <div class="space-y-3">
          <div class="flex justify-between border-b border-gray-100 py-2">
            <span class="text-sm text-gray-600">项目金额</span>
            <span class="text-base font-bold text-green-600"
              >¥{{ orderData.finance.totalAmount.toLocaleString() }}</span
            >
          </div>
          <div class="flex justify-between border-b border-gray-100 py-2">
            <span class="text-sm text-gray-600">已支付金额</span>
            <span class="text-base font-bold text-green-600"
              >¥{{ orderData.finance.paidAmount.toLocaleString() }}</span
            >
          </div>
          <div class="flex justify-between py-2">
            <span class="text-sm text-gray-600">待收金额</span>
            <span class="text-base font-medium text-orange-600"
              >¥{{ orderData.finance.pendingAmount.toLocaleString() }}</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div
      class="mt-5 flex justify-center gap-5 rounded-xl bg-white p-5 shadow-sm"
    >
      <button
        class="max-w-xs flex-1 rounded-lg bg-gradient-to-r from-green-400 to-green-500 px-8 py-3 text-base font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/30"
        @click="approveOrder"
      >
        审核通过
      </button>
      <button
        class="max-w-xs flex-1 rounded-lg border-2 border-red-500 bg-white px-8 py-3 text-base font-medium text-red-500 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-50 hover:shadow-lg hover:shadow-red-500/20"
        @click="showRejectModal"
      >
        审核未通过
      </button>
    </div>

    <!-- 驳回弹窗 -->
    <common-modal-reject ref="rejectModalRef" @refresh="handleRefresh" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CommonTitle from '@/components/common-title.vue'
import CommonModalReject from '@/components/common-modal-reject.vue'

defineOptions({ name: 'OrderReview' })

// Props
const props = defineProps<{ orderId?: string }>()

const router = useRouter()

// 响应式数据
const loading = ref(true)
const rejectModalRef = ref<InstanceType<typeof CommonModalReject> | null>(null)

// 订单数据
const orderData = reactive<ReviewOrder>({
  id: '',
  orderNumber: '',
  isUrgent: false,
  salesperson: '',
  submitTime: '',
  customer: {
    name: '',
    contact: '',
    phone: ''
  },
  testing: {
    unit: '',
    address: '',
    serviceType: '',
    testType: '',
    testContent: ''
  },
  finance: {
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0
  }
})

// 获取订单数据
const fetchOrderData = async () => {
  try {
    loading.value = true

    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 模拟根据orderId获取不同的数据
    const mockData: ReviewOrder = {
      id: props.orderId,
      orderNumber: `XW250903-${props.orderId}`,
      isUrgent: true,
      salesperson: '张三',
      submitTime: '2025-09-03 14:30',
      customer: {
        name: '深圳科技创新中心',
        contact: '林总监',
        phone: '13900139001'
      },
      testing: {
        unit: '创新中心A栋实验室',
        address: '深圳市南山区科技园A栋5楼',
        serviceType: '初测',
        testType: '50325-2020',
        testContent: '三苯五项：甲醛、苯、甲苯、二甲苯、TVOC'
      },
      finance: {
        totalAmount: 28000,
        paidAmount: 10000,
        pendingAmount: 18000
      }
    }

    // 更新订单数据
    Object.assign(orderData, mockData)
  } catch (error) {
    console.error('获取订单数据失败:', error)
    alert('获取订单数据失败，请重试！')
  } finally {
    loading.value = false
  }
}

// 方法
const approveOrder = () => {
  if (confirm('确定要通过该订单的审核吗？')) {
    alert('订单审核已通过！')
    router.go(-1)
  }
}

const showRejectModal = () => {
  rejectModalRef.value?.open(props.orderId)
}

const handleRefresh = () => {
  // 可以在这里添加刷新逻辑，比如重新获取数据
  router.go(-1)
}

// 生命周期
onMounted(() => {
  fetchOrderData()
})
</script>

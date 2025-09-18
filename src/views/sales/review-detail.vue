<template>
  <div v-loading="loading">
    <!-- 订单头部信息 -->
    <common-title
      :title="orderData.projectNumber"
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
            <span class="text-sm font-medium text-gray-900">
              {{ orderData.saleUserRealName }}
            </span>
          </div>
          <div class="flex justify-between py-2">
            <span class="text-sm text-gray-600">创建时间</span>
            <span class="text-sm font-medium text-gray-900">
              {{ dateToString(orderData.createTime) }}
            </span>
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
            <span class="text-sm font-medium text-gray-900">
              {{ orderData.customerName }}
            </span>
          </div>
          <div class="flex justify-between border-b border-gray-100 py-2">
            <span class="text-sm text-gray-600">客户联系人</span>
            <span class="text-sm font-medium text-gray-900">
              {{ orderData.customer?.contactPerson }}
            </span>
          </div>
          <div class="flex justify-between py-2">
            <span class="text-sm text-gray-600">客户联系电话</span>
            <span class="text-sm font-medium text-gray-900">
              {{ orderData.customer?.contactPhone }}
            </span>
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
            <span class="text-sm font-medium text-gray-900">
              {{ orderData.inspectedUnit }}
            </span>
          </div>
          <div class="flex justify-between border-b border-gray-100 py-2">
            <span class="text-sm text-gray-600">采样地址</span>
            <span class="text-sm font-medium text-gray-900">
              {{ orderData.samplingAddress }}
            </span>
          </div>
          <div class="flex justify-between border-b border-gray-100 py-2">
            <span class="text-sm text-gray-600">服务类型</span>
            <span class="text-sm font-medium text-gray-900">
              {{ orderData.serviceTypeName }}
            </span>
          </div>
          <div class="flex justify-between border-b border-gray-100 py-2">
            <span class="text-sm text-gray-600">检测类型</span>
            <span class="text-sm font-semibold text-green-600">
              {{ orderData.detectionTypeName }}
            </span>
          </div>
          <div class="flex justify-between py-2">
            <span class="text-sm text-gray-600">检测点数</span>
            <span class="text-sm font-medium text-green-600">
              {{ orderData.detectionPoints }}
            </span>
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
            <span class="text-base font-bold text-green-600">
              {{
                orderData.projectAmount
                  ? `¥${orderData.projectAmount?.toLocaleString()}`
                  : ''
              }}
            </span>
          </div>
          <div class="flex justify-between border-b border-gray-100 py-2">
            <span class="text-sm text-gray-600">实收金额</span>
            <span class="text-base font-bold text-green-600">
              {{
                orderData.actualAmount
                  ? `¥${orderData.actualAmount?.toLocaleString()}`
                  : ''
              }}
            </span>
          </div>
          <div class="flex justify-between py-2">
            <span class="text-sm text-gray-600">订单状态</span>
            <span class="text-base font-medium text-orange-600">
              {{ orderData.orderStatusName }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div
      class="mt-5 flex justify-center gap-5 rounded-xl bg-white p-5 shadow-sm"
      v-if="orderData.orderStatusCode === OrderStatus.PENDING_REVIEW"
    >
      <button
        class="max-w-xs flex-1 rounded-lg bg-gradient-to-r from-green-400 to-green-500 px-8 py-3 text-base font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/30"
        @click="onClickApprove"
      >
        审核通过
      </button>
      <button
        class="max-w-xs flex-1 rounded-lg border-2 border-red-500 bg-white px-8 py-3 text-base font-medium text-red-500 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-50 hover:shadow-lg hover:shadow-red-500/20"
        @click="onClickReject"
      >
        审核驳回
      </button>
    </div>

    <!-- 驳回弹窗 -->
    <common-modal-reject ref="rejectModalRef" @refresh="$router.go(-1)" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { OrderStatus } from '@/utils/enum'
import { isObject } from '@/utils/is'
import { dateToString } from '@/utils/date'
import Message from '@/utils/message'
import api from '@/api'
import CommonTitle from '@/components/common-title.vue'
import CommonModalReject from '@/components/common-modal-reject.vue'

defineOptions({ name: 'ReviewDetail' })

// Props
const props = defineProps<{ orderId?: number | string }>()

// 路由相关
const router = useRouter()

// 响应式数据
const loading = ref(false)
const rejectModalRef = ref<InstanceType<typeof CommonModalReject>>()
const orderData = ref<SalesOrder>({
  id: 0,
  createTime: '',
  updateTime: '',
  projectNumber: '',
  urgentFlag: false,
  customerId: 0,
  customerCode: '',
  customerName: '',
  customer: {} as SalesCustomer,
  inspectedUnit: '',
  samplingAddress: '',
  detectionTypeId: 0,
  detectionTypeName: '',
  orderDetectionItemList: [],
  serviceTypeId: 0,
  serviceTypeCode: '',
  serviceTypeName: '',
  detectionPoints: 0,
  sampleStorageId: 0,
  sampleStorageCode: '',
  sampleStorageName: '',
  sampleDisposalId: 0,
  sampleDisposalCode: '',
  sampleDisposalName: '',
  sampleDisposalOther: '',
  detectionSubcontract: false,
  subcontractProject: '',
  specialRequirements: '',
  reportDeliveryId: 0,
  reportDeliveryCode: '',
  reportDeliveryName: '',
  reportDeliveryOther: '',
  saleUserId: 0,
  saleUserRealName: '',
  projectAmount: 0,
  actualAmount: 0,
  salesRemark: '',
  attachmentPayloadList: [],
  orderTypeId: 0,
  orderTypeCode: '',
  orderTypeName: '',
  orderStatusCode: '',
  orderStatusName: '',
  orderStatusRemark: '',
  progressAndOrderStatusCode: '',
  progressAndOrderStatusName: '',
  detectionProject: {} as any
})

// 审核通过
const onClickApprove = async () => {
  if (confirm('确定要通过此订单吗？')) {
    await api.loadOrdersStatusChanging(+props.orderId, {
      statusCode: OrderStatus.APPROVED,
      remark: ''
    })
    Message.success('订单审核通过')
    router.go(-1)
  }
}

// 审核驳回
const onClickReject = () => {
  rejectModalRef.value?.open(+props.orderId)
}

// 处理数据请求
const loadDataDetail = async () => {
  try {
    loading.value = true

    const res = await api.loadOrdersDetail(+props.orderId)
    orderData.value = isObject(res)
      ? { ...orderData.value, ...res }
      : orderData.value
  } catch (error) {
    console.error('加载订单数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 初始化加载数据
onMounted(() => {
  loadDataDetail()
})
</script>

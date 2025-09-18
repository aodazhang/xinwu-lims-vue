<template>
  <div v-loading="loading">
    <!-- 页面头部 -->
    <common-title
      :title="orderData.projectNumber"
      content="销售工作台 / 销售订单详情"
    >
      <button
        class="rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg"
        v-if="orderData.orderStatusCode === OrderStatus.PENDING_REVIEW"
        @click="onClickEdit"
      >
        编辑订单
      </button>
      <button
        class="rounded-md bg-red-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
        v-if="orderData.orderStatusCode === OrderStatus.PENDING_REVIEW"
        @click="onClickCancel"
      >
        取消订单
      </button>
    </common-title>

    <!-- 内容布局 -->
    <div class="mt-5 grid grid-cols-1 gap-5 md:grid-cols-[1fr_380px]">
      <!-- 左侧主信息区 -->
      <div class="space-y-5">
        <!-- 基本信息 -->
        <common-detail-card title="基本信息">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">客户名称</span>
              <span class="text-sm font-medium text-gray-900">
                {{ orderData.customerName }}
              </span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">客户联系人</span>
              <span class="text-sm font-medium text-gray-900">
                {{ orderData.customer?.contactPerson }}
              </span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">客户联系电话</span>
              <span class="text-sm font-medium text-gray-900">
                {{ orderData.customer?.contactPhone }}
              </span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">受检单位</span>
              <span class="text-sm font-medium text-gray-900">
                {{ orderData.inspectedUnit }}
              </span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">项目金额</span>
              <span class="text-sm font-medium text-gray-900">
                {{
                  orderData.projectAmount
                    ? `¥${orderData.projectAmount?.toLocaleString()}`
                    : ''
                }}
              </span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">实收金额</span>
              <span class="text-sm font-medium text-gray-900">
                {{
                  orderData.actualAmount
                    ? `¥${orderData.actualAmount?.toLocaleString()}`
                    : ''
                }}
              </span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">创建时间</span>
              <span class="text-sm font-medium text-gray-900">
                {{ orderData.createTime }}
              </span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">是否加急</span>
              <span
                class="text-sm font-medium"
                :class="
                  orderData.urgentFlag ? 'text-red-500' : 'text-emerald-600'
                "
              >
                {{ orderData.urgentFlag ? '是' : '否' }}
              </span>
            </div>
          </div>
        </common-detail-card>

        <!-- 检测信息 -->
        <common-detail-card title="检测信息">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">采样地址</span>
              <span class="text-sm font-medium text-gray-900">
                {{ orderData.samplingAddress }}
              </span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">检测点数</span>
              <span class="text-sm font-medium text-gray-900">
                {{ orderData.detectionPoints }}
              </span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">检测类型</span>
              <span class="text-sm font-semibold text-emerald-600">
                {{ orderData.detectionTypeName }}
              </span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">服务类型</span>
              <span class="text-sm font-medium text-gray-900">
                {{ orderData.serviceTypeName }}
              </span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">订单类型</span>
              <span class="text-sm font-medium text-gray-900">
                {{ orderData.orderTypeName }}
              </span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">检测分包</span>
              <span
                class="text-sm font-medium"
                :class="
                  orderData.detectionSubcontract
                    ? 'text-red-500'
                    : 'text-emerald-600'
                "
              >
                {{ orderData.detectionSubcontract ? '是' : '否' }}
              </span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">样品存储</span>
              <span class="text-sm font-medium text-gray-900">
                {{ orderData.sampleStorageName }}
              </span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">样品处置</span>
              <span class="text-sm font-medium text-gray-900">
                {{ orderData.sampleDisposalName }}
              </span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">样品处置其他</span>
              <span class="text-sm font-medium text-gray-900">
                {{ orderData.sampleDisposalOther }}
              </span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">分包项目</span>
              <span class="text-sm font-medium text-gray-900">
                {{ orderData.subcontractProject }}
              </span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">特殊要求</span>
              <span class="text-sm font-medium text-gray-900">
                {{ orderData.specialRequirements }}
              </span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">报告交付</span>
              <span class="text-sm font-medium text-gray-900">
                {{ orderData.reportDeliveryName }}
              </span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">报告交付其他</span>
              <span class="text-sm font-medium text-gray-900">
                {{ orderData.reportDeliveryOther }}
              </span>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-xs text-gray-600">备注</span>
            <div class="mt-2 rounded-md bg-gray-50 p-3 text-xs text-gray-600">
              {{ orderData.salesRemark || '暂无' }}
            </div>
          </div>
        </common-detail-card>

        <!-- 订单进度 -->
        <common-detail-card title="订单进度">
          <common-detail-timeline :progress-list="progressList" />
        </common-detail-card>
      </div>

      <!-- 右侧辅助区 -->
      <div class="space-y-5">
        <!-- 状态指示器 -->
        <common-detail-status
          :progress-and-order-status-code="orderData.progressAndOrderStatusCode"
          :progress-and-order-status-name="orderData.progressAndOrderStatusName"
          :details="statusDetails"
        />

        <!-- 相关人员 -->
        <!-- <common-detail-card title="相关人员">
          <common-detail-person :persons="orderData.relatedPersons" />
        </common-detail-card> -->

        <!-- 相关附件 -->
        <common-detail-card title="相关附件">
          <common-detail-attachment
            :attachment-payload-list="orderData.attachmentPayloadList"
          />
        </common-detail-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { OrderStatus } from '@/utils/enum'
import { isArray, isObject } from '@/utils/is'
import Message from '@/utils/message'
import api from '@/api'
import CommonTitle from '@/components/common-title.vue'
import CommonDetailCard from '@/components/common-detail-card.vue'
import CommonDetailTimeline from '@/components/common-detail-timeline.vue'
import CommonDetailStatus from '@/components/common-detail-status.vue'
// import CommonDetailPerson from '@/components/common-detail-person.vue'
import CommonDetailAttachment from '@/components/common-detail-attachment.vue'

/**
 * 订单进度
 * 一级列表：阶段
 * 二级列表：statusChangeTraceList，有值代表进行到这个阶段
 * - createTime、changeUserRoleName、changeUserRealName、changedStatusCode
 */

defineOptions({ name: 'SalesDetail' })

// Props
const props = defineProps<{ orderId?: number | string }>()

// 路由相关
const router = useRouter()

// 内部维护的状态
const loading = ref(false)
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
const progressList = ref<SalesProgress[]>([])
const statusDetails = ref<LabelValue[]>([{ label: '当前阶段', value: '' }])

// 编辑订单
const onClickEdit = () => {
  router.push({
    path: '/sales-form',
    query: {
      orderId: props.orderId
    }
  })
}

// 取消订单
const onClickCancel = async () => {
  if (confirm('确定要取消此订单吗？')) {
    await api.loadOrdersStatusChanging(+props.orderId, {
      statusCode: OrderStatus.CANCELLED,
      remark: ''
    })
    Message.success('订单已取消')
    router.go(-1)
  }
}

// 处理数据请求
const loadDataDetail = async () => {
  try {
    loading.value = true

    const res1 = await api.loadOrdersDetail(+props.orderId)
    orderData.value = isObject(res1)
      ? { ...orderData.value, ...res1 }
      : orderData.value

    if (res1.detectionProject?.id) {
      const res2 = await api.loadDetectionProgress(res1.detectionProject.id)
      progressList.value = isArray(res2) ? res2 : []
    }

    statusDetails.value[0].value =
      orderData.value.detectionProject?.currentProgressName || ''
  } catch (error) {
    console.error('加载订单数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  loadDataDetail()
})
</script>

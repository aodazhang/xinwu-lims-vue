<template>
  <div v-loading="loading">
    <!-- 页面头部 -->
    <common-title
      :title="orderData.orderNumber"
      content="销售工作台 / 销售订单详情"
    >
      <button
        class="rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg"
        @click="editOrder"
      >
        编辑订单
      </button>
      <button
        class="rounded-md bg-red-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
        @click="cancelOrder"
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
              <span class="text-sm font-medium text-gray-900">{{
                orderData.customerName
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">客户联系人</span>
              <span class="text-sm font-medium text-gray-900">{{
                orderData.customerContact
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">客户联系电话</span>
              <span class="text-sm font-medium text-gray-900">{{
                orderData.customerPhone
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">受检单位</span>
              <span class="text-sm font-medium text-gray-900">{{
                orderData.inspectionUnit
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">项目金额</span>
              <span class="text-sm font-medium text-gray-900"
                >¥{{ orderData.projectAmount.toLocaleString() }}</span
              >
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">实收金额</span>
              <span class="text-sm font-medium text-gray-900"
                >¥{{ orderData.receivedAmount.toLocaleString() }}</span
              >
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">创建时间</span>
              <span class="text-sm font-medium text-gray-900">{{
                orderData.createTime
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">是否加急</span>
              <span
                class="text-sm font-medium"
                :class="orderData.urgent ? 'text-red-500' : 'text-gray-900'"
              >
                {{ orderData.urgent ? '是' : '否' }}
              </span>
            </div>
          </div>
        </common-detail-card>

        <!-- 检测信息 -->
        <common-detail-card title="检测信息">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">采样地址</span>
              <span class="text-sm font-medium text-gray-900">{{
                orderData.samplingAddress
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">检测点数</span>
              <span class="text-sm font-medium text-gray-900">{{
                orderData.testPoints
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">检测类型</span>
              <span class="text-sm font-semibold text-emerald-600">{{
                orderData.testType
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">检测内容</span>
              <span class="text-sm font-medium text-emerald-600">{{
                orderData.testContent
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">服务类型</span>
              <span class="text-sm font-medium text-gray-900">{{
                orderData.serviceType
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">订单类型</span>
              <span class="text-sm font-medium text-gray-900">{{
                orderData.orderType
              }}</span>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-xs text-gray-600">备注</span>
            <div class="mt-2 rounded-md bg-gray-50 p-3 text-sm text-gray-600">
              {{ orderData.remark }}
            </div>
          </div>
        </common-detail-card>

        <!-- 订单进度 -->
        <common-detail-card title="订单进度">
          <common-detail-timeline :items="timelineItems" />
        </common-detail-card>
      </div>

      <!-- 右侧辅助区 -->
      <div class="space-y-5">
        <!-- 状态指示器 -->
        <common-detail-status
          :status="orderData.status"
          :status-text="orderData.statusText"
          :details="statusDetails"
        />

        <!-- 相关人员 -->
        <common-detail-card title="相关人员">
          <common-detail-person :persons="relatedPersons" />
        </common-detail-card>

        <!-- 相关附件 -->
        <common-detail-card title="相关附件">
          <common-detail-attachment :attachments="attachments" />
        </common-detail-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CommonTitle from '@/components/common-title.vue'
import CommonDetailCard from '@/components/common-detail-card.vue'
import CommonDetailTimeline from '@/components/common-detail-timeline.vue'
import CommonDetailStatus from '@/components/common-detail-status.vue'
import CommonDetailPerson from '@/components/common-detail-person.vue'
import CommonDetailAttachment from '@/components/common-detail-attachment.vue'

defineOptions({ name: 'SalesDetail' })

const props = defineProps<{ orderId?: string }>()

const router = useRouter()

// 加载状态
const loading = ref(false)

// 订单数据
const orderData = ref({
  orderNumber: 'XW250903-100',
  urgent: true,
  customerName: '广州环保科技有限公司',
  customerContact: '王经理',
  customerPhone: '13800138001',
  inspectionUnit: '广州环保科技总部',
  projectAmount: 8600,
  receivedAmount: 5000,
  createTime: '2025-09-03 09:15',
  samplingAddress: '广州市天河区科技园A栋3楼',
  testPoints: 12,
  testType: '50325-2020',
  testContent: '三苯五项：甲醛、苯、甲苯、二甲苯、TVOC',
  serviceType: '初测',
  orderType: '委托检测（采样）',
  remark:
    '客户要求尽快出报告，需要优先处理。检测区域为新装修办公室，重点关注甲醛和TVOC指标。',
  status: 'sampling' as const,
  statusText: '采样中'
})

// 状态详情
const statusDetails = ref([{ label: '当前阶段', value: '采样执行' }])

// 时间轴数据
const timelineItems = ref([
  {
    title: '订单创建',
    description: '销售人员：张三',
    time: '2025-09-03 09:15',
    status: 'completed' as const
  },
  {
    title: '订单审核通过',
    description: '审核人员：李四',
    time: '2025-09-03 10:30',
    status: 'completed' as const
  },
  {
    title: '采样任务分派',
    description: '调度员：王五 | 采样员：赵六',
    time: '2025-09-03 11:00',
    status: 'completed' as const
  },
  {
    title: '采样执行中',
    description: '预计完成时间：2025-09-04 15:00',
    time: '进行中',
    status: 'pending' as const
  },
  {
    title: '样品接收',
    description: '等待采样完成',
    time: '',
    status: 'pending' as const
  },
  {
    title: '实验室检测',
    description: '等待样品接收',
    time: '',
    status: 'pending' as const
  },
  {
    title: '报告生成',
    description: '等待检测完成',
    time: '',
    status: 'pending' as const
  },
  {
    title: '报告交付',
    description: '等待报告审批',
    time: '',
    status: 'pending' as const
  }
])

// 相关人员
const relatedPersons = ref([
  { name: '张三', role: '销售人员' },
  { name: '李四', role: '订单审核员' },
  { name: '王五', role: '采样调度员' },
  { name: '赵六', role: '采样人员' }
])

// 附件列表
const attachments = ref([
  { name: '检测委托单.pdf', size: '1.2 MB' },
  { name: '现场照片.jpg', size: '2.5 MB' },
  { name: '客户要求说明.docx', size: '56 KB' }
])

/**
 * 编辑订单
 */
function editOrder() {
  // 跳转到编辑页面，传递当前订单ID
  router.push({
    path: '/sales-form',
    query: { orderId: props.orderId }
  })
}

/**
 * 取消订单
 */
function cancelOrder() {
  if (confirm('确定要取消此订单吗？')) {
    console.log('取消订单:', props.orderId)
    // TODO: 实现取消订单的API调用
  }
}

/**
 * 加载订单数据
 */
async function loadOrderData() {
  loading.value = true

  try {
    console.log('加载订单数据:', props.orderId)
    // TODO: 实现从API加载订单数据的逻辑
    // const response = await api.getOrderDetail(id)
    // orderData.value = response.data

    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500))

    // 这里可以根据实际API返回的数据更新 orderData
    // orderData.value = {
    //   ...orderData.value,
    //   ...response.data
    // }
  } catch (error) {
    console.error('加载订单数据失败:', error)
    // TODO: 显示错误提示
  } finally {
    loading.value = false
  }
}

/**
 * 初始化页面数据
 */
onMounted(() => {
  loadOrderData()
})
</script>

<template>
  <div v-loading="loading">
    <!-- 页面头部 -->
    <common-title :title="taskData.taskId" content="采样工作台 / 采样详情">
      <button
        v-if="taskData.status === 'pending'"
        @click="startSamplingTask"
        class="rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2 text-white transition-all hover:from-indigo-600 hover:to-purple-700"
      >
        开始采样任务
      </button>
      <button
        v-else-if="taskData.status === 'sampling'"
        @click="completeSamplingTask"
        class="flex items-center gap-2 rounded-md bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-2 text-white transition-all hover:from-green-600 hover:to-emerald-700"
      >
        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
        确认采样任务完成
      </button>
    </common-title>

    <!-- 内容布局 -->
    <div class="mt-5 grid grid-cols-1 gap-5 md:grid-cols-[1fr_380px]">
      <!-- 左侧主信息区 -->
      <div class="space-y-5">
        <!-- 任务基本信息 -->
        <common-detail-card title="任务基本信息">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">客户名称</span>
              <span class="text-sm font-medium text-gray-900">{{
                taskData.customerName
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">客户联系人</span>
              <span class="text-sm font-medium text-gray-900">{{
                taskData.contactPerson
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">客户联系电话</span>
              <span class="text-sm font-medium text-gray-900">{{
                taskData.contactPhone
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">受检单位</span>
              <span class="text-sm font-medium text-gray-900">{{
                taskData.inspectedUnit
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">采样地址</span>
              <span class="text-sm font-medium text-gray-900">{{
                taskData.samplingAddress
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">预计采样时间</span>
              <span class="text-sm font-medium text-gray-900">{{
                taskData.scheduledTime
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">采样人员</span>
              <span class="text-sm font-medium text-gray-900">{{
                taskData.sampler
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">优先级</span>
              <span
                class="text-sm font-medium"
                :class="taskData.isUrgent ? 'text-red-500' : 'text-gray-900'"
              >
                {{ taskData.isUrgent ? '加急' : '普通' }}
              </span>
            </div>
          </div>
        </common-detail-card>

        <!-- 检测信息 -->
        <common-detail-card title="检测信息">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">检测类型</span>
              <span class="text-sm font-semibold text-emerald-600">{{
                taskData.testType
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">检测内容</span>
              <span class="text-sm font-medium text-emerald-600">{{
                taskData.testContent
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">采样点数</span>
              <span class="text-sm font-medium text-gray-900">{{
                taskData.samplingPoints
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">服务类型</span>
              <span class="text-sm font-medium text-gray-900">{{
                taskData.serviceType
              }}</span>
            </div>
          </div>
        </common-detail-card>

        <!-- 客户检测委托单 -->
        <common-detail-card title="客户检测委托单">
          <div
            @click="showDelegationDocument"
            class="cursor-pointer rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-center text-white transition-all hover:-translate-y-1 hover:from-indigo-600 hover:to-purple-700 hover:shadow-lg"
          >
            <div
              class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white bg-opacity-20"
            >
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"
                />
              </svg>
            </div>
            <div class="mb-1 text-base font-semibold">检测委托单</div>
            <div class="text-sm opacity-90">点击查看详细内容</div>
          </div>
        </common-detail-card>

        <!-- 采样位置和样品列表 -->
        <common-detail-card title="采样位置和样品列表">
          <div class="space-y-3">
            <div
              v-for="(location, index) in samplingLocations"
              :key="index"
              class="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4"
            >
              <div class="flex-1">
                <div class="mb-1 text-sm font-medium text-gray-900">
                  {{ location.name }}
                </div>
                <div class="text-xs text-indigo-600">
                  样品编号：{{ location.sampleId }}
                </div>
              </div>
              <button
                @click="removeSamplingLocation(index)"
                class="rounded bg-red-500 px-3 py-1 text-xs text-white transition-colors hover:bg-red-600"
              >
                删除
              </button>
            </div>
          </div>
          <button
            @click="showAddSamplingModal"
            class="mt-3 w-full rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 py-3 font-medium text-white transition-all hover:from-indigo-600 hover:to-purple-700"
          >
            添加采样位置
          </button>
        </common-detail-card>

        <!-- 现场检测数据 -->
        <common-detail-card title="现场检测数据">
          <button
            @click="showForm"
            class="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 py-3 font-medium text-white transition-all hover:from-indigo-600 hover:to-purple-700"
          >
            编辑检测数据
          </button>
        </common-detail-card>
      </div>

      <!-- 右侧辅助区 -->
      <div class="space-y-5">
        <!-- 状态指示器 -->
        <common-detail-status
          :status="taskData.status"
          :status-text="taskData.statusText"
          :details="statusDetails"
        />
      </div>
    </div>

    <!-- 检测委托单弹窗 -->
    <common-modal-delegate ref="delegateModalRef" />
    <!-- 添加采样位置弹窗 -->
    <common-modal-sampler
      ref="samplerModalRef"
      @refresh="handleSamplingLocationAdded"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { toolSleep } from '@/utils/tool'
import CommonTitle from '@/components/common-title.vue'
import CommonDetailCard from '@/components/common-detail-card.vue'
import CommonDetailStatus from '@/components/common-detail-status.vue'
import CommonModalSampler from '@/components/common-modal-sampler.vue'
import CommonModalDelegate from '@/components/common-modal-delegate.vue'

// 定义任务数据接口
interface TaskData {
  taskId: string
  status: 'pending' | 'sampling' | 'completed'
  statusText: string
  customerName: string
  contactPerson: string
  contactPhone: string
  inspectedUnit: string
  samplingAddress: string
  scheduledTime: string
  sampler: string
  isUrgent: boolean
  testType: string
  testContent: string
  samplingPoints: number
  serviceType: string
  testItems: string[]
}

// 定义采样位置接口
interface SamplingLocation {
  name: string
  sampleId: string
}

// 定义现场检测数据接口
interface FieldData {
  freeCl: number | null
  totalCl: number | null
  temperature: number | null
  humidity: number | null
}

// Props
const props = defineProps<{ taskId?: string }>()

// 响应式数据
const loading = ref(false)
const taskData = ref<TaskData>({
  taskId: 'XW250903-100',
  status: 'sampling',
  statusText: '采样中',
  customerName: '广州环保科技有限公司',
  contactPerson: '王经理',
  contactPhone: '13800138001',
  inspectedUnit: '广州环保科技总部',
  samplingAddress: '广州市天河区科技园A栋3楼',
  scheduledTime: '2025-09-04 15:00 - 16:00',
  sampler: '赵六',
  isUrgent: true,
  testType: '50325-2020',
  testContent: '三苯五项：甲醛、苯、甲苯、二甲苯、TVOC',
  samplingPoints: 12,
  serviceType: '初测',
  testItems: ['甲醛', '苯', '甲苯', '二甲苯', 'TVOC']
})

// 状态详情
const statusDetails = ref([
  { label: '任务编号', value: 'XW250903-100' },
  { label: '创建时间', value: '2025-09-03 09:00' },
  { label: '截止时间', value: '2025-09-04 18:00' }
])

const samplingLocations = ref<SamplingLocation[]>([
  {
    name: '办公室A区域',
    sampleId: 'XW250903-100-001'
  },
  {
    name: '会议室B区域',
    sampleId: 'XW250903-100-002'
  }
])

const fieldData = ref<FieldData>({
  freeCl: null,
  totalCl: null,
  temperature: null,
  humidity: null
})

// 组件引用
const samplerModalRef = ref<InstanceType<typeof CommonModalSampler>>()
const delegateModalRef = ref<InstanceType<typeof CommonModalDelegate>>()

let samplingCounter = 2

/**
 * 开始采样任务
 */
const startSamplingTask = (): void => {
  console.log('开始采样任务:', props.taskId)
  taskData.value.status = 'sampling'
  taskData.value.statusText = '采样中'
  // TODO: 实现开始采样任务逻辑
}

/**
 * 显示委托单文档
 */
const showDelegationDocument = (): void => {
  if (delegateModalRef.value) {
    const delegateData = {
      taskId: taskData.value.taskId,
      customerName: taskData.value.customerName,
      contactPerson: taskData.value.contactPerson,
      contactPhone: taskData.value.contactPhone,
      inspectedUnit: taskData.value.inspectedUnit,
      samplingAddress: taskData.value.samplingAddress,
      testContent: taskData.value.testContent,
      samplingPoints: taskData.value.samplingPoints,
      testStandard: 'GB 50325-2020《民用建筑工程室内环境污染控制标准》',
      specialRequirements:
        '新装修办公室，重点关注甲醛和TVOC指标，需要加急处理。',
      delegateDate: '2025年9月3日'
    }
    delegateModalRef.value.open(delegateData)
  }
}

/**
 * 显示添加采样位置弹窗
 */
const showAddSamplingModal = (): void => {
  samplerModalRef.value?.open({
    taskId: props.taskId,
    samplingCounter: samplingCounter
  })
}

/**
 * 处理采样位置添加
 */
const handleSamplingLocationAdded = (location: SamplingLocation): void => {
  samplingLocations.value.push(location)
  samplingCounter++
}

/**
 * 删除采样位置
 */
const removeSamplingLocation = (index: number): void => {
  samplingLocations.value.splice(index, 1)
}

/**
 * 完成采样任务
 */
const completeSamplingTask = (): void => {
  console.log('完成采样任务:', props.taskId)
  console.log('现场检测数据:', fieldData.value)
  taskData.value.status = 'completed'
  taskData.value.statusText = '已完成'
  // TODO: 实现完成采样任务逻辑
  alert('采样任务已完成！')
}

/**
 * 加载任务详情
 */
const loadTaskDetail = async () => {
  try {
    loading.value = true
    console.log('加载任务详情:', props.taskId)
    // TODO: 根据 taskId 从 API 加载任务详情数据
    // 这里使用模拟数据
    taskData.value.taskId = props.taskId

    await toolSleep(1000)
  } catch (error) {
  } finally {
    loading.value = false
  }
}

/**
 * 编辑检测数据
 */
const showForm = () => {
  // TODO: 跳转动态表单
}

// 生命周期
onMounted(() => {
  loadTaskDetail()
})
</script>

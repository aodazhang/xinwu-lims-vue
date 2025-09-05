<template>
  <div v-loading="loading">
    <!-- 页面头部 -->
    <common-title
      :title="taskData.projectNumber"
      content="采样调度工作台 / 采样调度详情"
    >
      <button
        v-if="taskData.status === 'pending'"
        class="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-blue-600 hover:to-blue-700"
        @click="openAssignModal"
      >
        分派任务
      </button>
      <button
        v-else-if="taskData.status === 'approved'"
        class="rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-orange-600 hover:to-orange-700"
        @click="openAdjustModal"
      >
        重新调整
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
              <span class="text-xs text-gray-600">客户名称</span>
              <span class="text-sm font-medium text-gray-900">{{
                taskData.customerName
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">联系人</span>
              <span class="text-sm font-medium text-gray-900">{{
                taskData.contactPerson
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">联系电话</span>
              <span class="text-sm font-medium text-gray-900">{{
                taskData.contactPhone
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">受检单位</span>
              <span class="text-sm font-medium text-gray-900">{{
                taskData.inspectionUnit
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">采样地址</span>
              <span class="text-sm font-medium text-gray-900">{{
                taskData.samplingAddress
              }}</span>
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
              <span class="text-xs text-gray-600">优先级</span>
              <span
                class="text-sm font-medium"
                :class="taskData.isUrgent ? 'text-red-500' : 'text-gray-900'"
              >
                {{ taskData.isUrgent ? '加急' : '普通' }}
              </span>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-xs text-gray-600">检测项目</span>
            <div class="mt-2 flex flex-wrap gap-2">
              <div
                v-for="item in taskData.testItems"
                :key="item"
                class="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-600"
              >
                {{ item }}
              </div>
            </div>
          </div>
          <div v-if="taskData.specialRequirements" class="mt-4">
            <span class="text-xs text-gray-600">特殊要求</span>
            <div class="mt-2 rounded-md bg-amber-50 p-3 text-sm text-amber-700">
              {{ taskData.specialRequirements }}
            </div>
          </div>
        </common-detail-card>
      </div>

      <!-- 右侧辅助区 -->
      <div class="space-y-5">
        <!-- 状态指示器 -->
        <common-detail-status
          :status="detailStatus"
          :status-text="taskData.statusText"
          :details="taskData.statusDetails"
        />
      </div>
    </div>

    <!-- 任务分派/调整弹窗 -->
    <common-modal-task ref="taskModalRef" @refresh="loadTaskData" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { toolSleep } from '@/utils/tool'
import CommonTitle from '@/components/common-title.vue'
import CommonDetailCard from '@/components/common-detail-card.vue'
import CommonDetailStatus from '@/components/common-detail-status.vue'
import CommonModalTask from '@/components/common-modal-task.vue'

// Props
const props = defineProps<{ taskId?: string }>()

// 响应式数据
const loading = ref(false)
const taskData = ref<SamplingTask>({
  id: '',
  projectNumber: '',
  company: '',
  address: '',
  status: 'pending',
  statusText: '',
  isUrgent: false,
  createTime: '',
  deadline: '',
  customerName: '',
  contactPerson: '',
  contactPhone: '',
  inspectionUnit: '',
  samplingAddress: '',
  testType: '',
  testContent: '',
  samplingPoints: '',
  testItems: [],
  statusDetails: [
    { label: '任务编号', value: '' },
    { label: '创建时间', value: '' },
    { label: '截止时间', value: '' }
  ]
})

const staffList = ref<SamplerStaff[]>([
  { id: 1, name: '李采样', status: '空闲', tasks: 2 },
  { id: 2, name: '王技术', status: '工作中', tasks: 3 },
  { id: 3, name: '张工程', status: '空闲', tasks: 1 },
  { id: 4, name: '陈专员', status: '空闲', tasks: 0 },
  { id: 5, name: '赵技术', status: '工作中', tasks: 4 },
  { id: 6, name: '刘采样', status: '空闲', tasks: 2 }
])

const taskModalRef = ref<InstanceType<typeof CommonModalTask> | null>(null)

// 计算属性：将调度状态转换为详情页状态
const detailStatus = computed(() => {
  const status = taskData.value.status
  // 将调度状态映射为详情状态
  if (status === 'today' || status === 'scheduled') {
    return 'pending'
  }
  return status as 'pending' | 'approved' | 'sampling' | 'testing' | 'completed'
})

const loadTaskData = async () => {
  // 从测试数据中获取任务信息，如果不存在则生成默认数据
  try {
    loading.value = true
    await toolSleep(1000)

    // 根据任务ID生成默认数据
    const taskNumber = parseInt(props.taskId.slice(-3)) || 1
    const testTypes = [
      '50325-2020',
      'GB/T 18883',
      'HJ 583-2010',
      'GB 50325',
      'ISO 16000'
    ]
    const companies = [
      '深圳市某某自来水公司',
      '福田区某酒店',
      '罗湖区某小区物业',
      '南山区某医院',
      '宝安区某工厂'
    ]
    const addresses = [
      '深圳市南山区科技园南路123号',
      '深圳市福田区福华路88号',
      '深圳市罗湖区东门北路456号',
      '深圳市南山区深南大道999号',
      '深圳市宝安区新安街道'
    ]

    const statusOptions = [
      { status: 'pending', text: '待分派' },
      { status: 'approved', text: '已分派' },
      { status: 'sampling', text: '采样中' },
      { status: 'testing', text: '检测中' },
      { status: 'completed', text: '已完成' }
    ]
    const statusChoice = statusOptions[taskNumber % statusOptions.length]

    taskData.value = {
      id: props.taskId || '',
      projectNumber: props.taskId,
      company: companies[taskNumber % 5],
      address: addresses[taskNumber % 5],
      status: statusChoice.status as
        | 'pending'
        | 'approved'
        | 'sampling'
        | 'testing'
        | 'completed',
      statusText: statusChoice.text,
      isUrgent: taskNumber <= 8,
      createTime: `2024-03-${15 - Math.floor(taskNumber / 100)} ${9 + (taskNumber % 12)}:00`,
      deadline: `2024-03-${18 + Math.floor(taskNumber / 50)} 18:00`,
      customerName: companies[taskNumber % 5],
      contactPerson: ['张经理', '李总监', '王主任', '陈总', '赵经理'][
        taskNumber % 5
      ],
      contactPhone: `13${8 + (taskNumber % 2)}-${1234 + taskNumber}-${5678 - taskNumber}`,
      inspectionUnit: companies[taskNumber % 5] + '检测点',
      samplingAddress: addresses[taskNumber % 5],
      testType: testTypes[taskNumber % testTypes.length],
      testContent: '室内空气质量检测',
      samplingPoints: `${Math.floor(Math.random() * 10) + 5}个`,
      testItems: ['甲醛', '苯', '甲苯', '二甲苯', 'TVOC'],
      specialRequirements:
        taskNumber % 3 === 0
          ? '请在上午9点前到达现场，需要客户代表全程陪同。'
          : undefined,
      assignedStaff: statusChoice.status === 'approved' ? '李采样' : undefined
    }

    // 更新状态详情
    taskData.value.statusDetails = [
      { label: '任务编号', value: taskData.value.projectNumber },
      { label: '创建时间', value: taskData.value.createTime },
      { label: '截止时间', value: taskData.value.deadline }
    ]
  } catch (error) {
  } finally {
    loading.value = false
  }
}

const openAssignModal = () => {
  const task = {
    id: taskData.value.projectNumber,
    company: taskData.value.customerName,
    address: taskData.value.samplingAddress,
    points: parseInt(taskData.value.samplingPoints) || 0,
    priority: taskData.value.isUrgent ? 'urgent' : 'normal',
    createTime: taskData.value.createTime
  }
  taskModalRef.value?.open('assign', task, staffList.value)
}

const openAdjustModal = () => {
  const task = {
    id: taskData.value.projectNumber,
    company: taskData.value.customerName,
    address: taskData.value.samplingAddress,
    points: parseInt(taskData.value.samplingPoints) || 0,
    priority: taskData.value.isUrgent ? 'urgent' : 'normal',
    createTime: taskData.value.createTime,
    assignedStaff: taskData.value.assignedStaff,
    assignedDate: new Date().toISOString().split('T')[0],
    assignedTime: ''
  }
  taskModalRef.value?.open('adjust', task, staffList.value)
}

// 生命周期
onMounted(() => {
  loadTaskData()
})
</script>

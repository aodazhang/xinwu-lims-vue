<template>
  <div>
    <!-- 页面标题 -->
    <common-title title="采样调度工作台" content="首页 / 采样调度工作台" />

    <!-- 统计卡片 -->
    <!-- <common-stats class="md:!grid-cols-4" :model="statsData" /> -->

    <!-- 搜索和筛选栏 -->
    <common-filter
      title="订单列表"
      @reset="onResetList"
      @filter="loadDataList(true)"
    >
      <!-- 项目编号搜索 -->
      <div class="relative">
        <svg
          class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input
          v-model="searchFilters.projectNumber"
          type="text"
          class="w-48 rounded-lg border border-gray-300 bg-white px-9 py-2 text-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          placeholder="项目编号精确查询"
        />
      </div>

      <select
        v-model="searchFilters.urgentFlag"
        class="w-48 cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
      >
        <option :value="null">所有优先级</option>
        <option :value="true">加急</option>
        <option :value="false">普通</option>
      </select>

      <!-- 状态筛选 -->
      <select
        v-model="searchFilters.samplingStatusCode"
        class="w-48 cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
      >
        <option :value="SamplingTaskStatus.TO_BE_ASSIGNED">待分派</option>
        <option :value="SamplingTaskStatus.ASSIGNED">已分派</option>
      </select>
    </common-filter>

    <!-- 表格 -->
    <common-table
      :config="tableConfig"
      :items="tableColumns"
      :model="tasks"
      @current-change="loadDataList(false)"
    >
      <!-- 项目编号列 -->
      <template #projectNumber="{ scope }">
        <span class="text-indigo-500">
          {{ scope.projectNumber }}
        </span>
        <span
          v-if="scope.order?.urgentFlag"
          class="ml-2 rounded bg-red-500 px-1 py-0.5 text-xs font-bold text-white"
        >
          加急
        </span>
      </template>

      <!-- 客户名称列 -->
      <template #customerName="{ scope }">
        <div>
          {{ scope.customer?.customerName }}
        </div>
      </template>

      <!-- 客户地址列 -->
      <template #customerAddress="{ scope }">
        <div>
          {{ scope.customer?.customerAddress }}
        </div>
      </template>

      <!-- 状态列 -->
      <template #samplingStatusName="{ scope }">
        <span
          :class="getStatusClass(scope.samplingStatusCode)"
          class="inline-block rounded px-2 py-1 text-xs font-medium"
        >
          {{ scope.samplingStatusName }}
        </span>
      </template>

      <!-- 创建时间插槽 -->
      <template #createTime="{ scope }">
        <div>{{ dateToString(scope.createTime) }}</div>
      </template>

      <!-- 更新时间插槽 -->
      <template #updateTime="{ scope }">
        <div>{{ dateToString(scope.updateTime) }}</div>
      </template>

      <!-- 操作列 -->
      <template #actions="{ scope }">
        <div class="flex gap-2">
          <button
            class="rounded border border-indigo-500 px-2 py-1 text-xs text-indigo-600 transition-all duration-200 hover:bg-indigo-500 hover:text-white"
            @click="onClickDetail(scope.id)"
          >
            查看
          </button>

          <button
            v-if="
              scope.samplingStatusCode === SamplingTaskStatus.TO_BE_ASSIGNED
            "
            class="rounded border border-blue-500 px-2 py-1 text-xs text-blue-600 transition-all duration-200 hover:bg-blue-500 hover:text-white"
            @click="onClickAssign('assign', scope)"
          >
            立即分派
          </button>

          <button
            v-if="scope.samplingStatusCode === SamplingTaskStatus.ASSIGNED"
            class="rounded border border-orange-500 px-2 py-1 text-xs text-orange-600 transition-all duration-200 hover:bg-orange-500 hover:text-white"
            @click="onClickAssign('adjust', scope)"
          >
            重新调整
          </button>
        </div>
      </template>
    </common-table>

    <!-- 任务分派模态框 -->
    <common-modal-task ref="taskModalRef" @refresh="loadDataList(false)" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { SamplingTaskStatus } from '@/utils/enum'
import { isArray, isNumber, isString } from '@/utils/is'
import { dateToString } from '@/utils/date'
import api from '@/api'
import CommonTitle from '@/components/common-title.vue'
// import CommonStats from '@/components/common-stats.vue'
import CommonFilter from '@/components/common-filter.vue'
import CommonTable from '@/components/common-table.vue'
import CommonModalTask from '@/components/common-modal-task.vue'

defineOptions({ name: 'SamplingDashboard' })

const router = useRouter()

// 统计数据
// const statsData = computed(() => [
//   { label: '待分派任务', value: 123 },
//   { label: '已分派任务', value: 456 },
//   { label: '加急任务', value: 789 },
//   { label: '今日待采样', value: 233 }
// ])

// 筛选数据
const searchFilters = ref({
  projectNumber: '',
  urgentFlag: null,
  samplingStatusCode: SamplingTaskStatus.TO_BE_ASSIGNED
})

// 采样任务数据
const tasks = ref<SamplingTask[]>([])
const taskModalRef = ref<InstanceType<typeof CommonModalTask>>()

// 表格配置
const tableConfig = ref<TableConfig>({
  rowKey: 'id',
  loading: false,
  selection: false,
  pagination: true,
  total: 0,
  current: 1
})

// 表格列配置
const tableColumns: TableColumn[] = [
  {
    label: '项目编号',
    props: 'projectNumber',
    minWidth: 180,
    slotName: 'projectNumber'
  },
  {
    label: '客户名称',
    props: 'customerName',
    minWidth: 180,
    slotName: 'customerName'
  },
  {
    label: '客户地址',
    props: 'customerAddress',
    minWidth: 150,
    slotName: 'customerAddress'
  },
  { label: '采样员', props: 'samplingUserRealName', width: 120 },
  { label: '采样日期', props: 'samplingDate', width: 120 },
  {
    label: '状态',
    props: 'samplingStatusName',
    width: 100,
    align: 'center',
    slotName: 'samplingStatusName'
  },
  {
    label: '创建时间',
    props: 'createTime',
    minWidth: 180,
    slotName: 'createTime'
  },
  {
    label: '更新时间',
    props: 'updateTime',
    minWidth: 180,
    slotName: 'updateTime'
  },
  { label: '操作', props: 'actions', minWidth: 220, slotName: 'actions' }
]

// 获取状态样式类
const getStatusClass = (status: string) => {
  const statusClasses = {
    [SamplingTaskStatus.TO_BE_ASSIGNED]: 'bg-blue-100 text-blue-800',
    [SamplingTaskStatus.ASSIGNED]: 'bg-orange-100 text-orange-800'
  }
  return statusClasses[status as keyof typeof statusClasses] || 'text-gray-800'
}

// 查看详情
const onClickDetail = (taskId: string) => {
  router.push({
    path: '/sampling-detail',
    query: {
      taskId
    }
  })
}

// 分派任务
const onClickAssign = (type: 'assign' | 'adjust', task: SamplingTask) => {
  const taskData = {
    id: String(task.id),
    company: task.customer?.customerName || '',
    address: task.order?.inspectedUnit || '',
    points: 0,
    priority: task.order?.urgentFlag ? 'urgent' : 'normal',
    createTime: task.createTime || ''
  }
  taskModalRef.value?.open(type, taskData)
}

// 重置筛选条件
const onResetList = () => {
  searchFilters.value = {
    projectNumber: '',
    urgentFlag: null,
    samplingStatusCode: SamplingTaskStatus.TO_BE_ASSIGNED
  }
  loadDataList(true)
}

// 加载数据列表
const loadDataList = async (reset = false) => {
  try {
    if (reset) {
      tableConfig.value.current = 1
    }
    tableConfig.value.loading = true
    const res = await api.loadSamplingTasks({
      projectNumber: isString(searchFilters.value.projectNumber)
        ? searchFilters.value.projectNumber
        : null,
      urgentFlag: searchFilters.value.urgentFlag,
      samplingStatusCode: searchFilters.value.samplingStatusCode,
      page: tableConfig.value.current,
      size: 10
    })
    tableConfig.value.total = isNumber(res.totalElements)
      ? res.totalElements
      : 0
    tasks.value = isArray(res.content) ? res.content : []
  } catch (error) {
    console.error('加载采样任务数据失败:', error)
  } finally {
    tableConfig.value.loading = false
  }
}

// 生命周期
onMounted(() => {
  loadDataList(true)
})
</script>

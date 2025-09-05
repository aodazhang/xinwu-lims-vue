<template>
  <div>
    <!-- 页面标题 -->
    <common-title title="采样调度工作台" content="首页 / 采样调度工作台" />

    <!-- 统计卡片 -->
    <common-stats class="md:!grid-cols-4" :model="statsData" />

    <!-- 搜索和筛选栏 -->
    <common-filter title="订单列表" @filter="loadTasks">
      <div class="relative">
        <svg
          class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          class="w-72 rounded-lg border border-gray-300 bg-white px-9 py-2 text-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          placeholder="搜索任务编号、单位名称或地址"
        />
      </div>

      <select
        v-model="statusFilter"
        class="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
      >
        <option value="">所有状态</option>
        <option value="pending">待分派</option>
        <option value="assigned">已分派</option>
      </select>

      <select
        v-model="priorityFilter"
        class="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
      >
        <option value="">所有优先级</option>
        <option value="urgent">紧急</option>
        <option value="normal">普通</option>
      </select>

      <select
        v-model="dateFilter"
        class="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
      >
        <option value="">所有日期</option>
        <option value="today">今日</option>
        <option value="tomorrow">明日</option>
        <option value="week">本周</option>
      </select>
    </common-filter>

    <!-- 表格 -->
    <common-table
      :config="tableConfig"
      :items="tableColumns"
      :model="filteredTasks"
      @current-change="loadTasks"
    >
      <!-- 任务编号插槽 -->
      <template #taskId="{ scope }">
        <div
          class="cursor-pointer font-medium text-indigo-500 hover:underline"
          @click="viewTaskDetail(scope.id)"
        >
          {{ scope.id }}
        </div>
      </template>

      <!-- 采样点数插槽 -->
      <template #points="{ scope }">
        <span>{{ scope.points }}个</span>
      </template>

      <!-- 优先级插槽 -->
      <template #priority="{ scope }">
        <span
          class="rounded-full px-3 py-1 text-xs font-semibold uppercase"
          :class="[
            scope.priority === 'urgent'
              ? 'bg-red-100 text-red-700'
              : 'bg-blue-100 text-blue-700'
          ]"
        >
          {{ scope.priority === 'urgent' ? '紧急' : '普通' }}
        </span>
      </template>

      <!-- 状态插槽 -->
      <template #status="{ scope }">
        <span
          class="rounded-full px-3 py-1 text-xs font-semibold"
          :class="[
            !scope.assignedStaff
              ? 'bg-orange-100 text-orange-700'
              : scope.status === 'today'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
          ]"
        >
          {{
            !scope.assignedStaff
              ? '待分派'
              : scope.status === 'today'
                ? '今日执行'
                : '已安排'
          }}
        </span>
      </template>

      <!-- 采样人员插槽 -->
      <template #assignedStaff="{ scope }">
        <span v-if="scope.assignedStaff" class="text-gray-900">{{
          scope.assignedStaff
        }}</span>
        <span v-else class="text-gray-400">-</span>
      </template>

      <!-- 采样时间插槽 -->
      <template #assignedTime="{ scope }">
        <div v-if="scope.assignedDate && scope.assignedTime" class="text-sm">
          <div class="font-medium text-gray-900">
            {{ scope.assignedDate }}
          </div>
          <div class="text-gray-500">{{ scope.assignedTime }}</div>
        </div>
        <span v-else class="text-gray-400">-</span>
      </template>

      <!-- 操作按钮插槽 -->
      <template #actions="{ scope }">
        <div class="flex gap-2">
          <button
            v-if="!scope.assignedStaff"
            class="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-1 text-xs font-medium text-white transition-all duration-200 hover:from-blue-600 hover:to-blue-700"
            @click="openAssignModal(scope)"
          >
            分派任务
          </button>
          <button
            v-else
            class="rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-1 text-xs font-medium text-white transition-all duration-200 hover:from-orange-600 hover:to-orange-700"
            @click="openAdjustModal(scope)"
          >
            重新调整
          </button>
          <button
            class="rounded-lg border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
            @click="viewTaskDetail(scope.id)"
          >
            查看详情
          </button>
        </div>
      </template>
    </common-table>

    <!-- 任务分派模态框 -->
    <common-modal-task ref="taskModalRef" @refresh="loadTasks" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CommonTitle from '@/components/common-title.vue'
import CommonStats from '@/components/common-stats.vue'
import CommonFilter from '@/components/common-filter.vue'
import CommonTable from '@/components/common-table.vue'
import CommonModalTask from '@/components/common-modal-task.vue'

// 路由实例
const router = useRouter()

// 接口定义
interface Task {
  id: string
  company: string
  address: string
  points: number
  priority: 'urgent' | 'normal'
  createTime: string
  assignedStaff?: string
  assignedDate?: string
  assignedTime?: string
  duration?: string
  status?: 'today' | 'scheduled'
}

interface Staff {
  id: number
  name: string
  status: string
  tasks: number
}

// 响应式数据
const searchQuery = ref('')
const statusFilter = ref('')
const priorityFilter = ref('')
const dateFilter = ref('')

// 表格配置
const tableConfig = ref({
  loading: false,
  rowKey: 'id',
  selection: false,
  pagination: true,
  total: 0,
  current: 1
})

// 表格列定义
const tableColumns = [
  {
    label: '任务编号',
    props: 'id',
    width: 150,
    slotName: 'taskId'
  },
  {
    label: '单位名称',
    props: 'company',
    minWidth: 150
  },
  {
    label: '采样地址',
    props: 'address',
    minWidth: 200
  },
  {
    label: '采样点数',
    props: 'points',
    width: 100,
    slotName: 'points'
  },
  {
    label: '优先级',
    props: 'priority',
    width: 100,
    slotName: 'priority'
  },
  {
    label: '状态',
    props: 'status',
    width: 100,
    slotName: 'status'
  },
  {
    label: '采样人员',
    props: 'assignedStaff',
    width: 120,
    slotName: 'assignedStaff'
  },
  {
    label: '采样时间',
    props: 'assignedTime',
    width: 140,
    slotName: 'assignedTime'
  },
  {
    label: '创建时间',
    props: 'createTime',
    width: 140
  },
  {
    label: '操作',
    props: 'actions',
    width: 200,
    slotName: 'actions'
  }
]

// 任务模态框引用
const taskModalRef = ref<InstanceType<typeof CommonModalTask> | null>(null)

// 测试数据
const allTasks = ref<Task[]>([])
const loading = ref(false)
const staffList = ref<Staff[]>([
  { id: 1, name: '李采样', status: '空闲', tasks: 2 },
  { id: 2, name: '王技术', status: '工作中', tasks: 3 },
  { id: 3, name: '张工程', status: '空闲', tasks: 1 },
  { id: 4, name: '陈专员', status: '空闲', tasks: 4 },
  { id: 5, name: '赵技术', status: '工作中', tasks: 2 },
  { id: 6, name: '刘采样', status: '空闲', tasks: 3 }
])

// 统计数据
const statsData = computed(() => [
  {
    label: '待分派任务',
    value: allTasks.value.filter(t => !t.assignedStaff).length
  },
  {
    label: '已分派任务',
    value: allTasks.value.filter(t => t.assignedStaff).length
  },
  {
    label: '加急任务',
    value: allTasks.value.filter(t => t.priority === 'urgent').length
  },
  {
    label: '今日待采样',
    value: allTasks.value.filter(t => t.status === 'today').length
  }
])

// 加载任务列表
const loadTasks = async () => {
  loading.value = true
  tableConfig.value.loading = true

  try {
    const params = {
      status: statusFilter.value,
      taskId: searchQuery.value,
      priority: priorityFilter.value,
      startDate:
        dateFilter.value === 'today'
          ? new Date().toISOString().split('T')[0]
          : undefined,
      endDate:
        dateFilter.value === 'tomorrow'
          ? new Date(Date.now() + 86400000).toISOString().split('T')[0]
          : undefined,
      page: tableConfig.value.current,
      pageSize: 10
    }

    const result = await fetchTaskList(params)
    allTasks.value = result.data
    tableConfig.value.total = result.total
  } catch (error) {
    console.error('获取任务列表失败:', error)
  } finally {
    loading.value = false
    tableConfig.value.loading = false
  }
}

// 筛选后的任务列表 - 现在直接返回 allTasks，因为筛选在 API 层面处理
const filteredTasks = computed(() => {
  return allTasks.value
})

const openAssignModal = (task: Task) => {
  taskModalRef.value?.open('assign', task, staffList.value)
}

const openAdjustModal = (task: Task) => {
  taskModalRef.value?.open('adjust', task, staffList.value)
}

const viewTaskDetail = (taskId: string) => {
  // 跳转到详情页面，通过query参数传递taskId
  router.push({
    path: '/sampling-detail',
    query: {
      taskId
    }
  })
}

// 模拟 API 请求函数
const fetchTaskList = async (params?: {
  status?: string
  taskId?: string
  priority?: string
  startDate?: string
  endDate?: string
  page?: number
  pageSize?: number
}): Promise<{ data: Task[]; total: number }> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  // 生成模拟数据
  const generateMockTasks = (): Task[] => {
    const companies = [
      '深圳市某某自来水公司',
      '福田区某酒店',
      '罗湖区某小区物业',
      '南山区某医院',
      '宝安区某工厂',
      '龙岗区某商场',
      '坪山区某学校',
      '光明区某社区',
      '盐田区某餐厅',
      '大鹏新区某度假村'
    ]
    const addresses = [
      '深圳市南山区科技园南路123号',
      '深圳市福田区福华路88号',
      '深圳市罗湖区东门北路456号',
      '深圳市南山区深南大道999号',
      '深圳市宝安区新安街道',
      '深圳市龙岗区龙翔大道1号',
      '深圳市坪山区坪山大道2号',
      '深圳市光明区光明大街3号',
      '深圳市盐田区海山路4号',
      '深圳市大鹏新区葵涌街道5号'
    ]
    const staffNames = [
      '李采样',
      '王技术',
      '张工程',
      '陈专员',
      '赵技术',
      '刘采样'
    ]

    const tasks: Task[] = []

    // 生成待分派任务
    for (let i = 1; i <= 30; i++) {
      tasks.push({
        id: `XW202403${String(i).padStart(3, '0')}`,
        company: companies[i % 10],
        address: addresses[i % 10],
        points: Math.floor(Math.random() * 10) + 5,
        priority: i <= 8 ? 'urgent' : 'normal',
        createTime: `2024-03-${String(15 - Math.floor(i / 10)).padStart(2, '0')} ${String(9 + (i % 12)).padStart(2, '0')}:00`
      })
    }

    // 生成已分派任务
    for (let i = 1; i <= 25; i++) {
      tasks.push({
        id: `XW202402${String(100 + i).padStart(3, '0')}`,
        company: companies[i % 10],
        address: addresses[i % 10],
        points: Math.floor(Math.random() * 15) + 3,
        duration: `${Math.floor(Math.random() * 3) + 1}小时`,
        priority: i <= 3 ? 'urgent' : 'normal',
        assignedDate: `2024-03-${String(15 + Math.floor(i / 5)).padStart(2, '0')}`,
        assignedTime: `${String(8 + (i % 8)).padStart(2, '0')}:00 - ${String(10 + (i % 8)).padStart(2, '0')}:00`,
        assignedStaff: staffNames[i % 6],
        status: i <= 12 ? 'today' : 'scheduled',
        createTime: `2024-02-${String(10 + Math.floor(i / 5)).padStart(2, '0')} ${String(8 + (i % 10)).padStart(2, '0')}:00`
      })
    }

    return tasks
  }

  let mockData = generateMockTasks()

  // 根据参数筛选数据
  if (params) {
    if (params.status && params.status !== 'all') {
      mockData = mockData.filter(task => {
        if (params.status === 'pending') return !task.assignedStaff
        if (params.status === 'assigned') return !!task.assignedStaff
        return true
      })
    }

    if (params.taskId) {
      mockData = mockData.filter(
        task =>
          task.id.toLowerCase().includes(params.taskId!.toLowerCase()) ||
          task.company.toLowerCase().includes(params.taskId!.toLowerCase()) ||
          task.address.toLowerCase().includes(params.taskId!.toLowerCase())
      )
    }

    if (params.priority && params.priority !== 'all') {
      mockData = mockData.filter(task => task.priority === params.priority)
    }
  }

  const total = mockData.length
  const page = params?.page || 1
  const pageSize = params?.pageSize || 10
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize

  return {
    data: mockData.slice(startIndex, endIndex),
    total
  }
}

// 生命周期
onMounted(() => {
  loadTasks()
})
</script>

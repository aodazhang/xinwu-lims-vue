<template>
  <div>
    <!-- 页面标题 -->
    <common-title title="采样工作台" content="首页 / 采样工作台" />

    <!-- 统计卡片 -->
    <common-stats class="md:!grid-cols-3" :model="statsData" />

    <!-- 搜索和筛选栏 -->
    <common-filter title="任务列表" @filter="loadTasks">
      <select
        v-model="statusFilter"
        class="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
      >
        <option value="">全部任务</option>
        <option value="pending">待处理</option>
        <option value="ongoing">进行中</option>
        <option value="completed">已完成</option>
      </select>

      <select
        v-model="sortBy"
        class="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
      >
        <option value="urgent">紧急程度</option>
        <option value="time">计划时间</option>
        <option value="created">创建时间</option>
        <option value="status">任务状态</option>
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
          @click="openTaskDetail(scope.id)"
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
            scope.isUrgent
              ? 'bg-red-100 text-red-700'
              : 'bg-blue-100 text-blue-700'
          ]"
        >
          {{ scope.isUrgent ? '紧急' : '普通' }}
        </span>
      </template>

      <!-- 状态插槽 -->
      <template #status="{ scope }">
        <span
          class="rounded-full px-3 py-1 text-xs font-semibold"
          :class="getStatusBadgeClass(scope.status)"
        >
          {{ getStatusText(scope.status) }}
        </span>
      </template>

      <!-- 操作按钮插槽 -->
      <template #actions="{ scope }">
        <button
          class="rounded-lg border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
          @click="openTaskDetail(scope.id)"
        >
          查看详情
        </button>
      </template>
    </common-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toolSleep } from '@/utils/tool'
import CommonTitle from '@/components/common-title.vue'
import CommonStats from '@/components/common-stats.vue'
import CommonFilter from '@/components/common-filter.vue'
import CommonTable from '@/components/common-table.vue'

/**
 * 任务数据接口
 */
interface Task {
  id: string
  company: string
  address: string
  testType: string
  points: number
  status: 'pending' | 'ongoing' | 'completed'
  isUrgent: boolean
  scheduledTime: string
  createTime: string
}

/**
 * 统计数据接口
 */
interface Statistics {
  today: number
  pending: number
  total: number
}

const router = useRouter()

// 响应式数据
const statusFilter = ref('')
const sortBy = ref('urgent')
const statistics = ref<Statistics>({
  today: 0,
  pending: 0,
  total: 0
})

// 统计数据配置
const statsData = computed(() => [
  {
    label: '今日任务',
    value: statistics.value.today
  },
  {
    label: '未完成任务',
    value: statistics.value.pending
  },
  {
    label: '本月总任务',
    value: statistics.value.total
  }
])

// 表格配置
const tableConfig = ref({
  loading: false,
  rowKey: 'id',
  selection: false,
  pagination: true,
  total: 0,
  current: 1
})

// 表格列配置
const tableColumns = [
  {
    label: '任务编号',
    props: 'id',
    width: 150,
    slotName: 'taskId'
  },
  {
    label: '委托单位',
    props: 'company',
    minWidth: 150
  },
  {
    label: '采样地址',
    props: 'address',
    minWidth: 200
  },
  {
    label: '检测类型',
    props: 'testType',
    width: 120
  },
  {
    label: '采样点数',
    props: 'points',
    width: 100,
    slotName: 'points'
  },
  {
    label: '优先级',
    props: 'isUrgent',
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
    label: '计划时间',
    props: 'scheduledTime',
    width: 150
  },
  {
    label: '操作',
    props: 'actions',
    width: 100,
    slotName: 'actions'
  }
]

// 任务列表数据
const tasks = ref<Task[]>([
  {
    id: 'XW2024031501',
    company: '深圳市某某自来水公司',
    address: '深圳市南山区科技园南路123号',
    testType: '生活饮用水常规检测',
    points: 8,
    status: 'pending',
    isUrgent: true,
    scheduledTime: '今天 09:00-11:00',
    createTime: '2024-03-15 08:30'
  },
  {
    id: 'XW2024031502',
    company: '广州市环保科技有限公司',
    address: '广州市天河区体育西路88号',
    testType: '工业废水检测',
    points: 5,
    status: 'ongoing',
    isUrgent: false,
    scheduledTime: '今天 14:00-16:00',
    createTime: '2024-03-15 09:15'
  },
  {
    id: 'XW2024031503',
    company: '东莞市制造工业园',
    address: '东莞市长安镇工业大道268号',
    testType: '土壤环境检测',
    points: 12,
    status: 'pending',
    isUrgent: false,
    scheduledTime: '明天 10:00-12:00',
    createTime: '2024-03-15 10:20'
  },
  {
    id: 'XW2024031504',
    company: '佛山市化工企业集团',
    address: '佛山市顺德区工业园区',
    testType: '大气环境检测',
    points: 6,
    status: 'completed',
    isUrgent: false,
    scheduledTime: '昨天已完成',
    createTime: '2024-03-14 16:45'
  }
])

/**
 * 计算过滤后的任务列表
 */
const filteredTasks = computed(() => {
  let filtered = tasks.value

  // 按状态筛选
  if (statusFilter.value) {
    filtered = filtered.filter(task => task.status === statusFilter.value)
  }

  // 排序
  return filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'urgent':
        // 紧急任务优先
        if (a.isUrgent && !b.isUrgent) return -1
        if (!a.isUrgent && b.isUrgent) return 1
        return 0
      case 'status':
        // 按状态排序：待处理 > 进行中 > 已完成
        const statusOrder = { pending: 0, ongoing: 1, completed: 2 }
        return statusOrder[a.status] - statusOrder[b.status]
      case 'time':
      case 'created':
      default:
        return 0
    }
  })
})

/**
 * 获取状态徽章样式类
 * @param status 任务状态
 */
const getStatusBadgeClass = (status: string): string => {
  const classes = {
    pending: 'bg-amber-100 text-amber-800',
    ongoing: 'bg-indigo-100 text-indigo-800',
    completed: 'bg-emerald-100 text-emerald-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

/**
 * 获取状态文本
 * @param status 任务状态
 */
const getStatusText = (status: string): string => {
  const texts = {
    pending: '待处理',
    ongoing: '进行中',
    completed: '已完成'
  }
  return texts[status as keyof typeof texts] || '未知'
}

/**
 * 打开任务详情
 * @param taskId 任务ID
 */
const openTaskDetail = (taskId: string): void => {
  // 跳转到任务详情页
  router.push({
    path: '/sampler-detail',
    query: {
      taskId
    }
  })
}

/**
 * 加载任务数据
 */
const loadTasks = async (): Promise<void> => {
  try {
    tableConfig.value.loading = true
    // 这里应该调用API获取数据
    // const response = await api.getTasks()
    // tasks.value = response.data

    await toolSleep(1000)

    // 更新统计数据
    updateStatistics()
    tableConfig.value.total = filteredTasks.value.length
  } catch (error) {
    console.error('加载任务数据失败:', error)
  } finally {
    tableConfig.value.loading = false
  }
}

/**
 * 更新统计数据
 */
const updateStatistics = (): void => {
  const todayTasks = tasks.value.filter(task =>
    task.scheduledTime.includes('今天')
  ).length

  const pendingTasks = tasks.value.filter(
    task => task.status === 'pending'
  ).length

  statistics.value = {
    today: todayTasks,
    pending: pendingTasks,
    total: tasks.value.length
  }
}

// 生命周期钩子
onMounted(() => {
  // 加载任务数据
  loadTasks()
})
</script>

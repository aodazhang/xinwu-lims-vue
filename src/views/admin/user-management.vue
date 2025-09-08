<template>
  <div>
    <!-- 页面头部 -->
    <common-title title="用户管理" content="系统管理工作台 / 用户管理" />

    <!-- 统计卡片 -->
    <common-stats :model="statsData" />

    <!-- 操作按钮 -->
    <div class="mt-5 flex flex-wrap gap-4">
      <button
        class="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30"
        @click="openCreateModal"
      >
        创建用户
      </button>
    </div>

    <!-- 搜索栏 -->
    <common-filter title="用户列表" @filter="loadDataList">
      <input
        v-model="searchKeyword"
        type="text"
        class="w-48 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        placeholder="搜索用户名称"
      />
    </common-filter>

    <!-- 用户列表 -->
    <common-table :config="tableConfig" :items="tableColumns" :model="users">
      <!-- 用户ID插槽 -->
      <template #userIdSlot="{ scope }">
        <button
          class="cursor-pointer font-medium text-indigo-600 transition-colors duration-200 hover:text-indigo-800 hover:underline"
          @click="editUser(scope)"
        >
          {{ scope.id }}
        </button>
      </template>

      <!-- 用户角色插槽 -->
      <template #roleSlot="{ scope }">
        <span
          class="inline-block rounded px-2 py-1 text-xs font-medium"
          :class="getRoleClass(scope.role)"
        >
          {{ getRoleText(scope.role) }}
        </span>
      </template>

      <!-- 操作插槽 -->
      <template #actionSlot="{ scope }">
        <div class="flex gap-2">
          <button
            class="rounded border border-green-500 px-2 py-1 text-xs text-green-600 transition-all duration-200 hover:bg-green-500 hover:text-white"
            @click="editUser(scope)"
          >
            编辑
          </button>
        </div>
      </template>
    </common-table>

    <!-- 创建用户弹窗 -->
    <common-modal-user ref="createModalRef" @refresh="loadDataList" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { toolSleep } from '@/utils/tool'
import CommonTitle from '@/components/common-title.vue'
import CommonStats from '@/components/common-stats.vue'
import CommonFilter from '@/components/common-filter.vue'
import CommonTable from '@/components/common-table.vue'
import CommonModalUser from '@/components/common-modal-user.vue'

defineOptions({ name: 'UserManagement' })

// 响应式数据
const searchKeyword = ref('')
const createModalRef = ref<InstanceType<typeof CommonModalUser>>()

// 统计数据
const statsData = computed(() => [
  { label: '当前用户数量', value: 25 },
  { label: '活跃用户数量', value: 18 },
  { label: '管理员数量', value: 3 }
])

// 用户数据
const users = ref<SystemUser[]>([])

// 表格配置
const tableConfig = ref({
  rowKey: 'id',
  loading: false,
  selection: false,
  pagination: false
})

// 表格列配置
const tableColumns = [
  {
    label: '用户ID',
    props: 'id',
    minWidth: 150,
    slotName: 'userIdSlot'
  },
  { label: '用户名称', props: 'name', minWidth: 200 },
  { label: '用户角色', props: 'role', minWidth: 150, slotName: 'roleSlot' },
  { label: '创建时间', props: 'createdAt', minWidth: 180 },
  { label: '操作', props: 'action', minWidth: 150, slotName: 'actionSlot' }
]

// 获取角色样式类
const getRoleClass = (role: string) => {
  const roleClasses = {
    admin: 'bg-red-100 text-red-800',
    sales: 'bg-blue-100 text-blue-800',
    reviewer: 'bg-green-100 text-green-800',
    sampling_dispatcher: 'bg-purple-100 text-purple-800',
    sampling_staff: 'bg-yellow-100 text-yellow-800',
    sample_manager: 'bg-indigo-100 text-indigo-800',
    'lab-supervisor': 'bg-pink-100 text-pink-800',
    'lab-technician': 'bg-cyan-100 text-cyan-800',
    report_creator: 'bg-orange-100 text-orange-800',
    report_reviewer: 'bg-teal-100 text-teal-800',
    report_approver: 'bg-emerald-100 text-emerald-800'
  }
  return (
    roleClasses[role as keyof typeof roleClasses] || 'bg-gray-100 text-gray-800'
  )
}

// 获取角色文本
const getRoleText = (role: string) => {
  const roleTexts = {
    admin: '系统管理员',
    sales: '销售人员',
    reviewer: '订单审核员',
    sampling_dispatcher: '采样调度员',
    sampling_staff: '采样人员',
    sample_manager: '样品管理员',
    'lab-supervisor': '实验室主管',
    'lab-technician': '检测员',
    report_creator: '报告编制员',
    report_reviewer: '报告审核员',
    report_approver: '报告审批员'
  }
  return roleTexts[role as keyof typeof roleTexts] || role
}

// 打开创建用户弹窗
const openCreateModal = () => {
  createModalRef.value?.open()
}

// 编辑用户
const editUser = (user: SystemUser) => {
  createModalRef.value?.open(user)
}

// 处理刷新事件
const loadDataList = async () => {
  try {
    tableConfig.value.loading = true
    await toolSleep(1000)
    users.value = [
      {
        id: 'U001',
        name: '系统管理员',
        role: 'admin',
        createdAt: '2024-01-01 09:00:00'
      },
      {
        id: 'U002',
        name: '张三',
        role: 'sales',
        createdAt: '2024-01-15 10:30:00'
      },
      {
        id: 'U003',
        name: '李四',
        role: 'reviewer',
        createdAt: '2024-01-20 14:15:00'
      },
      {
        id: 'U004',
        name: '王五',
        role: 'sampling_dispatcher',
        createdAt: '2024-02-01 08:45:00'
      },
      {
        id: 'U005',
        name: '赵六',
        role: 'sampling_staff',
        createdAt: '2024-02-05 16:20:00'
      },
      {
        id: 'U006',
        name: '钱七',
        role: 'sample_manager',
        createdAt: '2024-02-10 11:10:00'
      },
      {
        id: 'U007',
        name: '孙八',
        role: 'lab-supervisor',
        createdAt: '2024-02-15 13:30:00'
      },
      {
        id: 'U008',
        name: '周九',
        role: 'lab-technician',
        createdAt: '2024-02-20 09:45:00'
      },
      {
        id: 'U009',
        name: '吴十',
        role: 'report_creator',
        createdAt: '2024-02-25 15:00:00'
      },
      {
        id: 'U010',
        name: '郑十一',
        role: 'report_reviewer',
        createdAt: '2024-03-01 10:20:00'
      }
    ]
  } catch (error) {
    console.error('加载用户数据失败:', error)
  } finally {
    tableConfig.value.loading = false
  }
}

// 生命周期
onMounted(() => {
  loadDataList()
})
</script>

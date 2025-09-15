<template>
  <div>
    <!-- 页面头部 -->
    <common-title title="用户管理" content="系统管理工作台 / 用户管理" />

    <!-- 统计卡片 -->
    <!-- <common-stats :model="statsData" /> -->

    <!-- 操作按钮 -->
    <div class="mt-5 flex flex-wrap gap-4">
      <button
        class="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30"
        @click="onClickAdd"
      >
        创建用户
      </button>
    </div>

    <!-- 搜索栏 -->
    <common-filter
      title="用户列表"
      @reset="onResetList"
      @filter="loadDataList(true)"
    >
      <input
        v-model="searchKeyword"
        type="text"
        class="w-48 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        placeholder="搜索用户名称"
      />
    </common-filter>

    <!-- 用户列表 -->
    <common-table
      :config="tableConfig"
      :items="tableColumns"
      :model="users"
      @current-change="loadDataList(false)"
    >
      <!-- 用户角色插槽 -->
      <template #roleSlot="{ scope }">
        <div class="flex flex-wrap gap-1">
          <span
            v-for="role in scope.roles"
            :key="role.roleCode"
            class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
            :class="getRoleClass(role.roleCode)"
          >
            {{ role.roleName }}
          </span>
        </div>
      </template>

      <!-- 创建时间插槽 -->
      <template #createTimeSlot="{ scope }">
        <div>{{ dateToString(scope.createTime) }}</div>
      </template>

      <!-- 更新时间插槽 -->
      <template #updateTimeSlot="{ scope }">
        <div>{{ dateToString(scope.updateTime) }}</div>
      </template>

      <!-- 操作插槽 -->
      <template #actionSlot="{ scope }">
        <div class="flex gap-2">
          <button
            class="rounded border border-indigo-500 px-2 py-1 text-xs text-indigo-600 transition-all duration-200 hover:bg-indigo-500 hover:text-white"
            @click="onClickEdit(scope)"
          >
            编辑
          </button>

          <button
            class="rounded border border-green-500 px-2 py-1 text-xs text-green-600 transition-all duration-200 hover:bg-green-500 hover:text-white"
            @click="onClickReset(scope)"
          >
            重置密码
          </button>
        </div>
      </template>
    </common-table>

    <!-- 创建用户弹窗 -->
    <common-modal-user ref="createModalRef" @refresh="loadDataList(false)" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { isArray, isNumber, isString } from '@/utils/is'
import { dateToString } from '@/utils/date'
import { UserRole } from '@/utils/enum'
import Message from '@/utils/message'
import api from '@/api'
import CommonTitle from '@/components/common-title.vue'
// import CommonStats from '@/components/common-stats.vue'
import CommonFilter from '@/components/common-filter.vue'
import CommonTable from '@/components/common-table.vue'
import CommonModalUser from '@/components/common-modal-user.vue'

defineOptions({ name: 'UserManagement' })

// 响应式数据
const searchKeyword = ref('')
const createModalRef = ref<InstanceType<typeof CommonModalUser>>()

// 统计数据
// const statsData = computed(() => [
//   { label: '当前用户数量', value: tableConfig.value.total },
//   { label: '活跃用户数量', value: 0 },
//   { label: '管理员数量', value: 0 }
// ])

// 用户数据
const users = ref<SystemUser[]>([])

// 表格配置
const tableConfig = ref({
  rowKey: 'id',
  loading: false,
  selection: false,
  pagination: true,
  total: 0,
  current: 1
})

// 表格列配置
const tableColumns = [
  { label: '用户名', props: 'userName', minWidth: 180 },
  { label: '真实姓名', props: 'realName', minWidth: 150 },
  { label: '用户角色', props: 'role', minWidth: 150, slotName: 'roleSlot' },
  {
    label: '创建时间',
    props: 'createTime',
    minWidth: 180,
    slotName: 'createTimeSlot'
  },
  {
    label: '更新时间',
    props: 'updateTime',
    minWidth: 180,
    slotName: 'updateTimeSlot'
  },
  { label: '操作', props: 'action', width: 150, slotName: 'actionSlot' }
]

// 获取角色样式类
const getRoleClass = (roleCode: string) => {
  const roleClasses = {
    [UserRole.ADMIN]: 'bg-red-100 text-red-800',
    [UserRole.SALES_PERSON]: 'bg-blue-100 text-blue-800',
    [UserRole.ORDER_REVIEWER]: 'bg-green-100 text-green-800',
    [UserRole.SAMPLING_DISPATCHER]: 'bg-purple-100 text-purple-800',
    [UserRole.SAMPLING_OPERATOR]: 'bg-yellow-100 text-yellow-800',
    [UserRole.SAMPLE_MANAGER]: 'bg-indigo-100 text-indigo-800',
    [UserRole.LAB_SUPERVISOR]: 'bg-pink-100 text-pink-800',
    [UserRole.LAB_TECHNICIAN]: 'bg-cyan-100 text-cyan-800',
    [UserRole.REPORT_WRITER]: 'bg-orange-100 text-orange-800',
    [UserRole.REPORT_REVIEWER]: 'bg-teal-100 text-teal-800',
    [UserRole.REPORT_APPROVER]: 'bg-emerald-100 text-emerald-800'
  }
  return (
    roleClasses[roleCode as keyof typeof roleClasses] ||
    'bg-gray-100 text-gray-800'
  )
}

// 打开创建用户弹窗
const onClickAdd = () => {
  createModalRef.value?.open()
}

// 编辑用户
const onClickEdit = (user: SystemUser) => {
  createModalRef.value?.open(user)
}

// 重置密码
const onClickReset = async (user: SystemUser) => {
  await api.loadAdminUsersPasswordReset(user.id)
  Message.success('密码重置成功')
}

// 重置筛选条件
const onResetList = () => {
  searchKeyword.value = ''
  loadDataList(true)
}

// 处理刷新事件
const loadDataList = async (reset: boolean) => {
  try {
    if (reset) {
      tableConfig.value.current = 1
    }
    tableConfig.value.loading = true
    const res = await api.loadAdminUsers({
      username: isString(searchKeyword.value) ? searchKeyword.value : null,
      page: tableConfig.value.current,
      size: 10,
      sort: 'id,desc'
    })
    tableConfig.value.total = isNumber(res.totalElements)
      ? res.totalElements
      : 0
    users.value = isArray(res.content) ? res.content : []
  } catch (error) {
    console.error('加载用户数据失败:', error)
  } finally {
    tableConfig.value.loading = false
  }
}

// 生命周期
onMounted(() => {
  loadDataList(true)
})
</script>

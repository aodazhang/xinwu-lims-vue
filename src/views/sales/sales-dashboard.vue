<template>
  <div>
    <!-- 页面头部 -->
    <common-title title="销售工作台" content="首页 / 销售工作台" />

    <!-- 统计卡片 -->
    <!-- <common-stats :model="statsData" /> -->

    <!-- 操作按钮 -->
    <div class="mt-5 flex flex-wrap gap-4">
      <button
        class="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30"
        @click="onClickAdd"
      >
        创建订单
      </button>
      <button
        class="rounded-lg border border-indigo-500 bg-white px-6 py-3 text-sm font-medium text-indigo-500 transition-all duration-200 hover:bg-gray-50"
        @click="onClickCustomers"
      >
        客户管理
      </button>
    </div>

    <!-- 筛选 -->
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

      <!-- 客户名称搜索 -->
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
          v-model="searchFilters.customerName"
          type="text"
          class="w-48 rounded-lg border border-gray-300 bg-white px-9 py-2 text-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          placeholder="客户名称模糊查询"
        />
      </div>

      <!-- 状态筛选 -->
      <select
        v-model="searchFilters.progressAndOrderStatusCode"
        class="w-48 cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
      >
        <option value="0" disabled>全部状态</option>
        <option :value="ProgressAndOrderStatus.PENDING_REVIEW">待审核</option>
        <option :value="ProgressAndOrderStatus.APPROVED">审核通过</option>
        <option :value="ProgressAndOrderStatus.REJECTED">审核驳回</option>
        <option :value="ProgressAndOrderStatus.CANCELLED">已取消</option>
        <option :value="ProgressAndOrderStatus.SAMPLING_TASK">采样中</option>
        <option :value="ProgressAndOrderStatus.DETECTION_TASK">检测中</option>
        <option :value="ProgressAndOrderStatus.REPORT">报告中</option>
      </select>
    </common-filter>

    <!-- 订单列表 -->
    <common-table
      :config="tableConfig"
      :items="tableColumns"
      :model="orders"
      @current-change="loadDataList(false)"
    >
      <!-- 项目编号列 -->
      <template #projectNumber="{ scope }">
        <span class="text-indigo-500">
          {{ scope.projectNumber }}
        </span>
        <span
          v-if="scope.urgentFlag"
          class="ml-2 rounded bg-red-500 px-1 py-0.5 text-xs font-bold text-white"
        >
          加急
        </span>
      </template>

      <!-- 项目金额列 -->
      <template #projectAmount="{ scope }">
        <div>
          {{
            scope.projectAmount
              ? `¥${scope.projectAmount?.toLocaleString()}`
              : ''
          }}
        </div>
      </template>

      <!-- 状态列 -->
      <template #orderStatusName="{ scope }">
        <span
          :class="getStatusClass(scope.orderStatusName)"
          class="inline-block rounded px-2 py-1 text-xs font-medium"
        >
          {{ scope.orderStatusName }}
        </span>
      </template>

      <!-- 创建时间插槽 -->
      <template #createTimeSlot="{ scope }">
        <div>{{ dateToString(scope.createTime) }}</div>
      </template>

      <!-- 更新时间插槽 -->
      <template #updateTimeSlot="{ scope }">
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
            v-if="scope.orderStatusCode === OrderStatus.PENDING_REVIEW"
            class="rounded border border-indigo-500 px-2 py-1 text-xs text-indigo-600 transition-all duration-200 hover:bg-indigo-500 hover:text-white"
            @click="onClickEdit(scope.id)"
          >
            编辑
          </button>
        </div>
      </template>
    </common-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { OrderStatus, ProgressAndOrderStatus } from '@/utils/enum'
import { isArray, isNumber, isString } from '@/utils/is'
import { dateToString } from '@/utils/date'
import api from '@/api'
import CommonTitle from '@/components/common-title.vue'
// import CommonStats from '@/components/common-stats.vue'
import CommonFilter from '@/components/common-filter.vue'
import CommonTable from '@/components/common-table.vue'

defineOptions({ name: 'SalesDashboard' })

const router = useRouter()

// 统计数据
// const statsData = computed(() => [
//   { label: '当月订单数', value: 156 },
//   { label: '当月业绩', value: `¥${8000}` },
//   { label: '当月实收金额', value: `¥${500}` }
// ])

// 筛选数据
const searchFilters = ref({
  projectNumber: '',
  customerName: '',
  progressAndOrderStatusCode: 0
})

// 订单数据
const orders = ref<SalesOrder[]>([])

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
  { label: '客户名称', props: 'customerName', minWidth: 180 },
  { label: '受检单位', props: 'inspectedUnit', minWidth: 150 },
  { label: '检测类型', props: 'detectionTypeName', width: 100 },
  { label: '检测点数', props: 'detectionPoints', width: 80 },
  {
    label: '项目金额',
    props: 'projectAmount',
    minWidth: 100,
    slotName: 'projectAmount'
  },
  {
    label: '状态',
    props: 'orderStatusName',
    minWidth: 100,
    align: 'center',
    slotName: 'orderStatusName'
  },
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
  { label: '操作', props: 'actions', minWidth: 150, slotName: 'actions' }
]

// 获取状态样式类
const getStatusClass = (status: string) => {
  const statusClasses = {
    待审核: 'bg-yellow-100 text-yellow-800',
    审核通过: 'bg-green-100 text-green-800',
    审核驳回: 'bg-red-100 text-red-800',
    已取消: 'bg-orange-100 text-orange-800',
    采样中: 'bg-purple-100 text-purple-800',
    检测中: 'bg-purple-100 text-purple-800',
    报告中: 'bg-purple-100 text-purple-800'
  }
  return statusClasses[status as keyof typeof statusClasses] || 'text-gray-800'
}

// 客户管理
const onClickCustomers = () => {
  router.push('/customer-management')
}

// 创建订单
const onClickAdd = () => {
  router.push('/sales-form')
}

// 编辑订单
const onClickEdit = (orderId: number) => {
  router.push({
    path: '/sales-form',
    query: {
      orderId
    }
  })
}

// 查看订单详情
const onClickDetail = (orderId: number) => {
  router.push({
    path: '/sales-detail',
    query: {
      orderId
    }
  })
}

// 重置筛选条件
const onResetList = () => {
  searchFilters.value = {
    projectNumber: '',
    customerName: '',
    progressAndOrderStatusCode: 0
  }
  loadDataList(true)
}

// 处理刷新事件
const loadDataList = async (reset: boolean = false) => {
  try {
    if (reset) {
      tableConfig.value.current = 1
    }
    tableConfig.value.loading = true
    const res = await api.loadOrders({
      projectNumber: isString(searchFilters.value.projectNumber)
        ? searchFilters.value.projectNumber
        : null,
      customerName: isString(searchFilters.value.customerName)
        ? searchFilters.value.customerName
        : null,
      progressAndOrderStatusCode: isString(
        searchFilters.value.progressAndOrderStatusCode
      )
        ? searchFilters.value.progressAndOrderStatusCode
        : null,
      page: tableConfig.value.current,
      size: 10
    })
    tableConfig.value.total = isNumber(res.totalElements)
      ? res.totalElements
      : 0
    orders.value = isArray(res.content) ? res.content : []
  } catch (error) {
    console.error('加载订单数据失败:', error)
  } finally {
    tableConfig.value.loading = false
  }
}

// 生命周期
onMounted(() => {
  loadDataList(true)
})
</script>

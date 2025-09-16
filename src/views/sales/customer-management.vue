<template>
  <div>
    <!-- 页面头部 -->
    <common-title title="客户管理" content="销售工作台 / 客户管理" />

    <!-- 统计卡片 -->
    <!-- <common-stats :model="statsData" /> -->

    <!-- 操作按钮 -->
    <div class="mt-5 flex flex-wrap gap-4">
      <button
        class="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30"
        @click="onClickAdd"
      >
        创建客户
      </button>
    </div>

    <!-- 搜索栏 -->
    <common-filter
      title="客户列表"
      @reset="onResetList"
      @filter="loadDataList(true)"
    >
      <input
        v-model="searchKeyword"
        type="text"
        class="w-48 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        placeholder="搜索客户名称"
      />
    </common-filter>

    <!-- 客户列表 -->
    <common-table
      :config="tableConfig"
      :items="tableColumns"
      :model="customers"
      @current-change="loadDataList(false)"
    >
      <!-- 客户状态插槽 -->
      <template #customerStatusNameSlot="{ scope }">
        <span
          class="inline-block rounded px-2 py-1 text-xs font-medium"
          :class="getStatusClass(scope.customerStatusName)"
        >
          {{ scope.customerStatusName }}
        </span>
      </template>

      <!-- 操作插槽 -->
      <template #actionSlot="{ scope }">
        <div class="flex gap-2">
          <button
            class="rounded border border-indigo-500 px-2 py-1 text-xs text-indigo-600 transition-all duration-200 hover:bg-indigo-500 hover:text-white"
            @click="onClickDetail(scope.id)"
          >
            查看
          </button>
        </div>
      </template>
    </common-table>

    <!-- 创建客户弹窗 -->
    <common-modal-customer
      ref="createModalRef"
      @refresh="loadDataList(false)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { isArray, isNumber, isString } from '@/utils/is'
import api from '@/api'
import CommonTitle from '@/components/common-title.vue'
// import CommonStats from '@/components/common-stats.vue'
import CommonFilter from '@/components/common-filter.vue'
import CommonTable from '@/components/common-table.vue'
import CommonModalCustomer from '@/components/common-modal-customer.vue'

defineOptions({ name: 'CustomerManagement' })

const router = useRouter()

// 响应式数据
const searchKeyword = ref('')
const createModalRef = ref<InstanceType<typeof CommonModalCustomer>>()

// 统计数据
// const statsData = computed(() => [
//   { label: '当前客户数量', value: 156 },
//   { label: '已成交客户数量', value: 98 },
//   { label: '公海客户数量', value: 32 }
// ])

// 客户数据
const customers = ref<SalesCustomer[]>([])

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
  { label: '客户编号', props: 'customerCode', minWidth: 150 },
  { label: '客户名称', props: 'customerName', minWidth: 180 },
  { label: '客户联系人', props: 'contactPerson', minWidth: 120 },
  { label: '客户联系电话', props: 'contactPhone', minWidth: 120 },
  { label: '客户来源', props: 'customerSourceName', minWidth: 120 },
  {
    label: '客户状态',
    props: 'customerStatusName',
    minWidth: 120,
    slotName: 'customerStatusNameSlot'
  },
  { label: '操作', props: 'action', width: 100, slotName: 'actionSlot' }
]

// 获取状态样式类
const getStatusClass = (status: string) => {
  const statusClasses = {
    已成交: 'bg-green-100 text-green-800',
    公海: 'bg-blue-100 text-blue-800',
    跟进中: 'bg-yellow-100 text-yellow-800'
  }
  return statusClasses[status as keyof typeof statusClasses] || 'text-gray-800'
}

// 打开创建客户弹窗
const onClickAdd = () => {
  createModalRef.value?.open()
}

// 查看客户详情
const onClickDetail = (customerId: number) => {
  router.push({
    path: '/customer-detail',
    query: {
      customerId
    }
  })
}

// 重置筛选条件
const onResetList = () => {
  searchKeyword.value = ''
  loadDataList(true)
}

// 处理刷新事件
const loadDataList = async (reset: boolean = false) => {
  try {
    if (reset) {
      tableConfig.value.current = 1
    }
    tableConfig.value.loading = true
    const res = await api.loadCustomers({
      q: isString(searchKeyword.value) ? searchKeyword.value : null,
      page: tableConfig.value.current,
      size: 10,
      sort: 'id,desc'
    })
    tableConfig.value.total = isNumber(res.totalElements)
      ? res.totalElements
      : 0
    customers.value = isArray(res.content) ? res.content : []
  } catch (error) {
    console.error('加载客户数据失败:', error)
  } finally {
    tableConfig.value.loading = false
  }
}

// 生命周期
onMounted(() => {
  loadDataList(true)
})
</script>

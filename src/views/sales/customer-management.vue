<template>
  <div>
    <!-- 页面头部 -->
    <CommonTitle title="客户管理" content="销售工作台 / 客户管理" />

    <!-- 统计卡片 -->
    <CommonStats :model="statsData" />

    <!-- 操作按钮 -->
    <div class="mt-5 flex flex-wrap gap-4">
      <button
        class="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30"
        @click="openCreateModal"
      >
        创建客户
      </button>
    </div>

    <!-- 搜索栏 -->
    <CommonFilter title="客户列表" @filter="handleSearch">
      <input
        v-model="searchKeyword"
        type="text"
        class="w-64 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        placeholder="搜索客户名称..."
      />
    </CommonFilter>

    <!-- 客户列表 -->
    <CommonTable
      :config="tableConfig"
      :items="tableColumns"
      :model="filteredCustomers"
    >
      <!-- 客户编号插槽 -->
      <template #customerIdSlot="{ scope }">
        <button
          class="cursor-pointer font-medium text-indigo-600 transition-colors duration-200 hover:text-indigo-800 hover:underline"
          @click="viewCustomer(scope.customerId)"
        >
          {{ scope.customerId }}
        </button>
      </template>

      <!-- 客户状态插槽 -->
      <template #statusSlot="{ scope }">
        <span
          class="inline-block rounded px-2 py-1 text-xs font-medium"
          :class="getStatusClass(scope.status)"
        >
          {{ getStatusText(scope.status) }}
        </span>
      </template>

      <!-- 操作插槽 -->
      <template #actionSlot="{ scope }">
        <div class="flex gap-2">
          <button
            class="rounded border border-indigo-500 px-2 py-1 text-xs text-indigo-600 transition-all duration-200 hover:bg-indigo-500 hover:text-white"
            @click="viewCustomer(scope.customerId)"
          >
            查看
          </button>
        </div>
      </template>
    </CommonTable>

    <!-- 创建客户弹窗 -->
    <common-modal-customer ref="createModalRef" @refresh="handleRefresh" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import CommonTitle from '@/components/common-title.vue'
import CommonStats from '@/components/common-stats.vue'
import CommonFilter from '@/components/common-filter.vue'
import CommonTable from '@/components/common-table.vue'
import CommonModalCustomer from '@/components/common-modal-customer.vue'

defineOptions({ name: 'CustomerManagement' })

const router = useRouter()

// 响应式数据
const searchKeyword = ref('')
const createModalRef = ref<InstanceType<typeof CommonModalCustomer>>()

// 统计数据
const statsData = computed(() => [
  { label: '当前客户数量', value: 156 },
  { label: '已成交客户数量', value: 98 },
  { label: '公海客户数量', value: 32 }
])

// 客户数据
const customers = ref([
  {
    customerId: 'KH202504231001',
    customerName: '广州环保科技有限公司',
    contactName: '王经理',
    contactPhone: '13800138001',
    source: '自己开发',
    status: 'active'
  },
  {
    customerId: 'KH202504231002',
    customerName: '深圳创新工业园',
    contactName: '李主任',
    contactPhone: '13800138002',
    source: '渠道',
    status: 'active'
  },
  {
    customerId: 'KH202504251003',
    customerName: '佛山制造企业',
    contactName: '张总',
    contactPhone: '13800138003',
    source: '转介绍',
    status: 'following'
  },
  {
    customerId: 'KH202504261004',
    customerName: '东莞电子厂',
    contactName: '刘经理',
    contactPhone: '13800138004',
    source: '老客户',
    status: 'active'
  },
  {
    customerId: 'KH202504271005',
    customerName: '惠州化工园区',
    contactName: '陈主管',
    contactPhone: '13800138005',
    source: '美团点评',
    status: 'public'
  },
  {
    customerId: 'KH202504281006',
    customerName: '中山物流园区',
    contactName: '周经理',
    contactPhone: '13800138006',
    source: '百度',
    status: 'following'
  }
])

// 表格配置
const tableConfig = ref({
  rowKey: 'customerId',
  selection: false,
  pagination: false
})

// 表格列配置
const tableColumns = [
  {
    label: '客户编号',
    props: 'customerId',
    minWidth: 150,
    slotName: 'customerIdSlot'
  },
  { label: '客户名称', props: 'customerName', minWidth: 200 },
  { label: '客户联系人', props: 'contactName', minWidth: 120 },
  { label: '客户联系电话', props: 'contactPhone', minWidth: 140 },
  { label: '客户来源', props: 'source', minWidth: 120 },
  { label: '客户状态', props: 'status', minWidth: 120, slotName: 'statusSlot' },
  { label: '操作', props: 'action', minWidth: 100, slotName: 'actionSlot' }
]

// 过滤后的客户数据
const filteredCustomers = computed(() => {
  if (!searchKeyword.value) {
    return customers.value
  }
  return customers.value.filter(customer =>
    customer.customerName
      .toLowerCase()
      .includes(searchKeyword.value.toLowerCase())
  )
})

// 获取状态样式类
const getStatusClass = (status: string) => {
  const statusClasses = {
    active: 'bg-green-100 text-green-800',
    public: 'bg-blue-100 text-blue-800',
    following: 'bg-yellow-100 text-yellow-800'
  }
  return (
    statusClasses[status as keyof typeof statusClasses] ||
    'bg-gray-100 text-gray-800'
  )
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusTexts = {
    active: '已成交',
    public: '公海',
    following: '跟进中'
  }
  return statusTexts[status as keyof typeof statusTexts] || status
}

// 搜索处理
const handleSearch = () => {
  // 搜索逻辑已在 computed 中处理
  console.log('搜索关键词:', searchKeyword.value)
}

// 打开创建客户弹窗
const openCreateModal = () => {
  createModalRef.value?.open()
}

// 处理刷新事件
const handleRefresh = () => {
  // 这里可以重新获取客户列表数据
  console.log('刷新客户列表')
  // 实际项目中可以调用API重新获取数据
  // await fetchCustomers()
}

// 查看客户详情
const viewCustomer = (customerId: string) => {
  // 这里可以跳转到客户详情页面
  router.push({
    path: '/customer-detail',
    query: {
      customerId
    }
  })
}
</script>

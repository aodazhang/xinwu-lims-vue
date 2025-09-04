<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 页面头部 -->
    <CommonTitle title="客户管理" content="销售工作台 / 客户管理" />

    <!-- 统计卡片 -->
    <CommonStats :model="statsData" />

    <!-- 搜索栏 -->
    <CommonFilter title="客户列表" @filter="handleSearch">
      <input
        v-model="searchKeyword"
        type="text"
        class="w-64 rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        placeholder="搜索客户名称..."
      />
      <button
        class="flex items-center gap-2 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        @click="showCreateModal = true"
      >
        创建客户
      </button>
    </CommonFilter>

    <!-- 客户列表 -->
    <CommonTable
      :config="tableConfig"
      :items="tableColumns"
      :model="filteredCustomers"
    >
      <!-- 客户编号插槽 -->
      <template #customerIdSlot="{ scope }">
        <span class="font-medium text-indigo-600">{{ scope.customerId }}</span>
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
    <div
      v-if="showCreateModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
      @click="closeCreateModal"
    >
      <div
        class="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl transition-all duration-300"
        @click.stop
      >
        <!-- 弹窗头部 -->
        <div
          class="flex items-center justify-between bg-gradient-to-r from-indigo-500 to-purple-600 p-5 text-white"
        >
          <h3 class="text-lg font-semibold">创建客户</h3>
          <button
            class="flex h-8 w-8 items-center justify-center rounded-md bg-white bg-opacity-20 text-xl transition-colors duration-200 hover:bg-opacity-30"
            @click="closeCreateModal"
          >
            ×
          </button>
        </div>

        <!-- 弹窗内容 -->
        <div class="max-h-[calc(90vh-140px)] overflow-y-auto p-5">
          <form @submit.prevent="createCustomer">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <!-- 客户名称 -->
              <div class="md:col-span-2">
                <label class="mb-2 block text-sm font-medium text-gray-700">
                  客户名称 <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="customerForm.customerName"
                  type="text"
                  required
                  class="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="请输入客户名称"
                />
              </div>

              <!-- 客户联系人 -->
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700">
                  客户联系人 <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="customerForm.contactName"
                  type="text"
                  required
                  class="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="请输入联系人姓名"
                />
              </div>

              <!-- 客户联系电话 -->
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700">
                  客户联系电话 <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="customerForm.contactPhone"
                  type="tel"
                  required
                  class="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="请输入联系电话"
                />
              </div>

              <!-- 客户地址 -->
              <div class="md:col-span-2">
                <label class="mb-2 block text-sm font-medium text-gray-700"
                  >客户地址</label
                >
                <input
                  v-model="customerForm.address"
                  type="text"
                  class="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="请输入客户地址"
                />
              </div>

              <!-- 客户分类 -->
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700">
                  客户分类 <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="customerForm.category"
                  required
                  class="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">请选择</option>
                  <option value="individual">个体户</option>
                  <option value="channel">渠道</option>
                </select>
              </div>

              <!-- 客户来源 -->
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700">
                  客户来源 <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="customerForm.source"
                  required
                  class="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">请选择</option>
                  <option value="self">自己开发</option>
                  <option value="channel">渠道</option>
                  <option value="referral">转介绍</option>
                  <option value="old">老客户</option>
                  <option value="meituan">美团点评</option>
                  <option value="tmall">天猫</option>
                  <option value="baidu">百度</option>
                  <option value="douyin">抖音</option>
                  <option value="tencent">腾讯地图</option>
                  <option value="agent">代理商</option>
                </select>
              </div>

              <!-- 客户状态 -->
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700">
                  客户状态 <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="customerForm.status"
                  required
                  class="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">请选择</option>
                  <option value="active">已成交</option>
                  <option value="public">公海</option>
                  <option value="following">跟进中</option>
                </select>
              </div>

              <!-- 所属行业 -->
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700"
                  >所属行业</label
                >
                <select
                  v-model="customerForm.industry"
                  class="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">请选择</option>
                  <option value="indoor">室内净化</option>
                  <option value="ac">空调清洗</option>
                  <option value="testing">检测行业</option>
                  <option value="env">环保设备</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        <!-- 弹窗底部 -->
        <div
          class="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 p-4"
        >
          <button
            type="button"
            class="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-md"
            @click="closeCreateModal"
          >
            取消
          </button>
          <button
            type="button"
            class="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            @click="createCustomer"
          >
            确认创建
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import CommonTitle from '@/components/common-title.vue'
import CommonStats from '@/components/common-stats.vue'
import CommonFilter from '@/components/common-filter.vue'
import CommonTable from '@/components/common-table.vue'

defineOptions({ name: 'CustomerManagement' })

// 响应式数据
const searchKeyword = ref('')
const showCreateModal = ref(false)

// 统计数据
const statsData = computed(() => [
  { label: '当前客户数量', value: 156 },
  { label: '已成交客户数量', value: 98 },
  { label: '公海客户数量', value: 32 }
])

// 客户表单数据
const customerForm = reactive({
  customerName: '',
  contactName: '',
  contactPhone: '',
  address: '',
  category: '',
  source: '',
  status: '',
  industry: ''
})

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
const tableConfig = {
  rowKey: 'customerId',
  selection: false
}

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

// 生成客户编号
const generateCustomerId = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const sequence = String(customers.value.length + 1001).padStart(4, '0')
  return `KH${year}${month}${day}${sequence}`
}

// 搜索处理
const handleSearch = () => {
  // 搜索逻辑已在 computed 中处理
  console.log('搜索关键词:', searchKeyword.value)
}

// 关闭创建弹窗
const closeCreateModal = () => {
  showCreateModal.value = false
  // 重置表单
  Object.keys(customerForm).forEach(key => {
    customerForm[key as keyof typeof customerForm] = ''
  })
}

// 创建客户
const createCustomer = () => {
  // 验证必填字段
  if (
    !customerForm.customerName ||
    !customerForm.contactName ||
    !customerForm.contactPhone ||
    !customerForm.category ||
    !customerForm.source ||
    !customerForm.status
  ) {
    alert('请填写所有必填字段')
    return
  }

  const newCustomer = {
    customerId: generateCustomerId(),
    customerName: customerForm.customerName,
    contactName: customerForm.contactName,
    contactPhone: customerForm.contactPhone,
    source: customerForm.source,
    status: customerForm.status
  }

  customers.value.push(newCustomer)
  console.log('创建客户:', newCustomer)

  // 显示成功提示
  alert(`客户创建成功！客户编号：${newCustomer.customerId}`)

  closeCreateModal()
}

// 查看客户详情
const viewCustomer = (customerId: string) => {
  console.log('查看客户详情:', customerId)
  // 这里可以跳转到客户详情页面
  // router.push(`/customer-detail/${customerId}`)
}
</script>

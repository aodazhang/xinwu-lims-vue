<template>
  <!-- [公共]弹窗-客户选择 -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
        @click.self="close"
      >
        <div
          class="max-h-[90vh] w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl transition-all duration-300"
          v-loading="loading"
        >
          <div class="border-b border-gray-200 p-5">
            <h3 class="text-lg font-semibold text-gray-800">选择客户</h3>
          </div>
          <div class="max-h-96 overflow-y-auto p-5">
            <div class="space-y-2">
              <div
                v-for="customer in customers"
                :key="customer.id"
                class="cursor-pointer rounded-md border border-gray-200 p-3 transition-all hover:border-indigo-500 hover:bg-gray-50"
                @click="handleSelect(customer)"
              >
                <div class="font-medium text-gray-800">
                  {{ customer.customerName }}
                </div>
                <div class="text-xs text-gray-500">
                  联系人：{{ customer.contactPerson }} | 电话：{{
                    customer.contactPhone
                  }}
                </div>
              </div>
            </div>
          </div>
          <div class="border-t border-gray-200 p-5">
            <div class="flex justify-end">
              <button
                class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
                @click="close"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{ select: [customer: SalesCustomer] }>()

// 内部维护的状态
const visible = ref(false)
const customers = ref<SalesCustomer[]>([])
const loading = ref(false)

/**
 * 模拟获取客户数据的API请求
 */
const fetchCustomers = async (): Promise<SalesCustomer[]> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 1000))

  // 模拟返回客户数据
  return [
    {
      id: 1,
      createTime: '2024-01-01 10:00:00',
      updateTime: '2024-01-01 10:00:00',
      customerCode: 'C001',
      customerName: '广州环保科技有限公司',
      contactPerson: '王经理',
      contactPhone: '13800138001',
      customerAddress: '广州市天河区科技园',
      customerCategoryId: 1,
      customerCategoryCode: 'INDIVIDUAL',
      customerSourceId: 1,
      customerSourceCode: 'WEB',
      customerStatusId: 1,
      customerStatusCode: 'ACTIVE',
      industryId: 1,
      industryCode: 'ENV',
      customerSourceName: '网络推广',
      customerCategoryName: '个体户',
      customerStatusName: 'active',
      industryName: '环保科技'
    },
    {
      id: 2,
      createTime: '2024-01-01 10:00:00',
      updateTime: '2024-01-01 10:00:00',
      customerCode: 'C002',
      customerName: '深圳创新工业园',
      contactPerson: '李主任',
      contactPhone: '13800138002',
      customerAddress: '深圳市南山区科技园B区',
      customerCategoryId: 2,
      customerCategoryCode: 'CHANNEL',
      customerSourceId: 2,
      customerSourceCode: 'CHANNEL',
      customerStatusId: 1,
      customerStatusCode: 'ACTIVE',
      industryId: 2,
      industryCode: 'TECH',
      customerSourceName: '渠道',
      customerCategoryName: '渠道',
      customerStatusName: 'active',
      industryName: '科技园区'
    },
    {
      id: 3,
      createTime: '2024-01-01 10:00:00',
      updateTime: '2024-01-01 10:00:00',
      customerCode: 'C003',
      customerName: '佛山制造企业',
      contactPerson: '张总',
      contactPhone: '13800138003',
      customerAddress: '佛山市顺德区工业园',
      customerCategoryId: 1,
      customerCategoryCode: 'INDIVIDUAL',
      customerSourceId: 3,
      customerSourceCode: 'REFERRAL',
      customerStatusId: 2,
      customerStatusCode: 'FOLLOWING',
      industryId: 3,
      industryCode: 'MANUFACTURING',
      customerSourceName: '转介绍',
      customerCategoryName: '个体户',
      customerStatusName: 'following',
      industryName: '制造业'
    },
    {
      id: 4,
      createTime: '2024-01-01 10:00:00',
      updateTime: '2024-01-01 10:00:00',
      customerCode: 'C004',
      customerName: '东莞电子厂',
      contactPerson: '刘经理',
      contactPhone: '13800138004',
      customerAddress: '东莞市松山湖高新区',
      customerCategoryId: 1,
      customerCategoryCode: 'INDIVIDUAL',
      customerSourceId: 4,
      customerSourceCode: 'TELEMARKETING',
      customerStatusId: 1,
      customerStatusCode: 'ACTIVE',
      industryId: 4,
      industryCode: 'ELECTRONICS',
      customerSourceName: '电话营销',
      customerCategoryName: '个体户',
      customerStatusName: 'active',
      industryName: '电子制造'
    },
    {
      id: 5,
      createTime: '2024-01-01 10:00:00',
      updateTime: '2024-01-01 10:00:00',
      customerCode: 'C005',
      customerName: '惠州化工园区',
      contactPerson: '陈主管',
      contactPhone: '13800138005',
      customerAddress: '惠州市大亚湾石化区',
      customerCategoryId: 2,
      customerCategoryCode: 'CHANNEL',
      customerSourceId: 5,
      customerSourceCode: 'EXHIBITION',
      customerStatusId: 3,
      customerStatusCode: 'PUBLIC',
      industryId: 5,
      industryCode: 'CHEMICAL',
      customerSourceName: '展会',
      customerCategoryName: '渠道',
      customerStatusName: 'public',
      industryName: '化工'
    }
  ]
}

/**
 * 对外暴露的 open 方法
 */
const open = async () => {
  try {
    visible.value = true
    loading.value = true
    customers.value = await fetchCustomers()
  } catch (error) {
    console.error('获取客户数据失败:', error)
    customers.value = []
  } finally {
    loading.value = false
  }
}

/**
 * 关闭弹窗
 */
const close = () => {
  visible.value = false
  loading.value = false
  customers.value = []
}

/**
 * 处理客户选择
 * @param customer 客户信息
 */
function handleSelect(customer: SalesCustomer) {
  emit('select', customer)
  close()
}

// 对外暴露方法
defineExpose({ open })
</script>

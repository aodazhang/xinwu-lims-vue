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
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        @click.self="close"
      >
        <div
          class="max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl"
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
                <div class="font-medium text-gray-800">{{ customer.name }}</div>
                <div class="text-xs text-gray-500">
                  联系人：{{ customer.contactName }} | 电话：{{
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
      id: '1',
      name: '广州环保科技有限公司',
      contactName: '王经理',
      contactPhone: '13800138001',
      address: '广州市天河区科技园',
      category: '个体户',
      source: '网络推广',
      status: 'active'
    },
    {
      id: '2',
      name: '深圳创新工业园',
      contactName: '李主任',
      contactPhone: '13800138002',
      address: '深圳市南山区科技园B区',
      category: '渠道',
      source: '渠道',
      status: 'active'
    },
    {
      id: '3',
      name: '佛山制造企业',
      contactName: '张总',
      contactPhone: '13800138003',
      address: '佛山市顺德区工业园',
      category: '个体户',
      source: '转介绍',
      status: 'following'
    },
    {
      id: '4',
      name: '东莞电子厂',
      contactName: '刘经理',
      contactPhone: '13800138004',
      address: '东莞市松山湖高新区',
      category: '个体户',
      source: '电话营销',
      status: 'active'
    },
    {
      id: '5',
      name: '惠州化工园区',
      contactName: '陈主管',
      contactPhone: '13800138005',
      address: '惠州市大亚湾石化区',
      category: '渠道',
      source: '展会',
      status: 'public'
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

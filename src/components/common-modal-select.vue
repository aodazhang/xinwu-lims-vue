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
                <div class="text-xs text-gray-500">{{ customer.contact }}</div>
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

interface Customer {
  id: number
  name: string
  contact: string
}

const emit = defineEmits<{ select: [customer: Customer] }>()

// 内部维护的状态
const visible = ref(false)
const customers = ref<Customer[]>([])
const loading = ref(false)

/**
 * 模拟获取客户数据的API请求
 */
const fetchCustomers = async (): Promise<Customer[]> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 1000))

  // 模拟返回客户数据
  return [
    {
      id: 1,
      name: '广州环保科技有限公司',
      contact: '联系人：王经理 | 电话：13800138001'
    },
    {
      id: 2,
      name: '深圳创新工业园',
      contact: '联系人：李主任 | 电话：13800138002'
    },
    {
      id: 3,
      name: '佛山制造企业',
      contact: '联系人：张总 | 电话：13800138003'
    },
    {
      id: 4,
      name: '东莞电子厂',
      contact: '联系人：刘经理 | 电话：13800138004'
    },
    {
      id: 5,
      name: '惠州化工园区',
      contact: '联系人：陈主管 | 电话：13800138005'
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
function handleSelect(customer: Customer) {
  emit('select', customer)
  close()
}

// 对外暴露方法
defineExpose({ open })
</script>

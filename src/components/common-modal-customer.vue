<template>
  <!-- [公共]弹窗-创建、编辑客户 -->
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
        @click="close"
      >
        <div
          class="max-h-[90vh] w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl transition-all duration-300"
          @click.stop
        >
          <!-- 弹窗头部 -->
          <div
            class="flex items-center justify-between bg-gradient-to-r from-indigo-500 to-purple-600 p-5 text-white"
          >
            <h3 class="text-lg font-semibold">客户信息</h3>
            <button
              class="flex h-8 w-8 items-center justify-center rounded-md bg-white bg-opacity-20 text-xl transition-colors duration-200 hover:bg-opacity-30"
              @click="close"
            >
              ×
            </button>
          </div>

          <!-- 弹窗内容 -->
          <div class="max-h-[calc(90vh-300px)] overflow-y-auto p-6">
            <form @submit.prevent="createCustomer">
              <div class="space-y-6 pb-4">
                <!-- 客户名称 -->
                <div class="relative flex flex-col gap-1">
                  <label class="text-sm font-medium text-gray-700">
                    客户名称 <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="customerForm.customerName"
                    type="text"
                    :class="[
                      'w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2',
                      formErrors.customerName
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                        : 'border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-indigo-100'
                    ]"
                    placeholder="请输入客户名称"
                  />
                  <div
                    v-if="formErrors.customerName"
                    class="absolute -bottom-5 left-0 text-xs text-red-500"
                  >
                    {{ formErrors.customerName }}
                  </div>
                </div>

                <!-- 客户联系人 -->
                <div class="relative flex flex-col gap-1">
                  <label class="text-sm font-medium text-gray-700">
                    客户联系人 <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="customerForm.contactName"
                    type="text"
                    :class="[
                      'w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2',
                      formErrors.contactName
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                        : 'border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-indigo-100'
                    ]"
                    placeholder="请输入联系人姓名"
                  />
                  <div
                    v-if="formErrors.contactName"
                    class="absolute -bottom-5 left-0 text-xs text-red-500"
                  >
                    {{ formErrors.contactName }}
                  </div>
                </div>

                <!-- 客户联系电话 -->
                <div class="relative flex flex-col gap-1">
                  <label class="text-sm font-medium text-gray-700">
                    客户联系电话 <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="customerForm.contactPhone"
                    type="tel"
                    :class="[
                      'w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2',
                      formErrors.contactPhone
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                        : 'border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-indigo-100'
                    ]"
                    placeholder="请输入联系电话"
                  />
                  <div
                    v-if="formErrors.contactPhone"
                    class="absolute -bottom-5 left-0 text-xs text-red-500"
                  >
                    {{ formErrors.contactPhone }}
                  </div>
                </div>

                <!-- 客户地址 -->
                <div class="flex flex-col gap-1">
                  <label class="text-sm font-medium text-gray-700"
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
                <div class="relative flex flex-col gap-1">
                  <label class="text-sm font-medium text-gray-700">
                    客户分类 <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="customerForm.category"
                    :class="[
                      'w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2',
                      formErrors.category
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                        : 'border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-indigo-100'
                    ]"
                  >
                    <option value="">请选择</option>
                    <option value="individual">个体户</option>
                    <option value="channel">渠道</option>
                  </select>
                  <div
                    v-if="formErrors.category"
                    class="absolute -bottom-5 left-0 text-xs text-red-500"
                  >
                    {{ formErrors.category }}
                  </div>
                </div>

                <!-- 客户来源 -->
                <div class="relative flex flex-col gap-1">
                  <label class="text-sm font-medium text-gray-700">
                    客户来源 <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="customerForm.source"
                    :class="[
                      'w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2',
                      formErrors.source
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                        : 'border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-indigo-100'
                    ]"
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
                  <div
                    v-if="formErrors.source"
                    class="absolute -bottom-5 left-0 text-xs text-red-500"
                  >
                    {{ formErrors.source }}
                  </div>
                </div>

                <!-- 客户状态 -->
                <div class="relative flex flex-col gap-1">
                  <label class="text-sm font-medium text-gray-700">
                    客户状态 <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="customerForm.status"
                    :class="[
                      'w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2',
                      formErrors.status
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                        : 'border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-indigo-100'
                    ]"
                  >
                    <option value="">请选择</option>
                    <option value="active">已成交</option>
                    <option value="public">公海</option>
                    <option value="following">跟进中</option>
                  </select>
                  <div
                    v-if="formErrors.status"
                    class="absolute -bottom-5 left-0 text-xs text-red-500"
                  >
                    {{ formErrors.status }}
                  </div>
                </div>

                <!-- 所属行业 -->
                <div class="flex flex-col gap-1">
                  <label class="text-sm font-medium text-gray-700"
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
              @click="close"
            >
              取消
            </button>
            <button
              type="button"
              :disabled="!isFormValid || isSubmitting"
              :class="[
                'rounded-lg px-6 py-2 text-sm font-medium text-white transition-all duration-200',
                !isFormValid || isSubmitting
                  ? 'cursor-not-allowed bg-gray-400'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:-translate-y-0.5 hover:shadow-lg'
              ]"
              @click="createCustomer"
            >
              {{ isSubmitting ? '提交中...' : '确认提交' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'

// 定义接口
interface CustomerForm {
  customerName: string
  contactName: string
  contactPhone: string
  address: string
  category: string
  source: string
  status: string
  industry: string
}

interface Customer {
  customerId: string
  customerName: string
  contactName: string
  contactPhone: string
  source: string
  status: string
}

interface FormErrors {
  customerName: string
  contactName: string
  contactPhone: string
  category: string
  source: string
  status: string
}

// 定义 emits
const emit = defineEmits<{ refresh: [] }>()

// 内部维护的状态
const visible = ref(false)
const isSubmitting = ref(false)

// 客户表单数据
const customerForm = reactive<CustomerForm>({
  customerName: '',
  contactName: '',
  contactPhone: '',
  address: '',
  category: '',
  source: '',
  status: '',
  industry: ''
})

// 表单错误信息
const formErrors = reactive<FormErrors>({
  customerName: '',
  contactName: '',
  contactPhone: '',
  category: '',
  source: '',
  status: ''
})

// 表单是否有效
const isFormValid = computed(() => {
  return !Object.values(formErrors).some(error => error !== '')
})

/**
 * 校验客户名称
 */
function validateCustomerName() {
  if (!customerForm.customerName.trim()) {
    formErrors.customerName = '请输入客户名称'
  } else if (customerForm.customerName.trim().length < 2) {
    formErrors.customerName = '客户名称至少需要2个字符'
  } else if (customerForm.customerName.trim().length > 50) {
    formErrors.customerName = '客户名称不能超过50个字符'
  } else {
    formErrors.customerName = ''
  }
}

/**
 * 校验联系人姓名
 */
function validateContactName() {
  if (!customerForm.contactName.trim()) {
    formErrors.contactName = '请输入联系人姓名'
  } else if (customerForm.contactName.trim().length < 2) {
    formErrors.contactName = '联系人姓名至少需要2个字符'
  } else if (customerForm.contactName.trim().length > 20) {
    formErrors.contactName = '联系人姓名不能超过20个字符'
  } else {
    formErrors.contactName = ''
  }
}

/**
 * 校验联系电话
 */
function validateContactPhone() {
  const phoneRegex = /^1[3-9]\d{9}$|^0\d{2,3}-?\d{7,8}$|^400-?\d{3}-?\d{4}$/
  if (!customerForm.contactPhone.trim()) {
    formErrors.contactPhone = '请输入联系电话'
  } else if (!phoneRegex.test(customerForm.contactPhone.trim())) {
    formErrors.contactPhone = '请输入正确的手机号码或固定电话'
  } else {
    formErrors.contactPhone = ''
  }
}

/**
 * 校验客户分类
 */
function validateCategory() {
  if (!customerForm.category) {
    formErrors.category = '请选择客户分类'
  } else {
    formErrors.category = ''
  }
}

/**
 * 校验客户来源
 */
function validateSource() {
  if (!customerForm.source) {
    formErrors.source = '请选择客户来源'
  } else {
    formErrors.source = ''
  }
}

/**
 * 校验客户状态
 */
function validateStatus() {
  if (!customerForm.status) {
    formErrors.status = '请选择客户状态'
  } else {
    formErrors.status = ''
  }
}

/**
 * 校验所有表单字段
 */
function validateForm() {
  validateCustomerName()
  validateContactName()
  validateContactPhone()
  validateCategory()
  validateSource()
  validateStatus()
}

// 监听表单字段变化，实时校验
watch(() => customerForm.customerName, validateCustomerName)
watch(() => customerForm.contactName, validateContactName)
watch(() => customerForm.contactPhone, validateContactPhone)
watch(() => customerForm.category, validateCategory)
watch(() => customerForm.source, validateSource)
watch(() => customerForm.status, validateStatus)

/**
 * 生成客户编号
 * @returns 客户编号
 */
const generateCustomerId = (): string => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const sequence = String(Date.now() % 10000).padStart(4, '0')
  return `KH${year}${month}${day}${sequence}`
}

/**
 * 重置表单数据
 */
const resetForm = (): void => {
  Object.assign(customerForm, {
    customerName: '',
    contactName: '',
    contactPhone: '',
    address: '',
    category: '',
    source: '',
    status: '',
    industry: ''
  })

  // 清空错误信息
  Object.assign(formErrors, {
    customerName: '',
    contactName: '',
    contactPhone: '',
    category: '',
    source: '',
    status: ''
  })
}

/**
 * 对外暴露的 open 方法
 * @param data 可选的初始数据
 */
const open = (data?: Partial<CustomerForm>): void => {
  visible.value = true
  resetForm()
  // 如果有初始数据，设置到表单中，否则重置表单
  Object.assign(customerForm, {
    customerName: data?.customerName || '',
    contactName: data?.contactName || '',
    contactPhone: data?.contactPhone || '',
    address: data?.address || '',
    category: data?.category || '',
    source: data?.source || '',
    status: data?.status || '',
    industry: data?.industry || ''
  })
}

/**
 * 关闭弹窗
 */
const close = (): void => {
  visible.value = false
  resetForm()
}

/**
 * 创建客户
 */
const createCustomer = async (): Promise<void> => {
  // 防止重复提交
  if (isSubmitting.value) return

  // 校验表单
  validateForm()

  // 如果表单无效，不提交
  if (!isFormValid.value) {
    return
  }

  isSubmitting.value = true

  try {
    const newCustomer: Customer = {
      customerId: generateCustomerId(),
      customerName: customerForm.customerName.trim(),
      contactName: customerForm.contactName.trim(),
      contactPhone: customerForm.contactPhone.trim(),
      source: customerForm.source,
      status: customerForm.status
    }

    console.log('创建客户:', newCustomer)

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    // 显示成功提示
    alert(`客户创建成功！客户编号：${newCustomer.customerId}`)

    // 触发刷新事件
    emit('refresh')

    // 关闭弹窗
    close()
  } catch (error) {
    console.error('创建客户失败:', error)
    alert('创建客户失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}

// 对外暴露方法
defineExpose({ open, close })
</script>

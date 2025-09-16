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
                  v-model="customerForm.contactPerson"
                  type="text"
                  :class="[
                    'w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2',
                    formErrors.contactPerson
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-indigo-100'
                  ]"
                  placeholder="请输入联系人姓名"
                />
                <div
                  v-if="formErrors.contactPerson"
                  class="absolute -bottom-5 left-0 text-xs text-red-500"
                >
                  {{ formErrors.contactPerson }}
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
                  v-model="customerForm.customerAddress"
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
                  v-model="customerForm.customerCategoryId"
                  :class="[
                    'w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2',
                    formErrors.customerCategoryName
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-indigo-100'
                  ]"
                >
                  <option value="0" disabled>请选择客户分类</option>
                  <option
                    v-for="item in customerCategoryList"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ item.dicValue }}
                  </option>
                </select>
                <div
                  v-if="formErrors.customerCategoryName"
                  class="absolute -bottom-5 left-0 text-xs text-red-500"
                >
                  {{ formErrors.customerCategoryName }}
                </div>
              </div>

              <!-- 客户来源 -->
              <div class="relative flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700">
                  客户来源 <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="customerForm.customerSourceId"
                  :class="[
                    'w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2',
                    formErrors.customerSourceName
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-indigo-100'
                  ]"
                >
                  <option value="0" disabled>请选择客户来源</option>
                  <option
                    v-for="item in customerSourceList"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ item.dicValue }}
                  </option>
                </select>
                <div
                  v-if="formErrors.customerSourceName"
                  class="absolute -bottom-5 left-0 text-xs text-red-500"
                >
                  {{ formErrors.customerSourceName }}
                </div>
              </div>

              <!-- 客户状态 -->
              <div class="relative flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700">
                  客户状态 <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="customerForm.customerStatusId"
                  :class="[
                    'w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2',
                    formErrors.customerStatusName
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-indigo-100'
                  ]"
                >
                  <option value="0" disabled>请选择客户状态</option>
                  <option
                    v-for="item in customerStatusList"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ item.dicValue }}
                  </option>
                </select>
                <div
                  v-if="formErrors.customerStatusName"
                  class="absolute -bottom-5 left-0 text-xs text-red-500"
                >
                  {{ formErrors.customerStatusName }}
                </div>
              </div>

              <!-- 所属行业 -->
              <div class="flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700">
                  所属行业
                </label>
                <select
                  v-model="customerForm.industryId"
                  class="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="0" disabled>请选择所属行业</option>
                  <option
                    v-for="item in industryList"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ item.dicValue }}
                  </option>
                </select>
              </div>
            </div>
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
              @click="loadDataSubmit"
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
import { ref, watch, computed } from 'vue'
import { DictType } from '@/utils/enum'
import { isArray } from '@/utils/is'
import api from '@/api'

// 使用工具类型从 SalesCustomer 中提取 FormErrors 类型
type FormErrors = Pick<
  SalesCustomer,
  | 'customerName'
  | 'contactPerson'
  | 'contactPhone'
  | 'customerCategoryName'
  | 'customerSourceName'
  | 'customerStatusName'
>

// 定义 emits
const emit = defineEmits<{ refresh: [] }>()

// 内部维护的状态
const visible = ref(false)
const isSubmitting = ref(false)
const customerCategoryList = ref<SystemDict[]>([])
const customerSourceList = ref<SystemDict[]>([])
const customerStatusList = ref<SystemDict[]>([])
const industryList = ref<SystemDict[]>([])

// 客户表单数据
const customerForm = ref<
  Pick<
    SalesCustomer,
    | 'id'
    | 'customerName'
    | 'contactPerson'
    | 'contactPhone'
    | 'customerAddress'
    | 'customerCategoryId'
    | 'customerSourceId'
    | 'customerStatusId'
    | 'industryId'
  >
>({
  id: 0,
  customerName: '',
  contactPerson: '',
  contactPhone: '',
  customerAddress: '',
  customerCategoryId: 0,
  customerSourceId: 0,
  customerStatusId: 0,
  industryId: 0
})

// 表单错误信息
const formErrors = ref<FormErrors>({
  customerName: '',
  contactPerson: '',
  contactPhone: '',
  customerCategoryName: '',
  customerSourceName: '',
  customerStatusName: ''
})

// 表单是否有效
const isFormValid = computed(() => {
  return !Object.values(formErrors.value).some(error => error !== '')
})

/**
 * 校验客户名称
 */
function validateCustomerName() {
  if (!customerForm.value.customerName.trim()) {
    formErrors.value.customerName = '请输入客户名称'
  } else if (customerForm.value.customerName.trim().length < 2) {
    formErrors.value.customerName = '客户名称至少需要2个字符'
  } else if (customerForm.value.customerName.trim().length > 50) {
    formErrors.value.customerName = '客户名称不能超过50个字符'
  } else {
    formErrors.value.customerName = ''
  }
}

/**
 * 校验联系人姓名
 */
function validateContactPerson() {
  if (!customerForm.value.contactPerson.trim()) {
    formErrors.value.contactPerson = '请输入联系人姓名'
  } else if (customerForm.value.contactPerson.trim().length < 2) {
    formErrors.value.contactPerson = '联系人姓名至少需要2个字符'
  } else if (customerForm.value.contactPerson.trim().length > 20) {
    formErrors.value.contactPerson = '联系人姓名不能超过20个字符'
  } else {
    formErrors.value.contactPerson = ''
  }
}

/**
 * 校验联系电话
 */
function validateContactPhone() {
  const phoneRegex = /^1[3-9]\d{9}$|^0\d{2,3}-?\d{7,8}$|^400-?\d{3}-?\d{4}$/
  if (!customerForm.value.contactPhone.trim()) {
    formErrors.value.contactPhone = '请输入联系电话'
  } else if (!phoneRegex.test(customerForm.value.contactPhone.trim())) {
    formErrors.value.contactPhone = '请输入正确的联系电话格式'
  } else {
    formErrors.value.contactPhone = ''
  }
}

/**
 * 校验客户分类
 */
function validateCustomerCategoryId() {
  if (!customerForm.value.customerCategoryId) {
    formErrors.value.customerCategoryName = '请选择客户分类'
  } else {
    formErrors.value.customerCategoryName = ''
  }
}

/**
 * 校验客户来源
 */
function validateCustomerSourceId() {
  if (!customerForm.value.customerSourceId) {
    formErrors.value.customerSourceName = '请选择客户来源'
  } else {
    formErrors.value.customerSourceName = ''
  }
}

/**
 * 校验客户状态
 */
function validateCustomerStatusId() {
  if (!customerForm.value.customerStatusId) {
    formErrors.value.customerStatusName = '请选择客户状态'
  } else {
    formErrors.value.customerStatusName = ''
  }
}

/**
 * 校验所有表单字段
 */
function validateForm() {
  validateCustomerName()
  validateContactPerson()
  validateContactPhone()
  validateCustomerCategoryId()
  validateCustomerSourceId()
  validateCustomerStatusId()
}

// 监听表单字段变化，实时校验
watch(() => customerForm.value.customerName, validateCustomerName)
watch(() => customerForm.value.contactPerson, validateContactPerson)
watch(() => customerForm.value.contactPhone, validateContactPhone)
watch(() => customerForm.value.customerCategoryId, validateCustomerCategoryId)
watch(() => customerForm.value.customerSourceId, validateCustomerSourceId)
watch(() => customerForm.value.customerStatusId, validateCustomerStatusId)

/**
 * 重置表单数据
 */
const resetForm = (): void => {
  Object.assign(customerForm.value, {
    id: 0,
    customerName: '',
    contactPerson: '',
    contactPhone: '',
    customerAddress: '',
    customerCategoryId: 0,
    customerSourceId: 0,
    customerStatusId: 0,
    industryId: 0
  })

  // 清空错误信息
  Object.assign(formErrors.value, {
    customerName: '',
    contactPerson: '',
    contactPhone: '',
    customerCategoryName: '',
    customerSourceName: '',
    customerStatusName: ''
  })
}

/**
 * 对外暴露的 open 方法
 * @param data 可选的初始数据
 */
const open = async (data?: SalesCustomer): Promise<void> => {
  visible.value = true
  customerCategoryList.value = []
  customerSourceList.value = []
  customerStatusList.value = []
  industryList.value = []
  resetForm()

  // 如果有初始数据，设置到表单中，否则重置表单
  if (data) {
    Object.assign(customerForm.value, {
      id: data.id || 0,
      customerName: data.customerName || '',
      contactPerson: data.contactPerson || '',
      contactPhone: data.contactPhone || '',
      customerAddress: data.customerAddress || '',
      customerCategoryId: data.customerCategoryId || 0,
      customerSourceId: data.customerSourceId || 0,
      customerStatusId: data.customerStatusId || 0,
      industryId: data.industryId || 0
    })
  }

  const [res1, res2, res3, res4] = await Promise.all([
    api.loadDictionaries({ dicTypeCode: DictType.CUSTOMER_CATEGORY }),
    api.loadDictionaries({ dicTypeCode: DictType.CUSTOMER_SOURCE }),
    api.loadDictionaries({ dicTypeCode: DictType.CUSTOMER_STATUS }),
    api.loadDictionaries({ dicTypeCode: DictType.INDUSTRY })
  ])
  customerCategoryList.value = isArray(res1) ? res1 : []
  customerSourceList.value = isArray(res2) ? res2 : []
  customerStatusList.value = isArray(res3) ? res3 : []
  industryList.value = isArray(res4) ? res4 : []
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
const loadDataSubmit = async (): Promise<void> => {
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
    const data = {
      customerName: customerForm.value.customerName.trim() || '',
      contactPerson: customerForm.value.contactPerson.trim() || '',
      contactPhone: customerForm.value.contactPhone.trim() || '',
      customerAddress: customerForm.value.customerAddress.trim() || '',
      customerCategoryId: customerForm.value.customerCategoryId || null,
      customerSourceId: customerForm.value.customerSourceId || null,
      customerStatusId: customerForm.value.customerStatusId || null,
      industryId: customerForm.value.industryId || null
    }
    if (customerForm.value.id) {
      await api.loadCustomersEdit(customerForm.value.id, data)
    } else {
      await api.loadCustomersAdd(data)
    }

    // 触发刷新事件
    emit('refresh')

    // 关闭弹窗
    close()
  } catch (error) {
    console.error('创建客户失败:', error)
  } finally {
    isSubmitting.value = false
  }
}

// 对外暴露方法
defineExpose({ open, close })
</script>

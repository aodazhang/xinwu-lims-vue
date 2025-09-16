<template>
  <div>
    <!-- 页面头部 -->
    <common-title title="销售订单" content="销售工作台 / 销售订单" />

    <!-- 表单容器 -->
    <div class="mt-5 rounded-xl bg-white p-8 shadow-sm">
      <form @submit.prevent="handleSubmit" novalidate>
        <!-- 基本信息 -->
        <common-form-section title="基本信息">
          <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div class="relative flex flex-col">
              <label
                class="mb-2 text-sm font-medium text-gray-700 after:text-red-500 after:content-['_*']"
                >订单类型</label
              >
              <select
                v-model="formData.orderType"
                :class="[
                  'rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100',
                  {
                    'border-red-300 focus:border-red-500 focus:ring-red-100':
                      errors.orderType
                  }
                ]"
                @blur="validateField('orderType')"
              >
                <option value="">请选择</option>
                <option value="sampling">委托检测（采样）</option>
                <option value="delivery">委托检测（送样）</option>
              </select>
              <span
                v-if="errors.orderType"
                class="absolute -bottom-5 left-0 text-xs text-red-500"
                >{{ errors.orderType }}</span
              >
            </div>
            <div class="flex flex-col">
              <label class="mb-2 text-sm font-medium text-gray-700"
                >是否加急</label
              >
              <div class="flex gap-5 py-2.5">
                <label class="flex cursor-pointer items-center">
                  <input
                    v-model="formData.urgent"
                    type="radio"
                    value="yes"
                    class="mr-2 text-indigo-500"
                  />
                  <span class="text-sm text-gray-700">是</span>
                </label>
                <label class="flex cursor-pointer items-center">
                  <input
                    v-model="formData.urgent"
                    type="radio"
                    value="no"
                    class="mr-2 text-indigo-500"
                  />
                  <span class="text-sm text-gray-700">否</span>
                </label>
              </div>
            </div>
          </div>
        </common-form-section>

        <!-- 客户信息 -->
        <common-form-section title="客户信息">
          <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div class="relative flex flex-col">
              <label
                class="mb-2 text-sm font-medium text-gray-700 after:text-red-500 after:content-['_*']"
                >客户</label
              >
              <div class="flex gap-3">
                <input
                  v-model="formData.customerName"
                  type="text"
                  placeholder="点击选择客户"
                  readonly
                  :class="[
                    'flex-1 cursor-pointer rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100',
                    {
                      'border-red-300 focus:border-red-500 focus:ring-red-100':
                        errors.customerName
                    }
                  ]"
                  @click="openCustomerModal"
                  @blur="validateField('customerName')"
                />
                <button
                  type="button"
                  class="flex-shrink-0 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 transition-all hover:bg-gray-50"
                  @click="openCustomerModal"
                >
                  选择
                </button>
              </div>
              <span
                v-if="errors.customerName"
                class="absolute -bottom-5 left-0 text-xs text-red-500"
                >{{ errors.customerName }}</span
              >
            </div>
            <div class="relative flex flex-col">
              <label
                class="mb-2 text-sm font-medium text-gray-700 after:text-red-500 after:content-['_*']"
                >受检单位</label
              >
              <input
                v-model="formData.inspectionUnit"
                type="text"
                placeholder="请输入受检单位"
                :class="[
                  'rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100',
                  {
                    'border-red-300 focus:border-red-500 focus:ring-red-100':
                      errors.inspectionUnit
                  }
                ]"
                @blur="validateField('inspectionUnit')"
              />
              <span
                v-if="errors.inspectionUnit"
                class="absolute -bottom-5 left-0 text-xs text-red-500"
                >{{ errors.inspectionUnit }}</span
              >
            </div>
          </div>
        </common-form-section>

        <!-- 检测信息 -->
        <common-form-section title="检测信息">
          <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div class="relative flex flex-col">
              <label
                class="mb-2 text-sm font-medium text-gray-700 after:text-red-500 after:content-['_*']"
                >采样地址</label
              >
              <input
                v-model="formData.samplingAddress"
                type="text"
                placeholder="请输入采样地址"
                :class="[
                  'rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100',
                  {
                    'border-red-300 focus:border-red-500 focus:ring-red-100':
                      errors.samplingAddress
                  }
                ]"
                @blur="validateField('samplingAddress')"
              />
              <span
                v-if="errors.samplingAddress"
                class="absolute -bottom-5 left-0 text-xs text-red-500"
                >{{ errors.samplingAddress }}</span
              >
            </div>
            <div class="relative flex flex-col">
              <label
                class="mb-2 text-sm font-medium text-gray-700 after:text-red-500 after:content-['_*']"
                >检测类型</label
              >
              <select
                v-model="formData.testType"
                :class="[
                  'rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100',
                  {
                    'border-red-300 focus:border-red-500 focus:ring-red-100':
                      errors.testType
                  }
                ]"
                @change="updateTestItems"
                @blur="validateField('testType')"
              >
                <option value="">请选择</option>
                <option value="50325-2020">50325-2020</option>
                <option value="18883-2022">18883-2022</option>
              </select>
              <span
                v-if="errors.testType"
                class="absolute -bottom-5 left-0 text-xs text-red-500"
                >{{ errors.testType }}</span
              >
            </div>
          </div>
          <div class="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div class="relative flex flex-col">
              <label
                class="mb-2 text-sm font-medium text-gray-700 after:text-red-500 after:content-['_*']"
                >检测内容</label
              >
              <select
                v-model="formData.testContent"
                :disabled="!formData.testType"
                :class="[
                  'rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100',
                  {
                    'cursor-not-allowed bg-gray-50 opacity-70':
                      !formData.testType,
                    'border-red-300 focus:border-red-500 focus:ring-red-100':
                      errors.testContent
                  }
                ]"
                @blur="validateField('testContent')"
              >
                <option value="">
                  {{ formData.testType ? '请选择' : '请先选择检测类型' }}
                </option>
                <option
                  v-for="item in testContentOptions"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </option>
              </select>
              <div v-if="formData.testType" class="mt-1 text-xs text-gray-500">
                选择检测类型后自动更新可选项
              </div>
              <span
                v-if="errors.testContent"
                class="absolute -bottom-5 left-0 text-xs text-red-500"
                >{{ errors.testContent }}</span
              >
            </div>
            <div class="relative flex flex-col">
              <label
                class="mb-2 text-sm font-medium text-gray-700 after:text-red-500 after:content-['_*']"
                >服务类型</label
              >
              <select
                v-model="formData.serviceType"
                :class="[
                  'rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100',
                  {
                    'border-red-300 focus:border-red-500 focus:ring-red-100':
                      errors.serviceType
                  }
                ]"
                @blur="validateField('serviceType')"
              >
                <option value="">请选择</option>
                <option value="initial">初测</option>
                <option value="retest">复测</option>
                <option value="actual">实测</option>
                <option value="yl3">YL3</option>
                <option value="yl5">YL5</option>
                <option value="yl8">YL8</option>
              </select>
              <span
                v-if="errors.serviceType"
                class="absolute -bottom-5 left-0 text-xs text-red-500"
                >{{ errors.serviceType }}</span
              >
            </div>
          </div>
          <div class="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div class="relative flex flex-col">
              <label
                class="mb-2 text-sm font-medium text-gray-700 after:text-red-500 after:content-['_*']"
                >检测点数</label
              >
              <input
                v-model.number="formData.testPoints"
                type="number"
                placeholder="请输入检测点数"
                min="1"
                :class="[
                  'rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100',
                  {
                    'border-red-300 focus:border-red-500 focus:ring-red-100':
                      errors.testPoints
                  }
                ]"
                @blur="validateField('testPoints')"
              />
              <span
                v-if="errors.testPoints"
                class="absolute -bottom-5 left-0 text-xs text-red-500"
                >{{ errors.testPoints }}</span
              >
            </div>
          </div>
        </common-form-section>

        <!-- 财务信息 -->
        <common-form-section title="财务信息">
          <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div class="relative flex flex-col">
              <label
                class="mb-2 text-sm font-medium text-gray-700 after:text-red-500 after:content-['_*']"
                >项目金额</label
              >
              <input
                v-model.number="formData.projectAmount"
                type="number"
                placeholder="请输入项目金额"
                min="0"
                step="0.01"
                :class="[
                  'rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100',
                  {
                    'border-red-300 focus:border-red-500 focus:ring-red-100':
                      errors.projectAmount
                  }
                ]"
                @blur="validateField('projectAmount')"
              />
              <span
                v-if="errors.projectAmount"
                class="absolute -bottom-5 left-0 text-xs text-red-500"
                >{{ errors.projectAmount }}</span
              >
            </div>
            <div class="flex flex-col">
              <label class="mb-2 text-sm font-medium text-gray-700"
                >实收金额</label
              >
              <input
                v-model.number="formData.receivedAmount"
                type="number"
                placeholder="请输入实收金额"
                min="0"
                step="0.01"
                class="rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
        </common-form-section>

        <!-- 备注信息 -->
        <common-form-section title="备注信息">
          <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div class="flex flex-col md:col-span-2">
              <label class="mb-2 text-sm font-medium text-gray-700"
                >销售备注</label
              >
              <textarea
                v-model="formData.salesRemark"
                placeholder="请输入备注信息"
                rows="4"
                class="resize-y rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              ></textarea>
            </div>
          </div>
          <div class="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div class="flex flex-col md:col-span-2">
              <label class="mb-2 text-sm font-medium text-gray-700"
                >附件上传</label
              >
              <div
                class="relative cursor-pointer"
                @click="triggerFileInput"
                @drop.prevent="handleFileDrop"
                @dragover.prevent
              >
                <input
                  ref="fileInput"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  @change="handleFileChange"
                />
                <div
                  class="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 p-5 transition-all hover:border-indigo-500 hover:bg-gray-100"
                >
                  <div class="mb-2 text-2xl">📁</div>
                  <div class="text-center text-sm text-gray-600">
                    点击或拖拽文件到此处上传
                    <div class="mt-1 text-xs text-gray-500">
                      支持 PDF、Word、Excel、图片格式，单个文件不超过10MB
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="uploadedFiles.length > 0" class="mt-3 space-y-2">
                <div
                  v-for="(file, index) in uploadedFiles"
                  :key="index"
                  class="flex items-center justify-between rounded bg-gray-100 px-3 py-2 text-sm"
                >
                  <span class="flex-1 truncate">{{ file.name }}</span>
                  <button
                    type="button"
                    class="ml-2 cursor-pointer text-red-500 hover:text-red-700"
                    @click="removeFile(index)"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        </common-form-section>

        <!-- 按钮组 -->
        <div class="flex justify-end gap-3 pt-6">
          <button
            type="button"
            class="rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            @click="handleCancel"
            :disabled="loading"
          >
            取消
          </button>
          <button
            type="submit"
            class="flex items-center gap-2 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-400/40 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="loading"
          >
            <span
              v-if="loading"
              class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"
            ></span>
            {{
              loading ? '提交中...' : props.orderId ? '更新订单' : '提交订单'
            }}
          </button>
        </div>
      </form>
    </div>

    <!-- 客户选择弹窗 -->
    <common-modal-select ref="selectModalRef" @select="selectCustomer" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CommonTitle from '@/components/common-title.vue'
import CommonFormSection from '@/components/common-form-section.vue'
import CommonModalSelect from '@/components/common-modal-select.vue'

const props = defineProps<{ orderId?: string }>()

const router = useRouter()

// 表单验证错误
const errors = ref<Record<string, string>>({})

// 加载状态
const loading = ref(false)

// 表单验证规则
const validationRules: Record<
  string,
  {
    /** 是否必填 */
    required: boolean
    /** 验证失败消息 */
    message: string
    /** 最小值（用于数字类型） */
    min?: number
  }
> = {
  orderType: { required: true, message: '请选择订单类型' },
  customerName: { required: true, message: '请选择客户' },
  inspectionUnit: { required: true, message: '请输入受检单位' },
  samplingAddress: { required: true, message: '请输入采样地址' },
  testType: { required: true, message: '请选择检测类型' },
  testContent: { required: true, message: '请选择检测内容' },
  serviceType: { required: true, message: '请选择服务类型' },
  testPoints: { required: true, message: '请输入检测点数', min: 1 },
  projectAmount: { required: true, message: '请输入项目金额', min: 0 }
}

// 表单数据
const formData = ref<SalesOrder>({
  orderType: '',
  urgent: 'no',
  customerName: '',
  inspectionUnit: '',
  samplingAddress: '',
  testType: '',
  testContent: '',
  serviceType: '',
  testPoints: null as number | null,
  projectAmount: null as number | null,
  receivedAmount: null as number | null,
  salesRemark: ''
})

// 客户选择弹窗引用
const selectModalRef = ref<InstanceType<typeof CommonModalSelect>>()

// 文件上传
const fileInput = ref<HTMLInputElement>()
const uploadedFiles = ref<File[]>([])

// 检测内容选项
const testContentOptions = computed(() => {
  if (formData.value.testType === '50325-2020') {
    return [
      { value: 'formaldehyde', label: '甲醛' },
      { value: 'benzene', label: '苯' },
      { value: 'toluene', label: '甲苯' },
      { value: 'xylene', label: '二甲苯' },
      { value: 'tvoc', label: 'TVOC' },
      { value: 'ammonia', label: '氨' },
      { value: 'radon', label: '氡' }
    ]
  } else if (formData.value.testType === '18883-2022') {
    return [
      { value: 'formaldehyde', label: '甲醛' },
      { value: 'benzene', label: '苯' },
      { value: 'toluene', label: '甲苯' },
      { value: 'xylene', label: '二甲苯' },
      { value: 'tvoc', label: 'TVOC' },
      { value: 'pm25', label: 'PM2.5' },
      { value: 'pm10', label: 'PM10' }
    ]
  }
  return []
})

/**
 * 验证单个字段
 * @param field 字段名
 */
function validateField(field: string) {
  const rule = validationRules[field as keyof typeof validationRules]
  if (!rule) return

  const value = formData.value[field as keyof typeof formData.value]

  if (rule.required && (!value || value === '')) {
    errors.value[field] = rule.message
    return false
  }

  if (rule.min !== undefined && typeof value === 'number' && value < rule.min) {
    errors.value[field] = rule.message
    return false
  }

  delete errors.value[field]
  return true
}

/**
 * 验证所有字段
 */
function validateAllFields() {
  let isValid = true
  Object.keys(validationRules).forEach(field => {
    if (!validateField(field)) {
      isValid = false
    }
  })
  return isValid
}

/**
 * 打开客户选择弹窗
 */
function openCustomerModal() {
  selectModalRef.value?.open()
}

/**
 * 更新检测内容选项
 */
function updateTestItems() {
  formData.value.testContent = ''
  delete errors.value.testContent
}

/**
 * 选择客户
 * @param customer 客户信息
 */
function selectCustomer(customer: SalesCustomer) {
  formData.value.customerName = customer.customerName
  delete errors.value.customerName
}

/**
 * 触发文件选择
 */
function triggerFileInput() {
  fileInput.value?.click()
}

/**
 * 处理文件拖拽上传
 * @param event 拖拽事件
 */
function handleFileDrop(event: DragEvent) {
  const files = event.dataTransfer?.files
  if (files) {
    const validFiles = Array.from(files).filter(file => {
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        alert(`文件 ${file.name} 超过10MB限制`)
        return false
      }
      return true
    })
    uploadedFiles.value.push(...validFiles)
  }
}

/**
 * 处理文件上传
 * @param event 文件选择事件
 */
function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files) {
    const validFiles = Array.from(target.files).filter(file => {
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        alert(`文件 ${file.name} 超过10MB限制`)
        return false
      }
      return true
    })
    uploadedFiles.value.push(...validFiles)
  }
}

/**
 * 移除文件
 * @param index 文件索引
 */
function removeFile(index: number) {
  uploadedFiles.value.splice(index, 1)
}

/**
 * 初始化页面数据
 */
onMounted(() => {
  if (props.orderId) {
    loadOrderData(props.orderId)
  }
})

/**
 * 加载订单数据
 * @param id 订单ID
 */
function loadOrderData(id: string) {
  // TODO: 实现从API加载订单数据的逻辑
  console.log('加载订单数据:', id)
  // 模拟加载数据
  // formData.value = { ...loadedOrderData }
}

/**
 * 取消操作
 */
function handleCancel() {
  router.go(-1)
}

/**
 * 提交表单
 */
function handleSubmit() {
  if (!validateAllFields()) {
    console.log('表单验证失败:', errors.value)
    return
  }

  loading.value = true

  try {
    console.log(props.orderId ? '更新订单:' : '提交订单:', formData.value)
    console.log('上传文件:', uploadedFiles.value)

    // TODO: 实现订单提交/更新逻辑
    setTimeout(() => {
      const message = props.orderId ? '订单更新成功！' : '订单提交成功！'
      alert(message)
      router.go(-1)
      loading.value = false
    }, 1000)
  } catch (error) {
    console.error('提交失败:', error)
    loading.value = false
  }
}
</script>

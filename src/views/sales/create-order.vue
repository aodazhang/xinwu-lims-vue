<template>
  <div class="p-5">
    <!-- 页面头部 -->
    <common-title title="订单详情" content="销售工作台 / 订单详情" />

    <!-- 表单容器 -->
    <div class="mt-5 rounded-xl bg-white p-8 shadow-sm">
      <form @submit.prevent="handleSubmit">
        <!-- 基本信息 -->
        <common-form-section title="基本信息">
          <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div class="flex flex-col">
              <label class="mb-2 text-sm font-medium text-gray-700">
                订单类型 <span class="text-red-500">*</span>
              </label>
              <select
                v-model="formData.orderType"
                required
                class="rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">请选择</option>
                <option value="sampling">委托检测（采样）</option>
                <option value="delivery">委托检测（送样）</option>
              </select>
            </div>
            <div class="flex flex-col">
              <label class="mb-2 text-sm font-medium text-gray-700"
                >是否加急</label
              >
              <div class="flex gap-5 py-2.5">
                <label class="flex items-center">
                  <input
                    v-model="formData.urgent"
                    type="radio"
                    value="yes"
                    class="mr-2 text-indigo-500"
                  />
                  是
                </label>
                <label class="flex items-center">
                  <input
                    v-model="formData.urgent"
                    type="radio"
                    value="no"
                    class="mr-2 text-indigo-500"
                  />
                  否
                </label>
              </div>
            </div>
          </div>
        </common-form-section>

        <!-- 客户信息 -->
        <common-form-section title="客户信息">
          <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div class="flex flex-col">
              <label class="mb-2 text-sm font-medium text-gray-700">
                客户 <span class="text-red-500">*</span>
              </label>
              <div class="flex gap-2">
                <input
                  v-model="formData.customerName"
                  type="text"
                  placeholder="点击选择客户"
                  readonly
                  required
                  class="flex-1 cursor-pointer rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  @click="customerModalRef?.open()"
                />
                <button
                  type="button"
                  class="rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 transition-all hover:bg-gray-50"
                  @click="customerModalRef?.open()"
                >
                  选择
                </button>
              </div>
            </div>
            <div class="flex flex-col">
              <label class="mb-2 text-sm font-medium text-gray-700">
                受检单位 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.inspectionUnit"
                type="text"
                placeholder="请输入受检单位"
                required
                class="rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
        </common-form-section>

        <!-- 检测信息 -->
        <common-form-section title="检测信息">
          <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div class="flex flex-col">
              <label class="mb-2 text-sm font-medium text-gray-700">
                采样地址 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.samplingAddress"
                type="text"
                placeholder="请输入采样地址"
                required
                class="rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div class="flex flex-col">
              <label class="mb-2 text-sm font-medium text-gray-700">
                检测类型 <span class="text-red-500">*</span>
              </label>
              <select
                v-model="formData.testType"
                required
                class="rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                @change="updateTestItems"
              >
                <option value="">请选择</option>
                <option value="50325-2020">50325-2020</option>
                <option value="18883-2022">18883-2022</option>
              </select>
            </div>
          </div>
          <div class="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div class="flex flex-col">
              <label class="mb-2 text-sm font-medium text-gray-700">
                检测内容 <span class="text-red-500">*</span>
              </label>
              <select
                v-model="formData.testContent"
                required
                :disabled="!formData.testType"
                class="rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70"
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
            </div>
            <div class="flex flex-col">
              <label class="mb-2 text-sm font-medium text-gray-700">
                服务类型 <span class="text-red-500">*</span>
              </label>
              <select
                v-model="formData.serviceType"
                required
                class="rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">请选择</option>
                <option value="initial">初测</option>
                <option value="retest">复测</option>
                <option value="actual">实测</option>
                <option value="yl3">YL3</option>
                <option value="yl5">YL5</option>
                <option value="yl8">YL8</option>
              </select>
            </div>
          </div>
          <div class="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div class="flex flex-col">
              <label class="mb-2 text-sm font-medium text-gray-700">
                检测点数 <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="formData.testPoints"
                type="number"
                placeholder="请输入检测点数"
                min="1"
                required
                class="rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
        </common-form-section>

        <!-- 财务信息 -->
        <common-form-section title="财务信息">
          <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div class="flex flex-col">
              <label class="mb-2 text-sm font-medium text-gray-700">
                项目金额 <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="formData.projectAmount"
                type="number"
                placeholder="请输入项目金额"
                min="0"
                step="0.01"
                required
                class="rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
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
        <div class="mb-8">
          <h3
            class="mb-5 flex items-center text-lg font-semibold text-gray-800"
          >
            <div
              class="mr-3 h-5 w-1 rounded bg-gradient-to-b from-indigo-500 to-purple-600"
            ></div>
            备注信息
          </h3>
          <div class="grid grid-cols-1 gap-5">
            <div class="flex flex-col">
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
          <div class="mt-5 grid grid-cols-1 gap-5">
            <div class="flex flex-col">
              <label class="mb-2 text-sm font-medium text-gray-700"
                >附件上传</label
              >
              <div class="relative cursor-pointer">
                <input
                  ref="fileInput"
                  type="file"
                  multiple
                  class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  @change="handleFileChange"
                />
                <div
                  class="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 p-5 transition-all hover:border-indigo-500 hover:bg-gray-100"
                >
                  <div class="text-center text-sm text-gray-600">
                    点击或拖拽文件到此处上传<br />
                    <small class="text-xs text-gray-500"
                      >支持多个文件，单个文件不超过10MB</small
                    >
                  </div>
                </div>
              </div>
              <div v-if="uploadedFiles.length > 0" class="mt-2">
                <div
                  v-for="(file, index) in uploadedFiles"
                  :key="index"
                  class="flex items-center justify-between rounded bg-gray-100 px-3 py-2 text-sm"
                >
                  <span>{{ file.name }}</span>
                  <button
                    type="button"
                    class="text-red-500 hover:text-red-700"
                    @click="removeFile(index)"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 按钮组 -->
        <div class="flex justify-end gap-3 border-t border-gray-200 pt-6">
          <button
            type="button"
            class="rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
            @click="$router.push('/sales-dashboard')"
          >
            取消
          </button>
          <button
            type="submit"
            class="rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-400/40"
          >
            提交订单
          </button>
        </div>
      </form>
    </div>

    <!-- 客户选择弹窗 -->
    <common-customer-modal ref="customerModalRef" @select="selectCustomer" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CommonTitle from '@/components/common-title.vue'
import CommonFormSection from '@/components/common-form-section.vue'
import CommonCustomerModal from '@/components/common-customer-modal.vue'

const props = defineProps<{ orderId?: string }>()

const router = useRouter()

// 表单数据
const formData = ref({
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
const customerModalRef = ref<InstanceType<typeof CommonCustomerModal>>()

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
 * 更新检测内容选项
 */
function updateTestItems() {
  formData.value.testContent = ''
}

/**
 * 选择客户
 * @param customer 客户信息
 */
function selectCustomer(customer: {
  id: number
  name: string
  contact: string
}) {
  formData.value.customerName = customer.name
}

/**
 * 处理文件上传
 * @param event 文件选择事件
 */
function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files) {
    const newFiles = Array.from(target.files)
    uploadedFiles.value.push(...newFiles)
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
 * 提交表单
 */
function handleSubmit() {
  console.log(props.orderId ? '更新订单:' : '提交订单:', formData.value)
  console.log('上传文件:', uploadedFiles.value)
  // TODO: 实现订单提交/更新逻辑
  const message = props.orderId ? '订单更新成功！' : '订单提交成功！'
  alert(message)
  router.push('/sales-dashboard')
}
</script>

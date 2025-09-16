<template>
  <div>
    <!-- 页面头部 -->
    <common-title title="销售订单" content="销售工作台 / 销售订单" />

    <!-- 表单容器 -->
    <div class="mt-5 rounded-xl bg-white p-8 shadow-sm">
      <!-- 基本信息 -->
      <common-form-section title="基本信息">
        <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div class="relative flex flex-col">
            <label
              class="mb-2 text-sm font-medium text-gray-700 after:text-red-500 after:content-['_*']"
              >订单类型</label
            >
            <select
              v-model="formData.orderTypeId"
              :class="[
                'rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100',
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-100':
                    errors.orderTypeName
                }
              ]"
              @change="handleOrderTypeChange"
              @blur="validateOrderTypeId"
            >
              <option value="">请选择</option>
              <option value="sampling">委托检测（采样）</option>
              <option value="delivery">委托检测（送样）</option>
            </select>
            <span
              v-if="errors.orderTypeName"
              class="absolute -bottom-5 left-0 text-xs text-red-500"
              >{{ errors.orderTypeName }}</span
            >
          </div>
          <div class="flex flex-col">
            <label class="mb-2 text-sm font-medium text-gray-700"
              >是否加急</label
            >
            <div class="flex gap-5 py-2.5">
              <label class="flex cursor-pointer items-center">
                <input
                  v-model="formData.urgentFlag"
                  type="radio"
                  :value="true"
                  class="mr-2 text-indigo-500"
                />
                <span class="text-sm text-gray-700">是</span>
              </label>
              <label class="flex cursor-pointer items-center">
                <input
                  v-model="formData.urgentFlag"
                  type="radio"
                  :value="false"
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
            >
              客户
            </label>
            <div class="flex gap-3">
              <input
                v-model="formData.customerId"
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
                @click=""
              />
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
              v-model="formData.inspectedUnit"
              type="text"
              placeholder="请输入受检单位"
              :class="[
                'rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100',
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-100':
                    errors.inspectedUnit
                }
              ]"
              @blur="validateInspectedUnit"
            />
            <span
              v-if="errors.inspectedUnit"
              class="absolute -bottom-5 left-0 text-xs text-red-500"
              >{{ errors.inspectedUnit }}</span
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
              @blur="validateSamplingAddress"
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
              v-model="formData.detectionTypeId"
              :class="[
                'rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100',
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-100':
                    errors.detectionTypeName
                }
              ]"
              @change="handleDetectionTypeChange"
              @blur="validateDetectionTypeId"
            >
              <option value="">请选择</option>
              <option value="50325-2020">50325-2020</option>
              <option value="18883-2022">18883-2022</option>
            </select>
            <span
              v-if="errors.detectionTypeName"
              class="absolute -bottom-5 left-0 text-xs text-red-500"
              >{{ errors.detectionTypeName }}</span
            >
          </div>
        </div>
        <div class="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <!-- <div class="relative flex flex-col">
              <label
                class="mb-2 text-sm font-medium text-gray-700 after:text-red-500 after:content-['_*']"
                >检测内容</label
              >
              <select
                v-model="formData.detectionContent"
                :disabled="!formData.detectionTypeName"
                :class="[
                  'rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100',
                  {
                    'cursor-not-allowed bg-gray-50 opacity-70':
                      !formData.detectionTypeName,
                    'border-red-300 focus:border-red-500 focus:ring-red-100':
                      errors.detectionContent
                  }
                ]"
                @blur="validateDetectionContent"
              >
                <option value="">
                  {{
                    formData.detectionTypeName ? '请选择' : '请先选择检测类型'
                  }}
                </option>
                <option
                  v-for="item in testContentOptions"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </option>
              </select>
              <div
                v-if="formData.detectionTypeName"
                class="mt-1 text-xs text-gray-500"
              >
                选择检测类型后自动更新可选项
              </div>
              <span
                v-if="errors.detectionContent"
                class="absolute -bottom-5 left-0 text-xs text-red-500"
                >{{ errors.detectionContent }}</span
              >
            </div> -->
          <div class="relative flex flex-col">
            <label
              class="mb-2 text-sm font-medium text-gray-700 after:text-red-500 after:content-['_*']"
              >服务类型</label
            >
            <select
              v-model="formData.serviceTypeId"
              :class="[
                'rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100',
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-100':
                    errors.serviceTypeName
                }
              ]"
              @change="handleServiceTypeChange"
              @blur="validateServiceTypeId"
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
              v-if="errors.serviceTypeName"
              class="absolute -bottom-5 left-0 text-xs text-red-500"
              >{{ errors.serviceTypeName }}</span
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
              v-model.number="formData.detectionPoints"
              type="number"
              placeholder="请输入检测点数"
              min="1"
              :class="[
                'rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100',
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-100':
                    errors.detectionPointsName
                }
              ]"
              @blur="validateDetectionPoints"
            />
            <span
              v-if="errors.detectionPointsName"
              class="absolute -bottom-5 left-0 text-xs text-red-500"
              >{{ errors.detectionPointsName }}</span
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
                    errors.projectAmountName
                }
              ]"
              @blur="validateProjectAmount"
            />
            <span
              v-if="errors.projectAmountName"
              class="absolute -bottom-5 left-0 text-xs text-red-500"
              >{{ errors.projectAmountName }}</span
            >
          </div>
          <div class="flex flex-col">
            <label class="mb-2 text-sm font-medium text-gray-700"
              >实收金额</label
            >
            <input
              v-model.number="formData.actualAmount"
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
            />
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
          @click="$router.go(-1)"
          :disabled="loading"
        >
          取消
        </button>
        <button
          type="submit"
          :class="[
            'flex items-center gap-2 rounded-md px-6 py-2.5 text-sm font-medium text-white transition-all',
            !isFormValid || loading
              ? 'cursor-not-allowed bg-gray-400 opacity-50'
              : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-400/40'
          ]"
          :disabled="!isFormValid || loading"
          @click="loadDataSubmit"
        >
          <span
            v-if="loading"
            class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"
          ></span>
          {{ loading ? '提交中...' : '提交订单' }}
        </button>
      </div>
    </div>

    <!-- 客户选择弹窗 -->
    <common-modal-select ref="selectModalRef" @select="selectCustomer" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { isArray, isObject } from '@/utils/is'
import Message from '@/utils/message'
import api from '@/api'
import CommonTitle from '@/components/common-title.vue'
import CommonFormSection from '@/components/common-form-section.vue'
import CommonModalSelect from '@/components/common-modal-select.vue'

defineOptions({ name: 'SalesForm' })

// 使用工具类型提取 FormErrors 类型
type FormErrors = Pick<
  SalesOrder,
  | 'orderTypeName'
  | 'customerName'
  | 'inspectedUnit'
  | 'samplingAddress'
  | 'detectionTypeName'
  | 'serviceTypeName'
> & { detectionPointsName: string; projectAmountName: string }

// Props
const props = defineProps<{ orderId?: number | string }>()

// 路由相关
const router = useRouter()

// 加载状态
const loading = ref(false)

// 客户选择弹窗引用
const selectModalRef = ref<InstanceType<typeof CommonModalSelect>>()

// 表单数据
const formData = ref<
  Pick<
    SalesOrder,
    | 'id'
    | 'projectNumber'
    | 'orderTypeId'
    | 'urgentFlag'
    | 'customerId'
    | 'inspectedUnit'
    | 'samplingAddress'
    | 'detectionTypeId'
    | 'serviceTypeId'
    | 'detectionPoints'
    | 'projectAmount'
    | 'actualAmount'
    | 'salesRemark'
    | 'attachmentPayloadList'
    | 'sampleStorageId'
    | 'sampleDisposalId'
    | 'sampleDisposalOther'
    | 'detectionSubcontract'
    | 'subcontractProject'
    | 'specialRequirements'
    | 'reportDeliveryId'
    | 'reportDeliveryOther'
    | 'orderDetectionItemList'
  >
>({
  id: 0,
  projectNumber: '',
  orderTypeId: 0, // DictType.ORDER_TYPE
  urgentFlag: false,
  customerId: 0,
  inspectedUnit: '',
  samplingAddress: '',
  detectionTypeId: 0, // 检测类型列表：id、
  // 检测项目：id、detectionItemName
  orderDetectionItemList: [], // 检测项目（标准、多选）：detectionItemStandardList -> detectionItemId、id
  serviceTypeId: 0, // DictType.SERVICE_TYPE
  detectionPoints: 0,
  sampleStorageId: 0, // 样品存储*：DictType.SAMPLE_STORAGE
  sampleDisposalId: 0, // 样品处置*：DictType.SAMPLE_DISPOSAL
  sampleDisposalOther: '', // 样品处置其他：输入框
  detectionSubcontract: false, // 检测分包：单选
  subcontractProject: '', // 分包项目：输入框
  specialRequirements: '', // 特殊要求：输入框（跟上面一行）
  reportDeliveryId: 0, // 报告交付*：REPORT_DELIVERY
  reportDeliveryOther: '', // 报告交付其他：输入框（跟上面一行）
  projectAmount: 0,
  actualAmount: 0,
  salesRemark: '',
  attachmentPayloadList: [] // TODO: 后续开发
})

/**
 * 订单进度
 * 一级列表：阶段
 * 二级列表：statusChangeTraceList，有值代表进行到这个阶段
 * - createTime、changeUserRoleName、changeUserRealName、changedStatusCode
 */

// 表单验证错误
const errors = ref<FormErrors>({
  orderTypeName: '',
  customerName: '',
  inspectedUnit: '',
  samplingAddress: '',
  detectionTypeName: '',
  serviceTypeName: '',
  detectionPointsName: '',
  projectAmountName: ''
})

// 表单是否有效
const isFormValid = computed(() => {
  return !Object.values(errors.value).some(error => error !== '')
})

// 文件上传
const fileInput = ref<HTMLInputElement>()
const uploadedFiles = ref<File[]>([])

// 检测内容选项
// const testContentOptions = computed(() => {
//   if (formData.value.detectionTypeName === '50325-2020') {
//     return [
//       { value: 'formaldehyde', label: '甲醛' },
//       { value: 'benzene', label: '苯' },
//       { value: 'toluene', label: '甲苯' },
//       { value: 'xylene', label: '二甲苯' },
//       { value: 'tvoc', label: 'TVOC' },
//       { value: 'ammonia', label: '氨' },
//       { value: 'radon', label: '氡' }
//     ]
//   } else if (formData.value.detectionTypeName === '18883-2022') {
//     return [
//       { value: 'formaldehyde', label: '甲醛' },
//       { value: 'benzene', label: '苯' },
//       { value: 'toluene', label: '甲苯' },
//       { value: 'xylene', label: '二甲苯' },
//       { value: 'tvoc', label: 'TVOC' },
//       { value: 'pm25', label: 'PM2.5' },
//       { value: 'pm10', label: 'PM10' }
//     ]
//   }
//   return []
// })

/**
 * 校验订单类型
 */
function validateOrderTypeId() {
  if (!formData.value.orderTypeId) {
    errors.value.orderTypeName = '请选择订单类型'
  } else {
    errors.value.orderTypeName = ''
  }
}

/**
 * 校验客户名称
 */
function validateCustomerName() {
  if (!formData.value.customerId) {
    errors.value.customerName = '请选择客户'
  } else {
    errors.value.customerName = ''
  }
}

/**
 * 校验受检单位
 */
function validateInspectedUnit() {
  if (!formData.value.inspectedUnit.trim()) {
    errors.value.inspectedUnit = '请输入受检单位'
  } else if (formData.value.inspectedUnit.trim().length < 2) {
    errors.value.inspectedUnit = '受检单位至少需要2个字符'
  } else if (formData.value.inspectedUnit.trim().length > 100) {
    errors.value.inspectedUnit = '受检单位不能超过100个字符'
  } else {
    errors.value.inspectedUnit = ''
  }
}

/**
 * 校验采样地址
 */
function validateSamplingAddress() {
  if (!formData.value.samplingAddress.trim()) {
    errors.value.samplingAddress = '请输入采样地址'
  } else if (formData.value.samplingAddress.trim().length < 2) {
    errors.value.samplingAddress = '采样地址至少需要2个字符'
  } else if (formData.value.samplingAddress.trim().length > 100) {
    errors.value.samplingAddress = '采样地址不能超过100个字符'
  } else {
    errors.value.samplingAddress = ''
  }
}

/**
 * 校验检测类型
 */
function validateDetectionTypeId() {
  if (!formData.value.detectionTypeId) {
    errors.value.detectionTypeName = '请选择检测类型'
  } else {
    errors.value.detectionTypeName = ''
  }
}

// /**
//  * 校验检测内容
//  */
// function validateDetectionContent() {
//   if (!formData.value.detectionContent.trim()) {
//     errors.value.detectionContent = '请选择检测内容'
//   } else {
//     errors.value.detectionContent = ''
//   }
// }

/**
 * 校验服务类型
 */
function validateServiceTypeId() {
  if (!formData.value.serviceTypeId) {
    errors.value.serviceTypeName = '请选择服务类型'
  } else {
    errors.value.serviceTypeName = ''
  }
}

/**
 * 校验检测点数
 */
function validateDetectionPoints() {
  if (!formData.value.detectionPoints) {
    errors.value.detectionPointsName = '请输入检测点数'
  } else if (formData.value.detectionPoints <= 0) {
    errors.value.detectionPointsName = '检测点数必须大于0'
  } else {
    errors.value.detectionPointsName = ''
  }
}

/**
 * 校验项目金额
 */
function validateProjectAmount() {
  if (!formData.value.projectAmount) {
    errors.value.projectAmountName = '请输入项目金额'
  } else if (formData.value.projectAmount <= 0) {
    errors.value.projectAmountName = '项目金额必须大于0'
  } else {
    errors.value.projectAmountName = ''
  }
}

/**
 * 校验所有表单字段
 */
function validateForm() {
  validateOrderTypeId()
  validateCustomerName()
  validateInspectedUnit()
  validateSamplingAddress()
  validateDetectionTypeId()
  // validateDetectionContent()
  validateServiceTypeId()
  validateDetectionPoints()
  validateProjectAmount()
  console.log(errors.value)
}

/**
 * 处理订单类型选择
 */
function handleOrderTypeChange() {
  // // 根据选择的名称设置对应的ID
  // const orderTypeMap: Record<string, number> = {
  //   '委托检测（采样）': 1,
  //   '委托检测（送样）': 2
  // }
  // formData.value.orderTypeId =
  //   orderTypeMap[formData.value.orderTypeName] || null
}

/**
 * 处理服务类型选择
 */
function handleServiceTypeChange() {
  // // 根据选择的名称设置对应的ID
  // const serviceTypeMap: Record<string, number> = {
  //   初测: 1,
  //   复测: 2,
  //   实测: 3,
  //   YL3: 4,
  //   YL5: 5,
  //   YL8: 6
  // }
  // formData.value.serviceTypeId =
  //   serviceTypeMap[formData.value.serviceTypeName] || null
}

/**
 * 处理检测类型选择
 */
function handleDetectionTypeChange() {
  // // 根据选择的名称设置对应的ID
  // const detectionTypeMap: Record<string, number> = {
  //   '50325-2020': 1,
  //   '18883-2022': 2
  // }
  // formData.value.detectionTypeId =
  //   detectionTypeMap[formData.value.detectionTypeName] || null
  // // 清空检测内容
  // formData.value.detectionContent = ''
  // errors.value.detectionContent = ''
}

/**
 * 选择客户
 * @param customer 客户信息
 */
function selectCustomer(customer: SalesCustomer) {
  formData.value.customerId = customer.id
  errors.value.customerName = ''
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

// 监听表单字段变化，实时校验
watch(() => formData.value.orderTypeId, validateOrderTypeId)
watch(() => formData.value.customerId, validateCustomerName)
watch(() => formData.value.inspectedUnit, validateInspectedUnit)
watch(() => formData.value.samplingAddress, validateSamplingAddress)
watch(() => formData.value.detectionTypeId, validateDetectionTypeId)
// watch(() => formData.value.detectionContent, validateDetectionContent)
watch(() => formData.value.serviceTypeId, validateServiceTypeId)
watch(() => formData.value.detectionPoints, validateDetectionPoints)
watch(() => formData.value.projectAmount, validateProjectAmount)

// 处理数据提交
const loadDataSubmit = async () => {
  // 防止重复提交
  if (loading.value) return

  // 校验表单
  validateForm()

  // 如果表单无效，不提交
  if (!isFormValid.value) {
    return
  }

  loading.value = true

  try {
    const data = {
      // customerName: customerForm.value.customerName.trim() || '',
      // contactPerson: customerForm.value.contactPerson.trim() || '',
      // contactPhone: customerForm.value.contactPhone.trim() || '',
      // customerAddress: customerForm.value.customerAddress.trim() || '',
      // customerCategoryId: customerForm.value.customerCategoryId || null,
      // customerSourceId: customerForm.value.customerSourceId || null,
      // customerStatusId: customerForm.value.customerStatusId || null,
      // industryId: customerForm.value.industryId || null

      projectNumber: formData.value.projectNumber.trim() || '',
      orderTypeId: formData.value.orderTypeId || null,
      urgentFlag: formData.value.urgentFlag === true,
      customerId: formData.value.customerId || null,
      inspectedUnit: formData.value.inspectedUnit.trim() || '',
      samplingAddress: formData.value.samplingAddress.trim() || '',
      detectionTypeId: formData.value.detectionTypeId || null,
      serviceTypeId: formData.value.serviceTypeId || null,
      detectionPoints: formData.value.detectionPoints || null,
      projectAmount: formData.value.projectAmount || null,
      actualAmount: formData.value.actualAmount || null,
      salesRemark: formData.value.salesRemark.trim() || '',
      sampleStorageId: formData.value.sampleStorageId || null,
      sampleDisposalId: formData.value.sampleDisposalId || null,
      sampleDisposalOther: formData.value.sampleDisposalOther.trim() || '',
      detectionSubcontract: formData.value.detectionSubcontract === true,
      subcontractProject: formData.value.subcontractProject.trim() || '',
      specialRequirements: formData.value.specialRequirements.trim() || '',
      reportDeliveryId: formData.value.reportDeliveryId || null,
      reportDeliveryOther: formData.value.reportDeliveryOther.trim() || '',
      orderDetectionItemList: isArray(formData.value.orderDetectionItemList)
        ? formData.value.orderDetectionItemList
        : [],
      attachmentPayloadList: isArray(formData.value.attachmentPayloadList)
        ? formData.value.attachmentPayloadList
        : []
    }
    if (formData.value.id) {
      await api.loadCustomersEdit(formData.value.id, data)
    } else {
      await api.loadOrdersAdd(data)
    }

    Message.success('提交订单成功！')
    router.go(-1)
  } catch (error) {
    console.error('创建订单失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理数据请求
const loadDataDetail = async () => {
  if (!props.orderId) {
    return
  }

  try {
    loading.value = true
    const res = await api.loadOrdersDetail(+props.orderId)
    formData.value = isObject(res)
      ? { ...formData.value, ...res }
      : formData.value
  } catch (error) {
    console.error('加载订单数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  loadDataDetail()
})
</script>

<template>
  <div v-loading="loading">
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
            >
              订单类型
            </label>
            <select
              v-model="formData.orderTypeId"
              :class="[
                'rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100',
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-100':
                    errors.orderTypeName
                }
              ]"
              @blur="validateOrderTypeId"
            >
              <option value="0" disabled>请选择订单类型</option>
              <option
                v-for="item in orderTypeList"
                :key="item.id"
                :value="item.id"
              >
                {{ item.dicValue }}
              </option>
            </select>
            <span
              v-if="errors.orderTypeName"
              class="absolute -bottom-5 left-0 text-xs text-red-500"
            >
              {{ errors.orderTypeName }}
            </span>
          </div>
          <div class="flex flex-col">
            <label class="mb-2 text-sm font-medium text-gray-700">
              是否加急
            </label>
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
            <el-select
              :class="{ error: errors.customerName }"
              v-model="formData.customerId"
              placeholder="请选择客户"
              filterable
              @blur="validateCustomerId"
            >
              <el-option
                v-for="item in customerList"
                :key="item.id"
                :label="item.customerName"
                :value="item.id"
              />
            </el-select>
            <span
              v-if="errors.customerName"
              class="absolute -bottom-5 left-0 text-xs text-red-500"
            >
              {{ errors.customerName }}
            </span>
          </div>
          <div class="relative flex flex-col">
            <label
              class="mb-2 text-sm font-medium text-gray-700 after:text-red-500 after:content-['_*']"
            >
              受检单位
            </label>
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
            >
              {{ errors.inspectedUnit }}
            </span>
          </div>
        </div>
      </common-form-section>

      <!-- 检测信息 -->
      <common-form-section title="检测信息">
        <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div class="relative flex flex-col">
            <label
              class="mb-2 text-sm font-medium text-gray-700 after:text-red-500 after:content-['_*']"
            >
              采样地址
            </label>
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
            >
              {{ errors.samplingAddress }}
            </span>
          </div>
          <div class="relative flex flex-col">
            <label
              class="mb-2 text-sm font-medium text-gray-700 after:text-red-500 after:content-['_*']"
            >
              检测类型
            </label>
            <select
              v-model="formData.detectionTypeId"
              :class="[
                'rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100',
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-100':
                    errors.detectionTypeName
                }
              ]"
              @change="handleDetectionTypeIdChange"
              @blur="validateDetectionTypeId"
            >
              <option value="0" disabled>请选择检测类型</option>
              <option
                v-for="item in detectionTypeList"
                :key="item.id"
                :value="item.id"
              >
                {{ item.detectionTypeName }}
              </option>
            </select>
            <span
              v-if="errors.detectionTypeName"
              class="absolute -bottom-5 left-0 text-xs text-red-500"
            >
              {{ errors.detectionTypeName }}
            </span>
          </div>
        </div>
        <div class="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div class="relative flex flex-col">
            <label
              class="mb-2 text-sm font-medium text-gray-700 after:text-red-500 after:content-['_*']"
            >
              检测项目标准
            </label>
            <el-cascader
              :class="{ error: errors.orderDetectionItemName }"
              v-model="formData.orderDetectionItemList as string[]"
              :options="detectionItemList"
              :props="{
                multiple: true, // 是否允许多选
                checkStrictly: false, // 是否取消父子节点关联（默认选中子节点）
                emitPath: false, // 是否返回完整层级数据（默认 [value1, value2]）
                children: 'children', // options 子节点 key
                label: 'label', // options 节点 label key
                value: 'value' // options 节点 value key
              }"
              placeholder="请选择检测项目标准"
              filterable
              @blur="validateOrderDetectionItemList"
            />
            <span
              v-if="errors.orderDetectionItemName"
              class="absolute -bottom-5 left-0 text-xs text-red-500"
            >
              {{ errors.orderDetectionItemName }}
            </span>
          </div>
          <div class="relative flex flex-col">
            <label
              class="mb-2 text-sm font-medium text-gray-700 after:text-red-500 after:content-['_*']"
            >
              服务类型
            </label>
            <select
              v-model="formData.serviceTypeId"
              :class="[
                'rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100',
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-100':
                    errors.serviceTypeName
                }
              ]"
              @blur="validateServiceTypeId"
            >
              <option value="0" disabled>请选择服务类型</option>
              <option
                v-for="item in serviceTypeList"
                :key="item.id"
                :value="item.id"
              >
                {{ item.dicValue }}
              </option>
            </select>
            <span
              v-if="errors.serviceTypeName"
              class="absolute -bottom-5 left-0 text-xs text-red-500"
            >
              {{ errors.serviceTypeName }}
            </span>
          </div>
        </div>
        <div class="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div class="relative flex flex-col">
            <label
              class="mb-2 text-sm font-medium text-gray-700 after:text-red-500 after:content-['_*']"
            >
              检测点数
            </label>
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
            >
              {{ errors.detectionPointsName }}
            </span>
          </div>
          <div class="relative flex flex-col">
            <label
              class="mb-2 text-sm font-medium text-gray-700 after:text-red-500 after:content-['_*']"
            >
              样品存储
            </label>
            <select
              v-model="formData.sampleStorageId"
              :class="[
                'rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100',
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-100':
                    errors.sampleStorageName
                }
              ]"
              @blur="validateSampleStorageId"
            >
              <option value="0" disabled>请选择样品存储</option>
              <option
                v-for="item in sampleStorageList"
                :key="item.id"
                :value="item.id"
              >
                {{ item.dicValue }}
              </option>
            </select>
            <span
              v-if="errors.sampleStorageName"
              class="absolute -bottom-5 left-0 text-xs text-red-500"
            >
              {{ errors.sampleStorageName }}
            </span>
          </div>
        </div>
        <div class="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div class="relative flex flex-col">
            <label
              class="mb-2 text-sm font-medium text-gray-700 after:text-red-500 after:content-['_*']"
            >
              样品处置
            </label>
            <select
              v-model="formData.sampleDisposalId"
              :class="[
                'rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100',
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-100':
                    errors.sampleDisposalName
                }
              ]"
              @blur="validateSampleDisposalId"
            >
              <option value="0" disabled>请选择样品处置</option>
              <option
                v-for="item in sampleDisposalList"
                :key="item.id"
                :value="item.id"
              >
                {{ item.dicValue }}
              </option>
            </select>
            <span
              v-if="errors.sampleDisposalName"
              class="absolute -bottom-5 left-0 text-xs text-red-500"
            >
              {{ errors.sampleDisposalName }}
            </span>
          </div>
          <div class="flex flex-col">
            <label class="mb-2 text-sm font-medium text-gray-700">
              样品处置其他
            </label>
            <input
              v-model="formData.sampleDisposalOther"
              type="text"
              placeholder="请输入样品处置其他"
              class="rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>
        <div class="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div class="relative flex flex-col">
            <label
              class="mb-2 text-sm font-medium text-gray-700 after:text-red-500 after:content-['_*']"
            >
              报告交付
            </label>
            <select
              v-model="formData.reportDeliveryId"
              :class="[
                'rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100',
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-100':
                    errors.reportDeliveryName
                }
              ]"
              @blur="validateReportDeliveryId"
            >
              <option value="0" disabled>请选择报告交付</option>
              <option
                v-for="item in reportDeliveryList"
                :key="item.id"
                :value="item.id"
              >
                {{ item.dicValue }}
              </option>
            </select>
            <span
              v-if="errors.reportDeliveryName"
              class="absolute -bottom-5 left-0 text-xs text-red-500"
            >
              {{ errors.reportDeliveryName }}
            </span>
          </div>
          <div class="flex flex-col">
            <label class="mb-2 text-sm font-medium text-gray-700">
              报告交付其他
            </label>
            <input
              v-model="formData.reportDeliveryOther"
              type="text"
              placeholder="请输入报告交付其他"
              class="rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>
        <div class="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div class="flex flex-col">
            <label class="mb-2 text-sm font-medium text-gray-700">
              分包项目
            </label>
            <input
              v-model="formData.subcontractProject"
              type="text"
              placeholder="请输入分包项目"
              class="rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div class="flex flex-col">
            <label class="mb-2 text-sm font-medium text-gray-700">
              特殊要求
            </label>
            <input
              v-model="formData.specialRequirements"
              type="text"
              placeholder="请输入特殊要求"
              class="rounded-md border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>
        <div class="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div class="flex flex-col">
            <label class="mb-2 text-sm font-medium text-gray-700">
              检测分包
            </label>
            <div class="flex gap-5 py-2.5">
              <label class="flex cursor-pointer items-center">
                <input
                  v-model="formData.detectionSubcontract"
                  type="radio"
                  :value="true"
                  class="mr-2 text-indigo-500"
                />
                <span class="text-sm text-gray-700">是</span>
              </label>
              <label class="flex cursor-pointer items-center">
                <input
                  v-model="formData.detectionSubcontract"
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

      <!-- 财务信息 -->
      <common-form-section title="财务信息">
        <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div class="relative flex flex-col">
            <label
              class="mb-2 text-sm font-medium text-gray-700 after:text-red-500 after:content-['_*']"
            >
              项目金额
            </label>
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
            >
              {{ errors.projectAmountName }}
            </span>
          </div>
          <div class="flex flex-col">
            <label class="mb-2 text-sm font-medium text-gray-700">
              实收金额
            </label>
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
            <label class="mb-2 text-sm font-medium text-gray-700">
              销售备注
            </label>
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
            <label class="mb-2 text-sm font-medium text-gray-700">
              附件上传
            </label>
            <div
              class="relative cursor-pointer"
              @drop.prevent="handleFileDrop"
              @dragover.prevent
            >
              <input
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
            <div
              v-if="formData.attachmentPayloadList.length"
              class="mt-3 space-y-2"
            >
              <div
                v-for="(item, index) in formData.attachmentPayloadList"
                :key="index"
                class="flex items-center justify-between rounded bg-gray-100 px-3 py-2 text-sm"
              >
                <span class="flex-1 truncate">{{ item.fileName }}</span>
                <button
                  type="button"
                  class="ml-2 cursor-pointer text-red-500 hover:text-red-700"
                  @click="handleFileRemove(index)"
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
          class="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-md"
          @click="$router.go(-1)"
        >
          取消
        </button>
        <button
          type="button"
          :class="[
            'rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-all duration-200',
            !isFormValid || isSubmitting
              ? 'cursor-not-allowed bg-gray-400'
              : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:-translate-y-0.5 hover:shadow-lg'
          ]"
          :disabled="!isFormValid || isSubmitting"
          @click="loadDataSubmit"
        >
          {{ isSubmitting ? '提交中...' : '提交订单' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { DictType } from '@/utils/enum'
import { isArray, isObject } from '@/utils/is'
import Message from '@/utils/message'
import api from '@/api'
import CommonTitle from '@/components/common-title.vue'
import CommonFormSection from '@/components/common-form-section.vue'

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
  | 'reportDeliveryName'
> & {
  orderDetectionItemName: string
  detectionPointsName: string
  sampleStorageName: string
  sampleDisposalName: string
  projectAmountName: string
}

// Props
const props = defineProps<{ orderId?: number | string }>()

// 路由相关
const router = useRouter()

// 内部维护的状态
const loading = ref(false)
const isSubmitting = ref(false)
const customerList = ref<SalesCustomer[]>([])
const orderTypeList = ref<SystemDict[]>([])
const serviceTypeList = ref<SystemDict[]>([])
const sampleStorageList = ref<SystemDict[]>([])
const sampleDisposalList = ref<SystemDict[]>([])
const reportDeliveryList = ref<SystemDict[]>([])
const detectionTypeList = ref<SalesDetectionType[]>([])
const detectionItemMap = ref<{
  [key: number]: SalesDetectionProjectStandard[]
}>({})
const detectionItemList = computed(() => {
  const list = detectionItemMap.value[formData.value.detectionTypeId] || []
  return list.map(item => ({
    label: item.detectionItemName,
    key: item.id,
    children: isArray(item.detectionItemStandardList)
      ? item.detectionItemStandardList.map(subItem => ({
          label: subItem.standardNumber,
          value: `${subItem.detectionItemId},${subItem.id}`
        }))
      : []
  }))
})

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
  // 基本信息
  orderTypeId: 0, // 订单类型*：DictType.ORDER_TYPE
  urgentFlag: false,
  // 客户信息
  customerId: null, // 客户*
  inspectedUnit: '', // 受检单位*
  // 检测信息
  samplingAddress: '', // 采样地址*
  detectionTypeId: 0, // 检测类型列表*：id、detectionTypeName
  orderDetectionItemList: [], // 检测项目（标准、多选）：id、detectionItemName、detectionItemStandardList -> detectionItemId、id
  serviceTypeId: 0, // 服务类型*：DictType.SERVICE_TYPE
  detectionPoints: 0, // 检测点数*
  sampleStorageId: 0, // 样品存储*：DictType.SAMPLE_STORAGE
  sampleDisposalId: 0, // 样品处置*：DictType.SAMPLE_DISPOSAL
  sampleDisposalOther: '', // 样品处置其他：输入框
  detectionSubcontract: false, // 检测分包：单选
  subcontractProject: '', // 分包项目：输入框
  specialRequirements: '', // 特殊要求：输入框（跟上面一行）
  reportDeliveryId: 0, // 报告交付*：DictType.REPORT_DELIVERY
  reportDeliveryOther: '', // 报告交付其他：输入框（跟上面一行）
  // 财务信息
  projectAmount: 0,
  actualAmount: 0,
  // 备注信息
  salesRemark: '',
  attachmentPayloadList: []
})

// 表单验证错误
const errors = ref<FormErrors>({
  orderTypeName: '',
  customerName: '',
  inspectedUnit: '',
  samplingAddress: '',
  detectionTypeName: '',
  orderDetectionItemName: '',
  serviceTypeName: '',
  detectionPointsName: '',
  sampleStorageName: '',
  sampleDisposalName: '',
  reportDeliveryName: '',
  projectAmountName: ''
})

// 表单是否有效
const isFormValid = computed(() => {
  return !Object.values(errors.value).some(error => error !== '')
})

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
 * 校验客户
 */
function validateCustomerId() {
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

/**
 * 校验检测项目
 */
function validateOrderDetectionItemList() {
  if (
    !formData.value.orderDetectionItemList ||
    formData.value.orderDetectionItemList.length === 0
  ) {
    errors.value.orderDetectionItemName = '请选择检测项目标准'
  } else {
    errors.value.orderDetectionItemName = ''
  }
}

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
 * 校验样品存储
 */
function validateSampleStorageId() {
  if (!formData.value.sampleStorageId) {
    errors.value.sampleStorageName = '请选择样品存储方式'
  } else {
    errors.value.sampleStorageName = ''
  }
}

/**
 * 校验样品处置
 */
function validateSampleDisposalId() {
  if (!formData.value.sampleDisposalId) {
    errors.value.sampleDisposalName = '请选择样品处置方式'
  } else {
    errors.value.sampleDisposalName = ''
  }
}

/**
 * 校验报告交付
 */
function validateReportDeliveryId() {
  if (!formData.value.reportDeliveryId) {
    errors.value.reportDeliveryName = '请选择报告交付方式'
  } else {
    errors.value.reportDeliveryName = ''
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
  validateCustomerId()
  validateInspectedUnit()
  validateSamplingAddress()
  validateDetectionTypeId()
  validateOrderDetectionItemList()
  validateServiceTypeId()
  validateDetectionPoints()
  validateSampleStorageId()
  validateSampleDisposalId()
  validateReportDeliveryId()
  validateProjectAmount()
}

/**
 * 处理拖拽文件上传
 * @param event 拖拽事件
 */
function handleFileDrop(event: DragEvent) {
  const files = event.dataTransfer?.files
  if (!files || files.length === 0) {
    return
  }
  const validFiles = Array.from(files).filter(file => {
    const maxSize = 20 * 1024 * 1024 // 20MB
    if (file.size > maxSize) {
      Message.warning(`文件 ${file.name} 超过20MB限制`)
      return false
    }
    return true
  })

  // TODO: 上传文件到 OSS

  formData.value.attachmentPayloadList.push(
    ...validFiles.map(file => ({
      url: '',
      fileName: file.name,
      fileSizeByte: file.size
    }))
  )
}

/**
 * 处理选择文件上传
 * @param event 选择事件
 */
function handleFileChange(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (!files || files.length === 0) {
    return
  }
  const validFiles = Array.from(files).filter(file => {
    const maxSize = 20 * 1024 * 1024 // 20MB
    if (file.size > maxSize) {
      Message.warning(`文件 ${file.name} 超过20MB限制`)
      return false
    }
    return true
  })

  // TODO: 上传文件到 OSS

  formData.value.attachmentPayloadList.push(
    ...validFiles.map(file => ({
      url: '',
      fileName: file.name,
      fileSizeByte: file.size
    }))
  )
}

/**
 * 移除文件
 * @param index 文件索引
 */
function handleFileRemove(index: number) {
  formData.value.attachmentPayloadList.splice(index, 1)
}

// 监听表单字段变化，实时校验
watch(() => formData.value.orderTypeId, validateOrderTypeId)
watch(() => formData.value.customerId, validateCustomerId)
watch(() => formData.value.inspectedUnit, validateInspectedUnit)
watch(() => formData.value.samplingAddress, validateSamplingAddress)
watch(() => formData.value.detectionTypeId, validateDetectionTypeId)
watch(
  () => formData.value.orderDetectionItemList,
  validateOrderDetectionItemList
)
watch(() => formData.value.serviceTypeId, validateServiceTypeId)
watch(() => formData.value.detectionPoints, validateDetectionPoints)
watch(() => formData.value.sampleStorageId, validateSampleStorageId)
watch(() => formData.value.sampleDisposalId, validateSampleDisposalId)
watch(() => formData.value.reportDeliveryId, validateReportDeliveryId)
watch(() => formData.value.projectAmount, validateProjectAmount)

/**
 * 处理检测类型选择
 */
function handleDetectionTypeIdChange() {
  formData.value.orderDetectionItemList = []
}

// 处理数据提交
const loadDataSubmit = async () => {
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
      projectNumber: formData.value.projectNumber.trim() || '',
      // 基本信息
      orderTypeId: formData.value.orderTypeId || null,
      urgentFlag: formData.value.urgentFlag === true,
      // 客户信息
      customerId: formData.value.customerId || null,
      inspectedUnit: formData.value.inspectedUnit.trim() || '',
      // 检测信息
      samplingAddress: formData.value.samplingAddress.trim() || '',
      detectionTypeId: formData.value.detectionTypeId || null,
      orderDetectionItemList: isArray(formData.value.orderDetectionItemList)
        ? formData.value.orderDetectionItemList.map(id => ({
            detectionItemId: +(id as string).split(',')[0],
            detectionItemStandardId: +(id as string).split(',')[1]
          }))
        : [],
      serviceTypeId: formData.value.serviceTypeId || null,
      detectionPoints: formData.value.detectionPoints || null,
      sampleStorageId: formData.value.sampleStorageId || null,
      sampleDisposalId: formData.value.sampleDisposalId || null,
      sampleDisposalOther: formData.value.sampleDisposalOther.trim() || '',
      detectionSubcontract: formData.value.detectionSubcontract === true,
      subcontractProject: formData.value.subcontractProject.trim() || '',
      specialRequirements: formData.value.specialRequirements.trim() || '',
      reportDeliveryId: formData.value.reportDeliveryId || null,
      reportDeliveryOther: formData.value.reportDeliveryOther.trim() || '',
      // 财务信息
      projectAmount: formData.value.projectAmount || null,
      actualAmount: formData.value.actualAmount || null,
      // 备注信息
      salesRemark: formData.value.salesRemark.trim() || '',
      attachmentPayloadList: isArray(formData.value.attachmentPayloadList)
        ? formData.value.attachmentPayloadList
        : []
    }
    if (formData.value.id) {
      await api.loadOrdersEdit(formData.value.id, data)
    } else {
      await api.loadOrdersAdd(data)
    }

    Message.success('提交订单成功！')
    router.go(-1)
  } catch (error) {
    console.error('提交订单失败:', error)
  } finally {
    isSubmitting.value = false
  }
}

// 处理数据请求
const loadDataDetail = async () => {
  try {
    loading.value = true

    const [res1, res2, res3, res4, res5, res6, res7] = await Promise.all([
      api.loadCustomers({ page: 1, size: 100, sort: 'id,desc' }),
      api.loadDictionaries({ dicTypeCode: DictType.ORDER_TYPE }),
      api.loadDictionaries({ dicTypeCode: DictType.SERVICE_TYPE }),
      api.loadDictionaries({ dicTypeCode: DictType.SAMPLE_STORAGE }),
      api.loadDictionaries({ dicTypeCode: DictType.SAMPLE_DISPOSAL }),
      api.loadDictionaries({ dicTypeCode: DictType.REPORT_DELIVERY }),
      api.loadDetectionTypes()
    ])
    customerList.value = isArray(res1.content) ? res1.content : []
    orderTypeList.value = isArray(res2) ? res2 : []
    serviceTypeList.value = isArray(res3) ? res3 : []
    sampleStorageList.value = isArray(res4) ? res4 : []
    sampleDisposalList.value = isArray(res5) ? res5 : []
    reportDeliveryList.value = isArray(res6) ? res6 : []
    detectionTypeList.value = isArray(res7) ? res7 : []

    if (isArray(res7)) {
      const res8 = await Promise.all(
        res7.map(({ id }) => api.loadDetectionItems({ detectionTypeId: id }))
      )
      res8.forEach((item, index) => {
        detectionItemMap.value[res7[index].id] = item
      })
    }

    if (props.orderId) {
      const res9 = await api.loadOrdersDetail(+props.orderId)
      formData.value = isObject(res9)
        ? { ...formData.value, ...res9 }
        : formData.value

      formData.value.customerId = res9.customer.id || null
      formData.value.orderDetectionItemList = isArray(
        res9.orderDetectionItemList
      )
        ? res9.orderDetectionItemList.map(
            item =>
              `${(item as any).detectionItemId},${(item as any).detectionItemStandardId}`
          )
        : []
    }
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

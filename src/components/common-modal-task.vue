<template>
  <!-- [公共]弹窗-分派、调整任务* -->
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
            <div>
              <h3 class="text-lg font-semibold">
                {{ modalType === 'adjust' ? '重新调整任务' : '分派任务' }}
              </h3>
              <p class="text-sm opacity-90">
                任务编号: {{ taskData.projectNumber }}
              </p>
            </div>
            <button
              class="flex h-8 w-8 items-center justify-center rounded-md bg-white bg-opacity-20 text-xl transition-colors duration-200 hover:bg-opacity-30"
              @click="close"
            >
              ×
            </button>
          </div>

          <!-- 弹窗内容 -->
          <div class="max-h-[calc(90vh-100px)] overflow-y-auto p-6">
            <!-- 对比信息 -->
            <div
              v-if="modalType === 'adjust'"
              class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <div class="rounded-lg border-2 border-red-200 bg-red-50 p-4">
                <h4 class="mb-3 font-semibold text-red-700">当前安排</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">采样日期：</span>
                    <span class="font-medium">
                      {{ taskData.samplingDate || '--' }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">采样时间：</span>
                    <span class="font-medium">
                      {{
                        taskData.samplingStartTime && taskData.samplingEndTime
                          ? `${taskData.samplingStartTime} - ${taskData.samplingEndTime}`
                          : '--'
                      }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">采样人员：</span>
                    <span class="font-medium">
                      {{ taskData.samplingUserRealName || '--' }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="rounded-lg border-2 border-green-200 bg-green-50 p-4">
                <h4 class="mb-3 font-semibold text-green-700">新的安排</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">采样日期：</span>
                    <span class="font-medium">
                      {{ taskForm.samplingDate || '--' }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">采样时间：</span>
                    <span class="font-medium">
                      {{
                        taskForm.samplingStartTime && taskForm.samplingEndTime
                          ? `${taskForm.samplingStartTime} - ${taskForm.samplingEndTime}`
                          : '--'
                      }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">采样人员：</span>
                    <span class="font-medium">
                      {{ samplingUserRealName }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-6 pb-4">
              <!-- 采样日期 -->
              <div class="relative flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700">
                  采样日期 <span class="text-red-500">*</span>
                </label>
                <input
                  ref="dateInputRef"
                  v-model="taskForm.samplingDate"
                  type="date"
                  :class="[
                    'w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2',
                    formErrors.samplingDate
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-indigo-100'
                  ]"
                  placeholder="请选择采样日期"
                  @click="onClickDatePicker"
                />
                <div
                  v-if="formErrors.samplingDate"
                  class="absolute -bottom-5 left-0 text-xs text-red-500"
                >
                  {{ formErrors.samplingDate }}
                </div>
              </div>

              <!-- 时间范围 -->
              <div class="grid grid-cols-2 gap-4">
                <div class="relative flex flex-col gap-1">
                  <label class="text-sm font-medium text-gray-700">
                    开始时间 <span class="text-red-500">*</span>
                  </label>
                  <input
                    ref="startTimeInputRef"
                    v-model="taskForm.samplingStartTime"
                    type="time"
                    :class="[
                      'w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2',
                      formErrors.samplingStartTime
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                        : 'border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-indigo-100'
                    ]"
                    @click="onClickStartTimePicker"
                  />
                  <div
                    v-if="formErrors.samplingStartTime"
                    class="absolute -bottom-5 left-0 text-xs text-red-500"
                  >
                    {{ formErrors.samplingStartTime }}
                  </div>
                </div>

                <div class="relative flex flex-col gap-1">
                  <label class="text-sm font-medium text-gray-700">
                    结束时间 <span class="text-red-500">*</span>
                  </label>
                  <input
                    ref="endTimeInputRef"
                    v-model="taskForm.samplingEndTime"
                    type="time"
                    :class="[
                      'w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2',
                      formErrors.samplingEndTime
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                        : 'border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-indigo-100'
                    ]"
                    @click="onClickEndTimePicker"
                  />
                  <div
                    v-if="formErrors.samplingEndTime"
                    class="absolute -bottom-5 left-0 text-xs text-red-500"
                  >
                    {{ formErrors.samplingEndTime }}
                  </div>
                </div>
              </div>

              <!-- 选择采样人员 -->
              <div class="relative flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700">
                  选择采样人员
                  <span class="text-red-500">*</span>
                </label>
                <ul
                  class="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-gray-200 p-3"
                >
                  <li
                    v-for="(item, index) of operatorList"
                    :key="index"
                    class="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-indigo-50"
                    :class="{
                      'border-blue-500 bg-blue-50':
                        taskForm.samplingUserId === item.userId,
                      'border-gray-300 bg-gray-50':
                        taskForm.samplingUserId !== item.userId
                    }"
                    @click="taskForm.samplingUserId = item.userId"
                  >
                    <div
                      class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 font-bold text-white"
                    >
                      {{ item.userRealName[0] }}
                    </div>
                    <div class="flex-1">
                      <div class="font-medium text-gray-900">
                        {{ item.userRealName }}
                      </div>
                      <div class="text-sm text-gray-500">
                        状态: {{ item.idleFlag ? '空闲' : '忙碌' }}
                      </div>
                    </div>
                    <div
                      class="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500"
                    >
                      今日{{ item.todayTaskCount }}个任务
                    </div>
                  </li>
                </ul>
                <div
                  v-if="formErrors.samplingUserRealName"
                  class="absolute -bottom-5 left-0 text-xs text-red-500"
                >
                  {{ formErrors.samplingUserRealName }}
                </div>
              </div>

              <!-- 备注说明、调整原因 -->
              <div class="relative flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700">
                  {{ modalType === 'adjust' ? '调整原因' : '备注说明' }}
                  <span v-if="modalType === 'adjust'" class="text-red-500">
                    *
                  </span>
                </label>
                <textarea
                  v-model="taskForm.remark"
                  rows="3"
                  :class="[
                    'w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2',
                    formErrors.remark
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-indigo-100'
                  ]"
                  :placeholder="
                    modalType === 'adjust' ? '请输入调整原因' : '请输入备注说明'
                  "
                />
                <div
                  v-if="formErrors.remark"
                  class="absolute -bottom-5 left-0 text-xs text-red-500"
                >
                  {{ formErrors.remark }}
                </div>
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
              {{ isSubmitting ? '提交中...' : '确认分派' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { isArray } from '@/utils/is'
import api from '@/api'

// 定义 emits
const emit = defineEmits<{ refresh: [] }>()

// 内部维护的状态
const visible = ref(false)
const isSubmitting = ref(false)
const modalType = ref<'assign' | 'adjust'>('assign')
const taskData = ref<Partial<SamplingTask>>({})
const operatorList = ref<SamplingOperator[]>([])

const dateInputRef = ref<HTMLInputElement>()
const startTimeInputRef = ref<HTMLInputElement>()
const endTimeInputRef = ref<HTMLInputElement>()

const samplingUserRealName = computed(() => {
  const find = operatorList.value.find(
    item => item.userId === taskForm.value.samplingUserId
  )
  return find ? find.userRealName : '--'
})

// 表单数据
const taskForm = ref<
  Pick<
    SamplingTask,
    | 'id'
    | 'samplingUserId'
    | 'samplingDate'
    | 'samplingStartTime'
    | 'samplingEndTime'
    | 'remark'
  >
>({
  id: 0,
  samplingUserId: 0,
  samplingDate: '',
  samplingStartTime: '',
  samplingEndTime: '',
  remark: ''
})

// 表单错误信息
const formErrors = ref<
  Pick<
    SamplingTask,
    | 'samplingUserRealName'
    | 'samplingDate'
    | 'samplingStartTime'
    | 'samplingEndTime'
    | 'remark'
  >
>({
  samplingUserRealName: '',
  samplingDate: '',
  samplingStartTime: '',
  samplingEndTime: '',
  remark: ''
})

// 表单是否有效
const isFormValid = computed(() => {
  return !Object.values(formErrors.value).some(error => error !== '')
})

/**
 * 校验采样人员
 */
function validateSamplingUserId() {
  if (!taskForm.value.samplingUserId) {
    formErrors.value.samplingUserRealName = '请选择采样人员'
  } else {
    formErrors.value.samplingUserRealName = ''
  }
}

/**
 * 校验采样日期
 */
function validateSamplingDate() {
  if (!taskForm.value.samplingDate.trim()) {
    formErrors.value.samplingDate = '请选择采样日期'
  } else {
    const selectedDate = new Date(taskForm.value.samplingDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (selectedDate < today) {
      formErrors.value.samplingDate = '采样日期不能早于今天'
    } else {
      formErrors.value.samplingDate = ''
    }
  }
}

/**
 * 校验采样开始时间
 */
function validateSamplingStartTime() {
  if (!taskForm.value.samplingStartTime.trim()) {
    formErrors.value.samplingStartTime = '请选择开始时间'
  } else {
    formErrors.value.samplingStartTime = ''
    // 如果结束时间已填写，重新校验结束时间
    if (taskForm.value.samplingEndTime.trim()) {
      validateSamplingEndTime()
    }
  }
}

/**
 * 校验采样结束时间
 */
function validateSamplingEndTime() {
  if (!taskForm.value.samplingEndTime.trim()) {
    formErrors.value.samplingEndTime = '请选择结束时间'
  } else if (
    taskForm.value.samplingStartTime &&
    taskForm.value.samplingEndTime <= taskForm.value.samplingStartTime
  ) {
    formErrors.value.samplingEndTime = '结束时间必须晚于开始时间'
  } else {
    formErrors.value.samplingEndTime = ''
  }
}

/**
 * 校验备注/调整原因
 */
function validateRemark() {
  if (modalType.value === 'adjust' && !taskForm.value.remark.trim()) {
    formErrors.value.remark = '请输入调整原因'
  } else {
    formErrors.value.remark = ''
  }
}

/**
 * 校验所有表单字段
 */
function validateForm() {
  validateSamplingUserId()
  validateSamplingDate()
  validateSamplingStartTime()
  validateSamplingEndTime()
  validateRemark()
}

// 监听表单字段变化，实时校验
watch(() => taskForm.value.samplingUserId, validateSamplingUserId)
watch(() => taskForm.value.samplingDate, validateSamplingDate)
watch(() => taskForm.value.samplingStartTime, validateSamplingStartTime)
watch(() => taskForm.value.samplingEndTime, validateSamplingEndTime)
watch(() => taskForm.value.remark, validateRemark)

/**
 * 重置表单数据
 */
const resetForm = (): void => {
  Object.assign(taskForm.value, {
    id: 0,
    projectNumber: '',
    samplingUserId: 0,
    samplingDate: '',
    samplingStartTime: '',
    samplingEndTime: '',
    remark: ''
  })

  // 清空错误信息
  Object.assign(formErrors.value, {
    samplingUserRealName: '',
    samplingDate: '',
    samplingStartTime: '',
    samplingEndTime: '',
    remark: ''
  })
}

/**
 * 打开日期选择器
 */
const onClickDatePicker = (): void => {
  dateInputRef.value?.showPicker()
}

/**
 * 打开开始时间选择器
 */
const onClickStartTimePicker = (): void => {
  startTimeInputRef.value?.showPicker()
}

/**
 * 打开结束时间选择器
 */
const onClickEndTimePicker = (): void => {
  endTimeInputRef.value?.showPicker()
}

/**
 * 对外暴露的 open 方法
 * @param type 模态框类型：'assign' | 'adjust'
 * @param data 可选的初始数据
 */
const open = async (
  type: 'assign' | 'adjust',
  data?: SamplingTask
): Promise<void> => {
  visible.value = true
  modalType.value = type || 'assign'
  taskData.value = data || {}
  operatorList.value = []
  resetForm()

  // 如果有初始数据，设置到表单中，否则重置表单
  if (data) {
    Object.assign(taskForm.value, {
      id: data.id || 0
    })
  }

  const res = await api.loadSamplingTasksSamplingOperator()
  operatorList.value = isArray(res) ? res : []
}

/**
 * 关闭弹窗
 */
const close = (): void => {
  visible.value = false
  resetForm()
}

/**
 * 确认任务分派/调整
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
      samplingUserId: taskForm.value.samplingUserId || null,
      samplingDate: taskForm.value.samplingDate.trim() || '',
      samplingStartTime: taskForm.value.samplingStartTime.trim() || '',
      samplingEndTime: taskForm.value.samplingEndTime.trim() || '',
      remark: taskForm.value.remark.trim() || ''
    }
    await api.loadSamplingTasksAssignment(taskForm.value.id, data)

    // 触发刷新事件
    emit('refresh')

    // 关闭弹窗
    close()
  } catch (error) {
    console.error('分派任务失败:', error)
  } finally {
    isSubmitting.value = false
  }
}

// 对外暴露方法
defineExpose({ open, close })
</script>

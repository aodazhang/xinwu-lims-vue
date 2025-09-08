<template>
  <!-- [公共]弹窗-分派、调整任务 -->
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
              <h3 class="text-lg font-semibold">任务分派</h3>
              <p class="text-sm opacity-90">任务编号: {{ taskData?.id }}</p>
            </div>
            <button
              class="flex h-8 w-8 items-center justify-center rounded-md bg-white bg-opacity-20 text-xl transition-colors duration-200 hover:bg-opacity-30"
              @click="close"
            >
              ×
            </button>
          </div>

          <!-- 弹窗内容 -->
          <div class="max-h-[calc(90vh-300px)] overflow-y-auto p-6">
            <form @submit.prevent="confirmTask">
              <!-- 调整任务时显示对比信息 -->
              <div
                v-if="modalType === 'adjust'"
                class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2"
              >
                <div class="rounded-lg border-2 border-red-200 bg-red-50 p-4">
                  <h4 class="mb-3 font-semibold text-red-700">当前安排</h4>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-600">采样日期：</span>
                      <span class="font-medium">{{
                        taskData?.assignedDate || '-'
                      }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">采样时间：</span>
                      <span class="font-medium">{{
                        taskData?.assignedTime || '-'
                      }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">采样人员：</span>
                      <span class="font-medium">{{
                        taskData?.assignedStaff || '-'
                      }}</span>
                    </div>
                  </div>
                </div>

                <div
                  class="rounded-lg border-2 border-green-200 bg-green-50 p-4"
                >
                  <h4 class="mb-3 font-semibold text-green-700">新的安排</h4>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-600">采样日期：</span>
                      <span class="font-medium">{{
                        taskForm.date || '-'
                      }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">采样时间：</span>
                      <span class="font-medium">
                        {{
                          taskForm.startTime && taskForm.endTime
                            ? `${taskForm.startTime} - ${taskForm.endTime}`
                            : '-'
                        }}
                      </span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">采样人员：</span>
                      <span class="font-medium">{{
                        getSelectedStaffNames() || '-'
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 表单内容 -->
              <div class="space-y-6">
                <!-- 采样日期 -->
                <div class="relative flex flex-col gap-1">
                  <label class="text-sm font-medium text-gray-700">
                    采样日期 <span class="text-red-500">*</span>
                  </label>
                  <input
                    ref="dateInputRef"
                    v-model="taskForm.date"
                    type="date"
                    :class="[
                      'w-full cursor-pointer rounded-lg border bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2',
                      formErrors.date
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                        : 'border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-indigo-100'
                    ]"
                    @click="openDatePicker"
                  />
                  <div
                    v-if="formErrors.date"
                    class="absolute -bottom-5 left-0 text-xs text-red-500"
                  >
                    {{ formErrors.date }}
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
                      v-model="taskForm.startTime"
                      type="time"
                      :class="[
                        'w-full cursor-pointer rounded-lg border bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2',
                        formErrors.startTime
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                          : 'border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-indigo-100'
                      ]"
                      @click="openStartTimePicker"
                    />
                    <div
                      v-if="formErrors.startTime"
                      class="absolute -bottom-5 left-0 text-xs text-red-500"
                    >
                      {{ formErrors.startTime }}
                    </div>
                  </div>
                  <div class="relative flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-700">
                      结束时间 <span class="text-red-500">*</span>
                    </label>
                    <input
                      ref="endTimeInputRef"
                      v-model="taskForm.endTime"
                      type="time"
                      :class="[
                        'w-full cursor-pointer rounded-lg border bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2',
                        formErrors.endTime
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                          : 'border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-indigo-100'
                      ]"
                      @click="openEndTimePicker"
                    />
                    <div
                      v-if="formErrors.endTime"
                      class="absolute -bottom-5 left-0 text-xs text-red-500"
                    >
                      {{ formErrors.endTime }}
                    </div>
                  </div>
                </div>

                <!-- 选择采样人员 -->
                <div class="relative flex flex-col gap-1">
                  <label class="text-sm font-medium text-gray-700">
                    选择采样人员
                    <span class="text-red-500">*</span>
                  </label>
                  <div
                    class="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-gray-200 p-3"
                  >
                    <div
                      v-for="staff in staffList"
                      :key="staff.id"
                      class="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-indigo-50"
                      :class="{
                        'border-indigo-500 bg-indigo-50':
                          taskForm.selectedStaff === staff.id
                      }"
                      @click="toggleStaffSelection(staff.id)"
                    >
                      <div
                        class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 font-bold text-white"
                      >
                        {{ staff.name[0] }}
                      </div>
                      <div class="flex-1">
                        <div class="font-medium text-gray-900">
                          {{ staff.name }}
                        </div>
                        <div class="text-sm text-gray-500">
                          状态: {{ staff.status }}
                        </div>
                      </div>
                      <div
                        class="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500"
                      >
                        今日{{ staff.tasks }}个任务
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="formErrors.selectedStaff"
                    class="absolute -bottom-5 left-0 text-xs text-red-500"
                  >
                    {{ formErrors.selectedStaff }}
                  </div>
                </div>

                <!-- 备注说明/调整原因 -->
                <div class="flex flex-col gap-1">
                  <label class="text-sm font-medium text-gray-700">
                    {{
                      modalType === 'assign' ? '备注说明（选填）' : '调整原因'
                    }}
                    <span v-if="modalType === 'adjust'" class="text-red-500"
                      >*</span
                    >
                  </label>
                  <textarea
                    v-model="taskForm.remark"
                    :rows="3"
                    :class="[
                      'w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2',
                      formErrors.remark
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                        : 'border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-indigo-100'
                    ]"
                    :placeholder="
                      modalType === 'assign'
                        ? '请输入特殊要求或注意事项'
                        : '请说明调整原因'
                    "
                  ></textarea>
                  <div v-if="formErrors.remark" class="text-xs text-red-500">
                    {{ formErrors.remark }}
                  </div>
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
              @click="confirmTask"
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
import { ref, reactive, watch, computed } from 'vue'

// 定义接口
interface TaskForm {
  date: string
  startTime: string
  endTime: string
  selectedStaff: number | null
  remark: string
}

interface Staff {
  id: number
  name: string
  status: string
  tasks: number
}

interface TaskData {
  id: string
  assignedDate?: string
  assignedTime?: string
  assignedStaff?: string
  [key: string]: any
}

interface FormErrors {
  date: string
  startTime: string
  endTime: string
  selectedStaff: string
  remark: string
}

// 定义 emits
const emit = defineEmits<{ refresh: [] }>()

// 内部维护的状态
const visible = ref(false)
const modalType = ref<'assign' | 'adjust'>('assign')
const isSubmitting = ref(false)
const taskData = ref<TaskData | null>(null)
const staffList = ref<Staff[]>([])

// 输入框引用
const dateInputRef = ref<HTMLInputElement>()
const startTimeInputRef = ref<HTMLInputElement>()
const endTimeInputRef = ref<HTMLInputElement>()

// 表单数据
const taskForm = reactive<TaskForm>({
  date: '',
  startTime: '',
  endTime: '',
  selectedStaff: null,
  remark: ''
})

// 表单错误信息
const formErrors = reactive<FormErrors>({
  date: '',
  startTime: '',
  endTime: '',
  selectedStaff: '',
  remark: ''
})

// 表单是否有效
const isFormValid = computed(() => {
  return !Object.values(formErrors).some(error => error !== '')
})

/**
 * 校验采样日期
 */
function validateDate() {
  if (!taskForm.date.trim()) {
    formErrors.date = '请选择采样日期'
  } else {
    const selectedDate = new Date(taskForm.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
      formErrors.date = '采样日期不能早于今天'
    } else {
      formErrors.date = ''
    }
  }
}

/**
 * 校验开始时间
 */
function validateStartTime() {
  if (!taskForm.startTime.trim()) {
    formErrors.startTime = '请选择开始时间'
  } else {
    formErrors.startTime = ''
    // 如果结束时间已填写，重新校验结束时间
    if (taskForm.endTime) {
      validateEndTime()
    }
  }
}

/**
 * 校验结束时间
 */
function validateEndTime() {
  if (!taskForm.endTime.trim()) {
    formErrors.endTime = '请选择结束时间'
  } else if (taskForm.startTime && taskForm.endTime <= taskForm.startTime) {
    formErrors.endTime = '结束时间必须晚于开始时间'
  } else {
    formErrors.endTime = ''
  }
}

/**
 * 校验选择的采样人员
 */
function validateSelectedStaff() {
  if (taskForm.selectedStaff === null) {
    formErrors.selectedStaff = '请选择一名采样人员'
  } else {
    formErrors.selectedStaff = ''
  }
}

/**
 * 校验备注/调整原因
 */
function validateRemark() {
  if (modalType.value === 'adjust' && !taskForm.remark.trim()) {
    formErrors.remark = '请说明调整原因'
  } else {
    formErrors.remark = ''
  }
}

/**
 * 校验所有表单字段
 */
function validateForm() {
  validateDate()
  validateStartTime()
  validateEndTime()
  validateSelectedStaff()
  validateRemark()
}

// 监听表单字段变化，实时校验
watch(() => taskForm.date, validateDate)
watch(() => taskForm.startTime, validateStartTime)
watch(() => taskForm.endTime, validateEndTime)
watch(() => taskForm.selectedStaff, validateSelectedStaff, { deep: true })
watch(() => taskForm.remark, validateRemark)

/**
 * 选择人员（单选）
 */
const toggleStaffSelection = (staffId: number): void => {
  if (taskForm.selectedStaff === staffId) {
    taskForm.selectedStaff = null
  } else {
    taskForm.selectedStaff = staffId
  }
}

/**
 * 打开日期选择器
 */
const openDatePicker = (): void => {
  dateInputRef.value?.showPicker()
}

/**
 * 打开开始时间选择器
 */
const openStartTimePicker = (): void => {
  startTimeInputRef.value?.showPicker()
}

/**
 * 打开结束时间选择器
 */
const openEndTimePicker = (): void => {
  endTimeInputRef.value?.showPicker()
}

/**
 * 获取选中人员姓名
 */
const getSelectedStaffNames = (): string => {
  if (taskForm.selectedStaff === null) {
    return ''
  }
  const staff = staffList.value.find(s => s.id === taskForm.selectedStaff)
  return staff?.name || ''
}

/**
 * 重置表单数据
 */
const resetForm = (): void => {
  Object.assign(taskForm, {
    date: '',
    startTime: '',
    endTime: '',
    selectedStaff: null,
    remark: ''
  })

  // 清空错误信息
  Object.assign(formErrors, {
    date: '',
    startTime: '',
    endTime: '',
    selectedStaff: '',
    remark: ''
  })
}

/**
 * 对外暴露的 open 方法
 * @param type 模态框类型：'assign' | 'adjust'
 * @param task 任务数据
 * @param staff 人员列表
 */
const open = (
  type: 'assign' | 'adjust',
  task: TaskData,
  staff: Staff[]
): void => {
  visible.value = true
  modalType.value = type
  taskData.value = task
  staffList.value = staff
  resetForm()

  // 如果是调整任务，预填充当前数据
  if (type === 'adjust' && task.assignedDate && task.assignedTime) {
    taskForm.date = task.assignedDate
    const timeRange = task.assignedTime.split(' - ')
    if (timeRange.length === 2) {
      taskForm.startTime = timeRange[0]
      taskForm.endTime = timeRange[1]
    }
    // 根据已分派人员名称找到对应的ID（单选）
    if (task.assignedStaff) {
      const assignedName = task.assignedStaff.split(', ')[0] // 取第一个人员
      const assignedStaff = staff.find(s => s.name === assignedName)
      taskForm.selectedStaff = assignedStaff ? assignedStaff.id : null
    }
  }
}

/**
 * 关闭弹窗
 */
const close = (): void => {
  visible.value = false
  taskData.value = null
  resetForm()
}

/**
 * 确认任务分派/调整
 */
const confirmTask = async (): Promise<void> => {
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
    const taskInfo = {
      taskId: taskData.value?.id,
      date: taskForm.date,
      startTime: taskForm.startTime,
      endTime: taskForm.endTime,
      selectedStaff: taskForm.selectedStaff,
      staffNames: getSelectedStaffNames(),
      remark: taskForm.remark,
      type: modalType.value
    }

    console.log(
      `${modalType.value === 'assign' ? '分派' : '调整'}任务:`,
      taskInfo
    )

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    // 显示成功提示
    alert(`任务${modalType.value === 'assign' ? '分派' : '调整'}成功！`)

    // 触发刷新事件
    emit('refresh')

    // 关闭弹窗
    close()
  } catch (error) {
    console.error(
      `${modalType.value === 'assign' ? '分派' : '调整'}任务失败:`,
      error
    )
    alert(`任务${modalType.value === 'assign' ? '分派' : '调整'}失败，请重试`)
  } finally {
    isSubmitting.value = false
  }
}

// 对外暴露方法
defineExpose({ open, close })
</script>

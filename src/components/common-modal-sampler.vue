<template>
  <!-- [公共]弹窗-添加采样位置 -->
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
          class="max-h-[90vh] w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl transition-all duration-300"
          @click.stop
        >
          <!-- 弹窗头部 -->
          <div
            class="flex items-center justify-between bg-gradient-to-r from-indigo-500 to-purple-600 p-5 text-white"
          >
            <h3 class="text-lg font-semibold">添加采样位置</h3>
            <button
              class="flex h-8 w-8 items-center justify-center rounded-md bg-white bg-opacity-20 text-xl transition-colors duration-200 hover:bg-opacity-30"
              @click="close"
            >
              ×
            </button>
          </div>

          <!-- 弹窗内容 -->
          <div class="max-h-[calc(90vh-300px)] overflow-y-auto p-6">
            <form @submit.prevent="addSamplingLocation">
              <div class="space-y-6 pb-4">
                <!-- 采样位置名称 -->
                <div class="relative flex flex-col gap-1">
                  <label class="text-sm font-medium text-gray-700">
                    采样位置名称 <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="samplerForm.locationName"
                    type="text"
                    :class="[
                      'w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2',
                      formErrors.locationName
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                        : 'border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-indigo-100'
                    ]"
                    placeholder="请输入采样位置名称"
                  />
                  <div
                    v-if="formErrors.locationName"
                    class="absolute -bottom-5 left-0 text-xs text-red-500"
                  >
                    {{ formErrors.locationName }}
                  </div>
                </div>

                <!-- 位置描述 -->
                <div class="flex flex-col gap-1">
                  <label class="text-sm font-medium text-gray-700">
                    位置描述
                  </label>
                  <textarea
                    v-model="samplerForm.description"
                    rows="3"
                    class="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    placeholder="请输入位置描述（可选）"
                  ></textarea>
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
              @click="addSamplingLocation"
            >
              {{ isSubmitting ? '添加中...' : '确认添加' }}
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
interface SamplerForm {
  locationName: string
  description: string
}

interface SamplingLocation {
  name: string
  sampleId: string
  description?: string
}

interface FormErrors {
  locationName: string
}

interface SamplerData {
  taskId: string
  samplingCounter: number
}

// 定义 emits
const emit = defineEmits<{
  refresh: [location: SamplingLocation]
}>()

// 内部维护的状态
const visible = ref(false)
const isSubmitting = ref(false)
const samplerData = ref<SamplerData>({
  taskId: '',
  samplingCounter: 0
})

// 采样位置表单数据
const samplerForm = reactive<SamplerForm>({
  locationName: '',
  description: ''
})

// 表单错误信息
const formErrors = reactive<FormErrors>({
  locationName: ''
})

// 表单是否有效
const isFormValid = computed(() => {
  return !Object.values(formErrors).some(error => error !== '')
})

/**
 * 校验位置名称
 */
function validateLocationName() {
  if (!samplerForm.locationName.trim()) {
    formErrors.locationName = '请输入采样位置名称'
  } else if (samplerForm.locationName.trim().length < 2) {
    formErrors.locationName = '采样位置名称至少需要2个字符'
  } else if (samplerForm.locationName.trim().length > 50) {
    formErrors.locationName = '采样位置名称不能超过50个字符'
  } else {
    formErrors.locationName = ''
  }
}

/**
 * 校验所有表单字段
 */
function validateForm() {
  validateLocationName()
}

// 监听表单字段变化，实时校验
watch(() => samplerForm.locationName, validateLocationName)

/**
 * 生成样品编号
 * @returns 样品编号
 */
const generateSampleId = (): string => {
  samplerData.value.samplingCounter++
  return `${samplerData.value.taskId}-${samplerData.value.samplingCounter.toString().padStart(3, '0')}`
}

/**
 * 重置表单数据
 */
const resetForm = (): void => {
  Object.assign(samplerForm, {
    locationName: '',
    description: ''
  })

  // 清空错误信息
  Object.assign(formErrors, {
    locationName: ''
  })
}

/**
 * 对外暴露的 open 方法
 * @param data 任务数据
 */
const open = (data: { taskId: string; samplingCounter: number }): void => {
  visible.value = true
  resetForm()
  samplerData.value = { ...data }
}

/**
 * 关闭弹窗
 */
const close = (): void => {
  visible.value = false
  resetForm()
}

/**
 * 添加采样位置
 */
const addSamplingLocation = async (): Promise<void> => {
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
    const newLocation: SamplingLocation = {
      name: samplerForm.locationName.trim(),
      sampleId: generateSampleId(),
      description: samplerForm.description.trim() || undefined
    }

    console.log('添加采样位置:', newLocation)

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 300))

    // 触发刷新事件
    emit('refresh', newLocation)

    // 关闭弹窗
    close()
  } catch (error) {
    console.error('添加采样位置失败:', error)
    alert('添加采样位置失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}

// 对外暴露方法
defineExpose({ open, close })
</script>

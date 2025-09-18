<template>
  <!-- [公共]弹窗-驳回* -->
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
            class="flex items-center justify-between bg-gradient-to-r from-red-500 to-red-600 p-5 text-white"
          >
            <h3 class="text-lg font-semibold">驳回</h3>
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
              <!-- 驳回原因 -->
              <div class="relative flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700">
                  驳回原因 <span class="text-red-500">*</span>
                </label>
                <textarea
                  v-model="formData.remark"
                  :class="[
                    'min-h-[120px] w-full resize-y rounded-lg border bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2',
                    formErrors.remark
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-indigo-100'
                  ]"
                  placeholder="请输入驳回原因"
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
                  : 'bg-gradient-to-r from-red-500 to-red-600 hover:-translate-y-0.5 hover:shadow-lg'
              ]"
              @click="loadDataSubmit"
            >
              {{ isSubmitting ? '提交中...' : '确认驳回' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { OrderStatus } from '@/utils/enum'
import api from '@/api'

// 事件定义
const emit = defineEmits<{ refresh: [] }>()

// 内部维护的状态
const visible = ref(false)
const isSubmitting = ref(false)

// 表单数据
const formData = ref({
  orderId: 0,
  remark: ''
})

// 表单错误信息
const formErrors = ref({
  remark: ''
})

// 表单是否有效
const isFormValid = computed(() => {
  return !Object.values(formErrors.value).some(error => error !== '')
})

/**
 * 校验驳回原因
 */
function validateRemark() {
  if (!formData.value.remark.trim()) {
    formErrors.value.remark = '请输入驳回原因'
  } else if (formData.value.remark.trim().length < 2) {
    formErrors.value.remark = `驳回原因至少需要 2 个字符`
  } else if (formData.value.remark.trim().length > 500) {
    formErrors.value.remark = `驳回原因不能超过 500 个字符`
  } else {
    formErrors.value.remark = ''
  }
}

/**
 * 校验所有表单字段
 */
function validateForm() {
  validateRemark()
}

// 监听驳回原因变化，实时校验
watch(() => formData.value.remark, validateRemark)

/**
 * 重置表单数据
 */
const resetForm = (): void => {
  Object.assign(formData.value, {
    orderId: 0,
    remark: ''
  })

  // 清空错误信息
  Object.assign(formErrors.value, {
    remark: ''
  })
}

/**
 * 对外暴露的 open 方法
 * @param orderId 订单ID
 */
const open = (orderId?: number): void => {
  visible.value = true
  resetForm()

  // 如果有初始数据，设置到表单中，否则重置表单
  if (orderId) {
    Object.assign(formData.value, {
      orderId: orderId || 0,
      remark: ''
    })
  }
}

/**
 * 关闭弹窗
 */
const close = (): void => {
  visible.value = false
  resetForm()
}

/**
 * 处理驳回
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
      statusCode: OrderStatus.REJECTED,
      remark: formData.value.remark.trim() || ''
    }
    await api.loadOrdersStatusChanging(formData.value.orderId, data)

    // 触发刷新事件
    emit('refresh')

    // 关闭弹窗
    close()
  } catch (error) {
    console.error('审核驳回失败:', error)
  } finally {
    isSubmitting.value = false
  }
}

// 对外暴露方法
defineExpose({ open, close })
</script>

<template>
  <!-- [公共]弹窗-修改密码 -->
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
            <h3 class="text-lg font-semibold">修改密码</h3>
            <button
              class="flex h-8 w-8 items-center justify-center rounded-md bg-white bg-opacity-20 text-xl transition-colors duration-200 hover:bg-opacity-30"
              @click="close"
            >
              ×
            </button>
          </div>

          <!-- 弹窗内容 -->
          <div class="max-h-[calc(90vh-300px)] overflow-y-auto p-6">
            <form @submit.prevent="changePassword">
              <div class="space-y-6 pb-4">
                <!-- 旧密码 -->
                <div class="relative flex flex-col gap-1">
                  <label class="text-sm font-medium text-gray-700">
                    旧密码 <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="passwordForm.oldPwd"
                    type="password"
                    :class="[
                      'w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2',
                      formErrors.oldPwd
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                        : 'border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-indigo-100'
                    ]"
                    placeholder="请输入旧密码"
                    @blur="validateOldPassword"
                  />
                  <div
                    v-if="formErrors.oldPwd"
                    class="absolute -bottom-5 left-0 text-xs text-red-500"
                  >
                    {{ formErrors.oldPwd }}
                  </div>
                </div>

                <!-- 新密码 -->
                <div class="relative flex flex-col gap-1">
                  <label class="text-sm font-medium text-gray-700">
                    新密码 <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="passwordForm.newPwd1"
                    type="password"
                    :class="[
                      'w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2',
                      formErrors.newPwd1
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                        : 'border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-indigo-100'
                    ]"
                    placeholder="请输入新密码"
                    @blur="validateNewPassword"
                  />
                  <div
                    v-if="formErrors.newPwd1"
                    class="absolute -bottom-5 left-0 text-xs text-red-500"
                  >
                    {{ formErrors.newPwd1 }}
                  </div>
                </div>

                <!-- 确认新密码 -->
                <div class="relative flex flex-col gap-1">
                  <label class="text-sm font-medium text-gray-700">
                    确认新密码 <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="passwordForm.newPwd2"
                    type="password"
                    :class="[
                      'w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2',
                      formErrors.newPwd2
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                        : 'border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-indigo-100'
                    ]"
                    placeholder="请再次输入新密码"
                    @blur="validateConfirmPassword"
                  />
                  <div
                    v-if="formErrors.newPwd2"
                    class="absolute -bottom-5 left-0 text-xs text-red-500"
                  >
                    {{ formErrors.newPwd2 }}
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
              @click="changePassword"
            >
              {{ isSubmitting ? '提交中...' : '确认修改' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import api from '@/api'

// 密码表单数据类型
interface PasswordForm {
  oldPwd: string
  newPwd1: string
  newPwd2: string
}

// 表单错误类型定义
type FormErrors = {
  oldPwd: string
  newPwd1: string
  newPwd2: string
}

// 定义 emits
const emit = defineEmits<{ refresh: [] }>()

// 内部维护的状态
const visible = ref(false)
const isSubmitting = ref(false)

// 密码表单数据
const passwordForm = ref<PasswordForm>({
  oldPwd: '',
  newPwd1: '',
  newPwd2: ''
})

// 表单错误信息
const formErrors = ref<FormErrors>({
  oldPwd: '',
  newPwd1: '',
  newPwd2: ''
})

// 表单是否有效
const isFormValid = computed(() => {
  return !Object.values(formErrors.value).some(error => error !== '')
})

/**
 * 校验旧密码
 */
function validateOldPassword() {
  if (!passwordForm.value.oldPwd?.trim()) {
    formErrors.value.oldPwd = '请输入旧密码'
  } else if (passwordForm.value.oldPwd.trim().length < 6) {
    formErrors.value.oldPwd = '旧密码至少需要6个字符'
  } else {
    formErrors.value.oldPwd = ''
  }
}

/**
 * 校验新密码
 */
function validateNewPassword() {
  if (!passwordForm.value.newPwd1?.trim()) {
    formErrors.value.newPwd1 = '请输入新密码'
  } else if (passwordForm.value.newPwd1.trim().length < 6) {
    formErrors.value.newPwd1 = '新密码至少需要6个字符'
  } else if (
    passwordForm.value.newPwd1.trim() === passwordForm.value.oldPwd?.trim()
  ) {
    formErrors.value.newPwd1 = '新密码不能与旧密码相同'
  } else {
    formErrors.value.newPwd1 = ''
    // 如果新密码改变了，需要重新校验确认密码
    if (passwordForm.value.newPwd2) {
      validateConfirmPassword()
    }
  }
}

/**
 * 校验确认密码
 */
function validateConfirmPassword() {
  if (!passwordForm.value.newPwd2?.trim()) {
    formErrors.value.newPwd2 = '请确认新密码'
  } else if (
    passwordForm.value.newPwd2.trim() !== passwordForm.value.newPwd1?.trim()
  ) {
    formErrors.value.newPwd2 = '两次输入的新密码不一致'
  } else {
    formErrors.value.newPwd2 = ''
  }
}

/**
 * 校验所有表单字段
 */
function validateForm() {
  validateOldPassword()
  validateNewPassword()
  validateConfirmPassword()
}

// 监听表单字段变化，实时校验
watch(() => passwordForm.value.oldPwd, validateOldPassword)
watch(() => passwordForm.value.newPwd1, validateNewPassword)
watch(() => passwordForm.value.newPwd2, validateConfirmPassword)

/**
 * 重置表单数据
 */
const resetForm = (): void => {
  Object.assign(passwordForm.value, {
    oldPwd: '',
    newPwd1: '',
    newPwd2: ''
  })

  // 清空错误信息
  Object.assign(formErrors.value, {
    oldPwd: '',
    newPwd1: '',
    newPwd2: ''
  })
}

/**
 * 对外暴露的 open 方法
 * 修改密码不需要用户ID，因为是当前登录用户修改自己的密码
 */
const open = (): void => {
  visible.value = true
  resetForm()
}

/**
 * 关闭弹窗
 */
const close = (): void => {
  visible.value = false
  resetForm()
}

/**
 * 修改密码
 */
const changePassword = async (): Promise<void> => {
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
    // 使用用户修改密码API，需要传递旧密码和新密码
    await api.loadAdminUsersPasswordChanging({
      oldPwd: passwordForm.value.oldPwd.trim(),
      newPwd1: passwordForm.value.newPwd1.trim(),
      newPwd2: passwordForm.value.newPwd2.trim()
    })

    // 触发刷新事件
    emit('refresh')

    // 关闭弹窗
    close()
  } catch (error) {
    console.error('修改密码失败:', error)
  } finally {
    isSubmitting.value = false
  }
}

// 对外暴露方法
defineExpose({ open, close })
</script>

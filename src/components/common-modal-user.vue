<template>
  <!-- [公共]弹窗-创建、编辑用户 -->
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
            <h3 class="text-lg font-semibold">用户信息</h3>
            <button
              class="flex h-8 w-8 items-center justify-center rounded-md bg-white bg-opacity-20 text-xl transition-colors duration-200 hover:bg-opacity-30"
              @click="close"
            >
              ×
            </button>
          </div>

          <!-- 弹窗内容 -->
          <div class="max-h-[calc(90vh-300px)] overflow-y-auto p-6">
            <form @submit.prevent="createUser">
              <div class="space-y-6 pb-4">
                <!-- 用户名称 -->
                <div class="relative flex flex-col gap-1">
                  <label class="text-sm font-medium text-gray-700">
                    用户名称 <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="userForm.name"
                    type="text"
                    :class="[
                      'w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2',
                      formErrors.name
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                        : 'border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-indigo-100'
                    ]"
                    placeholder="请输入用户名称"
                  />
                  <div
                    v-if="formErrors.name"
                    class="absolute -bottom-5 left-0 text-xs text-red-500"
                  >
                    {{ formErrors.name }}
                  </div>
                </div>

                <!-- 用户角色 -->
                <div class="relative flex flex-col gap-1">
                  <label class="text-sm font-medium text-gray-700">
                    用户角色 <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="userForm.role"
                    :class="[
                      'w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2',
                      formErrors.role
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                        : 'border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-indigo-100'
                    ]"
                  >
                    <option value="">请选择</option>
                    <option value="admin">系统管理员</option>
                    <option value="sales">销售人员</option>
                    <option value="reviewer">订单审核员</option>
                    <option value="sampling_dispatcher">采样调度员</option>
                    <option value="sampling_staff">采样人员</option>
                    <option value="sample_manager">样品管理员</option>
                    <option value="lab-supervisor">实验室主管</option>
                    <option value="lab-technician">检测员</option>
                    <option value="report_creator">报告编制员</option>
                    <option value="report_reviewer">报告审核员</option>
                    <option value="report_approver">报告审批员</option>
                  </select>
                  <div
                    v-if="formErrors.role"
                    class="absolute -bottom-5 left-0 text-xs text-red-500"
                  >
                    {{ formErrors.role }}
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
              @click="createUser"
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

// 使用工具类型从 SystemUser 中提取 FormErrors 类型
type FormErrors = Pick<SystemUser, 'name' | 'role'>

// 定义 emits
const emit = defineEmits<{ refresh: [] }>()

// 内部维护的状态
const visible = ref(false)
const isSubmitting = ref(false)

// 用户表单数据
const userForm = ref<SystemUser>({
  id: '',
  name: '',
  role: '',
  createdAt: ''
})

// 表单错误信息
const formErrors = ref<FormErrors>({
  name: '',
  role: ''
})

// 表单是否有效
const isFormValid = computed(() => {
  return !Object.values(formErrors.value).some(error => error !== '')
})

/**
 * 校验用户名称
 */
function validateName() {
  if (!userForm.value.name.trim()) {
    formErrors.value.name = '请输入用户名称'
  } else if (userForm.value.name.trim().length < 2) {
    formErrors.value.name = '用户名称至少需要2个字符'
  } else if (userForm.value.name.trim().length > 20) {
    formErrors.value.name = '用户名称不能超过20个字符'
  } else {
    formErrors.value.name = ''
  }
}

/**
 * 校验用户角色
 */
function validateRole() {
  if (!userForm.value.role) {
    formErrors.value.role = '请选择用户角色'
  } else {
    formErrors.value.role = ''
  }
}

/**
 * 校验所有表单字段
 */
function validateForm() {
  validateName()
  validateRole()
}

// 监听表单字段变化，实时校验
watch(() => userForm.value.name, validateName)
watch(() => userForm.value.role, validateRole)

/**
 * 生成用户编号
 * @returns 用户编号
 */
const generateUserId = (): string => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const sequence = String(Date.now() % 10000).padStart(4, '0')
  return `U${year}${month}${day}${sequence}`
}

/**
 * 重置表单数据
 */
const resetForm = (): void => {
  Object.assign(userForm.value, {
    id: '',
    name: '',
    role: '',
    createdAt: ''
  })

  // 清空错误信息
  Object.assign(formErrors.value, {
    name: '',
    role: ''
  })
}

/**
 * 对外暴露的 open 方法
 * @param data 可选的初始数据
 */
const open = (data?: SystemUser): void => {
  visible.value = true
  resetForm()
  // 如果有初始数据，设置到表单中，否则重置表单
  if (data) {
    Object.assign(userForm.value, {
      id: data.id || '',
      name: data.name || '',
      role: data.role || '',
      createdAt: data.createdAt || ''
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
 * 创建用户
 */
const createUser = async (): Promise<void> => {
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
    const newUser: SystemUser = {
      id: userForm.value.id || generateUserId(),
      name: userForm.value.name.trim(),
      role: userForm.value.role,
      createdAt: userForm.value.createdAt || new Date().toISOString()
    }

    console.log('创建用户:', newUser)

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    // 触发刷新事件
    emit('refresh')

    // 关闭弹窗
    close()
  } catch (error) {
    console.error('创建用户失败:', error)
  } finally {
    isSubmitting.value = false
  }
}

// 对外暴露方法
defineExpose({ open, close })
</script>

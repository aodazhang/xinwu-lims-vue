<template>
  <!-- [公共]弹窗-创建、编辑用户* -->
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
            <div class="space-y-6 pb-4">
              <!-- 用户名 -->
              <div class="relative flex flex-col gap-1" v-if="!userForm.id">
                <label class="text-sm font-medium text-gray-700">
                  用户名 <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="userForm.userName"
                  type="text"
                  :class="[
                    'w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2',
                    formErrors.userName
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-indigo-100'
                  ]"
                  placeholder="请输入用户名"
                />
                <div
                  v-if="formErrors.userName"
                  class="absolute -bottom-5 left-0 text-xs text-red-500"
                >
                  {{ formErrors.userName }}
                </div>
              </div>

              <!-- 真实姓名 -->
              <div class="relative flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700">
                  真实姓名 <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="userForm.realName"
                  type="text"
                  :class="[
                    'w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2',
                    formErrors.realName
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-indigo-100'
                  ]"
                  placeholder="请输入真实姓名"
                />
                <div
                  v-if="formErrors.realName"
                  class="absolute -bottom-5 left-0 text-xs text-red-500"
                >
                  {{ formErrors.realName }}
                </div>
              </div>

              <!-- 手机号 -->
              <div class="relative flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700">
                  手机号 <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="userForm.mobile"
                  type="tel"
                  :class="[
                    'w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2',
                    formErrors.mobile
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-indigo-100'
                  ]"
                  placeholder="请输入手机号"
                />
                <div
                  v-if="formErrors.mobile"
                  class="absolute -bottom-5 left-0 text-xs text-red-500"
                >
                  {{ formErrors.mobile }}
                </div>
              </div>

              <!-- 邮箱 -->
              <div class="relative flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700"> 邮箱 </label>
                <input
                  v-model="userForm.email"
                  type="email"
                  :class="[
                    'w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2',
                    formErrors.email
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-indigo-100'
                  ]"
                  placeholder="请输入邮箱（可选）"
                />
                <div
                  v-if="formErrors.email"
                  class="absolute -bottom-5 left-0 text-xs text-red-500"
                >
                  {{ formErrors.email }}
                </div>
              </div>

              <!-- 用户角色 -->
              <div class="relative flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700">
                  用户角色 <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="userForm.roleId"
                  :class="[
                    'w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2',
                    formErrors.roleId
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-indigo-100'
                  ]"
                >
                  <option value="0" disabled>请选择用户角色</option>
                  <option
                    v-for="item in roleList"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ item.roleName }}
                  </option>
                </select>
                <div
                  v-if="formErrors.roleId"
                  class="absolute -bottom-5 left-0 text-xs text-red-500"
                >
                  {{ formErrors.roleId }}
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
import { isArray } from '@/utils/is'
import api from '@/api'

// 表单错误类型定义
type FormErrors = Pick<
  SystemUser,
  'userName' | 'realName' | 'mobile' | 'email'
> & { roleId: string }

// 定义 emits
const emit = defineEmits<{ refresh: [] }>()

// 内部维护的状态
const visible = ref(false)
const isSubmitting = ref(false)
const roleList = ref<SystemRole[]>([])

// 用户表单数据
const userForm = ref<
  Pick<SystemUser, 'id' | 'userName' | 'realName' | 'mobile' | 'email'> & {
    roleId: number
  }
>({
  id: 0,
  userName: '',
  realName: '',
  mobile: '',
  email: '',
  roleId: 0
})

// 表单错误信息
const formErrors = ref<FormErrors>({
  userName: '',
  realName: '',
  mobile: '',
  email: '',
  roleId: ''
})

// 表单是否有效
const isFormValid = computed(() => {
  return !Object.values(formErrors.value).some(error => error !== '')
})

/**
 * 校验用户名
 */
function validateUserName() {
  // 只在新增用户时（id为空）校验用户名
  if (!userForm.value.id) {
    if (!userForm.value.userName?.trim()) {
      formErrors.value.userName = '请输入用户名'
    } else if (userForm.value.userName.trim().length < 2) {
      formErrors.value.userName = '用户名至少需要2个字符'
    } else if (userForm.value.userName.trim().length > 20) {
      formErrors.value.userName = '用户名不能超过20个字符'
    } else {
      formErrors.value.userName = ''
    }
  } else {
    formErrors.value.userName = ''
  }
}

/**
 * 校验真实姓名
 */
function validateRealName() {
  if (!userForm.value.realName?.trim()) {
    formErrors.value.realName = '请输入真实姓名'
  } else if (userForm.value.realName.trim().length < 2) {
    formErrors.value.realName = '真实姓名至少需要2个字符'
  } else if (userForm.value.realName.trim().length > 20) {
    formErrors.value.realName = '真实姓名不能超过20个字符'
  } else {
    formErrors.value.realName = ''
  }
}

/**
 * 校验手机号
 */
function validateMobile() {
  const mobileRegex = /^1[3-9]\d{9}$/
  if (!userForm.value.mobile?.trim()) {
    formErrors.value.mobile = '请输入手机号'
  } else if (!mobileRegex.test(userForm.value.mobile.trim())) {
    formErrors.value.mobile = '请输入正确的手机号格式'
  } else {
    formErrors.value.mobile = ''
  }
}

/**
 * 校验邮箱
 */
function validateEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (
    userForm.value.email?.trim() &&
    !emailRegex.test(userForm.value.email.trim())
  ) {
    formErrors.value.email = '请输入正确的邮箱格式'
  } else {
    formErrors.value.email = ''
  }
}

/**
 * 校验角色选择
 */
function validateRoleId() {
  if (!userForm.value.roleId || userForm.value.roleId === 0) {
    formErrors.value.roleId = '请选择用户角色'
  } else {
    formErrors.value.roleId = ''
  }
}

/**
 * 校验所有表单字段
 */
function validateForm() {
  validateUserName()
  validateRealName()
  validateMobile()
  validateEmail()
  validateRoleId()
}

// 监听表单字段变化，实时校验
watch(() => userForm.value.userName, validateUserName)
watch(() => userForm.value.realName, validateRealName)
watch(() => userForm.value.mobile, validateMobile)
watch(() => userForm.value.email, validateEmail)
watch(() => userForm.value.roleId, validateRoleId)

/**
 * 重置表单数据
 */
const resetForm = (): void => {
  Object.assign(userForm.value, {
    id: 0,
    userName: '',
    realName: '',
    mobile: '',
    email: '',
    roleId: 0
  })

  // 清空错误信息
  Object.assign(formErrors.value, {
    userName: '',
    realName: '',
    mobile: '',
    email: '',
    roleId: ''
  })
}

/**
 * 对外暴露的 open 方法
 * @param data 可选的初始数据
 */
const open = async (data?: SystemUser): Promise<void> => {
  visible.value = true
  isSubmitting.value = false
  roleList.value = []
  resetForm()

  // 如果有初始数据，设置到表单中，否则重置表单
  if (data) {
    Object.assign(userForm.value, {
      id: data.id || 0,
      userName: data.userName || '',
      realName: data.realName || '',
      mobile: data.mobile || '',
      email: data.email || '',
      roleId: isArray(data.roles) ? data.roles[0].id : 0
    })
  }

  const res = await api.loadRoles()
  roleList.value = isArray(res) ? res : []
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
    if (userForm.value.id) {
      await api.loadAdminUsersEdit(userForm.value.id, {
        realName: userForm.value.realName?.trim() || '',
        mobile: userForm.value.mobile?.trim() || '',
        email: userForm.value.email?.trim() || '',
        roleId: userForm.value.roleId
      })
    } else {
      await api.loadAdminUsersAdd({
        userName: userForm.value.userName?.trim() || '',
        realName: userForm.value.realName?.trim() || '',
        mobile: userForm.value.mobile?.trim() || '',
        email: userForm.value.email?.trim() || '',
        roleId: userForm.value.roleId
      })
    }

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

<template>
  <div
    class="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-5"
  >
    <!-- 登录表单容器 -->
    <div
      class="animate-slide-in w-[420px] rounded-3xl bg-white p-10 shadow-2xl"
    >
      <div class="mb-8 text-center">
        <h1 class="mb-3 text-3xl font-bold text-indigo-500">LIMS-XW</h1>
        <p class="text-sm text-gray-500">心吾检测实验室信息管理系统</p>
      </div>
      <form @submit.prevent="handleLogin">
        <div class="relative mb-6">
          <label
            for="username"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            用户名 <span class="text-red-500">*</span>
          </label>
          <input
            id="username"
            v-model="loginForm.username"
            type="text"
            placeholder="请输入用户名"
            :class="[
              'w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2',
              formErrors.username
                ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                : 'border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-indigo-100'
            ]"
            @blur="validateUsername"
          />
          <div
            v-if="formErrors.username"
            class="absolute -bottom-5 left-0 text-xs text-red-500"
          >
            {{ formErrors.username }}
          </div>
        </div>

        <div class="relative mb-8">
          <label
            for="password"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            密码 <span class="text-red-500">*</span>
          </label>
          <input
            id="password"
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            :class="[
              'w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2',
              formErrors.password
                ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                : 'border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-indigo-100'
            ]"
            @blur="validatePassword"
          />
          <div
            v-if="formErrors.password"
            class="absolute -bottom-5 left-0 text-xs text-red-500"
          >
            {{ formErrors.password }}
          </div>
        </div>

        <button
          type="submit"
          class="w-full cursor-pointer rounded-lg border-none bg-gradient-to-r from-indigo-500 to-purple-600 py-4 text-base font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-400/40 active:translate-y-0"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="animate-pulse">登录中...</span>
          <span v-else>登录系统</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { userStore } from '@/store'
import { ROLE_PAGE } from '@/utils/constant'

defineOptions({ name: 'Login' })

const router = useRouter()
const user = userStore()

// 表单数据
const loginForm = ref({
  username: '',
  password: ''
})

// 状态管理
const isLoading = ref(false)
const formErrors = ref({
  username: '',
  password: ''
})

/**
 * 校验用户名
 */
const validateUsername = () => {
  if (!loginForm.value.username.trim()) {
    formErrors.value.username = '请输入用户名'
  } else if (loginForm.value.username.length < 2) {
    formErrors.value.username = '用户名至少2个字符'
  } else {
    formErrors.value.username = ''
  }
}

/**
 * 校验密码
 */
const validatePassword = () => {
  if (!loginForm.value.password.trim()) {
    formErrors.value.password = '请输入密码'
  } else if (loginForm.value.password.length < 6) {
    formErrors.value.password = '密码至少6个字符'
  } else {
    formErrors.value.password = ''
  }
}

/**
 * 校验整个表单
 */
const validateForm = () => {
  validateUsername()
  validatePassword()
  return !formErrors.value.username && !formErrors.value.password
}

/**
 * 处理登录
 */
const handleLogin = async () => {
  // 先进行表单校验
  if (!validateForm()) {
    return
  }

  try {
    isLoading.value = true

    await user.login(loginForm.value.username, loginForm.value.password)
    await user.info()

    // 根据用户角色跳转到对应的首页
    const pathList = ROLE_PAGE[user.role.roleCode] || []
    router.push(pathList[0] || '/')
  } catch (error) {
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
/* 自定义动画 */
@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in {
  animation: slide-in 0.5s ease-out;
}
</style>

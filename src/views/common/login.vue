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
        <div class="mb-5">
          <label
            for="username"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            用户名
          </label>
          <input
            id="username"
            v-model="loginForm.username"
            type="text"
            placeholder="请输入用户名"
            class="focus:ring-3 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-indigo-100"
            required
          />
        </div>

        <div class="mb-8">
          <label
            for="password"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            密码
          </label>
          <input
            id="password"
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            class="focus:ring-3 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-indigo-100"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full cursor-pointer rounded-lg border-none bg-gradient-to-r from-indigo-500 to-purple-600 py-4 text-base font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-400/40 active:translate-y-0"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="animate-pulse">登录中...</span>
          <span v-else>登录系统</span>
        </button>

        <div v-if="errorMessage" class="mt-2 text-xs text-red-500">
          {{ errorMessage }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toolSleep } from '@/utils/tool'
import { ref } from 'vue'
// import { useRouter } from 'vue-router'

defineOptions({ name: 'Login' })

// const router = useRouter()

// 表单数据
const loginForm = ref({
  username: '',
  password: ''
})

// 状态管理
const isLoading = ref(false)
const errorMessage = ref('')
const showSuccessTip = ref(false)

/**
 * 处理登录
 */
const handleLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    errorMessage.value = '请填写完整的登录信息'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // 模拟登录请求
    await toolSleep(1000)

    // 登录成功
    showSuccessTip.value = true
  } catch (error) {
    errorMessage.value = '登录失败，请检查用户名和密码'
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

@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.5s ease-out;
}

.animate-slide-in-right {
  animation: slide-in-right 0.3s ease-out;
}
</style>

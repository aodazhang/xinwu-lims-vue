<template>
  <div
    class="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-5"
  >
    <!-- 403 错误页面容器 -->
    <div
      class="animate-slide-in w-[480px] rounded-3xl bg-white p-10 text-center shadow-2xl"
    >
      <!-- 403 图标 -->
      <div class="mb-8">
        <div
          class="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-red-600 text-4xl font-bold text-white"
        >
          403
        </div>
        <h1 class="mb-3 text-3xl font-bold text-gray-800">访问被拒绝</h1>
        <p class="text-gray-500">
          您当前的用户角色无法访问此功能模块，如需使用请联系系统管理员分配相应权限。
        </p>
      </div>

      <!-- 操作按钮 -->
      <div class="flex flex-col gap-3 lg:flex-row">
        <button
          @click="goBack"
          class="flex-1 cursor-pointer rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50"
        >
          <svg
            class="mr-2 inline-block"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M8 14l-6-6 6-6 1.41 1.41L5.83 7H14v2H5.83l3.58 3.59z" />
          </svg>
          返回上页
        </button>
        <button
          @click="goHome"
          class="flex-1 cursor-pointer rounded-lg border-none bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-400/40 active:translate-y-0"
        >
          <svg
            class="mr-2 inline-block"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path
              d="M8 0L0 6v2h2v8h4V10h4v6h4V8h2V6L8 0zm0 2.5L13 7v1h-2v8h-2V8H7v8H5V8H3V7l5-4.5z"
            />
          </svg>
          回到首页
        </button>
      </div>

      <!-- 联系信息 -->
      <div class="mt-8 border-t border-gray-200 pt-6">
        <p class="mb-2 text-sm font-medium text-gray-700">需要帮助？</p>
        <p class="text-xs text-gray-500">
          请联系系统管理员或发送邮件至
          <a
            href="mailto:admin@xinwu.com"
            class="text-indigo-600 hover:text-indigo-800"
          >
            admin@xinwu.com
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { userStore } from '@/store'
import { ROLE_PAGE } from '@/utils/constant'

defineOptions({ name: 'Forbidden' })

const router = useRouter()
const user = userStore()

/**
 * 返回上一页
 */
const goBack = () => {
  router.go(-1)
}

/**
 * 回到首页
 */
const goHome = () => {
  // 根据用户角色跳转到对应的首页
  const pathList = ROLE_PAGE[user.role.roleCode] || []
  router.replace(pathList[0] || '/')
}
</script>

<style lang="scss" scoped>
@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in {
  animation: slide-in 0.6s ease-out;
}
</style>

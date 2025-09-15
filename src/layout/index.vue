<template>
  <div class="flex h-full w-full flex-col items-stretch">
    <!-- 1.顶部导航栏 -->
    <header
      class="relative z-10 flex h-14 flex-shrink-0 flex-grow-0 flex-nowrap items-center justify-between gap-4 bg-white px-4 shadow"
    >
      <!-- logo + 返回按钮 -->
      <section class="flex flex-nowrap items-center gap-6">
        <div
          class="flex flex-shrink-0 flex-grow-0 flex-nowrap items-center gap-3"
        >
          <svg class="h-9 w-9" width="32" height="32" viewBox="0 0 32 32">
            <path
              d="M16 2L4 8v8c0 7.18 4.82 13.88 12 15.57C23.18 29.88 28 23.18 28 16V8l-12-6z"
              fill="url(#gradient)"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color: #667eea" />
                <stop offset="100%" style="stop-color: #764ba2" />
              </linearGradient>
            </defs>
          </svg>
          <span
            class="md-hidden bg-gradient-to-br from-[#667eea] to-[#764ba2] bg-clip-text text-xl font-semibold text-transparent"
          >
            LIMS-XW
          </span>
        </div>
        <button
          v-if="canBack"
          class="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-[#2c3e50] transition-all duration-300 hover:border-[#667eea] hover:bg-gray-50 hover:text-[#667eea]"
          @click="$router.go(-1)"
        >
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path
              d="M10 18l-8-8 8-8 1.41 1.41L5.83 9H18v2H5.83l5.58 5.59z"
              fill="currentColor"
            />
          </svg>
          <span class="md-hidden">返回</span>
        </button>
      </section>

      <!-- 标题 -->
      <h1
        class="md-hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-base font-bold text-[#64748b]"
      >
        {{ routeTitle }}
      </h1>

      <!-- 用户 -->
      <button
        class="relative flex cursor-pointer items-center gap-2 rounded-3xl bg-transparent px-3 py-1.5 text-[#2c3e50] transition-all duration-300 hover:bg-gray-100"
        @click="toggleDropdown"
      >
        <div
          class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-sm font-bold text-white"
        >
          {{ userInitial }}
        </div>
        <div class="md-hidden text-sm font-medium">{{ user.realName }}</div>
        <svg
          class="transition-transform duration-300"
          :class="{ 'rotate-180': dropdownOpen }"
          width="12"
          height="12"
          viewBox="0 0 12 12"
        >
          <path
            d="M2 4l4 4 4-4"
            stroke="currentColor"
            stroke-width="1.5"
            fill="none"
          />
        </svg>

        <!-- 用户详情 -->
        <div
          v-show="dropdownOpen"
          class="absolute right-0 top-14 w-72 overflow-hidden rounded-xl bg-white shadow-2xl transition-all duration-300"
          :class="{ visible: dropdownOpen }"
        >
          <div
            class="bg-gradient-to-br from-[#667eea] to-[#764ba2] p-5 text-white"
          >
            <div class="flex items-center gap-4">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-xl font-bold text-white"
              >
                {{ userInitial }}
              </div>
              <div
                class="flex flex-auto flex-col flex-nowrap items-start justify-center gap-1"
              >
                <div class="text-base font-semibold">
                  {{ user.realName }}
                </div>
                <div
                  class="inline-block rounded-xl bg-white/20 px-2 py-0.5 text-xs opacity-90"
                >
                  {{ role.roleName }}
                </div>
              </div>
            </div>
          </div>
          <div class="h-px bg-gray-200"></div>
          <ul class="m-0 list-none py-2">
            <li
              @click="handlePassword"
              class="flex cursor-pointer items-center gap-3 border-none bg-none px-5 py-2.5 text-left text-sm text-indigo-600 transition-colors duration-300 hover:bg-indigo-50"
            >
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path
                  d="M8 1a4 4 0 0 1 4 4v2h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1V5a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v2h4V5a2 2 0 0 0-2-2z"
                  fill="currentColor"
                />
              </svg>
              <span>修改密码</span>
            </li>
            <li
              @click="handleLogout"
              class="flex cursor-pointer items-center gap-3 border-none bg-none px-5 py-2.5 text-left text-sm text-red-600 transition-colors duration-300 hover:bg-red-50"
            >
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path
                  d="M11 12l4-4-4-4v3H6v2h5v3zm-8-1v2h10V3H3v2H1V3c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2v-2h2z"
                  fill="currentColor"
                />
              </svg>
              <span>退出登录</span>
            </li>
          </ul>
        </div>
      </button>

      <!-- 修改密码弹窗 -->
      <common-modal-password ref="passwordModalRef" />
    </header>

    <!-- 2.底部内容 -->
    <main id="main" class="flex-auto overflow-y-auto bg-[#f5f7fa]">
      <router-view v-slot="{ Component, route }">
        <transition name="router" mode="out-in">
          <keep-alive :include="[]">
            <component
              class="mx-auto max-w-[1400px] flex-auto overflow-y-auto p-5"
              :is="Component"
              :key="route.fullPath"
            />
          </keep-alive>
        </transition>
      </router-view>
    </main>
  </div>
  <el-backtop target="#main" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { userStore } from '@/store/modules/user'
import CommonModalPassword from '@/components/common-modal-password.vue'

const route = useRoute()
const store = userStore()
const { user, role } = storeToRefs(store)

// 状态管理
const dropdownOpen = ref(false)
const passwordModalRef = ref<InstanceType<typeof CommonModalPassword>>()

// 计算属性
const canBack = computed(() => route.path.indexOf('-dashboard') === -1)

const userInitial = computed(() => {
  return user.value.realName?.charAt(0).toUpperCase()
})

// 监听当前路由 meta 中的 title 值
const routeTitle = computed(
  () => route.meta?.title || import.meta.env.VITE_TITLE
)

// 方法
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const handlePassword = () => {
  dropdownOpen.value = true

  passwordModalRef.value?.open()
}

const handleLogout = () => {
  dropdownOpen.value = true

  if (confirm('确定要退出登录吗？')) {
    store.signout()
  }
}
</script>

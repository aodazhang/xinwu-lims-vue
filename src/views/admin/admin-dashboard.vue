<template>
  <div>
    <!-- 系统管理 -->
    <div class="rounded-2xl bg-white p-8 shadow-lg">
      <h3 class="mb-5 text-xl font-semibold text-gray-800">系统管理</h3>
      <div class="md-grid26 gap-4">
        <button
          @click="goToAdminUser"
          class="group flex cursor-pointer flex-col items-center gap-2.5 rounded-xl bg-gray-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-600 hover:shadow-lg"
        >
          <div
            class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl text-white transition-all duration-300 group-hover:from-gray-50 group-hover:to-gray-50"
          >
            👥
          </div>
          <div
            class="admin-label text-center text-sm text-gray-600 transition-all duration-300 group-hover:text-white"
          >
            员工管理
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { useRouter } from 'vue-router'

defineOptions({ name: 'AdminDashboard' })

// const router = useRouter()

// 跳转到员工管理
const goToAdminUser = () => {
  // TODO: 员工管理页面
}
</script>

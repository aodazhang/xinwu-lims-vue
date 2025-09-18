<template>
  <!-- [公共]详情-人员列表* -->
  <div class="space-y-2">
    <div
      v-for="(user, index) in users"
      :key="index"
      class="flex items-center gap-2.5 rounded-md bg-gray-50 p-2"
    >
      <div
        class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-xs font-bold text-white"
      >
        {{ getUserInitial(user) }}
      </div>
      <div class="flex-1">
        <div class="text-sm font-medium text-gray-900">
          {{ user.userName }}
        </div>
        <div class="text-xs text-gray-600">
          {{ getUserRole(user) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ users: SystemUser[] }>()

/**
 * 获取用户头像首字母
 */
function getUserInitial(user: SystemUser): string {
  return user.userName?.charAt(0).toUpperCase() || ''
}

/**
 * 获取用户角色显示文本
 */
function getUserRole(user: SystemUser): string {
  return user.roles.length ? user.roles[0].roleName : ''
}
</script>

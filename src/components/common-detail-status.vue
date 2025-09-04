<template>
  <!-- [公共]详情-状态指示器 -->
  <div class="rounded-xl bg-white p-5 shadow-sm">
    <!-- 状态 -->
    <div
      :class="[
        'flex items-center justify-center rounded-lg p-5 text-lg font-bold text-white',
        statusClasses[status]
      ]"
    >
      {{ statusText }}
    </div>

    <!-- 描述 -->
    <div class="mt-4 space-y-2" v-if="details.length">
      <div
        v-for="(detail, index) in details"
        :key="index"
        class="flex justify-between text-sm"
      >
        <span class="text-gray-600">{{ detail.label }}</span>
        <span class="font-medium text-gray-900">{{ detail.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface StatusDetail {
  label: string
  value: string
}

defineProps<{
  status: 'pending' | 'approved' | 'sampling' | 'testing' | 'completed'
  statusText: string
  details: StatusDetail[]
}>()

const statusClasses = {
  pending: 'bg-gradient-to-r from-yellow-400 to-yellow-500',
  approved: 'bg-gradient-to-r from-green-400 to-green-500',
  sampling: 'bg-gradient-to-r from-blue-400 to-blue-500',
  testing: 'bg-gradient-to-r from-purple-400 to-purple-500',
  completed: 'bg-gradient-to-r from-green-400 to-green-500'
}
</script>

<template>
  <!-- [公共]详情-时间轴 -->
  <div class="relative pl-10">
    <!-- 时间轴线 -->
    <div class="absolute bottom-0 left-3 top-0 w-0.5 bg-gray-200"></div>

    <div
      v-for="(item, index) in items"
      :key="index"
      class="relative mb-6 last:mb-0"
    >
      <!-- 时间轴点 -->
      <div
        :class="[
          'absolute -left-8 top-1 h-3 w-3 rounded-full border-2',
          item.status === 'completed'
            ? 'border-indigo-600 bg-indigo-600'
            : 'border-gray-400 bg-white'
        ]"
      ></div>

      <!-- 时间轴内容 -->
      <div class="rounded-lg bg-gray-50 p-3">
        <div class="mb-1 text-sm font-medium text-gray-900">
          {{ item.title }}
        </div>
        <div class="mb-1 text-xs text-gray-600">
          {{ item.description }}
        </div>
        <div class="text-xs text-gray-400">
          {{ item.time }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TimelineItem {
  title: string
  description: string
  time: string
  status: 'completed' | 'pending'
}

defineProps<{
  items: TimelineItem[]
}>()
</script>

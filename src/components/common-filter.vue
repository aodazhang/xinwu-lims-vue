<template>
  <!-- [公共]列表-筛选 -->
  <div
    class="mt-5 flex flex-col flex-wrap items-stretch gap-4 md:flex-row md:items-center md:justify-between"
  >
    <!-- 标题 -->
    <h3 class="text-xl font-bold text-gray-800">{{ title }}</h3>

    <div
      class="flex flex-col flex-wrap items-start gap-3 md:flex-row md:items-center"
    >
      <!-- 搜索表单 -->
      <slot></slot>

      <!-- 搜索按钮 -->
      <button
        class="flex items-center gap-1 rounded-md bg-indigo-500 px-4 py-2 text-sm text-white transition-all duration-200 hover:bg-indigo-600"
        @click="$emit('filter')"
      >
        <svg
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        搜索
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()

defineEmits<{
  (e: 'filter'): void
}>()
</script>

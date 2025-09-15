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

      <!-- 按钮区 -->
      <div class="flex shrink-0 grow-0 items-center gap-3">
        <!-- // TODO: 重置按钮 -->
        <!-- <button
          class="flex items-center gap-1 rounded-lg border border-indigo-500 bg-white px-4 py-2 text-sm font-medium text-indigo-500 transition-all duration-200 hover:bg-gray-50"
          @click="$emit('reset')"
        >
          重置
        </button> -->

        <!-- 搜索按钮 -->
        <button
          class="flex items-center gap-1 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm text-white transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/30"
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
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()

// 定义 emits
defineEmits<{
  reset: []
  filter: []
}>()
</script>

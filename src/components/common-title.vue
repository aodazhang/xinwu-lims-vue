<template>
  <!-- [公共]页面-标题* -->
  <header
    class="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center"
  >
    <!-- 标题 -->
    <div>
      <h2 class="text-base font-bold text-gray-800">{{ title }}</h2>
      <div class="text-sm text-gray-500">{{ content }}</div>
    </div>

    <!-- 操作区 -->
    <div class="flex items-center gap-2">
      <slot></slot>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{ title: string; content: string }>()
</script>

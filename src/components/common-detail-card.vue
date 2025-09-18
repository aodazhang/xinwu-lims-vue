<template>
  <!-- [公共]详情-卡片* -->
  <div class="rounded-xl bg-white p-5 shadow-sm">
    <!-- 标题 -->
    <div
      class="mb-4 flex items-center justify-between border-b border-gray-200 pb-3"
    >
      <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      <slot name="control"></slot>
    </div>

    <!-- 内容 -->
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>

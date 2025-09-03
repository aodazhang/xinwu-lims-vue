<template>
  <!-- [公共]统计卡片 -->
  <ul class="md-grid-13 mt-4 gap-5">
    <li
      class="rounded-xl bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      v-for="(item, index) of model"
      :key="index"
    >
      <div class="mb-2 text-sm text-gray-500">{{ item.label }}</div>
      <div class="text-3xl font-bold text-gray-800">{{ item.value }}</div>
    </li>
  </ul>
</template>

<script setup lang="ts">
defineProps<{
  model: { label: string; value: string | number }[]
}>()
</script>

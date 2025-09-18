<template>
  <!-- [公共]列表-统计卡片* -->
  <ul class="mt-4 grid grid-cols-1 gap-5 md:grid-cols-3">
    <li
      class="rounded-xl bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      v-for="(item, index) of details"
      :key="index"
    >
      <div class="mb-2 text-sm text-gray-500">{{ item.label }}</div>
      <div class="text-3xl font-bold text-gray-800">{{ item.value }}</div>
    </li>
  </ul>
</template>

<script setup lang="ts">
defineProps<{ details: LabelValue[] }>()
</script>

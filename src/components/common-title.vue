<template>
  <!-- [公共]标题 -->
  <div>
    <h2 class="text-base font-bold text-gray-800">{{ title }}</h2>
    <div class="text-sm text-gray-500">{{ content }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; content: string }>()
</script>

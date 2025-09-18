<template>
  <!-- [公共]表单-分组* -->
  <div class="mb-8 border-b border-gray-200 pb-6">
    <h3 class="mb-5 flex items-center text-lg font-semibold text-gray-800">
      <div
        class="mr-3 h-5 w-1 rounded bg-gradient-to-b from-indigo-500 to-purple-600"
      ></div>
      {{ title }}
    </h3>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>

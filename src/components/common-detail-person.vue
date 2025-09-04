<template>
  <!-- [公共]详情-人员列表 -->
  <div class="space-y-2">
    <div
      v-for="(person, index) in persons"
      :key="index"
      class="flex items-center gap-2.5 rounded-md bg-gray-50 p-2"
    >
      <div
        class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-xs font-bold text-white"
      >
        {{ person.name.charAt(0) }}
      </div>
      <div class="flex-1">
        <div class="text-sm font-medium text-gray-900">
          {{ person.name }}
        </div>
        <div class="text-xs text-gray-600">
          {{ person.role }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Person {
  name: string
  role: string
}

defineProps<{
  persons: Person[]
}>()
</script>

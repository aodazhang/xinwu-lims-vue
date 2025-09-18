<template>
  <!-- [公共]详情-状态指示器* -->
  <div class="rounded-xl bg-white p-5 shadow-sm">
    <!-- 状态 -->
    <div
      class="flex items-center justify-center rounded-lg p-5 text-lg font-bold"
      :class="statusClasses[progressAndOrderStatusCode]"
    >
      {{ progressAndOrderStatusName }}
    </div>

    <!-- 描述 -->
    <div class="mt-4 space-y-2" v-if="details.length">
      <div
        v-for="(item, index) in details"
        :key="index"
        class="flex justify-between text-sm"
      >
        <span class="text-gray-600">{{ item.label }}</span>
        <span class="font-medium text-gray-900">{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProgressAndOrderStatus } from '@/utils/enum'

defineProps<{
  progressAndOrderStatusCode: string
  progressAndOrderStatusName: string
  details: LabelValue[]
}>()

const statusClasses: Record<string, string> = {
  [ProgressAndOrderStatus.PENDING_REVIEW]:
    'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800',
  [ProgressAndOrderStatus.APPROVED]:
    'bg-gradient-to-r from-green-100 to-green-200 text-green-800',
  [ProgressAndOrderStatus.REJECTED]:
    'bg-gradient-to-r from-red-100 to-red-200 text-red-800',
  [ProgressAndOrderStatus.CANCELLED]:
    'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800',
  [ProgressAndOrderStatus.SAMPLING_TASK]:
    'bg-gradient-to-r from-purple-100 to-purple-200  text-purple-800',
  [ProgressAndOrderStatus.DETECTION_TASK]:
    'bg-gradient-to-r from-purple-100 to-purple-200  text-purple-800',
  [ProgressAndOrderStatus.REPORT]:
    'bg-gradient-to-r from-purple-100 to-purple-200  text-purple-800'
}
</script>

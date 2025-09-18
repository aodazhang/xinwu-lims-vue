<template>
  <!-- [公共]详情-时间轴 -->
  <div class="relative pl-10">
    <!-- 时间轴线 -->
    <div class="absolute bottom-0 left-3 top-0 w-0.5 bg-gray-200"></div>

    <div
      v-for="(item, index) in timelineItems"
      :key="index"
      class="relative mb-6 last:mb-0"
    >
      <!-- 时间轴点 -->
      <div
        :class="[
          'absolute -left-8 top-1 h-3 w-3 rounded-full border-2',
          item.status === 'completed'
            ? 'border-indigo-600 bg-indigo-600'
            : 'border-gray-400 bg-white'
        ]"
      ></div>

      <!-- 时间轴内容 -->
      <div class="rounded-lg bg-gray-50 px-4 py-3">
        <div class="mb-1.5 text-sm font-medium text-gray-900">
          {{ item.title }}
        </div>
        <div class="mb-1 text-xs text-gray-600">
          {{ item.description }}
        </div>
        <div class="text-xs text-gray-400" v-if="item.time">
          {{ item.time }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { OrderStatus } from '@/utils/enum'
import { dateToString } from '@/utils/date'

interface TimelineItem {
  title: string
  description: string
  time?: string
  status: 'completed' | 'pending'
}

const props = defineProps<{ progressList: SalesProgress[] }>()

/**
 * 处理进度数据，生成时间轴项目
 */
const timelineItems = computed<TimelineItem[]>(() => {
  const items: TimelineItem[] = []

  props.progressList.forEach(progress => {
    if (
      progress.statusChangeTraceList &&
      progress.statusChangeTraceList.length > 0
    ) {
      // 如果 statusChangeTraceList 不为空，使用内部数据（已完成状态）
      const titleMap: Record<string, string> = {
        [OrderStatus.PENDING_REVIEW]: '待审核',
        [OrderStatus.APPROVED]: '审核通过',
        [OrderStatus.REJECTED]: '审核驳回',
        [OrderStatus.CANCELLED]: '已取消'
      }
      progress.statusChangeTraceList.forEach(trace => {
        items.push({
          title: `${progress.nodeName}${titleMap[trace.changedStatusCode] || ''}`,
          description: `${trace.changeUserRoleName}：${trace.changeUserRealName} ${trace.remark || ''}`,
          time: dateToString(trace.createTime),
          status: 'completed'
        })
      })
    } else {
      // 如果 statusChangeTraceList 为空，使用外部数据（未完成状态）
      const descriptionMap: Record<string, string> = {
        ORDER: '等待业务创建',
        SAMPLING_TASK: '等待订单完成',
        DETECTION_TASK: '等待采样任务完成',
        REPORT: '等待检测任务完成'
      }
      items.push({
        title: progress.nodeName,
        description: descriptionMap[progress.nodeCode] || '等待上一步完成',
        status: 'pending'
      })
    }
  })

  return items
})
</script>

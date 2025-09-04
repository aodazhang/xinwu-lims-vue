<template>
  <!-- [公共]详情-附件列表 -->
  <div class="space-y-2">
    <div
      v-for="(attachment, index) in attachments"
      :key="index"
      class="flex cursor-pointer items-center gap-2.5 rounded-md bg-gray-50 p-2.5 transition-colors duration-200 hover:bg-gray-100"
      @click="handleFileClick(attachment)"
    >
      <!-- 文件类型 -->
      <div
        class="flex h-8 w-8 items-center justify-center rounded bg-gray-200 text-xs text-gray-600"
      >
        {{ getFileTypeIcon(attachment.name) }}
      </div>

      <!-- 文件信息 -->
      <div class="flex-1">
        <div class="text-sm text-gray-900">
          {{ attachment.name }}
        </div>
        <div class="text-xs text-gray-600">
          {{ attachment.size }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Message from '@/utils/message'

interface Attachment {
  name: string
  size: string
  url?: string
}

defineProps<{
  attachments: Attachment[]
}>()

defineEmits<{
  download: [attachment: Attachment]
  preview: [attachment: Attachment]
}>()

/**
 * 获取文件类型图标
 * @param fileName 文件名
 * @returns 文件类型图标
 */
function getFileTypeIcon(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'pdf':
      return 'PDF'
    case 'doc':
    case 'docx':
      return 'DOC'
    case 'xls':
    case 'xlsx':
      return 'XLS'
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return 'IMG'
    default:
      return 'FILE'
  }
}

/**
 * 处理文件点击事件
 * @param attachment 附件信息
 */
function handleFileClick(attachment: Attachment): void {
  if (!attachment.url) {
    Message.warning('文件URL不存在，无法下载或预览')
    return
  }

  window.open(attachment.url, '_blank')
}
</script>

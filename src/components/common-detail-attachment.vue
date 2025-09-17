<template>
  <!-- [公共]详情-附件列表 -->
  <div class="space-y-2">
    <!-- 附件列表 -->
    <div
      v-for="(attachment, index) in attachmentPayloadList"
      :key="index"
      class="flex cursor-pointer items-center gap-2.5 rounded-md bg-gray-50 p-2.5 transition-colors duration-200 hover:bg-gray-100"
      @click="handleFileClick(attachment)"
    >
      <!-- 文件类型 -->
      <div
        class="flex h-8 w-8 items-center justify-center rounded bg-gray-200 text-xs text-gray-600"
      >
        {{ getFileTypeIcon(attachment.fileName) }}
      </div>

      <!-- 文件信息 -->
      <div class="flex-1">
        <div class="text-sm text-gray-900">
          {{ attachment.fileName }}
        </div>
        <div class="text-xs text-gray-600">
          {{ formatFileSize(attachment.fileSizeByte) }}
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div
      v-if="!attachmentPayloadList || attachmentPayloadList.length === 0"
      class="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-6 text-center"
    >
      <!-- 空状态图标 -->
      <div
        class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100"
      >
        <svg
          class="h-8 w-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>

      <!-- 空状态文字 -->
      <h3 class="mb-2 text-sm font-medium text-gray-900">暂无附件</h3>
      <p class="text-xs text-gray-500">当前没有上传任何附件文件</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toolDownloadUrl } from '@/utils/tool'
import Message from '@/utils/message'

defineProps<{
  attachmentPayloadList: SystemAttachment[]
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
 * 格式化文件大小
 * @param bytes 文件大小（字节）
 * @returns 格式化后的文件大小
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 处理文件点击事件
 * @param file 附件信息
 */
function handleFileClick(file: SystemAttachment): void {
  if (!file.url) {
    Message.warning('文件URL不存在，无法下载或预览')
    return
  }
  toolDownloadUrl(file.url, file.fileName)
}
</script>

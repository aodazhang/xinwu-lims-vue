<template>
  <!-- [公共]页面-消息提示 -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
      @after-leave="handleAfterLeave"
    >
      <div
        v-if="visible"
        :class="[
          'alert fixed left-1/2 top-4 z-50 w-auto max-w-md -translate-x-1/2 py-3 shadow-lg',
          typeClass
        ]"
      >
        <!-- 消息类型 icon -->
        <svg
          v-if="type === 'success'"
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <svg
          v-else-if="type === 'error'"
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <svg
          v-else-if="type === 'info'"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="h-6 w-6 shrink-0 stroke-current"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <svg
          v-else-if="type === 'warning'"
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>

        <!-- 消息内容 -->
        <span>{{ message }}</span>

        <!-- 关闭 -->
        <button class="btn btn-circle btn-ghost btn-xs ml-2" @click="close">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

export interface MessageProps {
  /** 消息内容 */
  message: string
  /** 消息类型 */
  type?: 'success' | 'error' | 'warning' | 'info'
  /** 显示时长，单位毫秒，设为 0 则不自动关闭 */
  duration?: number
  /** 关闭时的回调函数 */
  onClose?: () => void
}

const props = withDefaults(defineProps<MessageProps>(), {
  type: 'info',
  duration: 3000
})

const visible = ref(false)
let timer: number | null = null

// 根据类型计算样式类
const typeClass = computed(() => {
  const typeMap = {
    success: 'alert-success',
    error: 'alert-error',
    warning: 'alert-warning',
    info: 'alert-info'
  }
  return typeMap[props.type]
})

/**
 * 动画完成后的回调
 */
const handleAfterLeave = () => {
  props.onClose?.()
}

/**
 * 关闭消息
 */
const close = () => {
  visible.value = false
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

/**
 * 显示消息
 */
const show = () => {
  visible.value = true

  // 设置自动关闭定时器
  if (props.duration > 0) {
    timer = window.setTimeout(() => {
      close()
    }, props.duration)
  }
}

// 组件挂载后立即显示
onMounted(() => {
  show()
})

// 导出方法供外部调用
defineExpose({
  show,
  close
})
</script>

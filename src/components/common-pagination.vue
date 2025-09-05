<template>
  <!-- [公共]列表-分页器 -->
  <div
    class="mt-5 flex flex-col flex-wrap items-center gap-4 rounded-xl bg-white px-5 py-3 shadow-sm md:flex-row"
  >
    <!-- 记录条数 -->
    <div class="flex-shrink-0 flex-grow-0 text-sm text-gray-500">
      显示
      <strong class="font-semibold text-gray-800">{{ startRecord }}</strong>
      -
      <strong class="font-semibold text-gray-800">{{ endRecord }}</strong>
      条， 共
      <strong class="font-semibold text-gray-800">{{ total }}</strong>
      条记录
    </div>

    <!-- 分页器 -->
    <div
      class="flex flex-auto flex-wrap items-center justify-center gap-2 md:justify-end"
    >
      <button
        class="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 transition-all duration-200 hover:border-indigo-500 hover:bg-gray-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-40"
        :disabled="current === 1"
        @click="goToPage(1)"
      >
        <svg
          class="md-hidden h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="11 17 6 12 11 7"></polyline>
          <polyline points="18 17 13 12 18 7"></polyline>
        </svg>
        首页
      </button>
      <button
        class="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 transition-all duration-200 hover:border-indigo-500 hover:bg-gray-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-40"
        :disabled="current === 1"
        @click="previousPage"
      >
        <svg
          class="md-hidden h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        上一页
      </button>
      <div class="flex gap-1">
        <span v-if="startPage > 1" class="px-2 text-gray-400">...</span>
        <button
          v-for="page in visiblePages"
          :key="page"
          class="flex h-10 min-w-10 cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white text-center text-sm font-medium text-gray-500 transition-all duration-200 hover:border-indigo-500 hover:bg-gray-50 hover:text-indigo-600"
          :class="{
            'border-indigo-600 bg-gradient-to-r from-indigo-600 to-purple-600 !text-white shadow-lg shadow-indigo-500/25':
              page === current
          }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        <span v-if="endPage < totalPages" class="px-2 text-gray-400">...</span>
      </div>
      <button
        class="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 transition-all duration-200 hover:border-indigo-500 hover:bg-gray-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-40"
        :disabled="current === totalPages"
        @click="nextPage"
      >
        下一页
        <svg
          class="md-hidden h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
      <button
        class="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 transition-all duration-200 hover:border-indigo-500 hover:bg-gray-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-40"
        :disabled="current === totalPages"
        @click="goToPage(totalPages)"
      >
        末页
        <svg
          class="md-hidden h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="13 17 18 12 13 7"></polyline>
          <polyline points="6 17 11 12 6 7"></polyline>
        </svg>
      </button>
    </div>

    <!-- 分割线 -->
    <div
      class="h-[1px] w-full flex-shrink-0 flex-grow-0 bg-gray-300 md:h-8 md:w-[1px]"
    ></div>

    <!-- 跳转器 -->
    <div class="flex flex-shrink-0 flex-grow-0 items-center gap-2">
      <p class="flex-shrink-0 flex-grow-0 text-sm text-gray-500">跳转到</p>
      <input
        v-model="jumpPage"
        type="number"
        class="w-16 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        :min="1"
        :max="totalPages"
        placeholder="页码"
        @keypress.enter="jumpToPage"
      />
      <button
        class="cursor-pointer rounded-md border-none bg-gradient-to-r from-indigo-600 to-purple-600 px-3.5 py-2 text-sm font-medium text-white transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/30"
        @click="jumpToPage"
      >
        GO
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  /** 总数据量 */
  total: number
  /** 当前页码 */
  current: number
}

interface Emits {
  /** 页码改变事件 */
  (e: 'current-change', page: number): void
}

const props = defineProps<Props>()

// 固定每页显示 10 条数据
const pageSize = 10

const emit = defineEmits<Emits>()

// 响应式数据
const jumpPage = ref<number | null>(null)

// 计算属性
const totalPages = computed(() => Math.ceil(props.total / pageSize) || 1)

const startRecord = computed(() => {
  return props.total === 0 ? 0 : (props.current - 1) * pageSize + 1
})

const endRecord = computed(() => {
  return Math.min(props.current * pageSize, props.total)
})

// 分页按钮显示逻辑
const startPage = computed(() => Math.max(1, props.current - 2))
const endPage = computed(() => {
  let end = Math.min(totalPages.value, startPage.value + 4)
  if (end - startPage.value < 4) {
    return Math.min(totalPages.value, Math.max(1, end))
  }
  return end
})

const visiblePages = computed(() => {
  const pages: number[] = []
  for (let i = startPage.value; i <= endPage.value; i++) {
    pages.push(i)
  }
  return pages
})

// 分页方法
const goToPage = (page: number) => {
  if (page < 1) page = 1
  if (page > totalPages.value) page = totalPages.value
  if (page !== props.current) {
    emit('current-change', page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const previousPage = () => {
  if (props.current > 1) {
    goToPage(props.current - 1)
  }
}

const nextPage = () => {
  if (props.current < totalPages.value) {
    goToPage(props.current + 1)
  }
}

const jumpToPage = () => {
  if (
    jumpPage.value &&
    jumpPage.value >= 1 &&
    jumpPage.value <= totalPages.value
  ) {
    goToPage(jumpPage.value)
    jumpPage.value = null
  }
}
</script>

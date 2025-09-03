<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">管理员仪表盘</h1>
      <p class="mt-2 text-gray-600">欢迎使用心吾检测管理系统</p>
    </div>

    <!-- 统计卡片 -->
    <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-lg bg-white p-6 shadow">
        <div class="flex items-center">
          <div class="rounded-full bg-blue-100 p-3">
            <svg
              class="h-6 w-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              ></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">总用户数</p>
            <p class="text-2xl font-semibold text-gray-900">1,234</p>
          </div>
        </div>
      </div>

      <div class="rounded-lg bg-white p-6 shadow">
        <div class="flex items-center">
          <div class="rounded-full bg-green-100 p-3">
            <svg
              class="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">完成检测</p>
            <p class="text-2xl font-semibold text-gray-900">567</p>
          </div>
        </div>
      </div>

      <div class="rounded-lg bg-white p-6 shadow">
        <div class="flex items-center">
          <div class="rounded-full bg-yellow-100 p-3">
            <svg
              class="h-6 w-6 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">进行中</p>
            <p class="text-2xl font-semibold text-gray-900">89</p>
          </div>
        </div>
      </div>

      <div class="rounded-lg bg-white p-6 shadow">
        <div class="flex items-center">
          <div class="rounded-full bg-red-100 p-3">
            <svg
              class="h-6 w-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              ></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">异常报告</p>
            <p class="text-2xl font-semibold text-gray-900">12</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div class="rounded-lg bg-white shadow">
        <div class="border-b border-gray-200 p-6">
          <h3 class="text-lg font-medium text-gray-900">快速操作</h3>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <button
              class="flex w-full items-center justify-between rounded-lg bg-blue-50 p-4 transition-colors hover:bg-blue-100"
            >
              <div class="flex items-center">
                <svg
                  class="mr-3 h-5 w-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                <span class="text-gray-900">新建检测任务</span>
              </div>
              <svg
                class="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>

            <button
              class="flex w-full items-center justify-between rounded-lg bg-green-50 p-4 transition-colors hover:bg-green-100"
            >
              <div class="flex items-center">
                <svg
                  class="mr-3 h-5 w-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                <span class="text-gray-900">查看报告</span>
              </div>
              <svg
                class="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>

            <button
              class="flex w-full items-center justify-between rounded-lg bg-purple-50 p-4 transition-colors hover:bg-purple-100"
            >
              <div class="flex items-center">
                <svg
                  class="mr-3 h-5 w-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                <span class="text-gray-900">系统设置</span>
              </div>
              <svg
                class="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 最近活动 -->
      <div class="rounded-lg bg-white shadow">
        <div class="border-b border-gray-200 p-6">
          <h3 class="text-lg font-medium text-gray-900">最近活动</h3>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <div class="mt-2 h-2 w-2 rounded-full bg-green-400"></div>
              </div>
              <div class="flex-1">
                <p class="text-sm text-gray-900">检测任务 #1234 已完成</p>
                <p class="text-xs text-gray-500">2 分钟前</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <div class="mt-2 h-2 w-2 rounded-full bg-blue-400"></div>
              </div>
              <div class="flex-1">
                <p class="text-sm text-gray-900">新用户注册: 张三</p>
                <p class="text-xs text-gray-500">15 分钟前</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <div class="mt-2 h-2 w-2 rounded-full bg-yellow-400"></div>
              </div>
              <div class="flex-1">
                <p class="text-sm text-gray-900">系统维护通知已发送</p>
                <p class="text-xs text-gray-500">1 小时前</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <div class="mt-2 h-2 w-2 rounded-full bg-red-400"></div>
              </div>
              <div class="flex-1">
                <p class="text-sm text-gray-900">检测设备异常报警</p>
                <p class="text-xs text-gray-500">2 小时前</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 管理员仪表盘页面
</script>

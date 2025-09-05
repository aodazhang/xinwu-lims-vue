<template>
  <!-- [公共]弹窗-检测委托单 -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
        @click="close"
      >
        <div
          class="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl transition-all duration-300"
          @click.stop
        >
          <!-- 弹窗头部 -->
          <div
            class="flex items-center justify-between bg-gradient-to-r from-indigo-500 to-purple-600 p-5 text-white"
          >
            <h3 class="text-lg font-semibold">检测委托单</h3>
            <button
              class="flex h-8 w-8 items-center justify-center rounded-md bg-white bg-opacity-20 text-xl transition-colors duration-200 hover:bg-opacity-30"
              @click="close"
            >
              ×
            </button>
          </div>

          <!-- 弹窗内容 -->
          <div class="max-h-[calc(90vh-300px)] overflow-y-auto p-6">
            <div
              class="font-serif rounded-lg border border-gray-200 bg-white p-10 leading-relaxed"
            >
              <div class="mb-8 text-center text-xl font-bold">
                {{ delegateData.standard || 'GB 50325-2020' }} 检测委托单
              </div>
              <div class="space-y-2 text-sm">
                <p><strong>委托单号：</strong>{{ delegateData.taskId }}</p>
                <p>
                  <strong>委托单位：</strong>{{ delegateData.customerName }}
                </p>
                <p><strong>联系人：</strong>{{ delegateData.contactPerson }}</p>
                <p>
                  <strong>联系电话：</strong>{{ delegateData.contactPhone }}
                </p>
                <p>
                  <strong>受检单位：</strong>{{ delegateData.inspectedUnit }}
                </p>
                <p>
                  <strong>受检地址：</strong>{{ delegateData.samplingAddress }}
                </p>
                <p><strong>检测内容：</strong>{{ delegateData.testContent }}</p>
                <p>
                  <strong>检测点数：</strong>{{ delegateData.samplingPoints }}点
                </p>
                <p>
                  <strong>检测标准：</strong
                  >{{
                    delegateData.testStandard ||
                    'GB 50325-2020《民用建筑工程室内环境污染控制标准》'
                  }}
                </p>
                <p v-if="delegateData.specialRequirements">
                  <strong>特殊要求：</strong
                  >{{ delegateData.specialRequirements }}
                </p>
                <p>
                  <strong>委托日期：</strong>{{ delegateData.delegateDate }}
                </p>
                <br />
                <p>委托单位签章：_______________</p>
                <p>
                  日期：{{ delegateData.signDate || delegateData.delegateDate }}
                </p>
              </div>
            </div>
          </div>

          <!-- 弹窗底部 -->
          <div
            class="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 p-4"
          >
            <button
              type="button"
              class="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-md"
              @click="close"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// 定义接口
interface DelegateData {
  taskId: string
  customerName: string
  contactPerson: string
  contactPhone: string
  inspectedUnit: string
  samplingAddress: string
  testContent: string
  samplingPoints: number
  standard?: string
  testStandard?: string
  specialRequirements?: string
  delegateDate: string
  signDate?: string
}

// 内部维护的状态
const visible = ref(false)

// 委托单数据
const delegateData = reactive<DelegateData>({
  taskId: '',
  customerName: '',
  contactPerson: '',
  contactPhone: '',
  inspectedUnit: '',
  samplingAddress: '',
  testContent: '',
  samplingPoints: 0,
  delegateDate: ''
})

/**
 * 重置数据
 */
const resetData = (): void => {
  Object.assign(delegateData, {
    taskId: '',
    customerName: '',
    contactPerson: '',
    contactPhone: '',
    inspectedUnit: '',
    samplingAddress: '',
    testContent: '',
    samplingPoints: 0,
    standard: '',
    testStandard: '',
    specialRequirements: '',
    delegateDate: '',
    signDate: ''
  })
}

/**
 * 对外暴露的 open 方法
 * @param data 委托单数据
 */
const open = (data: DelegateData): void => {
  visible.value = true
  Object.assign(delegateData, data)
}

/**
 * 关闭弹窗
 */
const close = (): void => {
  visible.value = false
  resetData()
}

// 对外暴露方法
defineExpose({ open, close })
</script>

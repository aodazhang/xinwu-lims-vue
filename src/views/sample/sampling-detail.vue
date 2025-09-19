<template>
  <div v-loading="loading">
    <!-- 页面头部 -->
    <common-title
      :title="taskData.projectNumber"
      content="采样调度工作台 / 采样调度详情"
    >
      <button
        v-if="taskData.samplingStatusCode === SamplingTaskStatus.TO_BE_ASSIGNED"
        class="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-blue-600 hover:to-blue-700"
        @click="onClickAssign('assign')"
      >
        立即分派
      </button>
      <button
        v-if="taskData.samplingStatusCode === SamplingTaskStatus.ASSIGNED"
        class="rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-orange-600 hover:to-orange-700"
        @click="onClickAssign('adjust')"
      >
        重新调整
      </button>
    </common-title>

    <!-- 内容布局 -->
    <div class="mt-5 grid grid-cols-1 gap-5 md:grid-cols-[1fr_380px]">
      <!-- 左侧主信息区 -->
      <div class="space-y-5">
        <!-- 客户基本信息 -->
        <common-detail-card title="客户基本信息">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">客户名称</span>
              <span class="text-sm font-medium text-gray-900">
                {{ taskData.customer?.customerName }}
              </span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">客户联系人</span>
              <span class="text-sm font-medium text-gray-900">
                {{ taskData.customer?.contactPerson }}
              </span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">客户联系电话</span>
              <span class="text-sm font-medium text-gray-900">
                {{ taskData.customer?.contactPhone }}
              </span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">受检单位</span>
              <span class="text-sm font-medium text-gray-900">
                {{ taskData.order?.inspectedUnit }}
              </span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">是否加急</span>
              <span
                class="text-sm font-medium"
                :class="
                  taskData.order?.urgentFlag
                    ? 'text-red-500'
                    : 'text-emerald-600'
                "
              >
                {{ taskData.order?.urgentFlag ? '是' : '否' }}
              </span>
            </div>
          </div>
        </common-detail-card>

        <!-- 检测信息 -->
        <common-detail-card title="检测信息">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">采样地址</span>
              <span class="text-sm font-medium text-gray-900">
                {{ taskData.order?.samplingAddress }}
              </span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">采样员</span>
              <span class="text-sm font-medium text-gray-900">
                {{ taskData.samplingUserRealName }}
              </span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">采样日期</span>
              <span class="text-sm font-medium text-gray-900">
                {{ taskData.samplingDate }}
              </span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">采样时间</span>
              <span class="text-sm font-medium text-gray-900">
                {{
                  taskData.samplingStartTime && taskData.samplingEndTime
                    ? `${taskData.samplingStartTime} - ${taskData.samplingEndTime}`
                    : ''
                }}
              </span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">检测点数</span>
              <span class="text-sm font-medium text-gray-900">
                {{ taskData.order?.detectionPoints }}
              </span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">检测类型</span>
              <span class="text-sm font-semibold text-emerald-600">
                {{ taskData.order?.detectionTypeName }}
              </span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">检测分包</span>
              <span
                class="text-sm font-medium"
                :class="
                  taskData.order?.detectionSubcontract
                    ? 'text-red-500'
                    : 'text-emerald-600'
                "
              >
                {{ taskData.order?.detectionSubcontract ? '是' : '否' }}
              </span>
            </div>
          </div>
        </common-detail-card>
      </div>

      <!-- 右侧辅助区 -->
      <div class="space-y-5">
        <!-- 状态指示器 -->
        <common-detail-status
          :progress-and-order-status-code="
            taskData.order?.progressAndOrderStatusCode
          "
          :progress-and-order-status-name="
            taskData.order?.progressAndOrderStatusName
          "
          :details="statusDetails"
        />
      </div>
    </div>

    <!-- 任务分派/调整弹窗 -->
    <common-modal-task ref="taskModalRef" @refresh="loadDataDetail" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { SamplingTaskStatus } from '@/utils/enum'
import { isObject } from '@/utils/is'
import api from '@/api'
import CommonTitle from '@/components/common-title.vue'
import CommonDetailCard from '@/components/common-detail-card.vue'
import CommonDetailStatus from '@/components/common-detail-status.vue'
import CommonModalTask from '@/components/common-modal-task.vue'

defineOptions({ name: 'SamplingDetail' })

// Props
const props = defineProps<{ taskId?: number | string }>()

// 响应式数据
const loading = ref(false)
const taskData = ref<SamplingTask>({
  id: 0,
  createTime: '',
  updateTime: '',
  projectId: 0,
  projectNumber: '',
  samplingUserId: 0,
  samplingUserRealName: '',
  samplingDate: '',
  samplingStartTime: '',
  samplingEndTime: '',
  remark: '',
  samplingStatusCode: '',
  samplingStatusName: '',
  order: {} as SalesOrder,
  customer: {} as SalesCustomer
})
const statusDetails = ref<LabelValue[]>([{ label: '当前阶段', value: '' }])
const taskModalRef = ref<InstanceType<typeof CommonModalTask>>()

// 分派任务
const onClickAssign = (type: 'assign' | 'adjust') => {
  taskModalRef.value?.open(type, taskData.value)
}

// 处理数据请求
const loadDataDetail = async () => {
  try {
    loading.value = true

    const res = await api.loadSamplingTasksDetail(+props.taskId)
    taskData.value = isObject(res)
      ? { ...taskData.value, ...res }
      : taskData.value

    statusDetails.value[0].value =
      taskData.value.order?.detectionProject?.currentProgressName || ''
  } catch (error) {
    console.error('加载采样任务数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  loadDataDetail()
})
</script>

<template>
  <div v-loading="loading">
    <!-- 页面头部 -->
    <common-title :title="orderInfo.id" content="样品管理工作台 / 样品详情">
      <button
        class="flex items-center gap-2 rounded-md bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-2 text-white transition-all hover:from-green-600 hover:to-emerald-700"
        :disabled="!canConfirmReceive"
        @click="confirmReceive"
      >
        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
        确认接收
      </button>
    </common-title>

    <!-- 内容布局 -->
    <div class="mt-5 grid grid-cols-1 gap-5 md:grid-cols-[1fr_380px]">
      <!-- 左侧主信息区 -->
      <div class="space-y-5">
        <!-- 检测基本信息 -->
        <common-detail-card title="检测基本信息">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">受检单位</span>
              <span class="text-sm font-medium text-gray-900">{{
                orderInfo.inspectedUnit
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">采样点数</span>
              <span class="text-sm font-medium text-gray-900">{{
                orderInfo.samplingPoints
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">检测类型</span>
              <span class="text-sm font-medium text-emerald-600">{{
                orderInfo.testType
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">检测内容</span>
              <span class="text-sm font-medium text-emerald-600">{{
                orderInfo.testContent
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">客户名称</span>
              <span class="text-sm font-medium text-gray-900">{{
                orderInfo.customer
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">订单类型</span>
              <span class="text-sm font-medium text-gray-900">{{
                orderInfo.orderType
              }}</span>
            </div>
          </div>
        </common-detail-card>

        <!-- 采样基本信息 -->
        <common-detail-card title="采样基本信息">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">采样人员名称</span>
              <span class="text-sm font-medium text-gray-900">{{
                orderInfo.sampler
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">采样地址</span>
              <span class="text-sm font-medium text-gray-900">{{
                orderInfo.samplingAddress
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">采样完成时间</span>
              <span class="text-sm font-medium text-gray-900">{{
                orderInfo.completionTime
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-600">样品数量</span>
              <span class="text-sm font-semibold text-indigo-600"
                >{{ orderInfo.sampleCount }}个</span
              >
            </div>
          </div>
        </common-detail-card>

        <!-- 样品列表 -->
        <common-detail-card title="样品列表和状态确认">
          <div class="flex flex-col gap-4">
            <div
              v-for="sample in orderInfo.samples"
              :key="sample.id"
              class="rounded-lg border border-gray-200 bg-gray-50 p-5"
            >
              <div
                class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div class="text-base font-semibold text-gray-800">
                    {{ sample.location }}
                  </div>
                  <div class="text-sm font-medium text-indigo-600">
                    {{ sample.id }}
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <div class="flex cursor-pointer items-center gap-2">
                    <input
                      :id="`${sample.id}_good`"
                      v-model="sample.status"
                      type="radio"
                      :name="sample.id"
                      value="good"
                      class="h-4 w-4 cursor-pointer"
                    />
                    <label
                      :for="`${sample.id}_good`"
                      class="cursor-pointer text-sm text-green-600"
                    >
                      完好
                    </label>
                  </div>
                  <div class="flex cursor-pointer items-center gap-2">
                    <input
                      :id="`${sample.id}_damaged`"
                      v-model="sample.status"
                      type="radio"
                      :name="sample.id"
                      value="damaged"
                      class="h-4 w-4 cursor-pointer"
                    />
                    <label
                      :for="`${sample.id}_damaged`"
                      class="cursor-pointer text-sm text-red-500"
                    >
                      破损
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </common-detail-card>
      </div>

      <!-- 右侧状态区 -->
      <div class="space-y-5">
        <!-- 任务状态 -->
        <!-- <common-detail-status
          :status="mappedStatus"
          :status-text="'采样中'"
          :details="orderInfo.statusDetails || []"
        /> -->

        <!-- 待接收样品 -->
        <common-detail-card title="待接收样品">
          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-lg bg-gray-50 p-4 text-center">
              <div class="text-2xl font-bold text-gray-800">
                {{ stats.total }}
              </div>
              <div class="mt-1 text-xs text-gray-500">样品总数</div>
            </div>
            <div class="rounded-lg bg-gray-50 p-4 text-center">
              <div class="text-2xl font-bold text-gray-800">
                {{ stats.good }}
              </div>
              <div class="mt-1 text-xs text-gray-500">完好样品</div>
            </div>
            <div class="rounded-lg bg-gray-50 p-4 text-center">
              <div class="text-2xl font-bold text-gray-800">
                {{ stats.damaged }}
              </div>
              <div class="mt-1 text-xs text-gray-500">破损样品</div>
            </div>
            <div class="rounded-lg bg-gray-50 p-4 text-center">
              <div class="text-2xl font-bold text-gray-800">
                {{ stats.completionRate }}%
              </div>
              <div class="mt-1 text-xs text-gray-500">检查完成率</div>
            </div>
          </div>
        </common-detail-card>

        <!-- 相关人员 -->
        <common-detail-card title="相关人员">
          <!-- <common-detail-person :persons="orderInfo.relatedPersons || []" /> -->
        </common-detail-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Message from '@/utils/message'
import CommonTitle from '@/components/common-title.vue'
import CommonDetailCard from '@/components/common-detail-card.vue'
// import CommonDetailStatus from '@/components/common-detail-status.vue'
// import CommonDetailPerson from '@/components/common-detail-person.vue'

defineOptions({ name: 'SampleDetail' })

// Props
const props = defineProps<{ orderId?: string }>()

const router = useRouter()

const loading = ref(false)

// 订单基本信息
const orderInfo = ref<SampleOrder>({
  id: 'XW250903-100',
  customer: '上海心吾科技有限公司',
  testType: '室内空气检测',
  testContent: '甲醛、苯、TVOC等有害物质检测',
  sampler: '张三',
  samplingDate: '2025-09-03',
  samplingAddress: '上海市浦东新区张江高科技园区',
  completionTime: '2025-09-04 14:30',
  expectedTime: '2025-09-10',
  sampleCount: 12,
  inspectedUnit: '上海心吾科技有限公司',
  samplingPoints: 12,
  orderType: '常规检测',
  isUrgent: true,
  status: 'sampling',
  samples: [
    { id: 'XW250903-100-001', location: '办公室A区域', status: '' },
    { id: 'XW250903-100-002', location: '会议室B区域', status: '' },
    { id: 'XW250903-100-003', location: '休息室C区域', status: '' },
    { id: 'XW250903-100-004', location: '财务室', status: '' }
  ],
  relatedPersons: [
    { id: 1, name: '张三', role: '销售人员' },
    { id: 2, name: '赵六', role: '采样人员' },
    { id: 3, name: '李四', role: '样品管理员' }
  ],
  statusDetails: [
    { label: '当前阶段', value: '样品接收' },
    { label: '优先级', value: '加急', type: 'danger' },
    { label: '采样日期', value: '2025-09-04' },
    { label: '预计检测开始', value: '2025-09-05' }
  ]
})

// 状态映射：将SampleOrder的status映射为common-detail-status组件支持的类型
// const mappedStatus = computed(() => {
//   const statusMap: Record<
//     string,
//     'pending' | 'approved' | 'sampling' | 'testing' | 'completed'
//   > = {
//     waiting: 'pending',
//     received: 'approved',
//     processing: 'sampling',
//     sampling: 'sampling',
//     testing: 'testing',
//     completed: 'completed'
//   }
//   return statusMap[orderInfo.value.status] || 'pending'
// })

// 统计数据
const stats = computed(() => {
  const samples = orderInfo.value.samples || []
  const total = samples.length
  const good = samples.filter(s => s.status === 'good').length
  const damaged = samples.filter(s => s.status === 'damaged').length
  const checked = samples.filter(s => s.status !== '').length
  const completionRate = total > 0 ? Math.round((checked / total) * 100) : 0

  return {
    total,
    good,
    damaged,
    completionRate
  }
})

// 是否可以确认接收
const canConfirmReceive = computed(() => {
  const samples = orderInfo.value.samples || []
  return samples.every(sample => sample.status !== '')
})

/**
 * 加载订单数据
 */
const loadOrderData = async (): Promise<void> => {
  try {
    loading.value = true

    // 从路由参数获取订单ID
    orderInfo.value.id = props.orderId

    // 模拟API调用加载数据
    await new Promise(resolve => setTimeout(resolve, 500))

    console.log('订单数据加载完成:', orderInfo.value.id)
  } catch (error) {
    console.error('加载订单数据失败:', error)
  } finally {
    loading.value = false
  }
}

/**
 * 确认接收样品
 */
const confirmReceive = async () => {
  if (!canConfirmReceive.value) {
    Message.warning('请先检查所有样品状态')
    return
  }

  try {
    loading.value = true

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    const receiveData = {
      orderId: orderInfo.value.id,
      samples: orderInfo.value.samples.map(s => ({
        id: s.id,
        location: s.location,
        status: s.status
      })),
      receiver:
        (orderInfo.value.relatedPersons || []).find(
          p => p.role === '样品管理员'
        )?.name || '未知',
      receiveTime: new Date().toISOString()
    }

    console.log('提交样品接收数据:', receiveData)

    // 返回到样品管理工作台
    router.go(-1)
  } catch (error) {
    if (error !== 'cancel') {
      console.error('确认接收失败:', error)
    }
  } finally {
    loading.value = false
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadOrderData()
})
</script>

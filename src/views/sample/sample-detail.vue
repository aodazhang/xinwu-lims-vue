<template>
  <div class="sample-receive-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="page-title-section">
        <h2 class="page-title">
          <span class="project-number">{{ projectNumber }}</span>
          样品接收
        </h2>
        <div class="breadcrumb">
          <router-link to="/sample-dashboard" class="breadcrumb-link">
            样品管理工作台
          </router-link>
          / 样品接收详情
        </div>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary" @click="returnToWorkbench">
          返回工作台
        </button>
        <button class="btn btn-secondary" @click="printLabels">打印标签</button>
        <button
          class="btn btn-success"
          :disabled="!canConfirmReceive"
          @click="confirmReceive"
        >
          确认接收
        </button>
      </div>
    </div>

    <!-- 内容布局 -->
    <div class="content-layout">
      <!-- 左侧主信息区 -->
      <div class="main-info">
        <!-- 检测基本信息 -->
        <div class="info-card">
          <div class="card-header">检测基本信息</div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">受检单位</span>
              <span class="info-value">{{ orderInfo.customer }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">检测类型</span>
              <span class="info-value">{{ orderInfo.testType }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">采样人员</span>
              <span class="info-value">{{ orderInfo.sampler }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">采样日期</span>
              <span class="info-value">{{ orderInfo.samplingDate }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">采样地址</span>
              <span class="info-value">{{ orderInfo.samplingAddress }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">采样完成时间</span>
              <span class="info-value">{{ orderInfo.completionTime }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">样品数量</span>
              <span class="info-value highlight-value"
                >{{ orderInfo.sampleCount }}个</span
              >
            </div>
          </div>
        </div>

        <!-- 样品列表 -->
        <div class="info-card">
          <div class="card-header">样品列表和状态确认</div>
          <div class="sample-list">
            <div v-for="sample in samples" :key="sample.id" class="sample-item">
              <div class="sample-header">
                <div>
                  <div class="sample-location">{{ sample.location }}</div>
                  <div class="sample-id">{{ sample.id }}</div>
                </div>
                <div class="sample-status-group">
                  <div class="status-option">
                    <input
                      :id="`${sample.id}_good`"
                      v-model="sample.status"
                      type="radio"
                      :name="sample.id"
                      value="good"
                      @change="updateStats"
                    />
                    <label :for="`${sample.id}_good`" class="status-good">
                      完好
                    </label>
                  </div>
                  <div class="status-option">
                    <input
                      :id="`${sample.id}_damaged`"
                      v-model="sample.status"
                      type="radio"
                      :name="sample.id"
                      value="damaged"
                      @change="updateStats"
                    />
                    <label :for="`${sample.id}_damaged`" class="status-damaged">
                      破损
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 确认接收按钮 -->
        <button
          class="complete-receive-btn"
          :disabled="!canConfirmReceive"
          @click="confirmReceive"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            style="margin-right: 8px"
          >
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
          确认样品接收
        </button>
      </div>

      <!-- 右侧状态区 -->
      <div class="side-info">
        <!-- 接收统计 -->
        <div class="status-card">
          <div class="status-indicator">
            <div class="status-text">待接收样品</div>
          </div>
          <div class="receive-stats">
            <div class="stat-item">
              <div class="stat-number">{{ stats.total }}</div>
              <div class="stat-label">样品总数</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ stats.good }}</div>
              <div class="stat-label">完好样品</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ stats.damaged }}</div>
              <div class="stat-label">破损样品</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ stats.completionRate }}%</div>
              <div class="stat-label">检查完成率</div>
            </div>
          </div>
        </div>

        <!-- 任务状态 -->
        <div class="status-card">
          <div class="status-indicator">
            <div class="status-text">任务状态</div>
          </div>
          <div class="task-progress">
            <div class="progress-item completed">
              <div class="progress-icon">✓</div>
              <div class="progress-text">采样完成</div>
            </div>
            <div class="progress-item active">
              <div class="progress-icon">●</div>
              <div class="progress-text">样品接收</div>
            </div>
            <div class="progress-item">
              <div class="progress-icon">○</div>
              <div class="progress-text">实验检测</div>
            </div>
            <div class="progress-item">
              <div class="progress-icon">○</div>
              <div class="progress-text">报告生成</div>
            </div>
          </div>
        </div>

        <!-- 接收人员信息 -->
        <div class="status-card">
          <div class="status-indicator">
            <div class="status-text">接收人员</div>
          </div>
          <div class="person-info">
            <div class="person-avatar">
              {{ receiverInfo.name.charAt(0) }}
            </div>
            <div class="person-details">
              <div class="person-name">{{ receiverInfo.name }}</div>
              <div class="person-role">{{ receiverInfo.role }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

defineOptions({ name: 'SampleDetail' })

/**
 * 样品数据接口
 */
interface Sample {
  id: string
  location: string
  status: 'good' | 'damaged' | ''
}

/**
 * 订单信息接口
 */
interface OrderInfo {
  customer: string
  testType: string
  sampler: string
  samplingDate: string
  samplingAddress: string
  completionTime: string
  sampleCount: number
}

/**
 * 接收人员信息接口
 */
interface ReceiverInfo {
  name: string
  role: string
}

const router = useRouter()
const route = useRoute()

// 响应式数据
const projectNumber = ref('XW250903-100')
const loading = ref(false)

// 订单基本信息
const orderInfo = ref<OrderInfo>({
  customer: '广州环保科技总部',
  testType: '室内空气质量检测',
  sampler: '张三',
  samplingDate: '2025-09-04',
  samplingAddress: '广州市天河区科技园A栋3楼',
  completionTime: '2025-09-04 16:30',
  sampleCount: 12
})

// 样品列表
const samples = ref<Sample[]>([
  { id: 'XW250903-100-001', location: '办公室A区域', status: 'good' },
  { id: 'XW250903-100-002', location: '会议室B区域', status: 'good' },
  { id: 'XW250903-100-003', location: '休息室C区域', status: 'good' },
  { id: 'XW250903-100-004', location: '财务室', status: 'damaged' },
  { id: 'XW250903-100-005', location: '总经理办公室', status: 'good' },
  { id: 'XW250903-100-006', location: '人事部', status: 'good' },
  { id: 'XW250903-100-007', location: '技术部', status: 'good' },
  { id: 'XW250903-100-008', location: '市场部', status: 'good' },
  { id: 'XW250903-100-009', location: '前台接待区', status: 'good' },
  { id: 'XW250903-100-010', location: '会议室D区域', status: 'good' },
  { id: 'XW250903-100-011', location: '储物间', status: 'good' },
  { id: 'XW250903-100-012', location: '茶水间', status: 'good' }
])

// 接收人员信息
const receiverInfo = ref<ReceiverInfo>({
  name: '李四',
  role: '样品管理员'
})

// 统计数据
const stats = computed(() => {
  const total = samples.value.length
  const good = samples.value.filter(s => s.status === 'good').length
  const damaged = samples.value.filter(s => s.status === 'damaged').length
  const checked = samples.value.filter(s => s.status !== '').length
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
  return samples.value.every(sample => sample.status !== '')
})

/**
 * 更新统计数据
 */
const updateStats = () => {
  // 统计数据通过计算属性自动更新
}

/**
 * 打印标签
 */
const printLabels = () => {
  ElMessage.info('打印标签功能开发中...')
}

/**
 * 确认接收样品
 */
const confirmReceive = async () => {
  if (!canConfirmReceive.value) {
    ElMessage.warning('请先检查所有样品状态')
    return
  }

  const damagedSamples = samples.value.filter(s => s.status === 'damaged')
  let confirmMessage = '确认接收所有样品吗？'

  if (damagedSamples.length > 0) {
    confirmMessage = `检测到 ${damagedSamples.length} 个破损样品，确认接收吗？\n破损样品可能影响检测结果的准确性。`
  }

  try {
    await ElMessageBox.confirm(confirmMessage, '确认接收', {
      confirmButtonText: '确认接收',
      cancelButtonText: '取消',
      type: 'warning'
    })

    loading.value = true

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    const receiveData = {
      projectNumber: projectNumber.value,
      samples: samples.value.map(s => ({
        id: s.id,
        location: s.location,
        status: s.status
      })),
      receiver: receiverInfo.value.name,
      receiveTime: new Date().toISOString()
    }

    console.log('提交样品接收数据:', receiveData)

    ElMessage.success(
      `样品接收已确认！\n完好样品：${stats.value.good} 个\n破损样品：${stats.value.damaged} 个\n\n系统将自动通知实验室管理员安排检测任务。`
    )

    // 返回到样品管理工作台
    router.push('/sample-dashboard')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('确认接收失败:', error)
      ElMessage.error('确认接收失败，请重试')
    }
  } finally {
    loading.value = false
  }
}

/**
 * 返回工作台
 */
const returnToWorkbench = () => {
  router.push('/sample-dashboard')
}

/**
 * 加载订单数据
 */
const loadOrderData = async () => {
  try {
    loading.value = true

    // 从路由参数获取项目编号
    const orderId = route.query.orderId as string
    if (orderId) {
      projectNumber.value = orderId
    }

    // 模拟API调用加载数据
    await new Promise(resolve => setTimeout(resolve, 500))

    console.log('订单数据加载完成:', projectNumber.value)
  } catch (error) {
    console.error('加载订单数据失败:', error)
    ElMessage.error('加载订单数据失败')
  } finally {
    loading.value = false
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadOrderData()
})
</script>

<style scoped>
/* 主容器 */
.sample-receive-container {
  @apply mx-auto max-w-7xl p-5;
}

/* 页面头部 */
.page-header {
  @apply mb-6 flex items-center justify-between;
}

.page-title-section {
  @apply flex-1;
}

.page-title {
  @apply mb-2 flex items-center gap-3 text-3xl font-bold text-gray-800;
}

.project-number {
  @apply text-indigo-600;
}

.breadcrumb {
  @apply text-sm text-gray-500;
}

.breadcrumb-link {
  @apply text-indigo-600 no-underline hover:underline;
}

.page-actions {
  @apply flex gap-3;
}

.btn {
  @apply cursor-pointer rounded-md border-0 px-5 py-2.5 text-sm font-medium transition-all duration-200;
}

.btn-secondary {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
}

.btn-success {
  @apply bg-green-600 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400;
}

/* 内容布局 */
.content-layout {
  @apply grid grid-cols-1 gap-6 lg:grid-cols-3;
}

.main-info {
  @apply space-y-6 lg:col-span-2;
}

.side-info {
  @apply space-y-6;
}

/* 信息卡片 */
.info-card {
  @apply overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm;
}

.card-header {
  @apply border-b border-gray-200 bg-gray-50 px-6 py-4 font-semibold text-gray-800;
}

.info-grid {
  @apply grid grid-cols-1 gap-4 p-6 md:grid-cols-2;
}

.info-item {
  @apply flex flex-col gap-1;
}

.info-label {
  @apply text-sm text-gray-500;
}

.info-value {
  @apply text-sm font-medium text-gray-800;
}

.highlight-value {
  @apply text-lg font-semibold text-indigo-600;
}

/* 样品列表 */
.sample-list {
  @apply flex flex-col gap-4 p-6;
}

.sample-item {
  @apply rounded-lg border border-gray-200 bg-gray-50 p-5;
}

.sample-header {
  @apply flex items-center justify-between;
}

.sample-location {
  @apply text-base font-semibold text-gray-800;
}

.sample-id {
  @apply text-sm font-medium text-indigo-600;
}

.sample-status-group {
  @apply flex items-center gap-4;
}

.status-option {
  @apply flex cursor-pointer items-center gap-2;
}

.status-option input[type='radio'] {
  @apply h-4 w-4 cursor-pointer;
}

.status-option label {
  @apply cursor-pointer text-sm;
}

.status-good {
  @apply text-green-600;
}

.status-damaged {
  @apply text-red-500;
}

/* 状态卡片 */
.status-card {
  @apply overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm;
}

.status-indicator {
  @apply border-b border-gray-200 bg-blue-50 px-4 py-3;
}

.status-text {
  @apply font-semibold text-gray-800;
}

/* 接收统计 */
.receive-stats {
  @apply grid grid-cols-2 gap-3 p-4;
}

.stat-item {
  @apply rounded-lg bg-gray-50 p-4 text-center;
}

.stat-number {
  @apply text-2xl font-bold text-gray-800;
}

.stat-label {
  @apply mt-1 text-xs text-gray-500;
}

/* 任务进度 */
.task-progress {
  @apply space-y-3 p-4;
}

.progress-item {
  @apply flex items-center gap-3;
}

.progress-icon {
  @apply flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold;
}

.progress-item.completed .progress-icon {
  @apply bg-green-100 text-green-600;
}

.progress-item.active .progress-icon {
  @apply bg-blue-100 text-blue-600;
}

.progress-item:not(.completed):not(.active) .progress-icon {
  @apply bg-gray-100 text-gray-400;
}

.progress-text {
  @apply text-sm text-gray-700;
}

/* 人员信息 */
.person-info {
  @apply flex items-center gap-3 p-4;
}

.person-avatar {
  @apply flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-base font-bold text-white;
}

.person-details {
  @apply flex-1;
}

.person-name {
  @apply text-sm font-semibold text-gray-800;
}

.person-role {
  @apply text-xs text-gray-500;
}

/* 确认接收按钮 */
.complete-receive-btn {
  @apply flex w-full cursor-pointer items-center justify-center rounded-lg border-0 bg-green-600 px-6 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-green-700 hover:shadow-lg disabled:transform-none disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-layout {
    @apply grid-cols-1;
  }

  .info-grid {
    @apply grid-cols-1;
  }

  .sample-header {
    @apply flex-col items-start gap-2;
  }

  .sample-status-group {
    @apply w-full justify-start;
  }

  .page-actions {
    @apply flex-col gap-2;
  }

  .btn {
    @apply w-full;
  }
}
</style>

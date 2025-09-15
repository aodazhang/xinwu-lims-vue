/**
 * @description 业务 API 接口定义
 */

declare global {
  // ==================== 公共 ====================

  /** 通用请求 */
  interface CommonResponse<T = any> {
    /** 是否成功 */
    success: boolean
    /** 是否失败 */
    fail: boolean
    /** 接口说明信息 */
    message: string
    /** 接口失败 code */
    code: string
    /** 数据 */
    data: T
    /** 时间戳 */
    timestamp: number
  }

  /** 通用分页列表 */
  interface CommonList<T = any> {
    /** 内容项 */
    content: T[]
    /** 总计数据量 */
    totalElements: number
  }

  // ==================== 系统管理 ====================

  /** 系统用户 */
  interface SystemUser {
    /** 用户ID */
    id: number
    /** 创建时间 */
    createTime: string
    /** 更新时间 */
    updateTime: string
    /** 用户名 */
    userName: string
    /** 密码 */
    password: string
    /** 手机号 */
    mobile: string
    /** 真实姓名 */
    realName: string
    /** 邮箱 */
    email?: string | null
    /** 用户角色列表 */
    roles: SystemRole[]
  }

  /** 系统角色 */
  interface SystemRole {
    /** 角色ID */
    id: number
    /** 创建时间 */
    createTime: string
    /** 更新时间 */
    updateTime: string
    /** 角色代码 */
    roleCode: string
    /** 角色名称 */
    roleName: string
    /** 备注 */
    remark?: string | null
  }

  // ==================== 业务管理 ====================

  /** 销售订单 */
  interface SalesOrder {
    /** 订单ID */
    id?: number
    /** 项目编号 */
    projectId?: string
    /** 订单编号 */
    orderNumber?: string
    /** 是否紧急订单 */
    urgent: boolean | 'yes' | 'no'
    /** 客户名称 */
    customerName: string
    /** 客户联系人 */
    customerContact?: string
    /** 客户联系电话 */
    customerPhone?: string
    /** 受检单位 */
    inspectedUnit?: string
    /** 受检单位 */
    inspectionUnit?: string
    /** 项目金额 */
    amount?: number
    /** 项目金额 */
    projectAmount?: number | null
    /** 实收金额 */
    receivedAmount?: number | null
    /** 创建时间 */
    createTime?: string
    /** 采样地址 */
    samplingAddress?: string
    /** 检测点数 */
    testPoints: number | null
    /** 检测类型 */
    testType: string
    /** 检测内容 */
    testContent?: string
    /** 服务类型 */
    serviceType?: string
    /** 订单类型 */
    orderType?: string
    /** 备注 */
    remark?: string
    /** 销售备注 */
    salesRemark?: string
    /** 订单状态 */
    status?: 'pending' | 'approved' | 'sampling' | 'testing' | 'completed'
    /** 状态文本 */
    statusText?: string
    /** 状态详情 */
    statusDetails?: StatusDetailItem[]
    /** 时间轴项目 */
    timelineItems?: TimelineItem[]
    /** 相关人员 */
    relatedPersons?: RelatedPerson[]
    /** 附件列表 */
    attachments?: AttachmentInfo[]
  }

  /** 销售客户 */
  interface SalesCustomer {
    /** 客户ID/编号 */
    id: string
    /** 客户ID（别名，兼容 customer-management.vue） */
    customerId?: string
    /** 客户名称 */
    name: string
    /** 客户名称（别名，兼容 customer-management.vue） */
    customerName?: string
    /** 联系人姓名 */
    contactName: string
    /** 联系人电话 */
    contactPhone: string
    /** 客户地址 */
    address?: string
    /** 客户分类 */
    category?: string
    /** 客户来源 */
    source: string
    /** 客户状态：active-已成交 | public-公海 | following-跟进中 */
    status: 'active' | 'public' | 'following' | string
    /** 所属行业 */
    industry?: string
    /** 创建时间 */
    createdAt?: string
  }

  /** 审核订单 */
  interface ReviewOrder {
    /** 订单ID */
    id: string
    /** 订单编号 */
    orderNumber: string
    /** 是否紧急订单 */
    isUrgent: boolean
    /** 销售人员 */
    salesperson: string
    /** 提交时间 */
    submitTime: string
    /** 客户信息 */
    customer: {
      /** 客户名称 */
      name: string
      /** 联系人 */
      contact: string
      /** 联系电话 */
      phone: string
    }
    /** 检测信息 */
    testing: {
      /** 委托单位 */
      unit: string
      /** 检测地址 */
      address: string
      /** 服务类型 */
      serviceType: string
      /** 检测类型 */
      testType: string
      /** 检测内容 */
      testContent: string
    }
    /** 财务信息 */
    finance: {
      /** 总金额 */
      totalAmount: number
      /** 已付金额 */
      paidAmount: number
      /** 待付金额 */
      pendingAmount: number
    }
  }

  // ==================== 现场作业 ====================

  /** 采样调度任务 */
  interface SamplingTask {
    /** 任务ID */
    id: string
    /** 项目编号 */
    projectNumber?: string
    /** 委托单位名称 */
    company: string
    /** 客户名称 */
    customerName?: string
    /** 联系人姓名 */
    contactPerson?: string
    /** 联系人电话 */
    contactPhone?: string
    /** 检验单位 */
    inspectionUnit?: string
    /** 采样地址 */
    address: string
    /** 采样地址（详情页字段名） */
    samplingAddress?: string
    /** 采样点数量 */
    points?: number
    /** 采样点数量（详情页字段名） */
    samplingPoints?: string
    /** 检测类型 */
    testType?: string
    /** 检测内容 */
    testContent?: string
    /** 检测项目列表 */
    testItems?: string[]
    /** 特殊要求 */
    specialRequirements?: string
    /** 任务优先级：紧急 | 普通 */
    priority?: 'urgent' | 'normal'
    /** 是否紧急任务 */
    isUrgent?: boolean
    /** 任务创建时间 */
    createTime: string
    /** 截止时间 */
    deadline?: string
    /** 分派人员姓名 */
    assignedStaff?: string
    /** 分派日期 */
    assignedDate?: string
    /** 分派时间段 */
    assignedTime?: string
    /** 预计耗时 */
    duration?: string
    /** 任务状态：今日任务 | 已安排 | 待处理 | 已审批 | 采样中 | 检测中 | 已完成 */
    status?:
      | 'today'
      | 'scheduled'
      | 'pending'
      | 'approved'
      | 'sampling'
      | 'testing'
      | 'completed'
    /** 状态文本描述 */
    statusText?: string
    /** 状态详情 */
    statusDetails?: {
      /** 标签 */
      label: string
      /** 值 */
      value: string
      /** 类型 */
      type?: string
    }[]
  }

  /** 采样任务 */
  interface SamplerTask {
    /** 任务ID */
    id: string
    /** 任务ID（详情页字段名） */
    taskId?: string
    /** 委托单位名称 */
    company?: string
    /** 采样地址 */
    address?: string
    /** 采样地址（详情页字段名） */
    samplingAddress?: string
    /** 检测类型 */
    testType: string
    /** 检测内容 */
    testContent?: string
    /** 采样点数量 */
    points?: number
    /** 采样点数量（详情页字段名） */
    samplingPoints?: number
    /** 任务状态：待处理 | 进行中 | 采样中 | 已完成 */
    status: 'pending' | 'ongoing' | 'sampling' | 'completed'
    /** 状态文本描述 */
    statusText?: string
    /** 是否紧急任务 */
    isUrgent: boolean
    /** 预定采样时间 */
    scheduledTime: string
    /** 任务创建时间 */
    createTime?: string
    /** 客户名称 */
    customerName?: string
    /** 联系人姓名 */
    contactPerson?: string
    /** 联系人电话 */
    contactPhone?: string
    /** 被检单位 */
    inspectedUnit?: string
    /** 采样员姓名 */
    sampler?: string
    /** 服务类型 */
    serviceType?: string
    /** 检测项目列表 */
    testItems?: string[]
    /** 采样位置列表 */
    samplingLocations?: {
      /** 采样点名称 */
      name: string
      /** 样品ID */
      sampleId: string
    }[]
    /** 状态详情 */
    statusDetails?: {
      /** 标签 */
      label: string
      /** 值 */
      value: string
      /** 类型 */
      type?: string
    }[]
  }

  /** 采样员 */
  interface SamplerStaff {
    /** 人员ID */
    id: number
    /** 人员姓名 */
    name: string
    /** 人员状态 */
    status: string
    /** 当前任务数量 */
    tasks: number
  }

  /** 样品管理订单 */
  interface SampleOrder {
    /** 订单ID */
    id: string
    /** 客户名称 */
    customer: string
    /** 样品数量 */
    sampleCount: number
    /** 采样员姓名 */
    sampler: string
    /** 检测类型 */
    testType: string
    /** 检测内容 */
    testContent?: string
    /** 预期完成时间 */
    expectedTime: string
    /** 采样日期 */
    samplingDate?: string
    /** 采样地址 */
    samplingAddress?: string
    /** 完成时间 */
    completionTime?: string
    /** 受检单位 */
    inspectedUnit?: string
    /** 采样点数 */
    samplingPoints?: number
    /** 订单类型 */
    orderType?: string
    /** 是否紧急订单 */
    isUrgent: boolean
    /** 订单状态：等待中 | 已接收 | 处理中 | 采样中 | 检测中 | 已完成 */
    status:
      | 'waiting'
      | 'received'
      | 'processing'
      | 'sampling'
      | 'testing'
      | 'completed'
    samples?: {
      /** 样品ID */
      id: string
      /** 采样位置 */
      location: string
      /** 样品状态：完好 | 破损 | 未知 */
      status: 'good' | 'damaged' | ''
    }[]
    /** 相关人员 */
    relatedPersons?: {
      /** 人员ID */
      id: number
      /** 姓名 */
      name: string
      /** 角色 */
      role: string
    }[]
    /** 状态详情 */
    statusDetails?: {
      /** 标签 */
      label: string
      /** 值 */
      value: string
      /** 类型 */
      type?: string
    }[]
  }
}

export {}

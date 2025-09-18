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
    /** 手机号 */
    mobile: string
    /** 真实姓名 */
    realName: string
    /** 邮箱 */
    email: string
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
    remark: string
  }

  /** 系统字典 */
  interface SystemDict {
    /** 字典ID */
    id: number
    /** 创建时间 */
    createTime: string
    /** 更新时间 */
    updateTime: string
    /** 字典类型编码 */
    dicTypeCode: string
    /** 字典类型名称 */
    dicTypeName: string
    /** 字典编码 */
    dicCode: string
    /** 字典值 */
    dicValue: string
    /** 序号 */
    serialNumber: number
  }

  /** 系统附件 */
  interface SystemAttachment {
    /** 附件ID */
    id?: number
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
    /** 附件所属类型 */
    hostType?: string
    /** 附件所属ID */
    hostId?: number
    /** 附件备注 */
    remark?: string
    /** 附件URL地址 */
    url: string
    /** 附件文件名 */
    fileName: string
    /** 附件文件大小(字节) */
    fileSizeByte: number
  }

  // ==================== 业务管理 ====================

  /** 销售订单 */
  interface SalesOrder {
    /** 订单ID */
    id: number
    /** 创建时间 */
    createTime: string
    /** 更新时间 */
    updateTime: string

    /** 项目编号 */
    projectNumber: string
    /** 紧急标志 */
    urgentFlag: boolean

    /** 客户ID */
    customerId: number
    /** 客户代码 */
    customerCode: string
    /** 客户名称 */
    customerName: string
    /** 客户信息 */
    customer: SalesCustomer
    /** 被检单位 */
    inspectedUnit: string

    /** 采样地址 */
    samplingAddress: string
    /** 检测类型ID */
    detectionTypeId: number
    /** 检测类型名称 */
    detectionTypeName: string
    /** 检测项目标准 */
    orderDetectionItemList: (
      | {
          /** 检测项目标准 id */
          id?: number
          /** 关联订单 id */
          orderId?: number
          /** 创建时间 */
          createTime?: string
          /** 更新时间 */
          updateTime?: string
          /** 检测项目 id */
          detectionItemId: number
          /** 检测标准 id */
          detectionItemStandardId: number
        }
      | string
    )[]
    /** 服务类型ID */
    serviceTypeId: number
    /** 服务类型代码 */
    serviceTypeCode: string
    /** 服务类型名称 */
    serviceTypeName: string
    /** 检测点数 */
    detectionPoints: number
    /** 样品存储ID */
    sampleStorageId: number
    /** 样品存储编码 */
    sampleStorageCode: string
    /** 样品存储名称 */
    sampleStorageName: string
    /** 样品处置ID */
    sampleDisposalId: number
    /** 样品处置编码 */
    sampleDisposalCode: string
    /** 样品处置名称 */
    sampleDisposalName: string
    /** 样品处置其他说明 */
    sampleDisposalOther: string
    /** 检测分包 */
    detectionSubcontract: boolean
    /** 分包项目 */
    subcontractProject: string
    /** 特殊要求 */
    specialRequirements: string
    /** 报告交付ID */
    reportDeliveryId: number
    /** 报告交付编码 */
    reportDeliveryCode: string
    /** 报告交付名称 */
    reportDeliveryName: string
    /** 报告交付其他说明 */
    reportDeliveryOther: string

    /** 销售人员ID */
    saleUserId: number
    /** 销售人员真实姓名 */
    saleUserRealName: string
    /** 项目金额 */
    projectAmount: number
    /** 实收金额 */
    actualAmount: number
    /** 销售备注 */
    salesRemark: string

    /** 附件列表 */
    attachmentPayloadList: SystemAttachment[]

    /** 订单类型ID */
    orderTypeId: number
    /** 订单类型代码 */
    orderTypeCode: string
    /** 订单类型名称 */
    orderTypeName: string
    /** 订单状态代码 */
    orderStatusCode: string
    /** 订单状态名称 */
    orderStatusName: string
    /** 订单状态备注 */
    orderStatusRemark: string
    /** 进度和订单状态代码 */
    progressAndOrderStatusCode: string
    /** 进度和订单状态名称 */
    progressAndOrderStatusName: string

    /** 检测项目信息 */
    detectionProject: {
      /** 项目ID */
      id: number
      /** 创建时间 */
      createTime: string
      /** 更新时间 */
      updateTime: string
      /** 项目编号 */
      projectNumber: string
      /** 客户ID */
      customerId: number
      /** 当前进度代码 */
      currentProgressCode: string
      /** 当前进度名称 */
      currentProgressName: string
      /** 订单类型代码 */
      orderTypeCode: string
      /** 订单类型名称 */
      orderTypeName: string
      /** 紧急标志 */
      urgentFlag: boolean
    }
  }

  /** 销售客户 */
  interface SalesCustomer {
    /** 客户ID */
    id: number
    /** 创建时间 */
    createTime: string
    /** 更新时间 */
    updateTime: string
    /** 客户编码 */
    customerCode: string
    /** 客户名称 */
    customerName: string
    /** 联系人姓名 */
    contactPerson: string
    /** 联系人电话 */
    contactPhone: string
    /** 客户地址 */
    customerAddress: string
    /** 客户分类ID */
    customerCategoryId: number
    /** 客户分类编码 */
    customerCategoryCode: string
    /** 客户分类名称 */
    customerCategoryName: string
    /** 客户来源ID */
    customerSourceId: number
    /** 客户来源编码 */
    customerSourceCode: string
    /** 客户来源名称 */
    customerSourceName: string
    /** 客户状态ID */
    customerStatusId: number
    /** 客户状态编码 */
    customerStatusCode: string
    /** 客户状态名称 */
    customerStatusName: string
    /** 行业ID */
    industryId: number
    /** 行业编码 */
    industryCode: string
    /** 行业名称 */
    industryName: string
  }

  /** 销售检测类型 */
  interface SalesDetectionType {
    /** 检测类型ID */
    id: number
    /** 创建时间 */
    createTime: string
    /** 更新时间 */
    updateTime: string
    /** 检测类型名称 */
    detectionTypeName: string
    /** 样品类别 */
    sampleCategory: string
  }

  /** 销售检测项目 */
  interface SalesDetectionProject {
    /** 检测项目ID */
    id: number
    /** 创建时间 */
    createTime: string
    /** 更新时间 */
    updateTime: string
    /** 检测类型ID */
    detectionTypeId: number
    /** 检测项目名称 */
    detectionItemName: string
    /** 检测项目标准列表 */
    detectionItemStandardList: {
      /** 标准ID */
      id: number
      /** 创建时间 */
      createTime: string
      /** 更新时间 */
      updateTime: string
      /** 检测项目ID */
      detectionItemId: number
      /** 标准方法 */
      standardMethod: string
      /** 标准编号 */
      standardNumber: string
      /** 备注 */
      remark: string | null
    }[]
  }

  /** 销售进度 */
  interface SalesProgress {
    /** 进度ID */
    id: number
    /** 创建时间 */
    createTime: string
    /** 更新时间 */
    updateTime: string
    /** 项目ID */
    projectId: number
    /** 节点代码 */
    nodeCode: string
    /** 节点名称 */
    nodeName: string
    /** 序列号 */
    serialNumber: number
    /** 完成状态代码 */
    completedStatusCode: string
    /** 状态变更跟踪列表 */
    statusChangeTraceList: {
      /** 跟踪ID */
      id: number
      /** 创建时间 */
      createTime: string
      /** 更新时间 */
      updateTime: string
      /** 项目ID */
      projectId: number
      /** 项目编号 */
      projectNumber: string
      /** 主机类型代码 */
      hostTypeCode: string
      /** 主机ID */
      hostId: number
      /** 原状态代码 */
      origStatusCode: string
      /** 变更用户ID */
      changeUserId: number
      /** 变更用户角色 */
      changeUserRole: string
      /** 变更用户角色名称 */
      changeUserRoleName: string
      /** 备注 */
      remark: string
      /** 变更后状态代码 */
      changedStatusCode: string
      /** 变更用户真实姓名 */
      changeUserRealName: string
      /** 变更后状态名称 */
      changedStatusName: string
    }[]
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

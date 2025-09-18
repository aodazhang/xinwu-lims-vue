/**
 * @description 枚举
 */

/** 编码类型 content-type */
export enum ContentType {
  /** json 请求 */
  Json = 'application/json;charset=UTF-8',
  /**  */
  UrlEncoded = 'application/x-www-form-urlencoded;charset:UTF-8',
  /** form 表单请求 */
  Form = 'multipart/form-data'
}

/** 内容类型枚举 mimetype */
export enum MimeType {
  /** 图片：jpg、jpeg、jpe */
  Jpg = 'image/jpeg',
  /** 图片：png */
  Png = 'image/png',
  /** 图片：gif */
  Gif = 'image/gif',
  /** 图片：bmp */
  Bmp = 'image/bmp',
  /** 视频：mp4 */
  Mp4 = 'video/mp4',
  /** 视频：mov */
  Mov = 'video/quicktime',
  /** 文件：pdf */
  Pdf = 'application/pdf',
  /** 文件：doc、dot */
  Doc = 'application/msword',
  /** 文件：docx */
  Docx = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  /** 文件：xls */
  Xls = 'application/vnd.ms-excel',
  /** 文件：xlsx */
  Xlsx = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  /** 文件：xlsm */
  Xlsm = 'application/vnd.ms-excel.addin.macroEnabled.12',
  /** 文件：xlsb */
  Xlsb = 'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
  /** 文件：ppt、pot、pps、ppa */
  Ppt = 'application/vnd.ms-powerpoint',
  /** 文件：pptx */
  Pptx = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  /** 文件：txt */
  Txt = 'text/plain',
  /** 压缩包：rar */
  Rar = 'application/x-rar-compressed',
  /** 压缩包：zip */
  Zip = 'application/zip'
}

/** 用户角色 */
export enum UserRole {
  /** [系统管理]系统管理员 */
  ADMIN = 'ADMIN',

  /** [业务管理]销售人员 */
  SALES_PERSON = 'SALES_PERSON',
  /** [业务管理]订单审核员 */
  ORDER_REVIEWER = 'ORDER_REVIEWER',

  /** [现场作业]采样调度员 */
  SAMPLING_DISPATCHER = 'SAMPLING_DISPATCHER',
  /** [现场作业]采样人员 */
  SAMPLING_OPERATOR = 'SAMPLING_OPERATOR',
  /** [现场作业]样品管理员 */
  SAMPLE_MANAGER = 'SAMPLE_MANAGER',

  /** [实验室检测]实验室主管 */
  LAB_SUPERVISOR = 'LAB_SUPERVISOR',
  /** [实验室检测]实验室检测员 */
  LAB_TECHNICIAN = 'LAB_TECHNICIAN',

  /** [报告管理]报告编制员 */
  REPORT_WRITER = 'REPORT_WRITER',
  /** [报告管理]报告审核员 */
  REPORT_REVIEWER = 'REPORT_REVIEWER',
  /** [报告管理]报告批准人 */
  REPORT_APPROVER = 'REPORT_APPROVER'
}

/** 字典类型 */
export enum DictType {
  /** 客户分类 */
  CUSTOMER_CATEGORY = 'CUSTOMER_CATEGORY',
  /** 客户来源 */
  CUSTOMER_SOURCE = 'CUSTOMER_SOURCE',
  /** 客户状态 */
  CUSTOMER_STATUS = 'CUSTOMER_STATUS',
  /**  */
  DETECTION_TASK_STATUS = 'DETECTION_TASK_STATUS',
  /** 检测类型 */
  DETECTION_TYPE = 'DETECTION_TYPE',
  /** 宿主类型 */
  HOST_TYPE = 'HOST_TYPE',
  /** 所属行业 */
  INDUSTRY = 'INDUSTRY',
  /** 订单状态 */
  ORDER_STATUS = 'ORDER_STATUS',
  /** 订单类型 */
  ORDER_TYPE = 'ORDER_TYPE',
  /** 报告交付 */
  REPORT_DELIVERY = 'REPORT_DELIVERY',
  /** 报告状态 */
  REPORT_STATUS = 'REPORT_STATUS',
  /** 样品处置 */
  SAMPLE_DISPOSAL = 'SAMPLE_DISPOSAL',
  /** 样品储存 */
  SAMPLE_STORAGE = 'SAMPLE_STORAGE',
  /**  */
  SAMPLING_TASK_STATUS = 'SAMPLING_TASK_STATUS',
  /** 服务类型 */
  SERVICE_TYPE = 'SERVICE_TYPE'
}

/** 订单状态 */
export enum OrderStatus {
  /** 待审核 */
  PENDING_REVIEW = 'PENDING_REVIEW',
  /** 审核通过 */
  APPROVED = 'APPROVED',
  /** 审核驳回 */
  REJECTED = 'REJECTED',
  /** 已取消 */
  CANCELLED = 'CANCELLED'
}

/** 进度和订单状态 // TODO: 枚举及其相关 UI 逻辑统一化 */
export enum ProgressAndOrderStatus {
  /** 待审核 */
  PENDING_REVIEW = 'ORDER:PENDING_REVIEW',
  /** 审核通过 */
  APPROVED = 'ORDER:APPROVED',
  /** 审核驳回 */
  REJECTED = 'ORDER:REJECTED',
  /** 已取消 */
  CANCELLED = 'ORDER:CANCELLED',
  /** 采样中 */
  SAMPLING_TASK = 'SAMPLING_TASK',
  /** 检测中 */
  DETECTION_TASK = 'DETECTION_TASK',
  /** 报告中 */
  REPORT = 'REPORT'
}

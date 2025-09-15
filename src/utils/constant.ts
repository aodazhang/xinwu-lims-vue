/**
 * @description 常量
 */
import { UserRole } from './enum'

/** 角色-可访问页面 */
export const ROLE_PAGE: { [key: string]: string[] } = {
  // 系统管理-系统管理员
  [UserRole.ADMIN]: ['/admin-dashboard', '/user-management'],

  // 业务管理-销售人员
  [UserRole.SALES_PERSON]: [
    '/sales-dashboard',
    '/sales-detail',
    '/sales-form',
    '/customer-management',
    '/customer-detail'
  ],
  // 业务管理-订单审核员
  [UserRole.ORDER_REVIEWER]: ['/review-dashboard', '/review-detail'],

  // 现场作业-采样调度员
  [UserRole.SAMPLING_DISPATCHER]: ['/sampling-dashboard', '/sampling-detail'],
  // 现场作业-采样人员
  [UserRole.SAMPLING_OPERATOR]: ['/sampler-dashboard', '/sampler-detail'],
  // 现场作业-样品管理员
  [UserRole.SAMPLE_MANAGER]: ['/sample-dashboard', '/sample-detail'],

  // 实验室检测-实验室主管
  [UserRole.LAB_SUPERVISOR]: [],
  // 实验室检测-实验室检测员
  [UserRole.LAB_TECHNICIAN]: [],

  // 报告管理-报告编制员
  [UserRole.REPORT_WRITER]: [],
  // 报告管理-报告审核员
  [UserRole.REPORT_REVIEWER]: [],
  // 报告管理-报告批准人
  [UserRole.REPORT_APPROVER]: []
}

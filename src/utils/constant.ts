/**
 * @description 常量
 */

/** 角色-可访问页面 */
export const ROLE_PAGE: { [key: string]: string[] } = {
  // TODO: 更新角色 code
  admin: ['/admin-dashboard', '/user-management'],
  sales: [
    '/sales-dashboard',
    '/sales-detail',
    '/sales-form',
    '/customer-management',
    '/customer-detail'
  ],
  review: ['/review-dashboard', '/review-detail'],
  SAMPLING_OPERATOR: ['/sampling-dashboard', '/sampling-detail'],
  sampler: ['/sampler-dashboard', '/sampler-detail'],
  sample: ['/sample-dashboard', '/sample-detail']
}

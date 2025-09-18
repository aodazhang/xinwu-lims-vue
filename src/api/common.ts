import axios, { HttpStatusCode } from 'axios'
import { userStore } from '@/store'
import { ContentType } from '@/utils/enum'
import { isBlob, isString } from '@/utils/is'
import Message from '@/utils/message'

/** http 状态响应码 */
const statusMap = new Map([
  [HttpStatusCode.BadRequest, '请求异常，请稍后重试'],
  [HttpStatusCode.Unauthorized, '登录已过期，请重新登录'],
  [HttpStatusCode.Forbidden, '您没有足够的权限访问该资源'],
  [HttpStatusCode.NotFound, '请求错误，未找到该资源'],
  [HttpStatusCode.MethodNotAllowed, 'http 请求方法未允许'],
  [HttpStatusCode.RequestTimeout, '请求超时，请稍后重试'],
  [HttpStatusCode.InternalServerError, '服务器异常，请稍后重试'],
  [HttpStatusCode.NotImplemented, '网络未实现'],
  [HttpStatusCode.BadGateway, '网络错误'],
  [HttpStatusCode.ServiceUnavailable, '服务不可用'],
  [HttpStatusCode.GatewayTimeout, '网络超时'],
  [HttpStatusCode.HttpVersionNotSupported, 'http 版本不支持该请求']
])

const instance = axios.create({
  withCredentials: false,
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 10000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': ContentType.Json
  },
  responseType: 'json'
})

instance.interceptors.request.use(
  config => {
    // [登录]增加登录态
    const token = userStore().token
    isString(token) && (config.headers['X-Auth-Token'] = token)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  response => {
    // [数据类型]blob 流直接返回
    if (isBlob(response.data)) {
      return response.data
    }
    const { success, message, data } = (response.data as CommonResponse) || {}
    // [业务]处理业务数据异常
    if (success !== true) {
      Message.error(message)
      return Promise.reject(message)
    }
    return data
  },
  error => {
    const { status } = error.response
    const { message } = error.response.data || {}
    const reason = isString(message) ? message : statusMap.get(status)
    Message.error(reason)
    // [登录]token 失效强制登出
    if (status === HttpStatusCode.Unauthorized) {
      userStore().signout()
    }
    return Promise.reject(reason)
  }
)

export function loadDictionaries(params: unknown): Promise<SystemDict[]> {
  return instance.get('/dictionaries', { params })
}

export function loadLogin(data: unknown): Promise<{ token: string }> {
  return instance.post('/login', data)
}

export function loadCurrentUser(): Promise<SystemUser> {
  return instance.get('/current-user')
}

export function loadRoles(): Promise<SystemRole[]> {
  return instance.get('/roles')
}

export function loadAdminUsers(
  params: unknown
): Promise<CommonList<SystemUser>> {
  return instance.get('/admin/users', { params })
}

export function loadAdminUsersDetail(id: number): Promise<SystemUser> {
  return instance.get(`/admin/users/${id}`)
}

export function loadAdminUsersAdd(data: unknown): Promise<void> {
  return instance.post('/admin/users', data)
}

export function loadAdminUsersEdit(id: number, data: unknown): Promise<void> {
  return instance.post(`/admin/users/${id}`, data)
}

export function loadAdminUsersPasswordReset(id: number): Promise<void> {
  return instance.post(`/admin/users/${id}/password-reset`)
}

export function loadAdminUsersPasswordChanging(data: unknown): Promise<void> {
  return instance.post('/password-changing', data)
}

export function loadCustomers(
  params: unknown
): Promise<CommonList<SalesCustomer>> {
  return instance.get('/customers', { params })
}

export function loadCustomersDetail(id: number): Promise<SalesCustomer> {
  return instance.get(`/customers/${id}`)
}

export function loadCustomersAdd(data: unknown): Promise<void> {
  return instance.post('/customers', data)
}

export function loadCustomersEdit(id: number, data: unknown): Promise<void> {
  return instance.post(`/customers/${id}`, data)
}

export function loadOrders(params: unknown): Promise<CommonList<SalesOrder>> {
  return instance.get('/orders', { params })
}

export function loadOrdersDetail(id: number): Promise<SalesOrder> {
  return instance.get(`/orders/${id}`)
}

export function loadOrdersAdd(data: unknown): Promise<void> {
  return instance.post('/orders', data)
}

export function loadOrdersEdit(id: number, data: unknown): Promise<void> {
  return instance.put(`/orders/${id}`, data)
}

export function loadOrdersStatusChanging(
  id: number,
  data: unknown
): Promise<void> {
  // DictType.ORDER_STATUS
  return instance.put(`/orders/${id}/status-changing`, data)
}

export function loadDetectionTypes(): Promise<SalesDetectionType[]> {
  return instance.get('/detection-types')
}

export function loadDetectionItems(
  params: unknown
): Promise<SalesDetectionProject[]> {
  return instance.get('/detection-items', { params })
}

export function loadDetectionProgress(id: number): Promise<SalesProgress[]> {
  return instance.get(`/detection-projects/${id}/progress`)
}

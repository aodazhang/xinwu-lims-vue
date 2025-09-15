/**
 * @description 权限控制方案
 */
import router from './router'
import { userStore } from './store'
import { ROLE_PAGE } from './utils/constant'
import { isNumber, isString } from './utils/is'

/** 白名单页面（非登录态允许访问） */
const whiteList = ['/login', '/403']

router.beforeEach(async (to, _from, next) => {
  // 更新页面标题
  document.title = isString(to.meta?.title)
    ? to.meta.title
    : import.meta.env.VITE_TITLE

  const user = userStore()

  if (user.token) {
    /**
     * 1.登录态
     * - 若 不存在有效用户id 则 重新获取用户信息及角色
     * - 访问白名单页：放行
     * - 访问权限页：判断是否有对应权限，有则进入对应页面
     * - 访问其他页：重定向到 403 页
     */
    if (!isNumber(user.user.id)) {
      await user.info().catch(error => error)
    }
    const pathList = ROLE_PAGE[user.role.roleCode] || []
    if (whiteList.includes(to.path) || pathList.includes(to.path)) {
      next()
    } else {
      next({ path: '/403' })
    }
  } else {
    /**
     * 2.非登录态
     * - 访问白名单页：放行
     * - 访问其他页：重定向到登录页
     */
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next({ path: '/login', replace: true })
    }
  }
})

import { createApp, type App } from 'vue'
import MessageComponent, {
  type MessageProps
} from '@/components/common-message.vue'

// 消息实例管理
const instances: App[] = []

/**
 * 创建消息实例
 * @param options 消息配置选项
 * @returns 消息实例
 */
function createMessage(options: MessageProps) {
  // 创建容器元素
  const container = document.createElement('div')
  document.body.appendChild(container)

  // 创建 Vue 应用实例
  const app = createApp(MessageComponent, {
    ...options,
    onClose: () => {
      // 清理实例
      app.unmount()
      document.body.removeChild(container)

      // 从实例列表中移除
      const index = instances.indexOf(app)
      if (index > -1) {
        instances.splice(index, 1)
      }

      // 调用用户传入的 onClose 回调
      options.onClose?.()
    }
  })

  // 挂载应用
  app.mount(container)

  // 添加到实例列表
  instances.push(app)

  return app
}

/**
 * 消息提示 API
 */
export const Message = {
  /**
   * 显示成功消息
   * @param message 消息内容
   * @param options 其他配置选项
   */
  success(message: string, options?: Omit<MessageProps, 'message' | 'type'>) {
    return createMessage({
      message,
      type: 'success',
      ...options
    })
  },

  /**
   * 显示错误消息
   * @param message 消息内容
   * @param options 其他配置选项
   */
  error(message: string, options?: Omit<MessageProps, 'message' | 'type'>) {
    return createMessage({
      message,
      type: 'error',
      ...options
    })
  },

  /**
   * 显示警告消息
   * @param message 消息内容
   * @param options 其他配置选项
   */
  warning(message: string, options?: Omit<MessageProps, 'message' | 'type'>) {
    return createMessage({
      message,
      type: 'warning',
      ...options
    })
  },

  /**
   * 显示信息消息
   * @param message 消息内容
   * @param options 其他配置选项
   */
  info(message: string, options?: Omit<MessageProps, 'message' | 'type'>) {
    return createMessage({
      message,
      type: 'info',
      ...options
    })
  },

  /**
   * 关闭所有消息
   */
  closeAll() {
    instances.forEach(app => {
      app.unmount()
    })
    instances.length = 0

    // 清理所有消息容器
    const containers = document.querySelectorAll('[data-message-container]')
    containers.forEach(container => {
      document.body.removeChild(container)
    })
  }
}

// 默认导出
export default Message

/**
 * @description 公共组件接口定义
 */

declare global {
  /** 表格配置 */
  interface TableConfig {
    /** 表格 loading */
    loading?: boolean
    /** 表格数据 key */
    rowKey: string
    /** 表格是否开启多选（默认 false） */
    selection?: boolean
    /** 表格多选数组 */
    selectionRows?: unknown[]
    /** 表格的高度，超出滚动 */
    height?: string | number
    /** 是否使用分页器 */
    pagination?: boolean
    /** 总数据量 */
    total?: number
    /** 当前页码 */
    current?: number
  }

  /** 表格列配置 */
  interface TableColumn {
    /** 列名 */
    label: string
    /** 列映射 key */
    props: string
    /** 最小宽度（默认 80） */
    minWidth?: number
    /** 宽度（默认 auto） */
    width?: number
    /** 列对其方式（默认left） */
    align?: string | 'left' | 'center' | 'right'
    /** 插槽名 */
    slotName?: string
  }

  /** 标签值 */
  interface LabelValue {
    /** 标签 */
    label: string
    /** 值 */
    value: string
  }
}

export {}

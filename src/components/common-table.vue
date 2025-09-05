<template>
  <!-- [公共]列表-表格 + 分页器 -->
  <section
    class="mt-5 overflow-hidden rounded-xl"
    v-loading="config.loading === true"
  >
    <el-table
      class="rounded-xl bg-white shadow-sm"
      :header-cell-style="{
        padding: '10px 0',
        backgroundColor: '#f9fafc',
        color: '#6b7280'
      }"
      :height="config.height || null"
      :row-key="config.rowKey"
      :data="model"
      @selection-change="rows => (config.selectionRows = rows)"
    >
      <!-- 多选框列 -->
      <el-table-column
        v-if="config.selection === true"
        type="selection"
        width="60"
        align="center"
      />
      <!-- 普通、插槽列 -->
      <el-table-column
        v-for="(
          { label, props, minWidth, width, align, slotName }, index
        ) of items"
        :key="index"
        :label="label"
        :prop="props"
        :min-width="`${
          typeof minWidth === 'number' && minWidth > 80 ? minWidth : 80
        }`"
        :width="`${typeof width === 'number' ? width : 'auto'}`"
        :align="align || 'left'"
      >
        <template #default="{ row, $index }">
          <slot
            v-if="slotName"
            :name="slotName"
            :scope="row"
            :props="props"
            :index="$index"
          ></slot>
          <span v-else v-html="row[props]"></span>
        </template>
      </el-table-column>
    </el-table>
    <common-pagination
      v-if="config.pagination === true"
      :total="config.total"
      :current="config.current"
      @current-change="
        current => {
          config.current = current
          $emit('current-change')
        }
      "
    />
  </section>
</template>

<script setup lang="ts">
import CommonPagination from './common-pagination.vue'

defineProps<{
  /** 表格配置 */
  config: {
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
  /** 表格列头 */
  items: {
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
  }[]
  /** 表格数据 */
  model: unknown[]
}>()

defineEmits<{ 'current-change': [] }>()
</script>

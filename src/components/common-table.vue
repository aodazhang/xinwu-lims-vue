<template>
  <!-- [公共]表格 -->
  <el-table
    class="mt-5 rounded-xl bg-white shadow-sm"
    :header-cell-style="{
      padding: '10px 0',
      backgroundColor: '#f9fafb',
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
</template>

<script setup lang="ts">
defineProps<{
  /** 表格配置 */
  config: {
    /** 表格数据 key */
    rowKey: string
    /** 表格是否开启多选（默认 false） */
    selection?: boolean
    /** 表格多选数组 */
    selectionRows?: unknown[]
    /** 表格的高度，超出滚动 */
    height?: string | number
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
</script>

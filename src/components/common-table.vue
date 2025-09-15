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
      <!-- 序号列 -->
      <el-table-column
        type="index"
        width="60"
        label="序号"
        align="center"
        fixed="left"
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
  config: TableConfig
  /** 表格列头 */
  items: TableColumn[]
  /** 表格数据 */
  model: unknown[]
}>()

defineEmits<{ 'current-change': [] }>()
</script>

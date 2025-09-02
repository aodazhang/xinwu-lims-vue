<template>
  <div
    class="m-3 flex min-h-[calc(100vh-80px)] flex-col flex-nowrap items-stretch gap-3"
  >
    <common-title class="shrink-0 grow-0" title="接口" />
    <ul class="flex-auto">
      <li
        class="mb-2 select-none overflow-hidden rounded-lg bg-white"
        v-for="item of list"
        :key="item.id"
      >
        <div
          class="flex cursor-pointer flex-row flex-nowrap items-center justify-between p-3 transition-all"
          :class="{
            'bg-[#0059E5]': item.expanded,
            'text-white': item.expanded
          }"
          @click="item.expanded = !item.expanded"
        >
          <p>{{ item.name }}</p>
          <open-svg v-if="item.expanded" />
          <close-svg v-else />
        </div>
        <embed
          class="h-[800px] w-full"
          v-if="item.expanded"
          type="application/pdf"
          :src="item.src"
        />
      </li>
    </ul>
    <el-pagination
      class="flex shrink-0 grow-0 justify-end"
      layout="prev, pager, next"
      :total="query.total"
      :current-page="query.pageNum"
      @current-change="
        current => {
          query.pageNum = current
        }
      "
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CommonTitle from '@/components/common-title.vue'
import OpenSvg from '@/assets/svg/open.svg'
import CloseSvg from '@/assets/svg/close.svg'

defineOptions({ name: 'SystemApi' })

const query = ref({ pageNum: 1, pageSize: 10, total: 10 })
const list = ref([])
</script>

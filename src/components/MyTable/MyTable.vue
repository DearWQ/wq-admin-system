<script lang="ts" setup>

import {reactive, ref} from "vue";
import * as Icons from '@arco-design/web-vue/es/icon'
import TableFooter from "@/components/MyTable/TableFooter.vue";

const loadIcon = (name) => {
  return Icons[name]
}

const props = defineProps({
  tableConfig: {
    type: Object,
    default: () => {
      return {
        hasBorder: false,//是否显示边框
        tableColumns: [],//表格项
        tableLoading: false,//是否显示加载
        rowKey: 'id',//行键值
        pagination: {
          current: 1,//当前页码
          pageSize: 10,//每页条数
          total: 0,//总条数
          showSizeChanger: true,//是否显示条数选择器
          showQuickJumper: true,//是否显示快速跳转
          showTotal: true,//是否显示总条数
          pageSizeOptions: ['10', '20', '30', '40', '50'],//每页条数选择器
          size: 'default',//大小
          position: 'bottom',//位置
        },
        scroll: {
          hasScroll: false,
          x: 2000,
          y: 200
        },
        spanMethod: (record, index, columns) => {
        },
        rowSelection: reactive({
          type: 'checkbox',
          showCheckedAll: true,
          onlyCurrent: false,
          selectedKeys: []
        })
      }
    }
  },
  tableList: {
    type: Array,
    default: () => {
      return []
    }
  }
})

console.log(props.tableConfig.tableColumns)
const emit = defineEmits(['selectionChange'])
const dataList = ref(props.tableList)
const onSelectionChange = (selectedRows) => {
  emit('selectionChange', selectedRows)
  console.log('selectedRows:', selectedRows)
}
const handleSelect=(v)=>{
  console.log(v)
}
</script>

<template>
  <a-table
      :bordered="props.tableConfig.hasBorder"
      :columns="props.tableConfig.tableColumns"
      :data="dataList"
      :loading="props.tableConfig.tableLoading"
      :pagination="false"
      @selection-change="onSelectionChange">
    <template #columns>
      <a-table-column v-for="item of props.tableConfig.tableColumns" :key="item.key" :align="item.align"
                      :data-index="(item.key as string)" :fixed="item.fixed" :title="(item.title as string)"
                      :width="item.width">
        <template v-if="item.slotName" #cell="{rowIndex, record }">
          <slot :name="item.slotName" :record="record"></slot>
        </template>
        <template v-if="item.key === 'index'" #cell="{ rowIndex }">
          {{ rowIndex + 1 }}
        </template>
        <template v-if="item.key === 'operation'" #cell="{rowIndex, record }">
          <div class="flex items-center">
            <template v-for="(btn,b_index) of item.buttonList">
              <a-button v-if="(btn.auth?btn.auth():true)&&b_index<item.showBtnMoreNum&&!btn.slotName"
                        :key="`btn-${b_index}-${btn.key}`"
                        :size="btn.size||'small'" :type="btn.type||'text'"
                        @click="btn.onClick(record,rowIndex)">
                <template #icon>
                  <component :is="loadIcon(btn.icon)" :style="btn.iconStyle"/>
                </template>
                {{ btn.title }}
              </a-button>
              <!--自定义按钮-->
              <slot v-if="btn.slotName" :name="btn.slotName" :record="record"></slot>
            </template>
            <div v-if="item.buttonList.length>=item.showBtnMoreNum" class="flex items-center justify-center"
                 style="padding-left: 8px;cursor: pointer">
              <a-dropdown @select="handleSelect">
                <icon-more style="color: #165DFF;"/>
                <template #content>
                  <template v-for="(btn,b_index) of item.buttonList">
                    <a-doption v-if="(btn.auth?btn.auth():true)&&b_index>=item.showBtnMoreNum">
                      <template #icon>
                        <component :is="loadIcon(btn.icon)" :style="btn.iconStyle"/>
                      </template>
                      {{ btn.title }}
                    </a-doption>
                  </template>
                </template>
              </a-dropdown>

            </div>
          </div>


        </template>
      </a-table-column>
    </template>
  </a-table>
  <TableFooter :pagination="props.tableConfig.pagination" position="end"/>
</template>

<style lang="less" scoped>

</style>
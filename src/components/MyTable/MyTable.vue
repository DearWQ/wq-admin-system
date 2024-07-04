<script setup lang="ts">

const props =defineProps({
  tableConfig:{
    type:Object,
    default:()=>{
      return {
        hasBorder:false,//是否显示边框
      }
    }
  }
})

</script>

<template>
  <a-table :bordered="tableConfig.hasBorder" :columns="tableColumns" :data="dataList"
           :loading="tableLoading" :pagination="false" :row-selection="{ selectedRowKeys, showCheckedAll }"
           :rowKey="rowKey"
           @selection-change="onSelectionChange">
    <template #columns>
      <a-table-column v-for="item of tableColumns" :key="item.key" :align="item.align"
                      :data-index="(item.key as string)" :fixed="item.fixed" :title="(item.title as string)"
                      :width="item.width">
        <template v-if="item.key === 'index'" #cell="{ rowIndex }">
          {{ rowIndex + 1 }}
        </template>
        <template v-else-if="item.key === 'gender'" #cell="{ record }">
          {{ record.gender === 1 ? '男' : '女' }}
        </template>
        <template v-else-if="item.key === 'avatar'" #cell="{ record }">
          <a-avatar :autocapitalize="30" :style="{ backgroundColor: 'var(--color-primary-light-1)' }">
            {{ record.nickName.substring(0, 1) }}
          </a-avatar>
        </template>
        <template v-else-if="item.key === 'status'" #cell="{ record }">
          <a-tag v-if="record.status === 1" color="blue" size="small">正常</a-tag>
          <a-tag v-else color="red" size="small">禁用</a-tag>
        </template>
      </a-table-column>
    </template>
  </a-table>
</template>

<style scoped lang="less">

</style>
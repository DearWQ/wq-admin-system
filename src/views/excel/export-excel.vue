<template>
  <div class="main-container">
    <TableBody ref="tableBody">
      <template #header>
        <div style="padding: 16px">
          <a-button type="primary" size="small" @click="exportExcel">导出Excel </a-button>
        </div>

      </template>
      <template #table>
        <a-table ref="tableRef" :data="dataList" :pagination="true">
          <template #columns>
            <a-table-column
              v-for="item of tableColumns"
              :key="item.key"
              align="center"
              :title="(item.title)"
              :data-index="(item.key)"
            >
              <template v-if="item.key === 'index'" #cell="{ rowIndex }">
                {{ rowIndex + 1 }}
              </template>
              <template v-else-if="item.key === 'gender'" #cell="{ record }">
                {{ record.gender === 1 ? '男' : '女' }}
              </template>
              <template v-else-if="item.key === 'status'" #cell="{ record }">
                <a-tag color="blue" size="small" v-if="record.status === 1">正常</a-tag>
                <a-tag color="red" size="small" v-else>禁用</a-tag>
              </template>
            </a-table-column>
          </template>
        </a-table>
      </template>
    </TableBody>
  </div>
</template>

<script  setup>
  import { post } from '@/api/http'
  import { getTableList } from '@/api/url'
  import { useTable, useTableColumn } from '@/hooks/table'
  import { onMounted, ref } from 'vue'
  import XLSX from 'xlsx'
      const tableRef = ref(null)
      const { dataList, handleSuccess, indexColumn} = useTable();
      const tableColumns = useTableColumn([
        indexColumn,
        {
          title: '名称',
          key: 'nickName',
          dataIndex: 'nickName',
        },
        {
          title: '性别',
          key: 'gender',
          dataIndex: 'gender',
        },
        {
          title: '地址',
          key: 'address',
          dataIndex: 'address',
        },
        {
          title: '登录时间',
          key: 'lastLoginTime',
          dataIndex: 'lastLoginTime',
        },
        {
          title: '登录IP',
          key: 'lastLoginIp',
          dataIndex: 'lastLoginIp',
        },
        {
          title: '状态',
          key: 'status',
          dataIndex: 'status',
        },
      ])
      function doRefresh() {
        post({
          url: getTableList,
          data: {
            page: 1,
            pageSize: 20,
          },
        })
          .then(handleSuccess)
          .catch(console.log)
      }
      function exportExcel() {
        const workSheet = XLSX.utils.table_to_sheet((tableRef.value).$el)
        const workBook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workBook, workSheet, 'data报表')
        XLSX.writeFile(workBook, 'table-list.xlsx')
      }
      onMounted(doRefresh)
</script>

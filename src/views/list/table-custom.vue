<template>
  <div class="main-container">
    <TableBody>
      <template #header>
        <TableHeader :show-filter="false">
          <template #other>
            <a-space>
              <SortableTable :columns="tableColumns" class="ml-4" @update="onUpdateTable"/>
              <TableConfig
                  @refresh="doRefresh"
                  @update-border="onUpdateBorder"
                  @update-striped="onUpdateStriped"
              />
            </a-space>
          </template>
        </TableHeader>
      </template>
      <template #table>
        <MyTable :table-config="tableConfig" :tableList="dataList">
          <template #status="{record}">
            <a-tag v-if="record.status === 1" color="blue" size="small">正常</a-tag>
            <a-tag v-else color="red" size="small">禁用</a-tag>
          </template>
          <template #gender="{record}">
            <a-tag v-if="record.status === 1" color="blue" size="small">男</a-tag>
            <a-tag v-else color="pink" size="small">女</a-tag>
          </template>>
          <template #avatar="{record}">
            <img :src="record.avatar" alt="" width="60px" height="60px">
          </template>>
          <template #edit="{record}">
            <span>自定义按钮</span>
          </template>
        </MyTable>
      </template>
<!--      <template #footer>-->
<!--        <TableFooter :pagination="pagination"  position="end"/>-->
<!--      </template>-->
    </TableBody>
  </div>
</template>

<script  setup>
import {post} from '@/api/http'
import {getTableList} from '@/api/url'
import {usePagination, useRowKey, useTable, useTableColumn} from '@/hooks/table'
import {sortColumns} from '@/utils'
import {Message, Modal} from '@arco-design/web-vue'
import {onMounted, reactive} from 'vue'
import MyTable from "@/components/MyTable/MyTable.vue";
import TableFooter from "@/components/MyTable/TableFooter.vue";


const {
  dataList,
  bordered,
  tableLoading,
  striped,
  handleSuccess,
  indexColumn
} = useTable();
const pagination = usePagination(doRefresh)
const rowKey = useRowKey('id')
const tableColumns = reactive(
    useTableColumn([
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
        title: '头像',
        key: 'avatar',
        dataIndex: 'avatar',
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
      {
        title: '操作',
        key: 'operation',
        width: 200,
        fixed: 'right',
        buttonList: [
          {
            key: 'delete',
            title: '删除',
            icon: 'icon-delete',
            onClick: (item) => {
              onDeleteItem(item)
            }
          }
        ]
      },
    ])
)
const tableConfig = reactive({
  tableColumns: [
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
      slotName: 'gender',
    },
    {
      title: '头像',
      key: 'avatar',
      dataIndex: 'avatar',
      slotName: 'avatar',
    },
    {
      title: '地址',
      key: 'address',
      dataIndex: 'address',
    },
    {
      title: '创建时间',
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
      slotName:'status'
    },
    {
      title: '操作',
      key: 'operation',
      width: 200,
      align: 'center',
      fixed: 'right',
      showBtnMoreNum:2,
      buttonList: [
        {
          key: 'edit',
          title: '编辑',
          slotName:'edit',
          type:'text',
          auth:()=>{return true},
          onClick: (item) => {
            onDeleteItem(item)
          }
        },
        {
          key: 'edit',
          title: '编辑',
          type:'text',
          auth:()=>{return true},
          onClick: (item) => {
            onDeleteItem(item)
          }
        },
        {
          key: 'edit',
          title: '编辑',
          type:'text',
          auth:()=>{return true},
          onClick: (item) => {
            onDeleteItem(item)
          }
        },{
          key: 'edit',
          title: '编辑',
          type:'text',
          auth:()=>{return true},
          onClick: (item) => {
            onDeleteItem(item)
          }
        },
        {
          key: 'edit',
          title: '编辑',
          type:'text',
          auth:()=>{return true},
          onClick: (item) => {
            onDeleteItem(item)
          }
        },

        {
          key: 'delete',
          title: '删除',
          type:'text',
          icon: 'IconDelete',
          onClick: (item) => {
            onDeleteItem(item)
          }
        }
      ]
    },
  ],
  pagination,
})
function doRefresh() {
  post({
    url: getTableList,
    data: () => {
      return {
        page: pagination.page,
        pageSize: pagination.pageSize,
      }
    },
  })
      .then((res) => {
        handleSuccess(res)
        pagination.setTotalSize(res.totalSize)
      })
      .catch(console.log)
}

function onDeleteItem(item) {
  if (item) {
    Modal.confirm({
      content: '是否要删除此数据，删除后不恢复？',
      okText: '删除',
      onOk: () => {
        Message.success('模拟删除成功，参数为：' + item.id)
      },
    })
  }
}

function onUpdateTable(newColumns) {
  sortColumns(tableColumns, newColumns)
}

function onUpdateBorder(isBordered) {
  bordered.value = isBordered
}

function onUpdateStriped(isStriped) {
  striped.value = isStriped
}

function rowClassNameFun(_record, index) {
  return index % 2 === 1 && striped.value ? 'table-striped' : null
}

onMounted(doRefresh)
</script>

<style lang="less" scoped>
.avatar-container {
  position: relative;
  width: 30px;
  height: 30px;
  margin: 0 auto;
  vertical-align: middle;

  .avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .avatar-vip {
    border: 2px solid #cece1e;
  }

  .vip {
    position: absolute;
    top: 0;
    right: -9px;
    width: 15px;
    transform: rotate(60deg);
  }
}

.gender-container {
  .gender-icon {
    width: 20px;
  }
}
</style>
<style scoped>
.ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}
</style>

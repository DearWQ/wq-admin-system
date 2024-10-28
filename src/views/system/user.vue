<template>
  <a-row :gutter="10">
    <a-col :span="5">
      <a-card class="h-full" :bodyStyle="{ padding: '5px' }" :headerStyle="{ padding: '5px' }">
        <a-space>
          <a-input class="mr-2" placeholder="搜索" size="small" />
          <a-switch size="small" v-model:model-value="expandAllFlag" />
        </a-space>
        <div class="mt-4" :style="{ height: tableHeight + 80 + 'px', overflow: 'auto' }">
          <Scrollbar>
            <a-tree v-model:expanded-keys="getExpandedKeys" :data="departmentData" checkable />
          </Scrollbar>
        </div>
      </a-card>
    </a-col>
    <a-col :span="19">
      <TableBody>
        <template #header>
          <TableHeader ref="tableHeaderRef" :show-filter="false">
            <template #other>
              <DeleteButton @delete="onDeleteItems" />
            </template>
          </TableHeader>
        </template>
        <template #table>
          <a-table
            :bordered="false"
            :row-selection="{ selectedRowKeys }"
            :loading="tableLoading"
            :data="dataList"
            :pagination="false"
            :rowKey="rowKey"
            table-layout-fixed
            :scroll="{ y: tableHeight, x: 1000 }"
            @selection-change="onSelectionChange"
          >
            <template #columns>
              <a-table-column
                v-for="item of tableColumns"
                :key="item.key"
                :align="item.align"
                :title="(item.title)"
                :width="item.width"
                :data-index="(item.key)"
                :fixed="item.fixed"
              >
                <template v-if="item.key === 'index'" #cell="{ rowIndex }">
                  {{ rowIndex + 1 }}
                </template>
                <template v-else-if="item.key === 'gender'" #cell="{ record }">
                  <a-tag :color="record.gender === 1 ? 'green' : 'red'">
                    {{ record.gender === 1 ? '男' : '女' }}
                  </a-tag>
                </template>
                <template v-else-if="item.key === 'avatar'" #cell="{}">
                  <a-avatar :size="30" :style="{ backgroundColor: 'var(--color-primary-light-1)' }">
                    <IconUser />
                  </a-avatar>
                </template>
                <template v-else-if="item.key === 'actions'" #cell="{ record }">
                  <a-button status="danger" @click="onDeleteItem(record)" size="mini"
                    >删除</a-button
                  >
                </template>
                <template v-else-if="item.key === 'status'" #cell="{ record }">
                  <a-tag color="blue" size="small" v-if="record.status === 1">正常</a-tag>
                  <a-tag color="red" size="small" v-else>禁用</a-tag>
                </template>
              </a-table-column>
            </template>
          </a-table>
        </template>
        <template #footer>
          <TableFooter ref="tableFooterRef" :pagination="pagination" />
        </template>
      </TableBody>
    </a-col>
  </a-row>
</template>

<script setup>
  import { post } from '@/api/http'
  import { getTableList } from '@/api/url'
  import {
    usePagination,
    useRowKey,
    useRowSelection,
    useTable,
    useTableColumn,
    useTableHeight,
  } from '@/hooks/table'
  import { Message, Modal } from '@arco-design/web-vue'
  import { getCurrentInstance, onMounted, ref, watch } from 'vue'
  const { 
    dataList,
    tableHeaderRef,
    tableFooterRef,
    tableHeight,
    bordered,
    striped,
    tableLoading,
    handleSuccess,
    indexColumn } = useTable();
      const rowKey = useRowKey('id')
      const pagination = usePagination(doInitData)
      const { selectedRowKeys, onSelectionChange } = useRowSelection()
      const departmentData = [
        {
          title: '前端',
          key: 1,
          children: [
            {
              title: 'Vue',
              key: 11,
            },
            {
              title: 'React',
              key: 12,
            },
            {
              title: 'Electron',
              key: 13,
            },
            {
              title: 'Flutter',
              key: 14,
            },
          ],
        },
        {
          title: '后端',
          key: 2,
          children: [
            {
              title: 'JAVA',
              key: 21,
            },
            {
              title: 'GO',
              key: 22,
            },
            {
              title: 'C++',
              key: 23,
            },
            {
              title: 'Object-c',
              key: 24,
            },
          ],
        },
        {
          title: '云原生',
          key: 3,
          children: [
            {
              title: 'k8s',
              key: 31,
            },
            {
              title: 'docker',
              key: 32,
            },
            {
              title: 'cicd',
              key: 33,
            },
            {
              title: '微服务',
              key: 34,
            },
          ],
        },
        {
          title: 'Spring-boot',
          key: 4,
          children: [
            {
              title: 'java',
              key: 41,
            },
            {
              title: 'es',
              key: 42,
            },
            {
              title: 'redis',
              key: 43,
            },
            {
              title: 'db',
              key: 44,
            },
          ],
        },
      ]
      const tableColumns = useTableColumn([
        indexColumn,
        {
          title: 'name',
          key: 'nickName',
          dataIndex: 'nickName',
          width: 150,
        },
        {
          title: '性别',
          key: 'gender',
          dataIndex: 'gender',
          width: 80,
        },
        {
          title: '头像',
          key: 'avatar',
          dataIndex: 'avatar',
          width: 80,
        },
        {
          title: '地址',
          key: 'address',
          dataIndex: 'address',
          width: 150,
        },
        {
          title: '登录时间',
          key: 'lastLoginTime',
          dataIndex: 'lastLoginTime',
          width: 150,
        },
        {
          title: '登录IP',
          key: 'lastLoginIp',
          dataIndex: 'lastLoginIp',
          width: 150,
        },
        {
          title: '状态',
          key: 'status',
          dataIndex: 'status',
          width: 80,
        },
        {
          title: '操作',
          key: 'actions',
          fixed: 'right',
          width: 80,
          dataIndex: 'actions',
        },
      ])
      const expandAllFlag = ref(true)
      function doInitData() {
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
            pagination.setTotalSize((res).totalSize)
          })
          .catch(console.log)
      }
      function onDeleteItems() {
        if (selectedRowKeys.value.length === 0) {
          Message.error('请选择要删除的数据')
          return
        }
        Modal.confirm({
          title: '提示',
          content: '确定要删除此数据吗？',
          cancelText: '取消',
          okText: '删除',
          onOk: () => {
            Message.success(
              '数据模拟删除成功，所选择的Keys为：' + JSON.stringify(selectedRowKeys.value)
            )
          },
        })
      }
      function onDeleteItem(item) {
        Modal.confirm({
          title: '提示',
          content: '确定要删除此数据吗？',
          cancelText: '取消',
          okText: '删除',
          onOk: () => {
            Message.success('数据删除成功')
            table.dataList.splice(table.dataList.indexOf(item), 1)
          },
        })
      }
      function onUpdateExpandedKeys(keys) {
        getExpandedKeys.value = [...keys]
      }
      const getExpandedKeys = ref(departmentData.map((it) => it.key))
      watch(
        () => expandAllFlag.value,
        (newVal) => {
          newVal
            ? (getExpandedKeys.value = departmentData.map((it) => it.key))
            : (getExpandedKeys.value = [])
        }
      )
      onMounted(async () => {
        tableHeight.value = await useTableHeight(getCurrentInstance())
        doInitData()
      })
</script>

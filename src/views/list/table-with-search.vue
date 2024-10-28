<template>
  <div class="main-container">

      <TableBody ref="tableBody">
        <template #header>
          <TableHeader :show-filter="true" title="筛选条件" @search="onSearch" @reset-search="onResetSearch">
            <template #search-content>
              <a-form :model="searchForm">
                <a-row>
                  <template v-for="(item,index) of conditionItems">
                    <a-col  :key="`${item.type}-${item.key}`"
                            v-if="index<3"
                            :span="item.colSpan||8">
                      <a-form-item  :label="item.label" :label-col-flex="item.labelColFlex||'80px'">
                        <template v-if="item.render">
                          <FormRender :formItem="item" :render="item.render"/>
                        </template>
                        <template v-else>
                          <template v-if="item.type === 'input'">
                            <a-input v-model="searchForm[item.key]" :placeholder="item.placeholder"/>
                          </template>
                          <template v-if="item.type === 'select'">
                            <a-select v-model="searchForm[item.key]" :placeholder="item.placeholder">
                              <a-option v-for="optionItem of item.optionItems" :key="optionItem.value"
                                        :value="optionItem.value">
                                {{ optionItem.label }}
                              </a-option>
                            </a-select>
                          </template>
                          <template v-if="item.type === 'date'">
                            <a-date-picker v-model="searchForm[item.key]"/>
                          </template>
                          <template v-if="item.type === 'time'">
                            <a-time-picker v-model="searchForm[item.key]" value-format="HH:mm:ss"/>
                          </template>
                          <template v-if="item.type === 'check-group'">
                            <a-checkbox-group v-model="searchForm[item.key]">
                              <a-checkbox v-for="it of item.optionItems" :key="it.value" :value="it.value">
                                {{ item.label }}
                              </a-checkbox>
                            </a-checkbox-group>
                          </template>
                        </template>
                      </a-form-item>
                    </a-col>
                    <a-col  :key="`${item.type}-${item.key}`"
                            v-if="showMore&&index>=3"
                            :span="item.colSpan||8">
                      <a-form-item  :label="item.label" :label-col-flex="item.labelColFlex||'80px'">
                        <template v-if="item.render">
                          <FormRender :formItem="item" :render="item.render"/>
                        </template>
                        <template v-else>
                          <template v-if="item.type === 'input'">
                            <a-input v-model="searchForm[item.key]" :placeholder="item.placeholder"/>
                          </template>
                          <template v-if="item.type === 'select'">
                            <a-select v-model="searchForm[item.key]" :placeholder="item.placeholder">
                              <a-option v-for="optionItem of item.optionItems" :key="optionItem.value"
                                        :value="optionItem.value">
                                {{ optionItem.label }}
                              </a-option>
                            </a-select>
                          </template>
                          <template v-if="item.type === 'date'">
                            <a-date-picker v-model="searchForm[item.key]"/>
                          </template>
                          <template v-if="item.type === 'time'">
                            <a-time-picker v-model="searchForm[item.key]" value-format="HH:mm:ss"/>
                          </template>
                          <template v-if="item.type === 'check-group'">
                            <a-checkbox-group v-model="searchForm[item.key]">
                              <a-checkbox v-for="it of item.optionItems" :key="it.value" :value="it.value">
                                {{ item.label }}
                              </a-checkbox>
                            </a-checkbox-group>
                          </template>
                        </template>
                      </a-form-item>
                    </a-col>
                  </template>
                  <a-col :span="8">
                    <a-form-item>
                      <a-button type="primary" @click="onSearch">搜索</a-button>
                      <a-button style="margin-left: 8px" @click="onResetSearch">重置</a-button>
                      <a-link class="flex" v-if="conditionItems.length>=4" style="margin-left: 8px" :hoverable="false" @click="handleMore">展开
                        <IconDown class="cursor-pointer" v-if="!showMore" />
                        <IconUp class="cursor-pointer" v-if="showMore" />
                      </a-link>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </template>
          </TableHeader>
        </template>
        <template #table>
          <a-table :bordered="false" :columns="tableColumns" :data="dataList"
                   :loading="tableLoading" :pagination="false" :row-selection="{ selectedRowKeys, showCheckedAll }"
                   :rowKey="rowKey"
                   @selection-change="onSelectionChange">
            <template #columns>
              <a-table-column v-for="item of tableColumns" :key="item.key" :align="item.align"
                              :data-index="(item.key)" :fixed="item.fixed" :title="(item.title)"
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
        <template #footer>
          <TableFooter :pagination="pagination"/>
        </template>
      </TableBody>

  </div>
</template>

<script  setup>
import {post} from '@/api/http'
import {getTableList} from '@/api/url'
import {usePagination, useRowKey, useRowSelection, useTable, useTableColumn,} from '@/hooks/table'
import {Input, Message} from '@arco-design/web-vue'
import {h, onMounted, ref} from 'vue'


const conditionItems = [
  {
    key: 'name',
    label: '用户姓名',
    type: 'input',
    placeholder: '请输入用户姓名',
    value: ref(''),
    reset: function () {
      this.value.value = ''
    },
    render: (formItem) => {
      return h(Input, {
        placeholder: '输入用户名',
        modelValue: formItem.value.value,
        'onUpdate:modelValue': (value) => {
          formItem.value.value = value
        },
      })
    },
  },
  {
    key: 'date',
    label: '创建日期',
    type: 'date',
    value: ref(),
  },
  {
    key: 'sex',
    label: '用户姓别',
    value: ref(),
    type: 'select',
    placeholder: '请选择用户姓别',
    optionItems: [
      {
        label: '男',
        value: 1,
      },
      {
        label: '女',
        value: 2,
      },
    ],
    reset: function () {
      this.value.value = undefined
    },
  },
  {
    key: 'time',
    label: '创建时间',
    type: 'time',
    value: ref(''),
  },
]
const searchForm = ref({})
const pagination = usePagination(doRefresh)
const {selectedRowKeys, onSelectionChange, showCheckedAll} = useRowSelection()
const {
  dataList,
  bordered,
  tableLoading,
  handleSuccess,
  indexColumn
} = useTable();
const rowKey = useRowKey('id')
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
    width: 100
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
])

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
        pagination.setTotalSize(res.totalSize || 10)
      })
      .catch(console.log)
}

function onSearch() {
  Message.success(
      '模拟查询成功，参数为：' +
      JSON.stringify(
          conditionItems.reduce((pre, cur) => {
            ;(pre)[cur.key] = cur.value.value
            return pre
          }, {})
      )
  )
}

function onResetSearch() {
  conditionItems.forEach((it) => {
    it.reset ? it.reset() : (it.value.value = '')
  })
}
const showMore=ref(false)
function handleMore(){
  showMore.value=!showMore.value
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

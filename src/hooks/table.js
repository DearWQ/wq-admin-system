import { reactive, ref, shallowReactive } from 'vue'


export const useTableHeight = async function (currentIns) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const clientHeight =
        document.querySelector('.main-section')?.getBoundingClientRect().height || 0
      const tableHeaderHeight =
        document.querySelector('.arco-table-header')?.getBoundingClientRect().height || 41
      if (currentIns) {
        let tempHeight = tableHeaderHeight
        if (currentIns.refs.tableHeaderRef) {
          const header = (currentIns.refs ).tableHeaderRef.$el
          tempHeight += header.clientHeight
        }
        if (currentIns.refs.tableFooterRef) {
          tempHeight += 51
        }
        resolve(clientHeight - tempHeight)
      }
      resolve(150)
    }, 500)
  })
}

export const useTable = function () {
  const dataList = shallowReactive([])
  const tableHeaderRef = ref(null)
  const tableFooterRef = ref(null)
  const tableHeight = ref(200)
  const bordered = ref(false)
  const striped = ref(false)
  const tableLoading = ref(true)
  const handleSuccess = ({ data = [] }) => {
    tableLoading.value = false
    dataList.length = 0
    dataList.push(...data)
    return Promise.resolve(data)
  }
  return {
    dataList,
    tableHeaderRef,
    tableFooterRef,
    tableHeight,
    bordered,
    striped,
    tableLoading,
    handleSuccess,
    useTableColumn,
    indexColumn: useTableIndexColumn(),
  }
}

export const useRowKey = function (propName) {
  return propName
}

export const useRowSelection = function () {
  const type = ref('checkbox')
  const showCheckedAll = ref(true)
  const selectedRowKeys = ref([])
  const onSelectionChange = (tempSelectRows) => {
    selectedRowKeys.value = tempSelectRows
  }
  return {
    type,
    showCheckedAll,
    selectedRowKeys,
    onSelectionChange,
  }
}

export const useTableColumn = function (
  columns,
  options = { dataIndex: '', key: '', align: 'center' }
) {
  return columns.map((it) => {
    return {
      ...options,
      ...it,
    }
  })
}

export const useTableIndexColumn = function () {
  return {
    title: '序号',
    key: 'index',
    width: 80,
    dataIndex: 'index',
  }
}

export const usePagination = function (callback) {
  function onChange() {
    callback()
  }
  const paginationInfo = reactive({
    page: 1,
    pageSize: 10,
    showSizePicker: true,
    pageCount: 1,
    pageSizes: ['10', '20', '30', '40'],
    onChange,
    setTotalSize(totalSize) {
      paginationInfo.pageCount = totalSize
    },
  })
  return paginationInfo
}

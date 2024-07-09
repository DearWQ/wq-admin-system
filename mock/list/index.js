import Mock, { Random } from 'mockjs'



//这里重写mock的send方法是因为在使用Cesium三维时mock导致无法显示地图问题
Mock.XHR.prototype.send = (() => {
  const _send = Mock.XHR.prototype.send
  return function() {
    if (!this.match) {
      this.custom.xhr.responseType = this.responseType || ''
      this.custom.xhr.timeout = this.timeout || 0
      this.custom.xhr.withCredentials = this.withCredentials || false
      this.custom.xhr.onabort = this.onabort || null
      this.custom.xhr.onerror = this.onerror || null
      this.custom.xhr.onload = this.onload || null
      this.custom.xhr.onloadend = this.onloadend || null
      this.custom.xhr.onloadstart = this.onloadstart || null
      this.custom.xhr.onprogress = this.onprogress || null
      this.custom.xhr.onreadystatechange = this.onreadystatechange || null
      this.custom.xhr.ontimeout = this.ontimeout || null
    }
    return _send.apply(this, arguments)
  }
})()


import { baseData } from '../base.ts'
import {
  getDepartmentList,
  getTableList,
  getCardList,
  getCommentList,
  addDepartment,
  getRoleList,
} from '@/api/url'

const totalSize = 30

function computePageSize(totalSize, page, pageSize) {
  return Math.abs(totalSize - pageSize * page >= 0 ? pageSize : totalSize - pageSize * page)
}

Mock.mock(RegExp(getDepartmentList), 'post', function () {
  return Mock.mock({
    ...baseData,
    totalSize,
    data: [
      {
        id: 1,
        name: '程序员',
        depCode: 'dp_code_manager', // 0男 1女
        'order|+1': 1, // 0不是 1是
        createTime: Random.now('yyyy-MM-dd HH:mm:ss'),
        status: 0, // 0 禁用 1正常
      },
      {
        id: 2,
        name: '前端开发',
        depCode: 'dp_code_marketing', // 0男 1女
        'order|+1': 1, // 0不是 1是
        createTime: Random.now('yyyy-MM-dd HH:mm:ss'),
        status: 1, // 0 禁用 1正常,
        children: [
          {
            id: 3,
            name: 'P8',
            depCode: 'dp_code_marketing_1', // 0男 1女
            'order|+1': 1, // 0不是 1是
            createTime: Random.now('yyyy-MM-dd HH:mm:ss'),
            status: 1, // 0 禁用 1正常
          },
          {
            id: 4,
            name: 'P7',
            depCode: 'dp_code_marketing_2', // 0男 1女
            'order|+1': 1, // 0不是 1是
            createTime: Random.now('yyyy-MM-dd HH:mm:ss'),
            status: 1, // 0 禁用 1正常
          },
        ],
      },
      {
        id: 5,
        name: '后端',
        depCode: 'dp_code_technology', // 0男 1女
        'order|+1': 1, // 0不是 1是
        createTime: Random.now('yyyy-MM-dd HH:mm:ss'),
        status: 1, // 0 禁用 1正常
      },
      {
        id: 6,
        name: '运维',
        depCode: 'dp_code_sale', // 0男 1女
        'order|+1': 1, // 0不是 1是
        createTime: Random.now('yyyy-MM-dd HH:mm:ss'),
        status: 1, // 0 禁用 1正常
      },
    ],
  })
})

Mock.mock(RegExp(getRoleList), 'post', function () {
  return Mock.mock({
    ...baseData,
    data: [
      {
        id: 1,
        name: '超级管理员',
        roleCode: 'ROLE_admin',
        description: '超级管理员',
        createTime: Random.now('yyyy-MM-dd HH:mm:ss'),
      },
      {
        id: 2,
        name: '编辑员',
        roleCode: 'ROLE_editor',
        description: '编辑员',
        createTime: Random.now('yyyy-MM-dd HH:mm:ss'),
      },
    ],
  })
})

Mock.mock(RegExp(addDepartment), 'post', function () {
  return Mock.mock({ ...baseData, data: '' })
})

Mock.mock(RegExp(getTableList), 'post', function ({ body }) {
  const { page, pageSize = 10 } = JSON.parse(body)
  const size = computePageSize(totalSize, page, pageSize)
  return Mock.mock({
    ...baseData,
    totalSize,
    [`data|${size}`]: [
      {
        'id|+1': 1,
        nickName: function () {
          return Random.name()
        },
        avatar:
          (import.meta.env.MODE === 'development' ? '' : '/vue2-arco') +
          '/src/assets/img_avatar.gif',
        'gender|0-1': 0, // 0男 1女
        'vip|0-1': 0, // 0不是 1是
        address: function () {
          return Random.city(true)
        },
        lastLoginTime: Random.now('yyyy-MM-dd HH:mm:ss'),
        lastLoginIp: function () {
          return Random.ip()
        },
        'status|0-1': 1, // 0 禁用 1正常
      },
    ],
  })
})

Mock.mock(RegExp(getCardList), 'post', function ({ body }) {
  const { page, pageSize = 10 } = JSON.parse(body)
  const size = computePageSize(totalSize, page, pageSize)
  return Mock.mock({
    ...baseData,
    totalSize,
    [`data|${size}`]: [
      {
        id: function () {
          return Random.string(10)
        },
        title: function () {
          return Random.csentence(3, 5)
        },
        'image|1-6': 1,
        description: function () {
          return Random.csentence(5, 10)
        },
        time: function () {
          return Random.date()
        },
      },
    ],
  })
})

Mock.mock(RegExp(getCommentList), 'post', function ({ body }) {
  const { page, pageSize = 10 } = JSON.parse(body)
  const size = computePageSize(totalSize, page, pageSize)
  return Mock.mock({
    ...baseData,
    totalSize,
    [`data|${size}`]: [
      {
        id: function () {
          return Random.string(10)
        },
        avatar: Random.image('100x100', '#50B347', '#FFF', 'vue-admin-work'),
        nickName: function () {
          return Random.cname()
        },
        content: function () {
          return Random.csentence(10, 20)
        },
        time: function () {
          return Random.date('yyyy-MM-dd')
        },
        'rate|1-5': 5,
        'progress|20-100': 50,
        'status|0-1': 1, // 对外展示状态 0 不展示，1 展示
      },
    ],
  })
})

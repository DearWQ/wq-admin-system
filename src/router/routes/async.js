const LAYOUT = () => import('@/layouts/Layout.vue')
export const asyncRoutes = [
  {
    path: '/index',
    component: LAYOUT,
    name: 'Index',
    meta: {
      title: '主页',
      iconPrefix: 'iconfont',
      icon: 'icon-dashboard',
    },
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/main.vue'),
        meta: {
          title: '主控台',
          affix: true,
        },
      },
      {
        path: 'work-place',
        name: 'WorkPlace',
        component: () => import('@/views/home/work-place.vue'),
        meta: {
          title: '工作台',
        },
      },
    ],
  },
]

<template>
  <div class="main-container">
    <a-card title="工作台" :bodyStyle="{ padding: '10px' }" :headStyle="{ padding: '0 10px' }" size="small"
      :bordered="false" class="card-border-radius">
      <a-row class="margin-top" wrap>
        <a-col :xs="24" :sm="16" :md="16" :lg="16" :xl="14">
          <div class="flex justify-center items-center">
            <div class="avatar-wrapper">
              <img :src="avatar" />
            </div>
            <div class="flex flex-col justify-around ml-3.5 flex-1">
              <div class="text-lg">新的一天开始了</div>
              <div class="text-sm text-gray-500 mt-1">新的一天开始了</div>
            </div>
          </div>
        </a-col>
        <a-col :xs="24" :sm="8" :md="8" :lg="8" :xl="10">
          <div class="flex justify-end items-center h-full w-full mt-4">
            <div class="flex flex-col justify-around align-end item-action">
              <div class="text-gray">项目数</div>
              <div class="text-lg mt-2">12</div>
            </div>
            <div class="flex flex-col justify-around align-end item-action">
              <div class="text-gray">待办项</div>
              <div class="text-lg mt-2">3/20</div>
            </div>
            <div class="flex flex-col justify-around align-end item-action">
              <div class="text-gray">当前日期</div>
              <div class="text-lg mt-2">{{ currentDate }}</div>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-card>
    <div class="mt-3"></div>
    <a-row :gutter="[20, 10]">
      <a-col :xs="12" :sm="8" :md="8" :xl="4" :xxl="4" v-for="(item, index) of fastActions" :key="index">
        <a-card @click="fastActionClick(item)" class="flex flex-col items-center justify-center fast-item-wrapper"
          :bordered="false">
          <a-space direction="vertical" align="center">
            <component :is="item.icon" :style="{ color: item.color, fontSize: '28px' }" />
            <span class="mt-8 text-md">{{ item.title }}</span>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
    <div class="mt-3">
      <a-row :gutter="20">
        <a-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16">
          <a-card :body-style="{ padding: '0px' }" :bordered="false" class="card-border-radius" title="项目进度">
            <a-table :data="dataList" :pagination="false" :bordered="false">
              <template #columns>
                <a-table-column data-index="projectName" title="项目名"></a-table-column>
                <a-table-column data-index="beginTime" title="开始时间"></a-table-column>
                <a-table-column data-index="endTime" title="结束时间"></a-table-column>
                <a-table-column data-index="progress" title="进度">
                  <template #cell="{ record }">
                    <a-tag>
                      {{ record.progress + '%' }}
                    </a-tag>
                  </template>
                </a-table-column>
                <a-table-column data-index="status" title="状态">
                  <template #cell="{ record }">
                    <a-tag :color="record.progress < 100 ? 'red' : 'green'" :loading="record.progress < 100">
                      {{ record.status }}
                    </a-tag>
                  </template>
                </a-table-column>
              </template>
            </a-table>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
          <a-card :body-style="{ padding: '0px' }" :bordered="false" class="card-border-radius" title="消息列表">
            <a-list :bordered="false">
              <a-list-item>
                <a-list-item-meta v-for="(item, index) of messageList" :key="index" :title="item.name"
                  :description="item.content">
                  <template #avatar>
                    <a-avatar :size="32">
                      <IconUser />
                    </a-avatar>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { random } from 'lodash-es'
import useUserStore from '@/store/modules/user'
const COLORS = ['#67C23A', '#E6A23C', '#F56C6C', '#409EFF']
const date = new Date();
const currentDate = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
  const userStore = useUserStore()
  const avatar = computed(() => userStore.avatar)
  const tempWaitingItems = reactive([])
  const router = useRouter()
  const fastActionClick = ({ path = '/' }) => {
    router.push(path)
  }
  const dataList = [
    {
      key: '1',
      projectName: 'Vue3管理系统全功能',
      beginTime: '2022-4-3',
      endTime: '2022-4-21',
      progress: 100,
      status: '完成',
    },
    {
      key: '2',
      projectName: '井底的蜗牛',
      beginTime: '2022-4-3',
      endTime: '2022-4-21',
      progress: 90,
      status: '进行中',
    },
    {
      key: '3',
      projectName: '面试辅导',
      beginTime: '2022-4-3',
      endTime: '2022-4-21',
      progress: 100,
      status: '进行中',
    },
    {
      key: '4',
      projectName: '前端训练营',
      beginTime: '2021-12-01',
      endTime: '2025-12-31',
      progress: 50,
      status: '进行中',
    }
  ];
  const fastActions = [
      {
        title: '首页',
        icon: 'icon-dashboard',
        path: '/',
        color: COLORS[random(0, COLORS.length)],
      },
      {
        title: '系统管理',
        path: '/system/department',
        icon: 'icon-settings',
        color: COLORS[random(0, COLORS.length)],
      },
      {
        title: '列表',
        path: '/list/table-custom',
        icon: 'icon-list',
        color: COLORS[random(0, COLORS.length)],
      },
      {
        title: '表单',
        path: '/form/base-form-view',
        icon: 'icon-edit',
        color: COLORS[random(0, COLORS.length)],
      },
      {
        title: '多级菜单',
        path: '/next/menu2/menu-2-1/menu-2-1-1',
        icon: 'icon-share-alt',
        color: COLORS[random(0, COLORS.length)],
      },
      {
        title: '更多功能',
        path: '/other/chart/icons',
        icon: 'icon-apps',
        color: COLORS[random(0, COLORS.length)],
      },
    ];
    const messageList = [
      {
        name: '井底的蜗牛',
        content: '井底的蜗牛！',
      },
      {
        name: '前端训练营',
        content: '前端训练营',
      },
      {
        name: '简历深度优化',
        content: '简历深度优化',
      },
      {
        name: 'Webpack5 Babel前端工程化',
        content: 'Webpack5 Babel前端工程化',
      },
      {
        name: 'Vue全家桶',
        content: 'Vue全家桶',
      },
    ];
</script>

<style lang="less" scoped>
.avatar-wrapper {
  width: 3rem;
  height: 3rem;
  max-width: 3rem;
  max-height: 3rem;
  min-width: 3rem;
  min-height: 3rem;

  &>img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px solid yellowgreen;
  }
}

.item-action {
  position: relative;
  padding: 0 30px;
}

.item-action::after {
  position: absolute;
  top: 20%;
  right: 0;
  height: 60%;
  content: '';
  display: block;
  width: 1px;
  background-color: var(--border-color);
}

div.item-action:last-child::after {
  width: 0;
}

.fast-item-wrapper {
  height: 80px;
  border-radius: 8px;

  .anticon {
    font-size: 20px;
  }
}

.fast-item-wrapper:hover {
  cursor: pointer;
  box-shadow: 0px 0px 10px #ddd;
}
</style>

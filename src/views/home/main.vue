<template>
  <div class="main-container">
    <a-row :gutter="10">
      <a-col
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        :xl="6"
        :xxl="6"
        v-for="(item, index) of dataList"
        :key="index"
        class="item-wrapper"
      >
        <DataItem :data-model="item">
          <template v-if="index === 0" #extra="{ extra }">
            <div class="mt-4 text-xs">
              <div>昨天访问人数：{{ extra.data }} 人</div>
              <div class="mt-2"> 今天访问人数{{ extra.data1 }} 人</div>
            </div>
          </template>
          <template v-else-if="index === 1" #extra="{ extra }">
            <div class="mt-4 text-xs" style="position: relative">
              <div> 较昨日新增：{{ extra.data }} 人</div>
              <div class="mt-2"> 较上周新增：{{ extra.data1 }} 人</div>
              <div class="stack-avatar-wrapper"> </div>
            </div>
          </template>
          <template v-else-if="index === 2" #extra="{ extra }">
            <div class="p-4">
              <a-progress :percent="extra.data" />
            </div>
          </template>
          <template v-else-if="index === 3" #extra>
            <OrderChart ref="mOrderChart" />
          </template>
        </DataItem>
      </a-col>
    </a-row>
    <div class="mt-2"></div>
    <a-row :gutter="10">
      <a-col :xs="24" :sm="24" :md="12" :lg="16" :xl="16" :xxl="16">
        <a-space direction="vertical" style="width: 100%">
          <FullYearSalesChart ref="fullYearSalesChart" />
          <div class="flex w-full">
            <DepartmentChart class="flex-1" ref="departmentChart" />
            <div style="width: 8px"></div>
            <EnrollmentChannelsChart class="flex-1" ref="mOrderChart" />
          </div>
        </a-space>
      </a-col>
      <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8" :xxl="8">
        <a-space direction="vertical" style="width: 100%">
          <AppChart ref="appChart" />
          <StudentChart ref="enrollmentChannelsChart" />
        </a-space>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
  import DataItem from './components/DataItem.vue'
  import OrderChart from './components/chart/OrderChart.vue'
  import AppChart from './components/chart/AppChart.vue'
  import StudentChart from './components/chart/StudentChart.vue'
  import EnrollmentChannelsChart from './components/chart/EnrollmentChannelsChart.vue'
  import FullYearSalesChart from './components/chart/FullYearSalesChart.vue'
  import DepartmentChart from './components/chart/DepartmentChart.vue'
  import { computed, ref, watch } from 'vue'
  import useAppConfigStore from '@/store/modules/app-config'
  const appStore = useAppConfigStore()
  const mOrderChart = ref()
  const appChart = ref()
  const enrollmentChannelsChart = ref()
  const studentChart = ref()
  const fullYearSalesChart = ref()
  const departmentChart = ref()
  const onResize = () => {
    setTimeout(() => {
      mOrderChart.value?.updateChart()
      appChart.value?.updateChart()
      enrollmentChannelsChart.value?.updateChart()
      studentChart.value?.updateChart()
      fullYearSalesChart.value?.updateChart()
      departmentChart.value?.updateChart()
    }, 500)
  }
  const collapse = computed(() => {
    return appStore.isCollapse
  })
  watch(collapse, () => {
    onResize()
  })
  const dataList =  [
    {
      id: 'visited',
      title: '今日访问人数',
      data: '5000',
      prefix: '+',
      bottomTitle: '访问人数比较',
      totalSum: '100万+',
      icon: 'icon-face-smile-fill',
      color: '#1890ff',
      extra: {
        data: 1000,
        data1: 2350,
      },
    },
    {
      id: 'newAdd',
      title: '使用系统人数',
      data: '500',
      prefix: '+',
      bottomTitle: '周使用人数',
      totalSum: '200万+',
      icon: 'icon-heart-fill',
      color: '#ff0000',
      extra: {
        data: 700,
        data1: 968,
      },
    },
    {
      id: 'sales',
      title: '打赏总金额',
      data: '50000',
      prefix: '￥',
      bottomTitle: '打赏系统金额',
      totalSum: '2000万+',
      color: '#18e3ff',
      icon: 'icon-star-fill',
      extra: {
        data: 0.8,
      },
    },
    {
      id: 'order',
      title: '打赏次数',
      data: '189',
      suffix: '笔',
      bottomTitle: '初秋寄友人',
      totalSum: '1万+',
      color: '#bbc314',
      icon: 'icon-sun-fill',
      extra: {
        data: 80,
      },
    },
  ];
</script>

<template>
  <a-card :body-style="{ padding: '10px' }" :head-style="{ padding: '0 10px' }" title="系统每月下载量"
    :bordered="false" class="card-border-radius">
    <div class="chart-item-container">
      <a-skeleton animation v-if="loading">
        <a-skeleton-line :rows="4" />
      </a-skeleton>
      <template v-else>
        <div ref="fullYearSalesChart" class="chart-item"></div>
      </template>
    </div>
  </a-card>
</template>
<script setup>
import useEcharts from '@/hooks/useEcharts'
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { dispose, graphic } from 'echarts/core'
import { random } from 'lodash-es'
function getData() {
  const data = []
  while (data.length < 12) {
    data.push(random(80, 250))
  }
  return data
}
const months = [
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月',
]
const loading = ref(true)
const fullYearSalesChart = ref(null)
let interval= null
const init = () => {
  const option = {
    color: ['rgba(64, 58, 255)'],
    grid: {
      top: '10%',
      left: '2%',
      right: '2%',
      bottom: '5%',
      containLabel: true,
    },
    legend: {
      data: ['2022科技公司收入'],
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: months,
    },
    yAxis: {
      type: 'value',
      max: 300,
    },
    series: [
      {
        type: 'bar',
        name: '2019全年销售额',
        stack: '总量',
        data: getData(),
        smooth: true,
        label: {
          show: true,
          formatter(val) {
            return val.data + '万'
          },
        },
        itemStyle: {
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' },
          ]),
        },
      },
    ],
  }
  setTimeout(() => {
    loading.value = false
    setTimeout(() => {
      nextTick(() => useEcharts(fullYearSalesChart.value).setOption(option))
      interval = setInterval(() => {
        const option = {
          series: [
            {
              data: getData(),
            },
          ],
        }
        useEcharts(fullYearSalesChart.value).setOption(option)
      }, 5000)
    }, 100)
  }, 1000)
}
onMounted(init)
onBeforeUnmount(() => {
  dispose(fullYearSalesChart.value)
  clearInterval(interval)
})
</script>

<style lang="less" scoped>
.chart-item-container {
  width: 100%;

  .chart-item {
    height: 30vh;
  }
}
</style>

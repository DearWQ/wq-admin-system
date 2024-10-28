<template>
  <a-card
    :body-style="{ padding: '10px' }"
    :head-style="{ padding: '0 10px' }"
    title="组件数量"
    class="card-border-radius"
    :bordered="false"
  >
    <div class="chart-item-container">
      <a-skeleton animation v-if="loading">
        <a-skeleton-line :rows="4" />
      </a-skeleton>
      <template v-else>
        <div ref="channelsChart" class="chart-item"> </div>
      </template>
    </div>
  </a-card>
</template>

<script  setup>
  import useEcharts from '@/hooks/useEcharts'
  import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
  import { dispose } from 'echarts/core'
  const loading = ref(true)
  const channelsChart = ref(null)
  const init = () => {
    const option = {
      grid: {
        left: '12%',
        right: '5%',
        top: '5%',
        bottom: '3%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
      },
      series: [
        {
          name: '组件数量',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '16',
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: true,
            length: 5,
            length2: 5,
            smooth: true,
          },
          data: [
            { value: 1969, name: 'form表单组件' },
            { value: 743, name: '表格组件' },
            { value: 1594, name: '图表组件' },
            { value: 1347, name: '编辑器' },
            { value: 635, name: '地图' },
          ],
        },
      ],
    }
    setTimeout(() => {
      loading.value = false
      nextTick(() => {
        useEcharts(channelsChart.value).setOption(option)
      })
    }, 1000)
  }
  onMounted(init)
  onBeforeUnmount(() => {
    dispose(channelsChart.value)
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

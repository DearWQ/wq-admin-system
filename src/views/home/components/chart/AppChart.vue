<template>
  <a-card
    :body-style="{ padding: '10px' }"
    :head-style="{ padding: '0 10px' }"
    title="每周bug数量"
    :bordered="false"
    class="card-border-radius"
  >
    <div class="chart-item-container">
      <a-skeleton animation v-if="loading">
        <a-skeleton-line :rows="4" />
      </a-skeleton>
      <template v-else>
        <div ref="salesChart" class="chart-item"> </div>
      </template>
    </div>
  </a-card>
</template>

<script setup>
  import { dispose, graphic } from 'echarts/core'
  import useEcharts from '@/hooks/useEcharts'
  import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
  const loading = ref(true)
  const salesChart = ref(null)
  const init = () => {
    const option = {
      grid: {
        left: '2%',
        right: '5%',
        top: '5%',
        bottom: '3%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周天'],
        boundaryGap: false,
        splitLine: { show: false },
      },
      yAxis: {
        type: 'value',
        boundaryGap: false,
        splitLine: { show: false },
      },
      series: [
        {
          data: [150, 180, 224, 218, 200, 180, 150],
          type: 'line',
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 0,
          },
          areaStyle: {
            opacity: 0.5,
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(100, 162, 255)',
              },
              {
                offset: 1,
                color: 'rgba(19, 21, 219)',
              },
            ]),
          },
        },
      ],
    }
    setTimeout(() => {
      loading.value = false
      nextTick(() => {
        useEcharts(salesChart.value).setOption(option)
      })
    }, 1000)
  }
  const updateChart = () => {
    useEcharts(salesChart.value).resize()
  }
  onMounted(init)
  onBeforeUnmount(() => {
    dispose(salesChart.value)
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

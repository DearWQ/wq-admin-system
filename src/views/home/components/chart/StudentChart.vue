<template>
  <a-card
    :body-style="{ padding: '10px' }"
    :head-style="{ padding: '0 10px' }"
    title="前端训练营人数"
    :bordered="false"
    class="card-border-radius"
  >
    <template #header>
      <a-skeleton animation v-if="loading">
        <a-skeleton-line :rows="4" />
      </a-skeleton>
      <template v-else>
        <div class="text-sm"> </div>
      </template>
    </template>
    <div class="chart-item-container">
      <a-skeleton animation v-if="loading">
        <a-skeleton-line :rows="4" />
      </a-skeleton>
      <template v-else>
        <div ref="studentChart" class="chart-item"> </div>
      </template>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
  import useEcharts from '@/hooks/useEcharts'
  import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
  import { dispose, graphic } from 'echarts/core'
      const loading = ref(true)
      const studentChart = ref<HTMLDivElement | null>(null)
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
          yAxis: {
            type: 'category',
            data: ['六月', '七月', '八月', '九月', '十月', '十一月'],
            axisTick: {
              show: false,
            },
          },
          xAxis: {
            type: 'value',
            boundaryGap: 0,
          },
          series: [
            {
              data: [480, 289, 711, 618, 393, 571, 470],
              type: 'bar',
              smooth: true,
              showSymbol: false,
              barWidth: 'auto',
              itemStyle: {
                borderRadius: [0, 15, 15, 0],
                color: new graphic.LinearGradient(1, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(24, 144, 255)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(244, 187, 236)',
                  },
                ]),
              },
            },
          ],
        }
        setTimeout(() => {
          loading.value = false
          nextTick(() => {
            useEcharts(studentChart.value as HTMLDivElement).setOption(option)
          })
        }, 1000)
      }
      const updateChart = () => {
        useEcharts(studentChart.value as HTMLDivElement).resize()
      }
      onMounted(init)
      onBeforeUnmount(() => {
        dispose(studentChart.value as HTMLDivElement)
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

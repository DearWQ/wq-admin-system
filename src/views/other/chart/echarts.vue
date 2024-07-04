<template>
  <div>
    <a-card
      title="柱状图"
      :body-style="{ padding: '10px' }"
      :header-style="{ padding: '10px' }"
      class="mt-2 mb-2"
    >
      <a-row x-gap="10" y-gap="10" cols="xs:1 s:2 m:3 l:3 xl:3" responsive="screen">
        <a-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" style="height: 180px">
          <Chart :options="options4" />
        </a-col>
        <a-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" style="height: 180px">
          <Chart :options="options5" />
        </a-col>
        <a-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" style="height: 180px">
          <Chart :options="options6" />
        </a-col>
      </a-row>
    </a-card>
    <a-card title="饼状图" :content-style="{ padding: '10px' }" :header-style="{ padding: '10px' }">
      <a-row x-gap="10" y-gap="10" cols="xs:1 s:2 m:3 l:3 xl:3" responsive="screen">
        <a-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" style="height: 180px">
          <Chart :options="options7" />
        </a-col>
        <a-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" style="height: 180px">
          <Chart :options="options8" />
        </a-col>
        <a-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" style="height: 180px">
          <Chart :options="options9" />
        </a-col>
      </a-row>
    </a-card>
    <a-card title="折线图" :body-style="{ padding: '10px' }" :header-style="{ padding: '10px' }">
      <a-row>
        <a-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" style="height: 180px">
          <Chart :options="options1" />
        </a-col>
        <a-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" style="height: 180px">
          <Chart :options="options2" />
        </a-col>
        <a-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" style="height: 180px">
          <Chart :options="options3" />
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import Chart from './components/Chart.vue'
  const options1 = {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    grid: {
      x: '10%',
      y: '5%',
      x2: '5%',
      y2: '15%',
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line',
      },
    ],
  }
  const options2 = {
    grid: {
      x: '10%',
      y: '5%',
      x2: '5%',
      y2: '15%',
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        areaStyle: {},
      },
    ],
  }
  const options3 = {
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'JAVA',
        type: 'line',
        stack: '总量',
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: 'Vue',
        type: 'line',
        stack: '总量',
        data: [220, 182, 191, 234, 290, 330, 310],
      },
      {
        name: 'React',
        type: 'line',
        stack: '总量',
        data: [150, 232, 201, 154, 190, 330, 410],
      },
      {
        name: 'Flutter',
        type: 'line',
        stack: '总量',
        data: [320, 332, 301, 334, 390, 330, 320],
      },
      {
        name: 'Go',
        type: 'line',
        stack: '总量',
        data: [820, 932, 901, 934, 1290, 1330, 1320],
      },
    ],
    grid: {
      x: '15%',
      y: '5%',
      x2: '1%',
      y2: '15%',
    },
  }
  const options4 = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)',
        },
      },
    ],
    grid: {
      x: '15%',
      y: '5%',
      x2: '1%',
      y2: '15%',
    },
  }
  const options5 = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [
          120,
          {
            value: 200,
            itemStyle: {
              color: '#a90000',
            },
          },
          150,
          80,
          70,
          110,
          130,
        ],
        type: 'bar',
      },
    ],
    grid: {
      x: '15%',
      y: '5%',
      x2: '1%',
      y2: '15%',
    },
  }
  const options6 = {
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
    },
    yAxis: {
      type: 'category',
      data: ['Vue', 'React', 'JAVA', 'GO', 'Flutter'],
    },
    series: [
      {
        name: '2011年',
        type: 'bar',
        data: [18203, 23489, 29034, 104970, 131744],
      },
      {
        name: '2012年',
        type: 'bar',
        data: [19325, 23438, 31000, 121594, 134141],
      },
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      x: '15%',
      y: '5%',
      x2: '1%',
      y2: '15%',
    },
  }
  const options7 = {
    series: [
      {
        name: '互联网职位',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: 'FE' },
          { value: 735, name: 'RD' },
          { value: 580, name: 'PM' },
          { value: 484, name: 'UI/UX' },
          { value: 300, name: 'QA' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
    grid: {
      x: '15%',
      y: '5%',
      x2: '1%',
      y2: '15%',
    },
  }
  const options8 = {
    series: [
      {
        name: '互联网职位',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '20',
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: 'FE' },
          { value: 735, name: 'RD' },
          { value: 580, name: 'UI/UX' },
          { value: 484, name: 'QA' },
          { value: 300, name: 'PM' },
        ],
      },
    ],
    grid: {
      x: '15%',
      y: '5%',
      x2: '1%',
      y2: '15%',
    },
  }
  const options9 = {
    series: [
      {
        name: '开发流程',
        type: 'pie',
        radius: [20, 60],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8,
        },
        data: [
          { value: 40, name: '需求评审' },
          { value: 38, name: '技术评审' },
          { value: 32, name: '交互评审' },
          { value: 30, name: '接口对齐' },
          { value: 28, name: '接口联调' },
          { value: 26, name: '提测' },
          { value: 22, name: '修复bug' },
          { value: 18, name: '上线' },
        ],
      },
    ],
    grid: {
      x: '15%',
      y: '5%',
      x2: '1%',
      y2: '15%',
    },
  }
</script>

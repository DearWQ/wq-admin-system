<script setup >

import WeeklySchedule from "@/components/WeeklySchedule/WeeklySchedule.vue";
import {ref} from "vue";
import {getCurDay} from "@/utils";

const timePeriodList=ref([
  {
    timePeriod: '8:00~10:00',
    schedule: [
      {
        isExpend: false,
        [getCurDay()]: [
          {
            timePeriod: '8:00~10:00',
            date: getCurDay(),
            course: '大学英语',
            watchman: '井底的蜗牛',
            place: '测试地点',
            status: 1,
          },
          {
            timePeriod: '8:00~10:00',
            date: getCurDay(),
            course: '大学英语',
            watchman: '井底的蜗牛',
            place: '测试地点',
            status: 2,
          },
          {
            timePeriod: '8:00~10:00',
            date: getCurDay(),
            course: '大学英语',
            watchman: '井底的蜗牛',
            place: '测试地点',
            status: 3,
          },
        ],
      },
      {
        isExpend: false,
        [getCurDay(-1)]: [
          {
            id: 1,
            timePeriod: '8:00~10:00',
            date: getCurDay(-1),
            course: '大学英语',
            watchman: '井底的蜗牛',
            place: '测试地点',
            status: 1,
          },
        ]
      }
    ]
  },
  {
    timePeriod: '12:00~14:00',
    schedule: [
      {
        isExpend: false,
        [getCurDay()]: [
          {
            timePeriod: '12:00~14:00',
            date: getCurDay(),
            course: '大学英语',
            watchman: '井底的蜗牛',
            place: '测试地点',
            status: 2,
          },
          {
            timePeriod: '12:00~14:00',
            date: getCurDay(),
            course: '大学英语',
            watchman: '井底的蜗牛',
            place: '测试地点',
            status: 3,
          },
        ],
      },
      {
        isExpend: false,
        [getCurDay(-1)]: [
          {
            timePeriod: '12:00~14:00',
            date: getCurDay(-1),
            course: '大学英语',
            watchman: '井底的蜗牛',
            place: '测试地点',
            status: 1,
          },
          {
            timePeriod: '14:00~1600',
            date: getCurDay(-1),
            course: '大学英语',
            watchman: '井底的蜗牛',
            place: '测试地点',
            status: 1,
          },
          {
            timePeriod: '16:00~1800',
            date: getCurDay(-1),
            course: '大学英语',
            watchman: '井底的蜗牛',
            place: '测试地点',
            status: 1,
          },
        ]
      }
    ]
  },
  {
    timePeriod: '14:00~16:00',
    schedule: []
  },
])


/**
 * 点击详情
 * @param row
 */
const handleDetail=(row)=>{
  console.log(row)
}
/**
 * 点击卡片查看全部内容
 */
const handleCardDetail=(row)=> {
  console.log(row)
}
/**
 * 切换周
 * @param date
 */
const changeWeek=(date)=>{
  console.log(date)
}

</script>

<template>

  <weekly-schedule :planList="timePeriodList" :isFirstDayOfMondayOrSunday="1" :hasNumExpend="2" @handleDetail="handleDetail" @handleCardDetail="handleCardDetail" @changeWeek="changeWeek">
    <template v-slot:thing="{row}">
      <span>时段：{{ row.timePeriod }}</span>
      <span>课程：{{ row.course }}</span>
      <span>值班员：{{ row.watchman }}</span>
      <span>地点：{{ row.place }}</span>
    </template>
  </weekly-schedule>
</template>

<style scoped lang="less">

</style>
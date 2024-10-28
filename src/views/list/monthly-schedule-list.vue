<script setup>
import MonthlySchedule from "@/components/MonthlySchedule/MonthlySchedule.vue";
import {ref} from "vue";
import {getCurDay} from "@/utils";

const plan= ref([
  {
    date: getCurDay(),
    status: 1,
    timePeriod: '08:00~10:00',
    course: '高等数学撒旦发射点发射点发射点发射点地方圣诞氛围范围方法书店发时段 '
  },
  {
    date: getCurDay(),
    status: 2,
    timePeriod: '14:00~16:00',
    course: '高等数学撒旦发射点发射点发射点发射点地方圣诞氛围范围方法书店发时段'
  },
  {
    date: getCurDay(),
    status: 3,
    timePeriod: '10:00~12:00',
    course: '高等数学撒旦发射点发射点发射点发射点地方圣诞氛围范围方法书店发时段'
  },
  {
    date: getCurDay(),
    status: 3,
    timePeriod: '14:00~16:00',
    course: '高等数学撒旦发射点发射点发射点发射点地方圣诞氛围范围方法书店发时段'
  },
  {
    date: getCurDay(2),
    status: 3,
    timePeriod: '16:00~18:00',
    course: '高等数学撒旦发射点发射点发射点发射点地方圣诞氛围范围方法书店发时段 '
  },
  {
    date: getCurDay(1),
    status: 3,
    timePeriod: '16:00~18:00',
    course: '高等数学撒旦发射点发射点发射点发射点地方圣诞氛围范围方法书店发时段 '
  }
])

/**
 * 点击日程查看详情
 * @param row
 */
const handleDetail=(row)=>{
  console.log(row)
}
/**
 * 切换周
 * @param date
 */
const changeMonth=(date)=>{
  console.log(date)
}
/**
 * 点击日期查看数据
 * @param row
 */
const chooseEntireCard=(row)=> {
  console.log(row);
}

</script>

<template>
      <MonthlySchedule :scheduleList="plan" :isExpend="false" :hasNumExpend="3" @handleDetail="handleDetail" @chooseEntireCard="chooseEntireCard"
                 @changeMonth="changeMonth">
        <template v-slot:card="{row}">
          <span>时段：{{ row.timePeriod }}</span>
          <span>课程：{{ row.course }}</span>
        </template>
      </MonthlySchedule>
</template>

<style scoped lang="less">

</style>
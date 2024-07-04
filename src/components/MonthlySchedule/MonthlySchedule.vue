<script setup lang="ts">

import {onMounted, ref} from "vue";
import {getCurDay} from "@/utils";

const props=defineProps({
  //日程数据
  scheduleList: {
    type: Array,
    default:()=>[]
  },
  //是否展开，默认不展开
  isExpend:{
    type: Boolean,
    default:false
  },
  //多少进行展开
  hasNumExpend:{
    type: Number,
    default:2
  },
  //卡片状态
  cardStatus: {
    type: Object,
    default: () => {
      return {
        1: {
          title: '已过期',
          color: '#9CADADB7'
        },
        2: {
          title: '进行中',
          color: '#FF6200'
        },
        3: {
          title: '未开始',
          color: '#3291F8'
        },
      }
    }
  }
})
const year=ref()
const month=ref()
const endTime=ref(null)
const startTime=ref('')
const monthValue=ref('')
const days=ref([])
//展开与缩放操作
const handleExpand=(row)=> {
  row.isExpend = !row.isExpend
}
const changeMonth=()=> {
  const date = monthValue.value && monthValue.value.split('-').map(Number) || []
  if (date.length === 0) {
    return
  }
  year.value = date[0];
  month.value = date[1]
  days.value = [];
  pushDays();
}
//得到当前年这个月分有多少天
const getDays=(Y, M)=> {
  return new Date(Y, M, 0).getDate();
}

//得到当前年，这个月的一号是周几
const getWeek=(Y, M)=> {
  let now = new Date()
  now.setFullYear(year.value)
  now.setMonth(month.value - 1)
  now.setDate(1);
  return now.getDay();
}

/**
 * 获取本月日期
 */
const pushDays=()=> {
  //将这个月多少天加入数组days
  for (let i = 1; i <= getDays(year.value, month.value); i++) {
    const _day = `${i > 9 ? i : '0' + i}`, _month = `${month.value > 9 ? month.value : '0' + month.value}`,
        date = `${year.value}-${_month}-${_day}`;
    days.value.push({
      day: _day,//
      date,
      isExpend:props.isExpend,
      planList:props.scheduleList.filter(item => item.date === date),
      isCurMonth: true,
      month: _month,
      year: `${year.value}`,
      timestamp: new Date(date).getTime(),//转换时间戳
    })
  }
  getLastMonthDays()
  getNextMonthDays()
}
/**
 * 获取下个月的日期
 */
const getNextMonthDays=()=> {
  const w_month = month.value < 12 ? month.value + 1 : 1,
      w_year = month.value < 12 ? year.value : year.value + 1,
      len = 42 - getDays(year.value, month.value) - getWeek(year.value, month.value)
  //将下个月要显示的天数加入days
  for (let i = 1; i <= len; i++) {
    const _day = `${i > 9 ? i : '0' + i}`, _month = `${w_month > 9 ? w_month : '0' + w_month}`,
        date = `${w_year}-${_month}-${_day}`;
    days.value.push({
      day: _day,
      date,
      isExpend:props.isExpend,
      month: _month,
      year: `${w_year}`,
      planList: props.scheduleList.filter(item => item.date === date),
      isNextMonth: true,
      timestamp: new Date(date).getTime()
    })
  }
}

/**
 * 获取上个月的日期
 */
const getLastMonthDays=()=> {
  const w_month =  month.value > 1 ?  month.value - 1 : year.value > 1970 ? 12 : 1,
      w_year = month.value > 1 ? year.value : year.value > 1970 ? year.value - 1 : 1970,
      len = getWeek(year.value, month.value),
      lastMonthDays = getDays(year.value, month.value - 1)
  //将上个月要显示的天数加入days
  for (let i = 0; i < len; i++) {
    const _month = w_month > 9 ? `${w_month}` : `0${w_month}`,
        date = `${w_year}-${_month}-${lastMonthDays - i}`;
    days.value.unshift({
      day: `${lastMonthDays - i}`,
      date,
      month: _month,
      year: `${w_year}`,
      isExpend:props.isExpend,
      planList: props.scheduleList.filter(item => item.date === date),
      isLastMonth: true,
      timestamp: new Date(date).getTime(),
    })
  }
}

/**
 * 获取日期数据
 */
const getDate=()=> {
  let now = new Date();
  year.value = now.getFullYear();
  month.value = now.getMonth() + 1;
  pushDays();
}

const emit=defineEmits(['changeMonth','chooseEntireCard','handleDetail'])

/**
 * 下个月
 */
const handleShowNextMonth=()=> {
  if (month.value < 12) {
    month.value = month.value + 1;
  } else {
    month.value = month.value = 1;
    year.value = year.value + 1;
  }
  dealCurDay();
  const dateObj = {
    date: `${year.value}-${month.value}`,
    timestamp: new Date(`${year.value}-${month.value}`).getTime()
  }
  emit('changeMonth', dateObj)
}


/**
 * 当天
 */
const handleShowToday=()=> {
  let now = new Date();
  year.value = now.getFullYear();
  month.value = now.getMonth() + 1;
  dealCurDay();
  const dateObj = {
    date: `${year.value}-${month.value}`,
    timestamp: new Date(`${year.value}-${month.value}`).getTime()
  }
  emit('changeMonth', dateObj)
}

/**
 * 处理当天数据
 */
const dealCurDay=()=> {
  days.value = [];
  const curDate = getCurDay()
  pushDays();
  days.value.forEach(item => {
    item.isCurToday = item.date === curDate
  })
}
/**
 * 上个月
 */
const handleShowLastMonth=()=> {
  days.value = [];
  if (month.value > 1) {
    month.value = month.value - 1;
    dealCurDay();
  } else if (year.value > 1970) {
    month.value = 12;
    year.value = year.value - 1;
    dealCurDay();
  } else {
    dealCurDay();
    return new Error('只能查1970以后的月份')
  }
  const dateObj = {
    date: `${year.value}-${month.value}`,
    timestamp: new Date(`${year.value}-${month.value}`).getTime()
  }
  emit('changeMonth', dateObj)
}
/**
 * 选择日期卡片详情
 * @param row
 */
const handleChooseCard=(row = {})=> {
  emit('chooseEntireCard', row)
}
/**
 * 查看单个日程详情
 */
const handleDetail=(row)=> {
  emit('handleDetail', row)
}

onMounted(()=>{
  getDate();
  handleShowToday()
})

</script>

<template>
  <div class="month-container">
    <div class="month-top">
      <div class="m-btn-wrap">
        <span @click="handleShowLastMonth">上一月</span>
        <span @click="handleShowToday"> 今天 </span>
        <span @click="handleShowNextMonth">下一月</span>
      </div>
      <span class="m-today-date"> {{ year }}年{{ month > 9 ? month : `0${month}` }}月</span>
      <div class="m-card-status">
        <div v-for="sta in cardStatus">
          <span class="square" :style="{background:sta.color}"></span>
          <span class="title">{{ sta.title }}</span>
        </div>
      </div>
    </div>
    <div class="m-date-wrap">
      <ul class="m-week">
        <li>日</li>
        <li>一</li>
        <li>二</li>
        <li>三</li>
        <li>四</li>
        <li>五</li>
        <li>六</li>
      </ul>
      <ul class="m-day">
        <li v-for="(myDay,index) in days"
            :class="{'m-isActive':myDay.isActive,'m-isCurToday':myDay.isCurToday}"
            :key="index" @click="handleChooseCard(myDay)">
          <span  class="m-date" :class="{'m-isCurMonth':myDay.isNextMonth||myDay.isLastMonth}">
            {{ myDay.day }}
          </span>
          <template v-for="(plan,i) in myDay.planList">

            <div v-if="i<hasNumExpend&&!myDay.isExpend" :key="`plan${i}`" @click="handleDetail(plan)"
                 class="m-card-default"
                 :style="{background: cardStatus[plan.status].color}">
              <slot name="card" :row="plan"></slot>
            </div>
            <div v-if="myDay.isExpend" :key="`plan${i}`" @click="handleDetail(plan)"
                 class="m-card-default"
                 :style="{background: cardStatus[plan.status].color}">
              <slot name="card" :row="plan"></slot>
            </div>
          </template>
          <div class="w_expand" v-if="myDay.planList.length>hasNumExpend&&!myDay.isExpend" @click="handleExpand(myDay)">展开
          </div>
          <div class="w_shrink" v-if="myDay.planList.length>hasNumExpend&&myDay.isExpend"
               @click="handleExpand(myDay)">收缩
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="less">
ul {
  list-style: none;
}
.month-container {
  background: #fff;
  width: 100%;
  border: 1px solid #ddd;
  padding: 20px;
  box-sizing: border-box;
}

.month-top {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1% 0;
  box-sizing: border-box;

}

.month-top .m-btn-wrap {
  width: 200px;
  display: flex;
  justify-content: space-around;
  color: #409EFF;

}

.month-top .m-btn-wrap > span {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;

}

.month-top .m-card-status {
  display: flex;
  width: 20%;
  justify-content: flex-end;
}

.month-top .m-card-status > div {
  flex: 1;
  display: flex;
  padding: 0 2%;
  white-space: nowrap;
  line-height: 20px;
  box-sizing: border-box;

}

.month-top .m-card-status > div .square {
  display: flex;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  box-sizing: border-box;
}

.month-top .m-card-status > div .title {
  display: flex;
  align-items: center;
  line-height: 16px;
  margin-left: 4px;
  font-size: 14px;
}

.m-date-wrap {
  width: 100%;
  height: auto;

}

.m-date-wrap .m-week {
  width: 100%;
  height: 80px;
  margin: 0;
  line-height: 80px;
  display: flex;
  flex-direction: row;
  font-size: 16px;
  background: #EAEDF2;
  box-sizing: border-box;

}

.m-date-wrap .m-week > li {
  width: 14.28%;
  padding-left: 1%;
  box-sizing: border-box;
}

.m-date-wrap .m-day {
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 0;
  margin: 0;
  font-size: 14px;
  flex-wrap: wrap;
  box-sizing: border-box;

}

.m-day .m-date{
  cursor: pointer;
}

.m-date-wrap .m-day > li {
  width: 14.28%;
  padding: 1%;
  min-height: 100px;
  box-sizing: border-box;
  border: 1px solid #ddd;
}

.m-date-wrap .m-day > li .m-card-default {
  cursor: pointer;
  width: 100%;
  min-height: 60px;
  border-radius: 8px;
  display: flex;
  margin: 6% 0;
  flex-direction: column;
  justify-content: space-around;
  //white-space: nowrap;
  color: #fff;
  background: #FF6200;
  padding: 2% 4%;
  box-sizing: border-box;
}

.m-card-default span{
  overflow: hidden;
  text-overflow: ellipsis;
}

.m-date-wrap .m-day > li:nth-child(n+8) {
  border-top: none;
}

.m-date-wrap .m-day > li:nth-child(n+1) {
  border-right: none;
}

.m-date-wrap .m-day > li:nth-child(7n) {
  border-right: 1px solid #ddd
}

.m-isCurMonth {
  background: #fff;
  color: #c0c4cc;
}

.m-isCurToday {
  background: #FFF1F0 10000%;
  color: #FF2525;
}


.m-isActive {
  background: #409EFF;
  color: #f2f8fe;
}

.w_expand, .w_shrink {
  color: #0A98D5;
  cursor: pointer;
  width: 100%;
  padding: 2% 0;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

</style>
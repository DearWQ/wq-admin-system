<script setup>

import {onMounted, ref, watch} from "vue";
import {getCurDay} from "@/utils";

const props = defineProps(
    {
      //是否是多选
      isMultipleChoice: {
        type: Boolean,
        default: true,
      },
      //是否是单点
      isSinglePoint: {
        type: Boolean,
        default: false,
      },
      //是否显示清除按钮
      isShowClear: {
        type: Boolean,
        default: true
      },
      //选择的月份
      Month: {
        type: String,
      },
      //需要加圆点的数据
      //数据格式为map { new Date(2022-02-11).getTime():true}: 用年月日的时间戳为key
      pointMap: {
        type: Object,
        default: () => {
          return {}
        }
      },
      //是否禁止选择以前的日期 默认为空表示没有限制 注：如果只有数字则 默认时间是当天时间
      //{1:['2022-02-11']}表示2022-02-11以前的日期不能选择；1：表示小于该时间的禁止选择，必填
      //{2:['2022-02-11']}表示2022-02-11以后的日期不能选择；2：表示大于该时间的禁止选择，必填
      //{3:['2022-02-11','2022-03-11']}表示2022-02-11到2022-03-11之间的日期可以选择；3：表示两个时间内的时间可以选择，必填
      //{4:['2022-02-11','2022-03-11']}表示2022-02-11到2022-03-11之外的日期可以选择；4：表示两个时间之外的可以选择，必填
      restrictDate: {
        type: Object,
        default: () => {
          return null
        }
      }
    }
)
const year = ref()
const month = ref()
const days = ref()
//是否已经选择了开始时间
const isChooseOne = ref(false)
const endTime = ref('')
const startTime = ref('')
const monthValue = ref('')
//如果是单选 则把选择的保存
const chooseDateList = ref({})

//得到当前年这个月分有多少天
const getDays = (Y, M) => {
  return new Date(Y, M, 0).getDate()
}
//得到当前年，这个月的一号是周几
const getWeek = (Y, M) => {
  let now = new Date()
  now.setFullYear(year.value)
  now.setMonth(month.value - 1)
  now.setDate(1)
  return now.getDay()
}
/**
 * 获取本月日期
 */
const pushDays = () => {
  //将这个月多少天加入数组days
  const m = `${month.value > 9 ? month.value : '0' + month.value}`
  for (let i = 1; i <= getDays(year.value, month.value); i++) {
    const d = `${i > 9 ? i : '0' + i}`,
        date = `${year.value}-${m}-${d}`
    days.value.push({
      day: d,
      isActive: false,
      month: m,
      year: `${year.value}`,
      date,
      timestamp: new Date(date).getTime(),//转换时间戳
    })
  }
  //获取上个月的日期
  getLastMonthDays()
  //获取下个月的日期
  getNextMonthDays()
}
/**
 * 获取下个月的日期
 */
const getNextMonthDays = () => {
  const m = month.value < 12 ? month.value + 1 : 1,
      y = month.value < 12 ? year.value : year.value + 1,
      len = 42 - getDays(year.value, month.value) - getWeek(year.value, month.value),
      _m = `${m > 9 ? m : '0' + m}`
  //将下个月要显示的天数加入days
  for (let i = 1; i <= len; i++) {
    const _d = `${i > 9 ? i : '0' + i}`,
        date = `${y}-${_m}-${_d}`
    days.value.push({
      day: _d,
      month: _m,
      year: `${y}`,
      isActive: false,
      isNextMonth: true,
      date,
      timestamp: new Date(date).getTime()
    })
  }
}
/**
 * 获取上个月的日期
 */
const getLastMonthDays = () => {
  const m = month.value > 1 ? month.value - 1 : year.value > 1970 ? 12 : 1,
      y = month.value > 1 ? year.value : year.value > 1970 ? year.value - 1 : 1970,
      len = getWeek(year.value, month.value),
      lastMonthDays = getDays(year.value, month.value - 1)
  //将上个月要显示的天数加入days
  for (let i = 0; i < len; i++) {
    const _m = `${m > 9 ? m : '0' + m}`,
        date = `${y}-${_m}-${lastMonthDays - i}`
    days.value.unshift({
      day: `${lastMonthDays - i}`,
      month: _m,
      year: `${y}`,
      isActive: false,
      isLastMonth: true,
      date,
      timestamp: new Date(date).getTime(),
    })
  }
}

/**
 * 上个月
 */
const handleShowLastMonth = () => {
  if (month.value > 1) {
    month.value = month.value - 1
  } else if (year.value > 1970) {
    month.value = 12
    year.value = year.value - 1
  }
  dealDate()
}

/**
 * 下个月
 */
const handleShowNextMonth =()=> {
  days.value = []
  if (month.value < 12) {
    month.value = month.value + 1
  } else {
    month.value =  1
    year.value = year.value + 1
  }
  dealDate()
}

/**
 * 当天
 */
const handleShowToday =()=> {
  let now = new Date()
  year.value = now.getFullYear()
  month.value = now.getMonth() + 1
  dealDate()
}

/**
 * 处理时间
 */
const dealDate =()=> {
  days.value = []
  const curDate = getCurDay()
  pushDays()
  // 判断 是否需要禁止选择某些时间段的时间
  if (props.restrictDate) {
    const keys = Object.keys(props.restrictDate)
    let day, timestamp
    switch (keys[0]) {
      case '1':
        day = props.restrictDate[keys[0]] && props.restrictDate[keys[0]] || curDate
        timestamp = new Date(day).getTime()//转换时间戳
        days.value.forEach(item => {
          item.isCurToday = item.date === curDate
          item.isPreviousDate = item.timestamp < timestamp
        })
        break
      case '2':
        day = props.restrictDate[keys[0]] && props.restrictDate[keys[0]] || curDate
        timestamp = new Date(day).getTime()//转换时间戳
        days.value.forEach(item => {
          item.isCurToday = item.date === curDate
          item.isPreviousDate = item.timestamp > timestamp
        })
        break
      case '3':
        const s_d = props.restrictDate[keys[0]] && props.restrictDate[keys[0]][0] || curDate
        const e_d = props.restrictDate[keys[0]] && props.restrictDate[keys[0]][1] || curDate
        let s = new Date(s_d).getTime(),
            e = new Date(e_d).getTime()
        if (s > e) {
          [s, e] = [e, s]
        }
        days.value.forEach(item => {
          item.isCurToday = item.date === curDate
          item.isPreviousDate = item.timestamp < s || item.timestamp > e
        })
        break
      case '4':
        const st_d = props.restrictDate[keys[0]] && props.restrictDate[keys[0]][0] || curDate
        const en_d = props.restrictDate[keys[0]] && props.restrictDate[keys[0]][1] || curDate
        let st = new Date(st_d).getTime(),
            en = new Date(en_d).getTime()
        if (st > en) {
          [st, en] = [en, st]
        }
        days.value.forEach(item => {
          item.isCurToday = item.date === curDate
          item.isPreviousDate = item.timestamp > st && item.timestamp < en
        })
        break
      default:
        days.value.forEach(item => {
          item.isCurToday = item.date === curDate
        })
    }
  } else {
    days.value.forEach(item => {
      item.isCurToday = item.date === curDate
    })
  }
  getActiveDay()
}
/**
 * 清空选择
 */
const handleClear =()=> {
  isChooseOne.value = false
  startTime.value = null
  endTime.value = null
  chooseDateList.value = {}
  days.value.forEach(item => {
    item.isActive = false
  })
}

const emit = defineEmits(['chooseDays'])
/**
 * 选择时间
 * @param time
 */
const handleChooseDay =(time = {})=> {
  // 判断 是否是禁止选择的日期 是否是
  if (props.restrictDate && time.isPreviousDate) {
    return
  }
  //是否是单点
  if(props.isSinglePoint){
    chooseDateList.value={}
    const { date, day, month, timestamp, year } = time
    days.value.forEach(item => {
      item.isActive = item.timestamp === time.timestamp
    })
    chooseDateList.value[time.timestamp] = {
      date,
      day,
      month,
      timestamp,
      year
    }
  }else{
    //是否是多选
    if (props.isMultipleChoice) {
      chooseDateList.value = {}
      //选择开始时间-结束时间
      if (isChooseOne.value) {
        endTime.value = time
        const { timestamp } = startTime.value || {}
        //如果 选择的开始日期大于结束日期 则调换开始日期与结束日期
        if (timestamp > time.timestamp) {
          [startTime.value, endTime.value] = [endTime.value, startTime.value]
        }
        getActiveDay()
        isChooseOne.value = false
      } else {
        isChooseOne.value = true
        startTime.value = time
        //给选择的时间范围选中
        days.value.forEach(item => {
          item.isActive = item.timestamp ===startTime.value.timestamp
        })
      }
    } else {
      days.value.forEach(item => {
        if (item.timestamp === time.timestamp) {
          item.isActive = !time.isActive
          if (time.isActive) {
            const { date, day, month, timestamp, year } = item
            chooseDateList.value[time.timestamp] = {
              date,
              day,
              month,
              timestamp,
              year
            }
          } else {
            delete chooseDateList.value[time.timestamp]
          }
        }
      })
    }
  }
  emit('chooseDays', chooseDateList.value)
}
/**
 * 给选择的日期范围加上选中状态
 */
const getActiveDay =()=> {
  if (props.isMultipleChoice) {
    if (!startTime.value || !endTime.value) {
      return
    }
    //给选择的时间范围选中
    const { timestamp } = startTime.value || {}
    const { timestamp: endTimestamp } = endTime.value || {}
    days.value.forEach(item => {
      item.isActive = item.timestamp >= timestamp && item.timestamp <= endTimestamp && !item.isPreviousDate
      //是否显示点
      item.isShowPoint = props.pointMap[item.timestamp]
      if (item.timestamp >= timestamp && item.timestamp <= endTimestamp && !item.isPreviousDate) {
        const { date, day, month, timestamp, year } = item
        chooseDateList.value[item.timestamp] = {
          date,
          day,
          month,
          timestamp,
          year
        }
      } else {
        delete chooseDateList.value[item.timestamp]
      }
    })
  } else {
    days.value.forEach(item => {
      //是否显示点
      item.isShowPoint = props.pointMap[item.timestamp]
      //已选择的数据加上状态
      item.isActive = !!chooseDateList.value[item.timestamp]
    })
  }
}
watch(()=>props.Month, (val) => {
  if (val) {
    const date = val.split('-').map(Number)
    year.value = date[0]
    month.value = date[1]
    days.value = []
    //选择月份后重新跟更新时间
    dealDate()
  }
}, {immediate: true})

watch(props.pointMap , (val) => {
  if (val) {
    dealDate()
  }
}, {deep: true, immediate: true})

onMounted(()=>{
  handleShowToday()
})
</script>

<template>
  <div v-bind="$attrs" class="w-calender-container">
    <div class="w-top">
      <div class="w-chooseMonth">
        <slot name="left"></slot>
      </div>
      <div class="w-top-date">
        {{ year }}年{{ `${month > 9 ? month : '0' + month}` }}月
      </div>
      <div class="w-btn-wrap">
        <span @click="handleShowLastMonth">上一月</span>
        <span @click="handleShowToday">今天</span>
        <span @click="handleShowNextMonth">下一月</span>
        <span v-if="isShowClear" @click="handleClear">清除</span>
      </div>
    </div>
    <div class="w-date_wrap">
      <ul class="w-week">
        <li>日</li>
        <li>一</li>
        <li>二</li>
        <li>三</li>
        <li>四</li>
        <li>五</li>
        <li>六</li>
      </ul>
      <ul class="w-day">
        <li v-for="(item,index) in days"
            :key="index"
            :class="{'c-isCurMonth':item.isNextMonth||item.isLastMonth,'c-isCurToday':item.isCurToday,'c-isActive':item.isActive,'c-is-previous-date':item.isPreviousDate}"
            @click="handleChooseDay(item)">
          <span>
             {{ item.day }}
          </span>
          <span v-if="item.isShowPoint" class="w-point"></span>
        </li>
      </ul>
    </div>
    <div class="date-tip">
      <div class="tip_row">
        <span class="square"></span>
        <span class="title">可选</span>
      </div>
      <div class="tip_row">
        <span class="square chosen"></span>
        <span class="title">已选中</span>
      </div>
    </div>
  </div>
</template>

<style>
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.w-calender-container {
  width: 100%;
  min-width: 400px;
  border: 1px solid #ddd;
  padding: 20px;
  box-sizing: border-box;
}

.w-top {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1% 0;
  border-bottom: 1px solid #ddd;
  box-sizing: border-box;
}

.w-top .w-top-date {
  white-space: nowrap;
}

.w-top .w-btn-wrap {
  min-width: 200px;
  display: flex;
  justify-content: space-around;
  color: #409EFF;
}

.w-btn-wrap span {
  flex: 1;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
}

.w-btn-wrap span:last-child {
  color: #FF6200;
}

.w-date_wrap {
  width: 100%;
  height: auto;
}

.w-date_wrap .w-week {
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 10px 0;
  font-size: 16px;
  box-sizing: border-box;
}

.w-date_wrap .w-week li {
  width: 14.28%;
}

.w-date_wrap .w-day {
  -webkit-tap-highlight-color: transparent;
  width: 100%;
  display: flex;
  flex-direction: row;
  font-size: 16px;
  flex-wrap: wrap;
  box-sizing: border-box;
}

.w-day li {
  -webkit-tap-highlight-color: transparent;
  position: relative;
  cursor: pointer;
  width: 14.28%;
  padding: 4%;
  border: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.w-day li .w-point {
  position: absolute;
  bottom: 26%;
  background: #ff0000;
  display: flex;
  width: 4px;
  height: 4px;
  border-radius: 50%;
}

.w-day li:nth-child(n+8) {
  border-top: none;
}

.w-day li:nth-child(n+1) {
  border-right: none;
}

.w-day li:nth-child(7n) {
  border-right: 1px solid #ddd
}

.date-tip {
  height: 40px;
  width: 100%;
  display: flex;
}

.tip_row {
  width: 100px;
  height: 100%;
  display: flex;
  align-items: center;
}

.tip_row:first-child {
  padding-left: 20px;
  box-sizing: border-box;
}

.tip_row .square {
  width: 20px;
  height: 20px;
  display: flex;
  background: #fff;
  border: 1px solid #c0c4cc;
}

.tip_row .chosen {
  background: #409EFF;
  border: 0;
}

.tip_row .title {
  display: flex;
  padding-left: 6px;
  box-sizing: border-box;
  white-space: nowrap;
}


.c-isCurMonth {
  background: #fff;
  color: #c0c4cc;
}

.c-isCurToday {
  background: #fff;
  color: #409EFF;
}


.c-isActive {
  background: #409EFF;
  color: #f2f8fe;
}

.chooseMonth {
  width: 120px;

}

.isCurYearDay {
  cursor: not-allowed !important;
  opacity: 0.6;
}

.c-isCurMonth.c-isActive {
  background: rgba(64, 158, 255, 0.56);
}

.c-is-previous-date {
  background: rgba(192, 196, 204, 0.2);
  color: #c0c4cc;
  cursor: not-allowed !important;
}

</style>
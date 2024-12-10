<template>
  <a-card title="日历组件">
    <div class="flex">
      <div class="flex-1">
        <a-card title="组件配置">
          <a-collapse :default-active-key="['1','2']">
            <a-collapse-item key="1" header="isSinglePoint：是否单点">
              <a-switch v-model="isSinglePoint">
                <template #checked>
                  是
                </template>
                <template #unchecked>
                  否
                </template>
              </a-switch>
              <a-space size="large" style="margin-left: 16px">
                【{{ isSinglePoint ? '单点选择，一次只能选择一个日期' : '多点选择，一次可以选择多个日期，重复点击可取消' }}】
              </a-space>
            </a-collapse-item>
            <a-collapse-item v-if="!isSinglePoint"
                             key="2" header="isMultipleChoice:是否连续选择【注：只有当单点选择为false时，才能连续选择】">
              <a-switch v-model="isMultipleChoice">
                <template #checked>
                  是
                </template>
                <template #unchecked>
                  否
                </template>
              </a-switch>
              <a-space size="large" style="margin-left: 16px">
                {{
                  isMultipleChoice ? '连续选择,选择开始时间和结束时间' : '多点选择，一次可以选择多个日期，重复点击可取消'
                }}
              </a-space>
            </a-collapse-item>
            <a-collapse-item key="3" header="pointMap：需要加圆点的数据">
              <a-date-picker style="width: 200px;" v-model="pointDate" @change="changeDate"/>
              <a-space size="large" style="margin-left: 16px">
                {{pointDate}}
              </a-space>
            </a-collapse-item>
            <a-collapse-item key="4" header="restrictDate：是否禁止选择以前的日期 默认为空表示没有限制">
              <a-radio-group v-model="radiaValue" @change="changeValue">
                <a-radio :value="1">1</a-radio>
                <a-radio :value="2">2</a-radio>
                <a-radio :value="3">3</a-radio>
                <a-radio :value="4">4</a-radio>
              </a-radio-group>
              <a-space size="large" style="margin-left: 16px">
                restrictDate={{JSON.stringify(restrictDate)}}
              </a-space>
              <p v-if="radiaValue===1">{1:[{{ getCurDay() }}]}表示{{ getCurDay() }}以前的日期不能选择；1：表示小于该时间的禁止选择，必填</p>
              <p v-if="radiaValue===2">{2:[{{ getCurDay() }}]}表示{{ getCurDay() }}以后的日期不能选择；2：表示大于该时间的禁止选择，必填</p>
              <p v-if="radiaValue===3">
                {3:[{{ getCurDay() }},{{ getRecentDate(7) }}]}表示{{ getCurDay() }}到{{
                  getRecentDate(7)
                }}之间的日期可以选择；3：表示两个时间内的时间可以选择，必填</p>
              <p v-if="radiaValue===4">
                {4:[{{ getCurDay() }},{{
                  getRecentDate(7)
                }}]}表示{{ getCurDay() }}到{{ getRecentDate(7) }}之外的日期可以选择；4：表示两个时间之外的可以选择，必填</p>
            </a-collapse-item>
          </a-collapse>
        </a-card>
      </div>
      <MyCalendar :key="pointDate||radiaValue" :Month="month" :isMultipleChoice="isMultipleChoice"
                  :isSinglePoint="isSinglePoint"
                  :pointMap="pointMap"
                  :restrictDate="restrictDate"
                  class="calendar"
                  style="width: 200px"
                  @chooseDays="chooseDays"/>
    </div>

  </a-card>
</template>

<script setup>
import MyCalendar from "@/components/MyCalendar/MyCalendar.vue";
import {ref} from "vue";
import {getRecentDate} from "@/utils";

function getCurDay() {
  let datetime = new Date()
  let year = datetime.getFullYear()
  let month = datetime.getMonth() + 1 < 10 ? '0' + (datetime.getMonth() + 1) : datetime.getMonth() + 1
  let date = datetime.getDate() < 10 ? '0' + datetime.getDate() : datetime.getDate()
  return `${year}-${month}-${date}`
}

const month = ref('');
const isMultipleChoice = ref(false)
const isSinglePoint = ref(true)
const restrictDate = ref({1: [getCurDay()]});
const pointMap = ref({[new Date(getCurDay()).getTime()]: true});
const radiaValue=ref(1)

const pointDate=ref('')
const changeDate=(val)=>{
  if(val){
    pointMap.value[new Date(val).getTime()]=true
  }
}
const changeValue=(val)=>{
  const map={
    1:{1: [getCurDay()]},
    2:{2: [getCurDay()]},
    3:{3: [getCurDay(),getRecentDate(7)]},
    4:{4:[getCurDay(),getRecentDate(7)]}
  }
  restrictDate.value=map[val]
}
/**
 * 月份
 */
const monthValue = (row) => {
  console.log(row)
}
/**
 * 选择日期
 */
const chooseDays = (row) => {
  console.log(row)
}

</script>

<style>

</style>

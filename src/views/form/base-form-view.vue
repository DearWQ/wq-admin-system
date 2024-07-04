<template>
  <a-card title="表单封装">
    <template #extra>
      <a-space>
        <a-button type="primary" @click="showModal=true">添加</a-button>
        <a-button status="danger" @click="resetForm"> 重置</a-button>
        <a-button @click="valideForm"> 校验</a-button>
        <a-button :loading="submitLoading" type="primary" @click="submit"> 提交</a-button>
      </a-space>
    </template>
    <MyDialog v-if="showModal" v-model:showModal="showModal" title="添加" @confirm="handleSave">
      <MyForm v-model:formData="formData" :formConfig="formItems"/>
    </MyDialog>
    <MyForm :formConfig="formItems" :formData="formData"/>
  </a-card>
</template>

<script lang="ts" setup>
import {Message} from '@arco-design/web-vue'
import MyForm from "@/components/MyForm/MyForm.vue";
import {FormItem} from '@/types/components'
import {ref} from "vue";
import type {Dayjs} from 'dayjs'
import MyDialog from "@/components/MyDialog/MyDialog.vue";

const showModal = ref(false)
const formItems = [
  {
    label: '会议名称',
    key: 'name',
    required: true,
    type: 'input',
    defaultValue: null,
    placeholder: '请输入会议名称',
    validator: function () {
      if (!this.defaultValue) {
        Message.error(this.placeholder || '')
        return false
      }
      return true
    },
  },
  {
    label: '与会领导',
    key: 'leader',
    type: 'select',
    placeholder: '请选择与会领导',
    defaultValue: '1',
    optionItems: [],
    reset: function () {
      this.defaultValue = undefined
    },
  },
  {
    label: '会议类型',
    key: 'meetType',
    required: true,
    type: 'select',
    placeholder: '请选择会议类型',
    defaultValue: "0",
    optionItems: [
      {
        label: '普通',
        value: '0',
      },
      {
        label: '紧急',
        value: '1',
      },
    ],
    validator: function () {
      if (!this.defaultValue) {
        Message.error(this.placeholder || '')
        return false
      }
      return true
    },
    reset: function () {
      this.defaultValue = undefined
    },
  },
  {
    label: '是否远程',
    key: 'remote',
    type: 'switch',
    defaultValue: <Boolean>true,
    reset: function () {
      this.defaultValue = true
    },
  },
  {
    label: '所需设备',
    key: 'equipment',
    type: 'checkbox-group',
    defaultValue: ['tv'],
    optionItems: [
      {
        label: '电视',
        value: 'tv',
      },
      {
        label: '投影仪',
        value: 'tyy',
      },
      {
        label: '笔记本',
        value: 'note',
      },
    ],
    reset: function () {
      this.defaultValue = []
    },
  },

  {
    label: '会议地点',
    key: 'address',
    type: 'select',
    placeholder: '请选择会议地点',
    defaultValue: 1,
    optionItems: [],
    reset: function () {
      this.defaultValue = undefined
    },
  },
  {
    label: '与会人员',
    key: 'joinMemeber',
    defaultValue: null,
    placeholder: '请选择与会人员',
    type: 'select',
    optionItems: [
      {
        label: '张三',
        value: 1,
      },
      {
        label: '李四',
        value: 2,
      },
      {
        label: '王五',
        value: 3,
      },
      {
        label: '赵六',
        value: 4,
      },
    ],
    reset: function () {
      this.defaultValue = undefined
    },
  },

  {
    label: '起止日期',
    key: 'startEndDate',
    type: 'date-range',
    colSpan: 12,
    defaultValue: <Dayjs[]>[],
    reset: function () {
      this.defaultValue = []
    },
  },
  {
    label: '开始时间',
    key: 'startTime',
    type: 'dateTime',
    colSpan: 12,
    defaultValue: null,
    reset: function () {
      this.defaultValue = []
    },
  },
  {
    label: '会议内容',
    key: 'content',
    type: 'textarea',
    placeholder: '请输入会议内容',
    defaultValue: null,
    colSpan: 24,
    reset: function () {
      this.defaultValue = null
    },
  },
  {
    label: '会议备注',
    key: 'remark',
    placeholder: '请输入会议备注',
    colSpan: 24,
    type: 'textarea',
    defaultValue: '',
  },
] as FormItem[]
formItems.forEach( async (item) => {
  if (item.key === 'leader') {
    item.optionItems= await new Promise((resolve) => {
     resolve([
       {
         label: '张三',
         value: '1234567',
       },
       {
         label: '李四',
         value: '2234567',
       },
       {
         label: '王五',
         value: '31234567',
       },
       {
         label: '赵六',
         value: '41234567',
       },
     ])
   })
    console.log(item.optionItems)
  }
  if (item.key === 'address') {

    item.optionItems= await new Promise((resolve) => {
      resolve([
        {
          label: '会议一室',
          value: 1,
        },
        {
          label: '会议二室',
          value: 2,
        },
        {
          label: '会议三室',
          value: 3,
        },
        {
          label: '会议四室',
          value: 4,
        },
      ])
    })
  }
})

const formData = ref({
  name: '1111111',
  leader: '1234567',
  meetType: '',
  remote: false,
  equipment: [],
  content: '',
  startEndDate: [],
  startTime: '',
  address: '',
  joinMemeber: '',
  remark: '',
})
const handleSave = () => {
  console.log(formData.value);
}
const submitLoading = ref(false)

function submit() {
  if (formItems.every((it) => (it.validator ? it.validator() : true))) {
    submitLoading.value = true
    setTimeout(() => {
      submitLoading.value = false
      Message.success(
          '提交成功，参数为：' +
          JSON.stringify(
              formItems.reduce((pre, cur) => {
                ;(pre as any)[cur.key] = (cur as any).value.value
                return pre
              }, {})
          )
      )
    }, 3000)
  }
}

function resetForm() {
  formItems.forEach((it) => {
    it.reset ? it.reset() : (it.value.value = '')
  })
}

function valideForm() {
  if (formItems.every((it) => (it.validator ? it.validator() : true))) {
    Message.success('所有表单都合法')
  }
}
</script>

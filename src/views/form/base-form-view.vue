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

<script setup>
import {Message} from '@arco-design/web-vue'
import MyForm from "@/components/MyForm/MyForm.vue";
import {ref} from "vue";
import MyDialog from "@/components/MyDialog/MyDialog.vue";

const showModal = ref(false)
const formItems = [
  {
    label: '账单名字',
    key: 'billName',
    required: true,
    type: 'input',
    defaultValue: null,
    placeholder: '请输入账单名字',
    validator: function () {
      if (!this.defaultValue) {
        Message.error(this.placeholder || '')
        return false
      }
      return true
    },
  },
  {
    label: '交易客户',
    key: 'customer',
    type: 'select',
    placeholder: '请选择客户',
    defaultValue: '1',
    optionItems: [],
    reset: function () {
      this.defaultValue = undefined
    },
  },
  {
    label: '交易类型',
    key: 'transactionType',
    required: true,
    type: 'select',
    placeholder: '请选择交易类型',
    defaultValue: "0",
    optionItems: [
      {
        label: '线上',
        value: '0',
      },
      {
        label: '线下',
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
    label: '是否现金',
    key: 'remote',
    type: 'switch',
    defaultValue: true,
    reset: function () {
      this.defaultValue = true
    },
  },
  {
    label: '运输交通',
    key: 'vehicle',
    type: 'checkbox-group',
    defaultValue: ['kaChe'],
    optionItems: [
      {
        label: '卡车',
        value: 'kaChe',
      },
      {
        label: '飞机',
        value: 'plane',
      },
      {
        label: '轮船',
        value: 'steamship',
      },
    ],
    reset: function () {
      this.defaultValue = []
    },
  },

  {
    label: '交易地点',
    key: 'transactionAddress',
    type: 'select',
    placeholder: '请选择交易地点',
    defaultValue: 1,
    optionItems: [],
    reset: function () {
      this.defaultValue = undefined
    },
  },
  {
    label: '参与交易成员',
    key: 'joinMember',
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
    defaultValue:[],
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
    label: '交易内容',
    key: 'content',
    type: 'textarea',
    placeholder: '请输入交易内容',
    defaultValue: null,
    colSpan: 24,
    reset: function () {
      this.defaultValue = null
    },
  },
  {
    label: '备注',
    key: 'remark',
    placeholder: '请输入会议备注',
    colSpan: 24,
    type: 'textarea',
    defaultValue: '',
  },
]
formItems.forEach( async (item) => {
  if (item.key === 'customer') {
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
  if (item.key === 'transactionAddress') {

    item.optionItems= await new Promise((resolve) => {
      resolve([
        {
          label: '外太空',
          value: 1,
        },
        {
          label: '赤道',
          value: 2,
        },
        {
          label: '月球',
          value: 3,
        },
        {
          label: '火星',
          value: 4,
        },
      ])
    })
  }
})

const formData = ref({
  billName: '1111111',
  customer: '1234567',
  transactionType: '',
  remote: false,
  vehicle: [],
  content: '',
  startEndDate: [],
  startTime: '',
  transactionAddress: '',
  joinMember: '',
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
                ;(pre)[cur.key] = (cur).value.value
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

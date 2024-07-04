<template>
  <div class="form-wrapper">

    <a-form :model="myFormData">
      <a-row>
        <a-col v-for="item of formConfig" :key="`${item.type}-${item.key}`"
               :span="item.colSpan||24">
          <a-form-item
              :label-col-flex="item.labelColFlex||'100px'"
              :label="item.label"
              :row-class="[item.required ? 'form-item__require' : 'form-item__no_require']"
          >
            <template v-if="item.type === 'input'">
              <a-input v-model="myFormData[item.key]" :placeholder="item.placeholder"></a-input>
            </template>
            <template v-if="item.type === 'textarea'">
              <a-textarea
                  v-model:value="myFormData[item.key]"
                  :auto-size="{ minRows: 2, maxRows: 5 }"
                  :placeholder="item.placeholder"
              />
            </template>
            <template v-if="item.type === 'switch'">
              <a-switch v-model="myFormData[item.key]" checked-children="开" un-checked-children="关"/>
            </template>
            <template v-if="item.type === 'select'">
              <a-select v-model="myFormData[item.key]" :placeholder="item.placeholder">
                <a-option v-for="opt in item.optionItems" :key="`${opt.value}-${opt.label}`" :value="opt.value">
                  {{ opt.label }}
                </a-option>
              </a-select>
            </template>
            <template v-if="item.type === 'selectTree'">
              <a-select v-model="myFormData[item.key]" :placeholder="item.placeholder">
                <a-option v-for="opt in item.optionItems" :key="`${opt.value}-${opt.label}`" :value="opt.value">
                  {{ opt.label }}
                </a-option>
              </a-select>
            </template>
            <template v-if="item.type === 'time'">
              <a-time-picker v-model="myFormData[item.key]" value-format="HH:mm:ss"/>
            </template>
            <template v-if="item.type === 'dateTime'">
              <a-date-picker v-model="myFormData[item.key]" value-format="YYYY-MM-DD"/>
            </template>
            <template v-if="item.type === 'date-range'">
              <a-range-picker v-model="myFormData[item.key]"/>
            </template>
            <template v-if="item.type === 'checkbox-group'">
              <a-checkbox-group v-model="myFormData[item.key]" :options="item.optionItems">
                <a-checkbox v-for="it of item.optionItems" :key="it.value" :value="it.value">
                  {{ it.label }}
                </a-checkbox>
              </a-checkbox-group>
            </template>
          </a-form-item>
        </a-col>

      </a-row>
    </a-form>
  </div>
</template>

<script lang="ts" setup>

import {Message} from '@arco-design/web-vue'
import {ref, watch} from 'vue'


const props = defineProps({
  formConfig: {
    type: Object,
    default: () => ({}),
  },
  formData: {
    type: Object,
    default: () => ({}),
  },
})

const myFormData = ref({...props.formData})
const toStr = Object.prototype.toString

const dealHasEmpty = (val) => {
  if (toStr.call(val) === '[object Array]') {
    return val.length > 0
  } else if (toStr.call(val) === '[object Object]') {
    return Object.keys(val).length > 0
  } else {
    return !!val
  }
}
//设置默认值
for (let i = 0, list = props.formConfig, len = list.length; i < len; i++) {
  if (list[i].key && !dealHasEmpty(myFormData.value[list[i].key])) {
    if (toStr.call(myFormData.value[list[i].key]) === '[object Array]') {
      myFormData.value[list[i].key] = [...list[i].defaultValue]
    } else if (toStr.call(myFormData.value[list[i].key]) === '[object Object]') {
      myFormData.value[list[i].key] = {...list[i].defaultValue}
    } else {
      myFormData.value[list[i].key] = list[i].defaultValue || ''
    }
  }
}


const emit = defineEmits(['update:formData'])
watch(() => myFormData.value, (val) => {
  emit('update:formData', val)
}, {deep: true})

const dataForm = ref()
const submitLoading = ref(false)
const submit = () => {
  if (props.formConfig.every((it) => (it.validator ? it.validator() : true))) {
    submitLoading.value = true
    setTimeout(() => {
      submitLoading.value = false
      Message.success(
          '提交成功，参数为：' +
          JSON.stringify(
              props.formConfig.reduce((pre, cur) => {
                ;(pre as any)[cur.key] = (cur as any).value.value
                return pre
              }, {})
          )
      )
    }, 3000)
  }
}
const resetForm = () => {
  props.formConfig.forEach((it) => {
    it.reset ? it.reset() : (it.defaultValue = '')
  })
}
const validateForm = () => {
  if (props.formConfig.every((it) => (it.validator ? it.validator() : true))) {
    Message.success('所有表单都合法')
  }
}
</script>

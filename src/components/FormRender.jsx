import {
  Checkbox,
  Input,
  InputNumber,
  Option,
  Select,
} from '@arco-design/web-vue'
import { h } from 'vue'

export default function FormRender(props) {
  if (!props || !props.formItem) {
    throw new Error('miss formItem prop and check it')
  }
  return props.render(props.formItem, h)
}

export function renderInput(value, props = {}) {
  return (
    <Input
      onUpdate:modelValue={(newValue) => {
        value.value = newValue
      }}
      modelValue={value.value}
      {...props}
    />
  )
}

export function renderInputNumber(value, props = {}) {
  return (
    <InputNumber
      onUpdate:modelValue={(newVal) => {
        value.value = newVal
      }}
      modelValue={value.value}
      {...props}
    />
  )
}

export function renderCheckBox(value, tip = '', props = {}) {
  return (
    <Checkbox
      onUpdate:modelValue={(newVal) => {
        value.value = newVal
      }}
      modelValue={value.value}
      {...props}
    >
      {tip}
    </Checkbox>
  )
}

export function renderSelect(
  value,
  options,
  props = {}
) {
    return (
    <Select
      onUpdate:modelValue={(newVal) => {
        value.value = newVal
      }}
      modelValue={value.value}
      {...props}
    >
      {options.map((it) => {
        return <Option value={it.value} label={it.label} />
      })}
    </Select>
  )
}

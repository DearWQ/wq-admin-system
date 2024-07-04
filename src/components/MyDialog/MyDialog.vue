<template>
  <a-modal v-model:visible="dialogVisible" :width="width" :title-align="titleAlign" :draggable="hasDraggable" :title="title" class="modal-dialog-wrapper">
    <Scrollbar wrap-class="modal-dialog__wrap" :style="contentStyle">
      <slot></slot>
    </Scrollbar>
    <template #footer>
      <a-space>
        <a-button @click="onCancel">取消</a-button>
        <a-button type="primary" @click="onConfirm">确定</a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from 'vue'
import type { PropType } from 'vue'
export default defineComponent({
  name: 'ModalDialog',
  props: {
    //是否显示弹窗
    showModal: {
      type: Boolean,
      default: false
    },
    //标题
    title: {
      type: String,
      default: '操作',
    },
    //弹窗宽度
    width: {
      type: String,
      default: '66vw',
    },
    //标题位置
    titleAlign: {
      type: String as PropType<'start'|'center'>,
      default: 'start',
    },
    //是否可以拖拽
    hasDraggable: {
      type: Boolean,
      default: true,
    },
    contentHeight: {
      type: String,
      default: '70vh',
    },
  },
  emits: ['confirm', 'cancel','update:showModal'],
  setup(props, {emit}) {
    let dialogVisible = computed({
      get: () => props.showModal,
      set: (val) => emit('update:showModal', val)
    })
    function onConfirm() {
      emit('update:showModal', false)
      emit('confirm')
    }

    function onCancel() {
      emit('update:showModal', false)
      emit('cancel')
    }
    const contentStyle=computed(()=>{
      return {
        height:props.contentHeight,
      }
    })
    return {
      dialogVisible,
      onConfirm,
      onCancel,
      contentStyle,
    }
  },
})
</script>
<style>
</style>

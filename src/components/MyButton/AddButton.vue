<template>
  <a-button type="primary" status="success" size="mini" @click="handleAdd">
    <template #icon>
      <IconPlus />
    </template>
    新增
  </a-button>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'AddButton',
    emits: ['add'],
    setup(props, { emit }) {
      function handleAdd() {
        emit('add')
      }
      return {
        handleAdd,
      }
    },
  })
</script>

<script setup>

import MyDrag from "@/components/MyDrag/MyDrag.vue";
import TableCustom from "@/views/list/table-custom.vue";
</script>

<template>
<MyDrag>
  <template #left>
    <div class="drag-dom bg-white h-full ">
    </div>
  </template>
  <template #right>
    <table-custom/>
  </template>
</MyDrag>
</template>

<style scoped lang="less">

</style>
<template>
  <div id="tableHeaderContainer" :style="{ zIndex: 9 }" class="relative">
    <div :class="{ bordered: bordered}" v-if="title" class="search-title">
      <span class="w_title">{{ title }}</span>
      <IconDown class="cursor-pointer" v-if="!hasExpend" @click="handleExpend"/>
      <IconUp class="cursor-pointer" v-if="hasExpend" @click="handleExpend"/>
    </div>
    <transition  name="zoom-in-top" mode="out-in">
      <div v-if="!hasExpend" class="search-items">
        <slot name="search-content"></slot>
        <div class="flex justify-end">
          <slot name="other"></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, nextTick, onMounted, ref} from 'vue'

export default defineComponent({
  name: 'TableHeader',
  props: {
    title: {
      type: String,
      default: '',
    },
    bordered: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['search', 'reset-search'],
  setup(props, {emit, slots}) {
    const showFilter = computed(() => !!slots['search-content'])
    const showSearchContent = ref(false)
    const target = ref<HTMLElement | null>(null)
    const isBordered = computed(() => props.bordered)
    onMounted(() => {
      nextTick(() => {
        target.value = document.getElementById('tableHeaderContainer')
      })
    })
    const hasExpend = ref(false)
    const handleExpend = () => {
      hasExpend.value = !hasExpend.value
    }

    function doSearch() {
      showSearchContent.value = false
      emit('search')
    }

    function doResetSearch() {
      emit('reset-search')
    }

    return {
      showFilter,
      isBordered,
      showSearchContent,
      target,
      doSearch,
      doResetSearch,
      hasExpend,
      handleExpend,
    }
  },
})
</script>
<style lang="less" scoped>
:deep(.arco-drawer-footer) {
  border-bottom: 2px solid #f5f5f5;
}

.search-title {
  height: 46px;
  padding: 10px 16px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.w_title {
  flex: 1;
  color: var(--color-text-1);
  font-weight: bold;
  line-height: 1.5715;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.bordered {
  border-bottom: 1px solid var(--color-neutral-3);
}

.search-items {
  padding: 10px 16px;
  box-sizing: border-box;
}
</style>

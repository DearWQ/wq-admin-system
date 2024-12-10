<template>
  <a-card :bordered="false" :body-style="{ padding: 0 }">
    <div class="vaw-nav-bar-wrapper">
      <Humburger />
      <Breadcrumb v-if="appStore.deviceType !== 'mobile'" />
      <div style="flex: 1"></div>
      <div class="right-wrapper">
        <ActionItems />
      </div>
      <div class="avatar-wrapper">
        <VAWavatar />
      </div>
    </div>
  </a-card>
</template>

<script >
  export default {
    name: "NavBar",
  };
</script>
<script setup>
  import useAppConfigStore from '@/store/modules/app-config'
  import VAWavatar from "@/layouts/avatar/index.vue";
  import ActionItems from '@/layouts/actions/index.vue'
  import Humburger from '@/layouts/humburger/index.vue'
  import Breadcrumb from '@/layouts/breadcrumb/index.vue'
  const appStore = useAppConfigStore()
</script>
<style scoped lang="less">
  .vaw-nav-bar-wrapper {
    height: @logoHeight;
    max-height: @logoHeight;
    min-height: @logoHeight;
    overflow: hidden;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--color-border);
    .avatar-wrapper {
      padding-right: 20px;
      margin-left: 10px;
    }
    .right-wrapper {
      height: 100%;
    }
  }
</style>

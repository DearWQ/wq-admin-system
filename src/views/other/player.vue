<template>
  <a-card title="视频播放器（集成西瓜视频插件SDK）">
    <div class="flex justify-center">
      <div ref="playerRef" id="player"></div>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import Player from 'xgplayer'
  const playUrl = ''
  const poster = '/src/assets/img_avatar.gif'
  const playerRef = ref<HTMLDivElement>()
  onMounted(() => {
    new Player({
      el: playerRef.value,
      url: playUrl,
      poster,
      playbackRate: [0.5, 0.75, 1, 1.5, 2],
      defaultPlaybackRate: 1,
    })
  })
</script>

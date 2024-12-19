<script lang="ts" setup>
import {ref} from "vue";

const treeData = ref([
  {
    "id": "65118224801137459281926519380023",
    "title": "测试",
    "level": 1,
    "parentId": "464064658652315648",
    "type": "PROJECT",
    "enable": 1,
    "list": [
      {
        "id": "65141629137928601691056522250367",
        "title": "未超出长度",
        "level": 2,
        "parentId": "65118224801137459281926519380023",
        "type": "PROJECT",
        "enable": 1,
        "list": []
      },
      {
        "id": "65141629137928601691056522250368",
        "title": "超出隐藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏",
        "level": 2,
        "parentId": "65118224801137459281926519380023",
        "type": "PROJECT",
        "enable": 1,
        "list": []
      },
      {
        "id": "65141629137928601691056522250369",
        "title": "超出隐藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏",
        "level": 2,
        "parentId": "65118224801137459281926519380023",
        "type": "PROJECT",
        "enable": 1,
        "list": []
      }
    ]
  },
])
const defaultProps = {
  children: 'list',
  key: 'id',
  title: 'title',
}


const tooltipTitle = ref("")
const showTitle = ref(true)

const onShowNameTipsMouseenter = (e) => {
  // let target = e.target;
  // let textLength = target.clientWidth;
  // let containerLength = target.scrollWidth;
  // if (textLength < containerLength) {
  //   tooltipTitle.value = e.target.innerText;
  //   showTitle.value = false;
  // } else {
  //   showTitle.value = true;
  // }
}
</script>

<template>
  <a-card title="文字气泡 Tooltip 默认【top，left，right，bottom】">
    <div class="box">
      <div style="width: 150px;">
        <div v-ellipse-tooltip.top>未超不隐藏</div>
        <div v-ellipse-tooltip.top>
          超出Top，当文本靠近窗口顶部时会在下边显示
        </div>
        <div v-ellipse-tooltip.left>超出Left，当文字靠近左边时，会在右边显示</div>
        <div v-ellipse-tooltip.right>
          超出Right隐藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏藏
        </div>
        <div v-ellipse-tooltip.bottom>超出Bottom,当文本靠近窗口底部无法显示时会在上边显示</div>
      </div>
    </div>
  </a-card>
  <a-card title="文字气泡 文本贴近左边它会在右边显示，其他时候正常显示">
    <div class="box">
      <div style="width: 150px;">
        <div v-ellipse-tooltip.left>超出Left，当文字靠近左边时，会在右边显示</div>
      </div>
    </div>
    <div class="box justify-center">
      <div style="width: 150px;">
        <div v-ellipse-tooltip.left>超出Left，文字中间正常显示</div>
      </div>
    </div>
    <div class="box justify-end">
      <div style="width: 150px;">
        <div v-ellipse-tooltip.left>超出Left，文本靠右会正常显示</div>
      </div>
    </div>
  </a-card>
  <a-card title="文字气泡 文本贴近右边边它会在左边边显示，其他时候正常显示">
    <div class="box">
      <div style="width: 150px;">
        <div v-ellipse-tooltip.right>超出right，当文字靠近左边正常显示</div>
      </div>
    </div>
    <div class="box justify-center">
      <div style="width: 150px;">
        <div v-ellipse-tooltip.right>超出right，文字中间正常显示</div>
      </div>
    </div>
    <div class="box justify-end">
      <div style="width: 150px;">
        <div v-ellipse-tooltip.right>超出Left，文本靠右，会在左边显示</div>
      </div>
    </div>
  </a-card>
  <a-card title="文字气泡 a-tree">
        <a-tree
            :data="treeData"
            :fieldNames="defaultProps"
            style="width: 150px"
        >
          <template #title="node">
            <div v-ellipse-tooltip.top
                 class="span-ellipsis"
            >{{ node.title }}
            </div>
          </template>
        </a-tree>
  </a-card>


</template>

<style lang="less" scoped>
.span-ellipsis {
  width: 150px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 20px;
}

.box {
  display: flex;
  //border-bottom: 1px solid #e8e8e8;
  padding: 16px;
  box-sizing: border-box;
}
</style>
<template>
  <div class="main-container">
    <div class="box-wrapper">
      <div class="flex">
        <a-card
          :bordered="false"
          class="card-border-radius personal-box"
          :body-style="{ padding: '10px' }"
        >
          <div class="info-wrapper">
            <div class="avatar-wrapper">
              <div
                class="avatar"
                :class="{ 'avatar-touch': touched, 'avatar-end': uploaded }"
                @mouseenter="avatarTouchStart"
              >
                <img :src="avatar" />
              </div>
              <div class="flex items-center justify-center camera-layer" @click="uploadAvatar">
                <icon-camera style="color: #fff; font-size: 30px" />
              </div>
            </div>
            <div class="text-xl">
              {{ nickName }}
            </div>
            <div class="text-wrapper">
              <div class="label"> 昵称： </div>
              <div class="value"> 井底的蜗牛 </div>
            </div>
            <div class="text-wrapper">
              <div class="label"> 部门： </div>
              <div class="value"> 前端执行者 </div>
            </div>
            <div class="mt-4">
              <a-space align="center" :style="{ flexWrap: 'wrap' }">
                <a-tag color="green" size="small">前端</a-tag>
                <a-tag color="green" size="small">后端</a-tag>
                <a-tag color="green" size="small">数据库</a-tag>
              </a-space>
            </div>
          </div>
        </a-card>
      </div>
      <div class="mt-2">
        <a-card
          :bordered="false"
          title="消息中心"
          class="card-border-radius flex-sub"
          :body-style="{ padding: '10px' }"
        >
          <template #extra>
            <a-button type="primary" size="mini"> 查看更多 </a-button>
          </template>
          <div
            v-for="(item, index) of messages"
            :key="index"
            class="flex items-center message-wrapper"
          >
            <div
              class="notify"
              :class="{ 'bg-red-500': item.status === 0, 'bg-green-500': item.status === 1 }"
            ></div>
            <div class="flex-1 ml-2">
              <div class="message-title">
                {{ item.title }}
              </div>
              <div class="content">
                {{ item.content }}
              </div>
            </div>
          </div>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script >
  import useUserStore from '@/store/modules/user'
  import { defineComponent, ref } from 'vue'
  export default defineComponent({
    name: 'Personal',
    setup() {
      const touched = ref(false)
      const uploaded = ref(false)
      const avatarTouchStart = () => {
        touched.value = true
      }
      const uploadAvatar = () => {
        uploaded.value = true
        setTimeout(() => {
          touched.value = false
          uploaded.value = false
        }, 1000)
      }
      const userStore = useUserStore()
      return {
        touched,
        uploaded,
        messages: [
          {
            title: '井底的蜗牛！！！',
            content:
              '欢迎来到我的世界，这是我的后台管理系统，希望你喜欢！，欢迎来访我的CSDN博客：https://blog.csdn.net/weixin_41277748',
            status: 0, // 0未读 1已读
          },
          {
            title: '井底的蜗牛！！！',
            content:
              '欢迎来到我的世界，这是我的后台管理系统，希望你喜欢！，欢迎来访我的CSDN博客：https://blog.csdn.net/weixin_41277748',
            status: 0, // 0未读 1已读
          }, {
            title: '井底的蜗牛！！！',
            content:
              '欢迎来到我的世界，这是我的后台管理系统，希望你喜欢！，欢迎来访我的CSDN博客：https://blog.csdn.net/weixin_41277748',
            status: 1, // 0未读 1已读
          }, {
            title: '井底的蜗牛！！！',
            content:
              '欢迎来到我的世界，这是我的后台管理系统，希望你喜欢！，欢迎来访我的CSDN博客：https://blog.csdn.net/weixin_41277748',
            status: 0, // 0未读 1已读
          }, {
            title: '井底的蜗牛！！！',
            content:
              '欢迎来到我的世界，这是我的后台管理系统，希望你喜欢！，欢迎来访我的CSDN博客：https://blog.csdn.net/weixin_41277748',
            status: 1, // 0未读 1已读
          }, {
            title: '井底的蜗牛！！！',
            content:
              '欢迎来到我的世界，这是我的后台管理系统，希望你喜欢！，欢迎来访我的CSDN博客：https://blog.csdn.net/weixin_41277748',
            status: 0, // 0未读 1已读
          }, {
            title: '井底的蜗牛！！！',
            content:
              '欢迎来到我的世界，这是我的后台管理系统，希望你喜欢！，欢迎来访我的CSDN博客：https://blog.csdn.net/weixin_41277748',
            status: 1, // 0未读 1已读
          }, {
            title: '井底的蜗牛！！！',
            content:
              '欢迎来到我的世界，这是我的后台管理系统，希望你喜欢！，欢迎来访我的CSDN博客：https://blog.csdn.net/weixin_41277748',
            status: 0, // 0未读 1已读
          },
        ],
        avatar: userStore.avatar,
        nickName: userStore.nickName,
        avatarTouchStart,
        uploadAvatar,
      }
    },
  })
</script>
<style lang="less" scoped>
  .box-wrapper {
    .personal-box {
      width: 100%;
      .info-wrapper {
        text-align: center;
        .avatar-wrapper {
          display: inline-block;
          width: 6rem;
          height: 6rem;
          margin-top: 20px;
          position: relative;
          .avatar {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            transform-origin: bottom;
            transform: rotate(0deg);
            z-index: 1;
            transition: all 0.5s ease-in-out;
            & > img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              border: 4px solid transparent;
            }
          }
          .avatar-touch {
            transform: rotate(180deg);
          }
          .avatar-end {
            transform: rotate(0deg);
          }
          .camera-layer {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.6);
            border-radius: 50%;
          }
        }
        .text-wrapper {
          font-size: 0.8rem;
          margin-top: 20px;
          margin: 0 auto;
          .label {
            display: inline-block;
          }
          .value {
            display: inline-block;
          }
        }
        .text-wrapper + .text-wrapper {
          margin-top: 15px;
        }
      }
    }
    .message-wrapper {
      border-bottom: 1px solid #f5f5f5;
      padding-bottom: 10px;
      .notify {
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }
      .message-title {
        font-size: 14px;
      }
      .content {
        font-size: 12px;
        margin-top: 10px;
        line-height: 1rem;
      }
    }
    .message-wrapper + .message-wrapper {
      margin-top: 10px;
    }
    .wating-box {
      width: 30%;
      margin-left: 10px;
      .wating-item {
        padding: 10px;
        border-bottom: 1px solid #f5f5f5;
      }
    }
  }
</style>

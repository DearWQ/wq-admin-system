<template>
  <div class="login-container">
    <div class="left">
      <div class="content">
        <img style="border-radius: 50%" :src="logo" />
        <div class="project-name">{{ projectName }}</div>
        <div class="login-logo">
          <img alt="" src="https://www.yilailu.com/static/icon/designer.png">
          <div class="desc">
            <em>场景</em>
            <p>记录遇到过的场景</p>
          </div>
        </div>
        <div class="login-tip">
          <img alt="衣来录" src="https://www.yilailu.com/static/icon/statistical.png">
          <div class="desc">
            <em>组件化</em>
            <p>把场景封装组件化</p>
          </div>
        </div>
        <div class="login-tip">
          <img alt="衣来录" src="https://www.yilailu.com/static/icon/print.png">
          <div class="desc">
            <em>便捷</em>
            <p>直接使用或自行改造</p>
          </div>
        </div>
        <div class="ttiipp"> 井底的蜗牛 </div>
      </div>
    </div>
    <div class="right">
      <a-card class="form-wrapper" :body-style="{ padding: '20px' }" :bordered="false">
        <div class="title">账号登录</div>
        <div class="item-wrapper mt-6">
          <a-input v-model="username" placeholder="请输入用户名/手机号" allow-clear size="large">
            <template #prefix>
              <icon-mobile />
            </template>
          </a-input>
        </div>
        <div class="item-wrapper mt-4">
          <a-input-password v-model="password" placeholder="请输入密码" allow-clear size="large">
            <template #prefix>
              <icon-lock />
            </template>
          </a-input-password>
        </div>
        <div class="flex-sub"></div>
        <div class="mt-10">
          <a-button type="primary" class="login" :loading="loading" @click="onLogin">
            登录
          </a-button>
        </div>
        <div class="my-width flex-sub mt-4 mb-8">
          <div class="flex justify-between">
            <a-checkbox v-model="autoLogin">自动登录</a-checkbox>
            <a-link :underline="false" type="primary">忘记密码？</a-link>
          </div>
        </div>
        <a-divider orientation="center">第三方登录</a-divider>
        <div class="text-center text-lg">
<!--          <icon-alipay-circle />-->
          <a href="https://github.com/DearWQ/wq-admin-system"><icon-github class="mr-6 ml-6"  /></a>

<!--          <icon-weibo-circle-fill />-->
        </div>
      </a-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import imageBg from '@/assets/img_login_bg.png'
  import logo from '@/assets/img_avatar.gif'
  import { post, Response } from '@/api/http';
  import { login } from '@/api/url'
  import { Message } from '@arco-design/web-vue'
  import { UserState } from '@/store/types'
  import setting from '../../setting'
  import useUserStore from '@/store/modules/user'
    const projectName = setting.projectName
    const username = ref('admin')
    const password = ref('admin')
    const autoLogin = ref(true)
    const loading = ref(false)
    const router = useRouter()
    const route = useRoute()
    const userStore = useUserStore()
    const onLogin = () => {
      loading.value = true
      post({url: login, data:{
          username: username.value,
          password: password.value,
      }
      })
        .then(({ data }: Response) => {
          userStore.saveUser(data as UserState).then(() => {
            console.log(route.query.redirect ? (route.query.redirect as string) : '/')
            router
              .replace({
                path: route.query.redirect ? (route.query.redirect as string) : '/',
              })
              .then(() => {
                Message.success('登录成功，欢迎：' + username.value)
                loading.value = false
              })
          })
        })
        .catch((error) => {
          loading.value = false
          Message.error(error.message)
        })
    }
</script>

<style lang="less" scoped>
  @keyframes scale-to {
    0% {
      transform: scale(0.2, 0.2);
    }
    100% {
      transform: scale(1, 1);
    }
  }
  @leftWith: 500px;
  .login-container {
    overflow: hidden;
    height: 100vh;
    width: 100vw;
    display: flex;
    .left {
      position: relative;
      width: @leftWith;
      min-width: @leftWith;
      max-width: @leftWith;
      overflow: hidden;
      & > img {
        height: 100%;
        width: 100%;
        object-fit: fill;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
      }
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2;
        background-color: rgba(0, 0, 0, 0.7);
      }
      .content {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 3;
        width: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        //background: linear-gradient(214deg, #dffbff, #faf6f3);
        & > img {
          width: 70px;
          height: 70px;
          margin-top: 100px;
        }
        .project-name {
          font-size: 20px;
          font-weight: bold;
          color: #fff;
          // color: rgb(22, 93, 255);
          // font-weight: 700;
          margin-top: 10px;
        }
        .login-logo {
          padding-left: 16px;
          display: flex;
          height: 42px;
          margin-top: 30px;
          box-sizing: border-box;

          img {
            width: 42px;
            height: 42px;
          }

          .desc {
            margin-left: 16px;

            em {
              display: block;
              font-size: 14px;
              font-weight: bold;
              font-style: normal;
              color: #fff;
              line-height: 20px;
            }

            p {
              font-size: 14px;
              color: #fff;
              line-height: 20px;
              margin-top: 2px;
            }
          }
        }

        .login-tip {
          padding-left: 16px;
          display: flex;
          height: 42px;
          margin-top: 30px;
          box-sizing: border-box;

          img {
            width: 42px;
            height: 42px;
          }

          .desc {
            margin-left: 16px;

            em {
              display: block;
              font-size: 14px;
              font-weight: bold;
              font-style: normal;
              color: #fff;
              line-height: 20px;
            }

            p {
              font-size: 14px;
              color: #fff;
              line-height: 20px;
              margin-top: 2px;
            }
          }
        }
        .ttiipp {
          margin-top: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          font-weight: bold;
          font-weight: 500;
          font-size: 30px;
          animation: scale-to 1s linear;
        }
        .bottom {
          color: silver;
          margin-bottom: 5%;
          font-size: 16px;
        }
      }
    }
    .right {
      flex: 1;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      .form-wrapper {
        width: 50%;
        box-shadow: 0 0 10px #cfcfcf;
        border-radius: 10px;
        .title {
          font-size: 25px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .login {
          width: 100%;
        }
      }
    }
  }
  @media screen and(max-width: 966px) {
    .left {
      display: none;
    }
    .right {
      .form-wrapper {
        width: 80% !important;
      }
    }
  }
</style>

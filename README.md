
## 开始

* nodejs > 16.18.0 && pnpm > 8.6.0 (强制使用pnpm)

## 开发
* 安装依赖 pnpm install或pnpm i 也可以使用淘宝镜像下载  pnpm install --registry=https://registry.npm.taobao.org
* 启动项目 pnpm run dev


## 开发规范
- 组件开发规范:必须是大驼峰命名，页面使用小驼峰命名
- 变量开发规范：必须是小驼峰命名，单词必须正确
- 处理async await 错误使用useToAwait方法,不在使用try catch 来捕捉错误，该方法会返回一个数组，数组的第一项是错误信息，第二项是接口返回的数据；当出现错误时，err有值而data没值，没有错误时，err为空，data就是后端返回的值
    ```
  async function fn(){ 
     const [err,data]=await useToAwait(定义的接口方法(params))
        if(err){//处理错误}
       if(data){}
  }
  ```
- css 能用原子化css就用原子化css,否侧需要用到自定义的样式比如class必须再命名的时候前面加上名字的缩写，以防止样式冲突


import Axios, { AxiosResponse } from 'axios'
import qs from 'qs'
export const baseURL = 'http://localhost:8080/'
const service = Axios.create({
  baseURL,
  timeout: 10 * 60 * 1000
})
service.interceptors.request.use(
  (config) => {
    !config.headers && (config.headers = {})
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json; charset=UTF-8'
    }
    if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded; charset=UTF-8') {
      config.data = qs.stringify(config.data)
    }
    return config
  },
  (error) => {
    return Promise.reject(error.response)
  }
)

service.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (response.status === 200) {
      return response
    } else {
      throw new Error(response.status.toString())
    }
  },
  (error) => {
    if (import.meta.env.MODE === 'development') {
      console.log(error)
    }
    return Promise.reject({ code: 500, msg: '服务器异常，请稍后重试…' })
  }
)

export default service

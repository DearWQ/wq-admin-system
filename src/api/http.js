import service from './axios.config'


function http({ url, data, method, headers, beforeRequest, afterRequest }) {
  const successHandler = (res) => {
    if (res.data.code === 200) {
      return res.data
    }
    throw new Error(res.data.msg || '请求失败，未知异常')
  }
  const failHandler = (error) => {
    afterRequest && afterRequest()
    throw new Error(error.msg || '请求失败，未知异常')
  }
  beforeRequest && beforeRequest()
  method = method || 'GET'
  const params = Object.assign(typeof data === 'function' ? data() : data || {}, {})
  return method === 'GET'
    ? service.get(url, { params, headers }).then(successHandler, failHandler)
    : service.post(url, params, { headers: headers }).then(successHandler, failHandler)
}

export function get({
  url,
  data,
  method = 'GET',
  beforeRequest,
  afterRequest,
}) {
  return http({
    url,
    method,
    data,
    beforeRequest,
    afterRequest,
  })
}

export function post({
  url,
  data,
  method = 'POST',
  headers,
  beforeRequest,
  afterRequest,
}) {
  return http({
    url,
    method,
    data,
    headers,
    beforeRequest,
    afterRequest,
  })
}
export default {
  get,
  post,
}

import Axios from 'axios'
import router from '../router'
import {error} from '../actions'
import {logError, logInfo} from '../constant/utils'
// TODO:全局默认设置
Axios.defaults.baseURL = '/rest'
Axios.defaults.headers['Content-Type'] = 'application/json'
// TODO:请求拦截器,统一处理参数
Axios.interceptors.request.use((config) => {
  // TODO:添加debug模式
  if (process.env.NODE_ENV === 'development' && router.currentRoute.query.debug) {
    config.url += config.url.indexOf('?') !== -1 ? `&debug=${router.currentRoute.query.debug}` : `?debug=${router.currentRoute.query.debug}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// TODO:返回拦截器
Axios.interceptors.response.use((response) => {
  if (response.status !== 200) {
    error('网络异常，请稍后重试...')
    return Promise.reject(response)
  }
  const {code, msg, data} = response.data
  if (!code) {
    return response.data
  }else if (code === 200) {
    return data
  }else if (code !== 200) {
    const data = {code: code || 500, msg: msg || '服务器异常！请稍后重试...'}
    error(data.msg)
    code === 600 && router.replace({name: router.currentRoute.path.startsWith('/teacher') || router.currentRoute.path.startsWith('/loginCode') ? 'loginCode' : 'login'})
    return Promise.reject(data)
  }
}, (error) => {
  return Promise.reject(error)
})
export default Axios

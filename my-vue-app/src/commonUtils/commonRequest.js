import axios from 'axios'

// 创建 axios 实例
const request = axios.create({
  baseURL: 'http://localhost:8080', // 后端 API 基地址
  timeout: 10000,
})

// 请求拦截器：自动添加 token 到请求头
request.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['X-Token'] = token
    }
    return config
  },
  (error) => {
    console.log(error);
    return Promise.reject(error)
  }
)

// 响应拦截器（可选）：统一处理 token 失效、错误等
request.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // token 无效或过期，跳转到登录页
      localStorage.clear()
      localStorage.setItem('loginStatus', '请重新登录')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default request
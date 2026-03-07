<template>
  <h1>{{ msg1 }}</h1>
  <div>
    <form @submit.prevent="handleLogin">
      <input 
        type="text" 
        v-model="formData.username" 
        placeholder="用户名" 
      />
      <input 
        type="password" 
        v-model="formData.password" 
        placeholder="密码" 
      />
      <button type="submit" :disabled="loading">
        {{ loading ? '登录中...' : '登录' }}
      </button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
// 1. 引入axios
import axios from 'axios'
defineProps({
  msg1: String,
})
// 表单数据 (类似Angular中组件类的属性)
const formData = reactive({
  username: '',
  password: ''
})

// UI状态
const loading = ref(false)
const errorMessage = ref('')

// 处理登录的方法 (类似Angular组件中的方法)
const handleLogin = async () => {
  // 防止重复提交
  if (loading.value) return
  
  loading.value = true
  errorMessage.value = ''
  
  try {
    // 2. 发送POST请求
    // 注意：axios.post() 返回的是一个Promise
    const response = await axios.post(
      'https://your-api.com/login', // URL
      formData,                      // 数据 (axios会自动转换为JSON)
      {
        headers: {
          'Content-Type': 'application/json' // 通常这是默认值
        }
      }
    )
    
    // 3. 处理成功响应
    console.log('登录成功:', response.data)
    // 假设后端返回 { token: 'xxx', user: {...} }
    // 你可以保存token，跳转页面等
    localStorage.setItem('token', response.data.token)
    // 跳转到首页 (使用Vue Router)
    // router.push('/dashboard')
    
  } catch (error) {
    // 4. 处理错误
    if (error.response) {
      // 服务器返回了错误状态码（如401、500）
      console.error('服务器错误:', error.response.data)
      errorMessage.value = error.response.data.message || '登录失败'
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error('网络错误，未收到响应')
      errorMessage.value = '网络连接异常，请检查网络'
    } else {
      // 请求配置出错
      console.error('请求配置错误:', error.message)
      errorMessage.value = '请求发送失败'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.error { color: red; }
</style>
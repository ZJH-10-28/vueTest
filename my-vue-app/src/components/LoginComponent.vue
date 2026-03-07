<template>
  <form @submit.prevent="handleLogin" class="login-form">
  <div class ="login-container">
    <label>Login:</label>
    <input id="username"
          type="text"
          v-model="form.username"
          placeholder="请输入用户名"
          required>
  </div>
  <div class ="login-container">
    <label>Password:</label>
    <input id="password"
          type="password"
          placeholder="请输入密码"
          required>
  </div>
  </form>
</template>

<!-- setup 自动暴露顶层绑定 -->
<script setup>
import { ref } from 'vue'
import axios from 'axios'

// 响应式数据
const form = ref({
  username: '',
  password: ''
})

// 登录方法
const handleLogin = async () => {
  try {
    // 发送 POST 请求到后端
    const response = await axios.post('/api/login', {
      username: form.value.username,
      password: form.value.password
    })
  }catch (err) {
    if (err.response) {
      // 后端返回了错误状态码（如 401）
      error.value = err.response
    }
  }

};
</script>

<!-- scoped 防止影响其他画面 -->
<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: Arial, sans-serif;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
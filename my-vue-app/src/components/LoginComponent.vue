<template>
      <p v-if="loginStatus" style="color: red">{{loginStatus}}</p>
  <div>
    <a>
      <img src="../assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <form @submit.prevent="handleLogin" class="login-form">
  <div class ="login-container">
    <label>UserName:</label>
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
          v-model="form.password"
          placeholder="请输入密码"
          required>
  </div>
  <div>
    <button class="Login" type ="submit">Login</button>
      <p v-if="error" style="color: red">{{ error }}</p>
      <p v-if="success" style="color: green">{{ success }}</p>
  </div>
  </form>
</template>

<!-- setup 自动暴露顶层绑定 -->
<script setup>
import { ref , onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import request from '../commonUtils/commonRequest'

// 响应式数据
const form = ref({
  username: '',
  password: ''
})
const router = useRouter()
const error = ref('')
const success = ref('')
const loginStatus = ref(null)

//初始化
onMounted(() => {
  const status = localStorage.getItem('loginStatus')
  loginStatus.value = status // 或 JSON.parse(status) 如果存的是对象
})

// 登录方法
const handleLogin = async () => {

  error.value = ''
  success.value = ''

  try {
    // 发送 POST 请求到后端
    const response = await request.post('http://localhost:8080/user/userLogin', {
      userName: form.value.username,
      passWord: form.value.password
    })

    if(response.data.isSuccess){
    // 保存 token 到 localStorage
    localStorage.setItem('token', response.data.token)
    error.value = ''
    success.value = response.data.message + 'Token:' + response.data.token
    // 跳转
    router.push('/welcome')
    }else{
    error.value = response.data.message
    success.value = ''
    }
    console.log('Token:', response.data.token)

  }catch (err) {
    if (err.response) {
      // 后端返回了错误状态码（如 401）
      error.value = err.response?.data || '登录失败，请检查网络'
    }
  }

};
</script>

<!-- scoped 防止影响其他画面 -->
<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #1be7ccaa);
}
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: Arial, sans-serif;
}
.login-container:hover {
  filter: drop-shadow(0 0 2em #d89530aa);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.Login {
  background-color: rgb(74, 149, 247);
  color:aliceblue;
}
.Login:hover {
  background-color: rgb(119, 174, 226);
  color:rgb(0, 7, 12);
}

</style>
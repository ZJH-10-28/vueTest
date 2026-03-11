<template>
  <div>
    <h2>Welcome</h2>
  </div>
  <nav>
    <router-link to="/welcome/parent">父组件</router-link> | 
    <router-link to="/welcome/child">子组件</router-link>
  </nav>
    <button class="Login" @click="testButton">报错退出登录</button>
      <p v-if="error" style="color: red">{{ error }}</p>
      <p v-if="success" style="color: green">{{ success }}</p>
  <router-view />
</template>

<script setup>
import { ref } from 'vue'
import request from '../commonUtils/commonRequest'

const error = ref('')
const success = ref('')

const testButton = async () => {
  try {
    // 发送 POST 请求到后端
    const response = await request.post('http://localhost:8080/User/test', {
    })

    if(response.data.isSuccess){
    error.value = ''
    success.value = 'Test successful'
    }else{
    error.value = response.data.message
    success.value = ''
    }

  }catch (err) {
    if (err.response) {
      // 后端返回了错误状态码（如 401）
      error.value = err.response?.data || '登录失败，请检查网络'
    }
  }
}
</script>


<style>

.Login {
  background-color: rgb(74, 149, 247);
  color:aliceblue;
}
.Login:hover {
  background-color: rgb(119, 174, 226);
  color:rgb(0, 7, 12);
}

</style>
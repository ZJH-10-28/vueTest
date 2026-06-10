<template>
    <button :style="{ position: 'fixed', top: '20px', right: '20px' }" class="Login" @click="exit" >安全退出</button>
  <div>
    <h2 :style="{ position: 'fixed', top: '20px'}">Welcome</h2>
  </div>
  <!-- <nav>
    <router-link to="/welcome/parent">父组件</router-link> | 
    <router-link to="/welcome/child">子组件</router-link>
  </nav>
  <router-view /> -->
    <div>
      <label>订单ID：</label>
      <input v-model="shopId">
    </div>
      <button class="Login" @click="queryById">按照ID检索订单</button>
      <table v-if="responseGoods" class="goods-table">
      <thead>
        <tr>
          <th>订单ID</th>
          <th>用户ID</th>
          <th>订单金额</th>
          <th>创建时间</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ responseGoods.orderId }}</td>
          <td>{{ responseGoods.userId }}</td>
          <td>{{ responseGoods.orderPrice }}</td>
          <td>{{ responseGoods.createTime }}</td>
        </tr>
      </tbody>
    </table>
      <p v-if="error" style="color: red">{{ error }}</p>
      <p v-if="success" style="color: green">{{ success }}</p>
</template>

<script setup>
import { ref , onMounted } from 'vue'
import request from '../commonUtils/commonRequest'

const error = ref('')
const success = ref('')
const shopId = ref('')
const responseGoods = ref(null)

//初始化
onMounted(() => {
})

const exit = async () => {
  localStorage.clear() // 清除 localStorage 中的所有数据
  window.location.href = '/login' // 跳转到登录页
}

const queryById = async () => {
  try {
    // 发送 get 请求到后端
    const response = await request.get(`/orders/${shopId.value}?name=dujiacun`)

    if(response.data.code === 200){
    responseGoods.value = response.data.data
    error.value = ''
    success.value = response.data.message
    }else{
    responseGoods.value = null
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
.goods-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.goods-table th,
.goods-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.goods-table th {
  background-color: #f4f4f4;
}

</style>
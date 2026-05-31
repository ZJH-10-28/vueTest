<template>
  <div>
    <h2>Welcome</h2>
  </div>
  <nav>
    <router-link to="/welcome/parent">父组件</router-link> | 
    <router-link to="/welcome/child">子组件</router-link>
  </nav>
  <router-view />
    <button class="Login" @click="testButton">报错退出</button>
    <div>
      <label>商品ID：</label>
      <input v-model="shopId">
    </div>
      <button class="Login" @click="queryById">按照ID检索商品</button>
      <table v-if="responseGoods" class="goods-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>名称</th>
          <th>价格</th>
          <th>库存</th>
          <th>描述</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ responseGoods.orderId }}</td>
          <td>{{ responseGoods.orderName }}</td>
          <td>{{ responseGoods.orderPrice }}</td>
          <td>{{ responseGoods.orderNum }}</td>
          <td>{{ responseGoods.goodsDescription }}</td>
        </tr>
      </tbody>
    </table>
      <p v-if="error" style="color: red">{{ error }}</p>
      <p v-if="success" style="color: green">{{ success }}</p>
</template>

<script setup>
import { ref } from 'vue'
import request from '../commonUtils/commonRequest'

const error = ref('')
const success = ref('')
const shopId = ref('')
const responseGoods = ref(null)

const testButton = async () => {
  try {
    // 发送 POST 请求到后端
    const response = await request.post('/user/test?name=dujiacun', {
    })

    if(response.data.code === 200){
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
const queryById = async () => {
  try {
    // 发送 get 请求到后端
    const response = await request.get(`/order/${shopId.value}?name=dujiacun`)

    if(response.data.code === 200){
    responseGoods.value = response.data.data
    error.value = ''
    success.value = 'getGoods successful'
    }else{
    responseGoods.value = response.data
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
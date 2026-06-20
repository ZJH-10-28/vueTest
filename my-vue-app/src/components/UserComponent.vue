<!-- src/views/UserProfile.vue -->
<template>
  <div class="user-profile-container">
    <h2>个人中心</h2>
    <el-row :gutter="20" style="margin-top: 20px;">
      <!-- 左侧用户基本信息卡片 -->
      <el-col :span="8">
        <el-card shadow="hover" class="profile-card">
          <template #header>
            <div class="card-header">
              <span>我的信息</span>
            </div>
          </template>
          <ul class="profile-list">
            <li class="profile-item">
              <span class="label">用户ID:</span>
              <span class="value">{{ userInfo.userId }}</span>
            </li>
            <li class="profile-item">
              <span class="label">用户名:</span>
              <span class="value">{{ userInfo.userName }}</span>
            </li>
            <li class="profile-item" v-if="userInfo.isAdmin !== undefined">
              <span class="label">用户角色:</span>
              <span class="value">{{ userInfo.isAdmin ? '管理员' : '普通用户' }}</span>
            </li>
            <li class="profile-item" v-if="userInfo.lastLoginDate">
              <span class="label">上次登录:</span>
              <span class="value">{{ formatDate(userInfo.lastLoginDate) }}</span>
            </li>
          </ul>
        </el-card>
      </el-col>

      <!-- 右侧订单明细卡片 -->
      <el-col :span="16">
        <el-card shadow="hover" class="orders-card">
          <template #header>
            <div class="card-header">
              <span>我的订单</span>
            </div>
          </template>
          <el-table 
            :data="orders" 
            border 
            style="width: 100%"
            row-key="orderId"
            :expand-row-keys="expandRowKeys"
            @expand-change="handleExpandChange"
          >
            <!-- 可展开的列 -->
            <el-table-column type="expand">
              <template #default="{ row }">
                <el-table :data="row.orderDetails" border style="width: 100%; margin: 10px;">
                  <el-table-column prop="skuId" label="商品ID" width="100" />
                  <el-table-column prop="skuName" label="商品名称" min-width="150" />
                  <el-table-column prop="skuPrice" label="单价" width="120" />
                  <el-table-column prop="quantity" label="数量" width="100" />
                  <!-- 可以根据需要添加更多明细字段 -->
                </el-table>
              </template>
            </el-table-column>

            <el-table-column prop="orderId" label="订单号" width="200" />
            <el-table-column prop="totalPrice" label="总价" width="120" />
            <el-table-column prop="status" label="状态" width="100" />
            <el-table-column prop="createTime" label="下单时间" width="160" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import request from '../commonUtils/commonRequest';

// 1. 定义用户信息和订单数据模型
const userInfo = ref({
  userId: '',
  userName: '',
  isAdmin: 0,
  lastLoginDate: null
});

const orders = ref([]);
const expandRowKeys = ref([]); // 用于控制哪些行是展开状态

// 2. 模拟从后端获取数据
const fetchData = async () => {
  try {
    // 这里替换为真实的API请求
    // const userResponse = await request.get('/user/profile');
    // if (userResponse.data.code === 200) {
    //   userInfo.value = userResponse.data.data;
    // }

    // 模拟用户数据
    userInfo.value = {
      userId: 12345,
      userName: 'dujiacun',
      isAdmin: 0,
      lastLoginDate: new Date()
    };

    // 模拟订单数据
    orders.value = [
      {
        orderId: 'ORD20260619001',
        totalPrice: 299.00,
        status: '已支付',
        createTime: '2026-06-19 10:30:00',
        orderDetails: [
          { skuId: 'SKU001', skuName: '商品A', skuPrice: 99.00, quantity: 1 },
          { skuId: 'SKU002', skuName: '商品B', skuPrice: 200.00, quantity: 1 }
        ]
      },
      {
        orderId: 'ORD20260618001',
        totalPrice: 150.00,
        status: '已发货',
        createTime: '2026-06-18 15:45:00',
        orderDetails: [
          { skuId: 'SKU003', skuName: '商品C', skuPrice: 150.00, quantity: 1 }
        ]
      }
    ];
  } catch (error) {
    console.error('获取数据失败:', error);
  }
};

onMounted(() => {
  fetchData();
});

// 3. 处理表格行展开事件
const handleExpandChange = (row, expandedRows) => {
  // 控制只能同时展开一行
  if (expandedRows.length > 1) {
    expandRowKeys.value = [row.orderId];
  } else {
    expandRowKeys.value = expandedRows.map(item => item.orderId);
  }
};

// 4. 日期格式化辅助函数
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};
</script>

<style scoped>
.user-profile-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  font-weight: bold;
  font-size: 1.1em;
}

.profile-list {
  list-style: none;
  padding: 0;
}

.profile-item {
  display: flex;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.label {
  font-weight: bold;
  width: 80px;
  flex-shrink: 0;
}

.value {
  flex-grow: 1;
  word-break: break-all;
}
</style>
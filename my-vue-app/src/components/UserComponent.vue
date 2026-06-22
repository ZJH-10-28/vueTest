<!-- src/views/UserProfile.vue -->
<template>
  <div class="user-profile-container">
    <h2>个人中心</h2>
        <div class="batch-operation" style="margin-top: 20px; text-align: right;">
      <el-button type="primary" @click="returnBack">
        返回上一层
      </el-button>
    </div>
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
              <span class="value">{{ userInfo.isAdmin == 1 ? '管理员' : '普通用户' }}</span>
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
            :data="currentOrders" 
            border 
            style="width: 100%"
            row-key="orderId"
            :expand-row-keys="expandRowKeys"
            @expand-change="handleExpandChange"
          >
            <!-- 可展开的列 -->
            <el-table-column type="expand">
              <template #default="{ row }">
                <el-table :data="row.skuList" border style="width: 100%; margin: 10px;">
                  <el-table-column prop="skuId" label="商品ID" width="100" />
                  <el-table-column prop="skuName" label="商品名称" min-width="150" />
                  <el-table-column prop="skuPrice" label="单价" width="120" />
                  <el-table-column prop="saleCount" label="数量" width="120" />
                  <!-- 可以根据需要添加更多明细字段 -->
                </el-table>
              </template>
            </el-table-column>

            <el-table-column prop="orderId" label="订单号" width="200" />
            <el-table-column prop="orderPrice" label="总价" width="120" />
            <el-table-column prop="orderStatus" label="状态" width="100" />
            <el-table-column prop="createTime" label="下单时间" width="200" />
          </el-table>
        </el-card>
        
          <!-- 分页组件 -->
          <el-pagination
            v-if="orders.length > 0"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="orders.length "
            v-model:page-size="pageSize"
            v-model:current-page="currentPage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted ,computed } from 'vue';
import request from '../commonUtils/commonRequest';
import { useRouter } from 'vue-router'

onMounted(() => {
  fetchData();
});

const router = useRouter()
const returnBack = () => {
  router.back(); // 调用路由实例的 back() 方法
};
// 1. 定义用户信息和订单数据模型
const userInfo = ref({
  userId: '',
  userName: '',
  isAdmin: 0,
  lastLoginDate: null
});

const orders = ref([]);
const expandRowKeys = ref([]); // 用于控制哪些行是展开状态
// 分页相关变量
const currentPage = ref(1);
const pageSize = ref(10);
// 计算属性，获取当前页的订单数据
const currentOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return orders.value.slice(start, end);
});

/**
 * 分页大小改变处理
 */
const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  handleSearch(); // 重新查询
};

/**
 * 当前页码改变处理
 */
const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
  handleSearch(); // 重新查询
};

// 2. 模拟从后端获取数据
const fetchData = async () => {
  try {
    // const params = { userId: localStorage.getItem('userId') };
    const response = await request.post('http://localhost:12345/orders/orderInfoByUserId?name=dujiacun', {
      userId: 10010
    })
    if (response.data.code === 200) {
        orders.value = response.data.data;
        orders.value.forEach(order => {
          order.orderId = 'ORD' + order.orderId.toString().padStart(11, '0'); // 格式化订单ID
          order.createTime = formatDate(order.createTime);
          order.orderStatus = order.orderStatus === 0 ? '待支付' : order.orderStatus === 1 ? '已支付' : '已取消'; // 转换订单状态为文本
        });
    } else {
    }

    // 用户数据
    userInfo.value = {
      userId: localStorage.getItem('userId'),
      userName: localStorage.getItem('userName'),
      isAdmin: localStorage.getItem('isAdmin'),
      lastLoginDate: localStorage.getItem('lastLoginDate')
    };

  } catch (error) {
    console.error('获取数据失败:', error);
  }
};


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
/* 分页组件的样式 */
.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}
</style>
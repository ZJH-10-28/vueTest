<!-- src/views/ShoppingCart.vue -->
<template>
  <div class="shopping-cart-container">
    <h2>订单结算</h2>
    <div class="batch-operation" style="margin-top: 20px; text-align: right;">
      <el-button type="primary" @click="returnBack">
        返回上一层
      </el-button>
    </div>
    <el-card shadow="hover" class="cart-card">
      <el-table :data="cartItems" border style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="skuId" label="商品ID" width="100" />
        <el-table-column prop="skuName" label="商品名称" min-width="150" />
        <el-table-column prop="skuPrice" label="单价" width="120" />
        <el-table-column label="数量" width="180">
          <template #default="{ row }">
            <el-input-number v-model="row.quantity" :min="1" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{ $index }">
            <el-button type="danger" size="small" @click="removeItem($index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <div class="cart-footer" style="margin-top: 20px; text-align: right;">
      <p v-if="orderId" style="color: green">订单号: {{ orderId }}</p>
      <span style="margin-right: 20px;">总价: <strong>{{ totalPrice.toFixed(2) }}</strong> 元</span>
      <el-button type="warning" size="large" :loading="loading" :disabled="loading" @click="checkout">下单</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router'
import request from '../commonUtils/commonRequest'
import {
  buildOrderRequestConfig,
  clearOrderIdempotencyState,
  getOrCreateOrderIdempotencyKey,
} from '../commonUtils/orderIdempotency'

const router = useRouter()
const returnBack = () => {
  router.back(); // 调用路由实例的 back() 方法
};
// 1. 定义购物车数据模型
const cartItems = ref([]);
const orderId = ref('');
const loading = ref(false);
const selectedCartItems = ref([]);
onMounted(() => {
  const storedItems = localStorage.getItem('selectedCartItems');
  if (storedItems) {
    cartItems.value = JSON.parse(storedItems);
  }
});

const handleSelectionChange = (selection) => {
  selectedCartItems.value = selection;
};

// 2. 计算总价
const totalPrice = computed(() => {
  return selectedCartItems.value.reduce((total, item) => total + item.skuPrice * item.quantity, 0);
});

// 3. 移除商品
const removeItem = (index) => {
  cartItems.value.splice(index, 1);
};

// 4. 结算
const checkout = async () => {
  if (selectedCartItems.value.length === 0) {
    ElMessage.warning('购物车为空，无法结算！');
    return;
  }

  const userId = localStorage.getItem('userId');
  if (!userId) {
    ElMessage.error('登录信息已失效，请重新登录');
    return;
  }

  loading.value = true;
  const skuStockList = selectedCartItems.value.map(item => ({
    skuId: item.skuId,
    saleCount: item.quantity,
    skuPrice: item.skuPrice,
    couponId: null,
  }));
  const params = {skuStockList};

  try {
    // 同一用户和订单内容在网络重试时复用幂等键，避免生成重复订单。
    const idempotencyKey = getOrCreateOrderIdempotencyKey(
      userId,
      params,
      sessionStorage,
    );
    const response = await request.post(
      'http://localhost:12345/orders/orderInfo?name=dujiacun',
      params,
      buildOrderRequestConfig(idempotencyKey),
    )
    if (response.data.code === 200) {
      ElMessage.success('结算成功: ' + response.data.message);
      orderId.value = response.data.data;
      clearOrderIdempotencyState(userId, sessionStorage);

      //删除cartItems中selectedCartItems包含的商品
      cartItems.value = cartItems.value.filter(item =>
        !selectedCartItems.value.some(selectedItem => selectedItem.skuId === item.skuId)
      );

      localStorage.setItem('selectedCartItems', JSON.stringify(cartItems.value));
      selectedCartItems.value = [];
    } else if (response.data.code === 429) {
      ElMessage.warning(response.data.message || '订单处理中，请勿重复提交');
    } else if (response.data.code === 409) {
      // 服务端发现幂等键与请求内容冲突时清理旧状态，允许用户重新提交。
      clearOrderIdempotencyState(userId, sessionStorage);
      ElMessage.error(response.data.message || '订单内容已变化，请重新提交');
    } else {
      ElMessage.error('结算失败: ' + response.data.message);
      orderId.value = '';
      // tableData.value = [];
      // total.value = 0;
    }
  } catch (error) {
    if (error.response?.status === 429) {
      ElMessage.warning('请求过于频繁，订单可能仍在处理中，请稍后重试');
    } else {
      ElMessage.error(error.response?.data?.message || '结算失败，请检查网络后重试');
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.shopping-cart-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
.cart-card {
  border-radius: 8px;
}
</style>

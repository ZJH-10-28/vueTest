<template>
    <button :style="{ position: 'fixed', top: '20px', right: '20px' }" class="Login" @click="exit" >安全退出</button>
  <div class="sku-query-container">
    <h2>商品信息查询</h2>
    <el-card shadow="hover" class="search-card">
      <el-form :model="searchForm" label-width="100px" @submit.prevent="handleSearch">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="商品ID">
              <el-input v-model="searchForm.skuId" placeholder="请输入商品ID" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品名称">
              <el-input v-model="searchForm.skuName" placeholder="请输入商品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="分类ID">
              <el-input v-model="searchForm.categoryId" placeholder="请输入分类ID" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6" style="display: flex; align-items: center; justify-content: flex-end;">
            <el-button type="primary" @click="handleSearch" icon="Search" >查询</el-button>
            <el-button @click="resetForm" icon="Refresh">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="hover" class="result-card">
      <el-table :data="tableData" border style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange" ref="multipleTableRef">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="skuId" label="商品ID" width="100" />
        <el-table-column prop="skuName" label="商品名称" min-width="150" />
        <el-table-column prop="skuDescription" label="商品介绍" min-width="200" />
        <el-table-column prop="categoryId" label="分类ID" width="100" />
        <el-table-column prop="skuPrice" label="价格" width="120" />
        <el-table-column prop="saleCount" label="销量" width="100" />
        <el-table-column prop="skuStockCount" label="库存" width="100" />
      </el-table>

    <div class="batch-operation" style="margin-top: 20px; text-align: center;">
      <el-button type="primary" @click="handleSelectedData">
        结算
      </el-button>
    </div>

      <el-pagination
        v-if="tableData.length > 0"
        class="pagination"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        v-model:page-size="pageSize"
        v-model:current-page="currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import request from '../commonUtils/commonRequest'

const router = useRouter()
const multipleTableRef = ref();

onMounted(() => {
  handleSearch(); // 初始化表格数据
});

const selectedRows = ref([]);
const handleSelectionChange = (selection) => {
  // `selection` 是当前选中行的数组
  selectedRows.value = selection;
  console.log('选中的行数据:', selectedRows.value);
};

const handleSelectedData = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择商品');
    return;
  }
  // 这里可以处理选中的数据，例如发送到后端
//   console.log('准备处理选中的数据:', selectedRows.value);
  // 示例：提取所有选中行的 skuId
//   const selectedIds = selectedRows.value.map(item => item.skuId);
//   console.log('选中的商品ID列表:', selectedIds);
  // 在这里调用您的 API 或执行其他业务逻辑

    localStorage.setItem('selectedCartItems', JSON.stringify(selectedRows.value.map(item => ({...item, quantity: 1}))));
    router.push('/order');
};

const searchForm = reactive({
  skuId: '',
  skuName: '',
  categoryId: ''
});

// 表格数据与分页状态
const tableData = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const loading = ref(false);

const exit = async () => {
  localStorage.clear() 
  window.location.href = '/register'
}

const handleSearch = async () => {
  loading.value = true;
    
  console.log('执行查询，参数:', searchForm);

     const params = {
      ...searchForm,
      pageNum: currentPage.value,
      pageSize: pageSize.value
    };
  
  const response = await request.post('http://localhost:12345/skus/skuList?name=dujiacun', params)
    if (response.data.code === 200) {
        tableData.value = response.data.data == null? [] : response.data.data;
        total.value = response.data.total || 0;
    } else {
        tableData.value = [];
        total.value = 0;
    }
    loading.value = false;

    await checkStoredItemsAndSelect();
};

/**
 * 重置搜索表单
 */
const resetForm = () => {
  searchForm.skuId = '';
  searchForm.skuName = '';
  searchForm.categoryId = '';
  // 可以在此处调用 handleSearch() 来刷新列表
};

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

// 定义检查并勾选的函数
const checkStoredItemsAndSelect = async () => {
  // 从 localStorage 获取之前保存的选中商品数组
  const storedItems = localStorage.getItem('selectedCartItems');
  if (storedItems) {
    // 解析 JSON 字符串为 JavaScript 对象
    const cartItems = JSON.parse(storedItems);
    // 提取出所有需要被选中的商品ID
    const skuIdsToSelect = cartItems.map(item => item.skuId);

    // 确保 tableData 已经加载完成并渲染到DOM
    await nextTick();
    
    // 遍历表格数据中的每一行
    tableData.value.forEach(row => {
      // 如果当前行的 skuId 在需要被选中的ID列表中
      if (skuIdsToSelect.includes(row.skuId)) {
        // 使用表格实例的 toggleRowSelection 方法进行勾选
        // 第二个参数 `true` 表示选中，`false` 表示取消选中
        multipleTableRef.value?.toggleRowSelection(row, true);
      }
    });
  }
};

</script>

<style scoped>
.sku-query-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}
.search-card {
  margin-bottom: 20px;
  border-radius: 8px;
}
.result-card {
  border-radius: 8px;
}
.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}
</style>
<template>
  <el-form :model="form" :rules="rules" label-width="80px" ref="loginFormRef">
    <el-form-item label="用户ID" prop="userId">
      <el-input v-model="form.userId" placeholder="请输入用户ID" clearable />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input
        v-model="form.password"
        type="password"
        placeholder="请输入密码"
        show-password
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm" style="width: 100%">登 录</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import request from '../commonUtils/commonRequest'

const router = useRouter()
const form = reactive({
  userId: '',
  password: ''
});

const rules = reactive({
  userId: [{ required: true, message: '用户ID不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
});

const loginFormRef = ref();

const submitForm = async () => {
  try {
    await loginFormRef.value.validate();
    console.log('登录成功，参数:', form);
    const response = await request.post('http://localhost:12345/users/login?name=dujiacun', {
      userName: form.userId,
      passWord: form.password
    })

    if(response.data.code === 200){
    ElMessage.success('登录成功！');
    // 保存 token 到 localStorage
    localStorage.setItem('token', response.data.data.token)
    localStorage.setItem('tokenHeader', response.data.data.tokenHeader)
    localStorage.setItem('isAdmin', response.data.data.isAdmin)

    // 跳转
    router.push('/sku')
    }
    else{
    ElMessage.error('登录失败！');
    localStorage.clear() // 清除 localStorage 中的所有数据
    }

  } catch (error) {
    ElMessage.error('登录失败！');
  }
};
</script>
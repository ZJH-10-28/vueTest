<template>
  <el-form :model="form" :rules="rules" label-width="80px" ref="registerFormRef">
    <el-form-item label="用户ID" prop="userId">
      <el-input v-model="form.userId" placeholder="请输入用户ID" clearable />
    </el-form-item>
    <el-form-item label="用户名" prop="userName">
      <el-input v-model="form.userName" placeholder="请输入用户名" clearable />
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
      <el-button type="primary" @click="submitForm" style="width: 100%">注 册</el-button>
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
  userName: '',
  password: ''
});

const rules = reactive({
  userId: [{ required: true, message: '用户ID不能为空', trigger: 'blur' }],
  userName: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
});

const registerFormRef = ref();
const emit = defineEmits(['registerSuccess']);
const submitForm = async () => {
  try {
    await registerFormRef.value.validate();
    console.log('注册成功，参数:', form);

    const response = await request.post('http://localhost:12345/users/register?name=dujiacun', {
      userId: form.userId,
      userName: form.userName,
      passWord: form.password
    })

    if(response.data.code === 200){
    ElMessage.success('注册成功！');
    // 跳转
    emit('registerSuccess');
    // router.push('/register')
    }
    else{
    ElMessage.error('注册失败！');
    localStorage.clear() // 清除 localStorage 中的所有数据
    }

  } catch (error) {
    ElMessage.error('注册失败1！');
  }
};
</script>
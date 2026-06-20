<template>
<div class="form-container">
    <!-- 左侧宣传区 -->
    <div class="auth-left">
        <div class="content">
        <h2 class="title">欢迎光临度假村!</h2>
        <p class="subtitle">个人学习用</p>
        </div>
    </div>

    <!-- 右侧表单区 -->
    <div class="auth-right">
        <!-- 标签页切换 -->
    <el-tabs v-model="activeTab" stretch>
        <el-tab-pane label="登录" name="login">
        <LoginForm />
        </el-tab-pane>
        <el-tab-pane label="注册" name="register">
        <RegisterForm @registerSuccess="handleRegisterSuccess"/>
        </el-tab-pane>
    </el-tabs>
    </div>
</div>
</template>

<script setup>
import { ref } from 'vue';
import LoginForm from './LoginForm.vue'; // 导入子组件
import RegisterForm from './RegisterForm.vue'; // 导入子组件

// 当前激活的标签页
const activeTab = ref('login');
const handleRegisterSuccess = () => {
  // 父组件收到通知，安全地修改自己的状态
  activeTab.value = 'login';
};
</script>

<style scoped>

.content {
  text-align: center;
  max-width: 400px;
  padding: 20px;
}

.title {
  font-size: 2.5em;
  font-weight: bold;
  margin-bottom: 20px;
}

.subtitle {
  font-size: 1.2em;
  opacity: 0.9;
}

.form-container {
  width: 100%;
  max-width: 600px;
  padding: 60px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
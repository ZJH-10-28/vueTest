<template>
  <div>
    <h2>子组件</h2>
    <p>子组件收到的消息：{{ dataFromParent }}</p>
    <button class="Childlogo" @click="sendToParent">向父组件发送消息</button>
  </div>
</template>

<script setup>
import { inject } from 'vue'

// 注入父组件提供的数据
const dataFromParent = inject('msgData')
const dataToParent = inject('msgDataFromChild')

function sendToParent() {
  dataToParent('message-from-child', 'Hello from child!');
}
</script>

<style scoped>
.Childlogo {
  background-color: rgb(215, 200, 233);
}
.Childlogo:hover {
  filter: drop-shadow(0 0 2em #2fa749aa);
}
</style>
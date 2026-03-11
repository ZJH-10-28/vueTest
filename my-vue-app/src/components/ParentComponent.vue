<template>
  <div>
    <h2>父组件</h2>
    <button class="Parentlogo" @click="sendToChild">向子组件发送消息</button>
    <p>来自子组件的消息：{{ messageFromChild }}</p>
  </div>
  <div>
    <h2>组件A</h2>
    <input v-model="inputText" placeholder="输入要发送的消息" />
    <button @click="sendMessage">发送消息</button>
    <p>当前计数：{{ store.count }}</p>
    <button @click="store.increment()">+1 计数</button>
  </div>
  <router-view />
</template>

<script setup>
import { ref , provide  } from 'vue'
import { useMessageStore } from '../stores/message'

const messageFromChild = ref('')
const messageToChild = ref('')

const store = useMessageStore()
const inputText = ref('')
function sendMessage() {
  store.updateContent(inputText.value)
  inputText.value = ''
}

// 提供数据给所有后代（包括子路由组件）
provide('msgData', messageToChild)
provide('msgDataFromChild', (msg) => {
    messageFromChild.value = msg;
  })
    
function sendToChild () {
    messageToChild.value = "aaaaaaaa";
  };
</script>


<style scoped>
.Parentlogo {
  background-color: rgb(176, 212, 200);
}
.Parentlogo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
</style>
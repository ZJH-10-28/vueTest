<template>
  <div>
    <p>子组件收到的消息：{{ messageFromParent }}</p>
    <button class="Childlogo" @click="sendToParent">向父组件发送消息</button>
  </div>
</template>

<script>
export default {
  name: 'ChildComponent',
  props: {
    messageFromParent: {
      type: String,
      required: true
    }
  },
  methods: {
    sendToParent() {
      this.$emit('message-from-child', 'Hello from child!');
    }
  }
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
<template>
  <div>
    <p>子组件收到的消息：{{ messageFromParent }}</p>
    <button @click="sendToParent">向父组件发送消息</button>
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
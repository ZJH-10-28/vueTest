<template>
  <div>
    <h2>父组件</h2>
    <button class="Parentlogo" @click="sendToChild">向子组件发送消息</button>
    <p>来自子组件的消息：{{ messageFromChild }}</p>
    <ChildComponent 
      :message-from-parent="messageToChild"
      @message-from-child="handleChildMessage"
    />
  </div>
</template>

<script>
import ChildComponent from './ChildComponent.vue';

export default {
  name: 'ParentComponent',
  components: {
    ChildComponent
  },
  data() {
    return {
      messageFromChild: ''
    };
  },
  methods: {
    handleChildMessage(payload) {
      this.messageFromChild = payload;
    },
    sendToChild() {
      this.messageToChild = "aaaaaaaa";
    }
  }
}
</script>
<style scoped>
.Parentlogo {
  background-color: rgb(176, 212, 200);
}
.Parentlogo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
</style>
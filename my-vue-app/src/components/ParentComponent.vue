<template>
  <div>
    <h2>父组件</h2>
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
      messageToChild: 'Hello from parent!',
      messageFromChild: ''
    };
  },
  methods: {
    handleChildMessage(payload) {
      this.messageFromChild = payload;
    }
  }
}
</script>
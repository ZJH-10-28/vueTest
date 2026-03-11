import { defineStore } from 'pinia'

export const useMessageStore = defineStore('message', {
  state: () => ({
    content: '初始消息',
    count: 0
  }),
  actions: {
    updateContent(newContent) {
      this.content = newContent
    },
    increment() {
      this.count++
    }
  }
})
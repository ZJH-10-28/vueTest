import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import DuJiaCun_Router from './router/DuJiaCun_Router'
import { createPinia } from 'pinia'

createApp(App)
.use(DuJiaCun_Router)
.use(createPinia())
.mount('#DuJiaCun')

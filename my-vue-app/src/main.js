import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import DuJiaCun_Router from './router/DuJiaCun_Router'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

createApp(App)
.use(DuJiaCun_Router)
.use(createPinia())
.use(ElementPlus)
.mount('#DuJiaCun')

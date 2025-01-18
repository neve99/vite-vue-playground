import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from '@/router'
import drag from 'v-drag'

createApp(App)
  .use(router)
  .use(drag, {
    // global configuration
  })
  .mount('#app')

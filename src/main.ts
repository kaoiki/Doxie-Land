import { createApp } from 'vue'
import ui from '@nuxt/ui/vue-plugin'
import App from './App.vue'
import './assets/main.css'
import router from './router'

createApp(App).use(ui).use(router).mount('#app')

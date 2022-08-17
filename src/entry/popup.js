import { createApp } from 'vue'
import App from '../view/popup.vue'
import Router from '../router'
import Store from '../store'

createApp(App).use(Router).use(Store).mount('#app')

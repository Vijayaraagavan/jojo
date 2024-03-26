import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { vuetify } from '@/modules/vuetify'
const pinia = createPinia()
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(vuetify)

app.mount('#app')

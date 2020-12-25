import '@babel/polyfill'
import 'mutationobserver-shim'
import { createApp } from 'vue'
import App from './App.vue'
import store from './appstore'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'animate.css/animate.min.css'

const app = createApp(App)
  .use(router)
  .use(store)

const vm = app.mount('#app')

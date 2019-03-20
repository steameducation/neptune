import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'

import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

import messages from '@/messages.js'

const i18n = new VueI18n({
    locale: 'en',
    messages,
})

Vue.config.productionTip = false
// Vue.config.performance = true

new Vue({
    i18n,
    render: h => h(App),
}).$mount('#app')

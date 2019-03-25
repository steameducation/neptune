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

import * as Sentry from '@sentry/browser'

if (process.env.NODE_ENV !== 'development') {
    Sentry.init({
        dsn: 'https://5f411b03f8fb493186cff27e41301b1d@sentry.io/1422676',
        integrations: [
            new Sentry.Integrations.Vue({
                Vue,
                attachProps: true,
            }),
        ],
    })
}

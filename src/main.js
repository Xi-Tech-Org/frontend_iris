/*!

 =========================================================
 * Vue Black Dashboard PRO - v1.4.1
 =========================================================

 * Product Page: https://www.creative-tim.com/product/vue-black-dashboard-pro
 * Copyright 2024 Creative Tim (https://www.creative-tim.com)

 * Coded by Creative Tim

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import RouterPrefetch from 'vue-router-prefetch';
import DashboardPlugin from './plugins/dashboard-plugin';
import App from './App.vue';
import store from './store/store.js';

// router setup
// import router from "./routes/router";
import router from './routes/irisRouter';
import i18n from './i18n';
import './registerServiceWorker';
// plugin setup
Vue.use(DashboardPlugin);
Vue.use(VueRouter);
Vue.use(RouterPrefetch);

Vue.prototype.$process_env = process.env;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: (h) => h(App),
  store,
  router,
  i18n,
});

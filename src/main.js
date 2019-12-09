import '@babel/polyfill'
import 'normalize.css'
import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'

import App from './App'
import i18n from './langs'
import router from './router'
import store from './store'
import Axios from './assets/js/axios'
import Tool from './assets/js/tool'
import './router/helper'
import './assets/scss/index.scss'
const eleConfig = {
  size: 'medium',
  i18n: (path, option) => i18n.t(path, option)
};

Vue.use(VueRouter);
Vue.use(ElementUI, eleConfig);
Vue.prototype.$ajax = Axios;
Vue.prototype.$tool = Tool;

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App),
});

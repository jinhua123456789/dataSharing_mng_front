import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
import 'element-ui/lib/theme-chalk/index.css'//element-ui的css
import ElementUI from 'element-ui'
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // Internationalization
import './icons' // icon
import './permission' // permission control
import './utils/errorLog' // error log
import VCharts from 'v-charts'
import * as filters from './filters' // global filters
import formCreate from '@form-create/element-ui'
import axios from 'axios'
import echarts from 'echarts'
import './assets/css/font_93portal2/iconfont.css'
import './assets/css/font_1522525_0hq7f17mrfak/iconfont.css'
import './assets/css/font_1522525_pwgo8oftg4b/iconfont.css'
import './assets/css/fontsmark/iconfont.css'
const Cesium = require('../node_modules/cesium/Build/Cesium/Cesium')
const widgets= require('../node_modules/cesium/Build/Cesium/Widgets/widgets.css');


Vue.prototype.Cesium = Cesium
Vue.prototype.widgets = widgets
Vue.prototype.$axios = axios
Vue.prototype.$echarts = echarts

Vue.use(formCreate)

// import { mockXHR } from '../mock' // simulation data

// mock api in github pages site build
// if (process.env.NODE_ENV === 'production') { mockXHR() }

Vue.use(VCharts)
Vue.use(ElementUI)
Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

// 若是没有开启Devtools工具，在开发环境中开启，在生产环境中关闭
// if (process.env.NODE_ENV == 'development') {
//   Vue.config.devtools = true;
// } else {
//   Vue.config.devtools = false;
// }

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})

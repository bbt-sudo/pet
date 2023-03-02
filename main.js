import App from './App'

// #ifndef VUE3
import Vue from 'vue'


// 路由拦截引入
import request from "@/API/request/request.js"

Vue.config.productionTip = false
App.mpType = 'app'

import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

import mixins from '@/utils/mixins.js'
// VUEX
import { store } from "@/store/index.js"

// 初始化项目
import init from "@/common/init.js"


import {timeFormat} from "@/utils/timeform.js"

Vue.mixin(mixins)

Vue.filter(timeFormat)
console.log(timeFormat(1000000000000));



// 路由拦截
request()

uni.$u.http.setConfig((config) => {
    /* config 为默认全局配置*/
    config.baseURL = `https://4de16698-d9f4-443a-b416-ef1037cce952.bspapp.com/http`; /* 根域名 */
    return config
})





const app = new Vue({
    ...App,
	store
})

// 初始化
init().then(res=>{
	console.log(res);

	app.$mount()
	
	// if(res===1){
	// 	uni.navigateTo({
	// 		url: "/pages/public/login"
	// 	})
	// }
})








// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
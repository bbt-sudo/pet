import Vue from 'vue'
import Vuex from 'vuex'

import user from "@/store/user/index.js"

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
   
  },
	  
  modules:{
	  user
  }
})

import {getuserInfo} from '@/API/index/index.js'


export default {
	// namespaced: true,
	state() {
		return {
			token: '',
			userInfo: {},
			uid: '',
			tokenExpired: 0,
			
			
			// 购物车的接口
			cartApi:false,
			
			addressApi:false,
			
			// 订单的刷新
			orderRef:false
		}
	},
	mutations: {
		GET_TOKEN(state, val) {
			state.token = val
			// console.log(state.token,"11111111");
		},
		GET_USERINFO(state, val) {
			state.userInfo = val
			// console.log(state.userInfo,"222222");
		},
		GET_UID(state, val) {
			state.uid = val
			// console.log(state.uid);
		},
		GET_TOKENEXPIRED(state, val) {
			state.tokenExpired = val
			// console.log(state.tokenExpired);
		},
		
		// 订单的刷新
		ORDER(state){
			state.orderRef = !state.orderRef
			console.log(state.orderRef);
		},
		
		// 退出清空vuex
		CLEAR_ORDER(state){
			state.token = '',
			state.userInfo = {},
			state.uid = '',
			state.tokenExpired = 0
		}
	},
	actions: {
		async get_userinfo({commit}){
			// console.log(val);
			let token = uni.getStorageSync('token')
			
			// console.log(token);
			let res = await getuserInfo({token})
			// console.log(res);
			
			let uid = uni.getStorageSync('uid')
			let tokenExpired = uni.getStorageSync('tokenExpired')
			
			commit('GET_USERINFO',res.userInfo)
			commit('GET_UID',uid)
			commit('GET_TOKENEXPIRED',tokenExpired)
		}
	},
	getters: {}
}

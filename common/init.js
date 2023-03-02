
import { store } from "@/store/index.js"

export default function(){
	
	let token = uni.getStorageSync('token')
	// console.log(token);
	return new Promise((resolve,reject)=>{
		if(token){
			store.dispatch('get_userinfo').then(res=>{
				// console.log(res);
				resolve(0)
			}).catch(err=>{
				resolve(1)
			})
		}else {
			resolve(1)
		}
	})
	
}
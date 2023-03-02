export default {
	
	methods:{
		navTo(url){
			// console.log(url);
			uni.navigateTo({
				url:url
			})
			
			
		},
		swithTo(url){
			uni.switchTab({
				url:url
			})
		},
		
		back(){
			uni.navigateBack()
			
		},
		
		// 未登录，token到期了
		notLogin(){
			let {uid,userInfo,tokenExpired,token} = this.$store.state.user
			// console.log(uid,userInfo,tokenExpired,token);
			
			let newTime = +new Date()
			// console.log(newTime>tokenExpired)
			// console.log(uid);
			
			
			if (!uid){
				
				if(newTime>tokenExpired && uid){
					uni.$u.toast('您的登录已过期，请重新登陆一下把')
					setTimeout(()=>{
						this.navTo('/pages/public/login')
						uni.clearStorageSync()
					},300)
					return
				}
				
				uni.$u.toast('请先登录')
				setTimeout(()=>{
					this.navTo('/pages/public/login')
					
					// uni.clearStorageSync()
				},300)
				return
			}
			
			
			
			
		}
	}
}
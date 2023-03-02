<template>
	<view class="warp">
		<!-- #ifdef APP-PLUS -->
		<view class="title-contents"><view class="top-view status"></view></view>
		<!-- #endif -->
		<!-- 密码登录 -->
		<view class="login-phone form-wapper">
			<view class="phone input-wapper">
				<view class="lside"><text class="iconfont icon-shouji"></text></view>
				<view class="mobile rside"><input placeholder-class="input-placeholder" v-model="upData.username"  type="number" placeholder="请输入手机号" /></view>
			</view>
			<view class="phone input-wapper">
				<view class="lside"><text class="iconfont icon-yanzhengma"></text></view>
				<view class="mobile rside"><input placeholder-class="input-placeholder" type="number" v-model="upData.vercode" placeholder="请输入验证码" /></view>

				<view>
					<button type="default" @click="send">获取验证码</button>
				</view>
			</view>
			<view class="code input-wapper">
				<view class="lside"><text class="iconfont icon-mima2"></text></view>
				<view class="rside"><input placeholder-class="input-placeholder" type="password" maxlength="12" v-model="upData.password"  placeholder="请设置新密码(6-12位) " /></view>
			</view>
		</view>

		<button type="primary" class="login-btn" @click="updatePwdApi">确定</button>
	</view>
</template>
<script>
import { userSendSms,updatePwd } from "@/API/index/index.js"
export default  {
	data(){
		return{
			upData:{
				username:'',
				password:'',
				vercode:''
			}
		}
	},
	methods:{
		send(){
			let mobile = this.upData.username
			let type = 'login'
			userSendSms({mobile,type}).then(res=>{
				console.log(res);
				if(res.code===0) {
					uni.$u.toast(res.data)
				}
			})	
		},
		updatePwdApi(){
			let {upData} = this
			updatePwd(upData).then(res=>{
				console.log(res);
			})
		}
	},
	
}
</script>
<style lang="scss">
@import  "login.scss"
</style>

<template>
	<view class="warp">
		<!-- #ifdef APP-PLUS -->
		<view class="title-contents"><view class="top-view status"></view></view>
		<!-- #endif -->
		<view class="login-title">
			<view class="logo"><image src="/static/images/common/logo.png" mode=""></image></view>
		</view>
		<!-- 密码登录 -->
		<view class="login-phone form-wapper">
			<view class="phone input-wapper">
				<view class="lside"><text class="iconfont icon-shouji"></text></view>
				<view class="mobile rside"><input placeholder-class="input-placeholder" v-model="username"  type="number" placeholder="请输入手机号" /></view>
			</view>
			<view class="phone input-wapper">
				<view class="lside"><text class="iconfont icon-yanzhengma"></text></view>
				<view class="mobile rside"><input placeholder-class="input-placeholder" type="number" v-model="vercode"  placeholder="请输入验证码" /></view>

				<view >
					<button type="default" @click="send" >获取验证码</button>
				</view>
			</view>
			<view class="code input-wapper">
				<view class="lside"><text class="iconfont icon-mima2"></text></view>
				<view class="rside"><input placeholder-class="input-placeholder" v-model="password" type="password" maxlength="12"   placeholder="请输入密码(6-12位) " /></view>
			</view>
		</view>

		<button type="primary" class="login-btn" @click="reg">注册</button>
		<view class="reg-paw"><text class="active" @click="navTo('/pages/public/login')">已有账号,返回登录</text></view>
	</view>
</template>
<script>
	import { userSendSms,userReg } from "@/API/index/index.js"
	
	export default {
		data(){
			return {
				username:'13412345678',
				password:'',
				vercode:'',
			}
		},
		methods:{
			// 发送验证码
			send(){
				
				let mobile = this.username
				let type = 'register'
				userSendSms({mobile,type}).then(res=>{
					console.log(res);
					if(res.code===0) {
						uni.$u.toast(res.data)
					}
				})
			},
			// 注册
			reg(){
				let {username,password,vercode} = this
				
				
				
				if(!/^1[3-9]\d{9}$/.test(username)){
					uni.$u.toast('手机号码格式错误');
					return;
				}
				if(!/^\d{6}$/.test(vercode)){
					uni.$u.toast('验证码格式错误');
					return;
				}
				if(!/^\w{6,12}$/.test(password)){
					uni.$u.toast('密码格式错误');
					return;
				}
				
				
				userReg({username,password,vercode}).then(res=>{
					// console.log(res);
					uni.$u.toast(res.msg)
					if(res.code===0) {
						uni.$u.toast('注册成功')
						this.navTo('/pages/public/login')
					}
				})
			}
		}
	}



	
	
</script>
<style lang="scss">
@import "login.scss"
</style>

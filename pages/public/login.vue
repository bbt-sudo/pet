<template>
	<view class="warp">
		<!-- {{$store.state.user.aa}} -->
		<!-- #ifdef APP-PLUS -->
		<view class="title-contents">
			<view class="top-view status"></view>
		</view>
		<!-- #endif -->
		<view class="login-title">
			<view class="logo">
				<image src="/static/images/common/logo.png" mode=""></image>
			</view>
		</view>
		<view class="login-phone form-wapper">
			<view class="phone input-wapper">
				<view class="lside"><text class="iconfont icon-shouji"></text></view>
				<view class="mobile rside"><input placeholder-class="input-placeholder" type="number" v-model="username"
						placeholder="请输入手机号" /></view>
			</view>
			<view class="code input-wapper">
				<view class="lside"><text class="iconfont icon-mima2"></text></view>
				<view class="rside"><input placeholder-class="input-placeholder" type="password" maxlength="12" v-model="password"
						placeholder="请输入密码(6-12位) " /></view>
			</view>
			<view class="paw">
				<view class="btn" @click="navTo('/pages/public/code_login')">验证码登录</view>
			</view>
		</view>

		<button type="primary" class="login-btn" @click="log">登录</button>
		<view class="reg-paw">
			<text class="active" @click="navTo('/pages/public/reg')">注册账号</text>
			<text @click="navTo('/pages/public/forget')">忘记密码</text>
		</view>
		<!-- #ifdef APP-PLUS -->
		<view class="quick">
			<view class="quick-title">
				<text class="line"></text>
				<text class="txt">快捷登陆</text>
				<text class="line"></text>
			</view>
			<view class="sanfang">
				<image src="../../static/temp/share_wechat.png" mode=""></image>
			</view>
		</view>
		<!-- #endif -->
	</view>
</template>
<script>
	import {
		useLogin
	} from "@/API/index/index.js"
	export default {
		data() {
			return {
				username: '',
				password: ''
			}
		},
		methods: {
			log() {
				let {username,password}= this
				useLogin({username,password}).then(res => {
					console.log(res);
					if(res.code===0){		
						
						uni.$u.toast('登陆成功')
						
						// 储存至本地
						uni.setStorageSync("token",res.token)
						uni.setStorageSync("uid",res.uid)
						uni.setStorageSync("tokenExpired",res.tokenExpired)
						
						// 存储为VUEx
						this.$store.commit('GET_TOKEN',res.token)
						
						// 调用vuex的方法
						this.$store.dispatch('get_userinfo')
						
						// console.log(this.navTo('/pages/index/index'));
						// 返回
						setTimeout(()=>{
							uni.navigateBack()
						},500)
						
						
					}
				})
			}
		}
	}
</script>
<style lang="scss">
	@import "login.scss"
</style>

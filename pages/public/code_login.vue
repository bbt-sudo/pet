<template>
	<view class="warp">
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
		<!-- 密码登录 -->
		<view class="login-phone form-wapper">
			<view class="phone input-wapper">
				<view class="lside"><text class="iconfont icon-shouji"></text></view>
				<view class="mobile rside"><input placeholder-class="input-placeholder" v-model="username" type="number"
						placeholder="请输入手机号" /></view>
			</view>
			<view class="phone input-wapper">
				<view class="lside"><text class="iconfont icon-yanzhengma"></text></view>
				<view class="mobile rside"><input placeholder-class="input-placeholder" type="number" v-model="vercode"
						placeholder="请输入验证码" /></view>

				<view>
					<button type="default" @click="send">获取验证码</button>
				</view>
			</view>
		</view>

		<button type="primary" class="login-btn" @click="log">登录</button>

	</view>
</template>
<script>
	import {
		codeLogin,
		userSendSms
	} from "@/API/index/index.js"
	export default {
		data() {
			return {
				username: '',
				vercode: ''
			}
		},
		methods: {
			log() {
				let {
					username,
					vercod
				} = this
				codeLogin({
					username,
					vercod
				}).then(res => {
					console.log(res);
					if (res.code === 0) {
						uni.$u.toast('登陆成功')
					}
				})
			},
			send(){
				let mobile = this.username
				let type = 'login'
				
				userSendSms({mobile,type}).then(res=>{
					uni.$u.toast(res.data)
				})
			}
		}
	}
</script>
<style lang="scss">
	@import "login.scss"
</style>

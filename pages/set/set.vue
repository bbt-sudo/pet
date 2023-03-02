<template>
	<view class="container">
		<view class="list-cell b-b m-t" @click="navTo('/pages/user/userinfo')">
			<text class="cell-tit">个人资料</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell b-b" >
			<text class="cell-tit">修改密码</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell m-t b-b" >
			<text class="cell-tit">清除缓存</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell b-b" >
			<text class="cell-tit">关于小莱</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<!-- #ifdef APP-PLUS -->
	
		<view class="list-cell" >
			<text class="cell-tit">检查更新</text>
			<text class="cell-tip">当前版本 1.0</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
			<!-- #endif -->
		<view class="list-cell log-out-btn" v-if="textWenZi==='退出登录'"><text class="cell-tit" @click="tuiLogin">{{textWenZi}}</text></view>
		<view class="list-cell log-out-btn" v-else><text class="cell-tit" @click="navTo('/pages/public/login')">{{textWenZi}}</text></view>

		<u-modal :show="show" :showCancelButton='true' :title="title" :content='content' @confirm="confirm" @cancel="cancel"></u-modal>
		
	</view>
</template>

<script>
export default {
	data(){
		return{
			title:'提示',
			content:'确定退出吗',
			show:false,
			

			uid:''
		}
	},
	methods:{
		tuiLogin(){
			this.show = true
		},
		
		confirm(){
			uni.clearStorageSync()
			uni.$u.toast('退出成功')
			this.show = false
			
			this.$store.commit('CLEAR_ORDER')
			// 刷新一下页面
			// location.reload()
			uni.navigateBack()
			
			
			
		},
		cancel(){
			this.show = false
		}
		
	},
	onLoad(){
		this.uid = this.$store.state.user.uid
	},
	computed:{
		textWenZi(){
			let {uid} = this.$store.state.user
			
			if(uid){
				return '退出登录'
			}else{
				return '登录'
			}
		}
	}
};
</script>

<style lang="scss">
page {
	background: $page-color-base;
}
.list-cell {
	display: flex;
	align-items: baseline;
	padding: 20upx $page-row-spacing;
	line-height: 60upx;
	position: relative;
	background: #fff;
	justify-content: center;
	&.log-out-btn {
		margin-top: 40upx;
		.cell-tit {
			color: $uni-color-primary;
			text-align: center;
			margin-right: 0;
		}
	}
	&.cell-hover {
		background: #fafafa;
	}
	&.b-b:after {
		left: 30upx;
	}
	&.m-t {
		margin-top: 16upx;
	}
	.cell-more {
		align-self: baseline;
		font-size: $font-lg;
		color: $font-color-light;
		margin-left: 10upx;
	}
	.cell-tit {
		flex: 1;
		font-size: $font-base + 2upx;
		color: $font-color-dark;
		margin-right: 10upx;
	}
	.cell-tip {
		font-size: $font-base;
		color: $font-color-light;
	}
	switch {
		transform: translateX(16upx) scale(0.84);
	}
}
</style>

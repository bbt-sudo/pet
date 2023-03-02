<template>
	<view class="page">

		<view class="topBox">
			<image src="../../static/images/my/my_bj.png" mode=""></image>
		</view>
		<view class="kfItem iconfont icon-youjiantou" @click="to_qq">
			<label class="iconfont icon-kefu"></label>
			<view class="kfTxt">
				<label>客服QQ</label>
				<text class="phone">{{qq}}</text>
			</view>
		</view>
		<view class="kfItem iconfont icon-youjiantou" @click="call">
			<label class="iconfont icon-kefu"></label>
			<view class="kfTxt">
				<label>客服电话</label>
				<text class="phone">{{tel}}</text>
			</view>
		</view>
	
	
	</view>
</template>

<script>
	import { upgrade } from "@/API/index/index.js"
export default {
	data(){
		return{
			qq:'1505077783',
			tel:'15660123801'
		}
	},
	onLoad(){
		
		// upgrade().then(res=>{
		// 	console.log(res);
		// 	let {qq,tel} = res.data[0];
		// 	this.qq = qq;
		// 	this.tel = tel;
		// })
		
		
		
		//window.open('http://wpa.qq.com/msgrd?v=3&uin=672279170&site=在线客服&menu=yes')
		//plus.ru3ntime.openURL('mqqwpa://im/chat?chat_type=wpa&uin=672279170&version=1&src_type=web&web_src=oicqzone.com');
	},
	methods:{
        to_qq(){
			let qq = this.qq ;
			// #ifdef H5
			window.open(`http://wpa.qq.com/msgrd?v=3&uin=${qq}&site=在线客服&menu=yes`)
			// #endif
			// #ifdef APP-PLUS
			plus.runtime.openURL(`mqqwpa://im/chat?chat_type=wpa&uin=${qq}&version=1&src_type=web&web_src=oicqzone.com`);
			// #endif
		},
		call(){
			let tel = this.tel
			uni.makePhoneCall({
			    phoneNumber: tel
			});
			
		}


	},
	filters:{




	}
}
	
</script>

<style lang="scss">
.topBox{
	position:relative;
	width:100%;
	height: 600rpx;
	.txtBox{
		position: absolute;
		z-index: 100;
		margin: 30upx 0 0 30upx;
		.txt1{
			font-size:48upx;
			font-weight:800;
			color:rgba(255,255,255,1);
			line-height:67upx;
		}
		.line{
			margin: 30upx 0 24upx;
			display:block;
			width:80upx;
			height:6upx;
			background:rgba(223,245,172,1);
		}
		.txt2{
			font-size:30upx;
			font-weight:400;
			color:rgba(255,255,255,1);
			line-height:42upx;
		}
	}
	image{
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}
}
.kfItem{
	margin:0 24upx 30upx;
	// height:163upx;
	padding:34upx 0;
	background:rgba(255,255,255,1);
	box-shadow:0 2upx 10upx 0 rgba(0,0,0,0.3);
	border-radius:20upx;
	position: relative;
	display: flex;
	align-items: center;
	&:before{
		position:absolute;
		right: 30upx;
		top: 50%;
		transform:translateY(-50%);
		color: #999;
		font-size: 41upx;
	}
	.icon-kefu{
		position: absolute;
		left: 30upx;
		color:rgba(255,161,31,1);
		font-size: 56upx;
		float: left;
		top: 50%;
		transform: translateY(-50%);
	}
	.kfTxt{
		padding-left: 113upx;
		display: flex;
		overflow: hidden;
		flex-direction: column;
		justify-content: center;
		.phone{
			font-size:30upx;
			font-weight:400;
			color:rgba(123,123,123,1);
			line-height:40upx;
		}
		label{
			font-size:38upx;
			font-weight:600;
			color:rgba(26,26,26,1);
			line-height:53upx;
		}
	}
}
</style>

<template>
	<view style="padding-bottom: 30px;">
		<view class="sale_good">
			<image :src="shujuData.img" mode=""></image>
			<view class="sale_goodBox">
				<text class="sale_pa">{{shujuData.name}}</text>
				<text class="sale_pa">{{shujuData.attr}}</text>
				<text class="sale_pb">
					<text class="price">¥{{shujuData.price}}</text>
					<text class="num">x{{shujuData.num}}</text>
				</text>
			</view>
		</view>
		<view class="comment_share">
			<textarea placeholder-class="color999 font28" v-model="pingData.content" placeholder="分享本次购物体验，2~256字" />

			<view class="comment_shareBox"><text class="comment_pc">您的评价可以帮助其他小伙伴哦~</text></view>
			<text class="comment_pa">发图片</text>

			<view class="upload-content">
				<block>
					<view class="upload-item">
						<image class="upload-img" src="../../static/images/home/goods1.jpg" mode="aspectFill"></image>
						<!-- 	<view class="upload-progress">1%</view> -->
					</view>
					<view class="upload-item">
						<image class="upload-img" src="../../static/images/home/goods1.jpg" mode="aspectFill"></image>
						<!-- 	<view class="upload-progress">1%</view> -->
					</view>
				</block>

				<view class="upload-add-btn"></view>
			</view>
		</view>
		<view class="comment_final">
			<view class="comment_finalBox">
				<text class="comment_finalTit">综合评价</text>
				<!-- <view class="comment_xing"> -->
				<u-rate :count="count" @change="changeXing" size="40rpx" v-model="pingData.score"></u-rate>
				<!-- </view> -->
			</view>
		</view>

		<view class="submit" @click="submit">提交</view>
	</view>
</template>

<script>
	import { saveOrderEvaluateAdd } from "@/API/index/index.js"
	export default {
		data() {
			return {
				// 上传的数据
				pingData: {
					orderId: '',
					goods_id: '',
					content: '',
					score: 0,
					images: 'http://toutiao.longxiaokj.com/167696721752616255338477653013.jpg',
					uid: '',
					attr: []
				},

				// 评分
				count: 5, // 设置几颗星星
				
				shujuData:[]
			}
		},
		methods: {
			// 评分
			changeXing(val) {
				// console.log(val);
				this.pingData.score = val
			},
			
			// 提交
			 submit(){
				 let {pingData} = this
				 
				 if(pingData.score<=0){
					 uni.$u.toast('请选择评分')
					 return
				 }
				 console.log(pingData);
				 saveOrderEvaluateAdd(pingData).then(res=>{
					 console.log(res);
					 if(res.code===1){
						 this.navTo('/pages/order/order_detail?id='+pingData.orderId)
					 }
				 })
			 }
		},
		onLoad(options) {
			console.log(options);
			let item = JSON.parse(decodeURIComponent(options.item))
			
			this.shujuData = item
			
			
			this.pingData.orderId = options.orderId
			this.pingData.goods_id = item.goods_id
			this.pingData.attr = item.attr
			this.pingData.uid = this.$store.state.user.uid

			console.log(this.pingData);
		}
	}
</script>

<style lang="scss">
	.comment_final {
		width: 100%;
		height: auto;
		overflow: hidden;
		margin-top: 20upx;
		background: white;
		padding: 30upx 30upx 0 30upx;

		.comment_finalBox {
			width: 100%;
			height: auto;
			overflow: hidden;
			margin-bottom: 24upx;
			display: flex;
			align-items: center;

			.comment_finalTit {
				font-size: 24upx;
				width: 120upx;
				display: block;
			}

			.comment_xing {
				flex: 1;
				height: auto;
				overflow: hidden;
				padding-left: 48upx;

				text {
					font-size: 48upx;
					color: #eeeeee;
					margin-right: 8upx;
				}

				.act {
					color: #f7c243;
				}
			}
		}
	}

	.comment_share {
		width: 100%;
		height: auto;
		overflow: hidden;
		background: white;
		padding: 0 30upx;

		textarea {
			width: 100%;
			height: 304upx;
			border-radius: 20upx;
			background: #f6f6f6;
			font-size: 30upx;
			color: #333;
			line-height: 33upx;
			padding: 24upx;
		}

		.comment_pa {
			display: block;
			font-size: 32upx;
			color: #333;
			padding: 32upx 0 24upx;
		}

		image {
			display: block;
			width: 160upx;
			height: 160upx;
		}

		.comment_shareBox {
			width: 100%;
			height: auto;
			overflow: hidden;

			.iconfont {
				font-size: 24upx;
				color: #999999;
				line-height: 88upx;
				float: left;
				display: block;
			}

			.iconfont.act {
				color: #e33b2d;

				&:before {
					content: '\e655';
				}
			}

			.comment_pb {
				font-size: 24upx;
				color: #333333;
				margin-left: 15upx;
				line-height: 90upx;
				display: block;
				float: left;
			}

			.comment_pc {
				float: right;
				color: #bfbfbf;
				font-size: 24upx;
				line-height: 90upx;
			}
		}
	}

	.sale_good {
		width: 100%;
		height: auto;
		overflow: hidden;
		padding: 30upx;
		background: white;

		image {
			display: block;
			width: 200upx;
			height: 200upx;
			float: left;
		}

		.sale_goodBox {
			width: calc(100% - 200upx);
			height: 200upx;
			position: relative;
			float: left;
			padding-left: 24upx;

			.sale_pa {
				font-size: 24upx;
				line-height: 44upx;
				color: #000000;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}

			.sale_pb {
				width: calc(100% - 24upx);
				font-size: 32upx;
				color: #e33b2d;
				position: absolute;
				line-height: 44upx;
				font-weight: bold;
				bottom: 7upx;

				.price {}

				.num {
					font-size: 24upx;
					color: #999999;
					float: right;
					font-weight: normal;
					vertical-align: middle;
					line-height: 44upx;
				}
			}
		}
	}

	.submit {
		width: 600rpx;
		height: 90rpx;
		text-align: center;
		line-height: 90rpx;
		background: $color1;
		border-radius: 4px;
		margin: 60rpx auto;

		color: #fff;
		font-size: 34rpx;
	}

	.upload-content {
		padding: 24upx 0 0 28upx;
		background-color: #fff;
		overflow: hidden;
	}

	.upload-item {
		position: relative;
		float: left;
		width: 150upx;
		height: 150upx;
		margin-right: 30upx;
		margin-bottom: 30upx;

		&:nth-child(4n) {
			margin-right: 0;
		}

		.upload-img {
			width: 100%;
			height: 100%;
			border-radius: 8upx;
		}

		.upload-del-btn {
			position: absolute;
			right: -16upx;
			top: -14upx;
			width: 36upx;
			height: 36upx;
			border: 4upx solid #fff;
			border-radius: 100px;
		}

		.upload-progress {
			position: absolute;
			left: 0;
			top: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.4);
			color: #fff;
			font-size: 24upx;
			border-radius: 8upx;
		}
	}

	.upload-add-btn {
		position: relative;
		float: left;
		width: 150upx;
		height: 150upx;
		z-index: 99;
		border-radius: 8upx;
		background: #f9f9f9;

		&:before,
		&:after {
			content: ' ';
			position: absolute;
			top: 50%;
			left: 50%;
			-webkit-transform: translate(-50%, -50%);
			transform: translate(-50%, -50%);
			width: 4upx;
			height: 60upx;
			background-color: #d6d6d6;
		}

		&:after {
			width: 60upx;
			height: 4upx;
		}

		&:active {
			background-color: #f7f7f7;
		}
	}
</style>

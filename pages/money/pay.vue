<template>
	<view class="app">
		<view class="price-box">
			<text @click="aaaa">支付金额</text>
			<text class="price">{{allNum}}</text>
		</view>

		<view class="pay-type-list">
			<view class="type-item b-b" @click="pay_type='wxpay'">
				<text class="icon yticon icon-weixinzhifu"></text>
				<view class="con">
					<text class="tit">微信支付</text>
					<text>推荐使用微信支付</text>
				</view>
				<view class="iconfont icon-xuanzhong checkbox" :class="{checked : pay_type==='wxpay'}"></view>
			</view>

			<view class="type-item b-b" @click="pay_type='alipay'">
				<text class="icon yticon icon-alipay"></text>
				<view class="con"><text class="tit">支付宝支付</text></view>
				<view class="iconfont icon-xuanzhong checkbox" :class="{checked : pay_type==='alipay'}"></view>
			</view>

			<!-- <view class="type-item">
				<text class="icon yticon icon-erjiye-yucunkuan"></text>
				<view class="con">
					<text class="tit">预存款支付</text>
					<text>可用余额 ¥198.5</text>
				</view>
				<view class="iconfont icon-xuanzhong checkbox "></view>
			</view> -->
		</view>

		<text class="mix-btn" @click="pay">确认支付</text>

	</view>
</template>

<script>
	import {
		payOrder,
		query_order
	} from "@/API/index/index.js"
	export default {
		data() {
			return {
				pay_type: 'alipay',
				orderId: '',

				// 价格 
				allNum: 0

			}
		},
		methods: {
			aaaa() {
				// uni.redirectTo({
				// 	url: '/pages/money/paySuccess?type=no'
				// })
				// this.navTo('/pages/money/paySuccess?type=no')
			},
			payOrderClick() {
				let {
					pay_type,
					orderId
				} = this

				return payOrder({
					pay_type,
					orderId
				})
			},
			async pay() {
				let {
					pay_type,
					orderId
				} = this

				let info = null

				info = await this.payOrderClick()

				console.log(info);


				let orderInfo = info.data.orderInfo

				uni.requestPayment({
					provider: pay_type,
					orderInfo: orderInfo, //微信支付宝的订单数据

					success: function(res) {
						console.log('success:' + JSON.stringify(res));

						query_order({
							order_id: orderId
						}).then(res => {
							console.log(res);
							if (res.code === 1) {
								// VUEX
								this.$store.commit('ORDER')
								
								uni.redirectTo({
									url: '/pages/money/paySuccess?type=yes'
								}),
								this.$store.state.user.cartApi = !this.$store.state.user.cartApi
							} else {
								// VUEX
								this.$store.commit('ORDER')
								
								uni.redirectTo({
									url: '/pages/money/paySuccess?type=no'
								})
								this.$store.state.user.cartApi = !this.$store.state.user.cartApi
							}
						})

					},
					fail: function(err) {
						console.log('fail:' + JSON.stringify(err));
						uni.redirectTo({
							url: '/pages/money/paySuccess?type=no'
						})
						this.$store.state.user.cartApi = !this.$store.state.user.cartApi 
					}
				})




			}
		},
		onLoad(options) {
			console.log(options);
			console.log(options);
			this.orderId = options.orderId
			this.allNum = options.allMoney
		}
	}
</script>

<style lang="scss">
	.app {
		width: 100%;
	}

	.price-box {
		background-color: #fff;
		height: 265upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		color: #909399;

		text {
			font-size: 36rpx;
		}

		.price {
			font-size: 50upx;
			color: $color1;
			margin-top: 12upx;

			&:before {
				content: '￥';
				font-size: 40upx;
			}
		}
	}

	.pay-type-list {
		margin-top: 20upx;
		background-color: #fff;
		padding-left: 60upx;

		.type-item {
			height: 120upx;
			padding: 20upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60upx;
			font-size: 30upx;
			position: relative;
		}

		.icon {
			width: 100upx;
			font-size: 52upx;
		}

		.icon-erjiye-yucunkuan {
			color: #fe8e2e;
		}

		.icon-weixinzhifu {
			color: #36cb59;
		}

		.icon-alipay {
			color: #01aaef;
		}

		.tit {
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 4upx;
		}

		.con {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}

	.mix-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630upx;
		height: 80upx;
		margin: 80upx auto 30upx;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}

	.checkbox {
		color: #d1d1d1;
		font-size: 40upx;

		&.checked {
			color: rgb(250, 67, 106);
		}
	}
</style>

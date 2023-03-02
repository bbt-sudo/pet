<template>
	<view class="">
		<view class="order_tit">
			<scroll-view scroll-x="true" class="scroll">
				<text :class="{act:status==='0'}" @click="status = '0',getOrderListArr=[],getOrderListData()">全部</text>
				<text :class="{act:status==='1'}" @click="status = '1',getOrderListArr=[],getOrderListData()">待付款</text>
				<text :class="{act:status==='2'}" @click="status = '2',getOrderListArr=[],getOrderListData()">待发货</text>
				<text :class="{act:status==='3'}" @click="status = '3',getOrderListArr=[],getOrderListData()">待收货</text>
				<text :class="{act:status==='6'}" @click="status = '6',getOrderListArr=[],getOrderListData()">已完成</text>
				<!-- <text :class="[(params.status == 5||params.status == 4)?'act':'']" data-index="5">售后</text> -->
			</scroll-view>
		</view>

		<view class="order_box">

			<view class="" style="width: 100%;" v-show="!getOrderListArr.length">
				<image src="@/static/zanwu.png" style="margin: auto; display: block;" mode=""></image>
				<view class="" style="text-align: center; font-size: 40rpx;">暂时无订单</view>
			</view>

			<view class="order_list" @click="navTo('/pages/order/order_detail?id='+item._id)"
				v-for="item in getOrderListArr">
				<view class="order_top">
					<text class="order_pa">订单号：{{item.order_sn}}</text>
					<text class="order_pb">{{item.status | status}}</text>
				</view>
				<view class="order_center" v-for="item2 in item.goods">
					<image :src="item2.img"></image>
					<view class="order_good">
						<view class="order_pc">{{item2.name}}</view>
						<view class="order_pd">{{item2.attr}}</view>
						<view class="order_pe">
							<text class="price">¥{{item2.price}}</text>
							<text>x{{item2.num}}</text>
						</view>
					</view>
				</view>
				<view class="order_fee">
					<!-- <text class="order_pf">14:00</text> -->
					<text class="order_pg">
						共 {{item.goods | goods}}件商品 实付款
						<text style="color: #FDD100;font-size: 34rpx;margin-left: 5px;">¥{{item.all_amount}}</text>
					</text>
				</view>

				<template>
					<view class="order_bottom">
						<text data-type="detail">查看详情</text>
						<text v-if="item.status==1" class="act">去付款</text>
						<text v-if="item.status==2" class="act">联系商家</text>
						<text v-if="item.status==3" class="act">确认收货</text>
						<text v-if="item.status==3" class="act">查看物流</text>
						<text v-if="item.status==6" class="act">去评价</text>
						<text v-if="item.status==8" class="act">删除订单</text>

						<!-- <text data-type="shouhuo"  class="act" >确认收货</text> -->
						<!-- <text data-type="del"  >删除订单</text>
						<text data-type="del"  class="act" >删除订单</text>
						<text data-type="del"  >删除订单</text>
						<text data-type="detail"  class="act" >去评价</text> -->
					</view>
				</template>
			</view>
			
		</view>

		<loading :status="loading_status"></loading>
		
		

	</view>
</template>

<script>
	import {
		getOrderList
	} from "@/API/index/index.js"

	// 引入下拉加载组件
	import loading from "@/components/uni-load-more/uni-load-more.vue"

	export default {
		data() {
			return {
				uid: '',
				status: '0',
				// skip: 0,
				limit: 10,

				finishen: false,


				getOrderListArr: [],

				loading_status: 'loading'


			}
		},
		components: {
			loading
		},
		methods: {
			getOrderListData() {

				this.loading_status = 'loading'

				let skip = this.getOrderListArr.length
				console.log(skip);
				let {
					uid,
					status,
					limit,
				} = this
				getOrderList({
					uid,
					status,
					skip,
					limit
				}).then(res => {
					console.log(res);
					this.getOrderListArr.push(...res.data)

					// 关闭下拉刷新
					uni.stopPullDownRefresh();
					
					console.log(this.getOrderListArr.length);
					if (this.getOrderListArr.length >= res.count) {
						this.loading_status = 'noMore'
						this.finishen = true
					} else {
						this.loading_status = 'more'
						this.finishen = false
					}



					// this.getOrderListArr

				})
			}
		},
		filters: {
			goods(goods) {
				return goods.reduce((currn, v) => {
					return currn + v.num
				}, 0)
			},

			status(statu) {

				let status_text = {
					"1": "待付款",
					"2": "待发货",
					"3": "待收货",
					"6": "待评价",
					"7": "已评价",
					"8": "已取消",
				}

				statu = "" + statu
				// console.log(statu);
				// console.log(status_text[statu]);
				return status_text[statu]
			}
		},
		// 触底函数
		onReachBottom() {
			console.log('触底啦');
			if (this.finishen) return

			this.getOrderListData()
		},
		// 下拉刷新
		onPullDownRefresh() {
			// console.log('refresh');
			// setTimeout(function() {
			// 	uni.stopPullDownRefresh();
			// }, 1000);
			this.loading_status = 'loading'
			this.finishen = false
			this.getOrderListArr = []
			
			this.getOrderListData()
		},
		onLoad(options) {
			this.uid = this.$store.state.user.uid

			this.status = options.status

			this.getOrderListData()
		},

		computed: {
			orderRefs() {
				return this.$store.state.user.orderRef
			}
		},
		watch: {
			orderRefs() {
				console.log('监听到了');
				this.getOrderListArr= []
				this.getOrderListData()
			}
		}
	}
</script>

<style lang="scss">
	input::-webkit-input-placeholder {
		color: #ccc;
	}

	input::-moz-input-placeholder {
		color: #ccc;
	}

	input::-ms-input-placeholder {
		color: #ccc;
	}

	// .uni-load-more{

	// 	margin-top: 100upx;
	// }
	.order_ipt {
		width: 580upx;
		height: 30px;
		border: 1px #eee solid;
		border-radius: 20px;
		font-size: 30upx;
		line-height: 30px;
		color: #666;
		padding: 0 10px;
		margin: 7.5px 0;
		text-align: center;
	}

	.order_box {
		width: 100%;
		height: auto;
		overflow: hidden;
		padding: 100rpx 30rpx 20rpx;

		.order_list {
			width: 100%;
			height: auto;
			overflow: hidden;
			background: white;
			border-radius: 16upx;
			margin-top: 30upx;
			padding: 20upx;

			.order_top {
				width: 100%;
				height: auto;
				overflow: hidden;

				image {
					display: block;
					width: 40upx;
					height: 38upx;
					float: left;
					border-radius: 6rpx;
				}

				.order_pa {
					font-size: 28upx;
					color: #333;
					line-height: 38upx;
					float: left;
					margin-left: 16upx;
				}

				.order_pb {
					font-size: 24upx;
					line-height: 38upx;
					color: $color1;
					float: right;
				}
			}

			.order_center {
				width: 100%;
				height: auto;
				overflow: hidden;
				margin-top: 24upx;

				image {
					display: block;
					width: 200upx;
					height: 200upx;
					float: left;
				}

				.order_good {
					width: calc(100% - 200upx);
					height: 200rpx;
					padding-left: 20upx;
					overflow: hidden;
					display: flex;
					flex-wrap: wrap;
					justify-content: space-between;

					.order_pc {
						font-size: 24upx;
						color: #000000;
						height: 76upx;
						width: 100%;
						line-height: 36upx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
					}

					.order_pd {
						font-size: 24upx;
						color: #999999;
						margin-top: 16upx;
						display: block;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					.order_pe {
						font-size: 32upx;
						color: $color1;
						font-weight: bold;
						display: flex;
						width: 100%;
						justify-content: space-between;
						align-items: center;

						text {
							color: #999999;
							font-size: 24upx;
							font-weight: normal;
						}

						.price {
							color: $color1;
						}
					}
				}
			}

			.order_fee {
				width: 100%;
				height: 50rpx;
				overflow: hidden;
				line-height: 50rpx;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				margin-top: 8px;

				.order_pf {
					font-size: 24upx;
					display: block;
					float: left;
					line-height: 29upx;
					color: #999999;
				}

				.order_pg {
					font-size: 24upx;
					display: block;
					float: right;
					line-height: 29upx;
					color: #999999;
				}
			}

			.order_bottom {
				width: auto;
				height: auto;
				float: right;
				margin-top: 16upx;
				overflow: hidden;

				text {
					display: inline-block;
					min-width: 130upx;
					height: 48upx;
					background: rgba(255, 255, 255, 1);
					border: 1px solid rgba(191, 191, 191, 1);
					opacity: 1;
					border-radius: 30upx;
					font-size: 24upx;
					text-align: center;
					padding: 0 17upx;
					line-height: 48upx;
					margin-left: 24upx;
				}

				.act {
					color: white;
					background: $color1;
					border: 1px solid $color1;
				}
			}
		}
	}

	.icon-sousuo11 {
		font-size: 40upx;
		color: #999999;
	}

	.icon-fanhui11 {
		font-size: 32upx;
	}

	.order_tit {
		width: 100%;
		height: 87upx;
		position: fixed;
		left: 0;
		z-index: 22;
		background: white;

		.scroll {
			height: 87upx;

			text {
				display: block;
				width: 20%;
				height: auto;
				line-height: 87upx;
				float: left;
				text-align: center;
				font-size: 28upx;
				position: relative;
				color: #999999;
			}

			.act {
				color: $color1;

				&:before {
					content: '';
					width: 64upx;
					height: 8upx;
					background: $color1;
					border-radius: 80upx;
					position: absolute;
					left: 0;
					right: 0;
					bottom: 0;
					margin: auto;
				}
			}
		}
	}
</style>

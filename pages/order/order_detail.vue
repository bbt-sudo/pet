<template>
	<view class="">
		<view>
			<view>
				<block>
					<view class="order_tit">
						<text class="item.icon"></text>
						<text class="order_yy"></text>
					</view>
				</block>
				         
			</view>
			<view class="order_addr">
				<text class="iconfont icon-ditu_dingwei"></text>
				<view class="order_addrBox">
					<text class="order_name">
						收货人：{{address.name}}
						<text>{{address.tel}}</text>
					</text>
					<text class="order_dizhi">{{address.addr_text+address.detail}}</text>
				</view>
			</view>
			<view class="order_good">
				<block v-for="item in orderArr.goods">
					<view class="order_list" >
						<view class="info">
							<image :src="item.img"></image>
							<view class="order_goodBox">
								<view class="order_goodName">{{item.name}}</view>
								<view class="order_goodAttr">{{item.attr}}</view>
								<view class="order_price">
									<text class="order_jq">¥{{item.price}}</text>
									<text class="order_num">x{{item.num}}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="order_btn" v-if="orderArr.status == 6">
						<!-- 	<text :data-img="item.thumb" :data-id="item._id" :data-name="item.title" :data-attr="item.attr"
						 :data-price="item.price" :data-num="item.num" @click="tuikuan" v-if="item.status == 2">退款</text> -->
						<text class="act" @click="saveOrder(item)">评价</text>
					</view>
				</block>
				
			</view>
			<view class="order_cont">
				<view class="order_contBox">
					<text class="order_contPa">商品总额</text>
					<text class="order_contPb">¥{{orderArr.all_amount}}</text>
				</view>
				<view class="order_contBox">
					<text class="order_contPa">运费</text>
					<text class="order_contPb">{{ orderArr.shipping }}</text>
				</view>
				<view class="order_contBox">
					<text class="order_contPa">优惠</text>
					<text class="order_contPb">{{ orderArr.reduction }}</text>
				</view>
				<view class="order_contFinal">
					<text class="order_contPa">应付金额</text>
					<text class="order_contPb">¥{{orderArr.all_amount}}</text>
				</view>
			</view>

			<view class="order_main">
				<text class="order_mainTit">订单信息</text>
				<view class="order_mainBox">
					<text class="order_mainPa">下单时间</text>
					<text class="order_mainPb">{{orderArr.update_time | time}}</text>
				</view>
				<view class="order_mainBox">
					<text class="order_mainPa">订单编号</text>
					<text class="order_mainPb">{{orderArr.order_sn}}</text>
				</view>

				<!-- 这三个 交完钱才会有 -->
				<view v-if="orderArr.pay_time&&orderArr.transactionId">
					<view class="order_mainBox">
						<text class="order_mainPa">付款金额</text>
						<text class="order_mainPb">{{orderArr.all_amount}} 元</text>
					</view>
					<view class="order_mainBox">
						<text class="order_mainPa">支付方式</text>
						<text class="order_mainPb">{{orderArr.pay_type | pay_type}}</text>
					</view>
					<view class="order_mainBox">
						<text class="order_mainPa">支付时间</text>
						<text class="order_mainPb">{{orderArr.pay_time | time}}</text>
					</view>
				</view>

				<!-- 这两个发货后才有 -->
				<view v-if="orderArr.express_no">

					<view class="order_mainBox">
						<text class="order_mainPa">物流公司</text>
						<text class="order_mainPb">{{orderArr.express_com | express_com}}</text>
					</view>
					<view class="order_mainBox">
						<text class="order_mainPa">物流单号</text>
						<text class="order_mainPb">{{orderArr.express_no}}</text>
					</view>
				</view>
				<view class="order_mainBox">
					<text class="order_mainPa">订单备注</text>
					<text class="order_mainPb">{{orderArr.desc || '无订单备注'}}</text>
				</view>
				<view class="order_mainBox" v-if="orderArr.status === 8">
					<text class="order_mainPa">取消原因</text>
					<text class="order_mainPb">{{orderArr.cancel_text }}</text>
				</view>
			</view>
			<view class="order_finals">

				<!-- ######################  不要删除 -->


				<view class="order_finalsRight" v-if="orderArr.status === 1">
					<text @click="cancelOrder">取消订单</text>
					<text class="act" @click="goPay">去付款</text>
				</view>


				<view class="order_finalsRight" v-if="orderArr.status === 2">
					<text class="act" @click="sendOrder">模拟发货</text>
				</view>

				<view class="order_finalsRight" v-if="orderArr.status === 3">
					<!-- <text>查看详情</text> -->
					<text class="act" @click="shou_huo">确认收获</text>
					<text class="act" @click="wuliuKan">查看物流</text>
				</view>

				<view class="order_finalsRight" v-if="orderArr.status === 6">
					<!-- <text class="act">联系客服</text> -->
				</view>

				<view class="order_finalsRight" v-if="orderArr.status === 7">
					<text class="act">联系客服</text>
				</view>

				<view class="order_finalsRight" v-if="orderArr.status === 8">
					<text @click="delOrder">删除订单</text>
				</view>



				<view class="order_finalsLeft" @click="call">
					<view class="order_finalBox">
						<text class="iconfont icon-dianhua"></text>
						<text class="order_finalPa">联系客服</text>
					</view>
				</view>




				<!-- ###################### -->
			</view>
		</view>

		<!-- 		<tui-bottom-popups style="display: none;">
			
		</tui-bottom-popups> -->


		<!-- 取消订单 -->
		<u-popup :show="show" @close="close">
			<view class="tui-popup-box">
				<view>请您填写一下取消原因：</view>
				<input type="text" v-model="cancel_text" placeholder="请输入" />

				<view class="button_wrap">
					<button type="default" @click="closeNO">取消</button>
					<button type="primary" @click="openOK">确定</button>
				</view>
			</view>
		</u-popup>

		<!-- 确认收获弹窗 -->
		<u-modal :show="okShow" @cancel="cancel" @confirm="confirm" :showCancelButton='true' :title="title"
			:content='content'></u-modal>
			
			
			
			
	</view>
</template>

<script>
	import {
		getOrderDetail,
		cancel_order,
		del_order,
		send,
		shouhuo,
		saveOrderEvaluateAdd
	} from "@/API/index/index.js"

	import {
		timeFormat
	} from '@/utils/timeform.js'
	

	export default {
		data() {
			return {
				orderId: '',
				uid: '',
				address: {},
				orderArr: {},
				// 取消原因
				cancel_text: '',
				// 取消的弹出层
				show: false,

				// 确认收获
				okShow: false,
				title: '提示',
				content: '确定收货吗'
			}
		},
		
		methods: {
			// 进来请求的数据
			getOrderDetailData() {
				let {
					orderId,
					uid
				} = this
				getOrderDetail({
					orderId,
					uid
				}).then(res => {
					// console.log(res);
					this.orderArr = res.data[0]

					this.address = res.data[0].address
					console.log(this.orderArr);
				})
			},

			// 取消订单
			cancelOrder() {
				this.show = true
			},
			// 确认调接口
			openOK() {
				let {
					orderId,
					cancel_text
				} = this

				cancel_order({
					orderId,
					cancel_text
				}).then(res => {
					console.log(res);
					this.show = false
					if(res.code===1){
						uni.$u.toast(res.msg)
						// 再次调用下接口
						this.getOrderDetailData()
						// 调用VUEX方法 让订单页面更新
						this.$store.commit('ORDER')
					}
					

					
				})
			},
			// 取消
			close() {
				this.show = false
				// console.log('close');
			},
			closeNO() {
				this.show = false
				// console.log('close');
			},
			// 删除订单 
			delOrder() {
				uni.$u.toast('暂时不能删除哦')
			},
			// 去付款
			goPay() {
				let {
					all_amount,
					_id
				} = this.orderArr
				this.navTo(`/pages/money/pay?orderId=${_id}&allMoney=${all_amount}`)
			},
			// 发货
			sendOrder() {
				let {
					orderId
				} = this
				let express_com = "YTO"
				let express_no = '778899123456789'
				send({
					orderId,
					express_com,
					express_no
				}).then(res => {
					// console.log(res);
					if (res.code === 1) {
						uni.$u.toast('发货成功')
						this.getOrderDetailData()
						// VUEX
						this.$store.commit('ORDER')
					} else {
						uni.$u.toast('发货失败')
					}
				})
			},
			// 查看物流
			wuliuKan() {
				console.log(123456789);
				this.navTo('/pages/order/wuliu?express_com=YTO&express_no=778899123456789')
			},
			// 确认收获
			shou_huo() {
				this.okShow = true
			},
			confirm() {
				let {
					orderId
				} = this
				shouhuo({
					orderId
				}).then(res => {
					if (res.code === 1) {
						this.okShow = false
						this.getOrderDetailData()
						
						// VUEX
						this.$store.commit('ORDER')
					}
				})
			},
			cancel() {
				// console.log(111);
				this.okShow = false
			},
			// 评价
			saveOrder(items){
				
				console.log(JSON.stringify(items));
				// VUEX
				this.$store.commit('ORDER')
				
				this.navTo(`/pages/order/comment?orderId=${this.orderId}&item=${encodeURIComponent(JSON.stringify(items))}`)
			},
			
			call(){
				uni.makePhoneCall({
					phoneNumber: '15660123801' //仅为示例
				});
			}

		},
		filters: {
			// 状态
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
			},
			// 时间转换
			time(val) {
				return timeFormat(val)
			},
			// 快递
			express_com(val) {
				let express_data = {
					"HTKY": "百世快递",
					"STO": "申通快递",
					"YTO": "圆通速递",
					"HHTT": "天天快递"
				}

				// console.log(val);

				return express_data[val]
			},
			// 支付方式
			pay_type(val) {
				if (val == "alipay") {
					return '支付宝'
				} else {
					return '微信'
				}
			}
		},
		onLoad(options) {
			this.orderId = options.id
			this.uid = this.$store.state.user.uid

			this.getOrderDetailData()
			
		}
	}
</script>

<style lang="scss">
	.popover_tit {
		width: 100%;
		height: auto;
		overflow: hidden;
		position: relative;

		&:before {
			content: '';
			position: absolute;
			left: 30upx;
			right: 30upx;
			bottom: 0;
			background: #eeeeee;
			transform: scaleY(0.5);
			height: 1px;
		}

		.popover_bt {
			font-size: 32upx;
			font-weight: 500;
			line-height: 90upx;
			display: block;
			text-align: center;
		}

		.iconfont {
			position: absolute;
			right: 30upx;
			top: 0;
			bottom: 0;
			margin: auto;
			color: #666;
			font-size: 42upx;
			line-height: 90upx;
		}
	}

	.tui-popup-scroll {
		max-height: 342upx;
	}

	.popover_main {
		width: 100%;
		height: auto;
		overflow: hidden;
		padding: 0 30upx;

		.popover_choose {
			width: 100%;
			height: auto;
			overflow: hidden;
			border-bottom: 1px #eeeeee solid;

			.iconfont {
				font-size: 36upx;
				line-height: 100upx;
				display: block;
				float: left;
				width: 36upx;
				height: 36upx;
			}

			.popover_reason {
				display: block;
				float: left;
				margin-left: 24upx;
				font-size: 30upx;
				color: #000000;
				line-height: 100upx;
			}
		}

		.act .iconfont:before {
			content: '\E655';
			color: $color1;
		}
	}

	.popover_btn {
		width: 100%;
		height: 100upx;
		background: white;
		border: 1px solid #f12435;
		color: #f12435;
		margin-top: 30upx;
		font-size: 32upx;
		// color: white;
		text-align: center;
		line-height: 100upx;
	}

	.order_tui {
		width: 100%;
		height: auto;
		background: white;
		overflow: hidden;

		.order_tuiTit {
			font-size: 30upx;
			border-bottom: 1px #eeeeee solid;
			font-weight: bold;
			line-height: 100upx;
			padding: 0 30upx;
			display: block;
			overflow: hidden;
		}

		.order_tuiBox {
			width: 100%;
			height: auto;
			overflow: hidden;
			padding: 0 30upx;
			border-bottom: 1px solid rgba(238, 238, 238, 1);

			.order_tuiPa {
				font-size: 30upx;
				color: #333333;
				line-height: 100upx;
				float: left;
				display: block;
				width: 160upx;
			}

			.order_tuiPb {
				font-size: 30upx;
				color: #333333;
				line-height: 100upx;
				float: left;
				display: block;
				width: calc(100% - 160upx);
			}

			.order_tuiImgBox {
				width: auto;
				height: auto;
				float: left;
				margin: 30upx 0;
				overflow: hidden;

				image {
					display: block;
					width: 176upx;
					height: 176upx;
					border-radius: 20upx;
				}

				text {
					display: block;
					text-align: center;
					font-size: 30upx;
					color: #e33b2d;
					margin-top: 24upx;
				}
			}
		}
	}

	.order_finals {
		width: 100%;
		height: 100upx;
		padding: 0 10px;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.04);
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 22;
		display: flex;
		justify-content: space-between;
		flex-direction: row-reverse;

		.order_finalsLeft {
			width: 190rpx;
			height: 100rpx;
			overflow: hidden;

			.order_finalBox {
				height: 100rpx;
				overflow: hidden;
				display: flex;
				align-items: center;
				align-items: center;

				.iconfont {
					display: block;
					text-align: center;
					font-size: 42upx;
					color: $color1;
					margin-top: 10upx;
					margin-right: 5px;
				}

				.order_finalPa {
					font-size: 24upx;
					display: block;
					text-align: center;
					margin-top: 5upx;
				}
			}
		}

		.order_finalsRight {
			width: auto;
			height: auto;
			float: right;
			overflow: hidden;

			text {
				width: 130upx;
				height: 56upx;
				background: rgba(255, 255, 255, 1);
				border: 1px solid rgba(191, 191, 191, 1);
				border-radius: 80upx;
				font-size: 24upx;
				line-height: 56upx;
				text-align: center;
				margin-top: 20upx;
				margin-right: 20upx;
				display: inline-block;
			}

			.act {
				background: $color1;
				border: 1px solid $color1;
				color: white;
			}
		}
	}

	.order_final {
		width: 100%;
		height: 100upx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.04);
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 22;

		.order_finalBox {
			width: 50%;
			height: 100upx;
			float: left;
			position: relative;

			&:nth-child(1):before {
				content: '';
				position: absolute;
				width: 1upx;
				height: 60upx;
				background: #eeeeee;
				right: 0;
				top: 0;
				bottom: 0;
				margin: auto;
			}

			text {
				font-size: 32upx;
				color: #333333;
				line-height: 100upx;
				text-align: center;
				display: block;

				text {
					display: inline-block;
					font-size: 56upx;
					color: #666666;
					margin-right: 24upx;
					vertical-align: middle;
				}
			}
		}
	}

	.order_main {
		width: 100%;
		height: auto;
		overflow: hidden;
		padding: 0 30rpx 140rpx 30rpx;
		background: white;
		margin-top: 20rpx;

		.order_mainTit {
			display: block;
			font-size: 32upx;
			line-height: 38upx;
			padding: 30upx 0;
			border-bottom: 1px #eeeeee solid;
		}

		.order_mainBox {
			width: 100%;
			height: auto;
			overflow: hidden;
			margin-top: 30upx;

			.order_mainPa {
				font-size: 24upx;
				color: #999999;
				line-height: 29upx;
				display: block;
				width: 120upx;
				float: left;
			}

			.order_mainPb {
				font-size: 24upx;
				color: #999999;
				line-height: 29upx;
				display: block;
				width: calc(100% - 120upx);
				float: left;
			}
		}
	}

	.order_cont {
		width: 100%;
		height: auto;
		overflow: hidden;
		margin-top: 20upx;
		padding: 30upx;
		background: white;

		.order_contBox {
			width: 100%;
			height: auto;
			padding: 10upx 0;
			overflow: hidden;

			.order_contPa {
				font-size: 24upx;
				color: #999999;
				line-height: 45upx;
				float: left;
				display: block;
			}

			.order_contPb {
				font-size: 24upx;
				color: #000000;
				line-height: 45upx;
				float: right;
				display: block;
			}
		}

		.order_contFinal {
			width: 100%;
			height: auto;
			padding: 10upx 0;
			overflow: hidden;

			.order_contPa {
				font-size: 28upx;
				color: #333333;
				line-height: 45upx;
				float: left;
				display: block;
			}

			.order_contPb {
				font-size: 32upx;
				color: $color1;
				line-height: 45upx;
				font-weight: bold;
				float: right;
				display: block;
			}
		}
	}

	.order_good {
		width: 100%;
		height: auto;
		overflow: hidden;
		background: white;
		padding: 0 30upx;

		.order_shop {
			width: 100%;
			height: auto;
			border-bottom: 1px #eeeeee solid;
			padding: 40upx 0 26upx;
			overflow: hidden;

			image {
				display: block;
				width: 40upx;
				height: 38upx;
				float: left;
			}

			text {
				font-size: 28upx;
				color: #333333;
				line-height: 38upx;
				display: block;
				float: left;
				margin-left: 16upx;
			}
		}

		.order_list {
			width: 100%;
			height: auto;
			margin-top: 30upx;
			display: flex;
			justify-content: space-between;
			padding-bottom: 20upx;
			border-bottom: 1px solid #f2f2f2;

			.info {
				margin-right: 10upx;
				display: flex;
				justify-content: flex-start;
				flex: 1 1 auto;
			}

			image {
				display: block;
				width: 200upx;
				height: 200upx;
				flex: 0 0 auto;
			}

			.order_goodBox {
				display: flex;
				height: 200upx;
				padding-left: 20upx;
				flex-wrap: wrap;
				flex: 1;
				align-content: space-between;

				.order_goodName {
					width: 100%;
					height: 88upx;
					font-size: 24upx;
					line-height: 44upx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}

				.order_goodAttr {
					font-size: 24upx;
					color: #999999;
					line-height: 40rpx;
					justify-self: flex-start;
				}
			}

			.order_price {
				display: flex;
				width: 100%;
				justify-content: space-between;
				align-items: center;

				.order_jq {
					font-size: 32upx;
					font-weight: bold;
					line-height: 45upx;
					color: $color1;
				}

				.order_num {
					font-size: 24upx;
					color: #999999;
				}
			}
		}

		.order_btn {
			overflow: hidden;
			float: right;
			width: auto;
			margin-top: 30upx;
			padding-bottom: 30upx;

			text.act {
				border: 1px solid $color1;
				color: #fff;
				background: $color1;
			}

			text {
				display: block;
				width: 130upx;
				height: 48upx;
				background: rgba(255, 255, 255, 1);
				border: 1px solid rgba(191, 191, 191, 1);
				border-radius: 30upx;
				line-height: 48upx;
				color: #333333;
				text-align: center;
				font-size: 24upx;
				float: right;
				margin-left: 30upx;
			}
		}
	}

	.order_addr {
		width: 100%;
		height: auto;
		padding: 40upx 30upx 20upx 30upx;
		background: white;
		position: relative;
		overflow: hidden;

		&:before {
			content: '';
			position: absolute;
			height: 1px;
			background: #eeeeee;
			left: 30upx;
			right: 30upx;
			bottom: 0;
			transform: scaleY(0.5);
		}

		.iconfont {
			color: #999999;
			font-size: 36upx;
			float: left;
			display: block;
		}

		.order_addrBox {
			width: calc(100% - 50upx);
			height: auto;
			float: left;
			overflow: hidden;
			padding-left: 20upx;

			.order_name {
				font-size: 28upx;
				display: block;
				color: #000000;
				line-height: 40upx;

				text {
					margin-left: 24upx;
					font-size: 28upx;
					color: #333333;
				}
			}

			.order_dizhi {
				display: block;
				font-size: 28upx;
				color: #999999;
				line-height: 34upx;
				margin-top: 11upx;
			}
		}
	}

	.order_tit {
		width: 100%;
		height: auto;
		overflow: hidden;
		padding: 0 30upx;
		background: linear-gradient(90deg, #fdd100 0%, #fa416a 100%);

		.yticon,
		.iconfont {
			font-size: 36upx;
			line-height: 104upx;
			display: block;
			float: left;
			color: white;
		}

		.order_yy {
			font-size: 32upx;
			margin-left: 20upx;
			line-height: 104upx;
			color: white;
			display: block;
			float: left;
		}

		.tui-countdown {
			font-size: 28upx;
			line-height: 104upx;
			float: right;

			.time {
				color: #fff;
				margin-right: 16upx;
			}
		}
	}

	.tui-popup-box {
		padding: 40rpx;

		.label {
			line-height: 40rpx;
			font-size: 32rpx;
			color: #333;
		}

		input {
			border: 1px solid #eee;
			border-radius: 5px;
			margin: 15px 0;
			line-height: 68rpx;
			height: 68rpx;
			font-size: 13px;
		}

		.button_wrap {
			display: flex;
			align-items: center;
			justify-content: space-around;
		}

		button {
			width: 260rpx;
		}
	}
</style>

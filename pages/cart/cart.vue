<template>
	<scroll-view scroll-y class="container">
		<view class="content-wrap">
			<view class="" v-show="!cartList.length">
				<!-- 56113215631235 -->
				<image src="@/static/gouwu.png" style="width: 100%;" mode=""></image>
				<view class="" style="font-size: 35rpx; text-align: center;color:blue;">
					您的购物车为空
				</view>
			</view>
			<view class="content-item">
				<view class="goods" v-for="(item,index) in cartList">
					<label :class="item.checked?'act':''" @click="toggleStatus(index)"><text
							class="iconfont icon-danxuan-weixuan"></text></label>
					<view class="good">
						<view class="img-wrapper">
							<image :src="item.img" mode=""></image>
						</view>
						<view class="good-content">
							<view class="good-title text-line">{{item.name}}</view>
							<view class="spec">
								<view class="spec1"><text class="name ellipsis">{{item.attr}}</text></view>
							</view>
							<view class="good-desc">
								<view class="good-price">
									<text>￥</text>
									{{item.price}}
								</view>
								<!-- item.num -->
								<u-number-box :value="item.num==1?1:5" name="11111" :min='item.num>0 ? 0:1' max="30" v-model="item.num"
									@change="valChange($event,index,item._id)">

									<view class="" slot="input" style="width: 60rpx; text-align: center;">
										{{item.num}}
									</view>

								</u-number-box>
							</view>
						</view>
					</view>
				</view>


			</view>
		</view>
		<view class="total-wrap">
			<view class="total-left">
				<label class="" :class="allChecked?'act':''" @click="allCheckedMethod">
					<text class="iconfont icon-danxuan-weixuan"></text>
					全选
				</label>

				<view class="total-con">
					<view class="top-con">
						合计:
						<text class="symbol">￥</text>
						<text class="total">{{allNum}}</text>
					</view>
				</view>
			</view>

			<view class="total-right" @click="purchase">购买</view>
		</view>
		<!-- 删除 -->
		<u-modal :show="show" :title="title" @confirm="confirm" @cancel="cancel" :showCancelButton='true'
			:content='content'></u-modal>
	</scroll-view>
</template>

<script>
	import numberBox from '@/components/numberbox/numberbox.vue';

	import {
		get_cart_list,
		toggle_check_cart,
		change_cart_num,
		check_cart,
		cancel_cart,
		remove_cart
	} from '@/API/index/index.js'
	export default {
		components: {
			numberBox
		},
		data() {
			return {
				// 渲染数据
				cartList: [],


				// 总价
				allNumSend: 0,


				show: false,

				title: '提示',
				content: '确定删除吗？',


				num: 1,

				_id: ''


			};
		},
		onLoad() {
			this.getCartList()


		},

		methods: {
			numberChange() {},

			getCartList() {
				// console.log(this.$store.state.user.cartApi);
				let uid = this.$store.state.user.uid
				get_cart_list({
					uid
				}).then(res => {
					console.log(res);
					this.cartList = res.data
					// console.log(res.data._id);

					// this._id = res.data._id
				})
			},

			// 购物车切换状态
			toggleStatus(index) {
				// console.log(this.cartList[index]._id);
				let checked = this.cartList[index].checked
				let _id = this.cartList[index]._id

				toggle_check_cart({
					_id,
					checked
				}).then(res => {
					console.log(res);
					this.cartList[index].checked = !checked;
				})

				this.cartList.forEach(v => {
					if (v.checked) {

					} else {

					}
				})

			},

			// 修改数量
			valChange(e, index, id) {



				console.log(e);
				console.log(id);
				
				// if(e.value <=0){
				// 	e.value = 2
				// 	console.log(e.value);
				// }

				// this.num = e.value
				this._id = id


				console.log(this.cartList);


				if (e.value == 0) {
					// console.log(111);

					// console.log(this.cartList[index].num);

					// if(this.cartList[index].num == 1){
					// 	console.log(1112223333333333333);
					// 	this.cartList[index].num = 1
					// }


					this.show = true

					return
				}




					let num = e.value
				// let {
				// 	num
				// } = this
				// console.log(this.cartList[index].num);
				// let num = this.cartList[index].num
				let _id = this.cartList[index]._id
				change_cart_num({
					num,
					_id
				}).then(res => {
					console.log(res);
				})


			},

			// 全选 
			allCheckedMethod() {
				let allcheck = this.allChecked

				if (!allcheck) {
					check_cart({
						_id: this.cartList.map(v => v._id)
					}).then(res => {
						console.log(res);
					})
				} else {
					cancel_cart({
						_id: this.cartList.map(v => v._id)
					}).then(res => {
						console.log(res);
					})
				}

				this.cartList.forEach(item => {
					item.checked = !allcheck
				})
			},

			// 购买
			purchase() {
				let transfer = []
				this.cartList.forEach(v => {
					if (v.checked) {
						transfer.push(v._id)
					}
				})
				console.log(transfer);

				this.navTo(`/pages/order/createOrder?cart_id=${transfer}&num=${this.allNum}`)


			},
			// 确定
			confirm() {

				this.deleteShan()

				// this.num = 1
				this.show = false
			},
			// 取消
			cancel() {

				// this.num = 1
				this.show = false


			},


			// 删除 
			deleteShan() {
				let {
					_id
				} = this
				remove_cart({
					_id
				}).then(res => {
					console.log(res);
					if (res.code == 1) {

						uni.$u.toast(res.msg)
						this.getCartList()
					}

				})
			}
		},
		computed: {
			// 全选单选
			allChecked() {
				if (this.cartList.length) {
					return this.cartList.every(v => v.checked)
				} else {
					return false
				}
			},
			// 算价格
			allNum() {
				return this.cartList.reduce((current, v) => {
					if (v.num == 0) {
						v.num = 1
					}
					if (v.checked) {
						// console.log(111222333);
						console.log(Number(v.price));
						current += Number(v.price) * v.num
					}
					// console.log(current);
					return current
					// console.log(current);
				}, 0)
			},

			vuexCart() {
				return this.$store.state.user.cartApi
			}
		},
		watch: {
			vuexCart(n, o) {
				// console.log(n,o);
				// console.log(11111);
				this.getCartList()
			}
		}
	};
</script>

<style lang="scss">
	page {
		width: 100%;
		height: calc(100% - 110upx);
		background: #f5f5f5;

		.container {
			width: 100%;
			height: 100%;
			overflow: hidden;

			.header {
				position: relative;
				width: 100%;
				height: 360upx;
				background: #fc7827;
				background-size: cover;
				overflow: hidden;
				/*  #ifndef  APP-PLUS  */
				height: 280upx;
				background-size: 100% 100%;

				/*  #endif  */
				.title-contents {
					position: fixed;
					top: 0;
					width: 100%;
					height: calc(var(--status-bar-height) + 88upx);
					z-index: 100008;

					.top-view {
						width: 100%;
						height: var(--status-bar-height);
						background: #fc7827;
					}

					.titles {
						display: flex;
						flex-direction: row;
						height: 88upx;
						background: #fc7827;

						.titleLeftButton {
							width: 88upx;
							height: 88upx;
							line-height: 88upx;
							text-align: center;

							image {
								width: 40upx;
								height: 40upx;
							}
						}

						.titleText {
							width: 574upx;
							line-height: 88upx;
							text-align: center;
							font-size: 36upx;
							color: #fff;
						}

						.titleRightButton {
							width: 88upx;
							height: 88upx;
							line-height: 88upx;
							text-align: center;
							font-size: 32upx;
							color: #fff;
						}
					}
				}
			}

			.content-wrap {
				margin-top: 20upx;
				margin-left: 24upx;
				width: 702upx;

				//
				.content-item {
					margin-bottom: 20upx;
					border-radius: 20upx;
					background: #fff;
				}

				.goods {
					display: flex;
					justify-content: space-between;
					margin-bottom: 20upx;

					&:last-child {
						margin-top: 0;
					}

					label {
						margin-left: 20upx;
						line-height: 214upx;

						.iconfont {
							font-size: 46upx;
							color: #bbb;
						}

						&.act .iconfont {
							color: $theme-color;

							&::before {
								content: '\e617';
							}
						}
					}

					.good {
						display: flex;
						justify-content: space-between;
						width: 624upx;
						padding: 20upx 0 0;
						box-sizing: border-box;
						border-bottom: 1px solid #eee;

						.img-wrapper {
							width: 180upx;
							height: 180upx;

							image {
								width: 100%;
								height: 100%;
							}
						}

						.good-content {
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							width: 440upx;
							height: 180upx;
							padding: 0 20upx;
							box-sizing: border-box;

							.good-title {
								font-size: 28upx;
								color: #111;
							}

							.spec {
								display: flex;
								flex-direction: row;

								.spec1 {
									display: flex;
									flex-direction: row;
									align-items: center;
									padding: 0 16upx;
									box-sizing: border-box;
									width: 100%;
									height: 40upx;
									border-radius: 8upx;
									//

									.name {
										display: inline-block;
										// width: 85%;
										padding: 0 15upx;
										line-height: 40upx;
										font-size: 24upx;
										color: #666;
										background: #f6f6f6;
									}

									.iconfont {
										color: #999;
									}
								}
							}

							.good-desc {
								display: flex;
								justify-content: space-between;

								.good-price {
									line-height: 38upx;
									color: #fb5248;
									font-size: 30upx;
								}
							}
						}
					}
				}
			}

			.total-wrap {
				position: fixed;
				display: flex;
				justify-content: space-between;
				width: 100%;
				height: 100upx;
				line-height: 100upx;
				background: #fff;
				z-index: 9;
				/*  #ifndef  H5  */
				bottom: 0px;
				/*  #endif  */
				/*  #ifdef  H5  */
				bottom: 50px;
				/*  #endif  */

				.total-left {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					padding-left: 20upx;
					width: 490upx;
					height: 100%;
					color: #333;
					box-sizing: border-box;

					label {
						font-size: 28upx;
						display: flex;
						align-items: center;

						.iconfont {
							font-size: 46upx;
							color: #bbb;
							margin-right: 5px;
						}

						&.act .iconfont {
							color: $theme-color;

							&::before {
								content: '\e617';
							}
						}
					}

					.total-con {
						display: flex;
						flex-direction: column;
						margin-right: 20upx;

						.top-con {
							display: flex;
							flex-direction: row;
							line-height: 100upx;
							font-size: 30upx;
							color: #333;

							.freight {
								margin-right: 16upx;
								font-size: 22upx;
								color: #999;
							}

							.symbol {
								font-size: 24upx;
								color: #fc511f;
							}

							.total {
								color: #fc511f;
							}
						}

						.bottom-con {
							display: flex;
							flex-direction: row;
							line-height: 36upx;
							font-size: 22upx;

							.discounts {
								color: #fb5248;
								margin-right: 16upx;
							}

							.detail {
								color: #666;
							}

							.iconfont {
								font-size: 14px;
							}
						}
					}
				}

				.total-right {
					width: 200upx;
					height: 80upx;
					line-height: 80upx;
					margin-top: 10upx;
					margin-right: 20upx;
					background: #fc511f;
					color: #fff;
					text-align: center;
					font-size: 28upx;
					border-radius: 40upx;
				}
			}

			.mask {
				position: fixed;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				background: rgba(0, 0, 0, 0.5);
				z-index: 10009;
			}

			.mask-content {
				position: fixed;
				left: 0;
				right: 0;
				bottom: 0;
				height: 510upx;
				background: #fff;
				z-index: 10009;

				.head {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					padding: 0 25upx;
					box-sizing: border-box;
					height: 110upx;

					.title {
						position: relative;
						padding-left: 20upx;
						box-sizing: border-box;
						line-height: 110upx;
						font-size: 32upx;
						color: #010101;
						font-weight: bold;

						&::before {
							position: absolute;
							left: 0;
							top: 40upx;
							content: ' ';
							width: 6upx;
							height: 30upx;
							background: blue;
						}

						text {
							margin-left: 20upx;
							font-weight: normal;
							font-size: 24upx;
							color: #666;
						}
					}

					image {
						width: 30upx;
						height: 30upx;
					}
				}

				.holder {
					color: #999;
				}

				.list {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					margin: 0 auto;
					width: 700upx;
					height: 70upx;

					// border-bottom: 1px solid #eee;
					text {
						font-size: 28upx;
						color: blue;

						text {
							margin-left: 20upx;
							font-size: 24upx;
							color: #666;
						}
					}
				}

				.footer {
					position: absolute;
					bottom: 0;
					width: 100%;
					line-height: 94upx;
					color: blue;
					background: blue;
					text-align: center;
					font-size: 34upx;
				}
			}
		}
	}
</style>

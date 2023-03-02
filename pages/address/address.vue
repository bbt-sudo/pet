<template>
	<view class="page-user">
		<view class="address-list">
			<radio-group>
				<view class="addr-list" v-for="(item,index) in addressData">
					<view class="list-con">
						<view class="tops flex-row">
							<text class="name">{{item.name}}</text>
							<text class="phone">{{item.tel}}</text>
							<!-- <view class="moren-defalut" :class="item.is_default == 1 ?'':'hide'">默认</view> -->
						</view>
						<view class="address">{{item.addr_text + item.detail}}</view>
						<view class="arrow"><text class="iconfont icon-fanhui1"></text></view>
					</view>

					<view class="list-btm flex-row-between">
						<view class="moren" :class="{act:item.is_default}" @click="defaultAddress(item._id,index)">
							<text class="iconfont icon-yuanquan"></text>
							默认地址
						</view>

						<view class="caozuo" @click="compileAddress(item._id)">
							<text class="yticon icon-bianji" style="font-size: 14px;"></text>
							<text><text class="shanchu">编辑</text></text>
						</view>

						<view class="caozuo" @click="delAddr(item._id)">
							<text class="yticon icon-iconfontshanchu1"></text>
							<text><text class="shanchu">删除</text></text>
						</view>

					</view>
				</view>
			</radio-group>
			<view class="empty act" v-show="!addressData.length">
				<text class="iconfont icon-zanwushuju"></text>
				<view class="cont">您还没有收货地址</view>
			</view>
			<view class="add act" style="width: 70%; margin: 0 auto; margin-top: 20rpx;" @click="addAddress">
				<!-- <benIcon name="jiahao1" size="16" color="#C2132A"></benIcon> -->
				<text class="yticon icon-jia2"></text>
				添加收货地址
			</view>
		</view>

		<u-modal :show="show" :title="title" @cancel='cancel' @confirm="confirm" :showCancelButton='true'
			:content='content'></u-modal>
	</view>
</template>

<script>
	import {
		getAddrList,
		get_addr_detail,
		set_default_addr,
		del_addr
	} from '@/API/index/index.js'
	export default {
		data() {
			return {
				// 上传的数据
				uid: '',

				_id: '',

				// 地址列表
				addressData: [],


				show: false,
				content: '确认删除吗？',
				title: '提示',

			}
		},
		methods: {
			// 添加收货地址跳转
			addAddress() {
				this.navTo('/pages/address/addressManage')
			},

			// 获取收货地址列表
			getAddr() {
				let uid = this.uid
				getAddrList({
					uid
				}).then(res => {
					console.log(res);
					uni.stopPullDownRefresh();
					if (res.code === 1) {
						this.addressData = res.data
					}
				})
			},

			// 获取收货地址详情
			// getAddrDetail(){
			// 	let uid = this.uid
			// 	get_addr_detail({uid}).then(res=>{
			// 		console.log(res);
			// 	})
			// }


			// 设置默认收获地址
			defaultAddress(_id, index) {
				console.log(_id, index);
				let uid = this.uid
				set_default_addr({
					_id,
					uid
				}).then(res => {
					console.log(res);
					if (res.code === 1) {

						this.addressData.forEach(v => {
							v.is_default = false
						})

						this.addressData[index].is_default = true
					}
				})
			},
			// 修改的数据回填
			compileAddress(_id) {
				console.log(_id);
				// let chuan = JSON.stringify(item)
				// console.log(chuan);
				this.navTo('/pages/address/addressManage?addr_id=' + _id)
			},


			// 删除地址
			delAddr(id) {
				this.show = true

				this._id = id

			},
			cancel() {
				this.show = false
			},
			confirm() {
				let {
					uid,
					_id
				} = this
				del_addr({
					uid,
					_id
				}).then(res => {
					console.log(res);
				})
				this.getAddr()
				this.show = false


			}
		},
		computed:{
			addressCop(){
				return this.$store.state.user.addressApi
			}
		},
		watch:{
			addressCop(){
				console.log('监听到了');
				
				this.getAddr()
			}
		},
		onLoad() {
			this.uid = this.$store.state.user.uid
			
			


			// console.log(this.addressData);
			// 获取收获地址列表
			this.getAddr()
			// 获取收货地址详情
			// this.getAddrDetail()
		},
		onPullDownRefresh(){
			this.getAddr()
		}
	}
</script>

<style lang="scss">
	page {
		background: #f6f6f6;
	}

	uni-radio-group {
		display: block;
		width: 750upx;
	}

	.address-list .addr-list .list-con .tops .moren-defalut.hide {
		display: none;
	}

	.address-list {
		width: 750upx;
		padding: 0 32upx 32upx;
		overflow: hidden;
		min-width: 100%;
		display: block;

		.addr-list {
			background: #fff;
			width: 690upx;
			box-shadow: 0px 10px 28px rgba(0, 0, 0, 0.08);
			display: block;
			border-radius: 16upx;
			overflow: hidden;
			box-sizing: border-box;
			margin-top: 40upx;

			.list-con {
				border-bottom: 1px solid #f5f5f7;
				padding: 22upx;
				position: relative;
				display: block;
				overflow: hidden;
				width: 690upx;

				.arrow {
					position: absolute;
					height: 80upx;
					width: 80upx;
					text-align: center;
					line-height: 80upx;
					right: 0;
					top: 50%;
					transform: translateY(-50%);
				}

				.tops {
					display: flex;
					flex-direction: row;
					align-items: center;
					padding: 0 0 20upx;
					font-size: 28upx;
					color: #333;

					.phone {
						margin-left: 20upx;
					}

					.moren-defalut {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 80upx;
						height: 40upx;
						margin-left: 40upx;
						border-radius: 30upx;
						border: 1px solid $color1;
						font-size: 26upx;
						color: $color1;
					}
				}

				.address {
					padding: 0upx 60upx 0 0;
					box-sizing: border-box;
					font-size: 28upx;
					color: #999;
				}
			}

			.list-btm {
				padding: 20upx;
				font-size: 28upx;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;

				.moren {
					color: #333333;

					.iconfont {
						width: 28upx;
						height: 28upx;
						margin-right: 10upx;
						color: #999999;
						font-size: 30upx;
					}

					&.act {
						.iconfont {
							color: $color1;

							&:before {
								content: '\e67a';
							}
						}
					}
				}

				.caozuo {
					color: #333;
					display: inline-flex;
					align-items: center;

					.iconImg {
						width: 32rpx;
						height: 32rpx;
					}

					.bianji {
						display: inline-block;
						margin: 0 20upx 0 10upx;
					}

					.shanchu {
						margin-left: 10upx;
					}
				}
			}
		}

		uni-radio .uni-radio-input.uni-radio-input-checked:before {
			content: '\EA08';
		}

		.add.act {
			// position: fixed;
			display: flex;
			justify-content: center;
			width: 600upx;
			// top: 50%;
			// left: 50%;
			// transform: translate(-50%, -50%);
		}

		.add {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 80upx;
			margin-top: 40upx;
			text-align: center;
			font-size: 28upx;
			color: $color1;
			background-color: #fff;
			border-radius: 16upx;

			.iconfont {
				margin-right: 10upx;
			}
		}
	}
</style>

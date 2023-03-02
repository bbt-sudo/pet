<template>
	<view class="search">

		<view class="search-top">
			<view class="search-left">
				<u--input placeholder="请输入商品名称" border="surround" v-model="value"></u--input>
			</view>
			<view class="search-right">
				<u-button type="primary" @click="searchSend" text="搜索"></u-button>
			</view>
		</view>

		<view class="sear_record">
			<view class="search_rTit">
				<text class="search_pa">历史搜索</text>

				<view class="" @click="delect">
					<u-icon name="trash" size="25px"></u-icon>
				</view>
			</view>
			<view class="search_hotBox">
				<text v-for="(item,index) in chucun" @click="clickChu(index)">{{item}}</text>
			</view>
		</view>
		<u-modal :show="show" @confirm="confirm" @cancel="cancel" ref="uModal" :showConfirmButton="true"
			:showCancelButton='true'>确认全部删除吗</u-modal>
	</view>
</template>

<script>
	import {
		get_search_list
	} from '@/API/index/index.js'
	export default {
		data() {
			return {
				value: '',

				chucun: [],


				show: false,


				removeOK: true
			};
		},
		onLoad() {
			let chun = uni.getStorageSync("chucun")
			if (chun) {
				this.chucun = chun
			}
		},
		methods: {
			searchSend() {
				// console.log(this.value);
				this.navTo('/pages/index/search_list?keyword=' + this.value),


					console.log(this.value);
				console.log(this.chucun);
				let index = this.chucun.indexOf(this.value)
				if (index >= 0) {
					this.chucun.splice(index, 1)
				}
				this.chucun.unshift(this.value)

				JSON.stringify(this.chucun)
				uni.setStorageSync('chucun', this.chucun)

	


				this.value = ''

				// console.log(this.chucun.includes(this.value));



			},

			clickChu(index) {


				this.value = this.chucun[index]
				console.log(index);
			},



			delect() {
				this.show = true
			},

			confirm() {
				// console.log('确认');
				this.removeOK = true
				console.log(this.removeOK);
				this.show = false

				if (this.removeOK) {
					uni.removeStorageSync('chucun')
					this.chucun = []
				}


			},
			cancel() {
				this.show = false
			}
		}
	};
</script>

<style lang="scss">
	.search-top {
		display: flex;
		padding: 30rpx 40rpx;
		justify-content: space-between;
		border-bottom: 1px solid #eee;
		box-shadow: 0 1px 1px rgba(0, 0, 0, .06);

		.search-left {
			width: 75%;
			padding: 10rpx;

			/deep/ .u-input--radius[data-v-113bc24f],
			.u-input--square[data-v-113bc24f] {
				border-radius: 30px;
			}
		}

		.search-right {
			width: 20%;
			padding: 10rpx;
		}
	}









	page {
		background: #fff;
	}

	/deep/ .cl-card__header {
		height: 0;
	}

	/deep/ .cl-card {
		border-top: 1px solid #eee;
		border-bottom: 1px solid #eee;
		box-shadow: 0 1px 1px rgba(0, 0, 0, .06);
		border-radius: 0;
	}

	/deep/ .cl-button.cl-button--success {
		background-color: $color1;
		border-color: $color1;
	}

	.sear_record {
		width: 100%;
		height: auto;
		overflow: hidden;
		padding: 0 30upx;


		.search_rTit {
			width: 90%;
			height: 100rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			// overflow: hidden;

			.search_pa {
				font-size: 30upx;
				color: #333;
				line-height: 80upx;
				font-weight: bold;
			}

			.iconfont {
				font-size: 36upx;
				float: right;
				line-height: 80upx;
				color: #666;
			}
		}

		.search_hotBox {
			width: 100%;
			height: auto;
			overflow: hidden;

			text {
				display: inline-block;
				font-size: 28upx;
				line-height: 56upx;
				background: #eee;
				padding: 0 30upx;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 40upx;
			}
		}
	}
</style>

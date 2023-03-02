<template>
	<view class="content">
		<view class="navbar">
			<view class="tao">
				<view class="nav-item" :class="zonghe.sort_type===1?'current':''"
					@click="zonghe.sort_type = 1,getGoodsList()">
					综合排序
				</view>
				<view class="nav-item" :class="zonghe.sort_type===2?'current':''"
					@click="zonghe.sort_type = 2,getGoodsList()">
					销量优先
				</view>
				<view class="nav-item " :class="zonghe.sort_type===3||zonghe.sort_type===4?'current':''" @click="jiage">
					<!-- current -->
					<text>价格</text>
					<view class="p-box">
						<!-- <text class="yticon icon-shang active"></text>
						<text class="yticon icon-shang xia"></text> -->
						<!-- zonghe.sort_type===3 -->
						<u-icon name="arrow-up" class='yticon' :color="zonghe.sort_type===3?'yellow ':''"></u-icon>
						<u-icon name="arrow-down" class='yticon' :color="zonghe.sort_type===4?'yellow ':''"></u-icon>

					</view>
				</view>
			</view>
			<view class="xia" @click="isToggle= !isToggle">
				<u-icon name="list-dot" v-show="isToggle"></u-icon>
				<u-icon name="grid-fill" v-show="!isToggle"></u-icon>
			</view>

		</view>
		<view :class="isToggle?'goods-list':'goods2-list' ">
			<view class="goods-item goods2-item" v-for="item in getGoodsListArr"
				@click="navTo('/pages/product/product?goods_id='+item._id)">
				<view class="image-wrapper image2-wrapper">
					<image :src="item.img" mode="aspectFill"></image>
				</view>
				<view class="zhong">
					<text class="title clamp">{{item.name}}</text>
					<view class="price-box price2-box">
						<text class="price price2">￥:{{item.price}}</text>
						<text>已售 {{item.sales}}</text>
					</view>
				</view>
			</view>
		</view>



	</view>
</template>

<script>
	import {
		get_goods_list
	} from "@/API/index/index.js"
	export default {
		data() {
			return {

				zonghe: {
					cate_id: '',
					skip: 0,
					limit: 10,
					sort_type: 1,
					is_top: 0
				},



				getGoodsListArr: [],


				// 切换单行或双行

				isToggle: true
			}
		},
		methods: {
			getGoodsList() {
				uni.showLoading({
					title: "加载中.."
				})
				let {
					zonghe
				} = this
				get_goods_list(zonghe).then(res => {
					console.log(res);
					uni.hideLoading();
					this.getGoodsListArr = res.data
				})
			},
			jiage() {
				this.zonghe.sort_type === 3 ? this.zonghe.sort_type = 4 : this.zonghe.sort_type = 3
				this.getGoodsList()

			}
		},
		onLoad(options) {


			this.zonghe.cate_id = options.id

			this.getGoodsList()

			let title = options.title
			uni.setNavigationBarTitle({
				title
			});
		}
	}
</script>

<style lang="scss">
	page,
	.content {
		background: $page-color-base;
	}


	.goods2-list {
		background: #fff;
		display: flex;
		flex-direction: column;

		.goods2-item {
			display: flex;
			margin-top: 20rpx;
		}

		.image2-wrapper {
			width: 30%;

			image {
				width: 200rpx;
				height: 200rpx;
			}
		}

		.zhong {
			flex: 1;

			text {
				display: block;
			}

			.price2 {
				color: paleturquoise;
				padding: 20rpx 0;
			}
		}

	}

	.colors {
		color: #000
	}

	.content {
		padding-top: 96upx;
	}

	.navbar {
		position: fixed;
		left: 0;
		top: var(--window-top);
		display: flex;
		width: 100%;
		height: 80upx;
		background: #fff;
		box-shadow: 0 2upx 10upx rgba(0, 0, 0, .06);
		z-index: 10;

		.tao {
			// position: fixed;
			// left: 0;
			top: var(--window-top);
			display: flex;
			width: 90%;
			height: 80upx;
			background: #fff;
			box-shadow: 0 2upx 10upx rgba(0, 0, 0, .06);
			z-index: 10;
		}

		.xia {
			width: 20%;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 30upx;
			color: $font-color-dark;
			position: relative;

			&.current {
				color: $base-color;


				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 120upx;
					height: 0;
					border-bottom: 4upx solid $base-color;
				}
			}
		}

		.p-box {
			display: flex;
			flex-direction: column;

			.yticon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 30upx;
				height: 14upx;
				line-height: 1;
				margin-left: 4upx;
				margin: 3rpx 0;
				font-size: 26upx;
				color: #888;
				// color: red;

				&.active {
					color: $base-color;
					color: red;
				}
			}

			.xia {
				transform: scaleY(-1);
			}
		}

		.cate-item {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			width: 80upx;
			position: relative;
			font-size: 44upx;

			&:after {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				border-left: 1px solid #ddd;
				width: 0;
				height: 36upx;
			}
		}
	}

	/* 分类 */
	.cate-mask {
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0);
		z-index: 95;
		transition: .3s;

		.cate-content {
			width: 630upx;
			height: 100%;
			background: #fff;
			float: right;
			transform: translateX(100%);
			transition: .3s;
		}

		&.none {
			display: none;
		}

		&.show {
			background: rgba(0, 0, 0, .4);

			.cate-content {
				transform: translateX(0);
			}
		}
	}

	.cate-list {
		display: flex;
		flex-direction: column;
		height: 100%;

		.cate-item {
			display: flex;
			align-items: center;
			height: 90upx;
			padding-left: 30upx;
			font-size: 28upx;
			color: #555;
			position: relative;
		}

		.two {
			height: 64upx;
			color: #303133;
			font-size: 30upx;
			background: #f8f8f8;
		}

		.active {
			color: $base-color;
		}
	}

	/* 商品列表 */
	.goods-list {
		display: flex;
		flex-wrap: wrap;
		padding: 0 30upx;
		background: #fff;

		.goods-item {
			display: flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40upx;

			&:nth-child(2n+1) {
				margin-right: 4%;
			}
		}

		.image-wrapper {
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}

		.title {
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 50upx;
		}

		.price-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-right: 10upx;
			font-size: 24upx;
			color: $font-color-light;
		}

		.price {
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;

			&:before {
				// content: '￥';
				font-size: 26upx;
			}
		}
	}
</style>

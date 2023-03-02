<template>
	<scroll-view scroll-y class="container" @scroll="pageScroll" @scrolltolower="scrolltolower">
		<view class="header" :class="headerActive?'act':''">
			<view class="title-contents">
				<!--  #ifdef APP-PLUS||MP -->
				<view class="top-view status"></view>
				<!--  #endif -->
				<view class="_top titles">
					<view class="input-wrapper" @click="navTo('/pages/index/search')">
						<image src="/static/images/home/search.png" mode=""></image>
						<input type="text" disabled="disabled" placeholder="搜索商品" />
					</view>
					<view class="titleRightButton">
						<text class="iconfont icon-xitongtongzhi"></text>
					</view>
				</view>
			</view>
		</view>

		<view class="swiper-wrapper">
			<swiper indicator-dots="true" indicator-color="#666" indicator-active-color="#fff" autoplay="true"
				circular="true">
				<swiper-item v-for="item in banner">
					<image :src="item.img" />
				</swiper-item>

			</swiper>
		</view>
		
		<view class="menu">
			<view class="nav-wrapper">
				<view class="nav" v-for="(item,index) in cate" @click="tabbarTiao(index)">
					<view class="img-wrapper">
						<image :src="item.img" />
					</view>
					<text class="text">{{item.name}}</text>
				</view>
			</view>
		</view>
		<!-- 		<view class="time-buy">
			<view class="title">
				<view class="title-con">
					<text class="text">限时抢购</text>
					<view class="count-down">
						<text>00</text>:
						<text>24</text>:
						<text>29</text>
					</view>
				</view>
				<view class="more" @click="gotoSeckill">
					<text>更多</text>
					<image src="/static/images/common/arrow.png"></image>
				</view>
			</view>
			<view class="goods-list">
				<view class="goods" v-for="(item, index) in '123'" :key="index">
					<view class="img-wrapper">
						<image src="/static/images/home/goods01.png"></image>
					</view>
					<view class="seckill-title">
						<image src="/static/images/shop/seckill.png" mode=""></image>
						<text>限时特价</text>
					</view>
				</view>
			</view>
		</view> -->
		<view class="rank">
			<view class="title">推荐榜单</view>
			<view class="rank-list">
				<view class="rank-item" @click="navTo('/pages/product/product?goods_id='+item._id)" v-for="item in competitive">
					<view class="img-wrapper">
						<image :src="item.img"></image>
					</view>
					<view class="rank-title">
						<image src="/static/images/home/rank.png" mode=""></image>
						<text class="wenzi">{{item.name}}</text>
					</view>
				</view>

			</view>
		</view>
		<view class="like likes" >
			<view class="title">猜你喜欢</view>
			<view class="list" >
				<view class="goods-item" @click="navTo('/pages/product/product?goods_id='+item._id)" v-for="item in likeArr">
					<view class="img-wrapper">
						<image :src="item.img"></image>
					</view>
					<view class="goods-content">
						<view class="goods-title text-line">
							{{item.name}}
						</view>
						<view class="goods-desc">
							<view class="goods-price">
								<text class="symbol">￥</text>
								<text class="price">{{item.price}}</text>
							</view>
							<view class="sales">
								<text>已售{{item.sales}}件</text>
							</view>
						</view>
					</view>
				</view>

			</view>

		</view>
	</scroll-view>
</template>
<script>
	import {
		get_banner,
		get_cate,
		get_competitive,
		get_like
	} from "@/API/index/index.js"
	export default {
		data() {
			return {
				headerActive: false,
				// 轮播图
				banner: [],
				// 分类
				cate: [],
				// 精选
				competitive: [],

				// 猜你喜欢数组
				likeArr: [],
				// 猜你喜欢的下拉加载
				skip: 0,
				limit: 4,
				loadingStatus:'more'  // more nomore loading
			}
		},
		methods: {
			//监控页面滚动,控制头部变色
			pageScroll(e) {
				this.headerActive = e.target.scrollTop >= 40;
			},
			// 获取banner图
			getBanner() {
				get_banner().then(res => {
					console.log(res);
					this.banner = res.data
				})
			},
			// 获取分类
			getCate() {
				let position = 'index'
				get_cate({
					position
				}).then(res => {
					console.log(res);
					this.cate = res.data
				})
			},
			// 获取精选
			getCompetitive() {
				let skip = 0
				let limit = 3
				get_competitive({
					skip,
					limit
				}).then(res => {
					console.log(res);
					this.competitive = res.data
				})
			},
			// 猜你喜欢
			getLike() {
				let {
					skip,
					limit
				} = this
				get_like({
					skip,
					limit
				}).then(res => {
					console.log(res);
					this.likeArr.push(...res.data)
					
					// console.log(this.skip +=4);
					if(this.likeArr.length<res.count){
						this.loadingStatus='loading'
						this.skip +=4
						console.log(this.skip);
					}else{
						this.loadingStatus='nomore'
					}
				})
			},

			// 下拉刷新
			scrolltolower(e){
				// console.log(e);
				
				let {loadingStatus} = this
				
				if(loadingStatus==='more'||loadingStatus==='loading'){
					this.getLike()
				}
			},
			
			
			
			tabbarTiao(index){
				console.log(index);
				uni.reLaunch({
					url:'/pages/category/category?index='+index
				})
				// uni.setStorageSync('index',index)
			}
		},
		onLoad() {
			this.getBanner() //banner图
			this.getCate() //分类
			this.getCompetitive() // 精选
			this.getLike() //猜你喜欢
		}
		


	}
</script>


<style lang="scss">
	.wenzi {
		height: 75rpx;
		overflow: hidden;
	}
	


	page {
		width: 100%;
		height: 100%;
		background: #f8f8f8;

		.container {
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0);

			.header {
				position: fixed;
				top: 0;
				width: 100%;
				height: calc(var(--status-bar-height) + 88upx);
				background: rgba(255, 255, 255, 0);
				overflow: hidden;
				z-index: 999;

				&.act {
					background: rgba(253, 209, 0, .8);

					.title-contents .titles .titleRightButton .iconfont {
						color: #fff;
					}

				}

				.title-contents {

					width: 100%;
					height: calc(var(--status-bar-height) + 88upx);
					z-index: 100008;

					.top-view {
						width: 100%;
						height: var(--status-bar-height);
					}

					.titles {
						display: flex;
						flex-direction: row;
						height: 88upx;
						/* #ifdef MP */
						width: 550upx;
						/* #endif */

						.input-wrapper {
							display: flex;
							flex-direction: row;
							align-items: center;
							margin-top: 12upx;
							margin-left: 24upx;
							width: 702upx;
							height: 64upx;
							background: #fff;
							border-radius: 32upx;
							/* #ifdef MP */
							order: 1;

							/* #endif */
							image {
								margin: 0 15upx 0 28upx;
								width: 26upx;
								height: 26upx;
							}

							input {
								flex: 1;
								font-size: 28upx;
								color: #666;
							}
						}

						.titleRightButton {
							width: 88upx;
							height: 88upx;
							display: flex;
							align-items: center;
							justify-content: center;
							margin-left: 5px;

							.iconfont {
								font-size: 50upx;
								color: rgba(248, 84, 78, .8);
							}
						}
					}
				}

			}

			.swiper-wrapper {
				position: relative;
				margin-top: calc(var(--status-bar-height) - 88upx);
				width: 750upx;
				height: 509upx;

				swiper {
					width: 750upx;
					height: 509upx;

					image {
						width: 750upx;
						height: 509upx;
					}
				}
			}

			.time-buy {
				margin: 20upx auto 0;
				width: 702upx;
				background: #fff;

				.title {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					padding: 0 20upx;
					height: 90upx;

					.title-con {
						display: flex;
						flex-direction: row;
						align-items: center;

						.text {
							font-size: 32upx;
							color: #333;
							font-weight: bold;
						}

						.count-down {
							margin-left: 20upx;
							font-size: 28upx;

							text {
								margin: 0 4upx;
								padding: 2upx 8upx;
								font-size: 24upx;
								color: #fff;
								background: #FB5248;
							}
						}
					}

					.more {
						display: flex;
						flex-direction: row;
						align-items: center;

						text {
							font-size: 24upx;
							color: #040000;
							line-height: 24upx;
							vertical-align: middle;
						}

						image {
							margin-left: 20upx;
							width: 12upx;
							height: 20upx;
						}
					}
				}

				.goods-list {
					display: flex;
					flex-direction: row;
					// justify-content: space-between;
					padding: 0 20upx;
					box-sizing: border-box;

					.goods {
						margin-right: 16upx;
						width: 210upx;
						height: auto;

						.img-wrapper {
							width: 210upx;
							height: 210upx;

							image {
								width: 100%;
								height: 100%;
							}
						}

						.seckill-title {
							display: flex;
							flex-direction: row;
							align-items: center;
							height: 30upx;
							margin: 22upx 0;

							image {
								margin: 0 10upx;
								width: 28upx;
								height: 28upx;
							}

							text {
								vertical-align: middle;
								font-size: 28upx;
								color: #111111;
							}
						}
					}
				}
			}

			.rank {
				margin: 20upx auto 0;
				width: 702upx;

				.title {
					display: flex;
					flex-direction: row;
					align-items: center;
					height: 90upx;
					font-size: 32upx;
					color: #333;
					font-weight: bold;
				}

				.rank-list {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					box-sizing: border-box;

					.rank-item {
						width: 224upx;
						height: auto;

						.img-wrapper {
							width: 224upx;
							height: 224upx;

							image {
								width: 100%;
								height: 100%;
							}
						}

						.rank-title {
							display: flex;
							flex-direction: row;
							align-items: center;
							height: 30upx;
							margin: 22upx 0;

							image {
								margin: 0 10upx;
								width: 28upx;
								height: 28upx;
							}

							text {
								vertical-align: middle;
								font-size: 28upx;
								color: #111111;
							}
						}
					}
				}
			}

			.like {
				margin: 0 auto 0;
				width: 702upx;

				.title {
					display: flex;
					flex-direction: row;
					align-items: center;
					height: 90upx;
					font-size: 32upx;
					color: #333;
					font-weight: bold;
				}
			}
		}

		.menu {
			position: relative;
			z-index: 99;
			width: 702upx;
			margin: 40upx auto 0;
			padding: 16upx 0;
			background: #fff;
			border-radius: 12upx;
			overflow: hidden;

			.nav-wrapper {
				display: flex;
				flex-wrap: wrap;

				.nav {
					width: 25%;
					margin: 16upx 0;
					text-align: center;

					.img-wrapper {
						position: relative;
						width: 78upx;
						height: 78upx;
						margin: 0 auto 10upx;
						overflow: hidden;

						image {
							position: absolute;
							left: 0;
							top: 0;
							width: 100%;
							height: 100%;
						}
					}

					.text {
						margin: 0;
						font-size: 24upx;
						color: #111;
					}
				}
			}
		}

		.list {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			width: 100%;

			.goods-item {
				display: flex;
				flex-direction: column;
				margin-bottom: 20upx;
				width: 48.5%;
				height: 520upx;
				background: #fff;

				&:nth-child(2n) {
					margin-left: 3%;
				}

				.img-wrapper {
					position: relative;
					width: 100%;
					height: 0;
					padding-bottom: 100%;

					image {
						position: absolute;
						width: 100%;
						height: 100%;
					}
				}

				.goods-content {
					display: flex;
					flex-direction: column;
					padding: 0 20upx;
					height: 180upx;
					box-sizing: border-box;

					.goods-title {
						margin-top: 10upx;
						width: 100%;
						height: 72upx;
						font-size: 28upx;
						color: #111111;
					}

					.goods-desc {
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						margin-top: 10upx;
						line-height: 60upx;

						.goods-price {
							.symbol {
								font-size: 22upx;
								color: #F8544E;
							}

							.price {
								font-size: 30upx;
								color: #F8544E;
							}
						}

						.sales {
							line-height: 60upx;
							font-size: 20upx;
							color: #999999;
						}

						.collect {
							line-height: 60upx;
							font-size: 20upx;
							color: #999999;

							.iconfont {
								margin-right: 10upx;
								font-size: 30upx;
								vertical-align: middle;
							}
						}

						.cart {
							image {
								margin-top: 8upx;
								width: 54upx;
								height: 54upx;
							}
						}
					}
				}
			}
		}
	}
</style>

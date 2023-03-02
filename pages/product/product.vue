<template>
	<scroll-view class="container" scroll-y="true" @scroll="pageScroll">
		<view class="title-contents" :class="headerActive?'act':''">
			<!--  #ifdef APP-PLUS -->
			<view class="top-view status" style="background: rgba(255,255,255,0)"></view>
			<!--  #endif -->
			<view class="_top titles">
				<view class="titleLeftButton" @click="back()"><text class="iconfont icon-fanhui"></text></view>
				<view class="titleText">
					<view class="title-item active">商品</view>
					<view class="title-item">详情</view>
					<view class="title-item">评论</view>
				</view>
				<view class="titleRightButton" @click="swithTo('/pages/cart/cart')"><text class="iconfont icon-gouwuche2"></text></view>
			</view>
		</view>
		<view class="firstPart" id="">
			<!-- 轮播图 -->
			<view class="swiper-wrapper">
				<swiper indicator-dots="true" indicator-color="#666" indicator-active-color="#fff" autoplay="true"
					circular="true">
					<swiper-item v-for="item in swiperArr">
						<image :src="item" />
					</swiper-item>
					<!-- <swiper-item><image src="../../static/images/shop/goods_banner2.jpg" /></swiper-item> -->
				</swiper>
			</view>

			<view class="goods-info">
				<view class="goods-price">
					<text class="price">
						<text>￥</text>
						{{getDetail.price}}
					</text>
					<text class="through-price">￥{{getDetail.old_price}}</text>
				</view>
				<view class="goods-title">{{getDetail.name}}</view>
				<view class="sales">
					<text>快递:包邮</text>
					<text>月销{{getDetail.sales}}</text>
				</view>
			</view>
		</view>

		<view class="evaluate" v-show="isShow">
			<view class="evaluate_title">
				<view class="title_name">
					<text>评价</text>
					<text>{{count}}</text>
				</view>
				<view class="title_goto">
					<text @click="navTo('/pages/product/comment?goods_id='+goods_id)">查看更多</text>
					<text class="iconfont icon-qianwang"></text>
				</view>
			</view>
			<view class="evaluate_con">
				<view class="con_title">
					<image
						src="https://ts1.cn.mm.bing.net/th/id/R-C.1f9d8df6f064224797d01a6f36dda3c8?rik=EHmL9K21fKjKFA&riu=http%3a%2f%2fpic.22520.cn%2fup%2f200317%2f1584451459116336.jpg&ehk=XUo9tIJlq5FAIS%2b9FqmwnZI06%2bnJ6BZVJJyJkJvoalA%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1"
						mode=""></image>
					<text class="Name">{{goodsCommentInfo.nickname}}</text>
				</view>
				<view class="con_con">{{goodsComment0.content}}</view>
				<view class="con_img">
					<image :src="goodsComment0.images" mode=""></image>
				</view>
			</view>
		</view>
		<view class="evaluate" v-show="!isShow">
			<view class="evaluate_title">
				<view class="title_name">
					<text>评价</text>
					<text>0</text>
				</view>
				<view class="title_goto">
					<text @click="navTo('/pages/product/comment?goods_id='+goods_id)">查看更多</text>
					<text class="iconfont icon-qianwang"></text>
				</view>
			</view>
			<view class="evaluate_con">
				暂时没有评论
			</view>
		</view>

		<view class="goods-detail">
			<view class="title">
				<view class="title_name"><text>图文详情</text></view>
			</view>

			<view class="content">
				<rich-text :nodes="getDetail.desc"></rich-text>
			</view>
		</view>
		<view class="footer">
			<view class="fav" @click="isFav">
				<view class="" style="text-align: center;" :class="{avtives:is_fav===1}">
					★
				</view>
				<view class="">
					收藏
				</view>

			</view>
			<view class="btn cart" @click="isSku=true,tupe = 'cart'">加入购物车</view>
			<view class="btn buy" @click="comePay">立即购买</view>
		</view>
		<view class="mask" v-show="isSku" @click="isSku = false"></view>


		<!-- SKU----------------------------------- -->
		<view class="mask-content" :class="isSku ? 'act' : ''">
			<view class="header">
				<view class="title title-new">
					<view class="left">
						<image :src="getDetail.img" mode=""></image>
					</view>
					<view class="right">

						<view style="font-weight: bold; font-size: 33rpx; color: #fb5e56;">
							￥:{{sku_info.price}}
						</view>
						<view class="" style="color: #c1aca4;">
							库存:{{sku_info.stock}}
						</view>
						<view class="" style="color: #c1aca4;">
							已选:{{sku_info.text}}
						</view>
					</view>
				</view>

				<image src="/static/images/common/close.png" @click="isSku=false" mode=""></image>
			</view>


			<view v-for="(item,index1) in attr">
				<view class="choose-title">{{item.text}}</view>
				<scroll-view class="type-view" scroll-y>
					<view class="list">
						<view class="item " v-for="(item_list,index2) in item.values" @click="chang_attr(index1,index2)"
							:class="item.checked==index2?'active':''">{{item_list.text}}</view>
						<!-- <view class="item ">中包</view> -->
					</view>
				</scroll-view>
			</view>

			<view class="goods-number">
				<text>数量</text>
				<u-number-box v-model="value" @change="valChange"></u-number-box>
			</view>
			<view class="choose-footer" @click="confirm">确定</view>
		</view>
	</scroll-view>
</template>

<script>
	import numberBox from '../../components/numberbox/numberbox.vue';


	import {
		get_goods_detail,
		get_goods_comment,
		toggle_fav,
		get_sku,
		add_cart
	} from '@/API/index/index.js'
	export default {
		components: {
			numberBox
		},
		data() {
			return {
				isShow: false,
				headerActive: false,
				// 路由传递的参数
				goods_id: '',
				// 详情信息
				getDetail: [],
				// 轮播图
				swiperArr: [],
				// 商品评论
				goodsComment: [],
				goodsComment0: {},
				goodsCommentInfo: [],
				skip: 0,
				limit: 10,
				// 多少条评论
				count: 0,
				// 图文信息
				tuInfo: [],
				// 商品收藏
				is_fav: 0,
				// isFavColor:0
				// SKU
				skuDate: [],
				isSku: false,
				// 选择的数量
				value: 1,
				sku_info: [],
				attr: [],
				type:'cart'


			};
		},
		methods: {
			//监控页面滚动,控制头部变色
			pageScroll(e) {
				this.headerActive = e.target.scrollTop >= 60;
			},
			// 获取详情信息
			getGoodsDetail() {
				let {
					goods_id
				} = this
				let uid = this.$store.state.user.uid
				console.log(this.$store.state.user.uid);
				
				uni.showLoading({
					title:"加载中.."
				})
				
				get_goods_detail({
					goods_id,
					uid
				}).then(res => {
					
					setTimeout(()=>{
						uni.hideLoading();
					})

					this.swiperArr = res.data[0].banner
					this.is_fav = res.is_fav

					console.log(res);



					this.getDetail = res.data[0]

					this.attr = this.getDetail.attr

					// this.getDetail.forEach(v=>{
					// 	v.checked = 0
					// })

					console.log('#############');

					this.sku_info = this.getDetail.default_sku_info

					// 查看是否有规格 如果没有就返回原本的规格
					if (this.attr.length === 0) {
						this.sku_info = {
							price: this.getDetail.price,
							stock: this.getDetail.stock,
							text: ['暂无属性']
						};
						return;
					}

					this.attr.forEach(v => {
						v.checked = 0
					})

					console.log(this.attr);


					let desc = this.getDetail.desc || '';
					this.getDetail.desc = desc.replace(/<img\s+src=/g, '<img width="100%" height="auto" src=');




				})
			},
			// 商品评论
			getGoodsComment() {
				let {
					goods_id,
					limit,
					skip
				} = this
				get_goods_comment({
					goods_id,
					limit,
					skip
				}).then(res => {
					console.log(res);
					this.count = res.count
					if (res.count === 0) {
						// console.log(this.goodsComment);
						this.isShow = false
						return
					}
					this.isShow = true
					console.log(this.goodsComment);
					this.goodsComment = res.data
					this.goodsComment0 = res.data[0]
					this.goodsCommentInfo = res.data[0].userInfo
					console.log(this.goodsComment0);
					console.log(this.goodsComment[0].userInfo);
				})
			},

			// 商品收藏
			isFav() {
				
				this.notLogin()
				
				let {
					goods_id,
					is_fav
				} = this
				let uid = this.$store.state.user.uid


				console.log(goods_id, is_fav, uid);


				toggle_fav({
					goods_id,
					is_fav,
					uid
				}).then(res => {
					console.log(res);
					this.is_fav = res.is_fav
				})
				console.log(this.is_fav);
				if (is_fav === 0) {
					is_fav = 1
					console.log(is_fav, '000');
				} else {
					is_fav = 0
					console.log(is_fav, '111');
				}

				console.log(is_fav);



			},

			getSku() {
				let {
					goods_id
				} = this

				console.log(this.attr);
				let sku = this.attr.map((v) => {
					console.log(v.checked);
					console.log(v.values[v.checked].text);
					return v.values[v.checked].text
				})

				console.log(sku);

				get_sku({
					goods_id,
					sku
				}).then(res => {
					console.log(res);
					this.sku_info = res.data
				})
			},


			chang_attr(index1, index2) {
				this.getSku()
				console.log(index1, index2);
				console.log(this.attr[index1]);

				// 将数组中的这个值   变色
				this.attr[index1].checked = index2
				console.log(this.attr[index1].checked);


				// 数据改变了 视图没更新
				this.$forceUpdate();
				// 调用sku的接口
				this.getSku()
			},


			valChange(e) {
				console.log('当前值为: ' + e.value)
			},
			
			// 确认加入购物车
			confirm(){
				
				// let {type} = this
				
				let uid = this.$store.state.user.uid
				let {goods_id,type} = this
				let num = this.value
				let attr = this.sku_info.text
				
				
				
				
				
				this.notLogin()
				
				add_cart({uid,goods_id,attr,type,num}).then(res=>{
					console.log(res);
					
					if(res.code===1) {
						
						if(type=='buy'){
							this.navTo('/pages/order/createOrder?cart_id='+res.data.id)
						}else{
							this.value = 1
							this.isSku = false
							this.$store.state.user.cartApi = !this.$store.state.user.cartApi
							console.log(this.$store.state.user.cartApi);
						}
						
						
						
						uni.$u.toast('加入购物车成功')
					}
				})
				
				
				
			},

			comePay(){
				this.isSku = true
				
				this.type = 'buy'
			}
		},
		onLoad(options) {
			this.goods_id = options.goods_id

			this.getGoodsDetail()
			this.getGoodsComment()
			// this.getSku()
		}
	};
</script>

<style lang="scss" scoped>
	.title-new {
		display: flex;
		padding: 20rpx;
	}

	.avtives {
		color: red;
	}

	.active-click {
		color: red;
	}

	page {
		width: 100%;
		height: 100%;
		background-color: #f5f5f7;

		.container {
			background-color: #f5f5f7;
			height: 100%;

			.title-contents {
				position: fixed;
				top: 0;
				width: 100%;
				height: calc(var(--status-bar-height) + 88upx);
				z-index: 1000;
				background: rgba(255, 255, 255, 0);

				.top-view {
					width: 100%;
					height: var(--status-bar-height);
				}

				&.act {
					background: rgba(255, 255, 255, 1);
					border-bottom: 1px solid #eee;
					z-index: 10009;
					transition: 0.3s all;

					.titles .titleRightButton .iconfont {
						color: #fff;
					}

					.titles .titleLeftButton .iconfont {
						color: #fff;
					}

					.titles .titleText {
						opacity: 1;
					}
				}

				.titles {
					display: flex;
					flex-direction: row;
					justify-content: center;
					height: 88upx;

					.mp-titleLeftButton {
						width: 88upx;
						height: 88upx;
					}

					.titleLeftButton {
						display: flex;
						justify-content: center;
						align-items: center;
						margin: 14upx;
						width: 60upx;
						height: 60upx;
						line-height: 60upx;
						text-align: center;
						border-radius: 50%;
						background: rgba(0, 0, 0, 0.5);

						.iconfont {
							font-size: 16px;
							color: #fff;
						}
					}

					.titleText {
						display: flex;
						justify-content: space-around;
						align-items: center;
						width: 574upx;
						height: 88upx;
						margin: 0 auto;
						opacity: 0;

						.title-item {
							position: relative;
							height: 88upx;
							line-height: 88upx;
							font-size: 36upx;
							color: #666;

							&.active {
								color: #000;

								&::after {
									position: absolute;
									bottom: 0;
									left: 50%;
									content: ' ';
									margin-left: -25upx;
									width: 50upx;
									height: 6upx;
									background: #666;
								}
							}
						}
					}

					.titleRightButton {
						display: flex;
						justify-content: center;
						align-items: center;
						margin: 14upx;
						width: 60upx;
						height: 60upx;
						line-height: 60upx;
						text-align: center;
						border-radius: 50%;
						background: rgba(0, 0, 0, 0.5);
						color: #fff;

						.iconfont {
							font-size: 19px;
							color: #fff;
						}
					}
				}
			}

			.firstPart {
				.swiper-wrapper {
					/*  #ifdef  MP-WEIXIN  */
					min-height: 88upx;
					/*  #endif  */
					width: 100%;
					/*  #ifndef  MP-WEIXIN  */
					min-height: calc(var(--status-bar-height) + 88upx);

					/*  #endif  */
					swiper {
						width: 100%;
						height: 750upx;

						image {
							width: 100%;
							height: 750upx;
						}
					}
				}

				.seckill {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					padding: 0 25upx;
					box-sizing: border-box;
					width: 100%;
					height: 100upx;
					background: #fb5248;

					.goods-price {
						display: flex;
						flex-direction: row;
						align-items: center;
						height: 100upx;

						.price {
							font-size: 44upx;
							color: #fff;

							text {
								font-size: 28upx;
							}
						}

						view {
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							margin-left: 24upx;
							padding: 20upx 0;
							box-sizing: border-box;
							font-size: 22upx;
							color: #fff;

							.through-price {
								text-decoration: line-through;
							}
						}
					}

					.progress-wrapper {
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						padding: 16upx 0 22upx;
						height: 100upx;
						box-sizing: border-box;
						font-size: 22upx;
						color: #fee900;
					}
				}

				.goods-info {
					padding: 0 25upx;
					box-sizing: border-box;
					background: #fff;
					overflow: hidden;

					.goods-price {
						line-height: 84upx;

						.price {
							font-size: 36upx;
							color: #fb5248;

							text {
								font-size: 24upx;
							}
						}

						.through-price {
							margin-left: 30upx;
							font-size: 22upx;
							color: #999;
							text-decoration: line-through;
						}
					}

					.goods-title {
						margin-top: 20upx;
						line-height: 42upx;
						font-size: 32upx;
						color: #111;
					}

					.sales {
						display: flex;
						justify-content: space-between;
						align-items: center;
						height: 84upx;
						font-size: 24upx;
						color: #666;
					}
				}
			}

			.coupon {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 90upx;
				margin: 20upx 0 0;
				background-color: #fff;
				padding: 0 25upx;
				box-sizing: border-box;
				font-size: 28upx;
				color: #666;

				.title {
					text {
						&:nth-child(2n) {
							margin-left: 30upx;
							color: #111;
						}

						&:last-child {
							color: #fb5248;
						}
					}
				}

				.get-coupon {
					text {
						padding: 2upx 8upx;
						box-sizing: border-box;
						background: rgba(251, 82, 72, 0.1);
						color: #fb5248;
						border-radius: 6upx;
					}
				}
			}

			.spec {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 20upx;
				height: 74upx;
				background-color: #fff;
				padding: 0 25upx;
				box-sizing: border-box;
				font-size: 28upx;
				color: #666;

				&.delivery {
					margin-top: 0;
				}

				.title {
					text {
						&:last-child {
							margin-left: 30upx;
							color: #111;
						}
					}
				}

				.arrow {
					.iconfont {
						color: #999;
						font-size: 12px;
					}
				}
			}

			.evaluate {
				margin: 20upx 0;
				padding: 0 25upx;
				box-sizing: border-box;
				background-color: #fff;

				.evaluate_title {
					display: flex;
					justify-content: space-between;
					align-items: center;
					height: 84upx;
					overflow: hidden;

					.title_name {
						font-size: 30upx;
						font-weight: bold;
					}

					.title_goto {
						font-size: 24upx;
						color: #666;

						.iconfont {
							margin-left: 10upx;
							font-size: 24upx;
						}
					}
				}

				.evaluate_con {
					padding-bottom: 20upx;
					box-sizing: border-box;
					font-size: 28upx;

					.con_title {
						image {
							width: 60upx;
							height: 60upx;
							border-radius: 50%;
						}

						.Name {
							display: inline-block;
							vertical-align: top;
							margin-top: 10upx;
							margin-left: 15upx;
						}
					}

					.con_img {
						display: flex;
						flex-direction: row;
						flex-wrap: wrap;
						align-items: center;
						margin-top: 20upx;

						image {
							margin-right: 20upx;
							margin-bottom: 15upx;
							width: 160upx;
							height: 160upx;
							border-radius: 5px;

							&:last-child {
								margin-right: 0;
							}
						}
					}
				}
			}

			.all-comment {
				.evaluate_list {
					background-color: #fff;
					padding: 20upx 25upx 0;
					box-sizing: border-box;

					.list_title {
						overflow: hidden;
						_zoom: 1;

						.list_left {
							image {
								width: 60upx;
								height: 60upx;
								border-radius: 50%;
							}

							.list_left_con {
								display: inline-block;
								margin-left: 10px;
								font-size: 24upx;

								.time {
									color: #999999;
									margin-top: 10upx;
								}
							}
						}
					}

					.list_text {
						font-size: 28upx;
						padding: 10px 0;
					}

					.list_img {
						display: flex;
						flex-direction: row;
						flex-wrap: wrap;
						align-items: center;

						image {
							margin-bottom: 15upx;
							width: 160upx;
							height: 160upx;
							border-radius: 5px;
							margin-right: 15upx;
						}
					}

					.list_btm {
						overflow: hidden;
						_zoom: 1;
						padding: 10px 0;

						.btm_left {
							float: left;
							font-size: 24upx;
							color: #666666;
						}

						.btm_right {
							float: right;
							font-size: 24upx;
							color: #666;

							.comment {
								width: 90upx;
								height: 40upx;
								line-height: 36upx;
								border-radius: 20upx;
								text-align: center;
								border: 1px solid #666;
								display: inline-block;
								margin-right: 10px;
							}

							.Give {
								width: 130upx;
								height: 40upx;
								line-height: 36upx;
								border-radius: 20upx;
								text-align: center;
								border: 1px solid #666;
								display: inline-block;
							}
						}
					}
				}
			}

			.goods-detail {
				margin: 0 0 94upx;
				padding: 0 25upx 100upx;
				box-sizing: border-box;
				background-color: #fff;

				.title {
					display: flex;
					justify-content: space-between;
					align-items: center;
					height: 84upx;
					overflow: hidden;

					.title_name {
						font-size: 30upx;
						font-weight: bold;
					}
				}

				.content {
					font-size: 0;

					p {
						img {
							width: 100%;
						}
					}
				}
			}

			.margin-t {
				/*  #ifdef  APP-PLUS  */
				margin-top: calc(var(--status-bar-height) + 88upx);
				/*  #endif  */
				/*  #ifndef  APP-PLUS  */
				margin-top: 88upx;
				/*  #endif  */
			}

			.footer {
				position: fixed;
				bottom: 0;
				display: flex;
				flex-direction: row;
				align-items: center;
				width: 100%;
				height: 94upx;
				background: #fff;
				justify-content: space-between;

				.btn {
					width: 43%;
					line-height: 94upx;
					text-align: center;
					background: #666;
					font-size: 34upx;
					color: #fff;

					&.buy {
						background: #fb5248;
						color: #fff;
					}
				}
			}

			.mask {
				position: fixed;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				background: rgba(0, 0, 0, 0.5);
				z-index: 10008;
			}

			.mask-content {
				position: fixed;
				left: 0;
				right: 0;
				bottom: -120%;
				// height: 1020upx;
				background: #fff;
				z-index: 10009;
				transition: 0.3s all;

				&.act {
					bottom: 0;
					transition: all 0.3s;
				}

				.header {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					padding: 0 25upx;
					box-sizing: border-box;
					height: 150upx;

					.title {
						image {
							margin-top: 0;
							position: relative;
							top: -50upx;
							width: 200upx;
							height: 200upx;
							vertical-align: middle;
						}

						text {
							margin-top: -20upx;
							margin-left: 30upx;
							color: #fb5248;
							font-size: 36upx;

							text {
								font-size: 29upx;
							}
						}
					}

					image {
						margin-top: 30upx;
						width: 40upx;
						height: 40upx;
					}
				}

				.choose-title {
					margin-top: 25upx;
					padding: 0 25upx;
					overflow: hidden;
					box-sizing: border-box;
					font-size: 28upx;
					color: #666;
				}

				.type-view {
					padding: 0 25upx;
					box-sizing: border-box;
					max-height: 150upx;

					.list {
						display: flex;
						flex-direction: row;
						flex-wrap: wrap;

						.item {
							margin-top: 18upx;
							margin-right: 24upx;
							padding: 0 32upx;
							box-sizing: border-box;
							height: 56upx;
							line-height: 56upx;
							border-radius: 28upx;
							background: #f6f5f5;
							color: #323232;
							font-size: 28upx;

							&.active {
								color: #fb5248;
								background: rgba(251, 82, 72, 0.1);
							}
						}
					}
				}

				.goods-number {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-top: 20upx;
					margin-bottom: 120upx;
					padding: 0 25upx;
					box-sizing: border-box;
					height: 88upx;

					text {
						font-size: 28upx;
						color: #666;
					}
				}

				.choose-footer {
					position: absolute;
					bottom: 0;
					width: 100%;
					line-height: 94upx;
					color: #777;
					background: #666;
					text-align: center;
					font-size: 34upx;
				}
			}
		}
	}

	>>>.content p {
		width: 100%;
	}
</style>

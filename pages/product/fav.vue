<template>
	<view class="content">
		<view class="goods-list">
			<view class="goods-item" v-for="item in favList">
				<!-- <cl-list-item swipe="right"> -->
					<view class="image-wrapper">
						<image :src="item.img" mode="widthFix"></image>
					</view>
					<view class="price-box">
						<text class="title">{{item.name}}</text>
						<text class="price">{{item.price}}</text>
					</view>
					<view class="append" slot="menu"><button type="warn" class="error-btn">删除</button></view>
				<!-- </cl-list-item> -->
			</view>
		</view>
	</view>
</template>

<script>
	import { get_fav_list } from '@/API/index/index.js'
	export default {
		data(){
			return {
				favList:[],
				
				uid:'',
				skip:0,
				limit:10
			}
		},
		methods:{
			getFavList(){
				let {uid,skip,limit} = this
				get_fav_list({uid,skip,limit}).then(res=>{
					if(res.code===1){
						this.favList = res.data
					}
				})
			}
		},
		onLoad(){
			this.uid = this.$store.state.user.uid
			
			this.getFavList()
		}
	}
</script>

<style lang="scss">
	page,
	.content {
		background: $page-color-base;
	}

	/* 商品列表 */
	.goods-list {
		display: flex;
		flex-wrap: wrap;
		padding: 0 30upx;
		background: #fff;
		flex-direction: column;
		justify-content: space-between;

		.goods-item {
			display: flex;
			padding: 20upx 0;
			border-bottom: 1px solid #eee;
		}

		.image-wrapper {
			width: 200rpx;
			height: 200rpx;
			border-radius: 3px;
			overflow: hidden;

			image {
				width: 200rpx;
				height: 200rpx;
				opacity: 1;
			}
		}

		.title {
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 50upx;
		}

		.price-box {
			font-size: 24upx;
			color: $font-color-light;
			flex: 1;
			padding-left: 10px;
			display: flex;
			flex-wrap: wrap;
			flex-direction: column;
			justify-content: space-between;
		}

		.price {
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;

			&:before {
				content: '￥';
				font-size: 26upx;
			}
		}
	}
</style>

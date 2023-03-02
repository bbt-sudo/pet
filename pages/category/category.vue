<template>
	<view class="content">
		<scroll-view scroll-y class="left-aside">
			<view class="f-item b-b " :class="index===isShow?'active':''" @click="toggle(index)" v-for="(item,index) in getCateArr">{{item.name}}</view>
		</scroll-view>
		
		
		<scroll-view scroll-with-animation scroll-y class="right-aside">
			<view class="s-list">
				<view class="t-list" v-for="(item,indexFu) in getCateArr" v-show="isShow === indexFu">
					<view class="t-item" v-for="(item2,index) in item.children"  @click="navTo(`/pages/category/list?id=${item2._id}&title=${item.name}`)">
						<image :src="item2.img"></image>
						<text class="s-item2">{{item2.name}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		get_cate
	} from "@/API/index/index.js"
	export default {
		data() {
			return {
				getCateArr:[],
				
				isShow:0
			}
		},
		methods: {
			getCate(index) {
				// let position = 'index'
				console.log(index);
				this.isShow = index	
				
				get_cate().then(res => {
					console.log(res);
					this.getCateArr = res.data
				})
			},
			
			
			
			toggle(index){
				console.log(index);
				// this.isShow = index
				this.getCate(index)
			}
		},
		onLoad(options) {
			console.log(options.index);
			
			if(options.index){
				let index = parseInt(options.index)
				 console.log(index);
				this.getCate(index)
			}else{
				console.log(111);
				this.getCate(0)
			}
		}
		
	}
</script>

<style lang='scss'>
	page,
	.content {
		height: 100%;
		background-color: #f8f8f8;
	}

	.content {
		display: flex;
	}

	.left-aside {
		flex-shrink: 0;
		width: 200upx;
		height: 100%;
		background-color: #fff;
	}

	.f-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100upx;
		font-size: 28upx;
		color: $font-color-base;
		position: relative;

		&.active {
			color: $base-color;
			background: #f8f8f8;

			&:before {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				height: 36upx;
				width: 8upx;
				background-color: $base-color;
				border-radius: 0 4px 4px 0;
				opacity: .8;
			}
		}
	}

	.right-aside {
		flex: 1;
		overflow: hidden;
		padding-left: 20upx;
	}

	.s-item {
		display: flex;
		align-items: center;
		height: 70upx;
		padding-top: 8upx;
		font-size: 28upx;
		color: $font-color-dark;
	}

	.t-list {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		background: #fff;
		padding-top: 12upx;

		&:after {
			content: '';
			flex: 99;
			height: 0;
		}
	}

	.t-item {
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 176upx;
		font-size: 26upx;
		color: #666;
		padding-bottom: 20upx;

		image {
			width: 140upx;
			height: 140upx;
		}
	}
</style>

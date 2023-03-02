<template>
	<view class="content" style="border-top: 1px solid #eee;">
		<view class="goods-list">
			<view class="eva-box" v-for="item in goodsComment">
				<view class="eva_box_top">
					<image class="portrait" :src="item.userInfo.avatar" v-show="'avatar' in item.userInfo" mode="aspectFill"></image>
					<image class="portrait" v-show="!('avatar' in item.userInfo)" src="https://pic4.zhimg.com/v2-194b7fd15f75191874379a76bc380e53_r.jpg" mode="aspectFill"></image>
					<view class="userInfo">
						<text class="name">{{item.userInfo.nickname}}</text>
					<text class="time">{{item.add_time | aa(item.add_time)}}	</text>
					</view>
						
					<!-- <view class="star">
						<text v-for="(item2,index2) in 5" class="iconfont icon-xingxing2" :class="item2<=4?'act':''"></text>
					</view> -->
						
				</view>
				<view class="right">
					<view class="con">{{item.content}}</view>
					<view class="img_wrap">
						<!-- {{images in item"}} -->
						<view class="img" v-show="item.images!==''">
								<image :src="item.images"></image>
						</view>
					</view>
					<view class="bot">
						<text class="attr">购买类型：大包</text>
						<!-- {{timeFormat(1111111111111)}} -->
					</view>
				</view>
			</view>
		</view>
		

		
	</view>
</template>

<script>
	import { get_goods_comment } from "@/API/index/index.js"
	import {timeFormat} from '@/utils/timeform.js'
	export default {
		data(){
			return{
				goods_id:'',
				skip: 0,
				limit: 10,
				
				
				goodsComment:[]
			}
		},
		methods:{
			getGoodsComment(){
				let {goods_id,limit,skip} = this
				get_goods_comment({goods_id,limit,skip}).then(res=>{
					console.log(res);
					
					this.goodsComment= res.data
					
					
				})
			}
		},
		filters:{
			
				
				aa(time){
				  return timeFormat(time)
				}
			
		},
		onLoad(options){
			this.goods_id = options.goods_id
			
			
			this.getGoodsComment()
		}
	}
</script>

<style lang="scss">
	page, .content{
		background:#fff;
	}

	/* 商品列表 */
	.goods-list{
		padding: 20rpx 30rpx ;
		.eva-box {
			display: flex;
			padding: 20upx 0;
			flex-wrap: wrap;
			border-bottom: 1px solid #eee;
			.eva_box_top{
				display: flex;
				width: 100%;
			}
			.portrait {
				flex-shrink: 0;
				width: 80upx;
				height: 80upx;
				border-radius: 100px;
				
			}
			.userInfo{
				display: flex;
				height: 80rpx;
				flex-direction: column;
				margin-left: 20rpx;
				justify-content: space-between;
			}
			.star{
				flex: 1;
				text-align: right;
				text{
					color: #aaa;
					&.act{
						color: #e33b2d;
					}
				}
			}
			.right {
				display: flex;
				flex-direction: column;
				font-size: #666;
				color: #666;
				padding-left: 100upx;
				
				.con {
					font-size: #666;
					color: #666;
					padding: 20upx 0;
				}
				.img_wrap{
					display: flex;
					flex-wrap: wrap;
					
				}
				.img{
					width: 180rpx;
					height: 180rpx;
					margin-right: 30rpx;
					margin-bottom: 30rpx;
					image{
						width: 180rpx;
						height: 180rpx;
					}
					
				}
				.bot {
					display: flex;
					justify-content: space-between;
					font-size: #666;
					color: #666;
				}
			}
		}
	}
	

</style>

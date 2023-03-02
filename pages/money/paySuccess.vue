<template>
	<view class="content">
		<view v-if="type==='yes'">
			<text class="success-icon yticon icon-xuanzhong2"></text>
			<text class="tit">支付成功</text>
		</view>
		<view v-if="type==='no'">
			<text class="success-icon yticon icon-xuanzhong2"></text>
			<text class="tit">支付失败</text>
		</view>

		<view class="btn-group">
			<navigator url="/pages/order/order?status=0" open-type="redirect" class="mix-btn">查看订单</navigator>
			<navigator url="/pages/index/index" open-type="switchTab" class="mix-btn hollow">返回首页</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: ''
			}
		},
		onLoad(option) {
			// let {type,orderId} = option;
			// console.log(option);
			this.type = option.type
			
			
			if(option.type !=='yes'){
				uni.setNavigationBarTitle({
					title:"支付遇到问题"
				})
				
			}

		}
	}
</script>

<style lang='scss'>
	.content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.success-icon {
		font-size: 160upx;
		color: #FDD100;
		margin-top: 100upx;
	}

	.tit {
		font-size: 38upx;
		color: #303133;
	}

	.btn-group {
		padding-top: 100upx;
	}

	.mix-btn {
		margin-top: 30upx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 600upx;
		height: 80upx;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;

		&.hollow {
			background: #fff;
			color: #303133;
			border: 1px solid #ccc;
		}
	}
</style>

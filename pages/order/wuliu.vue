<template>
	<view>
		<view class="quan">
			<view class="left">
				{{expArr.LogisticCode}}
			</view>
			<view class="right">
				<text>{{expArr.ShipperCode | express_com}}</text>
				<u-icon name="arrow-right" color="#000" size="20"></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
	import { wuliu } from "@/API/index/index.js"
	export default {
		data(){
			return {
				express_com:'',
				express_no:'',
				
				expArr:[]
			}
		},
		methods:{
			wuliuClick(){
				let {express_com,express_no} = this
				wuliu({express_com,express_no}).then(res=>{
					console.log(res);
					this.expArr = res.data.data
				})
			}
		},
		onLoad(option){
			console.log(option);
			this.express_com = option.express_com
			this.express_no = option.express_no
			
			this.wuliuClick()
		},
		filters:{
			// 快递
			express_com(val) {
				let express_data = {
					"HTKY": "百世快递",
					"STO": "申通快递",
					"YTO": "圆通速递",
					"HHTT": "天天快递"
				}
			
				// console.log(val);
			
				return express_data[val]
			},
		}
	}
</script>

<style lang="scss">
	.quan {
		display: flex;
		justify-content: space-between;
		height: 80rpx;
		align-items: center;
		padding: 15rpx;
		.right{
			display: flex;
		}
	}
	
</style>

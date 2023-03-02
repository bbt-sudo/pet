<template>
	<view class='container'>
		<view class="wrapper">
			<view class='mui-content input-content'>
				<view class='input-item'>
					<text class="tit">姓名</text>
					<input class='minput' v-model="addressInfo.name" type='text' placeholder='联系人姓名'></input>
				</view>

				<view class='input-item'>
					<text class="tit">手机</text>
					<input class='minput' v-model="addressInfo.tel" type='number' placeholder='请输入联系方式'></input>
				</view>

				<view id='showCityPicker3' class='input-item'>
					<text class="tit">地址</text>
					<input class='minput' type="warn" @tap="openAddres3" :placeholder="placeholderStr"
						disabled="ture"></input>
					<text class="iconfont icon-fanhui1"></text>
				</view>

				<view class='input-item'>
					<textarea class="xiangxi" v-model="addressInfo.detail" placeholder="请输入详细地址"
						placeholder-style="color:#999;" />
				</view>

				<view class="moren">
					<view class="uni-list">
						<view class="uni-list-cell uni-list-cell-pd">
							<view class="uni-list-cell-db">设为默认地址</view>
							<!-- <switch color="#FDD100" @click="delaClick" checked="true" class="kaiguan" /> -->
							<u-switch v-model="addressInfo.is_default" @change="change"></u-switch>
						</view>
					</view>
				</view>
			</view>
			<button class="confirm-btn" @click="submit">确认</button>


			<!-- 三级联动 -->
			<simple-address mask-bg-color="rgba(0, 0, 0, 0.4)" ref="simpleAddress"
				:pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm" themeColor="purple">
			</simple-address>
		</view>



	</view>
</template>

<script>
	import {
		saveAddress,
		get_addr_detail
	} from "@/API/index/index.js"
	export default {
		data() {
			return {

				placeholderStr: '请选择所属区域',

				addressInfo: {
					name: '', // 收货人姓名
					tel: '', // 手机号
					addr_text: '', // 地址
					addr_code: [], // 地区编码
					detail: '', // 详细地址
					is_default: false, // 设置默认地址
					uid: '', // uid
					addr_id: '' // 地址ID 有的话表示是修改地址 没得话是新增
				},

				cityPickerValueDefault: [0, 0, 1],

				

				// 编辑
			}
		},
		methods: {
			// 三级联动
			// 打开时触发
			openAddres3(e) {
				// 根据value 获取
				var index = this.$refs.simpleAddress.queryIndex([13, 1302, 130203], 'value');
				console.log(index);
				this.cityPickerValueDefault = index.index;
				this.$refs.simpleAddress.open();
				// console.log(e);
			},
			// 确认时触发
			onConfirm(e) {
				// this.pickerText = JSON.stringify(e); //这个步骤只是为了让大家看到返回的数据
				// 地址的名称
				this.addressInfo.addr_text = e.label.split('-').join(''); //获取具体的值
				console.log(this.addressInfo.addr_text);
				console.log(e);
				// 将地址的编号传上去
				this.addressInfo.addr_code = [e.provinceCode, e.cityCode, e.areaCode]
				console.log(this.addressInfo.addr_code);

				// 动态改变显示的文字
				this.placeholderStr = this.addressInfo.addr_text
			},
			
			// 修改
			getAddrDetail(){
				let uid = this.$store.state.user.uid
				let {addr_id} = this.addressInfo
				get_addr_detail({uid,_id:addr_id}).then(res=>{
					console.log(res);
					if(res.code === 1) {
						this.addressInfo = res.data[0]
						// console.log(this.data[0]);
						
						this.placeholderStr = res.data[0].addr_text
					}
				})
			},
			


			change(e) {
				console.log(e);

			},



// detail
			// 确认
			submit() {
				// console.log(this.addressInfo);
				let {
					addressInfo
				} = this
				
				let {name,tel,addr_code,addr_text,is_default,uid,addr_id,_id,detail} = addressInfo
				
				console.log(detail);
				
				
				if(!/^1[3-9]\d{9}$/.test(tel)){
					uni.$u.toast('手机号码格式错误');
					return;
				}
				
				saveAddress({name,tel,addr_code,addr_text,addr_id:_id,is_default,uid,detail}).then(res => {
					console.log(res);

					if (res.code === 1) {
						this.addressInfo.name = ''
						this.addressInfo.tel = ''
						this.addressInfo.addr_text = ''
						this.addressInfo.addr_code = []
						this.addressInfo.detail = ''
						this.addressInfo.is_default = false
						this.addressInfo.addr_id = ''
						this.placeholderStr = '请选择所属区域'
						
						
						this.$store.state.user.addressApi = !this.$store.state.user.addressApi
						// console.log(this.$store.state.user.addressApi);
						
						this.navTo('/pages/address/address')
					}

					console.log(this.addressInfo);
				})
			}

		},

		onLoad(options) {
			this.addressInfo.uid = this.$store.state.user.uid
			
			
			if (options.addr_id) {
				this.addressInfo.addr_id = options.addr_id
				// this.addressInfo = JSON.parse(options.item)
				// console.log(this.addressInfo);
				
				uni.setNavigationBarTitle({
					title:"编辑地址"
				});
				this.getAddrDetail()
				
			}

		}
	}
</script>


<style lang="scss">
	.uni-list-cell {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}


	.uni-input-placeholder {
		color: #999
	}

	.container {
		position: relative;
		width: 100vw;
		height: 90vh;
		overflow: hidden;
		background: #f7f7f7;
	}

	.input-content {
		background: #fff;
	}


	.input-item {
		position: relative;
		display: flex;
		flex-direction: row;
		align-items: center;
		height: auto;
		padding: 16upx 30upx;
		background: #fff;
		border-bottom: 1px solid #f5f5f7;

		&:last-child {
			margin-bottom: 0;
		}

		.pieckerInput {
			color: #333;
			width: calc(100% - 230upx);
			font-size: 30upx;
			display: inline-block;
			line-height: 60upx;
		}

		.xiangxi {
			width: 100%;
			height: 162upx;
			padding: 14upx 10upx;
			font-size: 30upx;
		}

		.tit {
			height: 60upx;
			line-height: 60upx;
			font-size: 30upx;
			color: $font-color-dark;
			width: 200upx
		}

		.iconfont {
			color: #999;
			line-height: 60upx;
			position: absolute;
			right: 30upx;
		}

		input {
			height: 60upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			flex: 1;
			width: calc(100% - 50upx);
			text-align: right;
		}

		.clear_input {
			position: absolute;
			right: 0;
			top: 10upx;
			padding: 10upx;

			.iconfont {
				font-size: 40upx;
				color: $font-color-light
			}
		}
	}

	.confirm-btn {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 100upx;
		line-height: 100upx;
		border-radius: 4px;
		background: $color1;
		color: #fff;
		font-size: $font-lg;

		&:after {
			border-radius: 100px;
			border: none;
		}
	}

	.moren {
		border-top: 20upx solid #f7f7f7;
		padding: 0 30upx;
		height: 110upx;
		line-height: 90upx;
		overflow: hidden;
		font-size: 30upx;

		.uni-list-cell-db {
			// float: left;
			color: #333;
			display: flex;
			justify-content: space-between;
			width: 100%;
		}

		.kaiguan {
			float: right;
		}
	}

	.allinfo {
		width: 100%;
		height: 100%;
		background: #fff;
	}

	.xzdz .box01 {
		width: 94%;
		height: 45px;
		border-bottom: 1px solid #f7f7f7;
		margin-left: 3%;
	}

	.xzdz .box01 input {
		width: 72%;
		height: 45px;
		float: right;
	}

	.xzdz .box01 text {
		width: 70px;
		line-height: 45px;

	}


	.xzdz .box01.mr .iconfont {
		line-height: 42px;
		font-size: 18px;
		vertical-align: middle;
	}

	.xzdz .box01.gouxuan .iconfont:before {
		color: #4499ee;
		content: "\e61e";
	}

	.allinfo .btn {
		width: 100%;
		height: 45px;
		line-height: 45px;
		background: #4499ee;
		border-radius: 0;
		position: fixed;
		bottom: 0;
		color: #fff;
		font-size: 16px;
	}

	.pickerMask {
		position: fixed;
		z-index: 1000;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
	}

	uni-switch .wx-switch-input:not([class*="bg-"]),
	uni-switch .uni-switch-input:not([class*="bg-"]) {}
</style>

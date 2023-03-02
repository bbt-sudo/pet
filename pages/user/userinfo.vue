<template>
	<view class="page-user">
		<view class="bgwhite">
			<view class="info_main">
				<view> 头像 </view>
				<view class="" style="width: 120upx; height: 120upx;">
					<avatar
						selWidth="400upx"
						selHeight="400upx"
						@upload="myUpload"
						:avatarSrc="editData.avatar || 'http://toutiao.longxiaokj.com/167696721752616255338477653013.jpg'"
						avatarStyle="width: 120upx; height: 120upx; "
					></avatar>
				</view>
			</view>
			<view class="info_cont">
				<view>昵称</view>
				<input class="color999" type="text" v-model="editData.nickname" placeholder="输入中文或英文，1~8个字" />
			</view>
			<view class="info_cont" @click="showSex = true;">
				<view>性别</view>
				<text class="iconfont icon-fanhui1"></text>
				<view class="color999 uni-input">{{editData.sex}}</view>
			</view>
			<picker mode="date" :value="editData.birthday" :start="startDate" :end="endDate" @change="bindDateChange">
				<view class="info_cont">
					<view>生日</view>
					<text class="iconfont icon-fanhui1"></text>
					<view class="color999 uni-input">{{editData.birthday}}</view>

					<!-- <view class="uni-input">{{date}}</view> -->
				</view>
			</picker>
			<view class="info_cont" @tap="openAddres3">
				<view>所在地</view>
				<text class="iconfont icon-fanhui1"></text>
				<view class="color999 uni-input">{{editData.addr}}</view>
			</view>
			<view class="info_cont">
				<view>手机号</view>
				<text class="iconfont icon-fanhui1"></text>
				<input class="color999" type="text" value="13112345678" disabled="true" />
			</view>
		</view>


		<view class="confirm-btn" @click="submit">确定</view>



		<!-- 选择性别------------------------------------------- -->
		<view>
			<u-action-sheet :show="showSex" :actions="actions" title="请选择性别" description="如果选择保密会报错"
				@close="showSex = false" @select="sexSelect">
			</u-action-sheet>
		</view>






		<view class="content">
			
			<!-- <button class="btns" type="warn" @tap="openAddres3">自定义：根据省市区“code”打开地址</button>
			<textarea v-model="pickerText" cols="30" rows="10"></textarea>
			 -->
			<simple-address ref="simpleAddress" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm"
				themeColor="#007AFF"></simple-address>
		</view>


	</view>
</template>

<script>
	import avatar from '../../components/yq-avatar/yq-avatar.vue';
	import {
		editUserInfo
	} from "@/API/index/index.js"
	export default {

		data() {

			return {

				 cityPickerValueDefault: [0, 0, 1],
				            pickerText: '',


				// 性别的显示和隐藏
				showSex: false,
				// 性别数据----------------------------------------------------
				actions: [{
						name: '男',
					},
					{
						name: '女',
					},
					{
						name: '保密',
					},
				],


				// 修改提交的数据
				editData: {
					avatar: '',
					nickname: '',
					sex: '请选择性别',
					birthday: '请选择生日',
					addr: '请选择地址',
					addr_code: [],
					uid: ''
				},



				// // 图片
				// fileList1: [],
				
				
				// tokenEdit:'',
				// file:[],
			}
		},
		components:{
			avatar
		},
		computed: {
			// 日期  生日
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods: {

			// 性别------------------------------------------------
			sexSelect(e) {
				this.editData.sex = e.name
				// this.$refs.form1.validateField('userInfo.sex')
			},
			// ------------------------------------------------------------

			// 生日-------------------------------------
			bindDateChange: function(e) {
				console.log(e);
				this.editData.birthday = e.detail.value
				console.log(this.editData.birthday);
			},

			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},

			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},

			// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -

			openAddres3() {
				// 根据value 获取
				var index = this.$refs.simpleAddress.queryIndex([13, 1302, 130203], 'value');
				console.log(index);
				this.cityPickerValueDefault = index.index;
				this.$refs.simpleAddress.open();
			},
			onConfirm(e) {
				console.log(e);
				this.pickerText = JSON.stringify(e);
				// console.log(e.label.split('-').join(''));
				this.editData.addr = e.label.split('-').join('')
				this.editData.addr_code = [e.provinceCode,e.cityCode,e.areaCode]
				console.log(this.editData.addr,this.editData.addr_code);
			},








			editUserInfoClick() {
				
			},
			
			
			 submit(){
					console.log(this.editData);
					
					editUserInfo(this.editData).then(res => {
						console.log(res);
						uni.$u.toast(res.msg)
						uni.navigateBack()
						
						this.$store.dispatch('get_userinfo')
					})
			},
			





			// 上传图片
			
			
			myUpload(e) {
				console.log(e);
				this.editData.avatar = e.path;
				this.$forceUpdate()
			},
			
			
			
			
			
			
			
			
			
			
			
			
			
			// getToken() {
			// 	uni.$u.http.get('https://d33a5037-6c63-4e92-8bb1-30018ab701ea.bspapp.com/http/upload/token').then(res => {
			// 		console.log(res);
			// 		this.tokenEdit = res.token
			// 	})
			// },
			// // 删除图片
			// deletePic(event) {
			// 	this[`fileList${event.name}`].splice(event.index, 1)
			// },
			// // 新增图片
			// async afterRead(event) {
			// 	console.log(event);
				
			// 	this.file = event.file[0]
			// 	console.log(this.file);
				
			// 	let {tokenEdit,file} = this
			// 	console.log(this.tokenEdit);
			// 	uni.$u.http.post('https://upload-z1.qiniup.com',{token:tokenEdit,file:file,key:+new Date() + file.name}).then(res=>{
			// 		console.log(res);
			// 	})
				
			// 	// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
			// 	let lists = [].concat(event.file)
			// 	console.log(lists);
			// 	let fileListLen = this[`fileList${event.name}`].length
			// 	lists.map((item) => {
			// 		this[`fileList${event.name}`].push({
			// 			...item,
			// 			status: 'uploading',
			// 			message: '上传中'
			// 		})
			// 	})
			// 	// for (let i = 0; i < lists.length; i++) {
			// 	// 	const result = await this.uploadFilePromise(lists[i].url)
			// 	// 	let item = this[`fileList${event.name}`][fileListLen]
			// 	// 	this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
			// 	// 		status: 'success',
			// 	// 		message: '',
			// 	// 		url: result
			// 	// 	}))
			// 	// 	fileListLen++
			// 	// }
			// },
			// uploadFilePromise(url) {
			// 	console.log(url);
			// 	return new Promise((resolve, reject) => {
			// 		let a = uni.uploadFile({
			// 			url: 'https://upload-z1.qiniup.com', // 仅为示例，非真实的接口地址
			// 			filePath: url,
			// 			name: 'file',
			// 			formData: {
			// 				user: 'test'
			// 			},
			// 			success: (res) => {
			// 				console.log(res);
			// 				setTimeout(() => {
			// 					resolve(res.data.data)
			// 				}, 1000)
			// 			}
			// 		});
			// 	})
			// },
			
			
			
			
			
			
		},
		onLoad() {
			
			// 获取用户的uid
			this.editData.uid = this.$store.state.user.uid			
			
			// this.getToken()
			let shuData = this.$store.state.user.userInfo
			console.log(shuData);
			this.editData.avatar = shuData.avatar
			this.editData.nickname = shuData.nickname
			this.editData.sex = shuData.sex
			this.editData.birthday = shuData.birthday
			this.editData.addr = shuData.addr
			this.editData.addr_code = shuData.addr_code
		
		}
	}
</script>

<style lang="scss">
	.bgwhite {
		background: #fff;
	}

	.page-user {
		width: 100%;
		height: 100%;

		.info_main {
			width: 100%;
			height: 151upx;
			position: relative;
			display: flex;
			justify-content: space-between;
			align-items: center;
			overflow: hidden;
			padding: 0 30upx;

			view {
				font-size: 30upx;
				color: #999999;
			}

			image {
				float: right;
				width: 94upx;
				height: 94upx;
				border-radius: 50%;
			}
		}

		.info_main:after {
			position: absolute;
			right: 0;
			bottom: 0;
			left: 0;
			height: 1px;
			content: '';
			-webkit-transform: scaleY(0.5);
			transform: scaleY(0.5);
			background-color: #eeeeee;
		}

		.info_cont {
			width: 100%;
			height: 101upx;
			position: relative;
			overflow: hidden;
			padding: 0 30upx;

			view {
				font-size: 30upx;
				line-height: 101upx;
				color: #999999;
				float: left;
			}

			.txt {
				display: block;
				width: auto;
				height: 101upx;
				float: right;
				text-align: right;
				margin-right: 10upx;
				font-size: 30upx;
				width: 500upx;
			}

			.uni-input,
			input {
				display: block;
				width: auto;
				height: 101upx;
				float: right;
				text-align: right;
				margin-right: 10upx;
				font-size: 30upx;
				width: 500upx;
			}

			text {
				font-size: 14upx;
				color: #bfbfbf;
				float: right;
				line-height: 101upx;
			}

			.iconfont {
				font-size: 28upx;
			}
		}

		.uni-input-placeholder {
			color: #999;
		}

		.info_cont:after {
			position: absolute;
			right: 0;
			bottom: 0;
			left: 0;
			height: 1px;
			content: '';
			-webkit-transform: scaleY(0.5);
			transform: scaleY(0.5);
			background-color: #eeeeee;
		}
	}

	.confirm-btn {
		width: 80%;
		height: 80upx;
		background: #fdd100;
		border-radius: 60upx;
		margin: 40upx auto;
		text-align: center;
		color: #fff;
		line-height: 80upx;
		font-size: 30upx;
	}
</style>

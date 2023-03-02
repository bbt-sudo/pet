<script>
	import {
		store
	} from '@/store/index.js'

	export default {
		onLaunch: function() {


			let baiArr = ['/', '/pages/index/search', '/pages/index/search_list',
				'/pages/category/list', '/pages/set/about',
				'/pages/set/contact', '/pages/set/set', '/pages/public/code_login', '/pages/public/reg',
				'/pages/public/forget',
				'/pages/product/product', '/pages/category/category',
				'/pages/user/user', '/pages/set/set', '/pages/public/login'
			]

			let list = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab']



			let user = this.$store.state.user

			


			function pan(url) {

				console.log(url)
				baiArr.indexOf(url)
				if (baiArr.indexOf(url) !== -1) {
					return true
				}
				return false
			}

			list.forEach(item => {
				// console.log(this.$store);
				uni.addInterceptor(item, {
					invoke(e) {
						let {
							uid,
							tokenExpired
						} = user
						let time = +new Date()



						console.log(uid);

						let url = e.url.split('?')[0]
						console.log(url);
						// 判断是否登录了 如果登录了就可以直接随便走


						if (!pan(url)) {

							if (uid) {
								if (time > tokenExpired) {
									uni.$u.toast('您长时间未登录，请再去登陆一下把')
									setTimeout(() => {
										uni.navigateTo({
											url: '/pages/public/login'
										})
									}, 300)
									uni.clearStorageSync()
									this.$store.commit('CLEAR_ORDER')
									return false
								}
								console.log(time);
								console.log(tokenExpired);
								return true
							} else {
								uni.$u.toast('请先登录')
								setTimeout(() => {
									uni.navigateTo({
										url: '/pages/public/login'
									})
								}, 300)
								return false
							}


						}

						// return true
					}
				})
			})


			// return true



		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "@/uni_modules/uview-ui/index.scss";
	@import 'static/style/icon.css';
	// @import 'static/style/main.css';
	// @import 'static/style/icon.css';
	@import 'https://at.alicdn.com/t/c/font_3906214_ua9bdqcp658.css';


	.container {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
	}

	.phcolor {
		color: #ccc;
		font-size: 32rpx;
	}

	button::after {
		border: none;
	}

	.ellipsis {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	/*列表统一样式 */

	.list-item {
		position: relative;
	}

	.list-item::after {
		content: '';
		position: absolute;
		border-bottom: 1upx solid #eaeef1;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		bottom: 0;
		right: 0;
		left: 30rpx;
	}

	.last::after {
		border-bottom: 0 !important;
	}

	/*按钮样式*/

	.btn-primary {
		width: 100%;
		height: 90rpx;
		line-height: 90rpx;
		background: linear-gradient(-90deg, #5677fc, #5c8dff);
		border-radius: 45rpx;
		color: #fff;
		font-size: 36rpx;
	}

	.btn-hover {
		color: #d5d4d9;
		background: linear-gradient(-90deg, #4a67d6, #4e77d9);
	}

	.btn-gray {
		background: #ededed;
		color: #999 !important;
	}

	.btn-gray-hover {
		background: #d5d5d5 !important;
		color: #898989;
	}

	.btn-white {
		background: #fff;
		color: #333 !important;
	}

	.tui-white-hover {
		background: #e5e5e5 !important;
		color: #2e2e2e !important;
	}

	.btn-disabled {
		color: #fafbfc !important;
		background: linear-gradient(-90deg, #cad8fb, #c9d3fb);
	}

	uni-swiper .uni-swiper-dot {
		display: inline-block;
		width: 16px;
		height: 3px;
		border-radius: 8px;
	}

	uni-page-head .uni-page-head__title {
		font-weight: normal;
		font-size: 18px !important;
	}

	// 暂无数据
	.empty {
		margin-top: 200upx;
		text-align: center;
		display: none;
	}

	.empty.act {
		display: block;
	}

	.empty image {
		width: 280upx;
		height: 200upx;
	}

	.empty text {
		font-size: 100upx;
		color: $color1;
	}

	.empty .cont {
		font-size: 24upx;
		margin-top: 20upx;
		color: #999;
	}

	view,
	scroll-view,
	swiper,
	swiper-item,
	cover-view,
	cover-image,
	icon,
	text,
	rich-text,
	progress,
	button,
	checkbox,
	form,
	input,
	label,
	radio,
	slider,
	switch,
	textarea,
	navigator,
	audio,
	camera,
	image,
	video {
		box-sizing: border-box;
	}

	.clamp {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: block;
	}

	.clamp2 {
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.common-hover {
		background: #f5f5f5;
	}

	/*边框*/
	.b-b:after,
	.b-t:after {
		position: absolute;
		z-index: 3;
		left: 0;
		right: 0;
		height: 0;
		content: '';
		transform: scaleY(0.5);
		border-bottom: 1px solid $border-color-base;
	}

	.b-b:after {
		bottom: 0;
	}

	.b-t:after {
		top: 0;
	}

	/* button样式改写 */
	uni-button,
	button {
		height: 80upx;
		line-height: 80upx;
		font-size: $font-lg + 2upx;
		font-weight: normal;

		&.no-border:before,
		&.no-border:after {
			border: 0;
		}
	}

	uni-button[type='default'],
	button[type='default'] {
		color: $font-color-dark;
	}

	/* input 样式 */
	.input-placeholder {
		color: #999999;
	}

	.placeholder {
		color: #999999;
	}

	/*
				全局公共样式和字体图标
			*/
	@font-face {
		font-family: yticon;
		font-weight: normal;
		font-style: normal;
		src: url('https://at.alicdn.com/t/font_1078604_w4kpxh0rafi.ttf') format('truetype');
	}

	.yticon {
		font-family: 'yticon' !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.icon-yiguoqi1:before {
		content: '\e700';
	}

	.icon-iconfontshanchu1:before {
		content: '\e619';
	}

	.icon-iconfontweixin:before {
		content: '\e611';
	}

	.icon-alipay:before {
		content: '\e636';
	}

	.icon-shang:before {
		content: '\e624';
	}

	.icon-shouye:before {
		content: '\e626';
	}

	.icon-shanchu4:before {
		content: '\e622';
	}

	.icon-xiaoxi:before {
		content: '\e618';
	}

	.icon-jiantour-copy:before {
		content: '\e600';
	}

	.icon-fenxiang2:before {
		content: '\e61e';
	}

	.icon-pingjia:before {
		content: '\e67b';
	}

	.icon-daifukuan:before {
		content: '\e68f';
	}

	.icon-pinglun-copy:before {
		content: '\e612';
	}

	.icon-dianhua-copy:before {
		content: '\e621';
	}

	.icon-shoucang:before {
		content: '\e645';
	}

	.icon-xuanzhong2:before {
		content: '\e62f';
	}

	.icon-gouwuche_:before {
		content: '\e630';
	}

	.icon-icon-test:before {
		content: '\e60c';
	}

	.icon-icon-test1:before {
		content: '\e632';
	}

	.icon-bianji:before {
		content: '\e646';
	}

	.icon-jiazailoading-A:before {
		content: '\e8fc';
	}

	.icon-zuoshang:before {
		content: '\e613';
	}

	.icon-jia2:before {
		content: '\e60a';
	}

	.icon-huifu:before {
		content: '\e68b';
	}

	.icon-sousuo:before {
		content: '\e7ce';
	}

	.icon-arrow-fine-up:before {
		content: '\e601';
	}

	.icon-hot:before {
		content: '\e60e';
	}

	.icon-lishijilu:before {
		content: '\e6b9';
	}

	.icon-zhengxinchaxun-zhifubaoceping-:before {
		content: '\e616';
	}

	.icon-naozhong:before {
		content: '\e64a';
	}

	.icon-xiatubiao--copy:before {
		content: '\e608';
	}

	.icon-shoucang_xuanzhongzhuangtai:before {
		content: '\e6a9';
	}

	.icon-jia1:before {
		content: '\e61c';
	}

	.icon-bangzhu1:before {
		content: '\e63d';
	}

	.icon-arrow-left-bottom:before {
		content: '\e602';
	}

	.icon-arrow-right-bottom:before {
		content: '\e603';
	}

	.icon-arrow-left-top:before {
		content: '\e604';
	}

	.icon-icon--:before {
		content: '\e744';
	}

	.icon-zuojiantou-up:before {
		content: '\e605';
	}

	.icon-xia:before {
		content: '\e62d';
	}

	.icon--jianhao:before {
		content: '\e60b';
	}

	.icon-weixinzhifu:before {
		content: '\e61a';
	}

	.icon-comment:before {
		content: '\e64f';
	}

	.icon-weixin:before {
		content: '\e61f';
	}

	.icon-fenlei1:before {
		content: '\e620';
	}

	.icon-erjiye-yucunkuan:before {
		content: '\e623';
	}

	.icon-Group-:before {
		content: '\e688';
	}

	.icon-you:before {
		content: '\e606';
	}

	.icon-forward:before {
		content: '\e607';
	}

	.icon-tuijian:before {
		content: '\e610';
	}

	.icon-bangzhu:before {
		content: '\e679';
	}

	.icon-share:before {
		content: '\e656';
	}

	.icon-yiguoqi:before {
		content: '\e997';
	}

	.icon-shezhi1:before {
		content: '\e61d';
	}

	.icon-fork:before {
		content: '\e61b';
	}

	.icon-kafei:before {
		content: '\e66a';
	}

	.icon-iLinkapp-:before {
		content: '\e654';
	}

	.icon-saomiao:before {
		content: '\e60d';
	}

	.icon-shezhi:before {
		content: '\e60f';
	}

	.icon-shouhoutuikuan:before {
		content: '\e631';
	}

	.icon-gouwuche:before {
		content: '\e609';
	}

	.icon-dizhi:before {
		content: '\e614';
	}

	.icon-fenlei:before {
		content: '\e706';
	}

	.icon-xingxing:before {
		content: '\e70b';
	}

	.icon-tuandui:before {
		content: '\e633';
	}

	.icon-zuanshi:before {
		content: '\e615';
	}

	.icon-zuo:before {
		content: '\e63c';
	}

	.icon-shoucang2:before {
		content: '\e62e';
	}

	.icon-shouhuodizhi:before {
		content: '\e712';
	}

	.icon-yishouhuo:before {
		content: '\e71a';
	}

	.icon-dianzan-ash:before {
		content: '\e617';
	}

	//控制uni-checkbox的图标
	uni-checkbox {
		position: relative;
	}

	uni-checkbox:not([disabled]) .uni-checkbox-input:hover {
		border-color: $theme-color;
	}

	uni-radio::before,
	uni-checkbox::before {
		content: '\e632';
		right: 2px;
	}

	/*每个页面公共css */
	.ellipsis {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	.text-line {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	/*修改复选框样式*/

	/* #ifdef H5 */
	checkbox .uni-checkbox-input {
		width: 38upx;
		height: 38upx;
		border-radius: 50%;
	}

	checkbox .uni-checkbox-input.uni-checkbox-input-checked {
		border: 1px solid #fdd100;
		background: #fdd100;
		color: #fff !important;
	}

	checkbox .uni-checkbox-input.uni-checkbox-input-checked:before {
		font-size: 18px;
	}

	radio .uni-radio-input {
		width: 38upx;
		height: 38upx;
		border-radius: 50%;
	}

	radio .uni-radio-input.uni-radio-input-checked {
		border: 1px solid #fdd100;
		background: #fdd100;
		color: #fff !important;
	}

	radio .uni-radio-input.uni-radio-input-checked:before {
		font-size: 18px;
	}

	/* #endif */

	/* #ifdef APP-PLUS || MP-WEIXIN */
	checkbox .wx-checkbox-input {
		width: 38upx;
		height: 38upx;
		border-radius: 50%;
	}

	checkbox .wx-checkbox-input.wx-checkbox-input-checked {
		border: 1px solid #fdd100;
		background: #fdd100;
		color: #fff !important;
	}

	checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
		font-size: 18px;
	}

	radio .wx-radio-input {
		width: 38upx;
		height: 38upx;
		border-radius: 50%;
	}

	radio .wx-radio-input.wx-radio-input-checked {
		border: 1px solid #fdd100;
		background: #fdd100;
		color: #fff !important;
	}

	radio .wx-radio-input.wx-radio-input-checked::before {
		font-size: 18px;
	}

	/* #endif */
</style>

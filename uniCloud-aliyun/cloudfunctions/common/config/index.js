const path = require('path')
module.exports = {
	// 微信小程序端对应的微信支付及登录配置配置
	wxConfigMp: {
		appId: 'wxa22a61fec0c6cdcd',
		secret: 'bef8d8778311011fb1c2342038cf65c6',
		mchId: '1533439801',
		key: '20882313179428666',
	},
	// App端对应的微信支付配置
	wxConfigApp: {
		appId: 'wxa1708667f04d03d8',
		mchId: '1533439801',
		key: '20882313179428666',
	},
	// 微信PC网站支付
	wxConfigH5: {
		appId: '',
		mchId: '',
		key: '',
	},
	// 支付宝小程序端对应的支付宝支付及登录配置
	aliConfigMp: {
		mchId: "",
		appId: "",
		alipayPublicKey: "",
		privateKey: "",
	},
	// App端对应的支付宝支付配置
	aliConfigApp: {
		mchId: "",
		appId: "",
		keyType:'',
		alipayPublicKey: "",
		privateKey:""
	},
	aliConfigH5: {
		mchId: "",
		appId: "",
		keyType:'',
		alipayPublicKey:"",
		privateKey:""
	}
}

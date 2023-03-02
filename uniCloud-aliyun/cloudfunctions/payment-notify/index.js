'use strict';
const {
	wxConfigMp,
	wxConfigApp,
	wxConfigH5,
	aliConfigMp,
	aliConfigApp,
	aliConfigH5,
	// aliConfigSandbox
} = require('config')
const uniPay = require('unipay')
const db = uniCloud.database();
const dbCmd = db.command;
exports.main = async (event, context) => {
	let uniPayInstance
	let provider
	switch (event.path.substring(1)) {
		case 'wxpay_mp-weixin':
			provider = 'weixin'
			uniPayInstance = uniPay.initWeixin(wxConfigMp)
			break;
		case 'wxpay_app-plus':
			provider = 'weixin'
			uniPayInstance = uniPay.initWeixin(wxConfigApp)
			break;
		case 'wxpay_h5':
			provider = 'weixin'
			uniPayInstance = uniPay.initWeixin(wxConfigH5)
			break;
		case 'alipay_mp-alipay':
			provider = 'alipay'
			uniPayInstance = uniPay.initAlipay(aliConfigMp)
			break;
		case 'alipay_app-plus':
			provider = 'alipay'
			uniPayInstance = uniPay.initAlipay(aliConfigApp)
			break;
		case 'alipay_h5':
			provider = 'alipay'
			uniPayInstance = uniPay.initAlipay(aliConfigH5)
			// uniPayInstance = uniPay.initAlipay(aliConfigSandbox)
			break;
		default:
			console.log('---------参数错误-------')
			return {
				code: -1,
				msg: '参数错误'
			}
	}
	let verifyResult = await uniPayInstance.verifyPaymentNotify(event)
	if (!verifyResult) {
		console.log('---------!verifyResult-------')
		return {}
	}
	let {
		outTradeNo,
		totalFee,
		transactionId,
		resultCode
	} = verifyResult
	
	const orderList = await db.collection('xl_order').where({
		order_sn:outTradeNo
	}).get()
	
	
	if (orderList.data.length < 0) {
		console.log('---------orderList.data.length < 0-------')
		return {}
	}
	
	const orderDetail = orderList.data[0]
	// 

	if (totalFee === orderDetail.all_amount*100 && (resultCode === 'SUCCESS' || resultCode === 'FINISHED')) {
		console.log('---------updatedb-------')
		await db.collection('xl_order').where({
			order_sn:outTradeNo
		}).update({
			status: 2,//  订单状态改成已支付  
			pay_time: new Date().getTime(),
			transactionId
		})
	}
	// 注意如果处理成功需要严格按照下面的格式进行返回，否则厂商会持续通知
	
	

	
	// let xl_goods = db.collection('xl_goods')
	// //减库存
		
	// let goods_datas = orderDetail.goods;
	// for (let i = 0; i < goods_datas.length; i++) {
		
	// 	let v = goods_datas[i];
	// 	let stock = v.num-0;
		
	// 	console.log('------------------'+stock+'---------------------------')
	// 	if (v.attr) {
			
	// 		await xl_goods.where({
	// 			_id: v.goods_id,
	// 			'table.text': v.attr.split(',')
	// 		}).update({
	// 			'table.$.stock': dbCmd.inc(-stock)
	// 		})
		
	// 	} else {
	// 		await xl_goods.where({
	// 			_id: v.goods_id
	// 		}).update({
	// 			stock: dbCmd.inc(-stock)
	// 		})
		
		
	// 	}
		
	// }
	
	if (provider === 'weixin') {
		// 微信处理成功之后 
		return {  
			statusCode: 200,  
			headers: {  
					'content-type': 'text/xml;charset=utf-8'  
			},  
			body: `<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>`  
		}
	}
	// 支付宝处理成功后  
	
	// 一直发  1分钟  3分钟 5分钟  
	
	return {  
	  statusCode: 200,
	  headers: {  
	    'content-type': 'text/plain'  
	  },  
	  body: "success"
	}


};

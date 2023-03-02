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

console.log(aliConfigApp)

const BigNumber = require('bignumber');
const {
	md5Hex,
	querystring
} = require('kd');



//节省 云函数数量  
const db = uniCloud.database();
const uniID = require('uni-id');
const uniPay = require('unipay')
const xl_user = db.collection('uni-id-users');
const xl_order = db.collection('xl_order');
const xl_cart = db.collection('xl_cart');
const xl_addr = db.collection('xl_addr');
const xl_goods = db.collection('xl_goods');
const xl_comment = db.collection('xl_comment');
const dbCmd = db.command;



const modules = {

	getAddrList: async (param) => {
		let {
			uid,
			token
		} = param;

		if (!uid) {
			return {
				code: 20001,
				msg: "请先登录"
			}
		}
		let res = await xl_addr.where({
			uid
		}).get();

		if (res.data) {
			return {
				code: 1,
				data: res.data
			}
		} else {
			return {
				code: 0,
				data: res.data
			}
		}


	},
	saveAddress: async (param) => {
		let {
			name,
			tel,
			addr_text,
			addr_code,
			detail,
			is_default,
			uid,
			addr_id,
			token
		} = param;


		if (!uid) {
			return {
				code: 20001,
				msg: "请先登录"
			}
		}


		if (is_default) {

			await xl_addr.where({
				uid,
				is_default: true
			}).update({
				is_default: false
			});

		}
		// 有addr_id  算修改   没有算新增
		let res = {};
		if (!addr_id) {
			res = await xl_addr.add({
				name,
				tel,
				addr_text,
				addr_code,
				detail,
				is_default,
				uid
			});

		} else {

			res = await xl_addr.where({
				_id: addr_id
			}).update({
				name,
				tel,
				addr_text,
				addr_code,
				detail,
				is_default,
				uid
			});
		}


		return {
			code: 1,
			msg: addr_id ? '修改成功' : '添加成功',
			data: res.data
		};

	},
	async get_addr_detail(param) {

		let {
			uid,
			_id
		} = param;

		let res = await xl_addr.where({
			_id,
			uid
		}).get();

		return {
			code: 1,
			data: res.data
		}
	},
	async del_addr(param) {

		let {
			uid,
			_id
		} = param;

		let res = await xl_addr.doc(_id).remove();
		return {
			code: 1,
			msg: '删除成功',
			data: res
		};

	},
	async get_default_addr(param) {

		let {
			uid
		} = param;

		let res = await xl_addr.where({
			uid,
			is_default: dbCmd.in([true, 'true', 1, '1'])
		}).get();

		return {
			code: 1,
			msg: "获取成功",
			data: res.data
		}


	},
	async set_default_addr(param) {

		let {
			uid,
			_id
		} = param;


		await xl_addr.where({
			uid
		}).update({
			is_default: false
		});

		let res = await xl_addr.doc(_id).update({
			is_default: true
		});
		return {
			code: 1,
			msg: "设置成功",
			data: res.data
		};

	},
	async checkOrder(param) {

		let {
			uid,
			cart_id,
			token,
			type
		} = param;


		if (!uid) {
			return {
				code: 20001,
				msg: "请先登录"
			}
		}


		let base_money = 0;
		let goods = [];
		let all_amount = 0;
		let reduction = 0; //满减
		let shipping = 0; //运费
		cart_id = cart_id.split(',');


		let cartList = await xl_cart.where({
			uid,
			_id: dbCmd.in(cart_id)
		}).get();


		let goods_ids = cartList.data.map(v => {
			return v.goods_id
		});


		let goods_res = await xl_goods.where({
			_id: dbCmd.in(goods_ids)
		}).get();


		cartList.data.forEach(v => {

			let _goods_data = goods_res.data.find(a => {
				return a._id == v.goods_id
			});

			let table = _goods_data.table;

			let goods_obj = {};

			//查库存
			if (table.length == 0) {

				goods_obj.price = _goods_data.price;

			} else {

				for (let i = 0; i < table.length; i++) {
					if (table[i].text.join() == v.attr) {
						goods_obj.price = table[i].price;
						break;
					}
				}
			}


			goods_obj.name = _goods_data.name;
			goods_obj.img = _goods_data.img;
			goods_obj.num = v.num;
			goods_obj.attr = v.attr;
			goods.push(goods_obj);

			let fee = new BigNumber(goods_obj.price).times(v.num).plus(base_money)
			base_money = Number(fee.toString())
			//  let fee = goods_obj.price*goods_obj.num;
			// base_money +=  fee
		})

		all_amount = base_money - reduction + shipping;

		let obj = {
			base_money,
			all_amount,
			goods,
			reduction,
			shipping
		};

		if (type == 'buy') {
			await xl_cart.where({
				_id: cart_id[0]
			}).update({
				status: 2
			})
		}

		return {
			code: 1,
			msg: '获取成功',
			data: obj
		};

	},
	async submitOrder(param) {

		let {
			uid,
			cart_id,
			desc,
			address,
			token
		} = param;




		let oDate = new Date();


		let order_sn = oDate.getFullYear() +
			(oDate.getMonth() + 1 < 10 ? ('0' + oDate.getMonth() + 1) : oDate.getMonth() + 1) +
			(oDate.getDate() < 10 ? '0' + oDate.getDate() : oDate.getDate()) + oDate.getTime();


		let base_money = 0;
		let goods = [];
		let all_amount = 0;
		let reduction = 0; //满减
		let shipping = 0; //运费
		cart_id = cart_id.split(',');


		let cartList = await xl_cart.where({
			uid,
			_id: dbCmd.in(cart_id)
		}).get();



		// cartList.data.forEach(v => {
		// 	goods.push(v);
		// 	base_money += (v.price * 1000 * v.num) / 1000;
		// });


		let goods_ids = cartList.data.map(v => {
			return v.goods_id
		});


		let goods_res = await xl_goods.where({
			_id: dbCmd.in(goods_ids)
		}).get();


		cartList.data.forEach(v => {

			let _goods_data = goods_res.data.find(a => {
				return a._id == v.goods_id
			});

			let table = _goods_data.table;

			let goods_obj = {};

			//查库存
			if (table.length == 0) {

				goods_obj.price = _goods_data.price;

			} else {

				for (let i = 0; i < table.length; i++) {
					if (table[i].text.join() == v.attr) {
						goods_obj.price = table[i].price;
						break;
					}
				}
			}

			goods_obj.goods_id = v.goods_id;
			goods_obj.name = _goods_data.name;
			goods_obj.img = _goods_data.img;
			goods_obj.num = v.num;
			goods_obj.attr = v.attr;
			goods.push(goods_obj);
			let fee = new BigNumber(goods_obj.price).times(v.num).plus(base_money)
			base_money = Number(fee.toString())

			// let fee = goods_obj.price*goods_obj.num;
			// base_money +=  fee

		})

		//base_money  商品金额合计
		
		
		//status 状态("1":"未支付",
		//  "2":"待发货",
		//  "3":"待收货",
		//  "5":"退款",
		//  "6":"待评价",
		//  "7":"已评价"
		//  "8":"已取消"
		//shipping  先定为0  包邮
		//reduction 满减
		//coupon  	红包
		//coupon_id  用的红包ID
		//all_amount   最后的金额
		//pay_type  支付方式 0  未选择  1 支付宝  2微信
		if (goods.length === 0) {
			return {
				code: -1,
				msg: "网络错误，请重试"
			}
		}

		all_amount = base_money - reduction + shipping;
		let res = await xl_order.add({
			uid,
			order_sn,
			base_money,
			shipping: 0,
			goods,
			reduction,
			coupon: '',
			coupon_id: '',
			all_amount,
			pay_type: 0,
			remarks: '',
			status: 1,
			desc,
			address,
			add_time: oDate.getTime(),
			update_time: oDate.getTime(),
			pay_time: ''

		});

		if (res.id) {
			//  减库存
			for (let i = 0; i < goods.length; i++) {

				let v = goods[i];
				let stock = v.num - 0;

				console.log('------------------' + stock + '---------------------------')
				if (!v.attr || v.attr == '暂无属性') {


					await xl_goods.doc(v.goods_id).update({
						stock: dbCmd.inc(-stock)
					})

				} else {
					await xl_goods.where({
						_id: v.goods_id,
						'table.text': v.attr.split(',')
					}).update({
						'table.$.stock': dbCmd.inc(-stock)
					})

				}

			}


			// 删除购物车
			await xl_cart.where({
				uid,
				_id: dbCmd.in(cart_id)
			}).update({
				status: 2
			})



			return {
				code: 1,
				data: res.id
			}


		} else {

			return {
				code: 0,
				msg: "加入失败"
			}
		}



	},
	async getOrderList(param) {
		let {
			uid,
			status,
			skip,
			limit
		} = param;

		if (!uid) {

			return {
				code: 0,
				msg: "您还未登录"
			}
		}

		let _where = {
			"is_del": dbCmd.neq(1)
		};

		if (status == 0) {

			_where.status = dbCmd.in([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
		} else if (status == 7 || status == 6) {
			_where.status = dbCmd.in([6, 7])
		} else {
			_where.status = status - 0;
		}

		_where.uid = uid;


		let count = await xl_order.where(_where).count();
		let res = await xl_order.skip(skip - 0).limit(limit - 0).where(_where).orderBy("update_time", "desc").get();


		return {
			code: 1,
			data: res.data,
			count: count.total
		}

	},
	async get_all_order(param) {
		let {

		} = param;
		let res = await xl_order.where({}).get();
		return {
			code: 1,
			data: res.data
		}

	},
	async getOrderDetail(param) {

		let {
			uid,
			orderId,
			token
		} = param;

		if (!uid) {

			return {
				code: 20030,
				msg: '请登录'
			}
		}
		if (!orderId) {

			return {
				code: 20031,
				msg: '参数错误'
			}
		}

		let res = await xl_order.where({
			uid,
			_id: orderId
		}).get();
		return {
			data: res.data,
			code: 1
		};

	},
	//支付订单
	async payOrder(param) {

		let {
			pay_type,
			orderId,
			platform //平台  H5  MP   APP
		} = param;


		// let {
		// 	provider,
		// 	outTradeNo,
		// 	uniIdToken
		// } = event
		// context.CLIENTUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
		// context.PLATFORM = 'h5'
		// provider = 'alipay'
		// outTradeNo = '1596269911e39a6d9c'
		// uniIdToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI1ZjA2OTk0N2UwM2VhYzAwMDEzYjg3ODEiLCJjbGllbnRJZCI6IjE5NWY3N2MxODBjMjNlM2Y1YThhOGYzOGU0MjkwMTg2IiwiaWF0IjoxNTk2MjY3NDkzLCJleHAiOjE1OTYyNzQ2OTN9.dIGtnn3sY3KDI4L5pFXOIBjEaaFEcYUz6EBgPEfEooE'



		const orderList = await xl_order.where({
			_id: orderId
		}).get();

		if (orderList.data.length !== 1 || orderList.data[0].status !== 1) {
			return {
				code: -2,
				msg: '订单状态不正确'
			}
		}

		await xl_order.where({
			_id: orderId
		}).update({
			pay_type
		})


		let uniPayInstance,
			notifyUrl =
			`https://4de16698-d9f4-443a-b416-ef1037cce952.bspapp.com/http/payment-notify/${pay_type}_${platform}`,
			openid,
			tradeType;


		// notifyUrl为接收通知的云函数的url，云函数Url化请参考：https://uniapp.dcloud.io/uniCloud/http
		switch (pay_type + '_' + platform) {
			// case 'wxpay_mp-weixin':
			// 	uniPayInstance = uniPay.initWeixin(wxConfigMp)
			// 	openid = userInfo.wx_openid['mp-weixin']
			// 	tradeType = 'JSAPI'
			// 	break;
			// case 'alipay_mp-alipay':
			// 	uniPayInstance = uniPay.initAlipay(aliConfigMp)
			// 	openid = userInfo.ali_openid
			// 	break;
			case 'wxpay_app-plus':
				uniPayInstance = uniPay.initWeixin(wxConfigApp)
				tradeType = 'APP'
				break;
			case 'alipay_app-plus':
				uniPayInstance = uniPay.initAlipay(aliConfigApp)
				tradeType = 'APP'
				break;
			case 'wxpay_h5':
				uniPayInstance = uniPay.initWeixin(wxConfigH5)
				tradeType = 'NATIVE'
				break;
			case 'alipay_h5':
				uniPayInstance = uniPay.initAlipay(aliConfigH5)
				// uniPayInstance = uniPay.initAlipay(aliConfigSandbox)
				tradeType = 'NATIVE'
				break;
			default:
				return {
					code: -1,
					msg: '参数错误'
				}
		}

		let {
			all_amount,
			order_sn,
			goods
		} = orderList.data[0];

		let orderInfo;
		all_amount = all_amount * 100;

		// 请填写对应平台接收通知云函数对应的云函数url化地址，云函数url化请参考：https://uniapp.dcloud.io/uniCloud/http
		try {
			// 获取支付信息
			//请求ali  wx
			orderInfo = await uniPayInstance.getOrderInfo({
				openid, // App端支付时不需要openid，传入个undefined也没有影响
				outTradeNo: order_sn,  //交给第三方用的
				totalFee: all_amount, //钱
				subject: order_sn, //订单编号 
				body: goods.length > 1 ? goods[0].name + '等' + goods.length + '个商品' : goods[0].name,
				notifyUrl, //回调地址  支付宝或者微信  收到了你的支付信息 给你这个回调地址发信息  咱们监控着回调地址  如果收到了某一比订单，对账  证明支付成功了
				tradeType  //NATIVE  h5

			})
		} catch (e) {
			console.log(e.message)
			return {
				code: -3,
				msg: '获取支付信息失败，请稍后再试' + e.message
			}
		}
		return {

			code: 1,
			data: {
				outTradeNo: order_sn,
				orderInfo
			}
		}









		let goods_datas = await xl_order.doc(orderId).field({
			goods: true
		}).get();


		//减库存

		goods_datas = goods_datas.data[0].goods;
		for (let i = 0; i < goods_datas.length; i++) {

			let v = goods_datas[i];
			if (v.attr) {

				await xl_goods.where({
					_id: v.goods_id,
					'table.text': v.attr.split(',')
				}).update({
					'table.$.stock': dbCmd.inc(-v.num)
				})

			} else {

				await xl_goods.where({
					_id: v.goods_id
				}).update({
					stock: dbCmd.inc(-v.num)
				})


			}

		}


		return {
			code: 1,
			msg: "更新成功",
			data: res.data
		}




	},
	async cancel_order(param) {
		let {
			orderId,
			cancel_text
		} = param;


		let goods = await xl_order.where({
			_id: orderId
		}).field({
			goods: true
		}).get();

		//拿到订单里的商品
		goods = goods.data;

		let goods_list = []
		goods.forEach(v => {
			goods_list.push(...v.goods)

		})
		//加库存操作
		for (let i = 0; i < goods_list.length; i++) {

			let v = goods_list[i];
			let stock = v.num - 0;

			if (!v.attr || v.attr == '暂无属性') {


				await xl_goods.doc(v.goods_id).update({
					stock: dbCmd.inc(+stock)
				})

			} else {
				await xl_goods.where({
					_id: v.goods_id,
					'table.text': v.attr.split(',')
				}).update({
					'table.$.stock': dbCmd.inc(+stock)
				})

			}

		}





		let res = await xl_order.where({
			_id: orderId
		}).update({
			cancel_text,
			status: 8
		})

		return {
			code: 1,
			data: res,
			msg: "取消成功"
		}
	},
	async del_order(param) {
		let {
			orderId
		} = param;
		let res = await xl_order.where({
			_id: orderId
		}).update({
			is_del: 1
		})
		return {
			code: 1,
			data: res,
			msg: "删除成功"
		}
	},
	async send(param) {

		let {
			orderId,
			express_com,
			express_no
		} = param;

		let res = await xl_order.where({
			_id: orderId
		}).update({
			express_com,
			express_no,
			status: 3
		});

		return {
			code: 1,
			data: res
		}
	},
	async shouhuo(param) {

		let {
			orderId
		} = param;

		let res = await xl_order.where({
			_id: orderId
		}).update({
			status: 6
		});

		return {
			code: 1,
			data: res
		}
	},
	async saveOrderEvaluateAdd(param) {
		let {
			goods_id,
			content,
			score,
			images,
			uid,
			attr,
			orderId
		} = param;

		if (!goods_id || !content || !score || !uid) {

			return {
				code: 0,
				msg: "参数错误"
			}
		}

		if (Array.isArray(images)) {
			images = images.join(',')
		}

		let userInfo = await xl_user.where({
			_id: uid
		}).field({
			username: true,
			avatar: true,
			nickname: true
		}).get();



		let res = await xl_comment.add({
			goods_id,
			content,
			score,
			images,
			uid,
			attr,
			orderId,
			add_time: new Date().getTime(),
			userInfo: userInfo.data[0]
		});

		await xl_order.where({
			_id: orderId
		}).update({
			status: 7
		})

		return {

			code: 1,
			msg: '提交成功',

		}
	},
	async query_order(param) {

		const {
			order_id,
			platform
		} = param;


		let orderDetail = await xl_order.where({
			_id: order_id
		}).get();

		let outTradeNo = orderDetail.data[0].order_sn;

		if (orderDetail.data.length === 0) {
			return {
				code: -2,
				msg: '订单不存在'
			}
		}

		let goods_datas = orderDetail.data[0].goods;
		// for (let i = 0; i < goods_datas.length; i++) {

		// 	let v = goods_datas[i];
		// 	let stock = v.num-0;

		// 	console.log('------------------'+stock+'---------------------------')
		// 	if (v.attr) {

		// 		await xl_goods.where({
		// 			_id: v.goods_id
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

		// 订单状态可能已经被接收平台通知的接口修改
		if (orderDetail.data[0].status == 2) {
			return {
				code: 1,
				msg: "支付成功"
			}
		}

		const provider = orderDetail.data[0].pay_type

		let uniPayInstance
		switch (provider + '_' + platform) {
			case 'wxpay_mp-weixin':
				uniPayInstance = uniPay.initWeixin(wxConfigMp)
				break;
			case 'wxpay_app-plus':
				uniPayInstance = uniPay.initWeixin(wxConfigApp)
				break;
			case 'wxpay_h5':
				uniPayInstance = uniPay.initWeixin(wxConfigH5)
				break;
			case 'alipay_mp-alipay':
				uniPayInstance = uniPay.initAlipay(aliConfigMp)
				break;
			case 'alipay_app-plus':
				uniPayInstance = uniPay.initAlipay(aliConfigApp)
				break;
			case 'alipay_h5':
				uniPayInstance = uniPay.initAlipay(aliConfigH5)
				// uniPayInstance = uniPay.initAlipay(aliConfigSandbox)
				break;
			default:
				return {
					code: -1,
					msg: '参数错误'
				}
		}

		let queryResult = await uniPayInstance.orderQuery({
			outTradeNo
		})

		if (queryResult.tradeState === 'SUCCESS' || queryResult.tradeState === 'FINISHED') {
			await order.where({
				outTradeNo
			}).update({
				status: 2,
				transactionId: queryResult.transactionId
			})
			return {
				code: 1,
				msg: "支付成功"
			}
		}
		return {
			code: 0,
			msg: "支付失败"
		}



	},
	async wuliu(param) {

		let {
			express_com,
			express_no
		} = param;

		let obj = {
			"HTKY": "百世快递",
			"STO": "申通快递",
			"YTO": "圆通速递",
			"HHTT": "天天快递"
		}

		if (!(express_com in obj)) {

			return {
				code: 0,
				msg: "请输入正确的快递公司编码（如申通填写STO）,免费版支持的快递公司编码如下：" + JSON.stringify(obj)
			}
		}






		// // 顺丰速运	SF
		// // 百世快递	HTKY
		// // 中通快递	ZTO
		// // 申通快递	STO
		// // 圆通速递	YTO
		// // 韵达速递	YD
		// // 邮政快递包裹	YZPY
		// // EMS	EMS
		// // 天天快递	HHTT
		// // 京东快递	JD
		// // 优速快递	UC
		// // 德邦快递	DBL
		// // 宅急送	ZJS

		//请求url --正式地址
		const Url = 'https://api.kdniao.com/Ebusiness/EbusinessOrderHandle.aspx'
		//电商加密私钥，快递鸟提供，注意保管，不要泄漏 
		const AppKey = 'a41716d9-8fb4-47b7-9a28-6633cfce7d38'; //请登陆快递鸟用户管理后台查看：http://kdniao.com/UserCenter/UserHome.aspx
		// //电商ID 
		const EBusinessID = '1699160'; //请登陆快递鸟用户管理后台查看：http://kdniao.com/UserCenter/UserHome.aspx



		function getParams() {
			//请求接口指令
			const RequestType = '1002';
			const RequestData = {
				'OrderCode': '',
				ShipperCode: express_com,
				LogisticCode: express_no
			}
			const DataSign = Buffer.from(md5Hex(JSON.stringify(RequestData) + AppKey)).toString('base64')
			const reqParams = {
				RequestType,
				EBusinessID,
				DataSign,
				RequestData: JSON.stringify(RequestData),
				DataType: 2
			}
			return reqParams
		} //请求参数



		const res = await uniCloud.httpclient.request(Url, {
			method: 'POST',
			data: querystring.stringify(getParams()),
			dataAsQueryString: true,
			contentType: 'application/x-www-form-urlencoded',
			dataType: 'json'
		})

		return {
			code: 1,
			data: res
		};


	}


}
//搞定参数
exports.main = async (event, context) => {
	let platform = event.headers.platform;
	let token = event.headers.token;
	//event为客户端上传的参数
	let param = {};
	let body = event.body;
	let module = event.path.slice(1);
	if (body) {
		//POST  
		if (event.isBase64Encoded) {
			body = Buffer.from(body)
		}
		param = JSON.parse(body)
	} else if (event.queryStringParameters) {
		param = event.queryStringParameters
	}
	let payload = await uniID.checkToken(token);

	if (payload.code && payload.code > 0) {
		return {
			op: 'token 检查失败',
			...payload
		}
	}

	if (!modules[module]) {
		//404
		return {
			"mpserverlessComposedResponse": true, // 使用阿里云返回集成响应是需要此字段为true
			"statusCode": 404,
		}

	}
	//参数传给下边的函数
	param.platform = platform;
	let result = await modules[module](param);
	result._token = payload.token;
	result.tokenExpired = payload.tokenExpired;
	return result
};

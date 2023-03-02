'use strict';

//节省 云函数数量  
const db = uniCloud.database();
const uniID = require('uni-id');

const user_table = db.collection('uni-id-users');
const dbCmd = db.command;

function S(data, msg = "ok") {
	return {
		code: 1,
		msg,
		data
	}
}

function E(data = null, msg = "失败") {

	return {
		code: 0,
		msg,
		data
	}

}
const modules = {

	async reg(param) {

		let {
			username,
			password,
			vercode
		} = param;
		//验证一下验证码
		const check = await uniID.verifyCode({
			mobile: username,
			code: vercode,
			type: 'register'
		})

		if (check.code == 0) {
			//如果对  就去注册了
			const res = await uniID.register({
				username,
				password
			})
			res.userInfo = {
				_id: res.uid,
				username: res.username
			}
			return res

		} else {
			//返回不对的信息
			return check
		}
	},
	async sendSms(param) {
		let {
			mobile,
			type
		} = param;

		let user_check = await user_table.where({
			username: mobile
		}).get();

		let has_user = user_check.data.length > 0;

		//如果用户已经存在了,还去注册,那就是重复注册，
		if (has_user && type == 'register') {
			return {
				code: 1,
				msg: "账号已经存在"
			}
		}
		//如果是去登录或者重置密码  需要先判断手机号是否已经注册过  没注册过的直接返回
		if (!has_user && type == 'login') {
			return {
				code: 1,
				msg: "手机号还未注册"
			}
		}

		const randomStr = '00000' + Math.floor(Math.random() * 1000000)
		const code = randomStr.substring(randomStr.length - 6)
		const res = await uniID.sendSmsCode({
			mobile,
			templateId: "10638",
			code,
			type
		})
		return res;
	},
	async login(param) {

		let {
			username,
			password
		} = param;

		const res = await uniID.login({
			username,
			password
		})
		return res
	},
	//验证码登录
	async code_login(param) {
		let {
			username,
			vercode
		} = param;

		let res = await user_table.where({
			username
		}).get();

		if (res.data.length == 0) {
			return {
				code: 80301,
				msg: "请您先注册"
			};
		}

		const now = Date.now();
		let check = await db.collection('opendb-verify-codes').where({
			mobile: username,
			type: "login",
			code:vercode,
			state: 0,
			expired_at: dbCmd.gt(now)
		}).orderBy('created_at', 'desc').limit(1).get();

		if (check && check.data && check.data.length > 0) {

			const matched = check.data[0]
			// 状态改为已验证
			const upRes = await db.collection('opendb-verify-codes').doc(matched._id).update({
				state: 1
			})


			let userInfo = res.data[0];
			return {
				code: 0,
				userInfo,
				username: userInfo.username,
				uid: userInfo._id,
				token: userInfo.token[0],
				tokenExpired: new Date().getTime() + 172800000,
				msg: "登录成功"
			};
		} else {
			 return {
			      code: 50202,
			      msg: '验证码错误或已失效'
			    }
		}
	},
	//修改密码
	async updatePwd(param) {
		let {
			oldPassword,
			newPassword,
			uid
		} = param;

		const res = await uniID.updatePwd({
			uid,
			oldPassword,
			newPassword
		});
		
		if(res.code==0){
			
				let result = await uniID.createToken({
					uid
				})
				let token = result.token;
				let tokenExpired = result.tokenExpired;
				
				res.token= token;
				res.tokenExpired = tokenExpired;
				await user_table.doc(uid).update({
					token:[token]
				})

				
		}
		
		return res

	},
	//忘记密码
	async forget(param) {
		let {
			username,
			password,
			vercode
		} = param;
		//验证一下验证码
		const check = await uniID.verifyCode({
			mobile: username,
			code: vercode,
			type: 'login'
		});

		if (check.code == 0) {
			//如果对  修改密码
			let userInfo = await user_table.where({
				username
			}).get();

			const res = await uniID.resetPwd({
				uid: userInfo.data[0]._id,
				password
			});
			return res

		} else {
			//返回不对的信息
			return check
		}
	},
	async getuserInfo(param) {

		//第一步  接收用户端传来的token  
		//拿着token去验证  成功了会返回uid
		//用uid拿用户信息
		let {
			token
		} = param;
		let payload = await uniID.checkToken(token)
		if (payload.code) {
			//没有通过
			return payload
		}
		const res = await uniID.getUserInfo({
			uid: payload.uid
		});
		//拿到用户信息了

		if (res.code == 0) {
			res.uid = payload.uid;
			res.username = res.username
		}

		return res;

	},
	async editUserInfo(param) {
		let {
			avatar,
			nickname,
			sex,
			birthday,
			addr,
			addr_code,
			uid
		} = param;

		let res = await user_table.doc(uid).update({
			avatar,
			nickname,
			sex,
			birthday,
			addr,
			addr_code
		})
		if (res.updated == 1) {
			return {
				code: 1,
				msg: '更新成功'
			}

		} else {

			return {
				code: 0,
				msg: '更新失败'
			}
		}

	},
	async wxLogin(param){
		let {code,platform} = param;
	    const res = await uniID.loginByWeixin({
		    code,
			platform
		  });
		  return res;
	}

}
//搞定参数
exports.main = async (event, context) => {
	//event为客户端上传的参数
	let param = {};
	let body = event.body;
	let module = event.path.slice(1);
	//  GET
	//POST
	if (body) {
		//POST  
		if (event.isBase64Encoded) {
			body = Buffer.from(body)
		}
		param = JSON.parse(body)
	} else if (event.queryStringParameters) {
		param = event.queryStringParameters
	}

	if (!modules[module]) {
		//404
		return {
			"mpserverlessComposedResponse": true, // 使用阿里云返回集成响应是需要此字段为true
			"statusCode": 404,
		}

	}
	//参数传给下边的函数

	return modules[module](param)


};

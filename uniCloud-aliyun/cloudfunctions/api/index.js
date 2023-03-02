'use strict';

//节省 云函数数量  
const db = uniCloud.database();
const xl_banner = db.collection('xl_banner');
const xl_cate = db.collection('xl_cate');
const xl_goods = db.collection('xl_goods');
const xl_fav = db.collection('xl_fav');
const xl_cart = db.collection('xl_cart');
const xl_article = db.collection('xl_article');
const xl_system = db.collection('xl_system');
const dbCmd = db.command;

const goods = require('./goods.js')

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
	...goods,
	async upgrade() {
		let res = await xl_system.where({}).get();
		if (res.data) {
			return S(res.data, '获取成功')
		} else {
			return E(null, '获取失败')
		}
	},
	async get_about() {
		let res = await xl_article.where({
			name: "about"
		}).get();
		if (res.data) {
			return S(res.data, '获取成功')
		} else {
			return E(null, '获取失败')
		}
	},
	async get_article(param) {
		let res = await xl_article.where({
			_id:param._id
		}).get();
		if (res.data) {
			return S(res.data, '获取成功')
		} else {
			return E(null, '获取失败')
		}
	},
	async add_article(param) {

		let {
			desc,
			name,
			title,
			intro
		} = param;
		let res = await xl_article.add({
			desc,
			name,
			title,
			intro,
			add_time:new Date().getTime()
		});
		if (res.id) {
			return {
				code: 1,
				data: res
			}
		} else {
			return {
				code: 0,
				data: res
			}
		}
	},
	// 
	async get_article_list(param) {
		let {
			skip = 0, limit = 10
		} = param;
		let count = await xl_article.where({
			name:""
		}).count();
		let res = await xl_article.where({
				name:""
			})
			.orderBy("is_top", "desc")
			.orderBy("add_time", "desc")
			.skip(skip - 0).limit(limit - 0).get();
		return {
			code: 1,
			data: res.data,
			count: count.total
		}
	},
	async get_banner() {
		let res = await xl_banner.where({}).get();
		if (res.data) {
			return S(res.data, '获取成功')
		} else {
			return E(null, '获取失败')
		}
	},
	async add_banner(param) {
		let res = await xl_banner.add(param)
		if (res.id) {
			return {
				code: 1,
				data: res
			}
		} else {
			return {
				code: 0,
				data: res
			}
		}

	},
	async del_banner(param) {
		let {
			_id,
			fileID
		} = param;

		let res = await xl_banner.doc(_id).remove();
		// 云函数删除文件示例代码
		let result = await uniCloud.deleteFile({
			fileList: [
				fileID
			]
		});
		if (res) {
			return {
				code: 1,
				msg: "删除成功"
			}
		} else {
			return {
				code: 0,
				msg: "失败"
			}
		}
	},
	async edit_banner(param) {
		delete param.module;
		let _id = param._id;
		delete param._id;
		let res = await xl_banner.doc(_id).update(param);
		if (res) {
			return {
				code: 1,
				msg: "修改成功"
			}
		} else {
			return {
				code: 0,
				msg: "失败"
			}
		}
	},

	// 分类模块 增删改查
	async add_cate(param) {
		let res = await xl_cate.add(param);
		if (res.id) {
			return S(res.data)
		} else {
			return E()
		}
	},
	async get_cate(param) {
		let position = param.position;
		//index  首页  
		let where = {}
		if (position == 'index') {
			//如果传了index  就查询没有parent_id（也就是顶级分类）
			where = {
				"parent_id": ""
			}
		}
		let res = await xl_cate.where(where).get();
		if (res.data.length) {
			let cate = [];
			if (position != 'index') {
				let top_cate = res.data.filter(v => !v.parent_id);
				cate = top_cate.map(v => {
					let children = res.data.filter(v2 => {
						return v2.parent_id == v._id
					});
					v.children = children;
					return v;
				});
			} else {
				cate = res.data;
			}

			return {
				code: 1,
				msg: "获取成功",
				data: cate
			}
		} else {
			return {
				code: 0,
				msg: "获取失败"
			}
		}
	},
	async del_cate(param) {
		let {
			_id,
			fileID
		} = param;

		let res = await xl_cate.doc(_id).remove();
		// 云函数删除文件示例代码
		let result = await uniCloud.deleteFile({
			fileList: [
				fileID
			]
		});
		if (res) {
			return {
				code: 1,
				msg: "删除成功"
			}
		} else {
			return {
				code: 0,
				msg: "失败"
			}
		}
	},
	async edit_cate(param) {
		delete param.module;
		let _id = param._id;
		delete param._id;
		let res = await xl_cate.doc(_id).update(param);
		if (res) {
			return {
				code: 1,
				msg: "修改成功"
			}
		} else {
			return {
				code: 0,
				msg: "失败"
			}
		}
	},
	//商品模块
	async add_goods(param) {
		let res = await xl_goods.add(param);
		if (res.id) {
			return {
				code: 1,
				msg: "成功",
				data: res
			}
		} else {

			return {
				code: 0
			}
		}
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

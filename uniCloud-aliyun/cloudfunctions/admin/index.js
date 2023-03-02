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
const uniID = require('uni-id')
const user_table = db.collection('uni-id-users');
const id_log_table = db.collection('uni-id-log')
const adminMenus = db.collection('opendb-admin-menus')
const uni_id_roles = db.collection('uni-id-roles')
const permissions = db.collection('uni-id-permissions')
const dbCmd = db.command;
    function buildMenu(menu, menuList, menuIds) {
    	let nextLayer = []
    	for (let i = menu.length - 1; i > -1; i--) {
    		const currentMenu = menu[i]
    		const subMenu = menuList.filter(item => {
    			if (item.parent_id === currentMenu.menu_id) {
    				menuIds.push(item.menu_id)
    				return true
    			}
    		})
    		nextLayer = nextLayer.concat(subMenu)
    		currentMenu.children = subMenu
    	}
    	if (nextLayer.length) {
    		buildMenu(nextLayer, menuList, menuIds)
    	}
    }
    
    function getParentIds(menuItem, menuList) {
    	const parentArr = []
    	let currentItem = menuItem
    	while (currentItem && currentItem.parent_id) {
    		parentArr.push(currentItem.parent_id)
    		currentItem = menuList.find(item => item.menu_id === currentItem.parent_id)
    	}
    	return parentArr
    }
    
    function buildMenus(menuList, trim = true) {
    	// 保证父子级顺序
    	menuList = menuList.sort(function(a, b) {
    		const parentIdsA = getParentIds(a, menuList)
    		const parentIdsB = getParentIds(b, menuList)
    		if (parentIdsA.includes(b.menu_id)) {
    			return 1
    		}
    		return parentIdsA.length - parentIdsB.length || a.sort - b.sort
    	})
    	// 删除无subMenu且非子节点的菜单项
    	if (trim) {
    		for (let i = menuList.length - 1; i > -1; i--) {
    			const currentMenu = menuList[i]
    			const subMenu = menuList.filter(subMenuItem => subMenuItem.parent_id === currentMenu.menu_id)
    			if (!currentMenu.isLeafNode && !subMenu.length) {
    				menuList.splice(i, 1)
    			}
    		}
    	}
    	const menuIds = []
    	const menu = menuList.filter(item => {
    		if (!item.parent_id) {
    			menuIds.push(item.menu_id)
    			return true
    		}
    	})
    	buildMenu(menu, menuList, menuIds)
    	// 包含所有无效菜单
    	if (!trim && menuIds.length !== menuList.length) {
    		menu.push(...menuList.filter(item => !menuIds.includes(item.menu_id)))
    	}
    	return menu
    }



function S(data, msg = "ok") {
	return {
		code: 0,
		msg,
		data
	}
}

function E(data = null, msg = "失败") {

	return {
		code: 500,
		msg,
		data
	}

}

const modules = {

	async login(params,ctx) {

	   let {
			username,
			password
		} = params;
		const res = await uniID.login({
			username,
			password
		})
		return res
	},
	async register(params,ctx) {
		const {
			username,
			password
		} = params
		const admin = await this.hasAdmin()
		if (admin) {
			return {
				code: 10001,
				message: '超级管理员只能有一个,已存在,不允许注册了'
			}
		}
		return ctx.uniID.register({
			username,
			password,
			role: ["admin"]
		})
	},

	async hasAdmin() {
		const {
			total
		} = await user_table.where({
			role: 'admin'
		}).count()

		return !!total
	},
	async logout(params,ctx) {
		return await ctx.uniID.logout(params.token)
	},
	async getMenu(ctx) {
		const permission = ctx.auth.permission
		let {
			data: menuList
		} = await adminMenus.where({
			enable: true
		}).orderBy('sort', 'asc').limit(1000).get()
	
		// 标记叶子节点
		menuList.map(item => {
			if (!menuList.some(subMenuItem => subMenuItem.parent_id === item.menu_id)) {
				item.isLeafNode = true
			}
		})
	
		// 删除无权限访问的菜单
		if (!ctx.auth.role.includes('admin')) {
			menuList = menuList.filter(item => {
				if (item.isLeafNode) {
					if(item.permission && item.permission.length){
						return item.permission.some(item => permission.indexOf(item) > -1)
					}
					return false
				}
				return true
			})
		}
		return buildMenus(menuList) 
	},

	async init(params,ctx) {
	
	
	let currentUserInfo = await	ctx.uniID.getUserInfo({
			uid:ctx.auth.uid,
			field:['_id', 'username']
		});
		
		let navMenu =  await this.getMenu(ctx);
		

		return {
			userInfo: {
				...currentUserInfo.userInfo,
				token: undefined,
				password: undefined,
				role: ctx.auth.role,
				permission: ctx.auth.permission
			},
			navMenu
		}
	},

	async get_user_list(param){
		
		return this.get_user(param)
	},
	async get_user(param) {

		let {
			pageNum = 1, pageSize = 10
		} = param;

		let skip = (pageNum - 1) * pageSize
		let res = await user_table.
		skip(skip - 0).limit(pageSize - 0).orderBy(
				"register_date", 'desc'
			)
			.get();

		let count = await user_table.count()

		if (res.data.length) {
			return {
				code: 0,
				msg: "获取成功",
				data: res.data,
				count: count.total
			}


		} else {
			return {
				code: 10001,
				msg: "获取失败",
				data: res
			}
		}

	},
	async add_user(param,ctx){
		
		let {username,password} = param;
		
		if(!/^\w{4,12}$/.test(username)||!/^\w{6,12}$/.test(password)){
			return {
				code:1000,
				msg:'参数错误'
			}
			
		}
		
	const res = await ctx.uniID.register({
		username,
		password
	})
	return res	
	},
	
	async edit_user(param) {
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
				code: 0,
				msg: '更新成功'
			}

		} else {

			return {
				code: 1000,
				msg: '更新失败'
			}
		}

	},
	// 注销
	async delete_user(param) {
		let {
			uid
		} = param;

		let _res = await user_table.doc(uid).remove();

		if (_res.deleted == 1) {
			return {
				code:0,
				msg: "删除成功"
			}
		} else {

			return {
				code:1000,
				msg: "删除失败"
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
				code: 0,
				msg: "获取成功",
				data: cate
			}
		} else {
			return {
				code: 1000,
				msg: "获取失败"
			}
		}
	},
	async delete_cate(param) {
		let {
			_id
		} = param;

		let res = await xl_cate.doc(_id).remove();

		if (res) {
			return {
				code: 0,
				msg: "删除成功"
			}
		} else {
			return {
				code: 1000,
				msg: "失败"
			}
		}
	},
	async edit_cate(param) {
		
		let _id = param._id;
		delete param._id;
		let res = await xl_cate.doc(_id).update(param);
		if (res) {
			return {
				code: 0,
				msg: "修改成功"
			}
		} else {
			return {
				code: 1000,
				msg: "失败"
			}
		}
	},
	
	async add_goods(param) {
		
		let {img,
		cate_id,
		name,
		price,
		old_price,
		stock, 
		sales,
		competitive,
		like,banner,desc,attr,table} = param;
		
		price = price - 0;
		old_price = old_price - 0;
		stock = stock - 0;
		sales = sales - 0;
		competitive = competitive +'';
		like = like +'';
		
		if(!attr||!table){
			
			return {
				code:1000,
				msg:"缺少sku数据"
			}
		}
		
		table = table.map(v=>{
			if(typeof v.text == 'string'){
				
				v.text = v.text.split(',')
			}
			
			return v
			
		})
		
		
		
		
		
		
		let res = await xl_goods.add(param);
		if (res.id) {
			return {
				code: 0,
				msg: "成功",
				data: res
			}
		} else {
	
			return {
				code: 1000,
				msg:"失败"
			}
		}
	},
	
	async get_goods(param) {
	
		let {
			pageNum = 1, pageSize = 10
		} = param;
	
		let skip = (pageNum - 1) * pageSize
		let res = await xl_goods.
		skip(skip - 0).limit(pageSize - 0).get();
	
		let count = await xl_goods.count()
	
		if (res.data.length) {
			return {
				code: 0,
				msg: "获取成功",
				data: res.data,
				count: count.total
			}
	
	
		} else {
			return {
				code: 10001,
				msg: "获取失败",
				data: res
			}
		}
	
	},
	
	async get_roles(param) {
		let res = await uni_id_roles.get();
		if (res.data) {
			return {
				code: 0,
				msg: "成功",
				data: res
			}
		} else {
	
			return {
				code: 1000,
				msg:"失败",
				res
			}
		}
	},
	async add_roles(param) {
		
		
		let res = await uni_id_roles.add(param);
		if (res.id) {
			return S(res.data)
		} else {
			return E()
		}

	},
	async add_permissions(param) {
		
		
		let res = await permissions.add(param);
		if (res.id) {
			return S(res.data)
		} else {
			return E()
		}

	},
	async get_permissions(param) {
		let res = await permissions.get();
		if (res.data) {
			return {
				code: 0,
				msg: "成功",
				data: res
			}
		} else {
	
			return {
				code: 1000,
				msg:"失败"
			}
		}
	},


}
//搞定参数
exports.main = async (event, context) => {
	let param = {};
	let body = event.body;
	let module = event.path.slice(1);
	if (body) {
		if (event.isBase64Encoded) {
			body = Buffer.from(body)
		}
		param = JSON.parse(body)
	} else if (event.queryStringParameters) {
		param = event.queryStringParameters
	}
	if (!modules[module]) {
		return {
			"mpserverlessComposedResponse": true, // 使用阿里云返回集成响应是需要此字段为true
			"statusCode": 404,
		}

	}
	context.uniID = uniID.createInstance({ 
			context
		});
		
		  context.APPID = '__UNI__CF94D0C' 
		    context.PLATFORM = 'h5' 
		    context.LOCALE = 'zh-Hans' 
		
	let  auth = {}
	
	if(module!='login'&&module!='register'){
		auth = 	await context.uniID.checkToken(event.headers.token, {
			needPermission: true,
			needUserInfo: false
		})

		if (auth.code) {
			// 校验失败，抛出错误信息
			return new Error('TOKEN_INVALID', `${auth.message}，${auth.code}`)
		}
		
		context.auth = auth // 设置当前请求的 auth 对象
		
		if (!context.auth || !context.auth.role.includes('admin') &&!module=='init'&& !context.auth.permission.includes(module)) {
		    return new Error('FORBIDDEN', '禁止访问')
		}
		
	}else{
		
		context.auth = auth // 设置当前请求的 auth 对象		
	}
	
	// context.auth = {}
	return modules[module](param,context)
};

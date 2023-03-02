const db = uniCloud.database();
const xl_goods = db.collection('xl_goods');
const xl_fav = db.collection('xl_fav');
const xl_cart = db.collection('xl_cart');
const xl_cate = db.collection('xl_cate');
const xl_comment = db.collection('xl_comment');
const dbCmd = db.command;
const goods = {

	//根据分类ID获取商品列表
	async get_goods_list(param) {

		let {
			cate_id,
			is_top,
			skip,
			limit,
			sort_type
		} = param;

		is_top = is_top - 0
		let where = {}
		if (is_top) {
			let s_cate_id = await xl_cate.where({
				parent_id: cate_id
			}).get();

			let arr = s_cate_id.data.map(v => {
				return v._id
			})
			where.cate_id = dbCmd.in(arr)
		} else {
			where.cate_id = cate_id;
		}
		let orderBy = [
			["_id", "desc"],
			["sales", "desc"],
			["price", "asc"],
			['price', 'desc']
		]
		orderBy = orderBy[sort_type - 1];
		let count = await xl_goods.where(where).count();
		let res = await xl_goods.where(where)
			.field({
				"img": true,
				"name": 1,
				"sales": 1,
				"price": 1
			})
			.orderBy(orderBy[0], orderBy[1])
			.skip(skip - 0)
			.limit(limit - 0)
			.get();
		if (res.data) {
			return {
				code: 1,
				data: res.data,
				count: count.total
			}
		} else {
			return {
				code: 0,
				data: res
			}
		}
	},

	async get_goods_detail(param) {

		let {
			uid,
			goods_id
		} = param;

		let is_fav = 0;

		if (uid) {
			let fav_data = await xl_fav.where({
				uid,
				goods_id
			}).get();

			is_fav = fav_data.data.length;
		}


		let res = await xl_goods.doc(goods_id).get();

		let _data = res.data[0];

		let {
			attr,
			table
		} = _data;

		let default_sku_info = {}
		if (attr.length === 0) {
			default_sku_info = {
				price: _data.price,
				stock: _data.stock,
				text: ['暂无属性']
			};

		} else {

			let choose_attr = attr
				.map(v => {
					return v.values[0].text;
				})
				.join();


			default_sku_info = table.find(v => {
				return v.text.join() === choose_attr;
			});




		}

		_data.default_sku_info = default_sku_info

		return {
			code: 1,
			data: [_data],
			is_fav
		}
	},
	async get_sku(params) {
		let {
			goods_id,
			sku
		} = params
		if (!goods_id || !sku) {

			return {
				msg: "参数错误",
				code: 2001
			}
		}

		if (!Array.isArray(sku)) {

			return {
				msg: "sku参数需要是数组类型",
				code: 2002
			}
		}

		let res = await xl_goods.doc(goods_id).get();

		let _data = res.data[0];

		let {
			table
		} = _data;
		let choose_attr = sku.join()


		let default_sku_info = table.find(v => {
			return v.text.join() === choose_attr;
		});

		return {
			code: 1,
			data: default_sku_info
		}


	},
	async get_goods_comment(param) {

		let {
			goods_id,
			skip = 0,
			limit = 10
		} = param;

		let count = await xl_comment.where({
			goods_id
		}).count();

		count = count.total;

		if (count == 0) {

			return {
				code: 1,
				data: [],
				count: 0

			}

		}

		let res = await xl_comment.where({
			goods_id
		}).orderBy("add_time", "desc").orderBy("_id", "asc").skip(skip - 0).limit(limit - 0).get();


		let data = res.data.map(v => {
			if (Array.isArray(v.images)) {
				v.images = v.images.join(',')
			}
			return v
		})


		return {
			code: 1,
			data: data,
			count: count
		}


	},
	// 精选商品
	async get_competitive(param) {

		let {
			skip = 0, limit = 10
		} = param;
		let count = await xl_goods.where({
			"competitive": "1"
		}).count();
		let res = await xl_goods.where({
				"competitive": "1"
			})
			.skip(skip - 0).limit(limit - 0).get();
		return {
			code: 1,
			data: res.data,
			count: count.total
		}
	},
	async get_like(param) {

		let {
			skip = 0, limit = 10
		} = param;
		let count = await xl_goods.where({
			"like": "1"
		}).count();
		let res = await xl_goods.where({
				"like": "1"
			})
			.skip(skip - 0).limit(limit)
			.get();
		return {
			code: 1,
			data: res.data,
			count: count.total
		}
	},
	async get_search_list(param) {

		let {
			skip = 0, limit = 10, keyword
		} = param;
		let count = await xl_goods.where({
			"name": new RegExp(keyword)
		}).count();
		let res = await xl_goods.where({
				"name": new RegExp(keyword)
			})
			.skip(skip - 0).limit(limit - 10)
			.get();
		return {
			code: 1,
			data: res.data,
			count: count.total
		}
	},
	//收藏

	async toggle_fav(param) {

		let {
			uid,
			is_fav,
			// name,
			// price,
			// img,
			goods_id
		} = param;

		if (!uid) {
			return {
				code: 0,
				msg: "请先登录"
			}
		}
		let res = null;

		if (is_fav == 0) {
			//如果没收藏  那就是需要收藏了
			res = await xl_fav.add({
				uid,
				goods_id
			});
			if (res.id) {
				return {
					code: 1,
					is_fav: 1,
					msg: "收藏成功"
				}
			} else {
				return {
					code: 0,
					is_fav: 0,
					msg: "收藏失败"
				}

			}



		} else {
			//否则 取消收藏
			res = await xl_fav.where({
				uid,
				goods_id
			}).remove()
			if (res.deleted) {
				return {
					code: 1,
					is_fav: 0,
					msg: "取消成功"
				}
			} else {
				return {
					code: 0,
					is_fav: 1,
					msg: "取消失败"
				}

			}

		}


	},
	async get_fav_list(param) {
		let {
			skip = 0, limit = 10, uid
		} = param;
		if (!uid) {
			return {
				code: 0,
				msg: "请先登录"
			}
		}
		let count = await xl_fav.where({
			uid
		}).count();

		if (count.total == 0) {

			return {
				code: 1,
				data: [],
				count: 0
			}
		}

		let res = await xl_fav.where({
				uid
			})
			.skip(skip - 0).limit(limit - 0).get();

		let goods_id_arr = res.data.map(v => {
			return v.goods_id
		});


		let goods_data = await xl_goods.where({
			_id: dbCmd.in(goods_id_arr)
		}).get()


		let result = res.data.map(v => {

			let g_id = v.goods_id;
			let goods = goods_data.data.find(a => {
				return a._id == g_id
			})
			v.name = goods.name;
			v.price = goods.price;
			v.img = goods.img;
			return v
		})


		return {
			code: 1,
			data: result,
			count: count.total
		}

	},
	//加入购物车

	async add_cart(param) {

		let {
			uid,
			// name,
			// price,
			// img,
			goods_id,
			num,
			attr,
			type
		} = param;

		if (!uid) {
			return {
				code: 2012,
				msg: "请先登录"
			}
		}

		if (!goods_id || !num || !attr) {
			return {
				code: 2013,
				msg: "参数错误"
			}

		}

		let check_stock = await xl_goods.where({
			_id: goods_id
		}).field({
			'table': true,
			'stock': true
		}).get();

		let real_stock = 0;
		let table = check_stock.data[0].table;

		if (Array.isArray(attr)) {
			attr = attr.join()
		}

		//查库存
		if (table.length == 0) {

			real_stock = check_stock.data[0].stock;

		} else {

			for (let i = 0; i < table.length; i++) {
				if (table[i].text.join() == attr) {
					real_stock = table[i].stock;
					break;
				}
			}
		}

		if (num - real_stock > 0) {

			return {
				code: 0,
				msg: "库存不足"
			}
		}

		let has_old = await xl_cart.where({
			uid,
			goods_id,
			attr,
			status: 1
		}).get();

		let res = null;

		if (has_old.data.length > 0 && type != 'buy') {
			res = await xl_cart.where({
				uid,
				goods_id,
				attr,
				status: 1
			}).update({
				num: dbCmd.inc(num - 0)
			})


		} else {

			res = await xl_cart.add({
				uid,
				// name,
				// price,
				// img,
				goods_id,
				num,
				attr,
				stock: real_stock - 0,
				status: 1,
				checked: true
			});

		}
		if (res.id || res.updated) {

			if (type == 'buy') {
				return {
					code: 1,
					msg: "操作成功",
					data: res
				}

			} else {
				return {
					code: 1,
					msg: "成功加入购物车,商品库存以实际下单时为准",
					data: res
				}

			}

		} else {
			return {
				code: 0,
				msg: "操作失败"
			}

		}

	},

	async get_cart_list(param) {

		let {
			uid
		} = param;

		let cart_res = await xl_cart.where({
			uid,
			status: 1
		}).get();

		let cart_data = cart_res.data;

		if (cart_data.length === 0) {
			return {
				code: 1,
				data: [],
				msg: "购物车是空的"
			}
		}

		let goods_id_arr = cart_data.map(v => {
			return v.goods_id
		});


		let goods_data = await xl_goods.where({
			_id: dbCmd.in(goods_id_arr)
		}).get();

		goods_data = goods_data.data || [];

		//两个数组合并  
		let result_arr = cart_data.map(v => {

			let g_id = v.goods_id;
			v.goods = goods_data.find(a => {
				return a._id == g_id
			})
			return v;
		})


		let tips = "获取成功";
		result_arr.map(v => {


			let real_stock = 0;
			let _price = 0;
			let table = v.goods.table;

			//查库存
			if (table.length == 0) {

				real_stock = v.goods.stock;
				_price = v.goods.price;

			} else {

				for (let i = 0; i < table.length; i++) {
					if (table[i].text.join() == v.attr) {
						real_stock = table[i].stock;
						_price = table[i].price;
						break;
					}
				}
			}
			v.stock = real_stock - 0;
			v.img = v.goods.img;
			v.name = v.goods.name;
			v.price = _price;

			if (v.num > real_stock) {
				v.num = real_stock - 0;
				tips = '部分商品购买数量超过最大库存,已调整为最大库存'
			}

			delete v.goods;
			return v;

		})


		return {
			code: 1,
			msg: tips,
			data: result_arr
		}

	},
	async remove_cart(param) {

		let {
			_id
		} = param;
		let res = await xl_cart.doc(_id).update({
			status: 2
		});

		if (res.updated) {
			return {
				code: 1,
				msg: "删除成功"
			}
		} else {
			return {
				code: 2,
				msg: "删除失败"
			}
		}
	},
	async change_cart_num(param) {

		let {
			_id,
			num
		} = param;

		let res = await xl_cart.doc(_id).update({
			num: num
		});

		return {
			code: 1,
			msg: '修改成功'
		}

	},
	async toggle_check_cart(param) {

		let {
			_id,
			checked
		} = param;

		let res = await xl_cart.doc(_id).update({
			checked: !checked
		});
		return {
			code: 1,
			msg: '修改成功'
		}
	},
	//  选中
	async check_cart(param) {

		let {
			_id
		} = param;

		if (!_id) {
			return {
				code: 2001,
				msg: "参数错误,缺少购物车id"
			}
		}
		if (typeof _id === 'string') {
			let res = await xl_cart.doc(_id).update({
				checked: true
			});
			return {
				code: 1,
				msg: '修改成功'
			}
		} else if (Array.isArray(_id)) {

			let res = await xl_cart.where({
				_id: dbCmd.in(_id)
			}).update({
				checked: true
			});
			return {
				code: 1,
				msg: '修改成功'
			}

		} else {
			return {
				code: 2001,
				msg: "购物车id参数错误"
			}

		}

	},
	async cancel_cart(param) {
		let {
			_id
		} = param;

		if (!_id) {
			return {
				code: 2001,
				msg: "参数错误,缺少购物车id"
			}
		}
		if (typeof _id === 'string') {
			let res = await xl_cart.doc(_id).update({
				checked: false
			});
			return {
				code: 1,
				msg: '修改成功'
			}
		} else if (Array.isArray(_id)) {

			let res = await xl_cart.where({
				_id: dbCmd.in(_id)
			}).update({
				checked: false
			});
			return {
				code: 1,
				msg: '修改成功'
			}

		} else {
			return {
				code: 2001,
				msg: "购物车id参数错误"
			}

		}

	},



	async clear_some_by_uid(param) {

		let {
			uid,
			table
		} = param;
		// 	let now = new Date().getTime();
		// 	let r = await db.collection('xl_order').where({
		// 		status: 1,
		// 		add_time: dbCmd.lt(now - 3600000)
		// 	}).field({
		// 		goods: true
		// 	}).get();
		// let goods = r.data;

		// let goods_list = []
		// goods.forEach(v=>{

		// 	goods_list.push(...v.goods)

		// })

		// 	return goods_list;




		let res = await db.collection(table).where({
			uid
		}).remove()

		return res
	}

}

module.exports = goods;

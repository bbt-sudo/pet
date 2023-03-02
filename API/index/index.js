// export const get = (params) => {
// 	return uni.$u.http.get('/user/login', params)
// }
// export const post = (params) => {
// 	return uni.$u.http.post('/user/login', params)
// }

// pubilc登陆相关

// 注册 // /user/reg
export const userReg = (data) => {
	return uni.$u.http.post('/user/reg', data)
}

// 发送验证码 // /user/sendSms
export const userSendSms = (data) => {
	return uni.$u.http.post('/user/sendSms', data)
}

// 账号密码登录 // /user/login
export const useLogin = (data) => {
	return uni.$u.http.post('/user/login', data)
}

// 验证码登录 // /user/code_login
export const codeLogin = (data) => {
	return uni.$u.http.post('/user/code_login', data)
}

// 忘记密码 /user/updatePwd
export const updatePwd = (data) => {
	console.log(data);
	return uni.$u.http.post('/user/updatePwd', data)
}

// 获取用户信息 	/user/getuserInfo
export const getuserInfo = (data) => {
	// console.log(data);
	return uni.$u.http.post('/user/getuserInfo', data)
}

// 修改用户信息 /user/editUserInfo
export const editUserInfo = (data) => {
	return uni.$u.http.post('/user/editUserInfo', data)
}

// index 首页

// 轮播图 /api/get_banner
export const get_banner = (data) => {
	return uni.$u.http.post('/api/get_banner', data)
}

// 分类 /api/get_cate
export const get_cate = (data) => {
	return uni.$u.http.post('/api/get_cate', data)
}

// 商品列表 /api/get_goods_list
export const get_goods_list = (data) => {
	return uni.$u.http.post('/api/get_goods_list', data)
}


// 商品列表 /api/get_competitive
export const get_competitive = (data) => {
	return uni.$u.http.post('/api/get_competitive', data)
}

// 猜你喜欢 /api/get_like
export const get_like = (data) => {
	return uni.$u.http.post('/api/get_like', data)
}

// 商品详情 /api/get_goods_detail
export const get_goods_detail = (data) => {
	return uni.$u.http.post('/api/get_goods_detail', data)
}

// 商品评论 /api/get_goods_comment
export const get_goods_comment = (data) => {
	return uni.$u.http.post('/api/get_goods_comment', data)
}

// 商品收藏 /api/toggle_fav
export const toggle_fav = (data) => {
	return uni.$u.http.post('/api/toggle_fav', data)
}


// 商品sku /api/get_sku
export const get_sku = (data) => {
	return uni.$u.http.post('/api/get_sku', data)
}

// 加入购物车 /api/add_cart
export const add_cart = (data) => {
	return uni.$u.http.post('/api/add_cart', data)
}


// 搜索 /api/get_search_list

export const get_search_list = (data) => {
	return uni.$u.http.post('/api/get_search_list', data)
}



// 购物车列表 /api/get_cart_list

export const get_cart_list = (data) => {
	return uni.$u.http.post('/api/get_cart_list', data)
}

// 购物车选中 /api/toggle_check_cart


export const toggle_check_cart = (data) => {
	return uni.$u.http.post('/api/toggle_check_cart', data)
}

// 购物车数量改变 /api/change_cart_num


export const change_cart_num = (data) => {
	return uni.$u.http.post('/api/change_cart_num', data)
}


// 移出购物车 /api/remove_cart

export const remove_cart = (data) => {
	return uni.$u.http.post('/api/remove_cart', data)
}

// 全选  /api/check_cart
export const check_cart = (data) => {
	return uni.$u.http.post('/api/check_cart', data)
}

// 取消全选 /api/cancel_cart
export const cancel_cart = (data) => {
	return uni.$u.http.post('/api/cancel_cart', data)
}



// 确认订单 /order/checkOrder
export const checkOrder = (data) => {
	return uni.$u.http.post('/order/checkOrder', data)
}



// 获取收获地址列表 /order/getAddrList
export const getAddrList = (data) => {
	return uni.$u.http.post('/order/getAddrList', data)
}


// 获取收货地址详情 /order/get_addr_detail
export const get_addr_detail = (data) => {
	return uni.$u.http.post('/order/get_addr_detail', data)
}

// 保存收货地址信息	/order/saveAddress
export const saveAddress = (data) => {
	return uni.$u.http.post('/order/saveAddress', data)
}

// 设置默认收货地址 /order/set_default_addr
export const set_default_addr = (data) => {
	return uni.$u.http.post('/order/set_default_addr', data)
}

// 获取默认收货地址 /order/get_default_addr
export const get_default_addr = (data) => {
	return uni.$u.http.post('/order/get_default_addr', data)
}


// 删除地址 /order/del_addr
export const del_addr = (data) => {
	return uni.$u.http.post('/order/del_addr', data)
}

// 提交订单  /order/submitOrder
export const submitOrder = (data) => {
	return uni.$u.http.post('/order/submitOrder', data)
}

// 支付 /order/payOrder 
export const payOrder = (data,header) => {
	return uni.$u.http.post('/order/payOrder', data,header)
}
// 查询订单 /order/query_order
export const query_order = (data,header) => {
	return uni.$u.http.post('/order/query_order', data,header)
}


// 我的页面

// 我的收藏 /api/get_fav_list
export const get_fav_list = (data,header) => {
	return uni.$u.http.post('/api/get_fav_list', data,header)
}

// 联系我们 /api/upgrade
export const upgrade = (data,header) => {
	return uni.$u.http.post('/api/upgrade', data,header)
}


// 订单列表 /order/getOrderList
export const getOrderList = (data,header) => {
	return uni.$u.http.post('/order/getOrderList', data,header)
}

// 取消订单 /order/cancel_order
export const cancel_order = (data,header) => {
	return uni.$u.http.post('/order/cancel_order', data,header)
}


// 删除订单 /order/del_order
export const del_order = (data,header) => {
	return uni.$u.http.post('/order/del_order', data,header)
}

// 提交评价 /order/saveOrderEvaluateAdd
export const saveOrderEvaluateAdd = (data,header) => {
	return uni.$u.http.post('/order/saveOrderEvaluateAdd', data,header)
}


// 查看物流 /order/wuliu
export const wuliu = (data,header) => {
	return uni.$u.http.post('/order/wuliu', data,header)
}

// 发货 /order/send
export const send = (data,header) => {
	return uni.$u.http.post('/order/send', data,header)
}

// 订单详情 /order/getOrderDetail
export const getOrderDetail = (data,header) => {
	return uni.$u.http.post('/order/getOrderDetail', data,header)
}

// 确认收货 /order/shouhuo
export const shouhuo = (data,header) => {
	return uni.$u.http.post('/order/shouhuo', data,header)
}
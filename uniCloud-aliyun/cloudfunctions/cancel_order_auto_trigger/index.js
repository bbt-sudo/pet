'use strict';

const db = uniCloud.database();

const xl_order = db.collection('xl_order');
const xl_goods = db.collection('xl_goods');

const dbCmd = db.command;

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('----------------------来了----------------------------------------------')
	
	let now = new Date().getTime();
	let goods = await xl_order.where({
		status:1,
		add_time:dbCmd.lt(now-3600000)
	}).field({
		goods:true
	}).get()
	
	await xl_order.where({
		status:1,
		add_time:dbCmd.lt(now-3600000)
	}).update({
		cancel_text:"未支付,系统自动取消",
		status: 8
	});
	
	
	goods = goods.data;
	
	let goods_list = []
	goods.forEach(v=>{
		goods_list.push(...v.goods)
		
	})
	
	
	
	for (let i = 0; i < goods_list.length; i++) {
		
		let v = goods_list[i];
		let stock = v.num-0;
		
		if (!v.attr||v.attr=='暂无属性') {
			
			
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

	//返回数据给客户端
	return event
};

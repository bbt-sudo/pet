'use strict';

//节省 云函数数量  
const db = uniCloud.database();
const dbCmd = db.command;

// 七牛云官方node.js CDK
const qiniu = require('qiniu');

const config = {
  // 个人中心->秘钥管理->AccessKey
  "AK": "K5s8jvsmfGb2nKakWrBLfL1v-iWIKkeQLfo0kGt8",
  // 个人中心->秘钥管理->SecretKey
  "SK": "KfuJPN0jn09aiQZUdhQRfszojbWyl_X1k1kbOeLq",
  // 对象存储->新建存储空间的名字：(你自己创建时候空间名字)，这里我创建的是：jiuchengjsfront
  "Bucket": "hao-xiao"
}


const modules = {
	async token(params){
		
		const mac = new qiniu.auth.digest.Mac(config.AK, config.SK);
		const options = {
		    scope: config.Bucket,
		    expires: 3600 * 24
		};
		const putPolicy =  new qiniu.rs.PutPolicy(options);
		const uploadToken= putPolicy.uploadToken(mac);
		
		return {
			code:0,
			token:uploadToken
		}
	},


	

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
		param = JSON.parse(body);
		if (!modules[module]) {
			//404
			return {
				"mpserverlessComposedResponse": true, // 使用阿里云返回集成响应是需要此字段为true
				"statusCode": 404,
			}
		
		}
		//参数传给下边的函数
		return modules[module](param)
		
		
	} else if (event.queryStringParameters) {
		param = event.queryStringParameters;
		if (!modules[module]) {
			//404
			return {
				"mpserverlessComposedResponse": true, // 使用阿里云返回集成响应是需要此字段为true
				"statusCode": 404,
			}
		
		}

		
		if(param.img instanceof ArrayBuffer ){
			let d = ''
			context.on('data',function(data){
				d+=data;
			})	
			context.on('end',function(data){
				param = d;
				
				//参数传给下边的函数
				return modules[module](param)
				
			})
			
		}else{
			
			//参数传给下边的函数
			return modules[module](param)
		}

	}

};

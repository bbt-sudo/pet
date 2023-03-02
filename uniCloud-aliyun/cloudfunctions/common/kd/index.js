const md5Hex = require('md5-hex');
const querystring = require('querystring')
module.exports = {
	md5Hex,
	querystring
}

// module.exports = function({
// 	AppKey,
// 	EBusinessID,
// 	ShipperCode,
// 	LogisticCode
// }) {
	
// 	return new Promise((resolve,reject)=>{
		
// 		//请求url --正式地址
// 		const Url = 'https://api.kdniao.com/Ebusiness/EbusinessOrderHandle.aspx'
// 		//电商加密私钥，快递鸟提供，注意保管，不要泄漏 
// 		// const AppKey = 'a41716d9-8fb4-47b7-9a28-6633cfce7d38';//请登陆快递鸟用户管理后台查看：http://kdniao.com/UserCenter/UserHome.aspx
// 		// //电商ID 
// 		// const EBusinessID = '1699160'; //请登陆快递鸟用户管理后台查看：http://kdniao.com/UserCenter/UserHome.aspx
		
		
		
// 		function getParams(){
// 		    //请求接口指令
// 		    const RequestType  = '1002';
// 		    const RequestData = {'OrderCode': '',ShipperCode, LogisticCode}
// 		    const DataSign = Buffer.from(md5Hex(JSON.stringify(RequestData)+AppKey)).toString('base64')
// 		    const reqParams = {
// 		        RequestType,
// 		        EBusinessID,
// 		        DataSign,
// 		        RequestData:JSON.stringify(RequestData),
// 		        DataType:2
// 		    }
// 		    return reqParams
// 		}//请求参数
		
		
// 		axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
		
		
// 		axios.post(Url,querystring.stringify(getParams()))
// 		.then(res=>{
// 			console.log(res)
// 			resolve(res)
// 		}).catch(err=>{
// 			reject(err)
// 		})
		
// 	})
	
	
	
	
// }





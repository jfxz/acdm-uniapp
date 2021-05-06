/*
* @description: 网络异常时排查以下服务接口
* author: zql
* @param{}: 
* @param{}: 
* @return: 
* updateTime: 2021-3-8 11:39:27
*/
import https from '../../config/api-interface.js'
 
export const checkNet = (data) => {
	return https({
		url: '/health/whoami',
		method: 'GET',
		data
	})
}

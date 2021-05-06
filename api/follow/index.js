/*
* @description: 关注航班接口
* author: zql
* @param{}: 
* @param{}: 
* @return: 
* updateTime: 2021-3-8 11:39:27
*/
import https from '../../config/api-interface.js'
// 设置关注的航班状态
export const setFollowNode = (data) => {
	return https({
		url: '/flight-schedule/followflight/node',
		method: 'POST',
		data
	})
}
// 查询关注
export const getFollowNode = (data) => {
	return https({
		url: `/flight-schedule/followflight/node/${data.userId}`,
		method: 'GET'
	})
}

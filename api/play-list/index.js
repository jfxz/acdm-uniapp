import https from '../../config/api-interface.js'

// 根据用户获取设备
export const getDeviceInfoByUser = (data) => {
	return https({
		url: `/api/devices/byRole?airportCode=` + data,
		method: 'GET',
	})
}

//设备操作 清空、刷新、关机、重启
export const deviceActionByUser = (data) => {
	return https({
		url: `/api/vncManage`,
		method: 'POST',
		data
	})
}

// 获取设备的播放模板管理界面的列表
export const getDeviceTemplate = (data) => {
	return https({
			url: `/api/templateDevice/page/condition`,
			method: 'GET',
			data
	})
}

// 获取角色订阅的航显模版
export const getTemplateConf = (data) => {
	 return https({
			 url: `/api/templateConfig`,
			 method: 'GET',
			 data
	 })
}
// http://10.1.16.65:9094/api/templateDevice
// 新增该设备的播放模板
export const addTemplateDevice = (data) => {
	return https({
		url: `/api/templateDevice`,
		method: 'POST',
		data
	})
	// `/oauth/token?username=${data.username}&password=${data.password}&grant_type=${data.grant_type}`,
}

// 编辑该设备的播放模板
export const updateTemplateDevice = (data) => {
	return https({
		url: `/api/templateDevice`,
		method: 'PUT',
		data
	})
}

 // 删除该设备的播放模板
 export const deleteTemplateDevice = (data) => {
 	return https({
 		url: `/api/templateDevice/` + data,
 		method: 'DELETE',
 		data
 	})
 }
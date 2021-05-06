import https from '../../config/api-interface.js'
import config from '../../config/api-config.js'

const serviceName = 'gms'
const newGuide = 'gms'

export const guideUrl = config.url
export const guideSvnUrl = config.puductUrl

// 图片上传地址
export const imgUploadUrl = `${config.url}/api/${serviceName}/serviceGuide/uploadImage`

// 内场叫车输入表单
export const performOperation = (data) => {
	return https({
	  url: `/${serviceName}/serviceGuide/performOperation`,
		method: 'POST',
		data: data
	})
}

// 内场在登机口向司机发消息
export const innerSendMsgToDriver = (data) => {
	return https({
	  url: `/${serviceName}/serviceGuide/car/sendMessage`,
		method: 'POST',
		data: data
	})
}

// 摆渡车状态改变
export const changeCarStatus = (data) => {
	return https({
	  url: `/${serviceName}/serviceGuide/carStatusChange`,
		method: 'POST',
		data: data
	})
}

export const onError = (err) => {
	console.log('onError', err)
	uni.showToast({
		title: err.data.error || err.data.message,
		icon: 'none',
		duration: 2000
	})
	uni.hideLoading()
}

export const notify = (msg) => {
	uni.showModal({
		title: '提示',
		icon: 'none',
		content: msg
	})
	uni.vibrateLong()
}

// 查询地面服务引导单所需数据
export const getGuideForm = (data) => {
	return https({
	  url: `/${serviceName}/serviceGuide/info`,
		method: 'GET',
		data: data
	})
}

export const getRole = () => {
	let roles = uni.getStorageSync('roles_info')
	let reg = /登机口引导单/g
	if (roles) {
		for (let i = 0; i < roles.length; i++) {
			let e = roles[i]
			if (reg.test(e.name)) {
				return e.name
			}
		}
	}
}

export const getGuideQueue = (data) => {
	return https({
	  url: `/${serviceName}/serviceGuide/queue`,
		method: 'GET',
		data: data
	})
}

export const getUsername = () => {
	let userForm = uni.getStorageSync('userForm')
	if (userForm) {
		return userForm.username
	}
}

export const validatenull = (val) => {
	if (val instanceof Array) {
		if (val.length === 0) return true
	} else if (typeof val === 'object') {
		if (JSON.stringify(val) === '{}') return true
		if (JSON.stringify(val) === '[]') return true
	} else {
		if (val === 'null' || val === null || val === 'undefined' || val === undefined || val === '') return true
		return false
	}
	return false
}

// 内场遗漏核对，所有照片上传完毕后调用该接口，通知后端向mq可以向外场客服发送这些照片
export const omitInfieldPicsConfirm = (data) => {
	return https({
		url: `/${serviceName}/test`,
		method: 'GET',
		data: data
	})
}

// 获得内场遗漏核对发送的照片。
export const getOmitInfieldPics = (data) => {
	return https({
		url: `/${serviceName}/serviceGuide/imageRecord`,
		method: 'GET',
		data: data
	})
}

// 外场遗漏核对发送
export const omitOutFieldConfirm = (data) => {
	return https({
		url: `/${serviceName}/serviceGuide/omit/sendMessage`,
		method: 'POST',
		data: data
	})
}

// 获得mq历史消息
export const getGuideMessages = (data) => {
	return https({
		url: `/${serviceName}/serviceGuide/messageRecord`,
		method: 'GET',
		data: data
	})
}

export const checkImage = (data) => {
	uni.setStorageSync('check_image_storage', data)
	let guideId = data.guideId
	uni.navigateTo({
		url: `/pages/guide/outfield-check?guideId=${guideId}&direction=D`
	})
}

export const watchImage = (data) => {
	console.log('watchImage', data)
	uni.setStorageSync('check_image_storage', data)
	let guideId = data.guideId
	uni.navigateTo({
		url: `/pages/guide/outfield-check?guideId=${guideId}&direction=D&sendable=false`
	})
}

// 通过任务id获取登机口引导单id
export const getGuideIdByTaskId = (data) => {
	return https({
		url: `/${serviceName}/serviceGuide/guideId`,
		method: 'GET',
		data: data
	})
}

// 新

// 更新设备使用记录
export const updateDeviceUsageLog = (data) => {
	return https({
		url: `/${newGuide}/deviceUsageRecord/usageStatus`,
		method: 'POST',
		data: data
	})
}

// export const updateDeviceUsageLog = (data) => {
//   return new function () {
//     return new Promise((resolve, reject) => {
//       uni.request({
//         url: `http://127.0.0.1:8080/apiguide/deviceUsageRecord/usageStatus`,
//         method: 'POST',
//         data: data,
//         complete: res => {
//           if (res.data) {
//             resolve(res.data)
//           }
//         }
//       })
//     })
//   }
// }

// 查询该航班保障任务对应的全部设备使用记录
export const getAllUsageLog = (data) => {
	return https({
		url: `/${newGuide}/deviceUsageRecord/info`,
		method: 'GET',
		data: data
	})
}
// 得到全部工作项目
export const getAllWorkItem = (data) => {
	return https({
		url: `/${newGuide}/workItem/flightTask`,
		method: 'GET',
		data: data
	})
}
// 更新工作项目
export const updateWorkItem = (data) => {
	return https({
		url: `/${newGuide}/workItem?workItemId=${data.workItemId}`,
		method: 'POST',
		data: data
	})
}
// 删除图片
export const removeImage = (data) => {
	return https({
		url: `/${newGuide}/workItem/image?workItemId=${data.workItemId}&imageUrl=${data.imageUrl}`,
		method: 'DELETE',
		data: data
	})
}
// 查询工作项目信息
export const detailWorkItem = (data) => {
	return https({
		url: `/${newGuide}/workItem/info`,
		method: 'GET',
		data: data
	})
}

// 图片上传地址
export const newImgUploadUrl = `${config.url}/api/${newGuide}/workItem`

// 更改绑定设备
export const changeBindDevice = (data) => {
	return https({
		url: `/${serviceName}/deviceUsageRecord/process`,
		method: 'POST',
		data: data
	})
}

// 获得当日所有引导单相关的航班
export const getAllGuideFlights = (data) => {
	return https({
		url: `/${serviceName}/workItem/flight/view`,
		method: 'GET',
		data: data
	})
}

// 通过航班id获取该航班的时间线
export const getGuideTimelineByflightId = (data) => {
	return https({
		url: `/${serviceName}/workItem/flight/timeline`,
		method: 'GET',
		data: data
	})
}

// 内场通过自己的引导单任务的任务id获取该航班的外场的任务的所有工作项目
export const getAllOutfieldWorkItemsByFlightId = (data) => {
	return https({
		url: `/${serviceName}/workItem/flightTask/outfield`,
		method: 'GET',
		data: data
	})
}

// 内场向特车发送需要的大摆渡车数和小摆渡车数
export const sendToDispatcher = (data) => {
	return https({
		url: `/${serviceName}/workItem/infield/carCall`,
		method: 'POST',
		data: data
	})
}

// 外场向特车发送车辆确认成功消息
export const sendToDriver = (data) => {
	return https({
		url: `/${serviceName}/workItem/outfield/check`,
		method: 'POST',
		data: data
	})
}

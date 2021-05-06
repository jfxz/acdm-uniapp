import https from '@/config/api-interface.js'

// 获取进出港航班列表 
export const getFlightList = (data) => {
	return https({
		url: `/flight-schedule/mobile/${data.airportCode}/${data.direction}`,
		method: 'GET'
	})
}
// 获取即将进港航班列表
export const getWillArrFlightList = (data) => {
	return https({
		url: `/flight-schedule/mobile/flightCdm/approach/${data.airportCode}`,
		method: 'GET'
	})
}
// 获取即将进港航班列表（新）
export const getWillArrFlightListNew = (data) => {
	return https({
		url: `/flight-schedule/mobile//flightCdm/approach/new/${data.airportCode}`,
		method: 'GET'
	})
}
// 获取即将出港航班列表
export const getWillDepFlightList = (data) => {
	return https({
		url: `/flight-schedule/mobile/flightCdm/depSoon/${data.airportCode}`,
		method: 'GET'
	})
}
// 获取正在保障航班列表
export const getGmsFlightList = (data) => {
	return https({
		url: `/gms/flightactivity/mobile/guarantee/${data.airportCode}/android`,
		method: 'GET'
	})
}
// 获取进出港航班列表 
export const getFlightListByDate = (data) => {
	return https({
		url: `/flight-schedule/mobile/${data.airportCode}/${data.searchDate}`,
		method: 'GET',
	})
}
// 获取拼接航班列表 
export const getFlightListByLinked = (data) => {
	return https({
		url: `/flight-schedule/mobile/linked/${data.airportCode}`,
		method: 'GET',
	})
}

// 获取前序航班列表
export const getBeforFlightList = (data) => {
	return https({
		url: `/flight-schedule/variflight/preFlight/${data.registration}/${data.timeStamp}`,
		method: 'GET'
	})
}
// 航班详细
export const getFlightDetail = (data) => {
	return https({
		url: `/flight-schedule/mobile/detail/${data.airportCode}/${data.flightId}`,
		method: 'GET'
	})
}
// 航班详细
export const getMailDetail = (data) => {
	return https({
		url: `/flight-schedule/mobile/flight/detail/${data.airportCode}/${data.flightId}/${data.opdate}/${data.segmentId}`,
		method: 'GET'
	})
}
// 关注航班
export const postFollowFlight = (data) => {
	return https({
		url: `/flight-schedule/followflight`,
		method: 'POST',
		data: data
	})
}

// 取消关注航班
export const deleteFollowFlight = (id) => {
	return https({
		url: `/flight-schedule/followflight/${id}`,
		method: 'DELETE'
	})
}

// 获取航班事件列表
export const getFlightActive = (data) => {
	return https({
		url: `/gms/flightactivity/list/complete`,
		method: 'GET',
		data: data
	})
}

// 已关注航班列表
export const getFollowFlightList = (data) => {
	return https({
		url: `/flight-schedule/followflight/userId/${data.userId}/0/999?airportCode=${data.airportCode}`,
		method: 'GET'
	})
}

// 获取保障节点操作 
export const getGmsOperate = (data) => {
	return https({
		url: `/gms/flightactivity/mobile/find`,
		method: 'GET',
		data: data
	})
}
// 节点提交
export const postGmsOperate = (data) => {
	data['from'] = 'app'
	return https({
		url: `/gms/flightactivity/save/actualtime`,
		method: 'POST',
		data: data
	})
}
// 获取关注航班保障节点超时
export const getFollowGmsTimeout = (airportCode) => {
	return https({
		url: `/gms/flightactivity/mobile/find/recent/${airportCode}`,
		method: 'GET'
	})
}
// 保障活动超时范围时间
export const getActivityDiff = _ => {
	return https({
		url: `/acdm/system/param/value/ACTIVITY_DIFF_VALUE`,
		method: 'GET'
	})
}
// 根据时间查询航班
export const getFlightByDate = (data) => {
	return https({
		url: `/flight-schedule/mobile/opDate/${data.airportCode}/${data.opDate}/${data.flight}`,
		method: 'GET'
	})
}
// 根据时间查询航班
export const getFlightHistory = (data) => {
	return https({
		url: `/flight-schedule/linkedFlight/history`,
		method: 'POST',
		data: data
	})
}
// 获取航班任务数据
export const getFlightTask = (data) => {
	return https({
		url: `/flight-base/flightTask/all`,
		method: 'GET',
	})
}
// 获取天气数据
export const getFlightWeather = (data) => {
	return https({
		url: `/dashboard/weather/weatherTelegram/${data.flightCode}/${data.contentType}/${data.timeStamp}/${data.dataSource}`,
		method: 'GET',
	})
}
// 获取映射数据
export const gatewayRoute = (data) => {
	return https({
		url: `/auth/gatewayRoute/page?pageSize=9999&pageNumber=0`,
		method: 'GET',
	})
}

// 获取通航数据
export const getAirport = (data) => {
	return https({
		url: `/flight-base/airport?pageSize=9999&pageNumber=0`,
		method: 'GET',
	})
}
// 获取联系电话
export const getFlightPhone = (data) => {
	return https({
		url: `/flight-schedule/mobile/phone/${data.id}`,
		method: 'GET',
	})
}
// 早班/航后飞机入位
export const setFlightStandIn = (data) => {
	return https({
		url: `/res/standAllocation/stand/in`,
		method: 'POST',
		data: data
	})
}
// 获取早班/航后入位记录
export const getFlightStandInRecord = (data) => {
	return https({
		url: `/res/standAllocation/stand/in/record?${data}`,
		method: 'get',
	})
}

// 获取疫情人数
export const getEpidemicNumber = (data) => {
	return https({
		url: `/passenger/ncpPassenger?flightId=${data.flightId}`,
		method: 'get',
	})
}

// 新增疫情人数
export const addEpidemicNumber = (data) => {
	return https({
		url: `/passenger/ncpPassenger`,
		method: 'post',
		data: data
	})
}
// 编辑疫情人数
export const editEpidemicNumber = (data) => {
	return https({
		url: `/passenger/ncpPassenger`,
		method: 'put',
		data: data
	})
}
// 前置节点判断
export const flightactivityCheck = (data) => {
	return https({
		url: `/gms/flightactivity/check/pre/complete?${data}`,
		method: 'get'
	})
}
//获取航班id集合
export const getFlightIdsList = (data) => {
	return https({
		url: `/flight-schedule/mobile/ids/${data.airportCode}/${data.direction}`,
		method: 'get'
	})
}
//根据航班flightId获取对应航班数据
export const getFlightByflightId = (data) => {
	return https({
		url: `/flight-schedule/mobile/flightIds?airportCode=${data.airportCode}&flightIdStr=${data.flightIdStr}`,
		method: 'get'
	})
}
//获取进出港，即将进出港，保障航班数量
export const getFlightNumbers = (data) => {
	return https({
		url: `/flight-schedule/mobile/flight/num/${data.airportCode}/${data.selData}`,
		method: 'get'
	})
}
// 修改南航 成人、儿童、婴儿 货邮
export const editSouthern = (data) => {
	return https({
		url: `/maiis-interaction/dataInput/southernAirlines`,
		method: 'POST',
    data: data
	})
}
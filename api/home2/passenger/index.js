import https from '../../../config/api-interface.js'
/* 获取旅客概览统计 */
export const getPassengerInfoTotal = (data) => {
	return https({
		url: `/dashboard/load/passenger/guarantee?airportCode=${data.airportCode}&direction=${data.direction}`,
		method: 'GET',
		data
	})
}
// 获取旅客时刻统计
export const getPassengerGuarantee = (data) => {
	return https({
		url: `/dashboard/load/passenger/guarantee/perHour?airportCode=${data.airportCode}&direction=${data.direction}`,
		method: 'GET',
		data
	})
}

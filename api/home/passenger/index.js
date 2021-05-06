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

// 获取日旅客吞吐
export const getPassengerDay = (data) => {
	return https({
		url: `/dashboard/load/passenger/day/${data.airportCode}`,
		method: 'GET',
		data
	})
}

// 获取月旅客吞吐
export const getPassengerMonth = (data) => {
	return https({
		url: `/dashboard/load/passenger/month/${data.airportCode}`,
		method: 'GET',
		data
	})
}

import https from '../../../config/api-interface.js'
/* 进出港航班 */
export const getArrAndDepFlight = (data) => {
	return https({
		url: `/dashboard/flight/overview/all/${data.airportCode}`,
		method: 'GET',
		data
	})
}
/* 进港航班 */
export const getArrFlight = (data) => {
	return https({
		url: `/dashboard/flight/overview/arr/${data.airportCode}`,
		method: 'GET',
		data
	})
}
/* 出港航班 */
export const getDepFlight = (data) => {
	return https({
		url: `/dashboard/flight/overview/dep/${data.airportCode}`,
		method: 'GET',
		data
	})
}
/* 进出港航班 */
export const getDepAndArrFlightList = (data) => {
	return https({
		url: `/dashboard/flight/distribution/${data.airportCode}/${data.interval}/${data.start}/${data.end}`,
		method: 'GET',
		data
	})
}

/* 进港航班 */
export const getArrFlightList = (data) => {
	return https({
		url: `/dashboard/flight/distribution/arr/${data.airportCode}/${data.interval}/${data.start}/${data.end}`,
		method: 'GET',
		data
	})
}
/* 出港航班 */
export const getDepFlightList = (data) => {
	return https({
		url: `/dashboard/flight/distribution/dep/${data.airportCode}/${data.interval}/${data.start}/${data.end}`,
		method: 'GET',
		data
	})
}


// 获取计划起飞、实际起飞时刻放行航班统计
export const getTimeDistribution = (data) => {
	return https({
		url: `/dashboard/flight/timeDistribution/dep/${data.airportCode}/1/6/23`,
		method: 'GET',
		data
	})
}

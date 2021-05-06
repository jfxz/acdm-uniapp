import https from '../../../config/api-interface.js'
/* 靠桥率 */
export const getBridgeRate = (data) => {
	return https({
		url: `/dashboard/resource/bridgeRate/overview/${data.airportCode}`,
		method: 'GET',
		data
	})
}
// 资源概览
export const getforecastData = (data) => {
	return https({
		url: `/dashboard/resource/standForecast/${data.airportCode}`,
		method: 'GET',
		data
	})
}
// 机位占用
export const getStandData = (data) => {
	return https({
		url: `/dashboard/resource/stand/overview/${data.airportCode}`,
		method: 'GET',
		data
	})
}
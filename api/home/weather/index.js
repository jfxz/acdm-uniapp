import https from '../../../config/api-interface.js'
/* 天气数据 */
export const getWeatherData = (data) => {
	return https({
		url: `/dashboard/weather/weatherTelegram/${data.airportCode}/${data.type}/${data.time}/variflight`,
		method: 'GET'
	})
}
/* 异常天气 */
export const getAbnWeatherData = (data) => {
	return https({
		url: `/dashboard/weather/abnormal/${data.airportCode}/${data.time}`,
		method: 'GET'
	})
}

/* 本场天气 */
export const getLocalWeatherData = (data) => {
	return https({
		url: `/dashboard/weather/local/${data.airportCode}/${data.time}`,
		method: 'GET'
	})
}
/* 天气动态 */
export const getDynamicWeatherData = (data) => {
	return https({
		url: `/dashboard/weather/dynamic/${data.airportCode}/${data.time}`,
		method: 'GET'
	})
}
import https from '../../../config/api-interface.js'
/* 天气数据 */
export const getWeatherData = (data) => {
	return https({
		url: `/dashboard/weather/weatherTelegram/${data.airportCode}/${data.type}/${data.time}/variflight`,
		method: 'GET'
	})
}

import https from '../../../config/api-interface.js'
/* 各种放行延误原因架次统计 */
export const getDlyReasonFlight = (data) => {
	return https({
		url: `/dashboard/flight/flightDelay/overview/${data.airportCode}`,
		method: 'GET',
		data
	})
}
/* 获取各个方向放行正常率 */
export const getNormalReleaseRateRoute = (data) => {
	return https({
		url: `/dashboard/flight/normalReleaseRateEachRoute/${data.airportCode}`,
		method: 'GET',
		data
	})
}
// 获取已执行、未执行延误架次
export const getDelayReleaseFlightStatistics = (data) => {
	return https({
		url: `/dashboard/flight/delayReleaseFlightStatistics/${data.airportCode}`,
		method: 'GET',
		data
	})
}

// 各种放行延误趋势分析
export const getDlyForecast = (data) => {
  return https({
  	url: `/dashboard/flight/releaseForecast/${data.airportCode}`,
  	method: 'GET',
  	data
  })
}

// 获取时隙图上的航班数据
export const getRunWayList = (data) => {
  return https({
  	url: `/acdm/flightSchedule/sequential`,
  	method: 'GET',
  	data
  })
}
// 获取航路点
export const getRoutePointList = (data) => {
  return https({
  	url: `/flight-base/depRoute/${data.airportCode}/all`,
  	method: 'GET',
  	data
  })
}
import https from '../../../config/api-interface.js'
/* 当天放行率\起飞正常率 */
export const getPassRate = (data) => {
	return https({
		url: `/dashboard/release/passRate/${data.airportCode}`,
		method: 'GET',
		data
	})
}
// 获取COBT达成率
export const getCobtReachRate = (data) => {
	return https({
		url: `/dashboard/flight/cobtReachRate/${data.airportCode}`,
		method: 'GET',
		data
	})
}
// 获取日放行率达80%还需架次
export const getEstimateRateOfDay = (data) => {
	return https({
		url: `/dashboard/flight/estimateRateOfDay/${data.airportCode}`,
		method: 'GET',
		data
	})
}
// 获取月放行率达80%还需架次
export const getEstimateRateOfMonth = (data) => {
	return https({
		url: `/dashboard/flight/estimateRateOfMonth/${data.airportCode}`,
		method: 'GET',
		data
	})
}
// 获取日正常率的箭头数据
export const getArrowData = (data) => {
	return https({
		url: `/dashboard/flight/dayPassTrend/${data.airportCode}`,
		method: 'GET',
		data
	})
}
// 跑道号
export const getRunwayData = (data) => {
	return https({
		url: `/dashboard/airport/RUNWAY/${data.airportCode}`,
		method: 'GET',
		data
	})
}
// 获取机场排名
export const getRunningRanking = (data) => {
	return https({
		url: `/dashboard/airport/runningRanking`,
		method: 'GET',
		data
	})
}

export const getFlowControl = (data) => {
	return https({
		url: `/dashboard/flowControl/selectLikeXM`,
		method: 'POST',
		data
	})
}
// 获取日起飞正常率
export const getDayTakeoffRate = (data) => {
	return https({
		url: `/dashboard/flight/getDayTakeoffRate/${data.airportCode}`,
		method: 'GET',
		data
	})
}
// 获取月起飞正常率
export const getMonthTakeoffRate = (data) => {
	return https({
		url: `/dashboard/flight/getMonthTakeoffRate/${data.airportCode}/${data.start}/${data.end}`,
		method: 'GET',
		data
	})
}
// 获取月每日放行率
export const getDaliyPass = (data) => {
	return https({
		url: `/dashboard/flight/getNormalReleaseRate/${data.airportCode}`,
		method: 'GET',
		data
	})
}

// 月放行率
export const getMonthPassRate = (data) => {
	return https({
		url: `/dashboard/flight/passRate/sum/${data.airportCode}/${data.start}/${data.end}`,
		method: 'GET',
		data
	})
}

// 年、月放行、始发、加权、起飞率
export const getDayAndMonthRate = (data) => {
	return https({
		url: `/dashboard/release/sum/mobile/${data.airportCode}/${data.name}/${data.frequency}`,
		method: 'GET'
		// data
	})
}
// 获取月始发起飞正常率
export const getMonthOriginRate = (data) => {
	return https({
		url: `/dashboard/flight/getMonthOriginTakeoffRate/${data.airportCode}/1/12`,
		method: 'GET',
		data
	})
}

// 获取日综合正常率
export const getDayComprehensiveRate = (data) => {
	return https({
		url: `/dashboard/flight/getDayComprehensiveRate/${data.airportCode}`,
		method: 'GET',
		data
	})
}
// 获取月综合正常率
export const getMonthComprehensiveRate = (data) => {
	return https({
		url: `/dashboard/flight/getMonthComprehensiveRate/${data.airportCode}/${data.start}/${data.end}`,
		method: 'GET',
		data
	})
}
/* 当天放行率\起飞正常率 */
export const getTarget = (data) => {
	return https({
		url: `/dashboard/release/target/${data.airportCode}`,
		method: 'GET',
		data
	})
}

/*  获取跑道变更记录 */
export const getRunwayEven = (data) => {
	return https({
		url: `/dashboard/airport/runway/event/${data.airportCode}`,
		method: 'GET',
		data
	})
}

/*  获取当年累计正常率 */
export const getAccumulatedRate = (data) => {
	return https({
		url: `/dashboard/flight/accumulatedRate/${data.airportCode}`,
		method: 'GET',
		data
	})
}
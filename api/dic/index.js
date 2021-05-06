import https from '../../config/api-interface.js'
// 机场
export const getBaseAirport = _ => {
    return https({
        url: `/flight-base/airport/app/all`,
        method: 'GET'
		// handle:true
    })
}
// 进出港属性
export const getDirection = _ => {
    return https({
        url: `/flight-base/flightDirection/all`,
        method: 'GET'
		// handle:true
    })
}
// 基础航空公司
export const getBaseAirline = _ => {
    return https({
        url: `/flight-base/airline/app/all`,
        method: 'GET'
		// handle:true
    })
}
// 航班任务
export const getFlightTask = _ => {
    return https({
        url: `/flight-base/flightTask/app/all`,
        method: 'GET'
		// handle:true
    })
}
// 总代理
export const getAgent= _ => {
    return https({
        url: `/flight-base/generalAgent/all`,
        method: 'GET'
		// handle:true
    })
}
// 航班状态
export const getFlightStatus = _ => {
    return https({
        url: `/flight-base/flightStatus/app/all`,
        method: 'GET'
		// handle:true
    })
}
// 航班区域管理
export const getFlightNatur = _ => {
    return https({
        url: `/flight-base/flightNature/all`,
        method: 'GET'
		// handle:true
    })
}
// 异常代码
export const getIrrCode = _ => {
    return https({
        url: `/flight-base/irregularCode/app/all`,
        method: 'GET'
    })
}
// vip代码
export const getVipCode = _ => {
    return https({
        url: `/flight-base/viprank/all`,
        method: 'GET'
    })
}
// 机型
export const getAircraftType = _ => {
    return https({
        url: `/flight-base/aircraftType/all`,
        method: 'GET'
    })
}
// 根据iatacode（二字码）获取航司信息
export const getAirlineByIata = (data) => {
  return https({
    url: `/flight-base/airline/query?iatacode=${data.iatacode}&pageSize=100&pageNumber=0`,
    method: 'GET'
  })
}
// 根据机号查询启用机号信息的子机型相关信息
export const getRegistrationDetail = (data) => {
  return https({
      url: `/flight-base/aircraftRegistration/registrationDetail`,
      method: 'GET',
      data: data
  })
}
// 接电源未使用原因
export const bridgeNonUseReason = _ => {
	return https({
		url: `/flight-base/bridgeNonUseReason`,
		method: 'GET'
	})
}
// 航季
// export const getSeason = () => {
// 	return https({
// 	    url: `/flight-schedule/seasonName`,
// 	    method: 'GET'
// 	})
// }
// 机位
export const getStand = () => {
	return https({
	    url: `/res/stand/all`,
	    method: 'GET'
	})
}
// 机场公告
export const getAirportNoticeClose = (data) => {
	return https({
	    url: `/res/airportNotice/type/airportClose/${data.airportCode}`,
	    method: 'GET'
	})
}
export const getAirportNoticeOther = (data) => {
	return https({
	    url: `/res/airportNotice/type/other/${data.airportCode}`,
	    method: 'GET'
	})
}

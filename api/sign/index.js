import https from '../../config/api-interface.js'

// 获取服务详情
export const getSignInfo = (data) => {
    return https({
        url: `/gms/flightService/info/sign`,
        method: 'GET',
        data: data
    })
}
// 签署服务确认单
export const postService = (data) => {
    return https({
        url: `/gms/flightServiceDetail`,
        method: 'PUT',
        data: data
    })
}
// 入口权限校验
export const getPermission = (data) => {
    return https({
        url: `/gms/flightService/permissionCheck`,
        method: 'GET',
        data: data
    })
}
// 航司数据
export const getAirlineList = (data) => {
    return https({
        url: `/gms/flightService/airline/flight/${data.airportCode}`,
        method: 'GET',
        data: data
    })
}
// 航司历史数据
export const getAirlineHisList = (data) => {
    return https({
        url: `/gms/flightService/info/history`,
        method: 'GET',
        data: data
    })
}
// 获取服务项状态
export const getServiceStatus = (data) => {
    return https({
        url: `/gms/flightService/serviceItemStatus`,
        method: 'GET',
        data: data
    })
}

// 根据服务id获取所有服务项
export const getAllService = (data) => {
    return https({
        url: `/gms/flightServiceDetail/serviceItems`,
        method: 'GET',
        data: data
    })
}

//  新增服务确认单明细服务项
export const addService = (data) => {
    return https({
        url: `/gms/flightServiceDetail`,
        method: 'POST',
        data: data
    })
}

// 删除服务确认单明细服务项
export const delService = (data) => {
    return https({
        url: `/gms/flightServiceDetail/${data.id}`,
        method: 'DELETE',
        data: data
    })
}

import https from '../../config/api-interface.js'

// 获取任务列表
export const getTaskList = (data) => {
    return https({
        url: `/gms/flightTask/list/${data.airportCode}`,
        method: 'GET'
    })
}
// 获取未读数据
export const getunlist = (data) => {
    return https({
        url: `/user/allList/${data.userId}`,
        method: 'GET'
    })
}
// 修改任务
export const putTaskStatus = (data) => {
    return https({
        url: `/gms/flightTask`,
        method: 'PUT',
		data: data
    })
}

// 获取可绑定的设备
export const getDevicesList = (data) => {
    return https({
        url: `/gms/flightTask/resource?taskDefId=${data.taskDefId}&flightTaskId=${data.flightTaskId}`,
        method: 'GET'
    })
}

// 上班打卡
export const putInWork = (data) => {
    return https({
        url: `/gms/employee/inWork`,
        method: 'PUT'
    })
}

// 下班打卡
export const putAfterWork = (data) => {
    return https({
        url: `/gms/employee/afterWork`,
        method: 'PUT'
    })
}

// 获取员工详细
export const getresEmployeeInfo = (data) => {
    return https({
        url: `/gms/employee/info`,
        method: 'GET'
    })
}


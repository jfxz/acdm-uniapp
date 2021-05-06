import https from '../../config/api-interface.js'
import config from '../../config/api-config.js'

const serviceName = 'cargo' 
const serviceName2 = 'cargo'

// 测试
// export const cargoUrl = 'http://10.1.16.62:9093'
// 生产
export const cargoUrl = config.url
export const cargoSvnUrl = config.puductUrl

// 货站出库 扫码或输入集装器号返回单个货物信息
export const getCargoInfo = (data) => {
  return https({
    url: `/${serviceName}/cargo/info`,
		method: 'GET',
		data: data
  })
}

// 各个页面的右下角确认
export const confirm = (data) => {
  return https({
    url: `/${serviceName}/cargo/operationBatch`,
		method: 'PUT',
		data: data
  })
}

// 单个修改货物信息
export const updateCargoInfo = (data) => {
  return https({
    url: `/cargo/cargo`,
		method: 'PUT',
		data: data
  })
}

// 到达机位 装卸
export const getCargoInfoNotReceived = (data) => {
  return https({
    url: `/cargo/cargo/cargoInfoNotReceived`,
		method: 'POST',
		data: data
  })
}

// 装机稽核 装机变化
export const getCargoChanges = (data) => {
  return https({
    url: `/cargo/cargo/selectList`,
		method: 'GET',
		data: data
  })
}

// 获取操作记录
export const getBatchOrder = (data) => {
  return https({
    url: `/cargo/cargo/batchOrder`,
		method: 'GET',
		data: data
  })
}

// 获取操作过的历史批次单包含的货物信息
export const getBatchOrderInfo = (data) => {
  return https({
    url: `/cargo/cargo/batchOrder/info`,
		method: 'GET',
		data: data
  })
}

// 进港 获取航班列表
export const selectFlightList = (data) => {
  return https({
    url: `/${serviceName}/cargo/selectList`,
		method: 'GET',
		data: data
  })
}

// 通过航班号和集装器号得到集装器信息
export const unloadingInfo = (data) => {
  return https({
    url: `/cargo/cargo/unloading/info`,
		method: 'POST',
		data: data
  })
}

// 通过航班信息得到卸机单
export const getUnloading= (data) => {
  return https({
		url: `/cargo/cargo/flight/unload/info`,
		method: 'POST',
		data: data
  })
}

// 点击某个航班，获取卸机单
export const getUnloaderList = (data) => {
  return https({
    url: `/flight/info`,
		method: 'GET',
		data: data
  })
}

// 删除图片
// export const deleteImage = (data) => {
//   return https({
//     url: `/cargo/cargoIrregularRecord/${data.id}`,
// 		method: 'DELETE',
// 		data: data
//   })
// }

export const deleteImage = (data) => {
  return https({
    url: `/cargo/cargoIrregularRecord/deletePhoto?id=${data.id}&url=${data.url}`,
		method: 'DELETE',
		data: data
  })
}

// 装载变化
export const getInstalledAuditChange = (data) => {
  return https({
    url: `/cargo/cargo/operationBatch`,
		method: 'PUT',
		data: data
  })
}

// 操作记录减车
export const removeFromBatch = (data) => {
  return https({
    url: `/cargo/cargo/batchOrder/subtract?direction=${data.direction}&operationType=${data.operationType}&batchOrderId=${data.batchOrderId}&id=${data.id}`,
		method: 'PUT',
		data: data
  })
}

// 操作记录加车
export const addFromBatch = (data) => {
  return https({
    url: `/cargo/cargo/batchOrder/add?uld=${data.uld}&batchOrderId=${data.batchOrderId}&operationType=${data.operationType}&direction=${data.direction}`,
		method: 'PUT',
		data: data
  })
}

// 根据用户名获取用户信息
export const getUserInfo = (data) => {
  return https({
    url: `/base/user/info?username=${data.username} `,
		method: 'POST',
		data: data
  })
}

// 根据用户名获取用户信息(包含部门)
export const getUserDepart = (data) => {
  return https({
    url: `/base/user/page?username=${data.username}&isDeleted=0&pageSize=50&pageNumber=0`,
		method: 'GET',
		data: data
  })
}

// 根据用户id获取角色
export const getRoles = (data) => {
  return https({
    url: `/acdm/role/userRoles/` + data.userId,
		method: 'GET'
  })
}

// 根据出港方向和token获取当前用户的货物状态单
export const getOperatedHistory = (data) => {
  return https({
    url: `/cargo/cargo/history/info`,
		method: 'GET',
		data: data
  })
}

// 在选择界面，通过航班号查询集装器。
export const getContainerByFlight= (data) => {
  return https({
    url: `/cargo/cargo/flight/info`,
		method: 'GET',
		data: data
  })
}

// 获得待运区候选
export const getShipmentAreas= (data) => {
  return https({
    url: `/cargo/shipmentArea/all`,
		method: 'GET',
		data: data
  })
}

// 获取货站出库可以选择的集装器
export const getOutStockSelection= () => {
  return https({
    url: `/${serviceName}/cargo/station/info`,
		method: 'GET'
  })
}

// 更新机位
export const updateStandCode= (data) => {
  return https({
    url: `/cargo/cargo/updateStand/${data.id}`,
		method: 'GET'
  })
}

// 获取装机单卸机单的候选航班列表
export const getFlights= (data) => {
  return https({
    url: `/${serviceName}/cargo/formList/flight`,
		method: 'GET',
		data
  })
}

// 获取装机单卸机单
export const getFormList= (data) => {
  return https({
    url: `/cargo/cargo/formList`,
		method: 'GET',
		data
  })
}

// 航班列表获取卸机单

export const getUnloadingList= (data) => {
  return https({
    url: `/cargo/cargo/flight/unload/info`,
		method: 'POST',
		data
  })
}

// 拉下获取货物信息 ---扫描和输入

export const getPulldownCargoInfo = (data) => {
  return https({
    url: `/${serviceName}/cargoPull/info`,
		method: 'GET',
		data
  })
}

// 拉下货站货物信息 --选择
export const getPulldownConfirmSelection = () => {
  return https({
    url: `/${serviceName}/cargoPull/station/info`,
		method: 'GET'
  })
}

// 拉下货站货物信息 获取操作记录
export const getPulldownBatchOrder = (data) => {
  return https({
    url: `/${serviceName}/cargoPull/batchOrder`,
		method: 'GET',
		data: data
  })
}

// 拉下货站货物信息 获取操作过的历史批次单包含的货物信息
export const getPulldownBatchOrderInfo = (data) => {
  return https({
    url: `/${serviceName}/cargoPull/batchOrder/info`,
		method: 'GET',
		data: data
  })
}

// 拉下货站货物信息 各个页面的右下角确认
export const pulldownConfirm = (data) => {
  return https({
    url: `/${serviceName}/cargoPull/operationBatch`,
		method: 'PUT',
		data: data
  })
}

// 操作记录减车
export const removePulldownFromBatch = (data) => {
  return https({
    url: `/${serviceName}/cargoPull/batchOrder/subtract?direction=${data.direction}&operationType=${data.operationType}&batchOrderId=${data.batchOrderId}&id=${data.id}`,
		method: 'PUT',
		data: data
  })
}

// 操作记录加车
export const addPulldownFromBatch = (data) => {
  return https({
    url: `/${serviceName}/cargoPull/batchOrder/add?uld=${data.uld}&batchOrderId=${data.batchOrderId}&operationType=${data.operationType}&direction=${data.direction}`,
		method: 'PUT',
		data: data
  })
}

// 单个修改货物信息
export const updatePulldownCargoInfo = (data) => {
  return https({
    url: `/cargo/cargo`,
		method: 'PUT',
		data: data
  })
}

// 拉下 获取选择页面数据
export const getSortedData = (data) => {
  return https({
    url: `/${serviceName}/cargoPull/selectList`,
		method: 'GET',
		data: data
  })
}

// 拉下 获取全部拉下原因
export const getPulldownReasons = () => {
  return https({
    url: `/${serviceName}/cargoPullReason/all`,
		method: 'GET'
  })
}

// 拉下 查询
export const getPulldownSearchView = (data) => {
  return https({
    url: `/${serviceName}/cargoPull/app/totalInfo`,
		method: 'GET',
		data
  })
}

// 机坪监控视图
export const getStationFlat = (data) => {
  return https({
    url: `/${serviceName2}/cargo/info/appMonitor/stationFlat`,
		method: 'GET',
		data
  })
}
// 进出港监控试图
export const getAppMonitor = (data) => {
  return https({
    url: `/${serviceName2}/cargo/info/appMonitor`,
		method: 'GET',
		data
  })
}

// 获取监控头部信息
export const getAppMonitorTop = (data) => {
  return https({
    url: `/${serviceName2}/cargo/info/pcView`,
		method: 'GET',
		data
  })
}

// 获取拉下确认航班列表
export const getPulldownConfirmFlights = (data) => {
  return https({
    url: `/${serviceName}/cargoPull/today/flight`,
		method: 'GET',
		data
  })
}

// 获取今日航班数据 GET  请求参数：airportCode
export const getCostlyFlights = (data) => {
  return https({
    url: `/${serviceName}/specialCargo/today/flight`,
		method: 'GET',
		data
  })
}

// 根据航班信息获取集装器信息 GET 请求参数： flight uld
export const getPulldownConfirmCargoInfo = (data) => {
  return https({
    url: `/${serviceName}/cargoPull/today/flight/cargo/info`,
		method: 'POST',
		data
  })
}

// 根据航班信息获取集装器信息 GET 请求参数： flight uld
export const getCostlyUnloadCargoInfo = (data) => {
  return https({
    url: `/${serviceName}/specialCargo/today/flight/cargo/info`,
		method: 'POST',
		data
  })
}
// 贵货，危险品操作流程 PUT 请求参数：cargos direction operationType
export const confirmCostly = (data) => {
  return https({
    url: `/${serviceName}/specialCargo/operationBatch`,
		method: 'PUT',
		data
  })
}
// 上传图片 POST 请求参数：cargoId file operationType
export const uploadCostlyImage = (data) => {
  return https({
    url: `/${serviceName}/specialCargo/uploadImage`,
		method: 'POST',
		data
  })
}

// // 选择页面 GET 请求参数：flight direction
// export const getCostlySort = (data) => {
//   return https({
//     url: `/${serviceName}/cargo/flight/info`,
// 		method: 'GET',
// 		data
//   })
// }

// 根据航班号和方向获取货物信息--用于拉下的选择页面
export const getPullConfirmSort = (data) => {
  return https({
    url: `/${serviceName}/cargoPull/pullDown/selectList`,
		method: 'GET',
		data
  })
}

// 拉下货物确认 搜索候选
export const getPulldownSearChs = (data) => {
  return https({
    url: `/${serviceName}/cargoPull/selectCargo`,
		method: 'POST',
		data
  })
}

// 贵货
// 选择一个货物数据--用于卸机确认（候选框）
export const getCostlySearChs = (data) => {
  return https({
    url: `/${serviceName}/specialCargo/selectCargo`,
		method: 'POST',
		data
  })
}

// 贵货 扫码，输入（除了第一步之外）
export const getCostlyCargoInfo = (data) => {
  return https({
    url: `/${serviceName}/specialCargo/info`,
		method: 'GET',
		data
  })
}
// 贵货 交接运往货站 选择
export const selectCostlyList = (data) => {
  return https({
    url: `/${serviceName}/specialCargo/selectList`,
		method: 'GET',
		data
  })
}
// 贵货 卸机确认选择
export const getCostlySort = (data) => {
  return https({
    url: `/${serviceName}/specialCargo/unload/selectList`,
		method: 'POST',
		data
  })
}
// 贵货 滚动框
export const getCostlyScrolls = (data) => {
  return https({
    url: `/${serviceName}/specialCargo/history/info`,
		method: 'GET',
		data
  })
}
// 贵货 获取操作过的批次单
export const getCostlyHistoryBatchs = (data) => {
  return https({
    url: `/${serviceName}/specialCargo/batchOrder`,
		method: 'GET',
		data
  })
}
// 获取操作过的批次单包含的货物信息
export const getCostlyHistoryCargoInfo = (data) => {
  return https({
    url: `/${serviceName}/specialCargo/batchOrder/info`,
		method: 'GET',
		data
  })
}
// 历史操作为同一批次单增加货物信息
export const addCostlyFromBatch = (data) => {
  return https({
    url: `/${serviceName}/specialCargo/batchOrder/add?uld=${data.uld}&batchOrderId=${data.batchOrderId}&operationType=${data.operationType}&direction=${data.direction}`,
		method: 'PUT',
		data
  })
}
// 历史操作为同一批次单减少货物信息
export const removeCostlyFromBatch = (data) => {
  return https({
    url: `/${serviceName}/specialCargo/batchOrder/subtract?uld=${data.uld}&batchOrderId=${data.batchOrderId}&operationType=${data.operationType}&direction=${data.direction}&id=${data.id}`,
		method: 'PUT',
		data
  })
}

// 查询货物在哪个步骤在何时由何人操作
export const getDetailsOnOperation = (data) => {
  return https({
    url: `/${serviceName}/cargoOperationRecord/cargo`,
		method: 'PUT',
		data
  })
}

export const getBtnsByUser = (data) => {
  return https({
    url: `/${serviceName}/roleCargo/current/subscribe`,
		method: 'GET',
		data
  })
}

// 获取装机单所有版本
export const getVersions = data => {
  return https({
    url: `/${serviceName}/cargo/formList/multiVersion`,
    method: 'GET',
		data: data
  })
}

// 获取装载变化数据
export const getAuditChange = data => {
  return https({
    url: `/${serviceName}/cargo/installedChange/info`,
    method: 'GET',
		data: data
  })
}

// 装载完成 需要配载和装卸同时确认
export const completeAudit = data => {
  return https({
    url: `/${serviceName}/cargo/installedChange/confirm`,
    method: 'POST',
		data: data
  })
}

// 装载完成 需要配载和装卸同时确认
export const cargoRemind = data => {
  return https({
    url: `/${serviceName}/cargoRemind/halfHour`,
    method: 'GET',
		data: data
  })
}
// export const cargoRemind = data => {
//   return https({
//     url: `/${serviceName}/cargoRemind/queue`,
//     method: 'GET',
// 		data: data
//   })
// }

// 装载完成 需要配载和装卸同时确认
export const getFormlistRemark = data => {
  return https({
    url: `/${serviceName}/cargo/formList/remark`,
    method: 'GET',
		data: data
  })
}

// 装卸机单获得航班信息
export const getFlightInfo = data => {
  return https({
    url: `/${serviceName}/cargo/formList/flightInfo`,
    method: 'GET',
		data: data
  })
}

// 删除卸机后的集装器
export const removeUnloaderContainer = data => {
  return https({
    url: `/${serviceName}/cargo/${data.id}`,
    method: 'DELETE',
		data: data
  })
}

// 删除集装器
export const removeContainer = data => {
  return https({
    url: `/${serviceName}/cargo/${data.id}`,
    method: 'DELETE',
		data: data
  })
}

// 出港-货站出库/装卸下集装器还原到上一步骤
export const reStoreContainer = data => {
  return https({
    url: `/${serviceName}/cargo/status/rollback`,
    method: 'POST',
		data: data
  })
}

// 操作记录搜索集装器号
export const searchOperationHistory = data => {
  return https({
    url: `/${serviceName}/cargo/batchOrder/uld`,
    method: 'GET',
		data: data
  })
}

// 通过航班id查找这个航班的IFLI截关车数
export const getIFLInumber = data => {
  return https({
    url: `/${serviceName}/cargo/ifliCnt`,
    method: 'GET',
		data: data
  })
}

// 装机单过滤9C、AQ、国际航班（除澳航）
export const getFilteredFlight = data => {
  return https({
    url: `/res-v2/nonDepartingAirline`,
    method: 'GET',
		data: data
  })
}

export const validatenull = (val) => {
	if (val instanceof Array) {
		if (val.length === 0) return true
	} else if (typeof val === 'object') {
		if (JSON.stringify(val) === '{}') return true
		if (JSON.stringify(val) === '[]') return true
	} else {
		if (val === 'null' || val === null || val === 'undefined' || val === undefined || val === '') return true
		return false
	}
	return false
}

export const onError = (err) => {
	console.log('onError', err)
	try {
		uni.showToast({
			title: err.data.error || err.data.message,
			icon: 'none',
			duration: 2000
		})
		uni.hideLoading()
	} catch (e) {
		uni.showToast({
			title: e,
			icon: 'none',
			duration: 2000
		})
		uni.hideLoading()
	}
}

// 初始化出库截关里所有的消息
export const initCloseoffMsg = data => {
  return https({
    url: `/${serviceName}/outStockMessageRecord/add`,
    method: 'POST',
		data: data
  })
}


// 出库截关-锁定
export const closeoffLock = data => {
  return https({
    url: `/${serviceName}/cargo/outStock/lock`,
    method: 'POST',
		data: data
  })
}

// 出库截关-解锁
export const closeoffUnlock = data => {
  return https({
    url: `/${serviceName}/cargo/outStock/unLock`,
    method: 'POST',
		data: data
  })
}

// 出库截关-获取所有版本
export const getCloseoffVersions = data => {
  return https({
    url: `/${serviceName}/outStockMessageRecord/multiVersion`,
    method: 'GET',
		data: data
  })
}

// 获取出库截关数据
export const getCloseoffData = data => {
  return https({
    url: `/${serviceName}/cargo/outStock/info`,
    method: 'GET',
		data: data
  })
}

// 根据航班id获取该航班的出库截关时间与截关（锁定）操作人
export const getCloseOffOperatorAndTime = data => {
  return https({
    url: `/${serviceName}/cargo/outStock/closeInfo`,
    method: 'GET',
		data: data
  })
}

// 获取出库截关消息
export const getCloseoffMessage = data => {
  return https({
    url: `/${serviceName}/outStockMessageRecord/info`,
    method: 'GET',
		data: data
  })
}

// 获取装机单多出的车
export const getAdditionalCar = data => {
  return https({
    url: `/${serviceName}/cargo/test`,
    method: 'GET',
		data: data
  })
}

// 确认多出的车的消息
export const confirmAdditionalCar = data => {
  return https({
    url: `/${serviceName}/outStockMessageRecord/read/confirm`,
    method: 'POST',
		data: data
  })
}

// 查询该航班是否被锁定
export const getLockedStatus = data => {
  return https({
    url: `/${serviceName}/cargo/outStock/lockInfo`,
    method: 'GET',
		data: data
  })
}

// 出库截关-查询该航班的截关车数和截关时间
export const getCloseoffNumAndTime = data => {
  return https({
    url: `/${serviceName}/cargo/closeOffData`,
    method: 'GET',
		data: data
  })
}

// 出库截关-航班有新版本提醒
export const getCloseoffVersionRemind = data => {
  return https({
    url: `/${serviceName}/cargo/outStock/test`,
    method: 'GET',
		data: data
  })
}

// 通过航班号（包括承运人）查询这个航班的所有集装器（出港）
export const searchContainersByFlight = data => {
  return https({
    url: `/${serviceName}/cargo/allContainer/flight`,
    method: 'GET',
		data: data
  })
}

// 通过航班号（不包括承运人）查询这个航班的机位
export const getStandCodeByFlight = data => {
  return https({
    url: `/${serviceName}/cargo/flightInfo/stand`,
    method: 'GET',
		data: data
  })
}

// 获取所有航班状态
export const getFlightStatuses = () => {
  return https({
    url: `/flight-base/flightStatus/all`,
    method: 'GET'
  })
}

// 获取监控视图异常车列表
export const getAbCarsInMonitor = () => {
  return https({
    url: `/test`,
    method: 'GET'
  })
}
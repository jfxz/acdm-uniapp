import https from '../../config/api-interface.js'
// const severName = 'cloud-flight-schedule-lym'
const severName = 'flight-schedule'
// 获取拖车出港视图
export const getTrailerView = data => {
  return https({
    url: `/flight-schedule/linkedFlight/depTrailerView`,
    method: 'POST',
    data: data
  })
}
// 获取所有区域
export const getAreaManage = data => {
  return https({
    url: `/res/areaManage`,
    method: 'GET',
		data: data
  })
}

// 获取VIP等级
export const getVipTags = data => {
  return https({
    url: `/flight-base/viprank`,
    method: 'GET',
		data: data
  })
}

// 获取拖车趋势图
export const getLine = data => {
  return https({
    url: `/${severName}/flightCdm/depTrailerTrend`,
    method: 'GET',
		data: data
  })
}
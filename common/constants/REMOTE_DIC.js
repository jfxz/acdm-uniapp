/* 
 *  名称: 字典
 *  功能: 数据字典
 */
import {
	getBaseAirport,
	getDirection,
	getBaseAirline,
	getFlightTask,
	getAgent,
	getFlightStatus,
	getFlightNatur,
	getIrrCode,
	getVipCode,
	bridgeNonUseReason
} from '../../api/dic/index.js'

export const REMOTE_DIC = [
	/**
	 * 各类服务的字典使用服务名做前缀，比如航班基础数据 BASE_, 资源基础数据 RES_，用户相关数据 USER_
	 */
	// 进出港属性
	{
		key: 'BASE_DIRECTION',
		api: getDirection
	},
	// 基础航空公司
	{
		key: 'BASE_AIRLINE',
		api: getBaseAirline
	},
	// 航班任务
	{
		key: 'BASE_FLIGHT_TASK',
		api: getFlightTask
	},
	// 总代理
	{
		key: 'BASE_FLIGHT_AGENT',
		api: getAgent
	},
	// 航班状态
	{
		key: 'BASE_FLIGHT_STATUS',
		api: getFlightStatus
	},
	// 航班区域管理
	{
		key: 'BASE_FLIGHT_NATUR',
		api: getFlightNatur
	},
	// 异常代码
	{
		key: 'BASE_IRREGULAR_CODE',
		api: getIrrCode
	},
	// vip
	{
		key: 'BASE_VIP_CODE',
		api: getVipCode
	},
	// 接电源未使用原因
	{
		key: 'BRIDGE_NON_USEREASON',
		api: bridgeNonUseReason
	},
	// 机型
	// {
	// 	key: 'BASE_AIRCRAFT_TYPE',
	// 	api: getAircraftType
	// },
	// 航季信息
	// {
	// 	key: 'BASE_FLIGHT_SEASON',
	// 	api: getSeason
	// },
	// 航季信息
	// {
	// 	key: 'BASE_FLIGHT_STAND',
	// 	api: getStand
	// }
]
// 本地字典
export const DIC = {
	FLIGHTSTATUSCOLOR: {
		'到达': '#52c41a',
		'起飞': '#767c96',
		'备降': '#2f54eb',
		'途中': '#1890ff',
		'允许登机': '#faad14',
		'催促登机': '#0ebf9c',
		'过站登机': '#0ebf9c',
		'登机': '#0ebf9c',
		'登机结束': '#e39832',
		'延误': '#e85656',
		'取消': '#576078',
		'返航': '#e85656'
	},
}
export const POST = {
	POINT: 0, // 点对点
	GROUP_NORMAL: 1, // 普通群聊消息
	GROUP_IMPORTANT: 2, // 重要群聊消息（群成员要消息确认）
	GROUP_SYSTEM: 3, // 群系统消息（加群/退群/解散/群信息变更）
	BUSINESS_BROADCAST: 4, // 业务广播
	USER_STATUS: 5, // 用户状态（上下线）
	POST_CONFIRM: 6, // 消息确认
	GROUP_AT: 7, // 群聊的@消息
	GROUP_IMG: 8, // 群聊图片
	GROUP_FILE: 9, // 群聊的文件
	GROUP_VOICE: 10, // 群聊的语音
	GROUP_VIDEO: 11, // 群聊的视频
	POINT_IMG: 12, // 私聊图片
	POINT_FILE: 13, // 私聊的文件
	POINT_VOICE: 14, // 私聊的语音
	POINT_VIDEO: 15, // 私聊的视频
	TEMP_FILE: 16, // 临时文件
	SUBSCRIPTION: 17, // 订阅号消息
	GROUP_NOTIFY: 18 // 群管理信息
}

export const ONLINE = {
	FALSE: 0,
	TRUE: 1
}

export const SURE = {
	UNSURE: 0,
	AGREE: 1
}

export const USER_TYPE = {
	FRIEND: 0,
	GROUP: 1,
	SUBSCRIP: 2
}

export const CONFIRM = [{
		label: '未确认',
		value: 0
	},
	{
		label: '确认',
		value: 1
	}
]

export const CARDBUTTON = {
	CHAT: 0,
	ADDRESSBOOK: 1,
	SETTING: 2
}

export const SYSTEM_MSG_TYPE = {
	DISSOLVED: 0,
	JOIN: 1,
	EXIT: 2,
	SUBSCRIP: 3
}

export const CALENDAR = {
	Monday: '星期一',
	Tuesday: '星期二',
	Wednesday: '星期三',
	Thursday: '星期四',
	Friday: '星期五',
	Saturday: '星期六',
	Sunday: '星期日'
}

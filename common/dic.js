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
	getVipCode
} from '@/api/dic/index.js'

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
	// 机型
	// {
	// 	key: 'BASE_AIRCRAFT_TYPE',
	// 	api: getAircraftType
	// }
	// 航季信息
	// {
	// 	key: 'BASE_FLIGHT_SEASON',
	// 	api: getSeason
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
	CARGOSTATUS: {
		// 未复称
		'NOTRECLAIMED': '未复称',
		// 已复称
		'RECLAIMED': '已复称',
		// 未出库
		'NOTOUTOFSTOCK': '未出库',
		//已出库
		'OUTOFSTOCK': '已出库',
		// 国际转国内
		'RECEIVED_INTTODOM': '国际转国内',
		// 已接收
		'RECEIVED': '装卸已接收', 
		// 运往待运区（装卸）
		'TOWAITINGAREA_STEVEDORING': '装卸运往待运区',
		//运往待运区
		'TOWAITINGAREA': '运往待运区',
		//已到达待运区
		'ARRIVEDWAITINGAREA': '已到达待运区',
		// 运往机位（装卸）
		'TOAIRCRAFT_STEVEDORING': '装卸运往机位',
		//运往机位
		'TOAIRCRAFT': '运往机位',
		//已到机位
		'ARRIVEDAIRCRAFT': '已到机位',
		//装机
		'INSTALLING': '装机',
		//已完成
		'COMPLETED': '已完成',
		
		
		'NOTUNLOADER': '',
		// 卸机
		'UNLOADER': '卸机',
		// 运往货站（装卸）
		'TOSTATION_STEVEDORING': '装卸运往货站',
		// 运往货站
		'TOSTATION': '运往货站',
		// 到达货站
		'ARRIVEDSTATION': '到达货站',
		// 入库
		'WAREHOUSED': '入库',
		
		// 拉下
		'NOTPULLDOWN': '未拉下',
		'PULLDOWN': '确认拉下',
		// 运往货站
		'TOSTATION': '运往货站',
		// 到达货站
		'ARRIVEDSTATION': '到达货站',
		// 入库
		'WAREHOUSED': '入库'
	},
	// 货运出港状态顺序
	CARGOSTATUSD: [
		// 未复称
		'NOTRECLAIMED',
		// 已复称
		'RECLAIMED',
		// 未出库
		'NOTOUTOFSTOCK',
		//已出库
		'OUTOFSTOCK',
		// 国际转国内
		'RECEIVED_INTTODOM',
		// 已接收
		'RECEIVED',
		// 装卸运往待运区
		'TOWAITINGAREA_STEVEDORING',
		//运往待运区
		'TOWAITINGAREA',
		//已到达待运区
		'ARRIVEDWAITINGAREA',
		// 装卸运往机位
		'TOAIRCRAFT_STEVEDORING',
		//运往机位
		'TOAIRCRAFT',
		//已到机位
		'ARRIVEDAIRCRAFT',
		//装机
		'INSTALLING',
		//已完成
		'COMPLETED',
	],
	// 货运进港状态顺序
	CARGOSTATUSA: [
		'NOTUNLOADER',
		// 卸机
		'UNLOADER',
		//运往待运区
		'TOWAITINGAREA',
		//已到达待运区
		'ARRIVEDWAITINGAREA',
		// 装卸运往货站
		'TOSTATION_STEVEDORING',
		// 运往货站
		'TOSTATION',
		// 到达货站
		'ARRIVEDSTATION',
		// 入库
		'WAREHOUSED',
		//已完成
		'COMPLETED'
	],
	// 拉下货物状态顺序
	PULLDOWNSTATUS: [
		// 未拉下
		'NOTPULLDOWN',
		// 已拉下
		'PULLDOWN',
		//运往待运区
		'TOWAITINGAREA',
		//已到达待运区
		'ARRIVEDWAITINGAREA',
		// 运往货站
		'TOSTATION',
		// 到达货站
		'ARRIVEDSTATION',
		// 入库
		'WAREHOUSED',
		//已完成
		'COMPLETED'
	]
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

// 出港按钮
export const CARGO_LEAVE_BTNS = [{
	index: 0,
	name: '货站出库',
	label: '货站出库',
	remark: '理货装卸',
	icon: '/static/out-stock.png',
	funcName: 'outStock',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/leaveport/out-stock`
		})
	}
},
{
	index: 1,
	name: '国际转国内',
	label: '国际转国内',
	remark: '国际转国内',
	icon: '/static/load-receive.png',
	funcName: 'intToDom',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/leaveport/int-to-dom`
		})
	}
},
{
	index: 2,
	name: '装卸接收',
	label: '装卸接收',
	remark: '装卸接收',
	icon: '/static/load-receive.png',
	funcName: 'loadingReceive',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/leaveport/load-receive`
		})
	}
},{
	index: 3,
	name: '交接运往待运区',
	label: '交接运往待运区(装卸押运)',
	remark: '装卸押运',
	icon: '/static/to-wait-area.png',
	funcName: 'leaveToWaitArea',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/leaveport/to-waiting-area-stevedoring`
		})
	}
},{
	index: 4,
	name: '交接运往待运区',
	remark: '特车拖车',
	label: '交接运往待运区(拖车司机)',
	icon: '/static/to-wait-area.png',
	funcName: 'leaveToWaitAreaDriver',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/leaveport/to-waiting-area-driver`
		})
	}
},{
	index: 5,
	name: '到达待运区确认',
	label: '到达待运区确认',
	remark: '特车拖车',
	icon: '/static/arrive-waiting-area-driver.png',
	funcName: 'leaveArriveWatingAreaDriver',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/leaveport/arrive-waiting-area-driver`
		})
	}
},{
	index: 6,
	name: '交接运往机位',
	label: '交接运往机位(装卸押运)',
	remark: '装卸押运',
	icon: '/static/to-aircraft.png',
	funcName: 'leaveToAircraftStevedoring',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/leaveport/to-aircraft-stevedoring`
		})
	}
},{
	index: 7,
	name: '交接运往机位',
	label: '交接运往机位(拖车司机)',
	remark: '特车拖车',
	icon: '/static/to-aircraft.png',
	funcName: 'leaveToAircraftDriver',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/leaveport/to-aircraft-driver`
		})
	}
},{
	index: 8,
	name: '到达机位交接',
	label: '到达机位交接',
	remark: '特车拖车与装卸',
	icon: '/static/arrive-aircraft.png',
	funcName: 'leaveArriveAircraft',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/leaveport/arrive-aircraft`
		})
	}
},{
	index: 9,
	name: '货物分舱',
	label: '货物分舱',
	remark: '客机组和配载外场',
	icon: '/static/sub-cabin.png',
	funcName: 'subCabin',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/leaveport/sub-cabin`
		})
	}
},{
	index: 10,
	name: '装机确认',
	label: '装机确认',
	remark: '装卸客机组',
	icon: '/static/installed-confirm.png',
	funcName: 'installedConfirm',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/leaveport/installed-confirm`
		})
	}
},{
	index: 11,
	name: '装机稽核',
	label: '装机稽核',
	remark: '配载外场',
	icon: '/static/installed-audit.png',
	funcName: 'leaveInstalledAudit',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/leaveport/installed-audit`
		})
	}
}, {
	index: 12,
	name: '装机单查询',
	label: '装机单查询',
	remark: '装机单查询',
	icon: '/static/install-list.png',
	funcName: 'installSearchOrder',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/leaveport/uploader-install-search`
		})
	}
}, {
	index: 13,
	name: '异常入库',
	label: '异常入库',
	remark: '异常入库',
	icon: '/static/out-stock.png',
	funcName: 'abnormalWarehouse',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/leaveport/abnormal-warehouse`
		})
	}
}
]

// 进港按钮
export const CARGO_ENTER_BTNS = [{
	index: 0,
	name: '卸机',
	label: '卸机',
	remark: '装卸接收',
	icon: '/static/installed-confirm.png',
	funcName: 'enterUnloading',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/enterport/unloading`
		})
	}
},
// {
// 	index: 1,
// 	name: '交接运往待运区',
// 	label: '交接运往待运区(装卸押运)',
// 	remark: '装卸押运',
// 	icon: '/static/to-wait-area.png',
// 	funcName: 'enterPortToWaitingAreaStevedoring',
// 	func: function () {
// 		uni.navigateTo({
// 			url: `/pages/cargo/enterport/to-waiting-area-stevedoring`
// 		})
// 	}
// },{
// 	index: 2,
// 	name: '交接运往待运区',
// 	label: '交接运往待运区(拖车司机)',
// 	remark: '特车拖车',
// 	icon: '/static/to-wait-area.png',
// 	funcName: 'enterPortToWaitingAreaDriver',
// 	func: function () {
// 		uni.navigateTo({
// 			url: `/pages/cargo/enterport/to-waiting-area-driver`
// 		})
// 	}
// },{
// 	index: 3,
// 	name: '到达待运区交接',
// 	label: '到达待运区交接',
// 	remark: '特车拖车与装卸',
// 	icon: '/static/arrive-waiting-area-driver.png',
// 	funcName: 'enterPortArriveWaitingArea',
// 	func: function () {
// 		uni.navigateTo({
// 			url: `/pages/cargo/enterport/arrive-waiting-area`
// 		})
// 	}
// },
{
	index: 1,
	name: '交接运往货站',
	label: '交接运往货站(装卸押运)',
	remark: '装卸接收',
	icon: '/static/to-aircraft.png',
	funcName: 'enterPortToCargoStationStevedoring',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/enterport/to-cargo-station-stevedoring`
		})
	}
},{
	index: 2,
	name: '交接运往货站',
	label: '交接运往货站(拖车司机)',
	remark: '特车拖车',
	icon: '/static/to-aircraft.png',
	funcName: 'enterPortToCargoStationDriver',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/enterport/to-cargo-station-driver`
		})
	}
},{
	index: 3,
	name: '到达货站交接',
	label: '到达货站交接',
	remark: '特车拖车',
	icon: '/static/out-stock.png',
	funcName: 'enterArriveCargoStation',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/enterport/arrive-cargo-station`
		})
	}
}, {
	index: 4,
	name: '货站入库',
	label: '货站入库',
	remark: '货站入库',
	icon: '/static/out-stock.png',
	funcName: 'confirmCargoStation',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/enterport/ware-house`
		})
	}
}, {
	index: 5,
	name: '卸机单查询',
	label: '卸机单查询',
	remark: '卸机单查询',
	icon: '/static/install-list.png',
	funcName: 'enterUninstallSearchOrder',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/enterport/loader-uninstall-search`
		})
	}
}]

// 拉下货物按钮
export const CARGO_PULL_DOWN = [{
	index: 0,
	name: '拉下确认',
	label: '拉下确认',
	remark: '拉下确认',
	icon: '/static/installed-confirm.png',
	funcName: 'pulldownConfirm',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/pulldown/pulldown-confirm`
		})
	}
},{
	index: 1,
	name: '交接运往待运区',
	label: '交接运往待运区',
	remark: '装卸押运',
	icon: '/static/to-wait-area.png',
	funcName: 'pulldownToWaitingAreaStevedoring',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/pulldown/to-waiting-area-stevedoring`
		})
	}
},{
	index: 2,
	name: '到达待运区交接',
	label: '到达待运区交接',
	remark: '装卸押运',
	icon: '/static/arrive-waiting-area-driver.png',
	funcName: 'pulldownArriveWaitingArea',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/pulldown/arrive-waiting-area`
		})
	}
},{
	index: 3,
	name: '交接运往货站',
	label: '交接运往货站(装卸押运)',
	remark: '装卸接收',
	icon: '/static/to-aircraft.png',
	funcName: 'pulldownToCargoStationStevedoring',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/pulldown/to-cargo-station-stevedoring`
		})
	}
},{
	index: 4,
	name: '交接运往货站',
	label: '交接运往货站(拖车司机)',
	remark: '特车拖车',
	icon: '/static/to-aircraft.png',
	funcName: 'pulldownToCargoStationDriver',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/pulldown/to-cargo-station-driver`
		})
	}
},{
	index: 5,
	name: '到达货站交接',
	label: '到达货站交接',
	remark: '特车拖车',
	icon: '/static/out-stock.png',
	funcName: 'pulldownArriveCargoStation',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/pulldown/arrive-cargo-station`
		})
	}
},
{
	index: 6,
	name: '货站入库',
	label: '货站入库',
	remark: '货站入库',
	icon: '/static/out-stock.png',
	funcName: 'pulldownArriveWareHouse',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/pulldown/ware-house`
		})
	}
}, {
	index: 7,
	name: '拉下查询',
	label: '拉下查询(配载查询)',
	remark: '配载查询',
	icon: '/static/install-list.png',
	funcName: 'pulldownDistributionSearch',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/pulldown/pulldown-distribution-search`
		})
	}
}, {
	index: 8,
	name: '拉下查询',
	label: '拉下查询(装卸、特车查询)',
	remark: '装卸、特车查询',
	icon: '/static/install-list.png',
	funcName: 'pullDownTransferSearch',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/pulldown/pulldown-transfer-search`
		})
	}
}, {
	index: 9,
	name: '拉下查询',
	label: '拉下查询(货站查询)',
	remark: '货站查询',
	icon: '/static/install-list.png',
	funcName: 'pulldownWarehouseSearch',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/pulldown/pulldown-warehouse-search`
		})
	}
}]

export const MONITOR = [{
	index: 0,
	name: 'Z5站坪监控视图',
	label: 'Z5站坪监控视图',
	remark: '装卸接收',
	icon: '/static/install-list.png',
	funcName: 'monitorLoadReceive',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/monitor/load-receive`
		})
	}
}, {
	index: 1,
	name: '出港监控视图',
	label: '出港监控视图',
	remark: '',
	icon: '/static/install-list.png',
	funcName: 'monitorLeaveport',
	// url: `/pages/cargo/monitor/leaveport`
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/monitor/leave-enter-port-flight?type=D`
		})
	}
}, {
	index: 2,
	name: '进港监控视图',
	label: '进港监控视图',
	remark: '',
	icon: '/static/install-list.png',
	funcName: 'monitorEnterport',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/monitor/leave-enter-port-flight?type=A`
		})
	}
}]

export const CARGO_COSTLY = [{
	index: 0,
	name: '卸机',
	label: '卸机',
	remark: '地勤',
	icon: '/static/installed-confirm.png',
	funcName: 'costlyUnloading',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/costly/unloading`
		})
	}
},{
	index: 1,
	name: '交接运往货站',
	label: '交接运往货站',
	remark: '装卸接收',
	icon: '/static/to-aircraft.png',
	funcName: 'costlyToCargoStationStevedoring',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/costly/to-cargo-station-stevedoring`
		})
	}
},{
	index: 2,
	name: '到达货站交接',
	label: '到达货站交接',
	remark: '装卸押运',
	icon: '/static/out-stock.png',
	funcName: 'costlyArriveCargoStation',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/costly/arrive-cargo-station`
		})
	}
}, {
	index: 3,
	name: '货站入库',
	label: '货站入库',
	remark: '货站入库',
	icon: '/static/out-stock.png',
	funcName: 'costlyConfirmCargoStation',
	func: function () {
		uni.navigateTo({
			url: `/pages/cargo/costly/ware-house`
		})
	}
}]


export const CARGO_ROLES = [{
	name: '厦门地勤国际货站',
	btns: [
		// 出港
		// 货站出库
		'outStock',
		// 国际转国内
		'intToDom',
		
		// 拉下
		// 拉下查询
		'pulldownDistributionSearch'
	]
}, {
	name: '厦门地勤国内货站',
	btns: [
		// 出港
		// 货站出库
		'outStock',
		
		// 拉下
		// 拉下查询
		'pulldownDistributionSearch'
	]
}, {
	name: '地勤国内货站',
	btns: [
		// 出港
		// 货站出库
		'outStock',
		
		// 拉下
		// 拉下查询
		'pulldownDistributionSearch'
	]
}, {
	name: '厦门地勤装卸押运',
	btns: [
		// 出港
		// 装卸押运
		'loadingReceive',
		// 出港交接运往待运区
		'leaveToWaitArea',
		// 出港交接运往机位
		'leaveToAircraftStevedoring',
		// 出港到达机位交接
		'leaveArriveAircraft',
		// 货物分舱
		'subCabin',
		
		
		// 进港
		// 进港交接运往待运区
		'enterPortToWaitingAreaStevedoring',
		// 进港到达待运区
		'enterPortArriveWaitingArea',
		// 交接运往货站
		'enterPortToCargoStationStevedoring',
		
		// 拉下
		// 到达待运区交接
		'pulldownArriveWaitingArea',
		// 交接运往货站
		'pulldownToCargoStationStevedoring',
		
		//贵货
		// 交接运往货站（装卸押运）
		'costlyToCargoStationStevedoring',
		// 到达货站交接 （装卸押运）
		'costlyArriveCargoStation',
		// 拉下查询
		'pulldownDistributionSearch'
	]
},{
	name: '厦门地勤特车拖车',
	btns: [
		// 出港
		// 出港交接运往待运区
		'leaveToWaitAreaDriver',
		// 出港到达待运区确认
		'leaveArriveWatingAreaDriver',
		// 出港交接运往机位
		'leaveToAircraftDriver',
		// 出港到达机位交接
		'leaveArriveAircraft',
		
		
		// 进港
		// 进港交接运往待运区
		'enterPortToWaitingAreaDriver',
		// 进港到达待运区
		'enterPortArriveWaitingArea',
		// 进港到达货站
		'enterArriveCargoStation',
		// 交接运往货站
		'enterPortToCargoStationDriver',
		
		
		// 拉下
		// 交接运往货站
		'pulldownToCargoStationDriver',
		// 到达货站交接
		'pulldownArriveCargoStation',
		// 拉下查询
		'pulldownDistributionSearch'
	]
},{
	name: '装卸客机组',
	btns: [
		// 出港
		// 货物分舱
		'subCabin',
		// 装机确认
		'installedConfirm',
		
		// 拉下
		// 交接运往待运区
		'pulldownToWaitingAreaStevedoring',
		
		
		// 进港
		// 卸机
		'enterUnloading',
		// 交接运往待运区
		'enterPortToWaitingAreaStevedoring'
	]
},{
	name: '厦门地勤装卸客机',
	btns: [
		// 货物分舱
		'subCabin',
		// 装机确认
		'installedConfirm',
		// 卸机
		'enterUnloading',
		
		// 拉下
		// 交接运往待运区
		'pulldownToWaitingAreaStevedoring'
	]
},{
	name: '厦门地勤配载外场',
	btns: [
		// 出港
		// 装机稽核
		'leaveInstalledAudit',
		
		// 进港
		// 卸机
		'enterUnloading',
		
		// 拉下
		// 拉下确认
		'pulldownConfirm',
		// 拉下查询
		'pulldownDistributionSearch',
		
		
		// 贵货
		// 卸机
		'costlyUnloading'
	]
},{
	name: '货站押运',
	btns: [
		// 装机稽核
		'confirmCargoStation',
		
		// 拉下
		// 拉下查询
		'pulldownDistributionSearch'
	]
}, {
	name: '货站理货',
	btns: [
		// 出港
		'outStock',
		
		
		// 贵货
		// 到达货站交接（入库）
		'costlyConfirmCargoStation',
		
		// 拉下
		// 拉下查询
		'pulldownDistributionSearch'
	]
}]
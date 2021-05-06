const getters = {
	user: state => state.user.user,
	allUserMsg: state => state.user,
	flight: state => state.flight,
	ALLFLIGHT: state => state.flight.allFlight,
	userInfo: state => state.user.userInfo,
	friendInfo: state => state.user.friendInfo,
	friendTree: state => state.user.friendTree,
	message: state => state.message.message,
	channelInfo: state => state.user.channelInfo,
	subscriptionInfo: state => state.user.subscriptionInfo,
	activeList: state => state.user.activeList,
	chatInfo: state => state.message.chatInfo,
	selectFirend: state => state.user.selectFirend,
	activityDiff: state => state.flight.flightActivityDiff,
	flightStatus: state => state.flight.flightStatus,
	remoteDic: state => state.dic.remoteDic,
	operationHistoryList: state => state.cargo.operationHistoryList,
	backFlag: state => state.cargo.backFlag,
	cargoUserInfo: state => state.cargo.cargoUserInfo,
	cargoRolesInfo: state => state.cargo.cargoRolesInfo,
	cargoUserForm: state => state.cargo.cargoUserForm,
	// 是否完成了出港的交接运往待运区装卸
	completedLeaveToWaitingArea: state => state.cargo.completedLeaveToWaitingArea,
	// 是否完成了出港的交接运往机位的装卸
	completedLeaveToAircraft: state => state.cargo.completedLeaveToAircraft,
	// 是否完成了进港的交接运往待运区的装卸
	completedEnterToWaitingArea: state => state.cargo.completedEnterToWaitingArea,
	// 是否完成了进港的交接运往货站的装卸
	completedEnterToStation: state => state.cargo.completedEnterToStation,
	// 是否完成了出港的到达待运区
	completedLeaveArrivedWaitingArea: state => state.cargo.completedLeaveArrivedWaitingArea,
	// 是否完成了出港的到达机位
	completedLeaveArrivedAircraft: state => state.cargo.completedLeaveArrivedAircraft,
	completedEnterArrivedWaitingArea: state => state.cargo.completedEnterArrivedWaitingArea,
	completedEnterArrivedStation: state => state.cargo.completedEnterArrivedStation,
	completedOutStock: state => state.cargo.completedOutStock,
	completedUnloading: state => state.cargo.completedUnloading,
	completedWareHoused: state => state.cargo.completedWareHoused,
	// 是否完成了进出港的运输单
	arrivedLeaveWaitingArea: state => state.cargo.arrivedLeaveWaitingArea,
	arrivedLeaveAircraft: state => state.cargo.arrivedLeaveAircraft,
	arrivedEnterWaitingArea: state => state.cargo.arrivedEnterWaitingArea,
	arrivedEnterStation: state => state.cargo.arrivedEnterStation,
	tabbar: state => state.user.tabbar,
	code: state => state.cargo.code,
	scanBack: state => state.cargo.scanBack,
	// 拉下
	completedPulldownConfirm: state => state.cargo.completedPulldownConfirm,
	completedPulldownToWaitingArea: state => state.cargo.completedPulldownToWaitingArea,
	completedPulldownWaitingArea: state => state.cargo.completedPulldownWaitingArea,
	completedPulldownToStation: state => state.cargo.completedPulldownToStation,
	arrivedPulldownStation: state => state.cargo.arrivedPulldownStation,
	completedPulldownArrivedStation: state => state.cargo.completedPulldownArrivedStation,
	completedPulldownWareHouse: state => state.cargo.completedPulldownWareHouse,
	
	completedCostlyUnloading: state => state.cargo.completedCostlyUnloading,
	completedCostlyToStation: state => state.cargo.completedCostlyToStation,
	completedCostlyArrivedStation: state => state.cargo.completedCostlyArrivedStation,
	completedCostlyWareHouse: state => state.cargo.completedCostlyWareHouse,
	
	// 登机口引导单
	dispatcherMsg: state => state.guide.dispatcherMsg,
	
	// 空集装器
	crateGroupInput: state => state.emptyContainer.crateGroupInput,
	cargoStationConfirm: state => state.emptyContainer.cargoStationConfirm,
	cargoStationInput: state => state.emptyContainer.cargoStationInput,
	crateGroupConfirm: state => state.emptyContainer.crateGroupConfirm,
	cargoStationInputPallet: state => state.emptyContainer.cargoStationInputPallet,
	crateGroupConfirmPallet: state => state.emptyContainer.crateGroupConfirmPallet,
	// 货站出库和出库截关新版本提醒
	newVersionMsg: state => state.cargo.newVersionMsg,
	// 出库截关数据
	oriCloseOffList: state => state.cargo.oriCloseOffList,
  // 航班状态
  depStatusList: state => state.cargo.depStatusList
}
export default getters

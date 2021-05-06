const cargo = {
	state: {
		// 操作记录进去的页面的列表的值，用来在操作记录进去的页面的值和操作记录进去的页面再点击选择跳向的页面的值之间传递数据用
		// 因为uniapp无法监听上个页面返回
		operationHistoryList: [],
		// 是否是从上个页面返回的
		backFlag: false,
		// 是否是扫码返回
		scanBack: false,
		// 二维码信息
		code: '',
		// 用户信息
		cargoUserInfo: {},
		// 用户表单信息
		cargoUserForm: {},
		// 角色信息
		cargoRolesInfo: [],
		// 是否完成出库
		completedOutStock: false,
		// 是否完成了出港的交接运往待运区装卸
		completedLeaveToWaitingArea: false,
		// 是否完成了出港的到达待运区交接
		completedLeaveArrivedWaitingArea: false,
		// 是否完成了出港的交接运往机位的装卸
		completedLeaveToAircraft: false,
		// 是否完成了出港的到达机位交接
		completedLeaveArrivedAircraft: false,
		// 是否完成了进港的交接运往待运区的装卸
		completedEnterToWaitingArea: false,
		// 是否完成了进港的到达待运区交接
		completedEnterArrivedWaitingArea: false,
		// 是否完成了进港的交接运往货站的装卸
		completedEnterToStation: false,
		// 是否完成了进港的到达货站
		completedEnterArrivedStation: false,
		// 是否完成了进港的货站入库
		completedWareHoused: false,
		// 是否完成了出港的到达待运区运输单
		arrivedLeaveWaitingArea: false,
		// 是否完成了出港的到达待运区运输单
		arrivedLeaveAircraft: false,
		// 是否完成了出港的到达待运区运输单
		arrivedEnterWaitingArea: false,
		// 是否完成了进港的到达货站运输单
		arrivedEnterStation: false,
		// 是否完成卸机
		completedUnloading: false,
		
		// 是否完成了下拉确认
		completedPulldownConfirm: false,
		// 是否完成了下拉交接运往待运区
		completedPulldownToWaitingArea: false,
		// 是否完成了下拉到达待运区
		completedPulldownWaitingArea: false,
		// 是否完成了下拉交接运往货站（装卸接收）
		completedPulldownToStation: false,
		// 是否完成了下拉交接运往货站的运输单 （拖车司机）
		arrivedPulldownStation: false,
		// 是否完成了下拉到达货站
		completedPulldownArrivedStation: false,
		// 是否完成了下拉货站接收
		completedPulldownWareHouse: false,
		
		// 贵货
		completedCostlyUnloading: false,
		completedCostlyToStation: false,
		completedCostlyArrivedStation: false,
		completedCostlyWareHouse: false,
		newVersionMsg: '',
		// 保存最原本的出库截关航班集装器信息
		oriCloseOffList: [],
    depStatusList: []
	},
	actions: {
    setDepStatusList (state, list) {
      state.commit('SET_DEP_STATUS_LIST', list)
    },
		setOperationHistoryList (state, list) {
			state.commit('SET_OPERATION_HISTORY_LIST', list)
		},
		setBackFlag (state, status) {
			state.commit('SET_BACK_FLAG', status)
		},
		setUserInfo (state, userInfo) {
			state.commit('SET_USER_INFO', userInfo)
		},
		setRolesInfo (state, rolesInfo) {
			state.commit('SET_ROLES_INFO', rolesInfo)
		},
		setCargoUserForm (state, userForm) {
			state.commit('SET_CARGO_USER_FORM', userForm)
		},
		setCompletedLeaveToWaitingArea (state, flag) {
			state.commit('SET_COMPLETED_LEAVE_TO_WAITING_AREA', flag)
		},
		setCompletedLeaveArrivedWaitingArea (state, flag) {
			state.commit('SET_COMPLETED_LEAVE_ARRIVED_WAITING_AREA', flag)
		},
		setCompletedLeaveToAircraft (state, flag) {
			state.commit('SET_COMPLETED_LEAVE_TO_AIRCRAFT', flag)
		},
		setCompletedEnterToWaitingArea (state, flag) {
			state.commit('SET_COMPLETED_ENTER_TO_WAITING_AREA', flag)
		},
		setCompletedEnterToStation (state, flag) {
			state.commit('SET_COMPLETED_ENTER_TO_STATION', flag)
		},
		setCompletedEnterArrivedWaitingArea (state, flag) {
			state.commit('SET_COMPLETED_ENTER_ARRIVED_WAITING_AREA', flag)
		},
		setCompletedEnterArrivedStation (state, flag) {
			state.commit('SET_COMPLETED_ENTER_ARRIVED_STATION', flag)
		},
		setCompletedOutStock (state, flag) {
			state.commit('SET_COMPLETED_OUT_STOCK', flag)
		},
		setArrivedLeaveWaitingArea (state, flag) {
			state.commit('SET_ARRIVED_LEAVE_WAITING_AREA', flag)
		},
		setArrivedLeaveAircraft (state, flag) {
			state.commit('SET_ARRIVED_LEAVE_AIRCRAFT', flag)
		},
		setArrivedEnterWaitingArea (state, flag) {
			state.commit('SET_ARRIVED_ENTER_WAITING_AREA', flag)
		},
		setArrivedEnterStation (state, flag) {
			state.commit('SET_ARRIVED_ENTER_STATION', flag)
		},
		setCompletedUnloading (state, flag) {
			state.commit('SET_COMPLETED_UNLOADING', flag)
		},
		setCompletedWareHoused (state, flag) {
			state.commit('SET_COMPLETED_WARE_HOUSED', flag)
		},
		setScanBack (state, flag) {
			state.commit('SET_SCAN_BACK', flag)
		},
		setCode (state, code) {
			state.commit('SET_CODE', code)
		},
		
		setCompletedPulldownConfirm (state, flag) {
			state.commit('SET_COMPLETED_PULLDOWN_CONFIRM', flag)
		},
		setCompletedPulldownToWaitingArea (state, flag) {
			state.commit('SET_COMPLETED_PULLDOWN_TOWAITINGAREA', flag)
		},
		setCompletedPulldownWaitingArea (state, flag) {
			state.commit('SET_COMPLETED_PULLDOWN_WAITINGAREA', flag)
		},
		setCompletedPulldownToStation (state, flag) {
			state.commit('SET_COMPLETED_PULLDOWN_TOSTATION', flag)
		},
		setArrivedPulldownStation (state, flag) {
			state.commit('SET_ARRIVED_PULLDOWN_STATION', flag)
		},
		setCompletedPulldownArrivedStation (state, flag) {
			state.commit('SET_COMPLETED_PULLDOWN_ARRIVEDSTATION', flag)
		},
		setCompletedPulldownWareHouse (state, flag) {
			state.commit('SET_COMPLETED_PULLDOWN_WAREHOUSE', flag)
		},
		setCompletedCostlyUnloading (state, flag) {
			state.commit('SET_COMPLETED_COSTLY_UNLOADING', flag)
		},
		setCompletedCostlyToStation (state, flag) {
			state.commit('SET_COMPLETED_COSTLY_TOSTATION', flag)
		},
		setCompletedCostlyArrivedStation (state, flag) {
			state.commit('SET_COMPLETED_COSTLY_ARRIVEDSTATION', flag)
		},
		setCompletedCostlyWareHouse (state, flag) {
			state.commit('SET_COMPLETED_COSTLY_WAREHOUSE', flag)
		},
		setCompletedLeaveArrivedAircraft (state, flag) {
			state.commit('SET_COMPLETED_LEAVE_ARRIVED_AIRCRAFT', flag)
		},
		setNewVersionMsg (state, msg) {
			state.commit('SET_NEW_VERSION_MSG', msg)
		},
		setOriCloseOffList (state, list) {
			state.commit('SET_ORI_CLOSE_OFF_LIST', list)
		}
	},
	mutations: {
    SET_DEP_STATUS_LIST (state, list) {
      state.depStatusList = list
    },
		SET_OPERATION_HISTORY_LIST (state, list) {
			state.operationHistoryList = [...list]
		},
		SET_BACK_FLAG (state, status) {
			state.backFlag = status
		},
		SET_USER_INFO (state, userInfo) {
			state.cargoUserInfo = userInfo
		},
		SET_ROLES_INFO (state, rolesInfo) {
			state.cargoRolesInfo = rolesInfo
		},
		SET_CARGO_USER_FORM (state, userForm) {
			state.cargoUserForm = userForm
		},
		SET_COMPLETED_LEAVE_TO_WAITING_AREA (state, flag) {
			state.completedLeaveToWaitingArea = flag
		},
		SET_COMPLETED_LEAVE_TO_AIRCRAFT (state, flag) {
			state.completedLeaveToAircraft = flag
		},
		SET_COMPLETED_ENTER_TO_WAITING_AREA (state, flag) {
			state.completedEnterToWaitingArea = flag
		},
		SET_COMPLETED_ENTER_TO_STATION (state, flag) {
			state.completedEnterToStation = flag
		},
		SET_COMPLETED_LEAVE_ARRIVED_WAITING_AREA (state, flag) {
			state.completedLeaveArrivedWaitingArea = flag
		},
		SET_COMPLETED_ENTER_ARRIVED_WAITING_AREA (state, flag) {
			state.completedEnterArrivedWaitingArea = flag
		},
		SET_COMPLETED_ENTER_ARRIVED_STATION (state, flag) {
			state.completedEnterArrivedStation = flag
		},
		SET_COMPLETED_OUT_STOCK (state, flag) {
			state.completedOutStock = flag
		},
		SET_ARRIVED_LEAVE_WAITING_AREA (state, flag) {
			state.arrivedLeaveWaitingArea = flag
		},
		SET_ARRIVED_LEAVE_AIRCRAFT (state, flag) {
			state.arrivedLeaveAircraft = flag
		},
		SET_ARRIVED_ENTER_WAITING_AREA (state, flag) {
			state.arrivedEnterWaitingArea = flag
		},
		SET_ARRIVED_ENTER_STATION (state, flag) {
			state.arrivedEnterStation = flag
		},
		SET_COMPLETED_UNLOADING (state, flag) {
			state.completedUnloading = flag
		},
		SET_COMPLETED_WARE_HOUSED (state, flag) {
			state.completedWareHoused = flag
		},
		SET_SCAN_BACK (state, flag) {
			state.scanBack = flag
		},
		SET_CODE (state, code) {
			state.code = code
		},
		
		SET_COMPLETED_PULLDOWN_CONFIRM (state, flag) {
			state.completedPulldownConfirm = flag
		},
		SET_COMPLETED_PULLDOWN_TOWAITINGAREA (state, flag) {
			state.completedPulldownToWaitingArea = flag
		},
		SET_COMPLETED_PULLDOWN_WAITINGAREA (state, flag) {
			state.completedPulldownWaitingArea = flag
		},
		SET_COMPLETED_PULLDOWN_TOSTATION (state, flag) {
			state.completedPulldownToStation = flag
		},
		SET_ARRIVED_PULLDOWN_STATION (state, flag) {
			state.arrivedPulldownStation = flag
		},
		SET_COMPLETED_PULLDOWN_ARRIVEDSTATION (state, flag) {
			state.completedPulldownArrivedStation = flag
		},
		SET_COMPLETED_PULLDOWN_WAREHOUSE (state, flag) {
			state.completedPulldownWareHouse = flag
		},
		
		SET_COMPLETED_COSTLY_UNLOADING (state, flag) {
			state.completedCostlyUnloading = flag
		},
		SET_COMPLETED_COSTLY_TOSTATION (state, flag) {
			state.completedCostlyToStation = flag
		},
		SET_COMPLETED_COSTLY_ARRIVEDSTATION (state, flag) {
			state.completedCostlyArrivedStation = flag
		},
		SET_COMPLETED_COSTLY_WAREHOUSE (state, flag) {
			state.completedCostlyWareHouse = flag
		},
		SET_COMPLETED_LEAVE_ARRIVED_AIRCRAFT (state, flag) {
			state.completedLeaveArrivedAircraft = flag
		},
		SET_NEW_VERSION_MSG (state, msg) {
			state.newVersionMsg = msg
		},
		SET_ORI_CLOSE_OFF_LIST (state, list) {
			state.oriCloseOffList = list
		}
	}
}
export default cargo

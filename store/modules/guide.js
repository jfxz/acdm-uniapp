const guide = {
	state: {
		// 特车调度接收的当前消息
		dispatcherMsg: '',
    // 司机收到的当前消息
    driverMsg: ''
	},
	actions: {
		setDispatcherMsg (state, msg) {
			state.commit('SET_DISPATCHER_MSG', msg)
		},
    
    setDriverMsg (state, msg) {
      state.commit('SET_DRIVER_MSG', msg)
    }
	},
	mutations: {
		SET_DISPATCHER_MSG (state, msg) {
			state.dispatcherMsg = msg
		},
    
    SET_DRIVER_MSG (state, msg) {
      state.driverMsg = msg
    }
	}
}

export default guide
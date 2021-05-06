const emptyContainer = {
	state: {
		// 板箱组录入空集装箱事件
		crateGroupInput: null,
		// 货站确认信息事件
		cargoStationConfirm: null,
		// 货站录入空集装箱事件
		cargoStationInput: null,
		// 板箱组确认信息事件
		crateGroupConfirm: null,
		// 货站录入集装板事件
		cargoStationInputPallet: null,
		// 板箱组确认集装板信息事件
		crateGroupConfirmPallet: null
	},
	actions: {
		setCrateGroupInput (state, msg) {
			state.commit('SET_CRATE_GROUP_INPUT', msg)
		},
		setCargoStationConfirm (state, msg) {
			state.commit('SET_CARGO_STATION_CONFIRM', msg)
		},
		setCargoStationInput (state, msg) {
			state.commit('SET_CARGO_STATION_INPUT', msg)
		},
		setCrateGroupConfirm (state, msg) {
			state.commit('SET_CRATE_GROUP_CONFIRM', msg)
		},
		setCargoStationInputPallet (state, msg) {
			state.commit('SET_CARGO_STATION_INPUT_PALLET', msg)
		},
		setCrateGroupConfirmPallet (state, msg) {
			state.commit('SET_CRATE_GROUP_CONFIRM_PALLET', msg)
		}
	},
	mutations: {
		SET_CRATE_GROUP_INPUT (state, msg) {
			state.crateGroupInput = msg
		},
		SET_CARGO_STATION_CONFIRM (state, msg) {
			state.cargoStationConfirm = msg
		},
		SET_CARGO_STATION_INPUT (state, msg) {
			state.cargoStationInput = msg
		},
		SET_CRATE_GROUP_CONFIRM (state, msg) {
			state.crateGroupConfirm = msg
		},
		SET_CARGO_STATION_INPUT_PALLET (state, msg) {
			state.cargoStationInputPallet = msg
		},
		SET_CRATE_GROUP_CONFIRM_PALLET (state, msg) {
			state.crateGroupConfirmPallet = msg
		}
	}
}

export default emptyContainer
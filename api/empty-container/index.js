import https from '../../config/api-interface.js'
const serviceName = 'cargo'

export const createAirlineBox = (data) => {
	return https({
	  url: `/${serviceName}/container/crateGroupInput`,
		method: 'POST',
		data: data
	})
}

export const getAirlineList = (data) => {
	return https({
	  url: `/${serviceName}/container/getCarrierContainerHandover`,
		method: 'GET',
		data: data
	})
}

export const airlineConfirm = (data) => {
	return https({
	  url: `/${serviceName}/container/cargoStationConfirm`,
		method: 'GET',
		data: data
	})
}



export const getWarehouseList = (data) => {
	return https({
	  url: `/${serviceName}/container/getCargoStationContainerHandover`,
		method: 'GET',
		data: data
	})
}

export const getPalletList = (data) => {
	return https({
	  url: `/${serviceName}/container/getPalletHandover`,
		method: 'GET',
		data: data
	})
}


export const createWarehouseBox = (data) => {
	return https({
	  url: `/${serviceName}/container/cargoStationInput`,
		method: 'POST',
		data: data
	})
}

export const createPalletBox = (data) => {
	return https({
	  url: `/${serviceName}/container/cargoStationInputPallet`,
		method: 'POST',
		data: data
	})
}

export const palletConfirm = (data) => {
	return https({
	  url: `/${serviceName}/container/crateGroupConfirmPalletInfo`,
		method: 'GET',
		data: data
	})
}

export const getRole = () => {
	let roles = uni.getStorageSync('roles_info')
	if (roles) {
		let reg = /空集装器/g
		for (let i = 0; i < roles.length; i++) {
			let e = roles[i]
			if (reg.test(e.name)) {
				return e.name
			}
		}
	}
	return ''
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
			title: err.data.message,
			icon: 'none',
			duration: 2000
		})
		uni.hideLoading()
	}
}

export const warehouseConfirm = (data) => {
	return https({
	  url: `/${serviceName}/container/crateGroupConfirm`,
		method: 'GET',
		data: data
	})
}
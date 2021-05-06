import {performOperation,
				onError,
				innerSendMsgToDriver} from '@/api/guide/index.js'
import { debounce } from '@/common/util/util.js'
export const innerFlightBtns = [{
	index: 0,
	label: '派车',
	func: debounce(function (param) {
		if (param.serviceGuide) {
			uni.setStorageSync('flightTaskId', param.flightTaskId)
			uni.setStorageSync('inner_form', param.serviceGuide)
			uni.navigateTo({
				url: `/pages/guide/inner-form?direction=${param.direction}`
			})
		}
	}, 100)
}, {
	index: 1,
	label: '登机口核对',
	func: debounce(function (param) {
		let serviceGuide = param.serviceGuide
		if (serviceGuide) {
			performOperation({
				serviceGuide: serviceGuide,
				flightTaskId: param.flightTaskId,
				operationType: 'GATE_INFIELD_CHECK'
			}).then(res => {
				if (res.status) {
					uni.setStorageSync('lastest_serviceGuide', res.data)
					
				}
				uni.showToast({
					title: res.message,
					icon: 'none',
					duration: 1000
				})
			}).catch(err => {
				onError(err)
			})
		}
	}, 100)
}, {
	index: 2,
	label: '核对遗漏',
	func: debounce(function (param) {
		let guideId = param.guideId
		let operationType = 'OMIT_INFIELD_CHECK'
		if (guideId) {
			uni.navigateTo({
				url: `/pages/guide/check-omission?guideId=${guideId}&operationType=${operationType}&direction=D`
			})
		}
	}, 100)
}, {
	index: 3,
	label: '客齐',
	func: debounce(function (param) {
		let serviceGuide = param.serviceGuide
		if (serviceGuide) {
			performOperation({
				serviceGuide: serviceGuide,
				flightTaskId: param.flightTaskId,
				operationType: 'PASSENGERS_COMPLETE'
			}).then(res => {
				console.log('客齐', res)
				if (res.status) {
					uni.setStorageSync('lastest_serviceGuide', res.data)
				}
				uni.showToast({
					title: res.message,
					icon: 'none',
					duration: 2000
				})
			}).catch(err => {
				onError(err)
			})
		}
	}, 100)
}]

export const innerFlightBtnsA = [{
	index: 0,
	label: '派车',
	func: debounce(function (param) {
		if (param.serviceGuide) {
			uni.setStorageSync('flightTaskId', param.flightTaskId)
			uni.setStorageSync('inner_form', param.serviceGuide)
			uni.navigateTo({
				url: `/pages/guide/inner-form?direction=${param.direction}`
			})
		}
	}, 100)
}]

export const innerCarBtns = [{
	index: 0,
	label: '叫车',
	func: debounce(function (param, car) {
		if (param.serviceGuide && param.serviceCar) {
			console.log('param', param)
			let serviceCar = car
			innerSendMsgToDriver({
				serviceGuide: param.serviceGuide,
				serviceCar: car,
				operationType: 'INFIELD_DISPATCH'
			}).then(res => {
				if (res.status) {
					
				}
			}).catch(err => {
				onError(err)
			})
		}
	}, 100)
}]


export const outterFlightBtnsA = [{
	index: 1,
	label: '外场核对',
	func: debounce(function (param) {
		let guideId = param.guideId
		let operationType = 'OMIT_OUTFIELD_CHECK'
		if (guideId) {
			uni.navigateTo({
				url: `/pages/guide/check-omission?guideId=${guideId}&operationType=${operationType}&direction=A`
			})
		}
	}, 100)}]
	
	export const outterFlightBtns = [{
		index: 0,
		label: '登机口核对',
		func: debounce(function (param) {
			let serviceGuide = param.serviceGuide
			if (serviceGuide) {
				performOperation({
					serviceGuide: serviceGuide,
					flightTaskId: param.flightTaskId,
					operationType: 'GATE_OUTFIELD_CHECK'
				}).then(res => {
					if (res.status) {
						uni.setStorageSync('lastest_serviceGuide', res.data)
					}
					uni.showToast({
						title: res.message,
						icon: 'none',
						duration: 1000
					})
				}).catch(err => {
					onError(err)
				})
			}
		}, 100)
	}, {
		index: 0,
		label: '外场核对',
		func: debounce(function (param) {
			let guideId = param.serviceGuide.id
			let operationType = 'STAND_OUTFIELD_CHECK'
			if (guideId) {
				uni.navigateTo({
					url: `/pages/guide/check-omission?guideId=${guideId}&operationType=${operationType}&direction=D`
				})
			}
		}, 100)
	}, {
		index: 1,
		label: '核对遗漏',
		func: debounce(function (param) {
			let guideId = param.guideId
			if (guideId) {
				uni.navigateTo({
					url: `/pages/guide/outfield-check?guideId=${guideId}&direction=D`
				})
			}
		}, 100)}]
	
	export const outterCarBtns = [{
	index: 0,
	label: '开车门',
	func: debounce(function (param, serviceCar) {
		if (param.serviceGuide) {
			console.log('param', param)
			innerSendMsgToDriver({
				serviceGuide: param.serviceGuide,
				serviceCar: serviceCar,
				operationType: 'OPEN_DOOR_FOR_DRIVER'
			}).then(res => {
				if (res.status) {
					
				}
			}).catch(err => {
				onError(err)
			})
		}
	}, 100)
}]
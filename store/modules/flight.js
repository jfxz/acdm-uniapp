import {
	deepCopy,
	uuid,
	sortCompare
} from '@/common/util/util.js'
import * as flightApi from "../../api/flight/index.js"
import {
	getFlightStatus
} from '../../api/dic/index.js'
import store from '@/store'
import dayjs from '@/common/util/dayjs.min.js'

const flight = {
	state: {
		arrFlight: [],
		depFlight: [],
		willArr: [],
		willDep: [],
		gmsFlight: [],
		allFlight: [],
		followFlight: [],
		flightByDate: [],
		mqMessage: {
			isArr: false,
			isDep: false,
			isArrResersh: false,
			isDepResersh: false,
			uuid: '1'
		},
		flightActivityDiff: 10,
		flightStatus: [],
		isFlightRefresh: false
	},
	mutations: {
		SET_ARRFLIGHT(state, data) {
			state.arrFlight = data
		},
		SET_DEPFLIGHT(state, data) {
			state.depFlight = data
		},
		SET_WILLARR(state, data) {
			state.willArr = data
		},
		SET_WILLDEP(state, data) {
			state.willDep = data
		},
		SET_GMSFLIGHT(state, data) {
			state.gmsFlight = data
		},
		SET_ALLFLIGHT(state, data) {
			state.allFlight = data
		},
		SET_FOLLOW_FLIGHT(state, data) {
			state.followFlight = data
		},
		SET_ACTIVITY_DIFF(state, data) {
			state.flightActivityDiff = data
		},
		SET_FLIGHTSTATUS(state, data) {
			state.flightStatus = data
		},
		SET_MQMESSAGE(state, data) {
			state.mqMessage = data
		},
		SET_FLIGHTBYDATE(state, data) {
			state.flightByDate = data
		},
		SET_ISFLIGHTREFRESH(state, data) {
			state.isFlightRefresh = data
		}
	},
	actions: {
		// 进港
		setArrFlight({
			state,
			commit
		}) {
			return new Promise((resolve, reject) => {
				flightApi.getFlightList({
					airportCode: uni.getStorageSync('userAirport')[0].icaocode,
					direction: 'A'
				}).then(res => {
					if (res.status) {
						commit('SET_ARRFLIGHT', res.data)
						commit('SET_ALLFLIGHT', state.arrFlight.concat(state.depFlight))
						resolve(res.data)
					} else {
						reject(res.status)
					}
				}).catch(e => {
					reject(e)
				})
			})
		},
		// 出港
		setDepFlight({
			state,
			commit
		}) {
			return new Promise((resolve, reject) => {
				flightApi.getFlightList({
					airportCode: uni.getStorageSync('userAirport')[0].icaocode,
					direction: 'D'
				}).then(res => {
					if (res.status) {
						commit('SET_DEPFLIGHT', res.data)
						commit('SET_ALLFLIGHT', state.arrFlight.concat(state.depFlight))
						resolve(res.data)
					} else {
						reject(res.status)
					}
				}).catch(e => {
					reject(e)
				})
			})
		},
		// 即将进港
		setWillArr({
			state,
			commit
		}) {
			return new Promise((resolve, reject) => {
				flightApi.getWillArrFlightList({
					airportCode: uni.getStorageSync('userAirport')[0].icaocode,
				}).then(res => {
					if (res.status) {
						commit('SET_WILLARR', res.data)
						resolve(res.data)
					} else {
						reject(res.status)
					}
				}).catch(e => {
					reject(e)
				})
			})
		},
		// 即将进港映射到所有航班
		mapWillArr({
			state,
			commit
		}) {
			let array = deepCopy(state.arrFlight)
			array.forEach((item, index) => {
				let data = []
				data = state.willArr.filter(key => key.flightId === item.flightId)
				if (data.length > 0) {
					array.splice(index, 1, data[0]);
				}
				commit('SET_ALLFLIGHT', array.concat(state.depFlight))
			})
		},
		// 即将出港
		setWillDep({
			state,
			commit
		}) {
			return new Promise((resolve, reject) => {
				flightApi.getWillDepFlightList({
					airportCode: uni.getStorageSync('userAirport')[0].icaocode,
				}).then(res => {
					if (res.status) {
						commit('SET_WILLDEP', res.data)
						resolve(res.data)
					} else {
						reject(res.status)
					}
				}).catch(e => {
					reject(e)
				})
			})
		},
		// 即将出港映射到所有航班
		mapWillDep({
			state,
			commit
		}) {
			let array = deepCopy(state.depFlight)
			array.forEach((item, index) => {
				let data = []
				data = state.willDep.filter(key => key.flightId === item.flightId)
				if (data.length > 0) {
					array.splice(index, 1, data[0]);
				}
				commit('SET_ALLFLIGHT', state.arrFlight.concat(array))
			})
		},
		// 正在保障
		setGmsFlight({
			state,
			commit
		}) {
			return new Promise((resolve, reject) => {
				flightApi.getGmsFlightList({
					airportCode: uni.getStorageSync('userAirport')[0].icaocode,
				}).then(res => {
					if (res.status) {
						commit('SET_GMSFLIGHT', res.data)
						resolve(res.data)
					} else {
						reject(res.status)
					}
				}).catch(e => {
					console.log('捕获异常', e)
					reject(e)
				})
			})
		},
		//  正在保障映射到所有航班
		mapWillGms({
			state,
			commit
		}) {
			let array = deepCopy(state.allFlight)
			array.forEach((item, index) => {
				let data = []
				data = state.gmsFlight.filter(key => key.flightId === item.flightId)
				if (data.length > 0) {
					array.splice(index, 1, data[0]);
				}
				commit('SET_ALLFLIGHT', array)
			})
		},
		// 全部
		setAllFlight({
			state,
			commit,
			dispatch
		}) {
			let arr = [new Promise((resolve, reject) => {
					dispatch('setArrFlight').then(res => {
						resolve(res)
					}).catch(e => {
						reject(e)
					})
				}),
				new Promise((resolve, reject) => {
					dispatch('setDepFlight').then(res => {
						resolve(res)
					}).catch(e => {
						reject(e)
					})
				})
			]
			return new Promise((resolve, reject) => {
				Promise.all(arr).then(res => {
					let arr = deepCopy(res[0])
					let dep = deepCopy(res[1])
					let all = []
					all = arr.concat(dep)
					commit('SET_ALLFLIGHT', all)
					resolve(res)
				}).catch(e => {
					reject(e)
				})
			})
		},
		// 刷新即将进港/出港,正在保障
		setOtherFlight({
			state,
			commit,
			dispatch
		}) {
			let arr = [new Promise((resolve, reject) => {
					dispatch('setWillArr').then(res => {
						resolve(res)
					}).catch(e => {
						reject(e)
					})
				}),
				new Promise((resolve, reject) => {
					dispatch('setWillDep').then(res => {
						resolve(res)
					}).catch(e => {
						reject(e)
					})
				}),
				new Promise((resolve, reject) => {
					dispatch('setGmsFlight').then(res => {
						resolve(res)
					}).catch(e => {
						reject(e)
					})
				})
			]
			return new Promise((resolve, reject) => {
				Promise.all(arr).then(res => {
					resolve(res)
				}).catch(e => {
					reject(e)
				})
			})
		},
		// 更新所有类型航班
		setAllTypeFlight({
			state,
			commit,
			dispatch
		}) {
			let arr = [new Promise((resolve, reject) => {
					dispatch('setArrFlight').then(res => {
						resolve(res)
					}).catch(e => {
						reject(e)
					})
				}),
				new Promise((resolve, reject) => {
					dispatch('setDepFlight').then(res => {
						resolve(res)
					}).catch(e => {
						reject(e)
					})
				}),
				new Promise((resolve, reject) => {
					dispatch('setWillArr').then(res => {
						resolve(res)
					}).catch(e => {
						reject(e)
					})
				}),
				new Promise((resolve, reject) => {
					dispatch('setWillDep').then(res => {
						resolve(res)
					}).catch(e => {
						reject(e)
					})
				}),
				new Promise((resolve, reject) => {
					dispatch('setGmsFlight').then(res => {
						resolve(res)
					}).catch(e => {
						reject(e)
					})
				})
			]
			return new Promise((resolve, reject) => {
				Promise.all(arr).then(res => {
					resolve(res)
				}).catch(e => {
					setTimeout(() => {
						reject(e)
					}, 2000)
				})
			})
		},
		// 取所有航班
		getAllflight({
			state
		}) {
			return new Promise(resolve => {
				resolve(state.allFlight)
			})
		},
		// 取进港
		getArrflight({
			state
		}) {
			return new Promise(resolve => {
				resolve(state.arrFlight)
			})
		},
		// 取出港
		getDepflight({
			state
		}) {
			return new Promise(resolve => {
				resolve(state.depFlight)
			})
		},
		// 取allflight
		getWillArrflight({
			state
		}) {
			return new Promise(resolve => {
				resolve(state.willArr)
			})
		},
		// 取allflight
		getWillDepflight({
			state
		}) {
			return new Promise(resolve => {
				resolve(state.willDep)
			})
		},
		getFlightByDate({
			state
		}) {
			return new Promise(resolve => {
				resolve(state.flightByDate)
			})
		},
		// 获取关注航班列表
		setFollowList({
			state,
			commit,
			dispatch
		}) {
			return new Promise((resolve, reject) => {
				let nowDate = dayjs(new Date()).format('YYYY-MM-DD')
				flightApi.getFollowFlightList({
					userId: store.state.user.user.userId,
					airportCode: uni.getStorageSync('userAirport')[0].icaocode
				}).then(res => {
					if (res.status) {
						let arr = []
						res.data.content.forEach(item => {
							arr.push(Object.assign({}, item.flightList, {
								followId: item.id
							}))
						})
						commit('SET_FOLLOW_FLIGHT', arr)
						resolve(arr)
					} else {
						reject(res)
					}
				}).catch(err => {
					reject(err)
				})
			})

		},
		//获取关注航班
		getFollowList({
			state
		}) {
			return new Promise(resolve => {
				resolve(state.followFlight)
			})
		},
		//根据flightId获取航班
		setFlightByflightId({
			state,
			commit,
			dispatch
		}, flightId) {
			return new Promise((resolve, reject) => {
				flightApi.getFlightByflightId({
					airportCode: uni.getStorageSync('userAirport')[0].icaocode || '',
					flightIdStr: flightId
				}).then(res => {
					if (res.status && res.data.length > 0) {
						let singleFlight = res.data[0]
						let index = -1
						let arrFlightList = deepCopy(state.arrFlight)
						let depFlightList = deepCopy(state.depFlight)
						if (singleFlight.direction === 'A') {
							index = arrFlightList.findIndex((item) => item.flightId === singleFlight.flightId)
							if (index > -1) {
								arrFlightList[index] = singleFlight
							}
						}
						if (singleFlight.direction === 'D') {
							index = depFlightList.findIndex((item) => item.flightId === singleFlight.flightId)
							if (index > -1) {
								depFlightList[index] = singleFlight
							}
						}
						commit('SET_ARRFLIGHT', arrFlightList)
						commit('SET_DEPFLIGHT', depFlightList)
						commit('SET_ALLFLIGHT', arrFlightList.concat(depFlightList))
						resolve(singleFlight)
					} else {
						reject(res.status)
					}
				}).catch(err => {
					reject(err)
				})
			})
		},
		//获取进港航班id集合
		getArrflightIds({
			state,
			commit,
			dispatch
		}) {
			return new Promise((resolve, reject) => {
				flightApi.getFlightIdsList({
					airportCode: uni.getStorageSync('userAirport')[0].icaocode || '',
					direction: 'A'
				}).then(res => {
					if (res.status && res.data.length > 0) {
						resolve(res.data)
					} else {
						reject(res.status)
					}
				}).catch(err => {
					reject(err)
				})
			})
		},
		//获取出港航班id集合
		getDepflightIds({
			state,
			commit,
			dispatch
		}) {
			return new Promise((resolve, reject) => {
				flightApi.getFlightIdsList({
					airportCode: uni.getStorageSync('userAirport')[0].icaocode || '',
					direction: 'D'
				}).then(res => {
					if (res.status && res.data.length > 0) {
						resolve(res.data)
					} else {
						reject(res.status)
					}
				}).catch(err => {
					reject(err)
				})
			})
		},
		getActivityDiff({
			commit
		}) {
			let paramValue = 10
			flightApi.getActivityDiff().then(res => {
				if (res.status) {
					paramValue = Number(res.data.paramValue)
				}
			})
			commit('SET_ACTIVITY_DIFF', paramValue)
		},
		setGmsTimeoutTimer({
			state
		}) {
			var timer = null
			timer = setInterval(() => {
				var pages = getCurrentPages();
				var page = pages[pages.length - 1]
				if (page.route === 'pages/login/index' || page.route === 'pages/home/index') {
					clearInterval(timer)
				} else {
					flightApi.getFollowGmsTimeout(uni.getStorageSync('userAirport')[0].icaocode).then(res => {
						if (res.status && res.data.length > 0) {
							let item = res.data[0]
							let text = `${item.IataCarrier}${item.flight}的${item.flightActivity[0].description}节点超时未提交`
							uni.showToast({
								title: text,
								icon: 'none',
								duration: 3000
							})
						}
					})
				}
			}, 1000 * 60 * 2)
		},
		//接收mq新增
		setInsertMqFlightMessage({
			state,
			commit,
			dispatch
		}, updateList) {
			let isArrResersh = state.mqMessage.isArrResersh
			let isDepResersh = state.mqMessage.isDepResersh
			updateList.forEach(item => {
				if (item.direction === 'A') {
					isArrResersh = true
				}
				if (item.direction === 'D') {
					isDepResersh = true
				}
			})
			commit('SET_MQMESSAGE', {
				isArr: state.mqMessage.isArr,
				isDep: state.mqMessage.isDep,
				isArrResersh: isArrResersh,
				isDepResersh: isDepResersh,
				uuid: uuid(16)
			})
		},
		//接收mq删除
		setDeleteMqFlightMessage({
			state,
			commit,
			dispatch
		}) {
			commit('SET_MQMESSAGE', {
				isArr: state.mqMessage.isArr,
				isDep: state.mqMessage.isDep,
				isArrResersh: true,
				isDepResersh: true,
				uuid: uuid(16)
			})
		},
		//接收mq航班变更数据
		setUpdateMqFlightMessage({
			state,
			commit,
			dispatch
		}, {
			updateList,
			direction
		}) {
			//收到进港航班数据
			let arrFlightList = deepCopy(state.arrFlight)
			let depFlightList = deepCopy(state.depFlight)
			let isArrFlag = false
			let isDepFlag = false
			//遍历数据替换
			updateList.forEach(item => {
				let index = -1
				if (item.direction === 'A') {
					index = arrFlightList.findIndex((itemArr) => itemArr.flightId === item.flightId)
					//原数据找到mq推送数据替换
					if (index > -1) {
						arrFlightList[index] = item
						isArrFlag = true //标志存在进港数据变更
					}
				}
				if (item.direction === 'D') {
					index = depFlightList.findIndex((itemDep) => itemDep.flightId === item.flightId)
					//原数据找到mq推送数据替换
					if (index > -1) {
						depFlightList[index] = item
						isDepFlag = true //标志存在出港数据变更
					}
				}
			})
			console.log('排序类型direction', direction)
			//判断是否要重新排序
			if (direction === 'A') {
				console.log('进行进港排序')
				dispatch('setArrflightIds', arrFlightList)
			} else if (direction === 'D') {
				console.log('进行出港排序')
				dispatch('setDepflightIds', depFlightList)
			} else if (direction === 'ALL') {
				console.log('进行进///出港排序')
				dispatch('setArrflightIds', arrFlightList)
				dispatch('setDepflightIds', depFlightList)
			} else {
				commit('SET_ARRFLIGHT', arrFlightList)
				commit('SET_DEPFLIGHT', depFlightList)
				commit('SET_ALLFLIGHT', arrFlightList.concat(depFlightList))
				commit('SET_MQMESSAGE', {
					isArr: isArrFlag,
					isDep: isDepFlag,
					isArrResersh: state.mqMessage.isArrResersh,
					isDepResersh: state.mqMessage.isDepResersh,
					uuid: uuid(16)
				})
			}
		},
		//进港航班数据排序
		setArrflightIds({
			state,
			commit,
			dispatch
		}, arrFlightList) {
			dispatch('getArrflightIds').then(res => {
				//成功进行排序，再更换进港数据源
				let flightIds = res
				let arrFlight = arrFlightList
				arrFlight.forEach(item => {
					let sortIndex = flightIds.indexOf(item.id)
					item['sortIndex'] = sortIndex
				})
				let sortArr = arrFlight.sort(sortCompare('sortIndex'))
				commit('SET_ARRFLIGHT', sortArr)
				commit('SET_ALLFLIGHT', sortArr.concat(state.depFlight))
				commit('SET_MQMESSAGE', {
					isArr: true,
					isDep: state.mqMessage.isDep,
					isArrResersh: state.mqMessage.isArrResersh,
					isDepResersh: state.mqMessage.isDepResersh,
					uuid: uuid(16)
				})
				console.log('完成完成进港排序')
			}).catch(err => {
				//失败直接更换进港数据源
				commit('SET_ARRFLIGHT', arrFlightList)
				commit('SET_ALLFLIGHT', arrFlightList.concat(state.depFlight))
				commit('SET_MQMESSAGE', {
					isArr: true,
					isDep: state.mqMessage.isDep,
					isArrResersh: state.mqMessage.isArrResersh,
					isDepResersh: state.mqMessage.isDepResersh,
					uuid: uuid(16)
				})
			})
		},
		//获取出港id顺序列表
		setDepflightIds({
			state,
			commit,
			dispatch
		}, depFlightList) {
			dispatch('getDepflightIds').then(res => {
				//成功进行排序，再更换出港数据源
				let flightIds = res
				let depFlight = depFlightList
				depFlight.forEach(item => {
					let sortIndex = flightIds.indexOf(item.id)
					item['sortIndex'] = sortIndex
				})
				let sortDep = depFlight.sort(sortCompare('sortIndex'))
				commit('SET_DEPFLIGHT', sortDep)
				commit('SET_ALLFLIGHT', state.arrFlight.concat(sortDep))
				commit('SET_MQMESSAGE', {
					isArr: state.mqMessage.isArr,
					isDep: true,
					isArrResersh: state.mqMessage.isArrResersh,
					isDepResersh: state.mqMessage.isDepResersh,
					uuid: uuid(16)
				})
				console.log('完成完成出港排序')
			}).catch(err => {
				//失败直接更换出港数据源
				commit('SET_DEPFLIGHT', depFlightList)
				commit('SET_ALLFLIGHT', state.arrFlight.concat(depFlightList))
				commit('SET_MQMESSAGE', {
					isArr: state.mqMessage.isArr,
					isDep: true,
					isArrResersh: state.mqMessage.isArrResersh,
					isDepResersh: state.mqMessage.isDepResersh,
					uuid: uuid(16)
				})
			})
		}
	}
}

export default flight

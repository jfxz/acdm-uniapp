import Stomp from 'stompjs'
import store from '@/store'
import eventVue from './eventVue.js'
import {
	uuid,
	ip2String
} from './util'
import {
	MQserverUrl,
	MQserverUrlProduct,
	clientInfo,
	vHost
} from '../../config/mq-config.js'
import {
	WebSocket
} from '@/common/util/websocket-uni.js'
import {
	subscribeMQ,
	getChannelList,
	getFriendList,
	getSubscriptionList,
	exitLogin
} from '../../api/imApi/admin.js'
import {
	MESSAGEKEYARRAY
} from '@/common/message.js'
import {
	debounce
} from '@/common/util/util.js'

import {
	notify,
	getGuideQueue,
	checkImage,
	watchImage,
	performOperation
} from '@/api/guide/index.js'
import {
	cargoRemind
} from '@/api/cargo/index.js'
import {
	getRole
} from '@/api/empty-container/index.js'

class StompClient {
	constructor(rmqServer, rmpServerProduct, rmqVirtualHost, rmqAccount, rmqPassword) {
		this.subscribes = { //订阅信息
			fligtInterface: ''
		}
		this.client = null
		this.options = {
			vhost: rmqVirtualHost,
			incoming: 10000,
			outgoing: 10000,
			account: rmqAccount,
			pwd: rmqPassword,
			// server: `http://${rmqServer}/ws`
			server: `ws://${rmqServer}/ws`,
			puductServer: `ws://${rmpServerProduct}/ws`
		}
		this.queue = 'temp_queue'
		this.role = ''
		// 防抖函数 提示最新的货物提醒
		this.notifyLastestCargoRemind = debounce(function(msg) {
			notify(msg)
		}, 3000)

		// state.userInfo.username + '_' + ip
		return this
	}
	connect(options) {
		// console.log(store.state.user, 'store.state.user.user')
		console.log('连接中1')
		this.setQueueUUID()
		uni.setStorageSync('fligtInterfaceMq', '') //清空航班保障订阅
		let mqUrl = this.options.server
		if (uni.getStorageSync('ignoreSvn')) {
			mqUrl = this.options.puductServer
		}
		Object.assign(this.options, options)
		let ws = new WebSocket(mqUrl)
		ws.onclose = function(e) {
			console.log(
				'websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean
			)
		}
		ws.onerror = function(e) {
			console.log('websocket onerror: ')
		}
		this.client = Stomp.over(ws)
		// console.log('this.client', this.client)
		this.client.heartbeat.outgoing = this.options.outgoing
		this.client.heartbeat.incoming = this.options.incoming
		let onConnect = () => {
			uni.setStorageSync('mq-status', 'ok')
			console.log('stomp 连接成功！')
			this.subscribe()
			this.subscribeTasks() //暂停使用
			this.subscribeFollow()
			this.subscribeEmptyContainer()
			this.subscribeNewVersionRemind()
			this.subscribeCheck()
			this.subscribeGuide()

		}
		let onError = e => {
			console.log('异常', e)
			uni.setStorageSync('mq-status', false)
			let count = uni.getStorageSync('mqError') || 0
			count++
			uni.setStorageSync('mqError', count)
			if (count === 1) {
				this.client.disconnect(() => {
					console.log('stomp 正在重新连接...')
					this.connect(this.options)
					setTimeout(() => {
						uni.setStorageSync('mqError', 0)
					}, 3000)
				})
			}
		}
		this.client.connect(
			this.options.account,
			this.options.pwd,
			onConnect,
			onError,
			this.options.vhost
		)
	}

	subscribe() {
		subscribeMQ(store.state.user.user.userId).then(res => {
			if (res.status) {
				this.client.subscribe(
					`/queue/${store.state.user.userInfo.queue}`,
					(data) => {
						// console.log('data2222222', store.state.user.userInfo.queue, data)
						try {
							store.dispatch('setMessage', JSON.parse(data.body))
							// console.log('订阅的消息', JSON.parse(data.body), data)
						} catch (error) {
							// console.error('消息类型错误', error)
						}
					}, {
						durable: false,
						exclusive: false
					}
				)

				store.dispatch('setMessageList')
			}
		})
	}

	//取消订阅
	unsubscribe() {
		//存在航班保障mq订阅则取消
		if (this.subscribes.fligtInterface) {
			this.subscribes.fligtInterface.unsubscribe();
			this.subscribes.fligtInterface = ''
			uni.setStorageSync('fligtInterfaceMq', '')
		}
	}

	setQueueUUID() {
		if (store.state.user.user.userMessage) {
			let ip = ip2String(store.state.user.user.userMessage.meta.ip)
			if (ip && ip.includes(',')) {
				ip = ip.split(',')[0]
			}
			let queue = store.state.user.user.userMessage.name + '_' + ip
			this.queue = queue + '_' + uuid(16)
			// console.log(this.queue, 'this.queue')
		}
	}
	subscribeFollow() {
		// console.log('userId-Follow', store.state.user.user.userId)
		this.client.subscribe(
			`/exchange/ex.acdm.follow_flight/${store.state.user.user.userId}`,
			message => {
				console.log('message-follow', message)
				let messageObj = JSON.parse(message.body)
				let options = {
					cover: false,
					sound: 'system',
					title: 'ACDM'
				}
				let content = messageObj.message
				plus.push.createMessage(content, 'followFlight', options)
				uni.setStorageSync('local_key', 'refresh')
				eventVue.$emit('reflash', 'follow')
			}
		)
	}
	subscribeEmptyContainer() {
		this.role = getRole()
		if (this.role === '空集装器货站单证组') {
			this.client.subscribe(
				`/exchange/ex.cloud.event/ACDM.CARGO.ACTIVITY.CRATE.GROUP.INPUT`,
				message => {
					console.log('subscribeEmptyContainer', message)
					try {
						let obj = {}
						if (message.body) {
							obj = JSON.parse(message.body)
							if (obj) {
								obj = obj.data
								uni.showToast({
									title: `${obj.flight}需要${obj.quantity}个${obj.containerType}`,
									icon: 'none',
									duration: 2000
								})
							}
							console.log('subscribeEmptyContainer-message', typeof obj, obj)
						}
					} catch (err) {
						console.log('err', err)
					}
					setTimeout(function() {
						store.dispatch('setCrateGroupInput', message)
					}, 2500)
				}
			)
		} else if (this.role === '空集装器装卸板箱组') {
			this.client.subscribe(
				`/exchange/ex.cloud.event/ACDM.CARGO.ACTIVITY.CARGO.STATION.INPUT`,
				message => {
					console.log('subscribeEmptyContainer', message)
					try {
						let obj = {}
						if (message.body) {
							obj = JSON.parse(message.body)
							if (obj) {
								obj = obj.data
								uni.showToast({
									title: `${obj.flight}需要${obj.quantity}个${obj.containerType}`,
									icon: 'none',
									duration: 2000
								})
							}
							console.log('subscribeEmptyContainer-message', typeof obj, obj)
						}
					} catch (err) {
						console.log('err', err)
					}
					setTimeout(function() {
						store.dispatch('setCargoStationInput', message)
					}, 2500)
				}
			)
			this.client.subscribe(
				`/exchange/ex.cloud.event/ACDM.CARGO.ACTIVITY.CARGO.STATION.INPUT.PALLET`,
				message => {
					console.log('subscribeEmptyContainer', message)
					try {
						let obj = {}
						if (message.body) {
							obj = JSON.parse(message.body)
							if (obj) {
								obj = obj.data
								uni.showToast({
									title: `${obj.carrier}需要${obj.quantity}个${obj.palletType}`,
									icon: 'none',
									duration: 2000
								})
							}
							console.log('subscribeEmptyContainer-message', typeof obj, obj)
						}
					} catch (err) {
						console.log('err', err)
					}
					setTimeout(function() {
						store.dispatch('setCargoStationInputPallet', message)
					}, 2500)
				}
			)
		}

		this.client.subscribe(
			`/exchange/ex.cloud.event/ACDM.CARGO.ACTIVITY.CARGO.STATION.CONFIRM`,
			message => {
				try {
					console.log('subscribeEmptyContainer', message)
					let obj = {}
					if (message.body) {
						obj = JSON.parse(message.body)
						if (obj) {
							obj = obj.data
							uni.showToast({
								title: `${obj.flight}已准备好${obj.quantity}个${obj.containerType}`,
								icon: 'none',
								duration: 2000
							})
						}
						console.log('subscribeEmptyContainer-message', typeof obj, obj)
					}
				} catch (err) {
					console.log('err', err)
				}
				setTimeout(function() {
					store.dispatch('setCargoStationConfirm', message)
				}, 2500)
			}
		)

		this.client.subscribe(
			`/exchange/ex.cloud.event/ACDM.CARGO.ACTIVITY.CRATE.GROUP.CONFIRM`,
			message => {
				try {
					console.log('subscribeEmptyContainer', message)
					let obj = {}
					if (message.body) {
						obj = JSON.parse(message.body)
						if (obj) {
							obj = obj.data
							uni.showToast({
								title: `${obj.flight}已准备好${obj.quantity}个${obj.containerType}`,
								icon: 'none',
								duration: 2000
							})
						}
						console.log('subscribeEmptyContainer-message', typeof obj, obj)
					}
				} catch (err) {
					console.log('err', err)
				}
				setTimeout(function() {
					store.dispatch('setCrateGroupConfirm', message)
				}, 2500)
			}
		)

		this.client.subscribe(
			`/exchange/ex.cloud.event/ACDM.CARGO.ACTIVITY.CRATE.GROUP.CONFIRM.PALLET`,
			message => {
				try {
					console.log('subscribeEmptyContainer', message)
					let obj = {}
					if (message.body) {
						obj = JSON.parse(message.body)
						if (obj) {
							obj = obj.data
							uni.showToast({
								title: `${obj.carrier}已准备好${obj.quantity}个${obj.palletType}`,
								icon: 'none',
								duration: 2000
							})
						}
						console.log('subscribeEmptyContainer-message', typeof obj, obj)
					}
				} catch (err) {
					console.log('err', err)
				}
				setTimeout(function() {
					store.dispatch('setCrateGroupConfirmPallet', message)
				}, 2500)
			}
		)
	}

	subscribeFanout() {
		let routingKey = ''
		if (uni.getStorageSync('userAirport')[0].icaocode === 'ZSAM') {
			routingKey = 'REFRESHTOPIC.ZSAM'
		}
		if (uni.getStorageSync('userAirport')[0].icaocode === 'ZSFZ') {
			routingKey = 'REFRESHTOPIC.ZSFZ'
		}
		if (routingKey) {
			console.log('开始订阅机场信息', routingKey)
		} else {
			console.log('订阅机场信息失败', routingKey)
		}
		this.subscribes.fligtInterface = this.client.subscribe(`/exchange/ex.cloud.interface/${routingKey}`,
			(message) => {
				let flightMessage = ''
				flightMessage = JSON.parse(message.body).data
				console.log('刷新订阅机场信息')
				if (flightMessage.hasOwnProperty('update')) {
					if (flightMessage.hasOwnProperty('flushFlag') && flightMessage.flushFlag) {
						console.log('航班数据--->排序', flightMessage.direction)
						store.dispatch('setUpdateMqFlightMessage', {
							updateList: flightMessage.update,
							direction: flightMessage.direction
						})
					} else {
						console.log('航班数据--->变更', flightMessage.update)
						store.dispatch('setUpdateMqFlightMessage', {
							updateList: flightMessage.update,
							direction: 'noRefresh'
						})
					}
				}
				if (flightMessage.hasOwnProperty('insert')) {
					console.log('航班数据--->新增')
					store.dispatch('setInsertMqFlightMessage', flightMessage.insert)
				}
				if (flightMessage.hasOwnProperty('delete')) {
					console.log('航班数据--->删除')
					store.dispatch('setDeleteMqFlightMessage')
				}
			}, {
				'x-queue-name': this.queue + '_fanout'
			})
		uni.setStorageSync('fligtInterfaceMq', this.subscribes.fligtInterface)
	}
	//航班保障订阅条件判断
	subscribeCheck() {
		//判断已经进入航班保障界面
		let pages = getCurrentPages();
		pages.forEach(item => {
			if (item.route === 'pages/flight/index') {
				this.subscribeFanout()
			}
			if (item.route === 'pages/follow/index') {
				this.subscribeFanout()
			}
			if (item.route === 'pages/tasks/index') {
				this.subscribeFanout()
			}
			if (item.route === 'pages/message/index') {
				this.subscribeFanout()
			}
		})
	}
	subscribeTasks() {
		let key = uni.getStorageSync('user_name_sub') + '_' + uni.getStorageSync('user_id')
		// console.log(key, 'key')
		this.client.subscribe(`/exchange/ex.acdm.msg/${key}`,
			(message) => {
				console.log('subscribeTasks-pre')
				store.commit('USER_TASKS_MSG', uuid(16))
				store.dispatch('setSystemTabbar')
				console.log('任务mq变化', JSON.parse(message.body))
			})
	}

	subscribeNewVersionRemind() {
		console.log('aaaaaaaaaa-subscribeNewVersionRemind')
		this.client.subscribe(
			`/exchange/ex.cloud.event/ACDM.CARGO.ACTIVITY.REMIND.NEW.IFLI.RECORD`,
			message => {
				console.log('subscribeaNewVersionRemind-message', message)
				try {
					let obj = {}
					if (message.body) {
						obj = JSON.parse(message.body)
						store.dispatch('setNewVersionMsg', message.body)
						if (obj) {
							obj = obj.data
						}
						console.log('subscribeEmptyContainer-message', typeof obj, obj)
					}
				} catch (err) {
					console.log('err', err)
				}
				setTimeout(function() {
					store.dispatch('setCargoStationConfirm', message)
				}, 2500)
			}
		)
	}

	subscribeGuide() {
		let key = 'guide_' + uni.getStorageSync('user_name_sub') + '_' + uni.getStorageSync('user_id')
		// console.log('subscribeGuide-key', key)
		this.client.subscribe(`/exchange/ex.acdm.msg/${key}`,
			(message) => {
				console.log('subscribeGuide-pre', message)
				console.log('引导单消息变化', JSON.parse(message.body))
				uni.showModal({
					icon: 'none',
					title: '引导单消息',
					content: message.body
				})
			})
	}


	disconnect() {
		console.log('client', this.client)
		this.client.disconnect(() => {
			console.log('已关闭mq连接')
		})
	}
	closeConnect() {
		this.disconnect()
	}
}
export default new StompClient(
	MQserverUrl,
	MQserverUrlProduct,
	vHost,
	clientInfo.userName,
	clientInfo.password,
)

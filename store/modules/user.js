import {
	loginByUsername
} from '../../api/login/index.js'
import * as userApi from '../../api/user/index.js'
import {addLogBatch} from '../../api/log/index.js'
import {
	deepCopy
} from '@/common/util/util.js'
// import stomp from '@/common/util/stomp-client.js'
import {
	convertUserInfo,
	convertFriendInfo,
	convertColleague,
	convertSubsripInfo,
	convertChannelInfo,
	convertActiveFriend,
	convertActiveChannel,
	convertActiveSubsrip
} from '@/common/util/convertUtils.js'
import {
	findObjIndexInArray
} from '@/common/util/util.js'
// import {USER_TYPE} from '@/common/dic'
import {
	breathe,
	userInfo
} from '../../api/imApi/admin.js'
import {
	TABBAR
} from '@/common/constants/tabbar.js'
import {
	getTaskList
} from '@/api/task/index.js'
import store from '@/store'
import {
	gatewayRoute
} from "@/api/flight/index.js"
import stomp from '@/common/util/stomp-client.js'
const user = {
	state: {
		user: {},
		userInfo: {},
		friendInfo: {},
		friendTree: {},
		subscriptionInfo: {},
		channelInfo: {},
		activeList: [],
		selectFirend: [],
		unreadMSGtotal: 0,
		userTaskMsg: '',
		tabbar: [],
		gatewayRouteList: [],
		allUserRoles: [],
	},
	mutations: {
		SET_USER(state, data) {
			state.user = data
		},
		SET_USERINFO(state, userInfo) {
			state.userInfo = convertUserInfo(userInfo)
		},
		SET_FRIENDSINFO(state, friendsInfo) {
			state.friendInfo = convertFriendInfo(friendsInfo)
		},
		SET_FRIENDSTREE(state, friendsTree) {
			state.friendTree = convertColleague(friendsTree)
		},
		// 订阅号处理
		SET_SUBSCRIP(state, subscripInfo) {
			let arr = []
			subscripInfo.forEach(item => {
				arr.push(convertSubsripInfo(item))
			})
			state.subscriptionInfo = arr
		},
		// 群聊列表
		SET_CHANNELINFO(state, channelInfo) {
			let arr = []
			channelInfo.forEach(item => {
				arr.push(convertChannelInfo(item))
			})
			state.channelInfo = arr
		},
		CHANGE_ACTIVE_POSITION(state, id) {
			let index = findObjIndexInArray(id, state.activeList)
			if (state.activeList[index]) {
				let obj = state.activeList[index]
				state.activeList.splice(index, 1)
				state.activeList.unshift(obj)
			}
		},
		SET_ACTIVE_LIST(state, list) {
			const friendList = list.activeFriendList
			const channelList = list.activePublicChannelList
			const subscripList = list.activeSubscriptionInfo
			let activeList = friendList
				.map(item => {
					return convertActiveFriend(item)
				})
				.concat(
					channelList.map(item => {
						return convertActiveChannel(item)
					})
				)
				.concat(
					subscripList.map(item => {
						return convertActiveSubsrip(item)
					})
				)
				.sort((a, b) => {
					return a.createTime > b.createTime ? -1 : 1
				})
			state.activeList = activeList
		},
		REMOVE_ACTIVE_INDEX(state, index) {
			state.activeList.splice(index, 1)
		},
		SET_SELECT_FIREND(state, list) {
			state.selectFirend = deepCopy(list)
		},
		CLEAN_SELECT_FIREND(state, list) {
			state.selectFirend = []
		},
		CLEAN_VUEX_USER(state) {
			state.user = {}
			state.userInfo = {}
			state.friendInfo = {}
			state.friendTree = {}
			state.subscriptionInfo = {}
			state.channelInfo = {}
			state.activeList = []
			state.selectFirend = []
		},
		USER_TASKS_MSG(state, data) {
			state.userTaskMsg = data
		},
		SET_TABBAR(state, data) {
			state.tabbar = data
		},
		SET_ALLUSERROLES(state, data) {
			state.allUserRoles = data
		}
	},
	actions: {
		// 登录或注册
		async Login({
			commit,
			state,
			dispatch,
			rootState
		}, data) {
			// loginOrRegister
			// 记录下登录用的数据
			let returnData = ''
			let userData = {}
			console.log('开始单点登录')
			await loginByUsername(data).then((res) => {
				console.log('单点登录', res)
				returnData = res
				if (res.access_token) {
					console.log('开始请求字典', res)
					// 存储信息，作为请求头使用
					uni.removeStorageSync('access_token')
					uni.removeStorageSync('refresh_token')
					uni.setStorageSync('access_token', res.access_token)
					uni.setStorageSync('refresh_token', res.refresh_token)
					userData.userId = res.userId
					userData.userName = res.userName
					uni.removeStorageSync('user_id')
					uni.removeStorageSync('user_name')
					uni.removeStorageSync('user_name_sub')
					uni.setStorageSync('user_id', res.userId)
					uni.setStorageSync('user_name', res.userName)
					uni.setStorageSync('user_name_sub', res.sub)
					commit('SET_TABBAR', TABBAR)
					console.log('请求开始')
					// 获取角色信息,订阅机场
					let apiArr = [
						new Promise(resolve => {
							userApi.getUserRole().then(r => {
								if (r.status) {
									userData.roleOption = r.data
									resolve()
								}
							})
						}),
						new Promise(resolve => {
							userApi.getUserAirport().then(r => {
								userData.userAirport = r
								uni.setStorageSync('userAirport', userData.userAirport)
								resolve()
							})
						}),
						new Promise(resolve => {
							userApi.getUserMsg().then(r => {
								userData.userMessage = r.data
								resolve()
							})
						})
					]
					Promise.all(apiArr).then(res => {
						commit('SET_USER', userData)
						stomp.connect()
						dispatch('setSystemTabbar')
						dispatch('getAllUserRole')
            uni.request({
              url: 'http://www.net.cn/static/customercare/yourip.asp',
              success: res => {
                const reg = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/
                let ip = reg.exec(res.data) || []
                uni.setStorageSync('userIp', ip[0] || '')
              }
            })
            
            let requestArray = uni.getStorageSync('requestErrorRecord') || []
            if (requestArray.length > 0) {
              addLogBatch(requestArray).then(res => {
                console.log('日志上传成功', res)
                if (res.status) {
                  uni.setStorageSync('requestErrorRecord', [])
                  console.log('requestErrorRecord', uni.getStorageSync('requestErrorRecord'))
                }
              })
            }
            
            
						userInfo().then(item => {
							commit('SET_USERINFO', item.data)
							// breathe(state.userInfo.id, state.userInfo.loginId)
							// dispatch('setBreath', '1')
							console.log('用户信息',item.data)
						})
					})
				}

			}).catch((err) => {
				uni.hideLoading()
				if (err && err.data) {
					uni.showToast({
						title: err.data.error_description,
						icon: 'none'
					})
				}
				return
			})
			return returnData
		},
		// 获取用户信息
		GetUserInfo({
			commit,
			state,
			dispatch
		}, dic) {
			return new Promise((resolve) => {
				let result = deepCopy(state.user)
				// 克隆一份数据，否则vuex数据可能被修改
				resolve(result)
			})
		},
		setUser(state, userData) {
			return new Promise((resolve, reject) => {
				state.commit('SET_USER', userData)
				resolve()
			})
		},
		// 保存用户详细信息
		setUserInfo(state, userInfo) {
			return new Promise((resolve, reject) => {
				// console.log('开始设置用户信息')
				state.commit('SET_USERINFO', userInfo)
				resolve()
			})
		},
		// 设置好友列表
		setFriendsInfo(state, friendsInfo) {
			// console.log('开始设置好友列表')
			state.commit('SET_FRIENDSINFO', friendsInfo)
		},
		// // 设置好友列表树
		// setFriendsTree (state, friendsTree) {
		//   console.log('开始设置好友列表树')
		//   state.commit('SET_FRIENDSTREE', friendsTree)
		// },
		setSubscribeInfo(state, subscrip) {
			// console.log('开始设置订阅号')
			state.commit('SET_SUBSCRIP', subscrip)
		},
		setChannelInfo(state, channelInfo) {
			// console.log('开始设置群聊列表')
			state.commit('SET_CHANNELINFO', channelInfo)
		},
		setActiveList(state, list) {
			state.commit('SET_ACTIVE_LIST', list)
			state.dispatch('calUnreadMSG')
		},
		removeActiveListByIndex(state, index) {
			state.commit('REMOVE_ACTIVE_INDEX', index)
		},
		setActiveListByObj(state, obj) {
			state.commit('SET_ACTIVE_OBJ', obj)
		},
		changeActiveListPosition(state, id) {
			state.commit('CHANGE_ACTIVE_POSITION', id)
		},
		setSelectFirend(state, list) {
			state.commit('SET_SELECT_FIREND', list)
		},
		cleanSelectFirend(state) {
			state.commit('CLEAN_SELECT_FIREND')
		},
		cleanVuexUser(state) {
			state.commit('CLEAN_VUEX_USER')
		},
		// 获取所有用户角色数据
		getAllUserRole({
			state,
			commit,
			dispatch
		}) {
			new Promise(resolve => {
				userApi.getRoleAll().then(r => {
					commit('SET_ALLUSERROLES', r.data)
					dispatch('setUserRoleAgent')
				})
			})
		},
		// 设置用户角色航司代理数据
		setUserRoleAgent({
			state,
			commit
		}) {
			let agentArr = []
			let data = deepCopy(state.user)
			state.user.userMessage.meta.roles.forEach(res => {
				state.allUserRoles.some((item, index) => {
					if (item.id === res && item.agent) {
						agentArr.push(item.agent)
						return
					}
				})
			})
			data['roleAgent'] = agentArr
			commit('SET_USER', data)
		},
		// 计算未读消息
		calUnreadMSG({
			state,
			commit
		}) {
			state.unreadMSGtotal = 0
			state.activeList.forEach(item => {
				state.unreadMSGtotal += item.unReadMsg
			})
			let tabbarMsg = state.tabbar
			tabbarMsg.forEach(res => {
				if (res.pagePath === '/pages/message/index') {
					// console.log('消息', res.count)
					if (state.unreadMSGtotal !== 0) {
						res.count = state.unreadMSGtotal
						commit('SET_TABBAR', tabbarMsg)
					} else {
						res.count = 0
					}
				}
			})
		},
		// 获取缓存数据
		GetUser({
			state
		}, key) {
			return new Promise((resolve, reject) => {
				if (typeof key === 'string') {
					key = [key]
				}
				let result = {}
				key.forEach(item => {
					result[item] = state[item]
				})
				// 克隆一份数据，否则vuex数据可能被修改
				resolve(deepCopy(result))
			})
		},
		// 设置底部tabbar信息
		setSystemBaseTabbar(state, baseTabbar) {
			let data = baseTabbar
			state.commit('SET_TABBAR', baseTabbar)
		},
		//设置心跳
		setBreath({
			state,
			commit
		}, params) {
			console.log('params', params)
			let breathTimer = setInterval(() => {
				var pages = getCurrentPages();
				var page = pages[pages.length - 1]
				if (page.route === 'pages/login/index') {
					clearInterval(breathTimer)
				} else {
					breathe(state.userInfo.id, state.userInfo.loginId).then(res => {
						//心跳连接不上，重新请求
						if(!res.status){
							userInfo().then(item => {
								commit('SET_USERINFO', item.data)
							})
						}
						console.log('心跳返回：', res)
					})
				}
			}, 1000 * 8)
		},
		// 向tabbar添加任务数量
		setSystemTabbar(state, data) {
			let msg = store.state.user.tabbar
			console.log('msgmsg', msg)
			getTaskList({
				'airportCode': store.state.user.user.userAirport[0].icaocode
			}).then(res => {
				console.log('setSystemTabbar-2021', res)
				if (res.status) {
					msg.forEach(item => {
						if (item.pagePath === '/pages/tasks/index') {
							// item.count = res.data.length
							// 底部tabbar任务数量改为显示未结束的任务数量
							item.count = res.data.filter(e => e.status !== '6').length
						}
					})
					state.commit('SET_TABBAR', msg)
				}
			})
		}
	}
}
export default user

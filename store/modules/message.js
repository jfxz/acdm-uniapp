import {
	deepCopy
} from '@/common/util/util.js'
import store from '@/store'
import {
	ONLINE,
	SURE,
	POST,
	USER_TYPE,
	CARDBUTTON,
	SYSTEM_MSG_TYPE
} from "@/common/dic.js"
import {
	findObjInArray,
	findObjIndexInArray,
	isEmpty,
	isDisbanGroupMsg
} from '@/common/util/util.js'
import {
	convertChannelInfo,
	convertActiveChannel,
	convertActiveFriend,
	convertActiveSubsrip
} from '@/common/util/convertUtils.js'
import {
	getGourpInfo,
	getChannelList,
	getFriendList,
	getSubscriptionList
} from '@/api/imApi/admin.js'
const message = {
	state: {
		message: {},
		chatInfo: {}
	},
	mutations: {
		SET_MESSAGE_ROOM(state, channel) {
			let msg = state.message
			if (!msg[channel.id]) {
				msg[channel.id] = {
					item: []
				}
			}
		},
		// 这个函数的作用是在用户点击消息主页的一个聊天框时，将从接口获取的一页消息（一页默认20条消息）存储到vuex中的消息列表中。
		SET_MESSAGE_ARRAY(state, message) {
			let msg = state.message
			if (message.length <= 0) {
				return
			}
			msg[message[0].channelId] = {}
			msg[message[0].channelId].item = []
			message.forEach(item => {
				msg[item.channelId].item.push(item)
			})
			// 当用户点击聊天框时，从接口获取的最新的聊天记录写在聊天框的对象的lastPostContent属性里，这样聊天框的信息就是最新的消息，不会造成聊天框
			// 最新消息和聊天界面最新消息不同步。
			this.commit('CHANGE_LAST_MSG_TIME', message[message.length - 1])
		},
		SET_MESSAGE_ROOM_BY_MESSAGE(state, message) {
			let msg = state.message
			if (!msg[message.channelId]) {
				msg[message.channelId] = {
					item: []
				}
			}
		},
		CHANGE_ACTIVE_POSITION(state, id) {
			let index = findObjIndexInArray(id, store.state.user.activeList)
			if (store.state.user.activeList[index]) {
				let obj = store.state.user.activeList[index]
				store.state.user.activeList.splice(index, 1)
				store.state.user.activeList.unshift(obj)
			}
		},
		SET_MESSAGE_POINT(state, message) {
			this.commit('SET_MESSAGE_ROOM_BY_MESSAGE', message)
			let obj = findObjInArray(message.originId, store.state.user.activeList)
			console.log('是否存在聊天列表中?', obj !== null)
			if (obj === null) {
				obj = findObjInArray(message.originId, store.state.user.friendInfo)
				if (obj) {
					obj = { ...obj,
						unReadMsg: 1
					}
					this.commit('SET_ACTIVE_OBJ', obj)
				}
			} else {
				console.log('好友...........')
				if (message.channelId === state.chatInfo.channelId) {
					obj.unReadMsg = 0
				} else {
					obj.unReadMsg++
					console.log('obj.unReadMsg',obj.unReadMsg)
				}
			}
			this.commit('CHANGE_ACTIVE_POSITION', message.originId)
			this.commit('SET_CHAT_INFO_UNREADMSG', message)
			this.commit('CHANGE_LAST_MSG_TIME', message)
			state.message[message.channelId].item.push(message)
			console.log('数组')
			console.log(state.message[message.channelId].item)
		},
		CHANGE_LAST_MSG_TIME(state, message) {
			if (message.originName) {
				let channelId = message.channelId
				for (let obj of store.state.user.activeList) {
					if (obj.channelId === channelId) {
						obj.lastPostAt = message.createTime
						console.log('CHANGE_LAST_MSG_TIME',message)
						obj.lastPostContent = message.message
						console.log('obj.lastPostContent',obj.lastPostContent)
						obj.lastSender = message.originName
						console.log('时间修正完成')
						break
					}
				}
			}
		},
		SET_ACTIVE_OBJ(state, obj) {
			if (obj.type === USER_TYPE.FRIEND) {
				store.state.user.activeList.unshift(convertActiveFriend(obj))
			} else if (obj.type === USER_TYPE.GROUP) {
				store.state.user.activeList.unshift(convertActiveChannel(obj))
			} else if (obj.type === USER_TYPE.SUBSCRIP) {
				store.state.user.activeList.unshift(convertActiveSubsrip(obj))
			}
		},
		SET_CHAT_INFO_UNREADMSG(state, message) {
			if (message.channelId === state.chatInfo.channelId && message.originId !== store.state.user.userInfo.id) {
				state.chatInfo.objectInfo.unReadMsg++
			}
		},
		SET_MESSAGE_GROUP(state, message) {
			this.commit('SET_MESSAGE_ROOM_BY_MESSAGE', message)
			let obj = findObjInArray(message.channelId, store.state.user.activeList)
			console.log('是否存在聊天列表中?', obj !== null)
			if (obj === null) {
				obj = findObjInArray(message.channelId, store.state.user.channelInfo)
				if (obj) {
					obj = { ...obj,
						unReadMsg: 1
					}
					this.commit('SET_ACTIVE_OBJ', obj)
				}
			} else {
				if (message.channelId === state.chatInfo.channelId) {
					console.log('obj.unReadMsg = 0')
					obj.unReadMsg = 0
				} else {
					console.log('obj.unReadMsg++')
					obj.unReadMsg++
				}
			}
			this.commit('CHANGE_ACTIVE_POSITION', message.channelId)
			this.commit('SET_CHAT_INFO_UNREADMSG', message)
			this.commit('CHANGE_LAST_MSG_TIME', message)
			state.message[message.channelId].item.push(message)
		},
		REMOVE_CHANNELINFO_OBJID(state, id) {
			let index = findObjIndexInArray(id, store.state.user.channelInfo)
			if (index >= 0) {
				store.state.user.channelInfo.splice(index, 1)
			}
		},
		REMOVE_ACTIVE_OBJID(state, id) {
			let index = findObjIndexInArray(id, store.state.user.activeList)
			if (index >= 0) {
				store.state.user.activeList.splice(index, 1)
				if (state.chatInfo.channelId === id) {
					uni.switchTab({
						url:'/pages/chart/index'
					})
				}
			}
		},
		// 加群退群
		SET_MESSAGE_GROUP_SYSTEM(state, message) {
			this.commit('SET_MESSAGE_ROOM_BY_MESSAGE', message)
			let obj = findObjInArray(message.channelId, store.state.user.channelInfo)
			console.log('obj', obj)
			if (obj === null) {
				getGourpInfo(message.channelId).then(res => {
					this.commit('SET_CHANNELINFO_OBJ', res.data)
					obj = {
						...res.data,
						unReadMsg: 1,
						lastPostAt: message.createTime,
						lastPostContent: null,
						lastPostTarget: null,
						lastPostType: POST.GROUP_SYSTEM,
						lastSender: null
					}
					this.commit('SET_ACTIVE_OBJ', obj)
				})
			} else {
				let newObj = findObjInArray(message.channelId, store.state.user.activeList)
				console.log('newObj', newObj)
				if (newObj === null) {
					obj = {
						...obj,
						unReadMsg: 1,
						lastPostAt: message.createTime,
						lastPostContent: null,
						lastPostTarget: null,
						lastPostType: POST.GROUP_SYSTEM,
						lastSender: null
					}
					console.log(obj)
					this.commit('SET_ACTIVE_OBJ', obj)
				} else {
					newObj.unReadMsg++
				}
			}
			this.commit('CHANGE_ACTIVE_POSITION', message.channelId)
			this.commit('SET_CHAT_INFO_UNREADMSG', message)
			this.commit('CHANGE_LAST_MSG_TIME', message)
			state.message[message.channelId].item.push(message)
		},
		SET_MESSAGE_USER(state, message) {
			// 设置活动列表中的信息
			// console.log(message.props ,store.state.user.activeList)
			let objOne = findObjInArray(message.props, store.state.user.activeList)
			if (objOne) {
				objOne.online = message.status === ONLINE.TRUE
			}
			// 设置好友列表中的信息
			let index = findObjIndexInArray(message.props, store.state.user.friendInfo)
			if (store.state.user.friendInfo[index]) {
				let objTwo = store.state.user.friendInfo[index]
				objTwo.online = message.status === ONLINE.TRUE
				if (objTwo.online) {
					store.state.user.friendInfo.splice(index, 1)
					store.state.user.friendInfo.unshift(objTwo)
				}
			}
			// 设置好友树的信息
			// function recursionTree (node) {
			//   if (isEmpty(node.childNodes)) {
			//     if (node.friendList) {
			//       for (let index in node.friendList) {
			//         if (node.friendList[index].id === message.props) {
			//           let objThree = node.friendList[index]
			//           objThree.online = message.status === ONLINE.TRUE
			//           if (objThree.online) {
			//             node.friendList.splice(index, 1)
			//             node.friendList.unshift(objThree)
			//           }
			//         }
			//       }
			//     }
			//   } else {
			//     for (let data of node.childNodes) {
			//       recursionTree(data)
			//     }
			//   }
			// }
			// for (let node of store.state.user.friendTree) {
			//   recursionTree(node)
			// }
		},
		SET_MESSAGE_CONFIRM(state, message) {
			let obj = findObjInArray(
				message.props,
				state.message[message.channelId].item
			)
			if (obj) {
				console.log('已查找到须修改的消息')
				if (message.originId === store.state.user.userInfo.id) {
					obj.confirmStatus = SURE.AGREE
				}
				obj.unConfirmNumber = message.unConfirmNumber
			}
		},
		SET_MESSAGE_TEMP_FILE(state, message) {
			let msg = state.message
			this.commit('CHANGE_ACTIVE_POSITION', message.originId)
			this.commit('SET_CHAT_INFO_UNREADMSG', message)
			msg[message.channelId].item.push(message)
		},
		SET_MESSAGE_FILE(state, message) {
			if (message.originId === store.state.user.userInfo.id) {
				return
			}
			this.commit('SET_MESSAGE_GROUP', message)
		},
		SET_MESSAGE_SUBSCRIP(state, message) {
			this.commit('SET_MESSAGE_ROOM_BY_MESSAGE', message)
			let obj = findObjInArray(message.channelId, store.state.user.activeList)
			console.log('是否存在聊天列表中?', obj !== null)
			if (obj === null) {
				obj = findObjInArray(message.channelId, store.state.user.subscriptionInfo)
				if (obj) {
					obj = { ...obj,
						unReadMsg: 1
					}
					this.commit('SET_ACTIVE_OBJ', obj)
				}
			} else {
				if (message.channelId === state.chatInfo.channelId) {
					obj.unReadMsg = 0
				} else {
					obj.unReadMsg++
					console.log('obj.unReadMsg', obj.unReadMsg)
				}
			}
			this.commit('CHANGE_ACTIVE_POSITION', message.channelId)
			this.commit('SET_CHAT_INFO_UNREADMSG', message)
			this.commit('CHANGE_LAST_MSG_TIME', message)
			state.message[message.channelId].item.push(message)
		},
		SET_CHAT_INFO(state, info) {
			// console.log('SET_CHAT_INFO_ing', info)
			state.chatInfo = info
		},
		SET_CHANNELINFO_OBJ(state, obj) {
			store.state.user.channelInfo.unshift(convertChannelInfo(obj))
		},
		SET_PAGE_MESSAGE(state, message) {
			let msg = state.message[message[0].channelId].item
			message = message.reverse()
			message.forEach(item => {
				msg.unshift(item)
			})
		},
		CLEAN_VUEX_MESSAGE(state) {
			state.message = {}
			state.chatInfo = {}
		}
	},
	actions: {
		setMessageRoom(state, channel) {
			state.commit('SET_MESSAGE_ROOM', channel)
		},
		setMessage(state, message) {
			// if (message.length) {
			// 	console.log('多条消息')
			// 	state.commit('SET_MESSAGE_ARRAY', message)
			// } 
			
			if (message.length || message instanceof Array) {
				// console.log('多条消息')
				state.commit('SET_MESSAGE_ARRAY', message)
			} else {
				// console.log('单条消息')
				if (
					message.type === POST.POINT ||
					message.type === POST.POINT_FILE ||
					message.type === POST.POINT_IMG
				) {
					// console.log('好友聊天消息')
					state.commit('SET_MESSAGE_POINT', message)
				} else if (
					message.type === POST.GROUP_NORMAL ||
					message.type === POST.GROUP_IMPORTANT ||
					message.type === POST.GROUP_AT ||
					message.type === POST.GROUP_NOTIFY
				) {
					// console.log('群聊消息')
					state.commit('SET_MESSAGE_GROUP', message)
				} else if (message.type === POST.GROUP_SYSTEM) {
					let type = isDisbanGroupMsg(message.message)
					console.log(type)
					if (type === SYSTEM_MSG_TYPE.DISSOLVED) {
						// console.log('解散群消息')
						state.commit('REMOVE_CHANNELINFO_OBJID', message.channelId)
						state.commit('REMOVE_ACTIVE_OBJID', message.channelId)
					} else if (
						type === SYSTEM_MSG_TYPE.JOIN ||
						type === SYSTEM_MSG_TYPE.EXIT ||
						type === SYSTEM_MSG_TYPE.SUBSCRIP
					) {
						// console.log('加群退群消息')
						state.commit('SET_MESSAGE_GROUP_SYSTEM', message)
					}
				} else if (message.type === POST.USER_STATUS) {
					// console.log('好友上下线消息')
					// state.commit('SET_MESSAGE_USER', message)
					// console.log('上下线注释了')
				} else if (message.type === POST.POST_CONFIRM) {
					// console.log('重要消息确认')
					state.commit('SET_MESSAGE_CONFIRM', message)
				} else if (message.type === POST.TEMP_FILE) {
					// console.log('临时文件')
					state.commit('SET_MESSAGE_TEMP_FILE', message)
				} else if (
					message.type === POST.GROUP_FILE ||
					message.type === POST.GROUP_IMG
				) {
					// console.log('文件')
					state.commit('SET_MESSAGE_FILE', message)
				} else if (message.type === POST.SUBSCRIPTION) {
					// console.log('订阅号')
					state.commit('SET_MESSAGE_SUBSCRIP', message)
				}
			}
			store.dispatch('calUnreadMSG')
		},
		setChatInfo(state, info) {
			state.commit('SET_CHAT_INFO', info)
		},
		setPageMessage(state, message) {
			console.log('上一页信息')
			state.commit('SET_PAGE_MESSAGE', message)
		},
		changeLastMsgTime(state, message) {
			state.commit('CHANGE_LAST_MSG_TIME', message)
		},
		removeChannelInfoByObjId(state, id) {
			state.commit('REMOVE_CHANNELINFO_OBJID', id)
		},
		removeActiveListByObjId(state, id) {
			state.commit('REMOVE_ACTIVE_OBJID', id)
		},
		cleanVuexMessage(state) {
			state.commit('CLEAN_VUEX_MESSAGE')
		},
		changeActivePosition(state,id){
			state.commit('CHANGE_ACTIVE_POSITION', id)
		},
		cleanCharInfo({
			state
		}) {
			state.chatInfo = {}
		},
		
		setMessageList ({
			state,
			commit,
			dispatch
		}) {
			let userId = uni.getStorageSync('user_id')
			if (userId) {
				getChannelList(userId).then(res => {
					if (res.status && res.data) {
						dispatch('setChannelInfo', res.data)
					}
					uni.hideLoading()
				}).catch(err => {
					console.log(err)
					uni.hideLoading()
				})
				getFriendList(userId).then(res => {
					if (res.status && res.data) {
						dispatch('setFriendsInfo', res.data)
					}
					uni.hideLoading()
				}).catch(err => {
					console.log(err)
					uni.hideLoading()
				})
				getSubscriptionList(userId).then(res => {
					console.log('getSubscriptionList-res', res)
					if (res.status && res.data) {
						dispatch('setSubscribeInfo', res.data)
					}
					uni.hideLoading()
				}).catch(err => {
					console.log(err)
					uni.hideLoading()
				})
			}
		}
	}

}
export default message

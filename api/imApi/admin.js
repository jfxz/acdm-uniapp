import {
	prefix
} from './header'
import https from '../../config/api-interface.js'

// 获取用户信息
export const userInfo = () => {
	return https({
		url: `/${prefix}/user/info`,
		method: 'GET'
	})
}
// 获取用户的好友列表、当前会话列表、群聊列表
export const getUserAllList = userId =>{
	return https({
		url: `/${prefix}/user/allList/${userId}`,
		method: 'GET'
	})
}

// 发送心跳
export const breathe = (userId, loginId) =>{
	return https({
		url: `/${prefix}/user/breathe/${userId}/${loginId}`,
		method: 'PUT'
	})
}

// 根据好友ID查找channelId
export const getFriendChannelId = friendId =>{
	return https({
		url: `/${prefix}/channel/getChannel/${friendId}`,
		method: 'GET'
	})
}

// 根据登录ID和channelId查找聊天记录
export const getChatHistory = (loginId, channelId, pageNumber, pageSize) =>{
	return https({
		url: `/${prefix}/post/${loginId}/${channelId}/${pageNumber}/${pageSize}`,
		method: 'GET'
	})
}

// 根据channelId新建聊天会话
export const createTempChannel = channelId =>{
	return https({
		url: `/${prefix}/userChannel/createTempChannel/${channelId}`,
		method: 'GET'
	})
}

// 根据friendId关闭好友会话
export const closeTempChannelByFriendId = (userId, friendId) =>{
	return https({
		url: `/${prefix}/userChannel/closeTempFriendChannel/${userId}/${friendId}`,
		method: 'PUT'
	})
}

// 根据channelId关闭群聊会话
export const closeTempChannelByGroupId = (userId, GroupId) =>{
	return https({
		url: `/${prefix}/userChannel/closeTempGroupChannel/${userId}/${GroupId}`,
		method: 'PUT'
	})
}
// 新建一个航班群聊
export const creatGroupByFlight = item => {
	return https({
		url: `/${prefix}/channel/flight`,
		method: 'POST',
		data: item
	})
}

// 新建一个群聊
export const creatGroup = item => {
	return https({
		url: `/${prefix}/channel`,
		method: 'POST',
		data: item
	})
}
// 重要消息确认
export const confirmMsg = item => {
	return https({
		url: `/${prefix}/post/confirm`,
		method: 'POST',
		data: item
	})
}
// 查看消息确认状态
export const getMsgStatus = msgId =>{
	return https({
		url: `/${prefix}/post/postStatus/${msgId}`,
		method: 'GET'
	})
}

// 拉好友(多人)进群,若群不存在则建群
export const pullFriendToGroup = item =>{
	return https({
		url: `/${prefix}/channel/pullToChannel`,
		method: 'POST',
		data: item
	})
}

// 根据channelId查找群成员
export const getGroupMember = channelId =>{
	return https({
		url: `/${prefix}/userChannel/${channelId}`,
		method: 'GET'
	})
}

// 群成员退出群聊
export const exitGroup = channelId =>{
	return https({
		url: `/${prefix}/channel/${channelId}`,
		method: 'DELETE'
	})
}
// 聊天发送消息
export const sendMsg = item =>{
	return https({
		url: `/${prefix}/post`,
		method: 'POST',
		data: item
	})
}
// 获取群信息
export const getGourpInfo = channelId =>{
	return https({
		url: `/${prefix}/channel/${channelId}`,
		method: 'GET'
	})
}

// 订阅mq消息
export const subscribeMQ = userId =>{
	return https({
		url: `/${prefix}/user/binding/${userId}`,
		method: 'GET'
	})
}

// 解散群聊
export const disbanGroup = channelId =>{
	return https({
		url: `/${prefix}/channel/delete/${channelId}`,
		method: 'DELETE'
	})
}
// 退出登录
export const exitLogin = loginId =>{
	return https({
		url: `/${prefix}/user/loginOut/${loginId}`,
		method: 'PUT'
	})
}

// 发送文件
export const sendFile = form => {
	return https({
		url: `/${prefix}/post/file`,
		method: 'POST',
		data: form
	})
}
// 发送文件临时消息
export const sendTempFile = form =>{
	return https({
		url: `/${prefix}/post/file/temp`,
		method: 'POST',
		data: form
	})
}

// 历史记录查询
export const searchHistoryMsg = form =>{
	return https({
		url: `/${prefix}/post/page/condition`,
		method: 'GET',
		data: form
	})
}

// 根据channelNumber加入群聊
export const joinGroupChat = channelNumber =>{
	return https({
		url: `/${prefix}/channel/joinChannel/${channelNumber}`,
		method: 'GET'
	})
}


// 加入群聊
export const pullToGroupChat = channelNumber =>{
	return https({
		url: `/${prefix}/channel/pullToChannel`,
		method: 'POST'
	})
}

// 获得活跃列表
export const getActiveList = userId =>{
	return https({
		url: `/${prefix}/user/active/${userId}`,
		method: 'GET '
	})
}
// 获得
export const getChannelList = userId =>{
	return https({
		url: `/${prefix}/user/channelList/${userId}`,
		method: 'GET '
	})
}
// 获得活跃列表
export const getFriendList = userId =>{
	return https({
		url: `/${prefix}/user/friendList/${userId}`,
		method: 'GET '
	})
}
// 获得活跃列表
export const getSubscriptionList = userId =>{
	return https({
		url: `/${prefix}/user/subscriptionList/${userId}`,
		method: 'GET '
	})
}

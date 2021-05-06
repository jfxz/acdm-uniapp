import { USER_TYPE } from '@/common/dic'
import { isEmpty } from '@/common/util/util.js'
// 用户信息转化
export const convertUserInfo = userInfo => {
  console.log(userInfo)
  return {
    id: userInfo.id,
    loginId: userInfo.loginId,
    queue: userInfo.queue,
    routingKey: userInfo.routingKey,
    userAccount: userInfo.userAccount,
    name: userInfo.userName,
    superAdmin: userInfo.superAdmin
  }
}
// 好友信息转换
export const convertFriendInfo = friendsInfo => {
  let arr = []
  friendsInfo.forEach(item => {
    arr.push({
      id: item.id,
      channelId: item.channelId,
      routingKey: item.routingKey,
      name: item.userName,
      userAccount: item.userAccount,
      online: item.online,
      type: USER_TYPE.FRIEND
    })
  })
  return arr
}
// 组织分配好友转化
export const convertColleague = colleagueList => {
  convertDepartmentColleague(colleagueList)
  return colleagueList
}

export const convertDepartmentColleague = colleagueList => {
  for (let nodeData of colleagueList) {
    if (isEmpty(nodeData.childNodes)) {
      if (nodeData.friendList) {
        let arr = []
        nodeData.friendList.forEach(item => {
          arr.push({
            id: item.id,
            channelId: item.channelId,
            routingKey: item.routingKey,
            name: item.userName,
            userAccount: item.userAccount,
            online: item.online,
            type: USER_TYPE.FRIEND
          })
        })
        nodeData.friendList = arr
      }
    } else {
      convertDepartmentColleague(nodeData.childNodes)
    }
  }
}
// 单条群信息转化
export const convertChannelInfo = channelInfo => {
  return {
    id: channelInfo.id,
    channelId: channelInfo.id,
    routingKey: channelInfo.routingKey,
    name: channelInfo.name,
    description: channelInfo.description,
    header: channelInfo.header,
    creatorId: channelInfo.creatorId,
    type: USER_TYPE.GROUP
  }
}
// 单条订阅号信息转化
export const convertSubsripInfo = subscripInfo => {
  return {
    id: subscripInfo.id,
    channelId: subscripInfo.id,
    name: subscripInfo.name,
    type: USER_TYPE.SUBSCRIP
  }
}
// 私聊好友窗口转换
export const convertActiveFriend = friendsInfo => {
  return {
    id: friendsInfo.id,
    channelId: friendsInfo.channelId,
    routingKey: friendsInfo.routingKey,
    name: friendsInfo.userName || friendsInfo.name,
    unReadMsg: friendsInfo.unReadMsg || 0,
    lastPostAt: friendsInfo.lastPostAt,
    lastPostContent: friendsInfo.lastPostContent,
    lastPostTarget: friendsInfo.lastPostTarget,
    lastPostType: friendsInfo.lastPostType,
    lastSender: friendsInfo.lastSender,
    createTime: friendsInfo.createTime,
    online: friendsInfo.online,
    type: USER_TYPE.FRIEND
  }
}
// 群聊窗口转换
export const convertActiveChannel = channelInfo => {
  return {
    id: channelInfo.id,
    channelId: channelInfo.id,
    routingKey: channelInfo.routingKey,
    name: channelInfo.name,
    unReadMsg: channelInfo.unReadMsg || 0,
    createTime: channelInfo.createTime,
    lastPostAt: channelInfo.lastPostAt,
    lastPostContent: channelInfo.lastPostContent,
    lastPostTarget: channelInfo.lastPostTarget,
    lastPostType: channelInfo.lastPostType,
    lastSender: channelInfo.lastSender,
    description: channelInfo.description,
    creatorId: channelInfo.creatorId,
    type: USER_TYPE.GROUP
  }
}
// 订阅号窗口转化
export const convertActiveSubsrip = subscripInfo => {
  return {
    id: subscripInfo.id,
    channelId: subscripInfo.id,
    name: subscripInfo.name,
    unReadMsg: subscripInfo.unReadMsg || 0,
    lastPostAt: subscripInfo.lastPostAt,
    lastPostContent: subscripInfo.lastPostContent,
    lastPostTarget: subscripInfo.lastPostTarget,
    lastPostType: subscripInfo.lastPostType,
    lastSender: subscripInfo.lastSender,
    createTime: subscripInfo.createTime,
    type: USER_TYPE.SUBSCRIP
  }
}
// 常用语转换
export const convertPhrase = phrase => {
  return {
    id: phrase.id,
    content: phrase.content
  }
}

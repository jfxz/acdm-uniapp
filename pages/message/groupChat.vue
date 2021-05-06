/*
* 界面名称:聊天页面
* 界面功能:点对点聊天及群聊聊天
* 其他    :
* 时间    :2020-7-23 10:33:26
* 作者    :gyb
*/
<template>
	<view class="container">
		
		<view class="navbar">
			<view class="nav-handle-left">
				<view class="handle-type">
					<image class="my-icon-image" style="height:32rpx;width: 32rpx;" @tap="navBack"  src="@/static/back.png"></image>
				</view>
			</view>
			<view class="nav-title">
				<text>{{title}}</text>
			</view>
			<view class="nav-handle-right">
				<view class="handle-type">
					<image class="menu-icon-image" @tap="chartSetting"  src="@/static/ic_menu.png"></image>
				</view>
			</view>
		</view>
		
		<view class="tui-chat-content">
	
			<block v-for="(item, index) in messageList" :key="index">
				<!-- 时间 -->
				<template v-if="item.showTimeFlag">
					<view class="tui-chat-center">{{formatMesTime(item.createTime)}}</view>
				</template>
				
				<template v-if="item.type==3">
					<view class="tui-chat-center">{{item.message}}</view>
				</template>
				<template v-else>
					<template v-if="item.originId==userId">
						<!-- 本人消息 -->
						<view class="cu-item" style="padding-top: 36rpx;">
							<view class="user-name-right">{{item.originName}}</view>
							<view class="tui-chat-right">
								<view class="confirm-message">
									<template v-if="item.type == 2 && item.originId==userId">
										<template v-if="item.unConfirmNumber === 0">
											<view class="confirm-numbers-right">已全确认</view>
										</template>
										<template v-else>
											<view class="confirm-numbers-right" @tap="getMsgStatus(item)">{{item.unConfirmNumber}}人未确认</view>
										</template>
									</template>
									<view class="tui-chatbox tui-chatbox-right">{{item.message}}</view>
								</view>
								<view class="head-image-outter-right">
									<view class="head-image cu-avatar round">{{item.originName[0]}}</view>
								</view>
							</view>
						</view>
					</template>
					<template v-else>
						<!-- 非本人消息 -->
						<view class="cu-item" style="padding-top: 36rpx;">
							<view class="user-name-left">{{item.originName}}</view>
							<view class="tui-chat-left">
								<view class="head-image-outter-left">
									<view class="head-image cu-avatar round">{{item.originName[0]}}</view>
								</view>
								<view class="confirm-message" style="justify-content: flex-start;">
									<view class="tui-chatbox tui-chatbox-left">{{item.message}}</view>
									<template v-if="item.type == 2 && item.originId!=userId">
										<template v-if="item.confirmStatus == 0">
											<view class="confirm-numbers-left" @tap="confirmMsg(item)">确认</view>
										</template>
										<template v-else-if="item.confirmStatus == 1">
											<view class="confirm-numbers-left">已确认</view>
										</template>
									</template>
								</view>
							</view>
						</view>
					</template>
				</template>
			</block>
		</view>
			
		<!-- 用于撑起最后一条文本防止被遮挡 -->
		<view style="height: 80upx;width: 80upx;"></view>
		<view v-if="liftUpFlag" style="height: 80upx;width: 80upx;"></view>
		<view class="atClass" v-if="atTipShow"><text style="padding: 0 20upx;" @tap="clickAtTip">有人@你</text></view>
			
		<!-- 输入框 -->
		<view class="cu-bar foot input" style="background:#E9E9E9">
			<input class="solid-bottom" style="width:450upx;background: #FFFFFF;border-radius: 15px;padding-left:10px;" :adjust-position="false"
			 maxlength="300" cursor-spacing="200" v-model="inputSendMsg" @focus="inputFocusFunc" @blur="inputBlurFunc"
			 />
			<template v-if="chatType==userType.GROUP">
				<template v-if="!importantFlag">
					<view class="cu-avatar round sm" style="background: #FFFFFF;margin-right:30upx" @touchend.prevent="clickImportant" @click="clickImportant"></view>
				</template>
				<template v-else>
					<image src="../../static/finish.png" class="importMsgButton" style="margin-right:30upx" @touchend.prevent="clickImportant" @click="clickImportant"></image>
				</template>
			</template>
			<button class="cu-btn bg-blue shadow" style="margin-right:20rpx;" @touchend.prevent="clickSend" @tap="clickSend">发送</button>
		</view>
		
		<view class="cu-modal" :class="showMsgStatus==true?'show':''">
			<view class="cu-dialog" style="max-width:350rpx;">
				<view class="cu-bar bg-white justify-end" style="min-height:30rpx;height:70rpx;background-color: #F8F8F8;">
					<view class="action" @tap="hideMsgStatus">
						<text class="cuIcon-close text-red" style="position:absolute;right:-1rpx;"></text>
					</view>
				</view>
				<view style="padding-bottom:60rpx;">
					<block v-for="(item, index) in msgStatusList" :key="item.id">
						<view class="modal-form-item">
							<view class="modal-form-item-label">
								<view>{{item.userName}}</view>
							</view>
							<template v-if="item.confirm==0">
								<view class="modal-form-item-unconfirm">
									未确认
								</view>
							</template>
							<template v-else>
								<view class="modal-form-item-confirm">
									确认
								</view>
							</template>
						</view>
					</block>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import {mapActions, mapGetters} from 'vuex'
	import dayjs from '@/common/util/dayjs.min.js'
	import {POST, USER_TYPE, SURE} from "@/common/dic.js"
	import {deepCopy, objInArray} from '@/common/util/util.js'
	import {convertFriendInfo} from '@/common/util/convertUtils.js'
	import {
		sendMsg, 
		confirmMsg,
		getChatHistory,
		createTempChannel,
		getGroupMember,
		getMsgStatus
	} from '@/api/imApi/admin.js'
	export default {
		data () {
			return {
				// 当前用户id
				userId: '',
				messageList: [],
				// 记录滚动条到底时与顶部的高度
				scollTopHeight: 0,
				// 滚动条目前高度
				nowScollHeight: 0,
				// 今天
				today: dayjs(new Date().getTime()).format('YYYY-MM-DD'),
				// 是否勾选重要消息
				importantFlag: false,
				// 要发送的消息
				inputSendMsg: '',
				// 群聊@的信息
				atObj: {
					atType: null,
					atUser: [],
					props: []
				},
				// 聊天类型
				chatType: 1,
				userType: {},
				page: {},
				// 最新一条@的位置
				atIndex: 0,
				atTipShow: false,
				// 是否确认群重要消息的用户情况队列
				msgStatusList: [],
				// 是否显示确认群重要消息的对话框
				showMsgStatus: false,
				// 是否抬起最后一条消息
				liftUpFlag: false,
				title: '',
				// 键盘高度
				keyboardHeight: 0
			}
		},
		computed: {
			...mapGetters([
				'chatInfo',
				'message',
				'userInfo',
				'activeList'
			]),
			msgItem () {
				if (this.chatInfo.objectInfo) {
					return {
						routingKey: this.chatInfo.objectInfo.routingKey || '',
						originId: this.userInfo.id || '',
						purposeId: this.chatInfo.objectInfo.id || '',
						channelId: this.chatInfo.channelId || '',
						originName: this.userInfo.name || ''
					}
				} else {
					return {
						routingKey: '',
						originId: this.userInfo.id || '',
						purposeId: '',
						channelId: '',
						originName: this.userInfo.name || ''
					}
				}
			}
		},
		mounted () {
			this.windowHeight = uni.getSystemInfoSync().windowHeight
			uni.onKeyboardHeightChange(res => {
			  console.log(res.height)
				this.keyboardHeight = res.height
			})
		},
		onNavigationBarButtonTap (e) {
			if (e.index === 0) {
				// 如果点击右上角群详情
				this.chartSetting()
			}
		},
		onBackPress () {
			// 清空vuex中的chatInfo，即当前聊天窗口的信息。因为判断当前未读信息数目的函数中，有一个判断是判断未读消息的channelId和当前聊天窗口的
			// channelId是不是一样，如果一样，那么就将未读消息数量置为0，所以在退出页面的时候需要将chatInfo置为空对象
			this.setChatInfo({})
		},
		onLoad (obj) {
			this.userId = this.$store.state.user.userInfo.id
			// 聊天类型
			this.chatType = obj.type
			this.userType = USER_TYPE
			if (obj.hasOwnProperty('createGroupChat') && obj.createGroupChat === 'true') {
				this.createGroup()
			} else {
				this.clickGroup()
			}
		},
		// 触底记录滚动条距离顶部高度
		onReachBottom: function() {
			this.scollTopHeight = this.nowScollHeight
		},
		watch: {
			messageList: {
				handler(newVal, oldVal) {
					this.showTimeFlag(this.messageList)
					// 若不在底则滚动到底
					var that = this
					if (this.nowScollHeight >= this.scollTopHeight - 50) {
						this.$nextTick(() => {
							uni.pageScrollTo({
								scrollTop: 9999999,
								duration: 100
							})
						})
					}
					// 群聊判断@提示显示
					if (this.chatInfo.type === POST.GROUP_NORMAL) {
						for (let i = this.atIndex === 0 ? 0 : this.messageList.length - this.atIndex; i < this.messageList.length; i++) {
							let msg = this.messageList[i]
							if (msg.type === POST.GROUP_AT) {
								if (msg.originId !== this.userInfo.id) {
									let flag = true
									let arr = msg.props.split(',')
									flag = arr.includes(this.userInfo.id) && i > this.messageList.length - this.chatInfo.objectInfo.unReadMsg - 1
									this.atTipShow = flag
									this.atIndex = this.messageList.length - i
									if (flag) {
										break
									}
								}
							}
						}
					}
				},
				deep: true
			},
			inputSendMsg(newVal, oldVal) {
				// 群聊才有@功能
				if (this.chatInfo.type === POST.GROUP_NORMAL) {
					// 判断现在是输入还是删除
					if (newVal.length > oldVal.length) {
						let str = /@$/
						if (str.test(newVal)) {
							uni.navigateTo({
								url: './groupUser?backFlag=true&channelId=' + this.chatInfo.channelId
							})
						}
					}
					if (newVal.length < oldVal.length) {
						// 一个个删除时才处理删除到@用户整个块
						if (oldVal.length - newVal.length === 1) {
							for (let i in this.atObj.atUser) {
								let str = new RegExp(this.atObj.atUser[i])
								let flag = str.test(newVal)
								if (!flag) {
									flag = str.test(oldVal)
									if (flag) {
										this.inputSendMsg = oldVal.replace(this.atObj.atUser[i], '')
										this.atObj.atUser.splice(i, 1)
										this.atObj.props.splice(i, 1)
										break
									}
								}
							}
						}
					}
				}
			}
		},
		// 滚动条实时高度
		onPageScroll (e) {
			this.nowScollHeight = e.scrollTop
		},
		methods: {
			...mapActions([
				'setMessage',
				'changeActiveListPosition',
				'changeLastMsgTime',
				'setPageMessage',
				
				'setMessageRoom',
				'setActiveListByObj',
				'setChatInfo'
			]),
			
			navBack () {
				uni.navigateBack()
			},
			
			getMessage () {
				this.messageList = this.message[this.chatInfo.channelId].item
			},
			// 计算是否显示时间
			showTimeFlag (list) {
				list.forEach((item, index) => {
					item.showTimeFlag = index === 0
					if (index !== 0) {
						let time = new Date(item.createTime).getTime()
						let lastTime = 0
						if(list[index - 1].createTime){
							lastTime = new Date(list[index - 1].createTime).getTime()
						}
						if (time && lastTime) {
							// 超过5分钟就显示
							item.showTimeFlag = time - lastTime > 5*60*1000
						}
					}
				})
			},
			// 当日仅显示时间
			formatMesTime (val) {
				if (typeof val !== 'number') {
					try {
						val = val.substr(0, 19).replace(/T/, ' ')
						val = dayjs(val).add(8, 'hour')
					} catch (e) {
						console.log(e)
					}
				}
				if (val && this.today === dayjs(val).format('YYYY-MM-DD')) {
					return dayjs(val).format('HH:mm')
				} else {
					return dayjs(val).format('YYYY-MM-DD HH:mm')
				}
			},
			// 重要消息按钮
			clickImportant () {
				this.importantFlag = !this.importantFlag
			},
			// 点击发送消息按钮
			clickSend () {
				if (this.inputSendMsg.length === 0) {
					return
				}
				if (this.importantFlag) {
					this.sendMessag(POST.GROUP_IMPORTANT)
				} else if (this.atObj.atType) {
					this.sendMessag(this.atObj.atType)
				} else {
					this.sendMessag(this.chatInfo.type)
				}
			},
			sendMessag (msgType) {
				let message = { ...this.msgItem,
					'message': this.inputSendMsg,
					'type': msgType
				}
				if (msgType === POST.GROUP_AT) {
					message.props = this.atObj.props.join(',')
					// 发送清空输入框和@的信息
					this.atObj.atType = null
					this.atObj.atUser = []
					this.atObj.props = []
				}
				this.inputSendMsg = ''
				sendMsg(message).then((res) => {
					if (res.status) {
						setTimeout(function () {
							uni.pageScrollTo({
								scrollTop: 9999999999,
								duration: 100
							})
						}, 200)
						if (message.type === POST.POINT) {
							this.setMessage(res.data)
							this.changeActiveListPosition(message.purposeId)
							this.changeLastMsgTime(res.data)
							this.$forceUpdate()
						}
					} else {
						this.$message('发送失败')
					}
				})
			},
			confirmMsg (item) {
				confirmMsg({
					userId: this.userInfo.id,
					postId: item.id,
					channelId: this.chatInfo.channelId,
					routingKey: this.chatInfo.objectInfo.routingKey
				}).then((res) => {
					if (res.status) {
						item.confirmStatus = SURE.AGREE
					}
				})
			},
			// 加载更多
			onPullDownRefresh() {
				this.page.pageNumber++
				var that = this
				getChatHistory(this.userInfo.loginId, this.chatInfo.channelId, this.page.pageNumber, this.page.pageSize).then(res => {
					if (res.status) {
						if (res.data.length > 0) {
							this.setPageMessage(res.data)
							// 加载后回到当前位置
							uni.pageScrollTo({
								scrollTop: this.scollTopHeight,
								duration: 100
							})
						}
					}
				})
				uni.stopPullDownRefresh()
			},
			// 点击有人@的提示
			clickAtTip() {
				this.atTipShow = false
				uni.pageScrollTo({
					scrollTop: 9999999999,
					duration: 100
				})
			},
			chartSetting () {
				uni.navigateTo({
					url: './groupInfo?channelId=' + this.chatInfo.channelId
				})
			},
			// 设置@用户
			setAtUser (item) {
				this.inputSendMsg = this.inputSendMsg + item.userName + ' '
				this.atObj.props.push(item.id)
				this.atObj.atUser.push('@' + item.userName)
				this.atObj.atType = POST.GROUP_AT
			},
			// 查看确认重要消息的状态
			getMsgStatus (item) {
				var that = this
				getMsgStatus(item.id).then(res => {
					if (res.status) {
						that.msgStatusList = res.data
						that.showMsgStatus = true
					}
				})
			},
			// 不显示是否确认群重要消息的对话框
			hideMsgStatus () {
				this.showMsgStatus = false
			},
			inputFocusFunc () {
				var that = this
				setTimeout(function () {
					uni.pageScrollTo({
						scrollTop: 9999999,
						duration: 100
					})
				}, 200)
			},
			inputBlurFunc () {
				setTimeout(function () {
					// that.liftUpFlag = false
					uni.pageScrollTo({
						scrollTop: 9999999,
						duration: 100
					})
				}, 200)
			},
			clickGroup () {
				var item = uni.getStorageSync('groupChatItem')
				let pageNumber = 0
				let pageSize = item.unReadMsg > 15 ? (item.unReadMsg + 5) : 20
				this.setMessageRoom(item)
				let key = objInArray(item, this.activeList)
				let channelId = deepCopy(item.id)
				// 存在聊天队列  直接获取历史记录 不存在则先创建
				if (!key) {
					new Promise((resolve) => {
						createTempChannel(channelId).then(res => {
							if (res.status) {
								let activeGroup = {
									...item,
									...res.data
								}
								this.setActiveListByObj(activeGroup)
								resolve()
							}
						})
					}).then()
				}
				getChatHistory(this.userInfo.loginId, channelId, pageNumber, pageSize).then((res) => {
					if (res.status) {
						this.setMessage(res.data)
						getGroupMember(channelId).then(res => {
							if (res.status) {
								let channelUserInfo = convertFriendInfo(res.data)
								this.setChatInfo({
									channelId,
									type: USER_TYPE.GROUP,
									objectInfo: deepCopy(item),
									page: {
										pageSize,
										pageNumber
									},
									channelUserInfo
								})
								this.$store.dispatch('calUnreadMSG')
								// 将最后聊天移植顶部
								this.$store.dispatch('changeActivePosition', item.id)
								
								this.getMessage()
								// uni.setNavigationBarTitle({
								// 	title: this.chatInfo.objectInfo.name
								// })
								this.title = this.chatInfo.objectInfo.name
								this.page = this.chatInfo.page
								uni.hideLoading()
							}
						})
					}
				})
			},
			
			createGroup () {
				var newGroupInfo = uni.getStorageSync('newGroupInfo')
				let channelId = newGroupInfo.id
				let pageNumber = 0
				let pageSize = 20
				getChatHistory(this.userInfo.loginId, channelId, pageNumber, pageSize).then((res) => {
					if (res.status) {
						this.setMessage(res.data)
						getGroupMember(channelId).then(res => {
							if (res.status) {
								let channelUserInfo = convertFriendInfo(res.data)
								this.setChatInfo({ 
									channelId,
									type: USER_TYPE.GROUP,
									objectInfo: {
										channelId: channelId,
										createTime: newGroupInfo.createTime,
										creatorId: newGroupInfo.creatorId,
										description: newGroupInfo.description,
										id: channelId,
										name: newGroupInfo.name,
										routingKey: newGroupInfo.routingKey,
										type: 1,
										unReadMsg: 0
									},
									page: {
										pageSize,
										pageNumber
									},
									channelUserInfo
								})
								// uni.setNavigationBarTitle({
								// 	title: this.chatInfo.objectInfo.name
								// })
								this.title = this.chatInfo.objectInfo.name
								this.getMessage()
								this.page = this.chatInfo.page
									
								for (let i in this.activeList) {
									let e = this.activeList[i]
									if (e.channelId === this.chatInfo.channelId) {
										e.unReadMsg = 0
										e.lastPostContent = this.messageList[this.messageList.length - 1].message
										break
									}
								}
								uni.hideLoading()
							}
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.navbar {
			display: flex;
			justify-content: space-between;
			height: calc(var(--status-bar-height) + 92rpx);
			background: #1891ff;
			padding-top: calc(var(--status-bar-height) + 25rpx);
			width: 100%;
			z-index: 10;
			position: fixed;
			top: 0;
			text-align: center;
		
			.nav-handle-left {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				width: 30%;
				padding-top: 5rpx;
				padding-left: 35rpx;
		
				.handle-type {
					image {
						width: 45rpx;
						height: 45rpx;
					}
				}
			}
		
			.nav-title {
				width: 40%;
				font-size: 38rpx;
				line-height: 50rpx;
				color: #ffffff;
			}
		
			.nav-handle-right {
				display: flex;
				flex-direction: row-reverse;
				justify-content: space-between;
				width: 30%;
				padding-top: 5rpx;
				padding-right: 35rpx;
		
				.handle-type {
					image {
						width: 38rpx;
						height: 38rpx;
					}
				}
			}
		}	
	
.importMsgButton {
	height: 48upx;
	width: 48upx;
}
.container {
	// padding-left: 20rpx;
	// padding-right: 20rpx;
	padding-bottom: 146rpx;
	box-sizing: border-box;
}

/*chatbox*/
.tui-chat-content {
	padding-top: calc(var(--status-bar-height) + 75rpx);;
	padding-left: 20rpx;
	padding-right: 20rpx;
	width: 100%;
	.group-system {
		background-color: grey;
	}
	.confirm-message {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		width: calc(100vw - 100rpx);
		.confirm-numbers-right {
			color: #06b6ff;
			margin-right: 30rpx;
			// right: 50rpx;
		}
		.confirm-numbers-left {
			color: #06b6ff;
			margin-left: 30rpx;
			// left: 50rpx;
		}
	}
	.head-image-outter-left {
		margin-right: 10rpx;
	}
	.head-image-outter-right {
		margin-left: 10rpx;
	}
	.head-image {
		background-color: #06b6ff;
		padding-bottom: 7rpx;
	}
	
	.user-name-left {
		font-size: 24rpx;
		color: #999999;
		position: relative;
		left: 87rpx;
	}
	.user-name-right {
		font-size: 24rpx;
		color: #999999;
		text-align: right;
		position: relative;
		right: 87rpx;
	}
}

.tui-chatbox {
	max-width: 66%;
	border-radius: 10rpx;
	position: relative;
	padding: 20rpx 22rpx;
	font-size: 32rpx;
	color: #333;
	word-break: break-all;
	word-wrap: break-word;
}

.tui-chatbox::before {
	content: '';
	position: absolute;
	width: 0;
	height: 0;
	top: 20rpx;
	border: 16rpx solid;
}

.tui-chatbox-left {
	background: #fff;
	border: 1rpx solid #fff;
	position: relative;
	left: 10rpx;
}

.tui-chatbox-left::before {
	right: 100%;
	border-color: transparent #fff transparent transparent;
}

.tui-chatbox-right {
	background: #a0d5f3;
	border: 1rpx solid #a0d5f3;
	position: relative;
	right: 10rpx;
}

.tui-chatbox-right::before {
	left: 100%;
	border-color: transparent transparent transparent #a0d5f3;
}

/*chatbox*/

.tui-chat-left,
.tui-chat-right {
	display: flex;
	align-items: flex-start;
}

.tui-user-pic {
	width: 80rpx;
	height: 80rpx;
	flex-shrink: 0;
	border-radius: 50%;
	display: block;
}

.tui-left {
	margin-left: 26rpx;
}

.tui-right {
	margin-right: 26rpx;
}

.tui-chat-right {
	justify-content: flex-end;
}

.tui-chat-center {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 28rpx;
	font-size: 28rpx;
	color: #666;
	padding-top: 36rpx;
}

.tui-label {
	display: inline-block;
	background: rgba(0, 0, 0, 0.4);
	color: #fff;
	font-size: 24rpx;
	line-height: 24rpx;
	margin-top: 36rpx;
	padding: 12rpx 16rpx;
	text-align: center;
	border-radius: 8rpx;
	margin-left: 50%;
	transform: translateX(-50%);
}

.tui-img-chatbox {
	position: relative;
}

.tui-img-chatbox::after {
	content: '';
	position: absolute;
	height: 200%;
	width: 200%;
	border: 1rpx solid #eaeef1;
	transform-origin: 0 0;
	-webkit-transform-origin: 0 0;
	-webkit-transform: scale(0.5);
	transform: scale(0.5);
	left: 0;
	top: 0;
	border-radius: 20rpx;
}

.tui-chat-img {
	max-width: 200rpx;
	/* min-height: 80rpx; */
	display: block;
	border-radius: 10rpx;
}

.tui-chat-flex {
	display: flex;
	align-items: center;
}

.tui-flex-center {
	display: flex;
	align-items: center;
}

.tui-chat-voice {
	width: 40rpx;
	height: 40rpx;
	display: block;
	flex-shrink: 0;
}

.tui-rotate {
	transform: rotate(180deg);
}

.tui-chat-fail {
	width: 50rpx;
	height: 50rpx;
	display: block;
	flex-shrink: 0;
}

.tui-mr {
	margin-right: 16rpx;
}

.tui-ml {
	margin-left: 16rpx;
}

.tui-flex-end {
	justify-content: flex-end;
}

.tui-flex-reverse {
	flex-direction: row-reverse;
}

.atClass {
	position: fixed;
	bottom: 120upx;
	left: 550upx;
	border-radius: 3px;
	background: #F1F1F1;
	color: #08B7FF;
	text-align: center;
	font-size: 32upx;
}
.modal-form-item {
	display: flex;
	justify-content: space-between;
	.modal-form-item-label {
		min-width: 100rpx;
		padding-left: 30rpx;
	}
	.modal-form-item-unconfirm {
		text-align: right;
		color: red;
		padding-right: 30rpx;
	}
	.modal-form-item-confirm {
		text-align: right;
		padding-right: 30rpx;
	}
}
</style>

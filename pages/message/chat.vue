/*
* 界面名称:聊天页面
* 界面功能:点对点聊天及群聊聊天
* 其他    :
* 时间    :2020-7-23 10:33:26
* 作者    :gyb
*/
<template>
	<view class="container">
		<!-- <view class="navbar">
			<view class="nav-handle-left">
				<view class="handle-type">
					<image class="my-icon-image" style="height:32rpx;width: 32rpx;" @tap="navBack"  src="@/static/back.png"></image>
				</view>
			</view>
			<view class="nav-title">
				<text>{{title}}</text>
			</view>
			<view class="nav-handle-right">
			</view>
		</view> -->
		
		<view  class="chat-layout">
			<view class="tui-chat-content">
					<block v-for="(item, index) in messageList" :key="index">
						<template v-if="item.showTimeFlag">
							<view class="tui-chat-center">{{formatMesTime(item.createTime)}}</view>
						</template>
						<!-- 时间 -->
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
													<view class="confirm-numbers-right">{{item.unConfirmNumber}}人未确认</view>
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
										</view>
									</view>
								</view>
							</template>
						</template>
					</block>
			</view>
		</view>
			
		<!-- 用于撑起最后一条文本防止被遮挡 -->
		<view style="height: 120upx;width: 100%;"></view>
		<view class="atClass" v-if="atTipShow"><text style="padding: 0 20upx;" @tap="clickAtTip">有人@你</text></view>
			
		<!-- 输入框 -->
		<view class="cu-bar foot input" style="background:#E9E9E9">
			 <input class="solid-bottom" style="width:450upx;background: #FFFFFF;border-radius: 15px;padding-left:10px;" :adjust-position="false"
			  maxlength="300" cursor-spacing="200" v-model="inputSendMsg" @focus="inputFocusFunc" @blur="inputBlurFunc"/>
			<template v-if="chatType==userType.GROUP">
				<template v-if="!importantFlag">
					<view class="cu-avatar round sm" style="background: #FFFFFF;margin-right:30upx" @tap="clickImportant"></view>
				</template>
				<template v-else>
					<image src="../../static/finish.png" class="importMsgButton" style="margin-right:30upx" @tap="clickImportant"></image>
				</template>
			</template>
			<button class="cu-btn bg-blue shadow" style="margin-left: 20rpx;" @touchend.prevent="clickSend" @tap="clickSend">发送</button>
		</view>
		<!-- <template v-if="loading">
			<tui-loading></tui-loading>
		</template> -->
	</view>
</template>

<script>
	import tChatBar from '@/components/thorui/t-chat-bar/t-chat-bar';
	import tuiLoadmore from '@/components/thorui/tui-loadmore/tui-loadmore.vue'
	import tuiBadge from '@/components/thorui/tui-badge/tui-badge.vue'
	import {mapActions, mapGetters} from 'vuex'
	import dayjs from '@/common/util/dayjs.min.js'
	import {sendMsg} from '@/api/imApi/admin.js'
	import {POST, USER_TYPE, SURE} from "@/common/dic.js"
	import {deepCopy, objInArray} from '@/common/util/util.js'
	import tuiLoading from '@/components/thorui/tui-loading/tui-loading.vue'
	// import {getChatHistory} from '@/api/imApi/admin.js'
	import {
		getFriendChannelId,
		getChatHistory,
		createTempChannel,
		getGroupMember,
		closeTempChannelByFriendId,
		closeTempChannelByGroupId,
		creatGroup
	} from '@/api/imApi/admin.js'
	export default {
		components: {
			tChatBar,
			tuiLoadmore,
			tuiBadge,
			tuiLoading
		},
		data () {
			return  {
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
				// 加载
				loading: false,
				page: {},
				// 最新一条@的位置
				atIndex: 0,
				atTipShow: false,
				title: '',
				downOption: {
					auto: true,
					offset: 30,
					textLoading:'刷新中',
					use: true,
					empty: {
						tip: 'wu'
					}
				},
				upOption: {
					auto: false,
					offset: 200,
					textLoading:'刷新中',
					use: true,
					empty: {
						tip: ''
					}
				}
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
		onLoad (obj) {
			this.userId = this.$store.state.user.userInfo.id
			// 聊天类型
			this.chatType = obj.type
			this.userType = USER_TYPE
			this.clickFriend()
		},
		onBackPress () {
			this.setChatInfo({})
		},
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
		watch: {
			messageList: {
				handler(newVal, oldVal) {
					this.showTimeFlag(this.messageList)
					// 若不在底则滚动到底
					if (this.nowScollHeight >= this.scollTopHeight - 50) {
						this.$nextTick(() => {
							uni.pageScrollTo({
								scrollTop: 9999999999,
								// scrollTop: 0,
								duration: 100
							})
						})
					}
				},
				deep: true
			}
		},
		onPageScroll: function(e) {
			this.nowScollHeight = e.scrollTop
		},
		
		// 触底记录滚动条距离顶部高度
		onReachBottom: function() {
			this.scollTopHeight = this.nowScollHeight
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
			// 加载更多
			
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
			// 点击发送消息按钮
			clickSend () {
				if (this.inputSendMsg.length === 0) {
					return
				}
				this.sendMessag(this.chatInfo.type)
			},
			sendMessag (msgType) {
				let message = { ...this.msgItem,
					'message': this.inputSendMsg,
					'type': msgType
				}
				this.inputSendMsg = ''
				sendMsg(message).then((res) => {
					if (res.status) {
						if (message.type === POST.POINT) {
							this.setMessage(res.data)
							this.changeActiveListPosition(message.purposeId)
							this.changeLastMsgTime(res.data)
						}
						setTimeout(function () {
							uni.pageScrollTo({
								scrollTop: 9999999999,
								duration: 0
							})
						}, 500)
					} else {
						this.$message('发送失败')
					}
				})
			},
			inputBlurFunc () {
				setTimeout(function () {
					uni.pageScrollTo({
						scrollTop: 9999999,
						duration: 100
					})
				}, 200)
			},
			inputFocusFunc () {
				setTimeout(function () {
					uni.pageScrollTo({
						scrollTop: 99999,
						duration: 100
					})
				}, 700)
			},
			navBack () {
				uni.navigateBack()
			},
			clickFriend () {
				var item = uni.getStorageSync('chatItem')
				let pageNumber = 0
				let pageSize = item.unReadMsg > 15 ? (item.unReadMsg + 5) : 20
				getFriendChannelId(item.id).then((res) => {
					if (res.status) {
						this.setMessageRoom(res.data)
						let channelId = deepCopy(res.data.id)
						let key = objInArray(item, this.activeList)
						if (!key) {
							new Promise((resolve) => {
								createTempChannel(channelId).then(res => {
									if (res.status) {
										let activeFriend = {
											...item,
											...res.data
										}
										this.setActiveListByObj(activeFriend)
										resolve()
									}
								})
							}).then()
						}
						getChatHistory(this.userInfo.loginId, channelId, pageNumber, pageSize).then(res => {
							if (res.status) {
								this.setMessage(res.data)
								this.setChatInfo({
									channelId,
									type: USER_TYPE.FRIEND,
									page: {
										pageSize,
										pageNumber
									},
									objectInfo: item
								})
								item.unReadMsg = 0
								// 计算下方未读消息数量
								this.$store.dispatch('calUnreadMSG')
								// 将最后聊天移植顶部
								this.$store.dispatch('changeActivePosition', item.id)
								this.getMessage()
								// uni.setNavigationBarTitle({
								// 	title: this.chatInfo.objectInfo.name
								// })
								this.title = this.chatInfo.objectInfo.name
								uni.setNavigationBarTitle({
									title: this.title
								})
								this.page = this.chatInfo.page
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
.importMsgButton {
	height: 48upx;
	width: 48upx;
}
.navbar {
			display: flex;
			justify-content: space-between;
			height: calc(var(--status-bar-height) + 92rpx);
			background: #1891ff;
			padding-top: calc(var(--status-bar-height) + 25rpx);
			width: 100%;
			z-index: 999;
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
.container {
	min-height: 300px;
	width: 100vw;
	overflow: auto;
}

/*chatbox*/
.chat-layout {
	width: 100%;
	overflow: auto;
	padding-top: calc(var(--status-bar-height) + 110rpx);
}
.tui-chat-content {
	padding-left: 20rpx;
	padding-right: 20rpx;
	max-width: calc(100%-400rpx);
	overflow-x: hidden;
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
	height: 28rpx;
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
.bottom-input {
	// position: absolute;
	bottom: 0;
	position: fixed;
	// z-index: 9999;
	// top: 700rpx;
	// bottom:0;
	// top: 0;
	width: 100%;
	background-color: rgba($color: #E9E9E9, $alpha: 1.0);
	// background-color: red;
	
	padding: 10rpx 0;
	// background-color: red;
	// padding-bottom: 300rpx;
	overflow: auto;
}
</style>

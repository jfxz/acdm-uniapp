<template>
	<!-- 预警信息 -->
	<view class="subscribeClass">
		<!-- <u-navbar back-icon-color="#000000" :background="{'background-color':'#4191EA'}">
			<view style="display:flex;justify-content:center;width:92%;">
				<view style="font-size:32rpx;">{{title}}</view>
			</view>
		</u-navbar> -->
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
		
		<view class="subList">
			<view v-for="(item,index) in messageList" :key="index">
				<view class="sub-item">
					<image class="subImage" src="../../static/subscription.png"></image>
					<view class="item-title">
						<view style="font-size: 32upx;">{{JSON.parse(item.message).title}}</view>
						<view>{{formatTime(item.createTime)}}</view>
					</view>
					<!-- <view class="message"> -->
					<view v-for="key in item.detailsKey" :key="key" class="message">{{key}}:{{item.details[key]}}</view>
					<!-- </view> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapActions, mapGetters} from 'vuex'
	import dayjs from '@/common/util/dayjs.min.js'
	import {deepCopy, objInArray} from '@/common/util/util.js'
	import {
		getChatHistory,
		
		sendMsg,
		confirmMsg,
		createTempChannel,
		getGroupMember,
		getMsgStatus
	} from '@/api/imApi/admin.js'
	import {
		USER_TYPE
	} from '@/common/dic'
	
	export default {
		data() {
			return {
				messageList: [],
				systemHeight: 1000,
				scollTopHeight: 0, // 记录滚动条到底时与顶部的高度
				nowScollHeight: 0, // 滚动条目前高度
				page: {},
				title: ''
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
				'chatInfo',
				'message',
				'activeList'
			])
		},
		mounted () {
			setTimeout(function () {
				uni.pageScrollTo({
					scrollTop: 9999999999,
					duration: 100
				})
			}, 200)
		},
		watch: {
			messageList: {
				handler(newVal, oldVal) {
					if (this.messageList.length > 0) {
						this.messageList.forEach(item => {
							item.details = JSON.parse(item.message).details
							item.detailsKey = this.setSubscrptionKey(item.details)
						})
						// 若不在底则滚动到底
						if (this.nowScollHeight >= this.scollTopHeight - 20) {
							this.$nextTick(() => {
								uni.pageScrollTo({
									scrollTop: 9999999999,
									duration: 100
								})
							})
						}
					}
				},
				deep: true
			}
		},
		onLoad() {
			this.systemHeight = uni.getSystemInfoSync().windowHeight
			this.clickSubscribe()
		},
		// 滚动条实时高度
		onPageScroll: function(e) {
			this.nowScollHeight = e.scrollTop
		},
		// 触底记录滚动条距离顶部高度
		onReachBottom: function() {
			this.scollTopHeight = this.nowScollHeight
		},
		// 加载更多
		onPullDownRefresh() {
			this.page.pageNumber++
			getChatHistory(this.userInfo.loginId, this.chatInfo.channelId, this.page.pageNumber, this.page.pageSize).then(res => {
				if (res.status) {
					if (res.data.length > 0) {
						this.setPageMessage(res.data)
						// 加载后回到当前位置
						uni.pageScrollTo({
							scrollTop: this.scollTopHeight-35,
							duration: 100
						})
					}
				}
			})
			uni.showLoading({
				title: '正在加载'
			});
			setTimeout(function() {
				uni.stopPullDownRefresh()
				uni.hideLoading()
			}, 1000)
		},
		onBackPress () {
			this.setChatInfo({})
		},
		methods: {
			...mapActions([
				'setPageMessage',
				
				'setMessage',
				'changeActiveListPosition',
				'changeLastMsgTime',
				'setMessageRoom',
				'setActiveListByObj',
				'setChatInfo'
				]),
			getMessage() {
				this.messageList = this.message[this.chatInfo.channelId].item
			},
			formatTime (val) {
				if (val) {
					if (typeof val !== 'number') {
						try {
							val = val.substr(0, 19).replace(/T/, ' ')
							val = dayjs(val).add(8, 'hour')
						} catch (e) {
							console.log(e)
						}
					}
					return dayjs(val).format('MM月DD日 HH:mm')
				}
			},
			// 分离key
			setSubscrptionKey(msg) {
				let key = []
				for (let name in msg) {
					key.push(name)
				}
				return key
			},
			navBack () {
				uni.navigateBack()
			},
			
			clickSubscribe () {
				var item = uni.getStorageSync('subscribeItem')
				let pageNumber = 0
				let pageSize = 20
				this.setMessageRoom(item)
				let key = objInArray(item, this.activeList)
				let channelId = deepCopy(item.id)
				// 存在聊天队列  直接获取历史记录 不存在则先创建
				if (!key) {
					new Promise((resolve) => {
						createTempChannel(channelId).then(res => {
							if (res.status) {
								let activeSubcrip = {
									...item,
									...res.data
								}
								this.setActiveListByObj(activeSubcrip)
								resolve()
							}
						})
					}).then()
				}
				console.log('userInfo', this.userInfo)
				getChatHistory(this.userInfo.loginId, channelId, pageNumber, pageSize).then((res) => {
					if (res.status) {
						this.setMessage(res.data)
						this.setChatInfo({
							channelId,
							type: USER_TYPE.SUBSCRIP,
							objectInfo: deepCopy(item),
							page: {
								pageSize,
								pageNumber
							}
						})
						this.$store.dispatch('calUnreadMSG')
						// 将最后聊天移植顶部
						this.$store.dispatch('changeActivePosition', item.id)
						
						this.getMessage()
						var that = this
						setTimeout(function () {
							// uni.setNavigationBarTitle({
							// 	title: that.chatInfo.objectInfo.name
							// })
							that.title = that.chatInfo.objectInfo.name
							uni.setNavigationBarTitle({
								title: that.title
							})
						}, 1000)
						this.page = this.chatInfo.page
						uni.hideLoading()
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #E9E9E9;
	}

	.subscribeClass {
		margin-top: 20upx;

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
		.subList {
			padding: 0 60upx;
			margin-top: calc(var(--status-bar-height) + 110rpx);
			.item-title {
				position: relative;
				top: -70upx;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				color: #FFFFFF;
				margin: 10upx 30upx;
			}
		}

		.sub-item {
			margin-top: 20upx;
			margin-bottom: 40upx;
			background: #FFFFFF;

			.message {
				margin: 0 30upx;
				margin-top: -50upx;
				padding-bottom: 40upx;
				font-size: 36upx;
				word-wrap: break-word;
			}
		}

		.subImage {
			height: 215upx;
			width: 100%;
		}
	}
</style>

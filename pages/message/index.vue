/*
* 界面名称:消息
* 界面功能:实现消息的通信
* 其他    :
* 时间    :2020-7-20 16:01:54
* 作者    :gyb
*/
<template>
  <view class="message-layout">
		<!-- <view class="navigate-bar">
			<image class="my-icon-image" @tap="openAddress"  src="@/static/mine.png"></image>
			<view class="text">消息</view>
			<image class="menu-icon-image" @tap="openMenu"  src="@/static/ic_menu.png"></image>
		</view> -->
		
		<view class="navbar">
			<view class="nav-handle-left">
				<view class="handle-type">
					<image src="../../static/home2x.png" @tap="openAcdmHome"></image>
				</view>
			</view>
			<view class="nav-title">
				<text>消息</text>
			</view>
			<view class="nav-handle-right">
				<view class="handle-type">
          <image class="my-icon-image" style="margin-right: 30rpx;" @tap="openAddress"  src="@/static/address-list.png"></image>
					<image class="menu-icon-image" @tap="openMenu"  src="@/static/ic_menu.png"></image>
				</view>
				
				<tui-bubble-popup
				v-if="mask"
				:show="menuStatus"
				triangleTop="-12px"
				triangleRight="10px"
				direction="top"
					backgroundColor="#ffffff"
					@close="clickMask"
					right="10px"
					top="70px"
					width="100px"
					color="black"
					:maskBgColor="'rgba(0, 0, 0, 0)'"
					ref="tuiBubblePopup">
					<view class="bubble-popup-item" @click="tapPopupMenu">
						<image class="icon" src="@/static/create_group_chat.png"></image>
						<span>创建群聊</span>
					</view>
				</tui-bubble-popup>
			</view>
		</view>
		
		<view class="search-bar">
			<view class="tui-searchbox">
				<view class="tui-search-input">
					<icon style="margin-left:20rpx;" type="search" size='15' color='#999'></icon>
					<!-- <u-input @input="filterList" placeholder="搜索" class="tui-search-text" v-model="filterInput" :border="true" @click="show = true" /> -->
					<input class="tui-search-text" placeholder="搜索" v-model="filterInput" @input="filterList"/>
				</view>
			</view>
		</view>
			
		
		<view class="message-list" style="background-color: #F5F5F5;">
			<uni-swipe-action>
				<uni-swipe-action-item v-for="(item, index) in displayList" :right-options="swipeOptions" :key="item.id" @click="closeActive($event, index)">
					<view class="message" @tap="click2Active(item, index)">
						<view class="head-image cu-avatar round lg" style="width: 102rpx;height: 102rpx;">{{item.name?item.name[0]:''}}</view>
						<view class="text-part">
							<view class="top">
								<view class="active-title">{{item.name}}</view>
								<view class="active-time">{{formatTime(item.lastPostAt)}}</view>
							</view>
							<view class="bottom">
								<view class="active-text">{{formatMessage(item)}}</view>
								<view class="active-times-layout">
									<template v-if="item.unReadMsg!==0">
										<view class="cu-tag active-times">{{item.unReadMsg}}</view>
									</template>
								</view>
							</view>
						</view>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
			
		</view>
		

		<tui-modal :show="newGroupShow" @cancel="hideNewGroupShow" :custom="true" fadeIn>
			<view class="tui-modal-custom">
				<view class="tui-prompt-title">创建群聊</view>
				<view class="modal-form-item">
					<view class="modal-form-item-label">
						<view>群名称</view>
					</view>
					<input placeholder="请输入群名称" class="tui-modal-input" v-model="groupChatForm.channelName"/>
				</view>
				<view class="modal-form-item">
					<view class="modal-form-item-label">
						<view>小标题</view>
					</view>
					<input placeholder="请输入群小标题" class="tui-modal-input" v-model="groupChatForm.channelHeader"/>
				</view>
				<view class="modal-form-item">
					<view class="modal-form-item-label">
						<view>群描述</view>
					</view>
					<input placeholder="请为此群输入一段描述" class="tui-modal-input" v-model="groupChatForm.channelDescription"/>
				</view>
				<view class="modal-form-item">
					<view class="modal-form-item-label">
						<view>好友</view>
					</view>
					<view class="tui-modal-input" style="min-height:42rpx;" @click="selectFirends">
						{{groupChatForm.userNameList.length>0?groupChatForm.userNameList:''}}
					</view>
				</view>
				<button height="72rpx" :size="28" @click="handleCreatGroup">立即提交</button>
			</view>
		</tui-modal>
		<u-tabbar :list="tabbarList" active-color="#2a4c7e" inactive-color="#8a8396"></u-tabbar>
	</view>
</template>

<script>
	import dayjs from '@/common/util/dayjs.min.js'
	import tuiModal from '@/components/thorui/modal/modal.vue'
	import {mapActions, mapGetters} from 'vuex'
	import {USER_TYPE} from '@/common/dic'
	import {
		getFriendChannelId,
		getChatHistory,
		createTempChannel,
		getGroupMember,
		closeTempChannelByFriendId,
		closeTempChannelByGroupId,
		creatGroup
	} from '@/api/imApi/admin.js'
	import popupMenu from '@/components/popup-menu/popup-menu.vue'
	import {deepCopy, objInArray} from '@/common/util/util.js'
	import {convertFriendInfo} from '@/common/util/convertUtils.js'
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue'
	import {
		subscribeMQ,
		getActiveList,
		exitLogin,
		getChannelList,
		getFriendList,
		getSubscriptionList
	} from '../../api/imApi/admin.js'
	import tuiBubblePopup from '@/pages/message/tui-bubble-popup.vue'
	export default {
		components: {
			popupMenu,
			tuiModal,
			uniSwipeAction,
			uniSwipeActionItem,
			uniNavBar,
			tuiBubblePopup
		},
		data () {
			return {
				filterInput: '',
				// 消息列表（activeList经过搜索框过滤后），不分页
				displayList: [],
				// 是否显示气泡菜单
				menuStatus: false,
				// 气泡菜单的内容
				menuData: [
					{
						title: '创建群聊',
						icon: '../../static/create_group_chat.png'
					}
				],
				// 显示创建群里的对话框
				newGroupShow: false,
				// 创建群聊表单
				groupChatForm: {
					channelName: '',
					channelHeader: '',
					channelDescription: '',
					userId: '',
					// 选择的好友的id列表
					userIdList: [],
					// 选择的好友的名字列表
					userNameList: [],
					userList: []
				},
				addGroupNumber: '',
				rowSelected: null,
				swipeOptions: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				tabbarList:this.$store.state.user.tabbar,
				pullUpOn: true,
				// 今天
				nowDate: dayjs(new Date()).format('YYYY-MM-DD'),
				showMask: false,
				mask: false
			}
		},
		
		watch: {
			activeList: {
				handler (newval) {
					this.displayList = newval
					this.$forceUpdate()
				},
				deep: true,
				immediate: true
			}
		},
		mounted () {
			// 数组深拷贝
			// this.displayList = this.activeList
			uni.showLoading({
				title: '加载中'
			})
			this.displayList = this.activeList
			console.log('activeList',this.activeList)
			console.log('displayList',this.displayList)
			uni.hideLoading()
		},
		onShow () {
			var that = this
			console.log('message-index-onshow')
			uni.showLoading({
				title: '加载中'
			})
			setTimeout(function () {
				let userId = uni.getStorageSync('user_id')
				if (userId) {
					getActiveList(userId).then(res => {
						console.log('getActiveList-res', res)
						if (res.status && res.data) {
							that.$store.dispatch('setActiveList', {
								activeFriendList: res.data.activeFriendList,
								activePublicChannelList: res.data.activePublicChannelList,
								activeSubscriptionInfo: res.data.activeSubscriptionList
							})
						}
						uni.hideLoading()
					}).catch(err => {
						console.log(err)
						uni.hideLoading()
					})
				}
			}, 10)
			
			this.displayList = this.activeList
			this.$forceUpdate()
			uni.hideLoading()
		},
		onNavigationBarButtonTap (e) {
			if (e.index === 0) {
				// 如果点击左上角头像，打开通讯录
				this.openAddress()
			} else {
				// 如果点击右上角菜单
				this.openMenu()
			}
		},
		
		computed: {
			// activeList为消息列表
			...mapGetters(['activeList', 'userInfo'])
		},
		methods: {
			...mapActions([
				'removeActiveListByIndex',
				'setMessageRoom',
				'setMessage',
				'setActiveListByObj',
				'setChatInfo'
			]),
      // 跳转到主页
      openAcdmHome () {
      	uni.reLaunch({
      		url: '../home/index'
      	})
      },
			clickMask () {
				this.showMask = false
				this.menuStatus = false
			},
			// 删除聊天
			closeActive (content, index) {
				let item = this.displayList[index]
				if (item.type === USER_TYPE.FRIEND) {
					this.closeFriend(item, index)
				} else if (item.type === USER_TYPE.GROUP) {
					this.closeChannel(item, index)
				} else {
					this.closeSubscrip(item, index)
				}
			},
			
			closeFriend (item, index) {
				closeTempChannelByFriendId(this.userInfo.id, item.id).then((res) => {
					if (res.status) {
						this.removeActiveListByIndex(index)
					}
				})
			},
			closeChannel (item, index) {
				closeTempChannelByGroupId(this.userInfo.id, item.id).then((res) => {
					if (res.status) {
						this.removeActiveListByIndex(index)
					}
				})
			},
			closeSubscrip (item, index) {
				closeTempChannelByGroupId(this.userInfo.id, item.id).then(res => {
					if (res.status) {
						this.removeActiveListByIndex(index)
					}
				})
			},
			// 消息过长
			formatMessage (val) {
				let sender = ''
				let text = val.lastPostContent
				let str = ''
				// 如果text是对象
				if (text && typeof text === 'object') {
					str += text.title
					for (let key in text.details) {
						str += ',' + key + ':' +text.details[key] 
					}
					if (str.length > 20) {
						str = str.substring(0, 19) + '...'
					}
				} else {
					let text1 = null
					try {
						// 如果text是JSON字符串，那么不会报错，转为对象，执行以下代码
						text = JSON.parse(text)
						if (typeof text === 'object') {
							str += text.title
							for (let key in text.details) {
								str += ',' + key + ':' +text.details[key] 
							}
							if (str.length > 20) {
								str = str.substring(0, 19) + '...'
							}
						} else {
							// 如果text是数字，JSON.parse('1')或JSON.parse(1)的结果也会是数字1
							if (val.type === USER_TYPE.GROUP && val.lastSender) {
								sender = val.lastSender
								str = sender + ': '
							}
							if (text && text.length > 20) {
								str += text.substring(0, 19) + '...'
							} else {
								str += text ? text : ' '
							}
						}
					} catch (e) {
						// 如果text是普通字符串，会报错，执行以下代码
						if (val.type === USER_TYPE.GROUP && val.lastSender) {
							sender = val.lastSender
							str = sender + ': '
						}
						if (text && text.length > 20) {
							str += text.substring(0, 19) + '...'
						} else {
							str += text ? text : ' '
						}
					}
				}
				return str
			},
			
			utc2gmt (utc_datetime) {
				// 转为正常的时间格式 年-月-日 时:分:秒
				if (!utc_datetime) {
					return ''
				}
				var T_pos = utc_datetime.indexOf('T');
				var Z_pos = utc_datetime.indexOf('Z');
				var year_month_day = utc_datetime.substr(0,T_pos);
				var hour_minute_second = utc_datetime.substr(T_pos+1,Z_pos-T_pos-1);
				var new_datetime = year_month_day+" "+hour_minute_second; // 2017-03-31 08:02:06
		 
				// 处理成为时间戳
				timestamp = new Date(Date.parse(new_datetime));
				timestamp = timestamp.getTime();
				timestamp = timestamp/1000;
		 
				// 增加8个小时，北京时间比utc时间多八个时区
				var timestamp = timestamp+8*60*60;
		 
				// 时间戳转为时间
				var beijing_datetime = new Date(parseInt(timestamp) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
				return beijing_datetime; // 2017-03-31 16:02:06
			},
			
			// 格式化时间
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
					let day = dayjs(val).format('YYYY-MM-DD')
					let day1 = day
					if ( day === this.nowDate) {
						day1 = dayjs(val).format('HH:mm')
					}
					return day1
				}
			},
			// 搜索框搜索
			filterList (value) {
				// 不区分大小写进行比较
				let val = value.detail.value.toLowerCase()
				if (val) {
					this.displayList = this.activeList.filter(item => item.name.toLowerCase().indexOf(val) >= 0)
				} else {
					this.displayList = this.activeList
				}
			},
			
			
			// 打开气泡菜单
			openMenu () {
				this.showMask = true
				this.menuStatus = true
				this.mask = true
				// this.$refs.rtBubble.toggle()
			},
			// 点击气泡菜单
			tapPopupMenu () {
				this.newGroupShow = true
				this.menuStatus = false
			},
			// 关闭创建群聊对话框
			hideNewGroupShow () {
				this.newGroupShow = false
				this.menuStatus = false
				this.mask = false
			},
			// 通讯录
			openAddress () {
				uni.navigateTo({
					url: './addressList'
				})
			},
			// 选择好友
			selectFirends () {
				if (this.groupChatForm.userIdList.length > 0) {
					this.$store.dispatch('setSelectFirend', this.groupChatForm.selectUser)
				}
				uni.navigateTo({
					url: './selectFriend?backFlag=true'
				})
			},
			// 选择好友页面结束后设置好友数据
			setNewUser (val) {
				this.groupChatForm.userNameList = val.userNameList.join(',')
				this.groupChatForm.userIdList = val.userIdList
				this.groupChatForm.selectUser = val.userList // 用于第二次编辑时初始化的数据
				this.$store.dispatch('cleanSelectFirend')
			},
			// 关闭各种窗口
			closeMenu () {
				if (this.menuStatus) {
					// 关闭气泡菜单
					this.menuStatus = false
				} else if (this.addGroupShow) {
					this.addGroupShow = false
				} else if (this.newGroupShow) {
					this.newGroupShow = false
				}
			},
			// 创建群聊
			handleCreatGroup () {
				let form = this.groupChatForm
				creatGroup({
					channelName: form.channelName,
					channelHeader: form.channelHeader,
					channelDescription: form.channelDescription,
					userId: this.userInfo.id,
					userIdList: form.userIdList
				}).then((res) => {
					console.log('创建聊天群',res)
					if (res.status) {
						uni.showToast({
							title: '聊天群创建成功',
							duration: 1000,
							icon: 'none'
						})
						// this.$message('聊天群创建成功')
						this.closeMenu()
						// 创建成功后直接跳转聊天
						
						let item = {
							unReadMsg: 0
						}
						
						let newGroupInfo = res.data
						let channelId = newGroupInfo.id
						uni.setStorageSync('newGroupInfo', res.data)
						uni.showLoading({
							title: '加载中'
						})
						uni.navigateTo({
							url: './groupChat?type=' + USER_TYPE.GROUP + '&createGroupChat=' + 'true'
						})
					} else {
						this.$message('聊天群创建失败')
					}
				})
			},
			// 点击聊天框进入聊天页面，分为三种情况
			click2Active (item, index) {
				
				uni.showLoading({
					title: '加载中'
				})
				this.rowSelected = item
				if (item.type === USER_TYPE.FRIEND) {
					this.clickFriend(item)
				} else if (item.type === USER_TYPE.GROUP) {
					this.clickGroup(item)
				} else {
					this.clickSubscrip(item)
				}
			},
			clickFriend (item) {
				item.unReadMsg = 0
				this.openChat(USER_TYPE.FRIEND, item)
			},
			clickGroup (item) {
				item.unReadMsg = 0
				this.openChat(USER_TYPE.GROUP, item)
			},
			clickSubscrip (item) {
				item.unReadMsg = 0
				uni.setStorageSync('subscribeItem', item)
				uni.navigateTo({
					url: './subscribe'
				})
			},
			// 聊天
			openChat (type, item) {
				if (type === USER_TYPE.GROUP) {
					uni.setStorageSync('groupChatItem', item)
					uni.navigateTo({
						url: './groupChat?type=' + type
					})
				} else {
					uni.setStorageSync('chatItem', item)
					uni.navigateTo({
						url: './chat?type=' + type
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.message-layout {
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
		
		.navigate-bar {
			display: flex;
			justify-content: space-between;
			width: 100%;
			background-color: #08B7FF;
			padding: 20rpx 15rpx;
			.my-icon-image {
				height: 40rpx;
				width: 40rpx;
			}
			.text {
				height: 40rpx;
				color: #FFFFFF;
			}
			.menu-icon-image {
				height: 40rpx;
				width: 40rpx;
			}
		}
		.search-bar {
			margin-top: calc(var(--status-bar-height) + 100rpx);
			// margin-top: 20rpx;
			margin-bottom: -5rpx;
			.tui-searchbox {
				width: 100%;
				padding: 0rpx 12rpx 0rpx 12rpx;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: center;
				position: relative;
				margin-top: 163rpx;
				margin-bottom: 3rpx;
			}
			
			.tui-search-input {
				width: 100%;
				background-color: #e9e9e9;
				border-radius: 36rpx;
				font-size: 30rpx;
				color: #A8ABB8;
				display: flex;
				align-items: center;
				padding-left: 10rpx;
				height: 70rpx;
				
				// >input {
				// 	border-bottom: solid 2rpx #e5e5e5;
				// 	height: 120rpx;
				// 	padding: 0 192rpx;
				// 	font-size: 31rpx;
				// }
			}
			
			.tui-search-text {
				padding-left: 26rpx;
				width: 100%;
			}
		}
		.message-list {
			overflow-x: hidden;
			.message {
				display: flex;
				// padding:  30rpx 30rpx 30rpx 0;
				padding: 19rpx 28rpx 17rpx 30rpx;
				margin-top: 17rpx;
				background-color: #ffffff;
				width: 100%;
				margin-left: 17rpx;
				margin-right: 17rpx;
				.head-image {
					background-color: #06b6ff;
					// height: 80rpx;
					height: 102rpx;
					min-width: 102rpx;
					// margin:0 20rpx;
					margin-right: 27rpx;
				}
				.text-part {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					width: 100%;
					.top {
						display: flex;
						justify-content: space-between;
						align-items: baseline;
						.active-title {
							// line-height: 28rpx;
							// font-size: 28rpx;
							font-family: SourceHanSansSC-Regular;
							font-size: 35rpx;
							// font-weight: 700;
							color: #000000;
						}
						.active-time {
							// color: #999;
							// font-size: 24upx;
							// line-height: 28upx;
							font-family: ArialMT;
							font-size: 24rpx;
							color: #999999;
						}
					}
					.bottom {
						display: flex;
						justify-content: space-between;
						align-items: baseline;
						.active-text {
							// color: #999;
							// font-size: 24rpx;
							// line-height: 28rpx;
							font-family: SourceHanSansSC-Regular;
							font-size: 25rpx;
							color: #8c8c8c;
						}
						.active-times-layout {
							position: relative;
							.active-times {
								
								padding: 7rpx;
								// height: 24rpx;
								height: 31rpx;
								min-width: 31rpx;
								color: #FFFFFF;
								font-size: 24rpx;
								line-height: 28rpx;
								background-color: #fa213b;
								border-radius: 100rpx;
								text-align: center;
							}
						}
					}
				}
			}
		}
		
		.tui-modal-custom {
			text-align: center;
			.tui-prompt-title {
				padding-bottom: 20rpx;
				font-size: 34rpx;
			}
			.modal-form-item {
				display: flex;
				.tui-modal-input {
					width: 80%;
					border-bottom: 1rpx solid #e6e6e6;
					margin: 30rpx auto 50rpx;
					font-size: 32rpx;
				}
				.modal-form-item-label {
					margin-rigth: 15rpx;
					position: relative;
					width: 100rpx;
				}
				.modal-form-item-label>view {
					position: absolute;
					top: 25%;
				}
			}
		}
	}
	.bubble-popup-item {
		$imageSize:20px;
		height: 60rpx;
		text-align: center;
		font-weight: 900;
		display: flex;
		padding: 10rpx;
		.icon {
			height: $imageSize;
			width:  $imageSize;
		}
	}
</style>
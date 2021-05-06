<template>
	<view class="addressClass">
		
		<view>
			<view class="navbar">
				<view class="nav-handle-left">
					<view class="handle-type">
						<image class="my-icon-image" style="height:32rpx;width: 32rpx;" @tap="navBack"  src="@/static/back.png"></image>
					</view>
				</view>
				<view class="nav-title">
					<text>通讯录</text>
				</view>
				<view class="nav-handle-right">
				</view>
			</view>
			<view class="address-list-bar">
				<tui-tabs style="width:100vw;" :tabs="navbar" :currentTab="currentTab" @change="change" bgColor="#1891FF" bottom="6rpx" :sliderWidth="150"
				 :sliderHeight="3" sliderBgColor='#ffffff' color="#ffffff" selectedColor="#ffffff" itemWidth="50%"></tui-tabs>
			</view>
		</view>
		
		<view class="bgColor"></view>
		
		<view class="body">
			<view class="search-bar">
				<view class="tui-searchbox">
					<view class="tui-search-input">
						<icon style="margin-left:20rpx;" type="search" size='15' color='#999'></icon>
						<input class="tui-search-text" placeholder="搜索" v-model="filter" @input="filterList" :adjust-position="false"/>
					</view>
				</view>
			</view>
			
			<view class="friendList">
				<view class="item" v-for="(item,index) in addressList" :key="index" @tap="clickItem(item)">
					<view class="cu-avatar lg round margin-left headImage">{{item.name[0]}}</view>
					<view class="userName">{{item.name}}</view>
				</view>
			</view>
		</view>
		<template v-if="loading">
			<tui-loading></tui-loading>
		</template>
	</view>
</template>

<script>
	import {
		mapActions,
		mapGetters
	} from 'vuex'
	import tuiTabs from "@/components/thorui/tui-tabs/tui-tabs"
	import {
		deepCopy,
		objInArray
	} from '@/common/util/util.js'
	import {
		getFriendChannelId,
		getChatHistory,
		createTempChannel,
		getGroupMember
	} from '@/api/imApi/admin.js'
	import {
		USER_TYPE
	} from '@/common/dic'
	import {
		convertFriendInfo
	} from '@/common/util/convertUtils.js'
	import tuiLoading from '@/components/thorui/tui-loading/tui-loading.vue'
	export default {
		components: {
			tuiLoading,
			tuiTabs
		},
		data() {
			return {
				navbar: [{
					name: "好友",
					value: 'friend'
				}, {
					name: "群聊",
					value: 'group'
				}],
				filter: '',
				currentTab: 0,
				tabValue: 'friend',
				friendList: [], // 好友
				// 包含全部好友信息，因为好友信息太多，所以只显示一部分好友信息，上拉显示更多好友
				friendListBackup: [],
				groupList: [], // 群组
				addressList: [],
				rowSelected: null,
				loading: false,
				friendPage: {
					pageSize: 50,
					pageNumber: 0
				}
			}
		},
		onReachBottom () {
			if (!this.currentTab) {
				this.friendPage.pageNumber++
				let end = this.friendPage.pageSize * (this.friendPage.pageNumber + 1) > this.friendListBackup.length ? this.friendListBackup.length : this.friendPage.pageSize * (this.friendPage.pageNumber + 1)
				this.friendList = this.friendListBackup.slice(0, end)
				this.addressList = this.friendList
			}
		},
		onLoad() {
			this.loading = true
			this.$store.dispatch('GetUser', ['friendInfo', 'channelInfo']).then(res => {
				this.friendListBackup = res['friendInfo']
				this.friendList = this.friendListBackup.slice(0, this.friendPage.pageSize)
				this.groupList = res['channelInfo']
				this.addressList = this.friendList
				this.loading = false
			})
		},
		computed: {
			...mapGetters(['activeList', 'userInfo'])
		},
		methods: {
			...mapActions([
				'setMessageRoom',
				'setMessage',
				'setActiveListByObj',
				'setChatInfo',
			]),
			
			navBack () {
				uni.navigateBack()
			},
			change(e) {
				this.currentTab = e.index
				this.tabValue = this.navbar[this.currentTab].value
				this.friendList = this.friendListBackup.slice(0, this.friendPage.pageSize)
				this.addressList = !this.currentTab ? this.friendList : this.groupList
				this.filter = ''
			},
			// 搜索
			filterList(value) {
				let val = value.detail.value
				let arr = !this.currentTab ? this.friendListBackup : this.groupList
				if (val) {
					this.addressList = arr.filter(item => item.name.indexOf(val) >= 0)
				} else {
					this.addressList = arr
				}
			},
			clickItem (item) {
				if (this.currentTab === 0) {
					// 如果是点击通讯录的好友
					this.clickFriend(item)
				} else {
					// 如果是点击通讯录的群聊
					this.clickGroup(item)
				}
			},
			// 点击人名
			clickFriend(item) {
				uni.showLoading({
					title: '加载中'  
				})
				item.unReadMsg = 0
				uni.setStorageSync('chatItem', item)
				uni.navigateTo({
					url: './chat?type=' + USER_TYPE.FRIEND
				})
			},
			clickGroup (item) {
				uni.showLoading({
					title: '加载中'  
				})
				item.unReadMsg = 0
				uni.setStorageSync('groupChatItem', item)
				uni.navigateTo({
					url: './groupChat?type=' + USER_TYPE.GROUP
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #08B7FF;
	}

	.addressClass {
		padding-bottom: 146rpx;
		.navbar {
				display: flex;
				justify-content: space-between;
				height: calc(var(--status-bar-height) + 92rpx);
				background: #1891ff;
				padding-top: calc(var(--status-bar-height) + 25rpx);
				width: 100%;
				z-index: 100;
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
		
		
		height: 100%;
		.bgColor {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			// background: linear-gradient(top, #06b6ff, #f5f5f5 28%);
			background-color: #F5F5F5;
			z-index: -1;
		}
		
		.address-list-bar {
			position: fixed;
			z-index: 80;
			margin-top: calc(var(--status-bar-height) + 90rpx);
		}
		
		.body {
			padding-top: calc(var(--status-bar-height) + 170rpx);
			z-index: 5;
			.search-bar {
				margin-bottom: -5rpx;
				.tui-searchbox {
					width: 100%;
					padding: 0rpx 12rpx 0rpx 12rpx;
					box-sizing: border-box;
					display: flex;
					align-items: center;
					justify-content: center;
					position: relative;
					margin-top: 13rpx;
					margin-bottom: 20rpx;
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
		}

		.friendList {
			.headImage {
				margin: 20upx;
				// padding: 10upx 0;
				height: 80upx;
				width: 80upx;
				background-color: #06b6ff;
			}

			.item {
				background: #FFFFFF;
				display: flex;
				margin-bottom: 17rpx;
				margin: {
					left: 30rpx;
					right: 30rpx;
				}
				.userName {
					margin-top: 20upx;
					font-size: 35upx;
					line-height: 80upx;
				}
			}
		}
	}
</style>

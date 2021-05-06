<template>
	<view class="selectFirend">
		
		<view class="navbar">
			<view class="nav-handle-left">
				<view class="handle-type">
					<image class="my-icon-image" style="height:32rpx;width: 32rpx;" @tap="navBack"  src="@/static/back.png"></image>
				</view>
			</view>
			<view class="nav-title">
				<text>选择好友</text>
			</view>
			<view class="nav-handle-right" @tap="submit">
				<view class="font">确定</view>
			</view>
		</view>
		
		<view class="body">
			<view class="search-bar">
				<view class="tui-searchbox">
					<view class="tui-search-input">
						<icon style="margin-left:20rpx;" type="search" size='15' color='#999'></icon>
						<input class="tui-search-text" placeholder="搜索" v-model="filter" @input="filterList"/>
					</view>
				</view>
			</view>
			<view class="firendList" v-if="showFriendList">
				<block v-for="(item,index) in addressList" :key="index">
					<view class="item" @click="clickName(item)">
						<view class="cu-avatar lg round margin-left bg-blue headImage">{{item.name[0]}}</view>
						<view class="userName">{{item.name}}</view>
						<template v-if="item.selectStatus">
							<view class="select-icon" ><text class="cuIcon-roundcheckfill text-green"></text></view>
						</template>
					</view>
				</block>
			</view>
		</view>
		<template v-if="loading">
			<tui-loading></tui-loading>
		</template>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		pullFriendToGroup
	} from '@/api/imApi/admin.js'
	import {
		objInArray
	} from '@/common/util/util.js'
	import tuiLoading from '@/components/thorui/tui-loading/tui-loading.vue'
	export default {
		components: {
			tuiLoading
		},
		data() {
			return {
				addressList: [],
				allAddressList: [], // 显示的人员列表
				selectUser: [], // 已选人员
				backFlag: false, // 是否需要返回数据
				filter: [],
				showFriendList: true,
				loading: false,
				page: {
					pageSize: 50,
					pageNumber: 0
				},
				friendInfo: []
			}
		},
		onNavigationBarButtonTap (e) {
			console.log(e.index)
			if (e.index === 0) {
				// 如果点击确定
				this.submit()
			}
		},
		onLoad(obj) {
			this.loading = true
			this.backFlag = obj.backFlag === 'true'
			this.$store.dispatch('GetUser', ['friendInfo']).then(res => {
				this.friendInfo = res['friendInfo']
				let end = this.page.pageSize * (this.page.pageNumber + 1)
				this.addressList = res['friendInfo'].slice(0, end)
				this.allAddressList = res['friendInfo']
			})
		},
		onReachBottom () {
			this.page.pageNumber++
			let end = this.page.pageSize * (this.page.pageNumber + 1) > this.friendInfo.length ? this.friendInfo.length : this.page.pageSize * (this.page.pageNumber + 1)
			this.addressList = this.friendInfo.slice(0, end)
		},
		onReady() {
			if(this.backFlag && this.selectFirend.length>0){
				// 创建时选择好友第二次进入初始化上一次的选择
				this.selectUser = this.selectFirend
				this.selectFirend.forEach(item=>{
					let user = this.addressList.find(val => val.id === item.id)
					if (user) {
						user.selectStatus = true
					}
				})
			}
			if(!this.backFlag){
				this.selectUser = this.chatInfo.channelUserInfo
				this.chatInfo.channelUserInfo.forEach(item => {
					// this.selectUser.push(item.id)
					let user = this.addressList.find(val => val.id === item.id)
					if (user) {
						user.selectStatus = true
					}
				})
			}
			this.loading = false
		},
		computed: {
			...mapGetters(['chatInfo','selectFirend'])
		},
		methods: {
			navBack () {
				uni.navigateBack()
			},
			// 点击选择
			clickName(item) {
				if (item.id) {
					if (objInArray(item, this.selectUser)) {
						// 已选的删除
						item.selectStatus = false
						this.selectUser = this.selectUser.filter(user => user.id != item.id)
					} else {
						// 加入已选
						item.selectStatus = true
						this.selectUser.push(item)
					}
				}
				this.showFriendList = false
				this.showFriendList = true
			},
			// 搜索
			filterList(value) {
				let val = value.detail.value
				let arr = this.allAddressList
				if (val) {
					this.addressList = arr.filter(item => item.name.indexOf(val) >= 0)
				} else {
					this.addressList = arr
				}
			},
			// 提交
			submit() {
				let idArr = []
				this.selectUser.forEach(item => {
					idArr.push(item.id)
				})
				let nowPage = getCurrentPages(); // 当前页面
				let beforePage = nowPage[nowPage.length - 2]; // 前一个页面
				if (this.backFlag) {
					let nameList = []
					this.selectUser.forEach(item => {
						nameList.push(item.name)
					})
					let selectUser = this.selectUser
					uni.navigateBack({
						success: function() {
							// 调用前一个页面刷新用户
							beforePage.$vm.setNewUser({
								userNameList: nameList,
								userIdList: idArr,
								userList: selectUser
							})
						}
					})
				} else {
					// 邀请好友
					pullFriendToGroup({
						channelId: this.chatInfo.channelId,
						creatorId: this.chatInfo.objectInfo.creatorId,
						userIdList: idArr
					}).then((res) => {
						if (res.status) {
							uni.navigateBack({
								success: function() {
									// 调用前一个页面刷新用户
									beforePage.$vm.flashGroupUser();
								}
							})
						} else {
							this.$message('邀请失败')
						}
					})
				}

			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #f5f5f5;
	}

	.selectFirend {
		height: 100%;

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
					line-height: 35rpx;
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
					
					.font {
						font-size: 38rpx;
						line-height: 22rpx;
						color: #ffffff;
					}
				}
			}	
		.tab-title {
			display: flex;
			justify-content: space-between;
			color: #fff;
			padding: 20upx 0upx;

			.text {
				font-size: 32upx;
				letter-spacing: 1px;
			}

			.seach-image {
				height: 30upx;
				width: 30upx;
				position: relative;
				bottom: -8upx;
			}
		}

		.body {
			.search-bar {
				margin-top: calc(var(--status-bar-height) + 110rpx);
				margin-bottom: -5rpx;
				.tui-searchbox {
					width: 100%;
					padding: 0rpx 12rpx 0rpx 12rpx;
					box-sizing: border-box;
					display: flex;
					align-items: center;
					justify-content: center;
					position: relative;
				}
				
				.tui-search-input {
					width: 100%;
					height: 52rpx;
					background-color: #e9e9e9;;
					border-radius: 36rpx;
					font-size: 30rpx;
					color: #A8ABB8;
					display: flex;
					align-items: center;
					padding-left: 10rpx;
					height: 70rpx;
				}
				
				.tui-search-text {
					padding-left: 16rpx;
					width: 100%;
				}
			}
			.search-input {
				// margin-top: 20upx;
				border-radius: 3px;
				height: 60upx;
				width: 100%;
				background: #FFFFFF;
			}
		}

		.firendList {
			.headImage {
				margin: 20upx;
				// padding: 10upx 0;
				height: 80upx;
				width: 80upx;
			}

			margin-top: 10upx;

			.item {
				margin: 20rpx;
				background: #FFFFFF;
				display: flex;
				// margin-bottom: 10upx;

				.userName {
					margin-top: 20upx;
					font-size: 35upx;
					line-height: 80upx;
					width: 75%;
				}

				.select-icon {
					// line-height: 80upx;
					padding-top: 20upx;
					font-size: 40upx;
				}
			}
		}
	}
</style>

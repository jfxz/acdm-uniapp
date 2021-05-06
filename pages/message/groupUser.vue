<template>
	<view class="groupUserClass">
		
		<view class="navbar">
			<view class="nav-handle-left">
				<view class="handle-type">
					<image class="my-icon-image" style="height:32rpx;width: 32rpx;" @tap="navBack"  src="@/static/back.png"></image>
				</view>
			</view>
			<view class="nav-title">
				<text>查看群成员</text>
			</view>
			<view class="nav-handle-right">
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
			<view class="friendList">
				<view class="item" v-for="(item,index) in displayList" :key="index" @tap="selectUser(item)">
					<!-- <image class="headImage" src="../../static/ic_up.png"></image> -->
					<view class="cu-avatar lg round margin-left bg-blue headImage">{{item.userName[0]}}</view>
					<view class="userName">{{item.userName}}</view>
				</view>
			</view>
		</view>
		<template v-if="loading">
			<tui-loading></tui-loading>
		</template>
	</view>
</template>

<script>
	import { getGroupMember, exitGroup, disbanGroup } from '@/api/imApi/admin.js'
	import { convertFriendInfo } from '@/common/util/convertUtils.js'
	import {deepCopy} from '@/common/util/util.js'
	import tuiLoading from '@/components/thorui/tui-loading/tui-loading.vue'
	export default {
		components: {
			tuiLoading
		},
		data() {
			return {
				channelId:'',
				displayList:[],
				userList:[],
				backFlag: false,
				loading: false,
				filter: ''
			}
		},
		onLoad(obj){
			this.loading = true
			this.channelId = obj.channelId
			this.backFlag = obj.backFlag === 'true'
			getGroupMember(this.channelId).then(res => {
			  if (res.status) {
			    this.userList = res.data
				this.displayList = deepCopy(this.userList)
				this.loading = false
			  }
			})
		},
		methods: {
			// 搜索
			filterList(value) {
				let val = value.detail.value
				let arr = this.userList
				if (val) {
					this.displayList = arr.filter(item=> item.userName.indexOf(val) >= 0)
				} else {
					this.displayList = arr
				}
			},
			// 点击用户
			selectUser(item){
				if(this.backFlag){
					let nowPage = getCurrentPages()
					let beforePage = nowPage[nowPage.length - 2]
					uni.navigateBack({
						success: function() {
							beforePage.$vm.setAtUser(item)
						}
					})
				}
			},
			navBack () {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #f5f5f5;
	}

	.groupUserClass {
		height: 100%;
		background-color: #f5f5f5;
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
			
		.body {
			.search-bar {
				margin-bottom: -5rpx;
				.tui-searchbox {
					margin-top: calc(var(--status-bar-height) + 110rpx);
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
				margin-top: 20upx;
				border-radius: 3px;
				height: 60upx;
				width: 100%;
				background: #FFFFFF;
			}
		}

		.friendList {
			.headImage {
				margin: 20upx;
				// padding: 10upx 0;
				height: 80upx;
				width: 80upx;
			}

			margin-top: 10upx;

			.item {
				background: #FFFFFF;
				display: flex;
				margin: 20rpx;
				.userName {
					margin-top: 20upx;
					font-size: 35upx;
					line-height: 80upx;
				}
			}
		}
	}
</style>

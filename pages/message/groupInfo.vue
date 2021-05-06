<template>
	<view class="groupSettingClass">
		
		<view class="navbar">
			<view class="nav-handle-left">
				<view class="handle-type">
					<image class="my-icon-image" style="height:32rpx;width: 32rpx;" @tap="navBack"  src="@/static/back.png"></image>
				</view>
			</view>
			<view class="nav-title">
				<text>聊天设置</text>
			</view>
			<view class="nav-handle-right">
			</view>
		</view>
		
		<view class="card">
			<view style="display: flex;">
				<view class="usersClass">
					<view v-for="(item,index) in userList" :key="index" class="userItem">
						<view class="cu-avatar round bg-blue">{{item.name[0]}}</view>
						<view class="username">{{item.name}}</view>
					</view>
				</view>
				<view style="display:flex;flex-direction: column-reverse;justify-items:flex-end;" @click="loadMoreUsers">
					<image style="height:32rpx;width:32rpx;position:relative;" src="../../static/moreuser.png"></image>
				</view>
			</view>
			<view class="userButton">
				<view style="margin-left: 80upx;font-size: 40upx;" @tap="invitationUser">+ 邀请新成员</view>
				<view style="width: 1px;height: 60upx; background: #000;"></view>
				<view style="margin-right: 75upx;font-size: 40upx;" @tap="groupUserInfo">查看群成员</view>
			</view>
		</view>
		<view class="card" style="margin-top: 0rpx;">
			<view class="form">
				<view class="cu-form-group">
					<view class="title">群名称</view>
					<view class="word">{{chatInfo.objectInfo.name}}</view>
				</view>
				<view class="cu-form-group">
					<view class="title">群号码</view>
					<view class="word">{{chatInfo.objectInfo.channelId}}</view>
				</view>
				<view class="cu-form-group">
					<view class="title">创建日期</view>
					<view class="word">{{formatTime(chatInfo.objectInfo.createTime)}}</view>
				</view>
				<view class="cu-form-group">
					<view class="title">群介绍</view>
					<view class="word">{{chatInfo.objectInfo.description}}</view>
				</view>
			</view>
		</view>
		<button style="border-radius: 5px;background: red;color:#FFFFFF;margin-top: 20upx;" v-if="creator" @tap="disbandGroup">解散群聊</button>
		<button style="border-radius: 5px;background: red;color:#FFFFFF;margin-top: 20upx;" v-if="!creator" @tap="exitGroup">退出群聊</button>
	</view>
</template>

<script>
	import { mapActions, mapGetters } from 'vuex'
	import { getGroupMember, exitGroup, disbanGroup } from '@/api/imApi/admin.js'
	import { convertFriendInfo } from '@/common/util/convertUtils.js'
	import dayjs from '@/common/util/dayjs.min.js'
	export default {
		data() {
			return {
				userList: [], 
				groupInfo:{
					name:'下午茶',
					number:'888888888',
					date:'2020-01-01',
					remark:'dddddddddd'
				},
				channelId: '',
				userPageSize: 9
			}
		},
		computed: {
			...mapGetters([
				'chatInfo',
				'userInfo'
			]),
			// 是否为群主
			creator() {
				return this.chatInfo.objectInfo.creatorId === this.userInfo.id
			}
		},
		onLoad(obj){
			this.channelId = obj.channelId
			getGroupMember(this.channelId).then(res => {
			  if (res.status) {
					this.userListBackUp = convertFriendInfo(res.data)
			    // this.userList = convertFriendInfo(res.data)
					this.userList = this.userListBackUp.slice(0, this.userPageSize)
			    this.$store.state.message.chatInfo.channelUserInfo = res.data
				let chatInfo=this.$store.state.message.chatInfo
			    this.setChatInfo(chatInfo)
			  }
			})
		},
		methods: {
			loadMoreUsers () {
				let len = this.userList.length
				let end = (len + this.userPageSize) > this.userListBackUp.length ? this.userListBackUp.length : (len + this.userPageSize)
				this.userList = this.userListBackUp.slice(0, end)
			},
			...mapActions(['setChatInfo','removeChannelInfoByObjId','removeActiveListByObjId']),
			// 邀请好友
			invitationUser(){
				uni.navigateTo({
					url: './selectFriend?backFlag=false'
				})
			},
			// 格式化时间
			formatTime(val){
				if (typeof val !== 'number') {
					try {
						val = val.substr(0, 19).replace(/T/, ' ')
						val = dayjs(val).add(8, 'hour')
					} catch (e) {
						console.log(e)
					}
				}
				return dayjs(val).format('YYYY-MM-DD')
			},
			// 退出群聊
			exitGroup(){
				exitGroup(this.channelId).then((res) => {
				  if (res.status) {
						uni.showToast({
							title: '成功退出群聊',
							duration: 1000,
							icon: 'none'
						})
				    // this.$message('成功退出群聊')
				    this.removeChannelInfoByObjId(this.chatInfo.objectInfo.id)
				    this.removeActiveListByObjId(this.chatInfo.objectInfo.id)
					uni.switchTab({
						url: './index'
					})
				  } else {
						uni.showToast({
							title: '退出群聊失败',
							duration: 1000,
							icon: 'none'
						})
				    // this.$message('退出群聊失败')
				  }
				})
			},
			// 解散群聊
			disbandGroup(){
				disbanGroup(this.channelId).then((res) => {
				  if (res.status) {
						uni.showToast({
							title: '成功解散群聊',
							duration: 1000,
							icon: 'none'
						})
				    // this.$message('成功解散群聊')
				    this.removeChannelInfoByObjId(this.chatInfo.objectInfo.id)
				    this.removeActiveListByObjId(this.chatInfo.objectInfo.id)
					uni.switchTab({
						url: './index'
					})
				  } else {
						uni.showToast({
							title: '解散群聊失败',
							duration: 1000,
							icon: 'none'
						})
				    // this.$message('解散群聊失败')
				  }
				})
			},
			navBack () {
				uni.navigateBack()
			},
			// 查看群成员
			groupUserInfo(){
				uni.navigateTo({
					url: './groupUser?channelId='+this.channelId
				})
			},
			// 邀请完成后刷新成员列表
			flashGroupUser(){
				console.log('back OK')
				getGroupMember(this.channelId).then(res => {
				  if (res.status) {
				    this.userList = convertFriendInfo(res.data)
				    this.$store.state.message.chatInfo.channelUserInfo = res.data
				    this.setChatInfo(this.chatInfo)
				  }
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #4191EA;
	}

	.groupSettingClass {
		
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
		
		
		
		padding-bottom: 146rpx;
		
		// padding: 0 20upx;

		.card {
			margin: 20rpx;
			padding: 30rpx 30rpx;
			margin-top: calc(var(--status-bar-height) + 100rpx);
			background: #FFFFFF;
			border-radius: 5px;
		}

		.usersClass {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;

			.userItem {
				margin-right: 10upx;

				.username {
					text-align: center;
					font-size: 24upx;
					text-overflow: ellipsis;
					width: 75upx;
					white-space: nowrap;
					overflow: hidden;
				}
			}
		}
		.userButton{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
		}
		.form {
			.title{
				font-size: 32upx;
			}
			.word{
				color: #BEBEBE;
			}
		}
	}
</style>

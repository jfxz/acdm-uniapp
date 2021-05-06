<template>
	<view>
		<u-navbar
			back-icon-color="#ffffff"
		  title="引导单历史消息"
			title-color="#ffffff"
		 :background="background">
		</u-navbar>
		
		<view class="msg-list">
			<block v-for="msg in msgList" :key="msg.id">
				<view class="msg-card">
					<view class="top">
						<view class="value">
							{{msg.sender}}
						</view>
						<view class="value">
							{{formatTime(msg.createTime)}}
						</view>
					</view>
					<view class="center">
						<view style="display: flex;align-items: baseline;">
							<view class="label">
								备注:
							</view>
							<view class="value">
								{{msg.msgObj.remark}}
							</view>
						</view>
					</view>
					<view class="bottom">
						<block v-for="image in msg.msgObj.images" :key="image.index">
							<image
							  :src="image.url"
								@tap="showImage(image)">
							</image>
						</block>
					</view>
				</view>
			</block>
		</view>
		
	</view>
</template>

<script>
	import dayjs from '@/common/util/dayjs.min.js'
	import {
		onError,
		getRole,
		getGuideMessages
	} from '@/api/guide/index.js'
	export default {
		data () {
			return {
				msgList: [],
				// msgList: [{
				// 	msgObj: {
				// 		remark: 'hh',
				// 		images: [{
				// 			index: 0,
				// 			url: '/static/cabin.png'
				// 		}, {
				// 			index: 1,
				// 			url: '/static/cabin.png'
				// 		}]
				// 	}
				// }],
				background: {
					'background-color': '#4191EA'
				}
			}
		},
		mounted () {
			this.getGuideMessages()
		},
		methods: {
			formatTime (time) {
				return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
			},
			showImage (item) {
				uni.previewImage({
					urls: [item.url]
				})
			},
			getGuideMessages () {
				uni.showLoading({
					title: '加载中'
				})
				let userName = uni.getStorageSync('user_name_sub')
				let userRole = getRole()
				getGuideMessages({
					userName: userName,
					userRole: userRole
				}).then(res => {
					console.log('getGuideMessages-res', res)
					if (res.status) {
						this.msgList = res.data
						this.msgList.forEach(msg => {
							if (msg.sendContext) {
								msg.msgObj = JSON.parse(msg.sendContext)
								let imageUrls = msg.msgObj.picUrls.split(',')
								if (imageUrls && imageUrls.length > 0) {
									msg.msgObj.images = []
									for (let i = 0; i < imageUrls.length; i++) {
										msg.msgObj.images.push({
											index: i,
											url: imageUrls[i]
										})
									}
								}
							}
						})
					}
					uni.showToast({
						title: res.message,
						icon: 'none',
						duration: 2000
					})
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.msg-list {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 16rpx;
		.msg-card {
			width: calc(100% - 60rpx);
			background-color: #ffffff;
			height: 200rpx;
			border-radius: 25rpx;
			padding: 10rpx 20rpx;
			margin-bottom: 10rpx;
			.label {
				font-family: SourceHanSansSC-Regular;
				font-size: 28rpx;
				color: #a6a6a6;
				margin-right: 15rpx;
			}
			.value {
				font-family: Roboto-Regular;
				font-weight: 700;
				font-size: 28rpx;
				color: #595959;
			}
			.top {
				display: flex;
				justify-content: space-between;
			}
			.center {
				padding-top: 10rpx;
				display: flex;
			}
			.bottom {
				margin-top: 10rpx;
				display: flex;
				image {
					width: 87rpx;
					height: 87rpx;
					margin-right: 20rpx;
				}
			}
		}
	}
</style>

<template>
	<view>
		<nav-bar
			 title="消息"
			:content-not-null="true">
			<template v-slot:right>
				<view></view>
			</template>
		</nav-bar>
		
		<view class="messages">
			<block v-for="(msg, index) in messages" :key="msg.id">
				<view class="message-card" @tap="changeShow(msg)">
					<view v-if="!msg.show" class="message-hide">
						<image src="@/static/closeoff-mail.png" class="mail"></image>
						<view class="message-text">
							{{msg.messageText}}
						</view>
						<image src="@/static/down-arror.png" class="down-arror"></image>
					</view>
					<view v-if="msg.show" class="message-show">
						<image src="@/static/closeoff-mail.png" class="mail"></image>
						<view class="message-text">
							{{msg.messageText}}
						</view>
						<image src="@/static/down-arror.png" class="up-arror"></image>
					</view>
				</view>
			</block>
		</view>
		
	</view>
</template>

<script>
	import navBar from '@/pages/cargo/leaveport/components/nav-closeoff-bar.vue'
	import { getCloseoffMessage } from '@/api/cargo/index.js'
	export default {
		data () {
			return {
				messages: []
			}
		},
		
		mounted () {
			this.getMessages()
		},
		
		components: {
			navBar
		},
		methods: {
			getMessages () {
				let userId = uni.getStorageSync('user_id')
				if (!userId) {
					return
				}
				getCloseoffMessage({
					userId: userId,
					isRead: 2
				}).then(res => {
					console.log('getCloseoffMessage-res', res)
					if (res.status) {
						this.messages = res.data
					}
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
			},
			changeShow (msg) {
				if (msg.show) {
					msg.show = !msg.show
					return
				}
				this.messages.forEach(e => e.show = false)
				let message = this.messages.find(e => e.id === msg.id)
				if (message) {
					message.show = true
					this.$forceUpdate()
				}
			} 
		}
	}
</script>

<style lang="scss" scoped>
	.messages {
		margin: 20rpx 20rpx 0 20rpx;
		.message-card {
			background-color: #ffffff;
			margin-bottom: 20rpx;
			padding: 10rpx 20rpx;
			border-radius: 15rpx;
			font-size: 35rpx;
			font-weight: bold;
			.message-hide {
				display: flex;
				align-items: center;
				.mail {
					width: 40rpx;
					height: 40rpx;
					margin-right: 10rpx;
				}
				.down-arror {
					width: 40rpx;
					height: 40rpx;
				}
				.message-text {
					width: calc(100% - 100rpx);
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}
			
			.message-show {
				display: flex;
				.mail {
					width: 40rpx;
					height: 40rpx;
					margin-right: 10rpx;
				}
				.up-arror {
					width: 40rpx;
					height: 40rpx;
					transform: rotate(180deg);
					align-self: flex-end;
				}
				.message-text {
					width: calc(100% - 100rpx);
				}
			}
		}
	}
	
</style>

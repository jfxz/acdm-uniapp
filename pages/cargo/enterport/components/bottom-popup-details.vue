<template>
	<uni-popup ref="popup" type="bottom">
		<view class="popup-bottom" style="padding-left:0;padding-right: 0;">
			<view class="top-bar">
				<view class="cancel-btn" style="margin-left: 75rpx;"></view>
				<view class="title">{{title}}</view>
				<view class="top-bar-image">
					<image @tap="close" src="@/static/close-enterport-grey.png"></image>
				</view>
			</view>
			
			<view class="border-line-top"></view>
			
			<view v-if="showList" class="bottom-popup-details-list">
				<block v-for="item in list" :key="item.id">
					<view class="item">
						<view class="left">
							<template v-if="item.containerType=='0'">
								<image src="@/static/box.png"></image>
							</template>
							<template v-else-if="item.containerType=='1'">
								<image src="@/static/board.png"></image>
							</template>
							<template v-else>
								<image src="@/static/container.png"></image>
							</template>
							
							<view class="label">
								<template v-if="item.containerType=='0'">
									{{'箱号'}}
								</template>
								<template v-else-if="item.containerType=='1'">
									{{'板号'}}
								</template>
								<template v-else>
									{{'集装器号'}}
								</template>
							</view>
						</view>
						
						<view class="right">
							{{item.containerCode}}
						</view>
					</view>
					<view class="border-bottom-line">
					</view>
				</block>
			</view>
		</view>
	</uni-popup>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	export default {
		props: {
			title: {
				type: String,
				default: ''
			}
		},
		components: {
			uniPopup,
			uniPopupMessage,
			uniPopupDialog
		},
		data () {
			return {
				showList: true,
				list: []
			}
		},
		methods: {
			open (list) {
				this.list = list
				this.$refs.popup.open()
			},
			close () {
				this.$refs.popup.close()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.popup-bottom {
		width: 100%;
		background-color: #ffffff;
		padding: 52rpx 32rpx 52rpx 32rpx;
		border-radius: 35rpx 35rpx 0rpx 0rpx;
		.top-bar {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.top-bar-image {
				image {
					width: 52rpx;
					height: 52rpx;
				}
				margin-top: 10rpx;
				margin-right:33rpx;
				height:50rpx;
				width:50rpx;
			}
			.cancel-btn {
				font-family: SourceHanSansSC-Regular;
				font-size: 32rpx;
				letter-spacing: 2rpx;
				color: #a6a6a6;
			}
			.title {
				font-family: SourceHanSansSC-Regular;
				font-size: 38rpx;
				letter-spacing: 2rpx;
				color: #333333;
			}
		}
	}
	
	.border-line-top {
		margin-top: 41rpx;
		width: 100vw;
		height: 1rpx;
		border: solid 1rpx #e5e5e5;
	}
	
	.bottom-popup-details-list {
		padding-bottom: 128rpx;
		.item {
			display: flex;
			justify-content: space-between;
			margin-bottom: 24rpx;
			margin-top: 26rpx;
			align-items: center;
			.left {
				display: flex;
				image {
					width: 54rpx;
					height: 54rpx;
					margin-left: 33rpx;
					margin-right: 17rpx;
				}
				
				.label {
					font-family: SourceHanSansSC-Regular;
					font-size: 29rpx;
					letter-spacing: 1rpx;
					color: #333333;
				}
				
			}
			.right {
				font-family: Roboto-Regular;
				font-size: 29rpx;
				font-weight: normal;
				font-stretch: normal;
				line-height: 21rpx;
				letter-spacing: 1rpx;
				color: #333333;
				margin-right: 33rpx;
			}
		}
		.border-bottom-line {
			width: 100vw;
			height: 1rpx;
			border: solid 1rpx #e5e5e5;
		}
	}
</style>

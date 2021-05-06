<template>
	<view>
		<view class="nav-bar">
			<view class="back-icon" @tap="goback"></view>
			<view class="title">
				{{title}}
			</view>
		</view>
		
		<view class="flight-header-block">
			<image
				class="header-image"
				src="@/static/monitor-time-line-header.png"
			></image>
			<view class="flight-info-block">
				<view class="label">
					集装器号
				</view>
				<view class="value">
					{{container.containerCode}}
				</view>
			</view>
		</view>
		
		
		<view class="column-scroll-block">
			<view class="time-line-card">
				<view class="title">
					运行进度
				</view>
				<view class="timeline-layout">
					<view class="vertical-line"></view>
					<block v-for="(task, index) in container.tasks" :key="task.title">
						<view class="history-block">
							<view class="circle" :style="{'border-color':index==0?'#3386F1':'#d8d8d8'}"></view>
							<view class="history-block-top">
								<view class="history-block-top-time" :style="{color: index==0?'#333333':'#999999'}">
									{{task.operateDate}}
								</view>
								<view class="status" :style="{color: index==0?'#333333':'#999999'}">
									{{task.title}}
								</view>
							</view>
							<view class="history-block-bottom" :style="{color: index==0?'#333333':'#999999'}">
								{{task.desc}}
							</view>
						</view>
					</block>
				</view>
			</view>
			
			<view class="flight-bottom">
				<view class="line" style="margin-right: 15rpx;"></view>
				<span style="margin-right: 20rpx;">
					航班号
				</span>
				<span>
					{{flight}}
				</span>
				<view class="line" style="margin-left: 13rpx;"></view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import { debounce } from '@/common/util/util.js'
	export default {
		data () {
			return {
				title: '货物出港时间线',
				container: {},
				flight: ''
			}
		},
		
		mounted () {
			let container = uni.getStorageSync('timeline')
			if (container) {
				this.container = container
			}
		},
		
		onLoad (e) {
			this.flight = e.flight ? e.flight : ''
		},
		
		methods: {
			goback: debounce(function () {
				uni.navigateBack()
			})
		}
	}
</script>

<style lang="scss">
	.column-scroll-block {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		// min-height: calc(100vh - var(--status-bar-height) - 300rpx);
		max-height: calc(100vh - var(--status-bar-height) - 320rpx);
		overflow-y: auto;
	}
	.nav-bar {
		display: flex;
		background-color: #1891FE;
		align-items: center;
		padding-top: calc(var(--status-bar-height) + 34rpx);
		.back-icon {
			border-top: 4rpx solid #ffffff;
			border-left: 4rpx solid #ffffff;
			height: 30rpx;
			width: 39rpx;
			transform: rotate(315deg);
			position: relative;
			margin-left: 40rpx;
		}
		.nav-btn {
			width: 45rpx;
			height: 35rpx;
			margin-right: 44rpx;
		}
		.title {
			text-align: center;
			width: 100%;
			font-family: SourceHanSansCN-Bold;
			font-size: 38rpx;
			color: #ffffff;
		}
	}
	
	.flight-header-block {
		position: relative;
		.header-image {
			width: 100%;
			height: 191rpx;
		}
		.flight-info-block {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			.label {
				font-family: PingFangSC-Regular;
				font-size: 28rpx;
				color: #ffffff;
				opacity: 0.6;
				margin-bottom: 8rpx;
			}
			.value {
				font-family: SourceHanSansCN-Bold;
				font-size: 38rpx;
				color: #ffffff;
			}
		}
	}
	
	.time-line-card {
		z-index: 99;
		border-radius: 6rpx;
		background-color: #ffffff;
		width: calc(100vw-42rpx);
		margin: 17rpx 17rpx 0 25rpx;
		padding-bottom: 36rpx;
		.title {
			font-family: SourceHanSansCN-Medium;
			font-weight: bold;
			font-size: 35rpx;
			color: #333333;
			padding: 40rpx 0 0 33rpx;
			margin-bottom: 38rpx;
		}
		.timeline-layout {
			position: relative;
			margin-bottom: 12rpx;
			.vertical-line {
				position: absolute;
				top: 37rpx;
				border-left: 1rpx solid #d8d8d8;
				width: 0;
				height: calc(100% - 107rpx);
				left: 183rpx;
			}
			
			.history-block {
				position: relative;
				margin-top: 40rpx;
				.history-block-top {
					display: flex;
					align-items: center;
					padding-left: 39rpx;
					.history-block-top-time {
						font-family: SourceHanSansCN-Regular;
						font-size: 28rpx;
						color: #999999;
						opacity: 0.99;
					}
					.status {
						position: relative;
						margin-left: 85rpx;
						font-weight: bold;
						font-family: SourceHanSansCN-Medium;
						font-size: 35rpx;
						color: #999999;
					}
				}
				.history-block-bottom {
					margin-top: 13rpx;
					padding-left: 235rpx;
					font-family: SourceHanSansCN-Regular;
					font-size: 28rpx;
					color: #999999;
					opacity: 0.99;
				}
			}
		}
	}
	
	.circle {
		position: absolute;
		top: 15rpx;
		left: 183rpx;
		transform: translateX(-50%);
		width: 22rpx;
		height: 22rpx;
		border-radius: 11rpx;
		border: 6rpx solid #d8d8d8;
		background-color: #ffffff;
	}
	
	.flight-bottom {
		display: flex;
		width: 100vw;
		align-items: baseline;
		justify-content: center;
		text-align: center;
		font-family: SourceHanSansCN-Medium;
		font-size: 25rpx;
		color: rgba(0, 0, 0, 0.25);
		position: relative;
		padding: 69rpx 0 69rpx 0;
		.line {
			border-bottom: 3rpx solid rgba(0, 0, 0, 0.25);
			width: 35rpx;
			height: 0;
		}
	}
	
</style>

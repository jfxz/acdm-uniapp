<template>
	<view class="tasks-list">
		<view class="item">
			<view class="tasks-status">
				<view class="tasks">
					<text class="flight-code">{{'ZH9706'}}</text>
					<text class="task-content">{{'机组加水'}}</text>
					<text class="time">{{'30'}}</text>
					<text class="time-name">{{'分钟'}}</text>
					<image src="../../static/task-tab-warmming.png" class="warning-image"></image>
					<text class="waring-time">{{'10:00'}}</text>
				</view>
				<view class="status">{{'已完成'}}</view>
			</view>
			<view class="tasks-device">
			
			</view>
			<!-- <image src="../../static/over.png" class="over_image" ></image> -->
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				
			}
		}
	}
</script>

<style lang="scss">
	.tasks-list{
		// margin-top: calc(var(--status-bar-height) + 100rpx);
		// margin: 17rpx 18rpx 17rpx 18rpx;
		width: 100%;
		height: 100%;
		.item{
			margin: 17rpx 18rpx 17rpx 18rpx;
			border-radius: 15rpx;
			background: #FFFFFF;
			width: 100%;
			// height: 800rpx;
			.tasks-status{
				display: flex;
				justify-content: space-between;
				background: #FFFFFF;
				height: 100rpx;
				line-height: 100rpx;
				border-bottom: 2rpx solid #e5e5e5;
				.tasks{
					width: 80%;
					margin-left: 3%;
					.flight-code{
						font-size: 35rpx;
						color: #333333;
						font-weight: bold;
					}
					.task-content{
						margin-left: 4%;
						font-size: 35rpx;
						color: #0090ff;
					}
					.time{
						font-weight:bold;
						margin-left: 2%;
						font-size: 40rpx;
						color: #0090ff;
					}
					.time-name{
						font-size: 35rpx;
						color: #0090ff;
					}
					.warning-image{
						height: 23rpx;
						width: 23rpx;
						position: relative;
						bottom: 20rpx;
					}
				}
				.status{
					width: 20%;
					text-align: right;
					font-size: 38rpx;
					color: #0090ff;
					margin-right: 4%;
					font-weight: 600;
				}
			}
			.tasks-device{
				background: #FFFFFF;
				height: 120rpx;
				line-height: 120rpx;
				border-bottom: 2rpx solid #e5e5e5;
			}
			// .over_image{
			// 	position: absolute;
			// 	width: 156rpx;
			// 	height: 156rpx;
			// 	right: 30rpx;
			// 	top: -60rpx;
			// 	z-index: 11;
			// }
			.waring-time{
				color: #ff8500;
				color: #ff8500;
			}
		}
	}
</style>

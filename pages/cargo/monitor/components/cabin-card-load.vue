<template>
	<view>
		<view class="top">
			<view class="left">
				<view class="container-number">{{item.flight}}</view>
			</view>
			<view class="right">
				<view class="upload-image" @tap.stop="showDetails(item)">异常车数{{item.abnormalCarNum}}车</view>
			</view>
		</view>
		<view class="flight-place">
			<view class="flight">
				<view class="font">机号:</view>
				<view class="flight-number">{{item.registration}}</view>
			</view>
			<view class="flight">
				<view class="font">机位:</view>
				<view class="flight-number">{{item.standCode}}</view>
			</view>
			<view class="flight">
				<view class="font">截关车数:</view>
				<view class="flight-number">{{item.closedCarNum}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {DIC} from '@/common/dic.js'
	export default {
		props: {
			itemOri: {
				type: Object,
				default: () => {}
			}
		},
		data () {
			return {
				item: {
					
				}
			}
		},
		mounted () {
			this.item = this.itemOri
		},
		methods: {
			voice (cargoHold) {
				this.$emit('voice', cargoHold)
			},
			showDetails (item) {
				console.log('showDetails')
				uni.setStorageSync('monitor-detail-cars', item.arr)
				uni.navigateTo({
					url: `/pages/cargo/monitor/details?type=loadReceive`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top {
		display: flex;
		justify-content: space-between;
		padding-top: 14rpx;
		margin-bottom: 13rpx;
		.left {
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			.container-number {
				font-weight: 900;
				font-family: SourceHanSansSC-Medium;
				font-size: 35rpx;
				letter-spacing: 2rpx;
				color: #262626;;
				margin-right: 18rpx;
			}
		}
		.right {
			.status-right {
				font-family: SourceHanSansSC-Medium;
				font-size: 35rpx;
				font-weight: 900;
				line-height: 35rpx;
				letter-spacing: 2rpx;
				color: #2773e5;
			}
			.upload-image {
				width: 196rpx;
				height: 49rpx;
				line-height: 44rpx;
				border: solid 1rpx #808080;
				border-radius: 22rpx;
				font-family: SourceHanSansSC-Medium;
				font-size: 26rpx;
				letter-spacing: 1rpx;
				color: red;
				text-align: center;
			}
		}
	}
	.flight-place {
		display: flex;
		margin-bottom: 11rpx;
		.flight {
			font-family: SourceHanSansSC-Medium;
			font-size: 28rpx;
			height: 28rpx;
			line-height: 28rpx;
			display: flex;
			align-items: center;
			margin-right: 24rpx ;
			font-weight: 900;
			.font {
				color: #a6a6a6;
				margin-right: 3rpx;
			}
			.flight-number {
				color: black;
			}
		}
	}
</style>

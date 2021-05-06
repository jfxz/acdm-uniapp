<template>
	<view>
		<view class="top">
			<view class="left">
				<view class="container-number">{{item.flight}}</view>
				<view class="container-number">{{item.carNum}}</view>
			</view>
			<view class="right">
				<view class="container-number" style="color: red;margin-right: 80rpx;">{{item.abnormalCarNum}}车</view>
				<view class="status-right">{{item.flightStatusName}}</view>
			</view>
		</view>
		<view class="flight-place">
			<view class="flight">
				<view class="font">CTOT:</view>
				<view class="flight-number time">{{item.hasOwnProperty('localCtot')&&item.localCtot?item.localCtot:''}}</view>
			</view>
			<view class="flight">
				<view class="font">机位:</view>
				<view class="flight-number">{{item.standCode}}</view>
			</view>
			<view class="flight">
				<view class="font">截关时间:</view>
				<view class="flight-number time">{{item.closeTime}}</view>
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
			},
			flightStatuses: {
				type: Array,
				default: () => []
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
				uni.navigateTo({
					url: `/pages/cargo/monitor/details?`
				})
			},
			formatStatus (status) {
                if (!this.flightStatuses) {
                    return status
                }
				let statusName = this.flightStatuses.find(v => v.statusCode === status)
				if (statusName) {
					return statusName.description
				} else {
					return status
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	$font1: 28rpx;
	$time-font: 28rpx;
	.top {
		display: flex;
		justify-content: space-between;
		height: 35rpx;
		padding-top: 14rpx;
		margin-bottom: 30rpx;
		.container-number {
			font-weight: 900;
			font-family: SourceHanSansSC-Medium;
			font-size: 35rpx;
			line-height: 35rpx;
			color: #262626;
			margin-right: 18rpx;
		}
		
		.left {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		.right {
			display: flex;
			align-items: center;
			.status-right {
				width: 150rpx;
				font-family: SourceHanSansSC-Medium;
				font-size: 35rpx;
				font-weight: 900;
				line-height: 35rpx;
				color: #2773e5;
			}
		}
	}
	.flight-place {
		display: flex;
		justify-content: space-between;
		margin-bottom: 11rpx;
		font-weight: 900;
		.flight {
			display: flex;
			align-items: center;
			font-family: SourceHanSansSC-Medium;
			min-width: 200rpx;
			height: $time-font;
			line-height: $time-font;
			font-size: $font1;
			.font {
				color: #a6a6a6;
				margin-right: 3rpx;
				white-space: nowrap;
			}
			.flight-number {
				color: black;
				font-weight: 900;
				white-space: nowrap;
			}
		}
	}
</style>

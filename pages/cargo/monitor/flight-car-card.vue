<template>
	<view class="flight-car-card">
		<view class="flight-row" @tap="flightObj.showOperations=!flightObj.showOperations">
			<view class="flight-info">
				<view class="flight-number">
					<image src="/static/monitor-flight.png"></image>
					<span class="flight-text">
						{{flightObj.flight}}
					</span>
				</view>
				
				<view class="flight-detail">
					<view class="block">
						<view class="label">
							机号
						</view>
						<view class="value">
							{{flightObj.registration}}
						</view>
					</view>
					
					<view class="block">
						<view class="label">
							机位
						</view>
						<view class="value">
							{{flightObj.standCode}}
						</view>
					</view>
				</view>
			</view>
			
			<view class="car-info">
				<view class="car-info-column">
					<view class="close-off-car">
						<view class="label">
							截关车数
						</view>
						<view class="number">
							{{flightObj.closeOffNum}}
						</view>
					</view>
					<view class="abnormal-num" v-if="flightObj.abnormalCar.length!=0">
						<view class="text">
							异常
						</view>
						<view class="badge">
							{{flightObj.abnormalCar.length}}
						</view>
					</view>
				</view>
				<view
					class="down-arror"
				 :class="[flightObj.showOperations?'show-up-arror':'hide-down-arror']"></view>
			</view>
			
		</view>
		
		<block v-for="(operation, index) in flightObj.operations" :key="index">
			<view
				 class="driver-row"
				:class="[flightObj.showOperations?'show-driver-row':'hide-driver-row']"
				@tap="operation.showContainer=!operation.showContainer">
				<view class="block">
					<view class="label">
						司机名
					</view>
					<view class="value">
						{{operation.driverName}}
					</view>
				</view>
				
				<view class="block">
					<view class="label">
						交接人
					</view>
					<view class="value">
						{{operation.operator}}
					</view>
				</view>
				
				<view class="block block-arror">
					<view class="label">
						车数
					</view>
					<view v-if="!operation.containerCars.find(e => e.abnormal)" class="num">
						{{operation.num}}
					</view>
					<view v-else class="abormal-num-block">
						<view class="abnormal-num">
							{{operation.containerCars.filter(e => e.abnormal).length}}
						</view>
						<view class="normal-num">
							/{{operation.containerCars.length}}
						</view>
					</view>
					<view
					  class="down-arror"
					 :class="[flightObj.showOperations&&operation.showContainer?'show-up-arror':'hide-down-arror']"></view>
				</view>
			</view>
			
			<block v-for="containerCar in operation.containerCars" :key="containerCar.container">
				<view
					 class="container-car"
					:class="[flightObj.showOperations&&operation.showContainer?'show-container-row':'hide-container-row']">
					<view class="icon-code">
						<image src="/static/monitor-cargo-car.png"></image>
						<view class="code-text" :class="[containerCar.abnormal?'abnormal':'normal']">
							{{containerCar.container}}
						</view>
					</view>
					<view class="status" :class="[containerCar.abnormal?'abnormal':'normal']">
						{{formatStatus(containerCar.status)}}
					</view>
				</view>
			</block>
		</block>
		
		<view class="container-row">
			
		</view>
	</view>
</template>

<script>
	import {DIC} from '@/common/dic.js'
	export default {
		props: {
			// 航班信息实体
			flightObj: {
				type: Object,
				default: () => {}
			}
		},
		
		data () {
			return {
			}
		},
		
		mounted () {
		},
		
		methods: {
			formatStatus (status) {
				return DIC.CARGOSTATUS[status]
			}
		}
	}
</script>

<style lang="scss">
	.flight-car-card {
		width: calc(100% - 40rpx);
		border-radius: 8rpx;
		background-color: #fff;
		margin: 0 auto 16rpx auto;
		padding: 0 28rpx;
		.flight-row {
			display: flex;
			justify-content: space-between;
			.flight-info {
				.flight-number {
					margin: 24rpx 0 13rpx 0;
					display: flex;
					align-items: center;
					image {
						width: 36rpx;
						height: 36rpx;
						margin-right: 4rpx;
					}
					.flight-text {
						font-size: 34rpx;
						font-weight: bold;
						color: #333333;
						font-family: SourceHanSansCN-Bold, SourceHanSansCN;
					}
				}
				.flight-detail {
					display: flex;
					margin-bottom: 23rpx;
					.block {
						display: flex;
						align-items: baseline;
						margin-right: 36rpx;
						.label {
							font-size: 24rpx;
							font-weight: 400;
							color: #999999;
							margin-right: 10rpx;
							font-family: PingFangSC-Regular, PingFang SC;
						}
						.value {
							font-size: 24rpx;
							font-weight: 400;
							color: #000000;
							font-family: SourceHanSansCN-Regular, SourceHanSansCN;
						}
					}
				}
			}
			
			.car-info {
				display: flex;
				align-items: center;
				.car-info-column {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: flex-end;
					margin-right: 25rpx;
					.close-off-car {
						display: flex;
						align-items: center;
						.label {
							font-size: 22rpx;
							font-weight: 400;
							color: #999999;
							margin-right: 6rpx;
							font-family: PingFangSC-Regular, PingFang SC;
						}
						.number {
							font-size: 34rpx;
							font-weight: bold;
							color: #333333;
							font-family: SourceHanSansCN-Bold, SourceHanSansCN;
						}
					}
					.abnormal-num {
						position: relative;
						margin-top: 19rpx;
						.text {
							width: 98rpx;
							background: rgba($color: #F56146, $alpha: 0.2);
							color: #F56146;
							border-radius: 16rpx;
							padding-left: 14rpx;
							font-size: 22rpx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
						}
						.badge {
							position: absolute;
							top: 0;
							right: 0;
							width: 32rpx;
							height: 32rpx;
							background: #F56146;
							border-radius: 20rpx;
							text-align: center;
							color: #fff;
						}
					}
				}
				.show-up-arror {
					position: relative;
					top: 5rpx;
				}
			}
		}
		.show-driver-row {
			border-top: 1rpx solid #D8D8D8;
			padding: 20rpx 0;
			max-height: 100rpx;
			opacity: 1;
			transition: all 0.4s ease;
		}
		
		.hide-driver-row {
			border-top: 0rpx;
			padding: 0;
			max-height: 0;
			opacity: 0;
			transition: all 0.4s ease;
		}
		
		.driver-row {
			display: flex;
			justify-content: space-between;
			overflow: hidden;
			.block {
				display: flex;
				align-items: center;
				.label {
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #999999;
					margin-right: 10rpx;
				}
				.value {
					font-size: 28rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #333333;
				}
				.num {
					position: relative;
					top: 2rpx;
					margin-left: 17.47rpx;
					font-size: 28rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #333333;
				}
				.abormal-num-block {
					display: flex;
					.abnormal-num {
						font-family: SourceHanSansCN-Regular;
						font-size: 28rpx;
						color: #F56146;
					}
					.normal-num {
						font-family: SourceHanSansCN-Regular;
						font-size: 28rpx;
						color: #333333;
					}
				}
				.show-up-arror {
					position: relative;
					top: 5rpx;
					margin-left: 30rpx;
					margin-right: 5rpx;
				}
				.down-arror {
					margin-left: 30rpx;
					margin-right: 5rpx;
				}
			}
		}
		.container-row {
			
		}
	}
	
	@mixin arror-shape {
	  position: relative;
	  top: -5rpx;
	  width: 20rpx;
	  height: 20rpx;
	  border-top: 3rpx solid #c3c8d6;
	  border-right: 3rpx solid #c3c8d6;
	}
	
	.down-arror {
		@include arror-shape;
		transform: rotate(135deg);
	}
	// .up-arror {
	// 	@include arror-shape;
	// 	transform: rotate(-45deg);
	// }
	
	.hide-down-arror {
		transform: rotate(135deg);
		transition: all 0.5s ease;
	}
	
	.show-up-arror {
		transform: rotate(315deg);
		transition: all 0.5s ease;
	}
	
	.show-container-row {
		border-top: 1rpx solid #D8D8D8;
		padding: 20rpx 0;
		max-height: 100rpx !important;
		opacity: 1;
		transition: all 0.4s ease;
	}
	
	.hide-container-row {
		padding: 0;
		max-height: 0;
		border-top: 0rpx;
		opacity: 0;
		transition: all 0.4s ease;
	}
	.container-car {
		display: flex;
		justify-content: space-between;
		align-items: center;
		overflow: hidden;
		.icon-code {
			display: flex;
			align-items: center;
			image {
				width: 39rpx;
				height: 23rpx;
				margin-right: 11rpx;
				margin-left: 18rpx;
			}
			.code-text {
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
			}
			.abnormal {
				color: #F56146;
			}
			.normal {
				color: #333333;
			}
		}
		.status {
			margin-right: 48rpx;
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #F56146;
		}
		.abnormal {
			color: #F56146;
		}
		.normal {
			color: #333333;
		}
	}
</style>

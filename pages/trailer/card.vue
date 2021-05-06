<template>
	<view>
		<view class="swiper-item-layout" @tap="flightClick(item)">
			<view v-if="rightTop" class="inner-round right-top"></view>
			<view v-if="rightBottom" class="inner-round right-bottom"></view>
			<view class="icon">
				<template v-if="item.word">
					<view class="img-font" :style="{'background-color': item.color}">{{item.word}}</view>
				</template>
				<template v-else>
					<image class="img" src="@/static/plane.png"></image>
				</template>
			</view>
			<view class="text-layout">
				<view class="top">
					<view class="flight">
						<view class="flight-head">{{item.iataCarrier +  item.flight}}</view>
						<view class="flight-stand">
							<view class="flight-stand-label">
								机位
							</view>
							<view class="flight-stand-value">
								{{item.stand}}
							</view>
						</view>
					</view>
					<view :class="['status', item.flightStatus]">
						{{formatStatus(item.flightStatus)}}
					</view>
				</view>
				<view class="bottom">
					<view class="type-registration">
						{{item.aircraftType}}/{{item.registration}}
					</view>
					<view class="seperation"></view>
					<view class="bottom-block" style="margin-left: 24rpx;">
						<view class="bottom-block-label">CTOT</view>
						<view class="bottom-block-value">{{formatTime(item.localCtot)}}</view>
					</view>
					<view class="seperation" style="margin-left: 40rpx;margin-right: 21rpx;"></view>
					<view class="bottom-block">
						<view class="bottom-block-label">COBT</view>
						<view class="bottom-block-value" >{{formatTime(item.localAcobt)}}</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="item.timespan" class="card-bottom">
			<view class="ctot-line">
				{{item.timespan}}
			</view>
		</view>
		<view v-else class="card-bottom">
			<view class="ctot-line">
			</view>
		</view>
	</view>
</template>

<script>
	import dayjs from '@/common/util/dayjs.min.js'
	export default {
		props: {
			item: {
				type: Object,
				default: () => {}
			},
			flightStatuses: {
				type: Array,
				default: () => []
			},
			// 是否显示卡片右上角内凹四分之一圆
			rightTop: {
				type: Boolean,
				default: true
			},
			// 是否显示卡片右下角内凹四分之一圆
			rightBottom: {
				type: Boolean,
				default: true
			}
		},
		data () {
			return {
				
			}
		},
		methods: {
			formatTime (val) {
				try {
					if (val) {
						if (typeof val !== 'number') {
							try {
								val = val.substr(0, 19).replace(/T/, ' ')
								val = dayjs(val).add(8, 'hour')
							} catch (e) {
								console.log(e)
							}
						}
						let day1 = dayjs(val).format('HHmm')
						return day1
					} else {
						return ''
					}
				} catch (e) {
					console.log(e)
				}
			},
			formatStatus (status) {
				let statusName = this.flightStatuses.find(v => v.statusCode === status)
				if (statusName) {
					return statusName.description
				} else {
					return ''
				}
			},
			
			flightClick (flight) {
				let msg = {
					flightId: flight.flightId,
					num: 0
				}
				uni.navigateTo({
					url: `/pages/flight/flight-message?flightId=${flight.flightId}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.swiper-item-layout {
		position: relative;
		display: flex;
		margin: 0 auto;
		width: calc(100% - 30rpx);
		background-color: #ffffff;
		border-radius: 0rpx 0rpx 7rpx 7rpx;
		height: 140rpx !important;
		padding: 0 12rpx;
		padding: {
			top: 0 !important;
			bottom: 0 !important;
		}
		
		.inner-round {
			width: 28rpx;
			height: 28rpx;
			position: absolute;
			background-color: #f5f5f5;
		}
		.right-bottom {
			border-radius: 32rpx 0 0 0;
			bottom: 0;
			right: 0;
		}
		.right-top {
			border-radius: 0 0 0 32rpx;
			top: 0;
			right: 0;
		}
		
		.icon {
			display: flex;
			align-items: center;
			margin-right: 18rpx;
			.img {
				height: 58rpx;
				width: 58rpx;
			}
		}
		.text-layout {
			width: 100%;
			.top {
				display: flex;
				justify-content: space-between;
				align-items: baseline;
				margin-top:25rpx;
				.flight {
					display: flex;
					padding-top: 5rpx;
					font-family: Arial-BoldMT;
					font-size: 35rpx;
					line-height: 20rpx;
					color: #333333;
					.flight-head {
						font-family: Roboto-Bold;
						font-size: 35rpx;
						color: #333333;
						font-weight: bold;
					}
					.flight-stand {
						margin-left: 59rpx;
						display: flex;
						align-items: baseline;
						.flight-stand-label {
							font-family: SourceHanSansSC-Regular;
							font-size: 29rpx;
							color: #a6a6a6;
						}
						.flight-stand-value {
							margin-left: 13rpx;
							font-family: Roboto-Regular;
							font-size: 29rpx;
							font-weight: bold;
							color: #595959;
						}
					}
				}
				.flight-status {
					font-size: 35rpx;
					font-weight: normal;
					line-height: 20rpx;
					color: #00cf70;
				}
			}

			.bottom {
				display: flex;
				margin-top: 40rpx;
				.ctot {
					display: flex;
					padding-top: 3rpx;
					font-size: 29rpx;
					font-weight: normal;
					font-stretch: normal;
					letter-spacing: 1rpx;
					color: #a6a6a6;
					.time {
						margin-left: 18rpx;
						font-size: 29rpx;
						font-weight: bold;
						letter-spacing: 1rpx;
						color: #595959;
					}
				}
				.seperation {
					width: 2rpx;
					background-color: #e6e6e6;
				}
				.bottom-block {
					display: flex;
					align-items: baseline; 
					.bottom-block-label {
						font-family: Roboto-Regular;
						font-size: 29rpx;
						color: #a6a6a6; 
						margin-right: 23rpx;
					}
					.bottom-block-value {
						font-family: Roboto-Regular;
						font-size: 29rpx;
						color: #595959;
						font-weight: bold;
					}
				}
				.type-registration {
					font-family: Roboto-Regular;
					font-size: 29rpx;
					font-weight: bold;
					color: #595959;
					margin-right: 28rpx;
				}
			}
		}
	}
	
	.status {
		color: #c6c6c6;
		$mapStatus: (DLY: #e85656, //延误
			RTN:#e85656, //返航
			CNL:#576078, //取消
			ENR: #1890ff, //途中
			ALT:#2f54eb, // 备降
			BDP:#faad14, //允许登机BDF
			BDF:#0ebf9c, //催促登机BDT
			BDT:#0ebf9c, //过站登机BDC
			BDO:#0ebf9c, //登机CKI
			BDC:#e39832, //登机结束DEP
			DEP:#767c96, //起飞BDO
			CKI:#d7dfec, //正在直机CKC
			CKC:#d7dfec, //直机关闭
			BDS:#d7dfec, //候机RTN
			ARR: #52c41a); //到达
	
		@each $wb,
		$value in $mapStatus {
			&.#{$wb} {
				color: $value;
			}
		}
		
		font-family: SourceHanSansSC-Medium;
		font-size: 35rpx;
		line-height: 20rpx;
	}
	
	.img-font {
		height: 58rpx !important;
		width: 58rpx !important;
		color:#ffffff !important;
		line-height: 58rpx !important;
		border-radius: 50% !important;
		text-align: center;
	}
	.land-scape-between {
		display: flex !important;
		justify-content: space-between !important;
		overflow:auto !important;
	}
	
	.card-bottom {
		width: 100%;
		.ctot-line {
			height: 36rpx;
			padding-right: 3rpx;
			position: relative;
			text-align: right;
			
			font-family: SourceHanSansSC-Regular;
			font-size: 29rpx;
			letter-spacing: 1rpx;
			color: #a6a6a6;
		}
	}
</style>

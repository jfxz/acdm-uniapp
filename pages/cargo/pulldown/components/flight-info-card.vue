<template>
	<view class="flight-card">
		<view class="left" style="height:100rpx;width: 100rpx;">
			<image src="@/static/plane-flight.png"></image>
		</view>
		<view class="right" v-if="show">
			<view class="top">{{merge?flight.flight : (flight.iataCarrier + flight.flight || '无')}}</view>
			<view class="flight-card-bottom">
				<view class="flight-item">
					<view class="font">日期</view>
					<view class="value">{{flight.opDate?flight.opDate.substr(0, 10):'无'}}</view>
				</view>
				<view class="flight-item">
					<view class="font">机位</view>
					<view class="value">{{flight.standCode || flight.stand || '无'}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			itemOri: {
				type: Object,
				default: () => {}
			},
			merge: {
				type: Boolean,
				default: false
			}
		},
		data () {
			return {
				flight: {
					
				},
				show: true
			}
		},
		watch: {
			itemOri: {
				handler (newval) {
					this.flight = newval
				},
				deep: true,
				immediate: true
			}
		},
		methods: {
			setFlightInfo (flight) {
				this.flight = flight
			}
		}
	}
</script>

<style lang="scss" scoped>
	.flight-card {
		display: flex;
		width: calc(100vw - 40rpx);
		background-color: #2ac815;
		margin-top: 18rpx;
		padding: 42rpx 0 37rpx 28rpx;
		.left {
			margin-right: 35rpx;
			image {
				width: 87rpx;
				height: 87rpx;
			}
		}
		.right {
			width: 100%;
			.top {
				font-size: 35rpx;
				letter-spacing: 2rpx;
				color: #ffffff;
			}
			.flight-card-bottom {
				display: flex;
				justify-content: space-between;
				background-color: #2ac815;
				width: 100%;
				margin-right: 26rpx;
				.flight-item {
					margin-right: 20rpx;
					font-size: 25rpx;
					letter-spacing: 1rpx;
					color: #ffffff;
					font-family: SourceHanSansSC-Regular;
					text-align: center;
					.font {
						font-size: 25rpx;
						letter-spacing: 2rpx;
						opacity: 0.55;
						color: #ffffff;
					}
					.value {
						font-size: 33rpx;
						opacity: 1;
					}
				}
			}
		}
	}
</style>

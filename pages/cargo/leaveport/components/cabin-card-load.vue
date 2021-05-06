<template>
	<view>
		<view class="top">
			<view class="left">
				<view class="container-number">舱位:{{item.cabin}}</view>
				<view v-if="installedConfirm" class="play-sound-layout" @tap="voice(item.cargoHold)">
					<image class="sound" src="@/static/sound.png"></image>
					<image class="play" src="@/static/play.png"></image>
				</view>
				<view v-if="item.destination&&item.destination!=''&&item.destination!=' '" class="container-status-layout">
					<view class="background destination">{{item.destination}}</view>
				</view>
				<view v-if="item.type&&item.type!=''&&item.type!=' '" class="container-status-layout" style="font-weight: 900;font-size: 28rpx;">
					<view class="background type">{{item.type}}</view>
				</view>
				<view v-if="item.priority&&item.priority!=''&&item.priority!=' '"
				  class="container-status-layout"
					style="margin-right: 0;">
					<view class="background priority">{{item.priority}}</view>
				</view>
			</view>
			
		</view>
		<view class="flight-place">
			<view class="flight">
				<view class="font">集装器:</view>
				<view class="flight-number">{{item.container}}</view>
			</view>
			<view v-if="item.specialCode&&item.specialCode!=''&&item.specialCode!=' '" class="container-status-layout">
				<view class="background specialCode">{{item.specialCode}}</view>
			</view>
			<view v-if="installedConfirm" class="place">
				<view class="font">航班号:</view>
				<view class="place-font">{{item.flight}}</view>
			</view>
			<view v-if="loaderList" class="flight">
				<view class="font">重量:</view>
				<view class="flight-number">{{item.weight}}kg</view>
			</view>
			<view v-if="loaderList" class="flight">
				<view class="font">立方:</view>
				<view class="flight-number">{{item.volume}}</view>
			</view>
		</view>
		<images-bottom
			:item-ori="item">
		</images-bottom>
	</view>
</template>

<script>
	import imagesBottom from '@/pages/cargo/images-bottom.vue'
	import {DIC} from '@/common/dic.js'
	export default {
		props: {
			itemOri: {
				type: Object,
				default: () => {}
			},
			installedConfirm: {
				type: Boolean,
				default: false
			},
			loaderList: {
				type: Boolean,
				default: false
			}
		},
		components: {
			imagesBottom
		},
		data () {
			return {
				item: {
					
				}
			}
		},
		computed: {
			cabinColor () {
				switch (this.item.cabin) {
					case '1H':
						return '#ffffff'
					case '2H':
						return '#faad14'
					case '3H':
						return '#1890ff'
					case '4H':
						return '#FFB6C1'
					case '5H':
						return '#9370DB'
					default:
						return '#ffffff'
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
			// 上传图片
			uploadImage (item) {
				this.$emit('uploadImage', item)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.background {
		min-height: 35rpx;
		white-space:nowrap;
		border-radius: 6rpx;
		font-family: SourceHanSansSC-Regular;
		font-size: 25rpx;
		padding: {
			left: 10rpx;
			right: 10rpx;
		}
	}
	.status {
		position: absolute;
		min-height: 35rpx;
		white-space:nowrap;
		top: -2rpx;
		font-family: SourceHanSansSC-Regular;
		font-size: 25rpx;
		left: 50%;
		transform:translate(-50%, 0%);
	}
	$mapColors: (
		specialCode: #9370DB,
		destination: #000080,
		type: #0BB8FF,
		priority: #ef5c0b);
	
	@each $key,
	$value in $mapColors {
		.#{$key} {
			background-color: rgba($color: $value, $alpha: 0.07);
			color: $value;
		}
	}
	
	.top {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding-top: 14rpx;
		margin-bottom: 13rpx;
		.left {
			display: flex;
			justify-content: space-between;
			align-items: baseline;
			.play-sound-layout {
				width:142rpx;
				height:44rpx;
				background-color:#6EC815;
				display:flex;
				align-items:center;
				justify-content:space-between;
				.sound {
					width:23rpx;
					height:23rpx;
					margin-left:11rpx;
				}
				.play {
					width:23rpx;
					height:23rpx;
					margin-right:11rpx;
				}
			}
			.container-number {
				font-weight: 900;
				font-family: SourceHanSansSC-Medium;
				font-size: 35rpx;
				letter-spacing: 2rpx;
				color: #262626;;
				margin-right: 18rpx;
			}
			.container-status-layout {
				position: relative;
				top:-5rpx;
				margin-right: 20rpx;
			}
		}
	}
	.flight-place {
		display: flex;
		margin-bottom: 11rpx;
		.flight {
			display: flex;
			align-items: center;
			margin-right: 24rpx ;
			.font {
				font-family: SourceHanSansSC-Regular;
				font-size: 28rpx;
				color: #a6a6a6;
				margin-right: 3rpx;
			}
			.flight-number {
				font-family: Roboto-Regular;
				font-size: 28rpx;
				color: black;
				font-weight: 900;
			}
		}
		.place {
			display: flex;
			align-items: center;
			.font {
				font-family: SourceHanSansSC-Regular;
				font-size: 28rpx;
				letter-spacing: 1rpx;
				color: #a6a6a6;
				margin-right: 12rpx;
			}
			.place-font {
				font-family: Roboto-Regular;
				font-size: 28rpx;
				letter-spacing: 1rpx;
				color: #a6a6a6;
			}
		}
	}
</style>

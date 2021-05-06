<template>
	<view>
		<view class="top">
			<view class="left">
				<view class="container-number">舱位:{{item.cargoHold}}</view>
				<view v-if="installedConfirm" class="play-sound-layout" @tap="voice(item)">
					<image class="sound" src="@/static/sound.png"></image>
					<image class="play" src="@/static/play.png"></image>
				</view>
				<view
				  v-if="!installedConfirm && item.type&&item.type!=''&&item.type!=' '"
					class="container-status-layout"
					style="margin-right: 20rpx;">
					<view class="background type">{{item.type}}</view>
				</view>
				<view
				  v-if="subCabin && item.cargoHold&&item.cargoHold!=''&&item.cargoHold!=' '"
					class="container-status-layout"
					style="margin-right: 20rpx;">
					<view class="background cabinType">{{cabinType}}</view>
				</view>
				<view
					v-if="!installedConfirm && item.priority&&item.priority!=''&&item.priority!=' '"
				  class="container-status-layout">
					<view class="background priority">{{item.priority}}</view>
				</view>
			</view>
			<view class="right">
				<view class="upload-image" @tap="uploadImage(item)">上传照片</view>
			</view>
		</view>
		<view class="flight-place">
			<view class="flight">
				<view class="font">集装器:</view>
				<view class="flight-number">{{item.containerCode}}</view>
			</view>
			<view v-if="installedConfirm" class="place">
				<view class="font">航班号:</view>
				<view class="place-font">{{item.flight}}</view>
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
			// 是否是货物分仓在使用该卡片
			subCabin: {
				type: Boolean,
				default: false
			}
		},
		components: {
			imagesBottom
		},
		data () {
			return {
				item: {}
			}
		},
		mounted () {
			this.item = this.itemOri
		},
		computed: {
			cabinType () {
				if (!this.item.cargoHold) {
					return ''
				}
				let cargoHold = this.getNumber(this.item.cargoHold)
				switch (cargoHold) {
					case '1': 
					case '2':
						return '前舱'
					case '3':
					case '4':
					case '5':
						return '后舱'
					default:
						return ''
				}
			}
		},
		methods: {
			voice (item) {
				this.$emit('voice', item.cargoHold, item)
			},
			// 上传图片
			uploadImage (item) {
				this.$emit('uploadImage', item)
			},
			// 取第一个数字的第一位数
			getNumber (str) {
				let arr = str.match(/\d+/g)
				if (arr && arr.length > 0) {
					let s = parseInt(arr[0]) + ''
					return s[0]
				} else {
					return ''
				}
			},
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
				.background {
					font-weight: bold;
					font-size: 30rpx;
					min-height: 35rpx;
					white-space:nowrap;
					border-radius: 6rpx;
					font-family: SourceHanSansSC-Regular;
					// font-size: 25rpx;
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
					type: #F07533,
					priority: #89DBB6,
					cabinType: #1891ff);
				
				@each $key,
				$value in $mapColors {
					.#{$key} {
						background-color: rgba($color: $value, $alpha: 0.07);
						color: $value;
					}
				}
			}
		}
		.right {
			.upload-image {
				width: 136rpx;
				height: 49rpx;
				line-height: 44rpx;
				border: solid 1rpx #e5e5e5;
				border-radius: 22rpx;
				font-family: SourceHanSansSC-Regular;
				font-size: 26rpx;
				letter-spacing: 1rpx;
				color: #8c8c8c;
				text-align: center;
			}
		}
	}
	.flight-place {
		display: flex;
		margin-bottom: 11rpx;
		.flight {
			display: flex;
			align-items: center;
			margin-right: 44rpx ;
			.font {
				font-family: SourceHanSansSC-Regular;
				font-size: 28rpx;
				letter-spacing: 1rpx;
				color: #a6a6a6;
				margin-right: 13rpx;
			}
			.flight-number {
				font-weight: 900;
				font-family: Roboto-Regular;
				font-size: 28rpx;
				letter-spacing: 1rpx;
				color: #292929;
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
				font-weight: 900;
				font-family: Roboto-Regular;
				font-size: 28rpx;
				letter-spacing: 1rpx;
				color: #292929;
			}
		}
	}
</style>

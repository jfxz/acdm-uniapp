<template>
	<view>
		<view class="top">
			<view class="left">
				<view class="container-number"></view>
			</view>
			
		</view>
		<view class="flight-place">
			<view class="flight">
				<view class="font"></view>
				<view class="flight-number"></view>
			</view>
			<view v-if="installedConfirm" class="place">
				<view class="font"></view>
				<view class="place-font"></view>
			</view>
			<view v-if="loaderList" class="flight">
				<view class="font"></view>
				<view class="flight-number"></view>
			</view>
			<view v-if="loaderList" class="flight">
				<view class="font"></view>
				<view class="flight-number"></view>
			</view>
		</view>
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
						return '#52c41a'
					case '2H':
						return '#1890ff'
					case '3H':
						return '#2f54eb'
					case '4H':
						return '#faad14'
					case '5H':
						return '#e85656'
					default:
						return '#576078'
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

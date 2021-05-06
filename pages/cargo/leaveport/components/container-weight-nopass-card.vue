/*
* 界面名称:适用于到达机位交接和装机稽核
* 界面功能:
* 其他    :
* 时间    :2020-8-21 22:47:40
* 作者    :gyb
*/
<template>
	<view v-if="refresh">
		<view class="top">
			<view class="left">
				<view class="container-number">{{item.containerCode}}</view>
			</view>
			<view class="right">
				<view class="status-right">{{formatStatus(item.status, item)}}</view>
			</view>
		</view>
		<view class="container-weight-middle">
			<view class="left">
				<view class="flight-place">
					<view class="place">
						<view class="font">货物重量:</view>
						<view class="place-font">{{item.cargoWeight || ''}}</view>
					</view>
				</view>
			</view>
			<view class="right">
				<view class="upload-image" @tap="uploadImage(item)">上传照片</view>
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
	import cardMixin from '@/pages/cargo/card-mixin'
	export default {
		mixins: [cardMixin],
		props: {
			itemOri: {
				type: Object,
				default: () => {}
			},
			audit: {
				type: Boolean,
				default: true
			}
		},
		components: {
			imagesBottom
		},
		data () {
			return {
				item: {},
				refresh: true
			}
		},
		mounted () {
			this.item = this.itemOri
		},
		methods: {
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
		.right {
			.status-right {
				font-family: SourceHanSansSC-Medium;
				font-size: 35rpx;
				font-weight: 900;
				line-height: 35rpx;
				letter-spacing: 2rpx;
				color: #2773e5;
			}
		}
	}
	.container-weight-middle {
		display: flex;
		justify-content: space-between;
		width: 100%;
		margin-bottom: 10rpx;
		.left {
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
						font-family: Roboto-Regular;
						font-size: 28rpx;
						letter-spacing: 1rpx;
						color: #a6a6a6;
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
</style>

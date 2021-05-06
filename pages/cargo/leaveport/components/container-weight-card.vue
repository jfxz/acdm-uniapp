/*
* 界面名称:适用于到达机位交接和装机稽核
* 界面功能:
* 其他    :
* 时间    :2020-8-21 22:47:40
* 作者    :gyb
*/
<template>
	<view>
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
					<view class="flight">
						<view class="font">舱位:</view>
						<view class="flight-number">{{item.cargoHold}}</view>
					</view>
					<view class="place">
						<view class="font">货物重量:</view>
						<view class="place-font">{{item.cargoWeight}}</view>
					</view>
				</view>
			</view>
			<view class="right">
				<view class="upload-image" @tap="uploadImage(item)">上传照片</view>
        <view class="upload-image" style="margin-left: 5rpx;width: 86rpx;" @tap="soloAudit(item)">稽核</view>
			</view>
		</view>
		<images-bottom
			:item-ori="item">
		</images-bottom>
	</view>
</template>

<script>
    import { debounce } from '@/common/util/util.js'
	import imagesBottom from '@/pages/cargo/images-bottom.vue'
	import {DIC} from '@/common/dic.js'
	export default {
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
				item: {}
			}
		},
		mounted () {
			this.item = this.itemOri
		},
		methods: {
			// 状态格式化
			formatStatus (status) {
				return DIC.CARGOSTATUS[status]
			},
			// 上传图片
			uploadImage (item) {
				this.$emit('uploadImage', item)
			},
            // 单独稽核
            soloAudit: debounce(function (item) {
                this.$emit('soloAudit', item)
            })
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
			.container-status-layout {
				position: relative;
				.background {
					min-height: 33rpx;
					min-width: 83rpx;
					background-color: rgba($color: #008ffd, $alpha: 0.07);
					border-radius: 6rpx;
					font-family: SourceHanSansSC-Regular;
					color: #2773e5;
					text-align: center;
				}
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
				font-weight: bold;
			}
		}
	}
	.container-weight-middle {
		display: flex;
		justify-content: space-between;
    align-items: center;
		width: 100%;
    margin-bottom: 31rpx;
		.left {
			.flight-place {
				display: flex;
				.flight {
					display: flex;
					align-items: center;
					margin-right: 14rpx ;
					.font {
            white-space: nowrap;
						font-family: SourceHanSansSC-Regular;
						font-size: 28rpx;
						letter-spacing: 1rpx;
						color: #a6a6a6;
						margin-right: 13rpx;
					}
					.flight-number {
            white-space: nowrap;
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
            white-space: nowrap;
						font-family: SourceHanSansSC-Regular;
						font-size: 28rpx;
						letter-spacing: 1rpx;
						color: #a6a6a6;
						margin-right: 12rpx;
					}
					.place-font {
            white-space: nowrap;
						font-family: Roboto-Regular;
						font-size: 28rpx;
						letter-spacing: 1rpx;
						color: #a6a6a6;
					}
				}
			}
		}
		.right {
            display: flex;
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

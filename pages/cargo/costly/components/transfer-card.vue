/*
* 界面名称:运输
* 界面功能:
* 其他    :
* 时间    :2020-11-3 11:56:16
* 作者    :gyb
*/
<template>
	<view class="costly-search-card">
		<view class="top">
			<view class="left">
				<view class="containerCode">{{item.containerCode}}</view>
				<view class="num">
					<view class="font">件数:</view>
					<view class="place-font">{{item.num}}</view>
				</view>
			</view>
			<view class="status">{{formatStatus(item.status)}}</view>
		</view>
		<view class="bottom">
			<view class="left">
				<view class="row" style="min-width: 200rpx;">
					<span class="font">重量:</span>
					<span class="place-font">{{item.cargoWeight}}</span>
				</view>
				<view class="row">
					<span class="font">外包装:</span>
					<span class="place-font">{{item.outerPacking}}</span>
				</view>
			</view>
			<view v-if="showUpload" class="upload-image" @tap.stop="uploadImage(item)">
				上传照片
			</view>
		</view>
		<template v-if="item.hasOwnProperty('images')&&item.images&&item.images.length!=0">
			<images-bottom
				:item-ori="item">
			</images-bottom>
		</template>
		<template v-else>
			<view style="width: 100%;height: 1rpx;padding-bottom: 20rpx;"></view>
		</template>
	</view>
</template>

<script>
	import imagesBottom from './images-bottom.vue'
	import cardMixin from '@/pages/cargo/card-mixin'
	export default {
		mixins: [cardMixin],
		components: {
			imagesBottom
		},
		props: {
			item: {
				type: Object,
				default: () => {}
			},
			showUpload: {
				type: Boolean,
				default: true
			}
		},
		data () {
			return {
			}
		},
		methods: {
			uploadImage (item) {
				this.$emit('uploadImage', item)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.costly-search-card {
		font-weight: 900;
		font-family: SourceHanSansSC-Medium;
		.top {
			display: flex;
			justify-content: space-between;
			padding-right: 10rpx;
			height: 48rpx;
			margin-bottom: 20rpx;
			font-size: 40rpx;
			.left {
				display: flex;
				align-items: baseline;
				color: #262626;
				.containerCode {
					min-width: 200rpx;
				}
				.num {
					display: flex;
					align-items: baseline;
					margin-left: 20rpx;
					font-size: 28rpx;
				}
			}
			.status {
				color: #2773e5;
			}
		}
		.bottom {
			height: 48rpx;
			display: flex;
			justify-content: space-between;
			.left {
				display: flex;
				.row {
					height: 48rpx;
					line-height: 48rpx;
					margin-right: 20rpx;
				}
			}
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
	
	.font {
		font-family: SourceHanSansSC-Regular;
		font-size: 24rpx;
		color: #a6a6a6;
	}
	
	.place-font {
		font-family: Roboto-Regular;
		font-size: 28rpx;
		width: 120rpx;
		font-weight: 900;
		color: #595959;
	}
</style>

/*
* 界面名称:适用于货运进港的到达待运区、到达货站、交接运往待运区、交接运往货站的列表卡片的右半部分
* 界面功能:
* 其他    :
* 时间    :2020-8-21 11:17:40
* 作者    :gyb
*/
<template>
	<view class="cardRight">
		<view class="top">
			<view class="left">
				<view class="container-number">{{item.containerCode}}</view>
			</view>
			<view class="right">
				<view class="status-right">{{formatStatus(item.status, item)}}</view>
			</view>
		</view>
		
		<view class="unloading-plate-box-row">
			<view class="left">
				<view class="unloading-flight-item">
					<text class="label">舱位:</text>
					<text class="value">{{item.cargoHold?item.cargoHold:'无'}}</text>
				</view>
				<view class="unloading-flight-item">
					<text class="label">重量:</text>
					<text class="value">{{item.cargoWeight?item.cargoWeight + 'KG':'无'}}</text>
				</view>
			</view>
			
			<view class="right">
				<view class="btn" @tap.stop="uploadImage(item)">上传照片</view>
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
			}
		},
		components: {
			imagesBottom
		},
		data () {
			return {
				item: {},
				arrived: false
			}
		},
		mounted () {
			this.item = this.itemOri
		},
		methods: {
			// 预览图片
			showImage (item) {
				uni.previewImage({
					urls: [item.uri]
				})
			},
			deleteImage (item, image) {
				let index = item.images.find(v => image.path === v.path)
				item.images.splice(index, 1)
			},
			// 删除照片
			showDeleteBadge (image) {
				image.showDelete = true
			},
			// 打开父组件的底部弹出层
			open (item) {
				this.$emit('open', item)
			},
			
			formatStatus (status, item) {
				if (status === 'TOWAITINGAREA') {
					return '运往' + (item.firstTransportTargetAddr?item.firstTransportTargetAddr:('' + '待运区'))
				} else if (status === 'TOSTATION') {
					return '运往货站'
				} else if (status === 'ARRIVEDWAITINGAREA') {
					return '已到达' + (item.firstTransportTargetAddr?item.firstTransportTargetAddr:('' + '待运区'))
				} else if (status === 'ARRIVEDSTATION') {
					return '已到达货站'
				} else {
					return DIC.CARGOSTATUS[status]
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
				font-weight: bold;
				line-height: 35rpx;
				letter-spacing: 2rpx;
				color: #2773e5;
			}
		}
	}
	.unloading-plate-box-row {
		display: flex;
		justify-content: space-between;
		width: 100%;
		margin-bottom: 34rpx;
		.left {
			display: flex;
			.unloading-flight-item {
				margin-right: 34rpx;
				.label {
					height: 28rpx;
					font-family: SourceHanSansSC-Regular;
					font-size: 28rpx;
					line-height: 28rpx;
					letter-spacing: 1rpx;
					color: #8c8c8c;
				}
				.value {
					font-family: SourceHanSansSC-Regular;
					font-size: 28rpx;
					font-weight: normal;
					letter-spacing: 0rpx;
					color: #595959;
				}
			}
		}
		
		.right {
			.btn {
				width: 135rpx;
				height: 44rpx;
				border-radius: 22rpx;
				border: solid 1rpx #e5e5e5;
				text-align: center;
				font-family: SourceHanSansSC-Regular;
				font-size: 26rpx;
				font-weight: normal;
				font-stretch: normal;
				line-height: 40rpx;
				letter-spacing: 1rpx;
				color: #8c8c8c;
			}
		}
	}
</style>

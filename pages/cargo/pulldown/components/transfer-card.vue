/*
* 界面名称:适用于交接运往待运区、到达待运区、交接运往货站（装卸接收、拖车司机），到达货站（拖车司机）
* 界面功能:
* 其他    :
* 时间    :2020-10-26 15:16:08
* 作者    :gyb
*/
<template>
	<view>
		<view :class="{'top': !item.showSelectFlag, 'selected':item.showSelectFlag}">
			<view class="left">
				<view class="inner-left">
					<view class="container-number">
						<view @tap.stop="showBottomPopup(item)">
							<template v-if="item.containerCode.split('/').length>1">
								<view>{{item.containerCode.split('/')[0] + '...'}}</view>
							</template>
							<template v-else>
								<view>{{item.containerCode}}</view>
							</template>
						</view>
					</view>
					
					<view class="flight">
						<view class="font">航班:</view>
						<view class="place-font">{{item.flight}}</view>
					</view>
				</view>
				
				<view class="inner-right">
					<view class="abnormal-dest">
						<view class="font">位置:</view>
						<view class="flight-number">{{!judgeArrived()? item.firstTransportTargetAddr : item.secondTransportTargetAddr}}</view>
					</view>
					
					<view class="flight">
						<view class="font">日期:</view>
						<view :class="{'place-font': true, 'not-today': !item.notToday}">{{item.opDate.substr(0, 10)}}</view>
					</view>
				</view>
			</view>
			
			<view class="right">
				<view class="status-right">
					{{formatStatus(item.status, item)}}
				</view>
				
				<view v-if="showUpload" class="upload-image" @tap.stop="uploadImage(item)">上传照片</view>
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
	import { debounce } from '@/common/util/util.js'
	export default {
		mixins: [cardMixin],
		components: {
			imagesBottom
		},
		props: {
			itemOri: {
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
				item: {
					
				}
			}
		},
		watch: {
			itemOri: {
				handler(newval) {
					this.item = newval
				},
				deep: true,
				immediate: true
			}
		},
		methods: {
			// 上传图片
			uploadImage: debounce(function (item) {
				this.$emit('uploadImage', item)
			}),
			showBottomPopup: debounce(function (item) {
				let list = item.containerTypes
				let listb = []
				list.forEach((e, idx) => {
					console.log('listB', e)
					listb.push({
						id: idx,
						containerCode: e.containerCode,
						containerType: e.containerType
					})
				})
				this.$emit('showBottomPopup', listb)
			}),
			judgeArrived () {
				let item = this.item
				let arrivedCondition = 'ARRIVEDSTATION'
				let arrivedIndex = DIC.PULLDOWNSTATUS.findIndex(e => e === arrivedCondition)
				if (arrivedIndex > -1) {
					let itemIndex = DIC.PULLDOWNSTATUS.findIndex(e => e === item.status)
					if (itemIndex > -1) {
						if (itemIndex < arrivedIndex) {
							return false
						} else {
							return true
						}
					}
				}
				return false
			}
		}
	}
</script>

<style lang="scss" scoped>
	$myFont: 27rpx;
	$myMarginBottom: 30rpx;
	.selected {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 15rpx;
		font-weight: 900;
		$myFont: 27rpx;
		$myMarginBottom: 30rpx;
	}
	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 15rpx;
		font-weight: 900;
		$myFont: 32rpx;
		$myMarginBottom: 30rpx;
	}
	
	.left {
		display: flex;
		.inner-left {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-right: 10rpx;
			.container-number {
				height: 48rpx;
				word-wrap:break-word;
				font-family: SourceHanSansSC-Medium;
				font-size: 35rpx;
				color: #262626;
				margin-bottom: $myMarginBottom;
			}
			
			.flight {
				height: 48rpx;
				display: flex;
				align-items: baseline;
				margin-right: 10rpx;
				padding-bottom: 10rpx;
				
				font-size: $myFont;
				font-family: SourceHanSansSC-Medium;
				.font {
					color: #a6a6a6;
				}
				.place-font {
					white-space: nowrap;
				}
			}
		}
		
		.inner-right {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.abnormal-dest {
				height: 48rpx;
				display: flex;
				align-items: baseline;
				font-size: $myFont;
				margin-bottom: $myMarginBottom;
				padding-top: 6rpx;
				.font {
					font-family: SourceHanSansSC-Medium;
					color: #a6a6a6;
				}
				.flight-number {
					font-family: SourceHanSansSC-Medium;
					color: #303133;
				}
			}
			
			.flight {
				height: 48rpx;
				display: flex;
				align-items: baseline;
				font-size: $myFont;
				.font {
					word-wrap:break-word;
					font-family: SourceHanSansSC-Medium;
					color: #a6a6a6;
				}
				.place-font {
					font-family: SourceHanSansSC-Medium;
					color: #303133;
				}
				.not-today {
					color: 'red';
				}
			}
		}
		
	}
	
	.right {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		position: relative;
		right: 16rpx;
		font-size: $myFont;
		.status-right {
			height: 48rpx;
			font-family: SourceHanSansSC-Medium;
			font-size: 32rpx;
			color: #2773e5;
			margin-bottom: $myMarginBottom;
		}
		
		.upload-image {
			height: 48rpx;
			position: relative;
			font-size: 28rpx;
			left:-4rpx;
			top:-4rpx;
			border: solid 1rpx #e5e5e5;
			border-radius: 22rpx;
			font-family: SourceHanSansSC-Medium;
			color: #8c8c8c;
			text-align: center;
			padding-top: 4rpx;
		}
	}
	
</style>

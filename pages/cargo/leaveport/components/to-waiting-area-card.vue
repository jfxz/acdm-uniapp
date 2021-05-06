/*
* 界面名称:适用于货运出港的货站出库的列表卡片的右半部分
* 界面功能:
* 其他    :
* 时间    :2020-8-21 22:47:40
* 作者    :gyb
*/
<template>
	<view class="item-padding-right" style="margin-top: 20rpx;">
		<view class="top">
			<view class="left">
				<view class="container-number">{{item.flight}}</view>
				<view v-if="!operationHistory&&item.carNumber>0" class="container-status-layout">
					<view class="background">{{item.carNumber}}车</view>
				</view>
				<view v-if="item.boardNumber>0" class="container-status-layout">
					<view class="background">{{item.boardNumber}}板</view>
				</view>
				<view v-if="item.boxNumber>0" class="container-status-layout">
					<view class="background">{{item.boxNumber}}箱</view>
				</view>
			</view>
			<view class="right">
				<view class="status-right">
					{{formatStatus(item.status, item)}}
				</view>
			</view>
		</view>
		<view class="flight-place" v-if="showFlightPlace">
			<view class="left">
				<view class="flight" @tap="showBottomPopup(item)">
					<view class="font">集装器:</view>
					<template v-if="item.containerCode&&item.containerCode.split('/').length>1">
						<view :class="{'flight-number': true, 'flight-number-arrive-waiting-area': arrivedWaitingAreaDriver}" style="color:black;font-weight: 900;">{{item.containerCode.split('/')[0] + '...'}}</view>
					</template>
					<template v-else>
						<view :class="{'flight-number': true, 'flight-number-arrive-waiting-area': arrivedWaitingAreaDriver}" style="color:black;font-weight: 900;">{{item.containerCode}}</view>
					</template>
				</view>
			</view>
			<view v-if="arrivedWaitingAreaDriver" class="right">
				
				<view :class="[!arrived?'btn':'btn-light']" @tap.stop="confirmRight(item)">
					{{!arrived?'到达':'已到达'}}
				</view>
			</view>
		</view>
		<view class="wait-area" v-if="showPosition&&showFlightPlace">
			<view class="left">
				<view class="place">
					<view class="font">位置:</view>
					<view class="place-font">
						<template v-if="!toAircraft&&item.isTransportToStandDirectly!='1'">
							{{item.firstTransportTargetAddr}}
						</template>
						<template v-else>
							{{item.standCode}}
						</template>
					</view>
				</view>
				<view v-if="showUpload" class="modify" @tap="open(item)">
					{{modifyText}}>
				</view>
			</view>
			<view v-if="showUpload" class="right">
				<view class="upload-image" @tap="uploadImage(item)">上传照片</view>
			</view>
		</view>
		<view class="wait-area" v-if="!showPosition">
		</view>
		<images-bottom
			@changeSwipeStatus="changeSwipeStatus"
			:item-ori="item">
		</images-bottom>
	</view>
</template>

<script>
	import imagesBottom from '@/pages/cargo/images-bottom.vue'
	import uploadImageDialog from '@/pages/cargo/upload-image-dialog.vue'
	import {DIC} from '@/common/dic.js'
	import cardMixin from '@/pages/cargo/card-mixin'
	import { debounce } from '@/common/util/util.js'
	export default {
		components: {
			imagesBottom,
			uploadImageDialog
		},
		mixins: [cardMixin],
		props: {
			itemOri: {
				type: Object,
				default: () => {}
			},
			arrivedWaitingAreaDriver: {
				type: Boolean,
				default: false
			},
			arrivedCondition: {
				type: String,
				default: ''
			},
			// 是否到机场
			toAircraft: {
				type: Boolean,
				default: false
			},
			modifyText: {
				type: String,
				default: '修改'
			},
			showUpload: {
				type: Boolean,
				default: true
			},
			operationHistory: {
				type: Boolean,
				default: false
			},
			showPosition: {
				type: Boolean,
				default: true
			}
		},
		data () {
			return {
				item: {},
				showFlightPlace: true,
				arrived: false
			}
		},
		watch: {
			itemOri: {
				handler(newval) {
					this.item = newval
					this.showFlightPlace = false
					var that = this
					this.judgeArrived()
					setTimeout(function () {
						that.showFlightPlace = true
					}, 10)
				},
				deep: true,
				immediate: true
			}
		},
		methods: {
			// 滑动图片的时候禁止卡片滑动
			changeSwipeStatus () {
				this.$emit('changeSwipeStatus')
			},
			// 打开待运区修改列表
			open: debounce(function (item) {
				this.$emit('openBottomPopup', item)
			}),
			// 点击卡片右侧确认到达
			confirmRight: debounce(function (item) {
				this.judgeArrived()
				if (!this.arrived) {
					this.$emit('confirmRight', item)
				}
			}),
			// 点击集装器号查看详情
			showBottomPopup: debounce(function (item) {
				let list = item.containerTypes
				let listb = []
				list.forEach((e, idx) => {
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
				let arrivedCondition = this.arrivedCondition
				let arrivedIndex = DIC.CARGOSTATUSD.findIndex(e => e === arrivedCondition)
				if (arrivedIndex > -1) {
					let itemIndex = DIC.CARGOSTATUSD.findIndex(e => e === item.status)
					if (itemIndex > -1) {
						if (itemIndex < arrivedIndex) {
							this.arrived = false
						} else {
							this.arrived = true
						}
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top {
		display: flex;
		justify-content: space-between;
		margin-bottom: 0rpx;
		.left {
			display: flex;
			align-items: center;
			
			.container-number {
				font-weight: 900;
				font-family: SourceHanSansSC-Medium;
				font-size: 35rpx;
				color: #262626;;
				margin-right: 18rpx;
			}
			.container-status-layout {
				position: relative;
				.background {
					min-height: 33rpx;
					min-width: 83rpx;
					border-radius: 6rpx;
					background-color: rgba($color: #ef5c0b, $alpha: 0.07);
					font-size: 25rpx;
					min-width: 63rpx;
					text-align: center;
					color: #ef5c0b;
				}
			}
		}
		.right {
			.status-right {
				font-family: SourceHanSansSC-Medium;
				font-size: 35rpx;
				font-weight: 900;
				line-height: 35rpx;
				color: #2773e5;
			}
		}
	}
	.flight-place {
		display: flex;
		justify-content: space-between;
		margin-top: 5rpx;
		margin-bottom: 5rpx;
		.left {
			display: flex;
			.flight {
				display: flex;
				align-items: center;
				margin-right: 44rpx ;
				.font {
					font-family: SourceHanSansSC-Regular;
					font-size: 28rpx;
					color: #a6a6a6;
					margin-right: 13rpx;
				}
				.flight-number {
					max-width: 400rpx;
					font-family: Roboto-Regular;
					font-size: 28rpx;
					color: #a6a6a6;
				}
				.flight-number-arrive-waiting-area {
					max-width: 240rpx;
					font-family: Roboto-Regular;
					font-size: 28rpx;
					color: #a6a6a6;
				}
			}
			
		}
		.right {
			.btn {
				width: 136rpx;
				height: 44rpx;
				border-radius: 22rpx;
				border: solid 1rpx #07bb6c;
				
				text-align: center;
				font-family: SourceHanSansSC-Regular;
				font-size: 26rpx;
				line-height: 39rpx;
				color: #07bb6c;
			}
			.btn-light {
				opacity: 0.3;
				width: 136rpx;
				height: 44rpx;
				border-radius: 22rpx;
				border: solid 1rpx #07bb6c;
				
				text-align: center;
				font-family: SourceHanSansSC-Regular;
				font-size: 26rpx;
				line-height: 39rpx;
				color: #07bb6c;
			}
		}
	}
	.wait-area {
		display: flex;
		justify-content: space-between;
		margin-bottom: 15rpx;
		.left {
			display: flex;
			align-items: baseline;
			line-height: 47rpx;
			.place {
				display: flex;
				// line-height: 60rpx;
				height: 60rpx;
				.font {
					font-family: SourceHanSansSC-Regular;
					font-size: 28rpx;
					color: #a6a6a6;
					margin-right: 12rpx;
				}
				.place-font {
					font-family: Roboto-Regular;
					font-size: 28rpx;
					font-weight: 900;
					color: #292929;
				}
			}
			.modify {
				margin-left: 10rpx;
				font-family: SourceHanSansSC-Regular;
				font-size: 28rpx;
				color: #07bb6c;
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
				color: #8c8c8c;
				text-align: center;
			}
		}
	}
</style>

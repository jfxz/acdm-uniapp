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
				<view class="container-number">{{item.flight}}</view>
				<view v-if="!operationHistory" class="container-status-layout">
					<view class="background">{{item.carNumber}}车</view>
				</view>
			</view>
			<view class="right" v-if="showLocation">
				<view class="status">{{formatStatus(item.status, item)}}</view>
			</view>
		</view>
		
		<view class="container" v-if="showLocation">
			<view class="container-left" @tap.stop="showBottomPopup(item)">
				<text class="label">板/箱/散装车:</text>
				<template v-if="item.containerCode.split('/').length>1">
					<view class="container-code">{{item.containerCode.split('/')[0] + '...'}}</view>
				</template>
				<template v-else>
					<view class="container-code">{{item.containerCode}}</view>
				</template>
			</view>
			
			<view class="container-right">
				<view v-if="toArrive" :class="[!arrived?'btn':'btn-light']" @tap.stop="confirmRight(item)">
					{{!arrived?arrivedText:'已' + arrivedText}}
				</view>
			</view>
		</view>
		
		<view class="location-upload" v-if="showLocation">
			<view class="left">
				<view class="label">
					位置：
				</view>
				
				<view class="location">
					<template v-if="first">
						{{item.firstTransportTargetAddr}}
					</template>
					<template v-else>
						{{item.secondTransportTargetAddr}}
					</template>
				</view>
				
				<view v-if="showUpload&&modifyFlag" class="btn" @tap="open(item)">
					修改>
				</view>
			</view>
			
			<view v-if="showUpload" class="right">
				<view class="btn" @tap="uploadImage(item)">上传照片</view>
			</view>
		</view>
		
		<images-bottom
		  @changeSwipeStatus="changeSwipeStatus"
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
		props: {
			itemOri: {
				type: Object,
				default: () => {}
			},
			// 位置是否是待运区，如果是，则为待运区，如果否则为货站
			first: {
				type: Boolean,
				default: true
			},
			// 是否准备到达
			toArriveOri: {
				type: Boolean,
				default: false
			},
			// 是否符合到达的条件
			arrivedCondition: {
				type: String,
				default: ''
			},
			// 是否允许修改位置
			modifyFlag: {
				type: Boolean,
				default: false
			},
			// 到达文本
			arrivedText: {
				type: String,
				default: '到达'
			},
			showUpload: {
				type: Boolean,
				default: true
			},
			operationHistory: {
				type: Boolean,
				default: false
			}
		},
		components: {
			imagesBottom
		},
		data () {
			return {
				item: {},
				arrived: false,
				toArrive: false,
				showLocation: true,
				arror: false
			}
		},
		mounted () {
			this.item = this.itemOri
			if (this.item.containerCode.split('/').length > 1) {
				this.arror = true
			}
			this.toArrive = this.toArriveOri
		},
		watch: {
			toArriveOri: {
				handler(newval) {
					var that = this
					this.$nextTick(function(){
						that.toArrive = newval
						that.showLocation = true
					})
				},
				deep: true,
				immediate: true
			},
			itemOri: {
				handler(newval) {
					this.showLocation = false
					var that = this
					this.item = newval
					this.judgeArrived()
					setTimeout(function () {
						that.showLocation = true
					}, 100)
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
			// 上传图片
			uploadImage (item) {
				this.$emit('uploadImage', item)
			},
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
				image.showDelete = !image.showDelete
			},
			// 打开父组件的底部弹出层
			open: debounce(function (item) {
				this.$emit('openBottomPopup', item)
			}),
			confirmRight: debounce(function (item) {
				this.judgeArrived()
				if (!this.arrived) {
					this.$emit('confirmRight', item)
				}
			}),
			showBottomPopup (item) {
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
			},
			
			// 判断当前集装箱状态是否符合已到达条件
			judgeArrived () {
				let item = this.item
				let arrivedCondition = this.arrivedCondition
				let arrivedIndex = DIC.CARGOSTATUSA.findIndex(e => e === arrivedCondition)
				if (arrivedIndex > -1) {
					let itemIndex = DIC.CARGOSTATUSA.findIndex(e => e === item.status)
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
	padding-top: 14rpx;
	margin-bottom: 13rpx;
	.left {
		display: flex;
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
				background-color: rgba($color: #ef5c0b, $alpha: 0.07);
				min-width: 63rpx;
				border-radius: 6rpx;
				color: #ef5c0b;
				text-align: center;
			}
		}
	}
	.right {
		.status {
			height: 33rpx;
			font-family: SourceHanSansSC-Medium;
			font-size: 35rpx;
			line-height: 33rpx;
			letter-spacing: 2rpx;
			color: #2773e5;
			font-weight: 900;
		}
	}
}

.container {
	height: 44rpx;
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 11rpx;
	.container-left {
		display: flex;
		.label {
			height: 28rpx;
			font-family: SourceHanSansSC-Regular;
			font-size: 26rpx;
			line-height: 26rpx;
			letter-spacing: 1rpx;
			color: #a6a6a6;
			margin-right: 10rpx;
		}
		.container-code {
			height: 28rpx;
			width: 230rpx;
			font-family: Roboto-Regular;
			font-size: 28rpx;
			line-height: 28rpx;
			letter-spacing: 1rpx;
			color: #595959;
			font-weight: 900;
		}
	}
	.container-right {
		.btn {
			width: 136rpx;
			height: 44rpx;
			border-radius: 22rpx;
			border: solid 1rpx #07bb6c;
			text-align: center;
			font-family: SourceHanSansSC-Regular;
			font-size: 26rpx;
			line-height: 37rpx;
			letter-spacing: 1rpx;
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
			line-height: 37rpx;
			letter-spacing: 1rpx;
			color: #07bb6c;
		}
	}
}

.location-upload {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
	
	.left {
		display: flex;
		.label {
			font-family: SourceHanSansSC-Regular;
			font-size: 28rpx;
			line-height: 28rpx;
			letter-spacing: 1rpx;
			color: #a6a6a6;
		}
		
		.location {
			font-family: Roboto-Regular;
			font-size: 28rpx;
			line-height: 28rpx;
			letter-spacing: 1rpx;
			color: #595959;
			font-weight: 900;
			margin-right: 17rpx;
		}
		
		.btn {
			font-family: SourceHanSansSC-Regular;
			font-size: 25rpx;
			line-height: 25rpx;
			letter-spacing: 1rpx;
			color: #07bb6c;
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

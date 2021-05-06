/*
* 界面名称:适用于第一步拉下确认主页面与货站人员入库页面
* 界面功能:
* 其他    :
* 时间    :2020-10-19 14:50:56
* 作者    :gyb
*/
<template>
	<view @click="modifyRemark(item)">
		<view class="top">
			<view class="left">
				<view class="container-number">
					<view>{{item.containerCode}}</view>
				</view>
				
				<view class="abnormal-dest">
					<view  class="font" style="width: 120rpx;">拉下类型:</view>
					<view class="place-font" style="line-height: 48rpx;">{{item.pullType||''}}</view>
				</view>
			</view>
			
			<view class="right">
				<view class="status-right">
					{{formatStatus(item.status, item)}}
				</view>
			</view>
		</view>
		<view class="flight-place">
			<view class="left">
				<view class="flight">
					<view class="font" style="width: 68rpx;">重量:</view>
					<view class="flight-number">{{item.cargoWeight||0}}KG</view>
				</view>
				<view class="place" style="margin-left: 0rpx;">
					<view class="font">拉下原因:</view>
					<view :class="{'place-font': true}">{{item.pullReason||''}}</view>
				</view>
			</view>
			<view v-if="showUpload" class="right">
				<view class="upload-image" @tap.stop="uploadImage(item)">上传照片</view>
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
			},
			warehouse: {
				type: Boolean,
				default: false
			}
		},
		data () {
			return {
				item: {}
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
			}) ,
			modifyRemark (item) {
				if (this.warehouse === true) {
					return
				}
				console.log('modifyRemark')
				uni.setStorageSync('pulldown-confirm-remark-item', item)
				uni.navigateTo({
					url: `/pages/cargo/pulldown/pulldown-confirm-input-remark`,
					animationType: 'pop-in',
					animationDuration: 200
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.font {
		font-family: SourceHanSansSC-Regular;
		width: 88rpx;
		font-size: 24rpx;
		color: #a6a6a6;
		font-weight: bold;
	}
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
				height: 48rpx;
				width: 216rpx;
				display: flex;
				font-weight: 900;
				font-family: SourceHanSansSC-Medium;
				font-size: 35rpx;
				color: #262626;
				margin-right: 18rpx;
			}
			
			.abnormal-dest {
				display: flex;
				height: 48rpx;
				line-height: 50rpx;
			}
			
		}
		
		.right {
			.status-right {
				font-family: SourceHanSansSC-Medium;
				font-size: 28rpx;
				font-weight: 900;
				line-height: 35rpx;
				color: #2773e5;
			}
		}
	}
	
	.flight-place {
		display: flex;
		justify-content: space-between;
		margin-bottom: 31rpx;
		
		.left {
			display: flex;
		}
		.right {}
		
		.upload-image {
			width: 116rpx;
			height: 44rpx;
			line-height: 44rpx;
			border: solid 1rpx #e5e5e5;
			border-radius: 22rpx;
			
			font-family: SourceHanSansSC-Regular;
			font-size: 26rpx;
			color: #8c8c8c;
			text-align: center;
		}
		.flight {
			height: 48rpx;
			display: flex;
			align-items: center;
			width:234rpx;
			.font {
				font-family: SourceHanSansSC-Regular;
				font-size: 24rpx;
				color: #a6a6a6;
			}
			.flight-number {
				font-weight: bold;
				font-family: Roboto-Regular;
				font-size: 28rpx;
				height: 48rpx;
				line-height: 50rpx;
				color: #595959;
			}
		}
		.place {
			height: 48rpx;
			display: flex;
			align-items: center;
			.font {
				font-family: SourceHanSansSC-Regular;
				font-size: 24rpx;
				width: 120rpx;
				color: #a6a6a6;
			}
			
		}
	}
	.place-font {
		font-family: Roboto-Regular;
		font-size: 28rpx;
		width: 120rpx;
		font-weight: 900;
		line-height: 48rpx;
		color: #595959;
	}
	
</style>

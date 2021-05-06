/*
* 界面名称:适用于货运出港的货站出库的列表卡片的右半部分
* 界面功能:
* 其他    :
* 时间    :2020-8-21 22:47:40
* 作者    :gyb
*/
<template>
	<view>
		<view class="top">
			<view class="left">
				<view class="container-number">
					{{item.uldCode}}
				</view>
			</view>
		</view>
		<view class="flight-place" style="margin-bottom: 0;">
			<view class="left">
				<view class="flight block">
					<view class="font">航班:</view>
					<view class="flight-number">{{item.flight}}</view>
				</view>
				<view class="flight block">
					<view class="font">日期:</view>
					<view class="flight-number">{{item.opDate}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {DIC} from '@/common/dic.js'
	import cardMixin from '@/pages/cargo/card-mixin'
	export default {
		mixins: [cardMixin],
		props: {
			itemOri: {
				type: Object,
				default: () => {}
			},
			showUpload: {
				type: Boolean,
				default: true
			},
			sort: {
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
			formatterReweighStatus (status) {
				if (status === '1') {
					return '已复称'
				} else if (status === '0') {
					return '未复称'
				} else {
					return ''
				}
			},
			// 上传图片
			uploadImage (item) {
				this.$emit('uploadImage', item)
			},
			
			formatStatus (status, item) {
				if (status === 'TOWAITINGAREA') {
					return '运往' + (item.firstTransportTargetAddr?item.firstTransportTargetAddr:('' + '待运区'))
				} else if (status === 'TOAIRCRAFT') {
					return '运往' + (item.secondTransportTargetAddr?item.secondTransportTargetAddr:('' + '机位'))
				} else if (status === 'ARRIVEDWAITINGAREA') {
					return '到达' + (item.firstTransportTargetAddr?item.firstTransportTargetAddr:('' + '待运区'))
				} else if (status === 'ARRIVEDAIRCRAFT') {
					return '到达' + (item.secondTransportTargetAddr?item.secondTransportTargetAddr:('' + '机位'))
				} else if (this.sort && status === 'NOTOUTOFSTOCK' && item.reweighStatus === '1') {
					return '已复称'
				} else {
					return DIC.CARGOSTATUS[status]
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
			justify-content: space-between;
			align-items: center;
			.container-number {
				display: flex;
				font-weight: 900;
				font-family: SourceHanSansSC-Medium;
				font-size: 35rpx;
				color: #262626;
				margin-right: 18rpx;
			}
			.abnormal-dest {
				display: flex;
				.abnormal {
					color:red;
					font-weight: 900;
					font-size: 32rpx;
					width: 70rpx;
				}
				.abnormal-line-height {
					top: 7rpx;
				}
				.container-status-layout {
					position: relative;
					margin-right: 20rpx;
					.background {
						min-height: 35rpx;
						white-space:nowrap;
						border-radius: 6rpx;
						font-family: SourceHanSansSC-Regular;
						font-size: 25rpx;
						background-color:rgba($color: #F4D000, $alpha: 0.07);
						font-size: 25rpx;
						text-align: center;
						color:#F4D000;
						padding: {
							left: 10rpx;
							right: 10rpx;
						}
					}
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
		margin-bottom: 31rpx;
		
		.left {
			display: flex;
			justify-content: baseline;
			
			.block {
				min-width: 200rpx;
			}
		}
		.right {}
		
		.upload-image {
			width: 136rpx;
			height: 49rpx;
			line-height: 44rpx;
			border: solid 1rpx #e5e5e5;
			border-radius: 22rpx;
			font-family: SourceHanSansSC-Medium;
			font-size: 26rpx;
			color: #8c8c8c;
			text-align: center;
		}
		.flight {
			display: flex;
			line-height: 60rpx;
			height: 60rpx;
			justify-content: baseline;
			.font {
				font-family: SourceHanSansSC-Medium;
				margin-right: 10rpx;
				font-size: 28rpx;
				color: #a6a6a6;
			}
			.flight-number {
				font-family: SourceHanSansSC-Medium;
				font-size: 28rpx;
				color: #262626;
				font-weight: 900;
			}
		}
		.place {
			display: flex;
			line-height: 60rpx;
			height: 60rpx;
			margin-left: 16rpx;
			.font {
				font-family: SourceHanSansSC-Medium;
				font-size: 28rpx;
				margin-right: 10rpx;
				white-space: nowrap;
				color: #a6a6a6;
			}
			.place-font {
				font-family: SourceHanSansSC-Medium;
				font-size: 28rpx;
				font-weight: 900;
				white-space: nowrap;
				color: #262626;
			}
			.not-today {
				color: 'red';
			}
		}
	}
</style>

/*
* 界面名称:拉下查询-配载查询
* 界面功能:
* 其他    :
* 时间    :2020-10-19 14:53:21
* 作者    :gyb
*/
<template>
	<view style="display: flex;">
		<view>
			<view class="top">
				<view class="left">
					<view class="container-number">
						<view style="width: 232rpx;">{{item.containerCode}}</view>
					</view>
				</view>
					
				<view v-show="showRight" class="right">
					<view class="font">重量:</view>
					<view class="place-font">{{item.cargoWeight}}KG</view>
				</view>
			</view>
			<view class="flight-place">
				<view class="flight">
					<view class="font">{{showRight?'拉货原因:':' '}}</view>
					<view class="flight-number">{{showRight?item.pullReason:' '}}</view>
				</view>
			</view>
		</view>
		
		<view v-show="!showRight" class="right">
			<distribution-lastest-card
				class="lastest"
			:loader-list="true"
			:item-ori="item">
			</distribution-lastest-card>
		</view>
	</view>
</template>

<script>
	import imagesBottom from '@/pages/cargo/images-bottom.vue'
	import {DIC} from '@/common/dic.js'
	import cardMixin from '@/pages/cargo/card-mixin'
	import distributionLastestCard from '@/pages/cargo/pulldown/components/distribution-lastest-card.vue'
	export default {
		mixins: [cardMixin],
		components: {
			imagesBottom,
			distributionLastestCard
		},
		props: {
			itemOri: {
				type: Object,
				default: () => {}
			},
			showRight: {
				type: Boolean,
				default: false
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
		}
	}
</script>

<style lang="scss" scoped>
	.top {
		display: flex;
		padding-top: 14rpx;
		margin-bottom: 13rpx;
		.left {
			.container-number {
				font-weight: 900;
				font-family: SourceHanSansSC-Medium;
				font-size: 35rpx;
				letter-spacing: 2rpx;
				color: #262626;
				margin-right: 18rpx;
			}
			
		}
		.right {
			display: flex;
			font-weight: 900;
			line-height: 50rpx;
			.font {
				font-family: SourceHanSansSC-Medium;
				font-size: 28rpx;
				width: 70rpx;
				letter-spacing: 1rpx;
				color: #a6a6a6;
			}
			.place-font {
				font-family: SourceHanSansSC-Medium;
				font-size: 28rpx;
				letter-spacing: 1rpx;
				color: #262626;
			}
		}
	}
	
	.flight-place {
		font-weight: 900;
		margin-bottom: 10rpx;
		.flight {
			display: flex;
			align-items: center;
			.font {
				font-family: SourceHanSansSC-Medium;
				width: 138rpx;
				font-size: 28rpx;
				letter-spacing: 1rpx;
				color: #a6a6a6;
			}
			.flight-number {
				font-family: SourceHanSansSC-Medium;
				font-size: 28rpx;
				letter-spacing: 1rpx;
				color: #262626;
			}
		}
	}
	
	.lastest {
		padding: {
			top: 2rpx;
			left: 5rpx;
		}
	}
</style>

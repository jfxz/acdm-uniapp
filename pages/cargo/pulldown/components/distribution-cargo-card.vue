/*
* 界面名称:拉下查询-装卸、特车拉下、货站系统
* 界面功能:
* 其他    :
* 时间    :2020-10-19 14:56:07
* 作者    :gyb
*/
<template>
	<view style="display: flex;">
		<view>
			<view class="top">
				<view class="left">
					<view class="container-number">
						<view>{{item.containerCode}}</view>
					</view>
					
					<view class="flight">
						<view class="font">航班号:</view>
						<view class="place-font">{{item.flight}}</view>
					</view>
				</view>
				<view class="right">
					<view v-show="showRight" class="abnormal-dest">
						<view class="font">重量:</view>
						<view class="place-font">{{item.cargoWeight}}</view>
					</view>
					<view v-show="showRight" class="place">
						<view class="font">拉货原因:</view>
						<view class="place-font">
							{{item.pullReason}}
						</view>
					</view>
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
			.container-number {
				display: flex;
				font-weight: 900;
				font-family: SourceHanSansSC-Medium;
				font-size: 35rpx;
				letter-spacing: 2rpx;
				color: #262626;
				margin-right: 18rpx;
				width: 232rpx;
			}
			
			.flight {
				display: flex;
				align-items: center;
				font-weight: 900;
				margin-top: 2rpx;
				.font {
					font-family: SourceHanSansSC-Medium;
					width: 108rpx;
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
		
		.right {
			.abnormal-dest {
				display: flex;
				font-weight: 900;
				line-height: 50rpx;
				.font {
					font-family: SourceHanSansSC-Medium;
					font-size: 28rpx;
					width: 80rpx;
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
			.place {
				display: flex;
				align-items: center;
				font-weight: 900;
				.font {
					font-family: SourceHanSansSC-Medium;
					font-size: 28rpx;
					width: 130rpx;
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
	}
</style>

/*
* 界面名称:适用于货运进港的到达待运区、到达货站、交接运往待运区、交接运往货站的列表卡片的右半部分
* 界面功能:
* 其他    :
* 时间    :2020-8-21 11:17:40
* 作者    :gyb
*/
<template>
	<view v-show="refresh">
		<view class="cardRight">
			<view class="top">
				<view class="left">
					<view class="container-number">{{item.flight}}</view>
				</view>
				<view class="right">
					<view class="status">
						<uni-combox
							labelWidth="40px"
						 :candidates="statuses2"
							v-model="item.statusName"
						 @clickStatus="clickStatus">
						</uni-combox>
					</view>
				</view>
			</view>
			<view class="unloading-flight-row">
				<view class="unloading-flight-item">
					<text class="label">日期:</text>
					<text class="value">{{item.opDate?item.opDate:'无'}}</text>
				</view>
				<view class="number">
					<span v-if="item.abNumber>0" style="color:red;margin-right: 20rpx;">{{item.abNumber}}车</span>
					<span>{{item.number}}车</span>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {DIC} from '@/common/dic.js'
	import cardMixin from '@/pages/cargo/card-mixin.js'
	import uniCombox from "@/components/uni-combox-new/uni-combox"
	export default {
		mixins: [cardMixin],
		components: {
			uniCombox
		},
		props: {
			itemOri: {
				type: Object,
				default: () => {}
			}
		},
		data () {
			return {
				refresh: true,
				menuStatus: false,
				// 状态列表
				statuses2: ['未复称', '已复称', '已出库'],
				item: {},
				arrived: false
			}
		},
		mounted () {
			this.item = this.itemOri
			this.item.statusName = this.formatStatus(this.item.status, this.item)
		},
		methods: {
			// 上传图片
			uploadImage (item) {
				this.$emit('uploadImage', item)
			},
			clickStatus (status) {
				let e ={
					id: this.item.id,
					status: status
				}
				this.$emit('clickStatus', e)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top {
		display: flex;
		justify-content: space-between;
		padding-top: 15rpx;
		margin-bottom: 27rpx;
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
			
		}
		.right {
			.status {
				height: 33rpx;
				font-family: SourceHanSansSC-Medium;
				font-size: 35rpx;
				line-height: 33rpx;
				letter-spacing: 2rpx;
				color: #2773e5;
				font-weight: bold;
			}
		}
	}
	.unloading-flight-row {
		display: flex;
		justify-content: space-between;
		width: 100%;
		margin-bottom: 34rpx;
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
				font-family: Roboto-Regular;
				font-size: 28rpx;
				font-weight: 900;
				letter-spacing: 1rpx;
				color: #595959;
			}
		}
		.number {
			font-family: Roboto-Regular;
			font-size: 28rpx;
			font-weight: 900;
			letter-spacing: 1rpx;
			color: #595959;
		}
	}
</style>
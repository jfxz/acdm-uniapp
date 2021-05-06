<template>
	<view class="card">
		<view class="row">
			<view class="carrier-flight">
				{{card.carrier}}{{card.flight}}
			</view>
			
			<view class="status">
				{{formatter(card.status)}}
			</view>
		</view>
		
		<view class="row">
			<view class="block container-type">
				<view class="label">
					集装器型号:
				</view>
				<view class="value">
					{{card.containerType}}
				</view>
			</view>
			
			<view :class="{'block': true, 'container-number':true, 'right-min-width': !showBtn}">
				<view class="label">
					集装器数量:
				</view>
				<view class="value">
					{{card.quantity}}
				</view>
			</view>
			
			<view v-if="showBtn" class="btn" @tap="confirm">
				确认
			</view>
		</view>
	</view>
</template>

<script>
	import { airlineConfirm, onError } from '@/api/empty-container/index.js'
	export default {
		props: {
			card: {
				type: Object,
				default: () => {}
			},
			showBtn: {
				type: Boolean,
				default: false
			}
		},
		data () {
			return {
				
			}
		},
		methods: {
			formatter (status) {
				switch (status) {
					case 0:
						return '完整'
					case 1:
						return '破损'
				}
			},
			confirm () {
				uni.showLoading({
					title: '加载中'
				})
				airlineConfirm({
					id: this.card.id
				}).then(res => {
					console.log('airlineConfirm', res)
					if (res.status) {
						
					}
					uni.showToast({
						title: res.message,
						icon: 'none',
						duration: 2000
					})
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.card {
		border-radius: 20rpx;
		background-color: #ffffff;
		padding: 28rpx;
		padding-bottom: 13rpx;
		margin-bottom: 10rpx;
		.row {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: baseline;
			padding-bottom: 15rpx;
			.block {
				display: flex;
				.label {
					margin-right: 10rpx;
					font-family: SourceHanSansSC-Regular;
					font-size: 28rpx;
					font-weight: normal;
					color: #a6a6a6;
				}
				.value {
					font-family: Roboto-Regular;
					font-size: 28rpx;
					font-weight: 600;
					color: #595959;
				}
			}
			.right-min-width {
				min-width: 250rpx;
			}
			.container-number .container-type {
				font-family: Roboto-Bold;
				font-size: 35rpx;
				font-weight: 900;
				color: #262626;
			}
			.status {
				font-family: SourceHanSansSC-Medium;
				font-size: 35rpx;
				font-weight: 900;
				color: #2773e5;
			}
			.carrier-flight {
				font-family: Arial-BoldMT;
				font-size: 35rpx;
				font-weight: 900;
				color: #333333;
			}
			.btn {
				width: 136rpx;
				height: 44rpx;
				border-radius: 22rpx;
				border: solid 1rpx #e5e5e5;
				
				text-align: center;
				font-family: SourceHanSansSC-Regular;
				font-size: 26rpx;
				color: #8c8c8c;
			}
		}
	}
</style>

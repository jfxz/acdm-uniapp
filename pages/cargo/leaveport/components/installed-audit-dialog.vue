<template>
	<view class="cu-modal" :class="showModal==true?'show':''">
		<view class="cu-dialog" style="max-width:582rpx;border-radius: 21upx;">
			<view class="action" @tap="close">
				<text class="cuIcon-close text-red action-image"></text>
			</view>
			<image style="width:100%;height:285rpx;" src="@/static/loading-changes.png"></image>
			<view class="modal-dialog-layout-change">
				<view class="top">
					<view class="font">装载变化</view>
				</view>
				<view class="middle">
					<block v-for="row in list" :key="row.cabin">
						<view class="row">
							<view class="left">
								<view class="cabin">{{row.cabin}}</view>
							</view>
							<view v-if="row.hasOwnProperty('loadShedding')" class="right">
								减少{{row.loadShedding}}kg
							</view>
							<view v-else class="right">
								增加{{row.increaseWeight}}kg
							</view>
						</view>
						<view class="line"></view>
					</block>
				</view>
				<view class="btns">
					<view class="cancel" @tap="close">取消</view>
					<view class="confirm" @tap="confirm">确定</view>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import { getAuditChange, onError, validatenull } from '@/api/cargo/index.js'
	import { debounce } from '@/common/util/util.js'
	export default {
		data () {
			return {
				showModal: false,
				list: []
			}
		},
		methods: {
			open (form) {
				this.$loading()
				this.list = []
				getAuditChange(form).then(res => {
					if (res.status && !validatenull(res.data)) {
						for (let key in res.data) {
							let row = {
								cabin: key
							}
							if (res.data[key].hasOwnProperty('decrease')) {
								row.loadShedding = res.data[key].decrease
							}
							if (res.data[key].hasOwnProperty('increase')) {
								row.increaseWeight = res.data[key].increase
							}
							this.list.push(row)
						}
						this.showModal = true
					}
					this.$message(res.message)
					uni.hideLoading()
					
				}).catch(err => {
					onError(err)
				})
			},
			close () {
				this.showModal = false
			},
			confirm: debounce(function () {
				this.$emit('confirm')
			})
		}
	}
</script>

<style lang="scss" scoped>
	.action {
		.action-image {
			position:absolute;
			right:-1rpx;
			z-index:999;
		}
	}
	.modal-dialog-layout-change {
		padding-bottom: 43rpx;
		padding-left: 67rpx;
		padding-right: 67rpx;
		.top {
			.font {
				font-family: SourceHanSansSC-Medium;
				font-size: 35rpx;
				letter-spacing: 2rpx;
				font-weight: bold;
				color: #262626;
			}
		}
		.middle {
			margin-top: 39rpx;
			.row {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-left: 42rpx;
				padding-right: 37rpx;
				padding-bottom: 24rpx;
				.left {
					.cabin {
						font-family: Roboto-Regular;
						font-size: 33rpx;
						letter-spacing: 2rpx;
						color: #262626;
						margin-bottom: 12rpx ;
					}
				}
				.right {
					font-family: SourceHanSansSC-Regular;
					font-size: 29rpx;
					letter-spacing: 1rpx;
					color: #262626;
				}
			}
			.line {
				width: 580rpx;
				height: 1rpx;
				border: solid 1rpx #e5e5e5;
				margin-bottom: 24rpx;
			}
		}
		.btns  {
			display: flex;
			width: 100%;
			justify-content: center;
			.cancel {
				width: 206rpx;
				height: 69rpx;
				line-height: 63rpx;
				border-radius: 35rpx;
				border: solid 1rpx #2675e5;
				font-family: SourceHanSansSC-Regular;
				font-size: 33rpx;
				letter-spacing: 2rpx;
				color: #008ffd;
				margin-right: 39rpx;
			}
			.confirm {
				width: 206rpx;
				height: 69rpx;
				line-height: 63rpx;
				background-color: #008ffd;
				border-radius: 35rpx;
				font-family: SourceHanSansSC-Regular;
				font-size: 33rpx;
				letter-spacing: 2rpx;
				color: #ffffff;
			}
		}
	}
</style>

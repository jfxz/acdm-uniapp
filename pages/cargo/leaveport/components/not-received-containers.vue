<template>
	<view class="cu-modal" :class="notReceivedFlag==true?'show':''">
		<view class="cu-dialog" style="max-width:582rpx;border-radius: 25upx;">
			<view class="action" @tap="notReceivedFlag=false">
				<image src="@/static/close-popup.png"
					class="action-image"></image>
			</view>
			<image style="width:100%;height:285rpx;" src="@/static/notReceiveds.png"></image>
			<view class="modal-dialog-layout">
				<view class="top">
					{{topTitle}}
				</view>
				<view class="middle">
					<block v-for="item in notReceiveds" :key="item">
						<text>{{item}}</text>
					</block>
					<view>{{middleText}}</view>
				</view>
				<view class="btn" @tap="notReceivedFlag=false">{{confirmText}}</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			topTitle: {
				type: String,
				default: '集装器未接收'
			},
			middleText: {
				type: String,
				default: '集装器未进行接收，请检查'
			},
			confirmText: {
				type: String,
				default: '去接收'
			}
		},
		data () {
			return {
				notReceivedFlag: false,
				notReceiveds: []
			}
		},
		methods: {
			setList (list) {
				this.notReceiveds = [...list]
			},
			setFlag (flag) {
				this.notReceivedFlag = flag
			}
		}
	}
</script>

<style lang="scss" scoped>
	.action {
		.action-image {
			height:61rpx;
			width:61rpx;
			position:absolute;
			right:0rpx;
			z-index:99999;
		}
	}
	.modal-dialog-layout {
		padding-bottom: 43rpx;
		padding-left: 67rpx;
		padding-right: 67rpx;
		.top {
			font-family: SourceHanSansSC-Medium;
			font-size: 35rpx;
			letter-spacing: 2rpx;
			color: #333333;
			margin-bottom: 53rpx;
			margin-top: 33rpx;
		}
		.middle {
			font-family: Roboto-Regular;
			font-size: 28rpx;
			letter-spacing: 1rpx;
			color: #8c8c8c;
			margin-bottom: 63rpx;
		}
		.btn {
			width: 445rpx;
			height: 69rpx;
			background-color: #2773e5;
			border-radius: 35rpx;
			margin: 0 auto;
			font-family: SourceHanSansSC-Regular;
			font-size: 33rpx;
			line-height: 69rpx;
			letter-spacing: 2rpx;
			color: #ffffff;
		}
	}
</style>

/*
* 界面名称:货物进港-卸机-板箱列表-详细信息弹窗
* 界面功能:
* 其他    :
* 时间    :2020-8-22 15:42:41
* 作者    :gyb
*/
<template>
	<view class="cu-modal" :class="showModal==true?'show':''">
		<view class="cu-dialog"
			style="max-width:582rpx;border-radius: 21upx;">
			<view class="action" @tap="cancel">
				<image class="action-image" src="@/static/close-popup.png"></image>
			</view>
			<view class="plate-box-modal-title">
				{{title}}
			</view>
			<view class="modal-dialog-layout">
				<view class="middle">
					{{message}}
				</view>
				<view class="btns">
					<view class="confirm" @tap="confirm">确定</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {DIC} from '@/common/dic.js'
	export default {
		props: {
			title: {
				type: String,
				default: ''
			}
		},
		data () {
			return {
				list: [],
				IfliList: [],
				showModal: false,
				message: ''
			}
		},
		methods: {
			open (message) {
				this.message = message
				this.showModal = true
			},
			confirm () {
				this.$emit('confirm')
				this.showModal = false
			},
			cancel () {
				this.showModal = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.plate-box-modal-title {
		background-color: #1891ff;
		height:62rpx;
		width:100%;
		font-family: SourceHanSansSC-Medium;
		font-size: 35rpx;
		color: #ffffff;
		text-align:center;
		line-height:176rpx;
	}
	.action {
		.action-image {
			height:61rpx;
			width:61rpx;
			position:absolute;
			right:0;
			z-index:99999;
		}
	}
	.modal-dialog-layout {
		padding-bottom: 20rpx;
		padding-left: 37rpx;
		padding-right: 37rpx;
		.middle {
			margin: 47rpx 65rpx 56rpx 65rpx;
			word-break: break-all;
			.value {
				margin-bottom: 20rpx;
				font-family: Roboto-Regular;
				font-size: 29rpx;
				line-height: 29rpx;
				letter-spacing: 1rpx;
				color: #2d3033;
				.value-bold {
					font-weight: bold;
				}
			}
		}
		.btns  {
			display: flex;
			width: 100%;
			justify-content: center;
			.confirm {
				width: 206rpx;
				height: 69rpx;
				line-height: 63rpx;
				background-color: #1891ff;
				border-radius: 35rpx;
				font-family: SourceHanSansSC-Regular;
				font-size: 33rpx;
				letter-spacing: 2rpx;
				color: #ffffff;
			}
		}
	}
</style>

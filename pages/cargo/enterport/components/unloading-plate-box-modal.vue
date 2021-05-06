/*
* 界面名称:货物进港-卸机-板箱列表-详细信息弹窗
* 界面功能:
* 其他    :
* 时间    :2020-8-22 15:42:41
* 作者    :gyb
*/
<template>
	<view class="cu-modal" :class="showModal==true?'show':''">
		<view class="cu-dialog" style="max-width:582rpx;border-radius: 21upx;">
			<view class="action" @tap="cancel">
				<image src="@/static/close-popup.png"></image>
			</view>
			<view class="plate-box-modal-title">
				{{title}}
			</view>
			<view class="modal-dialog-layout">
				<view class="middle">
					<view class="left">
						<view class="item">
							<view class="label">航班号:</view>
							<view class="value">{{item.flight}}</view>
						</view>
						
						<view class="item">
							<view class="label">机号:</view>
							<view class="value">{{item.registration}}</view>
						</view>
						
						<view class="item">
							<view class="label">机位:</view>
							<view class="value">{{item.standCode}}</view>
						</view>
					</view>
					
					<view class="right">
						<view class="item">
							<view class="label">舱位:</view>
							<view class="value">{{item.cargoHold}}</view>
						</view>
						
						<view class="item">
							<view class="label">重量:</view>
							<view class="value">{{item.cargoWeight||0}}KG</view>
						</view>
					</view>
					
				</view>
				
				<view class="btns">
					<view class="cancel" @tap="cancel">取消</view>
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
				item: {},
				showModal: false,
			}
		},
		methods: {
			open (e) {
				this.item = e
				this.showModal = true
			},
			confirm () {
				this.$emit('changeStatus', this.item.containerCode)
				this.showModal = false
			},
			cancel () {
				this.showModal = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.action {
		image {
			height:61rpx;
			width:61rpx;
			position:absolute;
			right:0rpx;
			z-index:99999;
		}
	}
	.plate-box-modal-title {
		background-color:#2675E5;
		height:163rpx;
		width:100%;
		font-family: SourceHanSansSC-Medium;
		font-size: 35rpx;
		color: #ffffff;
		text-align:center;
		line-height:176rpx;
	}
	
	.modal-dialog-layout {
		padding-bottom: 101rpx;
		padding-left: 37rpx;
		padding-right: 37rpx;
		
		.middle {
			display: flex;
			justify-content: space-between;
			margin: 47rpx 65rpx 56rpx 65rpx;
			
			.left {
			}
			.right {
			}
			
			.item {
				height: 29rpx;
				text-align: left;
				display: flex;
				margin-bottom: 47rpx;
				.label {
					min-width: 76rpx;
					font-family: SourceHanSansSC-Regular;
					font-size: 25rpx;
					font-weight: normal;
					font-stretch: normal;
					line-height: 29rpx;
					letter-spacing: 1rpx;
					color: #7b848c;
				}
				.value {
					font-family: Roboto-Regular;
					font-size: 29rpx;
					font-weight: normal;
					font-stretch: normal;
					line-height: 29rpx;
					letter-spacing: 1rpx;
					color: #2d3033;
				}
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

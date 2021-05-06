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
				<image src="@/static/close-popup.png" class="action-image"></image>
			</view>
			<view class="plate-box-modal-title">
				{{title}}
			</view>
			<view class="modal-dialog-layout">
				<view class="top">
				</view>
				<view class="middle">
					<block v-for="(flight, index) in list" :key="index">
						<view class="value" @tap="confirm(flight)">
							航班:
							<span style="font-weight:bold;margin-left: 10rpx;">{{flight}}</span>
						</view>
					</block>
				</view>
				
				<view class="btns">
					<view class="cancel" @tap="cancel">取消</view>
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
				default: '请选择要查询的航班号'
			}
		},
		data () {
			return {
				item: {},
				list: [],
				showModal: false,
			}
		},
		methods: {
			open (list) {
				this.list = list
				this.showModal = true
			},
			confirm (flight) {
				this.$emit('selectFlight', flight)
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
		.action-image {
			height:61rpx;
			width:61rpx;
			position:absolute;
			right:0rpx;
			z-index:99999;
		}
	}
	.plate-box-modal-title {
		background-color: #1890ff;
		height:62rpx;
		width:100%;
		font-family: SourceHanSansSC-Medium;
		font-size: 35rpx;
		color: #ffffff;
		text-align:center;
		line-height:65rpx;
	}
	
	.modal-dialog-layout {
		padding-bottom: 20rpx;
		padding-left: 37rpx;
		padding-right: 37rpx;
		.top {
			font-family: SourceHanSansSC-Regular;
			font-size: 25rpx;
			letter-spacing: 1rpx;
			color: #7b848c;
		}
		
		.middle {
			margin: 47rpx 65rpx 56rpx 65rpx;
			
			.value {
				margin-bottom: 30rpx;
				font-family: Roboto-Regular;
				font-size: 29rpx;
				font-weight: normal;
				font-stretch: normal;
				line-height: 29rpx;
				letter-spacing: 1rpx;
				font-weight: 700;
				color: #2d3033;
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
				margin-left: 49rpx;
			}
		}
		
	}
</style>

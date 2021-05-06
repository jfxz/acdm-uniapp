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
				<!-- 货物超时 -->
			</view>
			<view class="modal-dialog-layout">
				<view class="middle">
					<block v-for="(msg, index) in messages" :key="index">
						<view class="value">
							<span class="value-bold">{{msg.messageText}}</span>
						</view>
					</block>
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
	import { confirmAdditionalCar } from '@/api/cargo/index.js'
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
				messages: []
			}
		},
		methods: {
			open (messages) {
				this.messages = messages
				this.showModal = true
			},
			confirm () {
				let userId = uni.getStorageSync('user_id')
				if (!userId) {
					this.$message('userId不存在')
					return
				}
				confirmAdditionalCar({
				  userId: userId,
					messageIds: this.messages.map(e => e.id)
				}).then(res => {
					console.log('confirmAdditionalCar-res', res)
					if (res.status) {
					}
					this.showModal = false
					uni.hideLoading()
				}).catch(err => {
					onError(err)
					this.showModal = false
				})
			},
			cancel () {
				this.showModal = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.plate-box-modal-title {
		background-color: red;
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
				background-color: red;
				border-radius: 35rpx;
				font-family: SourceHanSansSC-Regular;
				font-size: 33rpx;
				letter-spacing: 2rpx;
				color: #ffffff;
			}
		}
	}
</style>

/*
* 界面名称:底部弹出层输入
* 界面功能:
* 其他    :
* 时间    :2020-8-22 17:39:23
* 作者    :gyb
*/
<template>
	<uni-popup :keyboard-height="keyboardHeight" ref="trailerPopup" type="bottom">
		<view class="popup-bottom">
			<view class="top-bar">
				<view class="cancel-btn" @tap="close">取消</view>
				<view class="title">输入拖车号</view>
				<view class="fix-right"></view>
			</view>
			
			<view class="search-bar">
				<view class="search-input">
					<input :focus="focus" type="number" v-model="inputValue" :adjust-position="false" class="search-text" placeholder="请输入拖车号"/>
					<image v-if="inputValue!=''"  style="height:40rpx;width:40rpx;" src="@/static/input-delete-grey.png" @tap="inputValue=''"></image>
					<image src="@/static/scan-blue.png" @tap="scanCode"></image>
				</view>
			</view>
			
			<view class="confirm-btn" @touchend.prevent="confirm" @tap="confirm">完成交接</view>
		</view>
	</uni-popup>
</template>

<script>
	import { debounce } from '@/common/util/util.js'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	export default {
		components: {
			uniPopup,
			uniPopupMessage,
			uniPopupDialog
		},
		data () {
			return {
				inputValue: '',
				keyboardHeight: 0,
				focus: false
			}
		},
		mounted () {
			uni.onKeyboardHeightChange(res => {
				this.keyboardHeight = res.height
			})
		},
		methods: {
			open () {
				let userDriverNumber = uni.getStorageSync('user_driver_number')
				if (userDriverNumber) {
					let userName = uni.getStorageSync('user_name')
					if (userDriverNumber.userName === userName) {
						this.inputValue = userDriverNumber.driverNumber
					}
				}
				this.$refs.trailerPopup.open()
			},
			close () {
				this.$refs.trailerPopup.close()
			},
			scanCode () {
				this.$emit('scanCode')
			},
			confirm: debounce(function () {
				if (this.inputValue === '') {
					this.$message('拖车号不可为空')
					return
				}
				let userName = uni.getStorageSync('user_name')
				if (userName) {
					uni.setStorageSync('user_driver_number', {
						userName: userName,
						driverNumber: this.inputValue
					})
				}
				this.$emit('confirm', this.inputValue)
				this.close()
			}, 300)
		}
	}
</script>

<style lang="scss" scoped>
	.popup-bottom {
		width: 100%;
		background-color: #ffffff;
		padding: 52rpx 32rpx 52rpx 32rpx;
		border-radius: 35rpx 35rpx 0rpx 0rpx;
		.top-bar {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.cancel-btn {
				font-family: SourceHanSansSC-Regular;
				font-size: 32rpx;
				letter-spacing: 2rpx;
				color: #a6a6a6;
			}
			.title {
				font-family: SourceHanSansSC-Regular;
				font-size: 38rpx;
				letter-spacing: 2rpx;
				color: #333333;
			}
			.fix-right {
				width:38rpx;
				height: 38rpx;
			}
		}
		
		.confirm-btn {
			width: 683rpx;
			height: 86rpx;
			background-color: #008ffd;
			border-radius: 43rpx;
			margin-top: 72rpx;
			
			font-family: SourceHanSansSC-Regular;
			font-size: 35rpx;
			text-align: center;
			line-height: 86rpx;
			letter-spacing: 2rpx;
			color: #ffffff;
		}
	}
	.search-bar {
		margin-top: 59rpx;
		.search-input {
			width: 100%;
			height: 86rpx;
			background-color: #f0f0f0;
			border-radius: 43rpx;
			display: flex;
			align-items: center;
			.search-text {
				padding-left: 26rpx;
				width: 90%;
				
				font-family: SourceHanSansSC-Regular;
				font-size: 28rpx;
				letter-spacing: 1rpx;
				color: #a6a6a6;
			}
			image {
				width: 42rpx;
				height: 42rpx;
				margin-right: 20rpx;
			}
		}
	}
</style>

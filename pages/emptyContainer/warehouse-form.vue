/*
* 界面名称:货站空集装器需求
* 界面功能:
* 其他    :
* 时间    :2020-11-23 14:33:54
* 作者    :gyb
*/
<template>
	<view class="inner-form">
		<u-navbar
			back-icon-color="#ffffff"
		  title="空集装器需求"
			title-color="#ffffff"
		 :background="background">
		</u-navbar>
		
		<view class="form">
			<view class="form-main">
				<view class="row">
					<view class='inner-row'>
						<view class="label">
							承运人
						</view>
						<u-input
							:maxlength="2"
						  v-model="form.carrier"
							:custom-style="inputStyle"
							input-align="right"/>
					</view>
				</view>
				
				<view class="row">
					<view class='inner-row'>
						<view class="label">
							航班号
						</view>
						<u-input
						  v-model="form.flight"
							:custom-style="inputStyle"
							input-align="right"/>
					</view>
				</view>
				
				<view class="row">
					<view class='inner-row'>
						<view class="label">
							集装器型号
						</view>
						<u-input
						  v-model="form.containerType"
							:custom-style="inputStyle"
							input-align="right"/>
					</view>
				</view>
				
				<view class="row">
					<view class='inner-row'>
						<view class="label">
							集装器数量
						</view>
						<u-input
						  v-model="form.quantity"
							:custom-style="inputStyle"
							input-align="right"/>
					</view>
				</view>
			</view>
		
			<view class="btn-row">
				<view class="btn" @tap="createWarehouseBox">
					发送
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { createWarehouseBox, onError } from '@/api/empty-container/index.js'
	import uNumberBox from '@/uview-ui/components/u-number-box/u-number-box.vue'
	export default {
		components: {
			uNumberBox
		},
		data () {
			return {
				background: {
					'background-color': '#4191EA'
				},
				inputStyle: {
					color: '#bdbdbd',
					'letter-spacing': '2rpx',
					'font-family': 'SourceHanSansSC',
					'font-size': '40rpx',
					'font-weight': '540'
				},
				form: {
					carrier: '',
					flight: '',
					containerType: '',
					quantity: 1,
				}
			}
		},
		mounted () {
			this.form = {
				carrier: '',
				flight: '',
				containerType: '',
				quantity: 1,
			}
		},
		methods: {
			createWarehouseBox () {
				uni.showLoading({
					title: '加载中'
				})
				createWarehouseBox(this.form).then(res => {
					console.log('createWarehouseBox', res)
					if (res.status) {
						
					}
					uni.showToast({
						title: res.message,
						icon: 'none',
						duration: 2000
					})
					uni.hideLoading()
					uni.navigateBack()
				}).catch(err => {
					onError(err)
					uni.navigateBack()
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.inner-form {
		$fontSize: 40rpx;
		$fontWeight: 540;
		width: 100%;
		height: 100vh;
		.form {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin: 0 auto;
			margin-top: 20rpx;
			border-radius: 19rpx;
			width: calc(100% - 50rpx);
			height: calc(100% - 180rpx);
			background-color: #ffffff;
			padding-bottom: 15rpx;
			.form-main {
				.row {
					padding: 10rpx 20rpx;
					.inner-row {
						margin: 0 auto;
						display: flex;
						justify-content: space-between;
						width: calc(100% - 10rpx);
						padding: 36rpx 10rpx;
						padding-top: 20rpx;
						border-bottom: 1rpx solid #e6e6e6;
						letter-spacing: 2rpx;
						font-family: SourceHanSansSC;
						font-size: $fontSize;
						font-weight: $fontWeight;
						align-items: center;
						.label {
							color: #818284;
						}
						.value {
							color: #bdbdbd;
						}
					}
				}
			}
			
			.btn-row {
				.btn {
					margin: 0 auto;
					background-color: #4db67e;
					width: calc(100% - 30rpx);
					color: #ffffff;
					text-align: center;
					border-radius: 18rpx;
					font-size: $fontSize;
					padding: 20rpx 0;
				}
			}
		}
	}
</style>


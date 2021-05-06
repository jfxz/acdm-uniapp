/*
* 界面名称:航司空集装器需求
* 界面功能:
* 其他    :
* 时间    :2020-11-20 10:25:45
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
						  v-model="form.container"
							:custom-style="inputStyle"
							input-align="right"/>
					</view>
				</view>
				
				<view class="row">
					<view class='inner-row'>
						<view class="label">
							集装器状态
						</view>
						<picker
						  :value="statusIdx"
							:range="statuses"
							@change="changeStatus">
							<view style="color:#818284">
								{{statuses[statusIdx]}}
							</view>
						</picker>
					</view>
				</view>
				
				<view class="row">
					<view class='inner-row'>
						<view class="label">
							集装器自重
						</view>
						<u-input
						  v-model="form.netWeight"
							:custom-style="inputStyle"
							input-align="right"/>
					</view>
				</view>
				
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
							备注
						</view>
						<u-input
						  v-model="form.remark"
							:custom-style="inputStyle"
							input-align="right"/>
					</view>
				</view>
			</view>
		
			<view class="btn-row">
				<view class="btn" @tap="createAirlineBox">
					发送
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uNumberBox from '@/uview-ui/components/u-number-box/u-number-box.vue'
	import { createAirlineBox, onError } from  '@/api/empty-container/index.js'
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
					container: '',
					flight: '',
					netWeight: 0,
					remark: '',
					status: 0
				},
				statusIdx: 0,
				statuses: ['完好', '破损'],
			}
		},
		mounted () {
			this.form = {
				carrier: '',
				container: '',
				flight: '',
				netWeight: 0,
				remark: '',
				status: 0
			}
		},
		methods: {
			changeStatus (e) {
				console.log('changeStatus', e)
				this.statusIdx = e.target.value
				this.form.status = e.target.value
			},
			createAirlineBox () {
				uni.showLoading({
					title: '加载中'
				})
				createAirlineBox(this.form).then(res => {
					console.log('createAirlineBox', res)
					if (res.status) {
						
					}
					uni.showToast({
						title: res.message,
						icon: 'none',
						duration: 2000
					})
					uni.hideLoading()
					setTimeout(function () {
						uni.navigateBack()
					}, 2000)
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


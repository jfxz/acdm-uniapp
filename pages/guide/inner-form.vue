/*
* 界面名称:登机口引导单-内场客服表单输入
* 界面功能:
* 其他    :
* 时间    :2020-11-20 10:25:45
* 作者    :gyb
*/
<template>
	<view class="inner-form">
		<u-navbar
			back-icon-color="#ffffff"
		  title="登机口引导单"
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
						<view class="value">
							{{form.flight}}
						</view>
					</view>
				</view>
				
				<view class="row">
					<view class='inner-row'>
						<view class="label">
							机位
						</view>
						<view class="value">
							{{form.stand}}
						</view>
					</view>
				</view>
				
				<view class="row">
					<view class='inner-row'>
						<view class="label">
							机号
						</view>
						<view class="value">
							{{form.registration}}
						</view>
					</view>
				</view>
				
				<view class="row">
					<view class='inner-row'>
						<view class="label">
							日期
						</view>
						<view class="value">
							{{opDate}}
						</view>
					</view>
				</view>
				
				<view class="row">
					<view class='inner-row'>
						<view class="label">
							{{direction=='D'?'登机口':'下客点'}}
						</view>
						<input
						 class="value"
						 v-model="form.gate"
						/>
					</view>
				</view>
				
				<view class="row">
					<view class='inner-row'>
						<view class="label">
							大摆渡数量
						</view>
						<view class="value">
							<u-number-box
								bg-color="#ffffff"
								color="#bdbdbd"
								size="40rpx"
								v-model="form.bigCarNum">
							</u-number-box>
						</view>
					</view>
				</view>
				
				<view class="row">
					<view class='inner-row'>
						<view class="label">
							小摆渡数量
						</view>
						<view class="value">
							<u-number-box
								bg-color="#ffffff"
								color="#bdbdbd"
								size="40rpx"
								v-model="form.smallCarNum">
							</u-number-box>
						</view>
					</view>
				</view>
			</view>
		
			<view class="btn-row">
				<view class="btn" @tap="send">
					发送
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uNumberBox from '@/uview-ui/components/u-number-box/u-number-box.vue'
	import { performOperation, onError } from '@/api/guide/index.js'
	import { mapGetters } from 'vuex'
	export default {
		components: {
			uNumberBox
		},
		data () {
			return {
				background: {
					'background-color': '#4191EA'
				},
				form: {
				},
				flightTaskId: '',
				direction: ''
			}
		},
		computed: {
			...mapGetters(['dispatcherMsg']),
			opDate () {
				return this.form.opDate ? this.form.opDate.substr(0, 10) : ''
			}
		},
		
		onLoad (e) {
			this.direction = e.direction
		},
		
		mounted () {
			this.form = uni.getStorageSync('inner_form')
			this.flightTaskId = uni.getStorageSync('flightTaskId')
			if (this.form) {
				this.form.bigCarNum = parseInt(this.form.bigCarNum)
				this.form.smallCarNum = parseInt(this.form.smallCarNum)
				uni.removeStorageSync('inner_form')
			}
			if (this.direction === 'A') {
				this.form.gate = 'T4国内到达'
			}
		},
		methods: {
			init (form, flightTaskId) {
				this.form = form
				this.flightTaskId = flightTaskId
			},
			send () {
				uni.showLoading({
					title: '加载中'
				})
				performOperation({
					serviceGuide: this.form,
					flightTaskId: this.flightTaskId,
					operationType: 'INFIELD_CALL'
				}).then(res => {
					console.log('innerInputForm-res', res)
					if (res.status) {
						uni.setStorageSync('guideId', res.data.id)
					}
					uni.showToast({
						title: res.message,
						icon: 'none',
						duration: 1000
					})
					uni.hideLoading()
					setTimeout(function () {
						uni.navigateBack()
					}, 1000)
				}).catch(err => {
					onError(err)
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
			height: calc(100% - 130rpx);
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
						.label {
							color: #818284;
						}
						.value {
							color: #bdbdbd;
							font-size: 40rpx;
							text-align: right;
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

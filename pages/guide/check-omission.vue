<template>
	<view class="inner-form">
		<u-navbar
			back-icon-color="#ffffff"
		  title="消息"
			title-color="#ffffff"
		 :background="background">
		</u-navbar>
		
		<view class="form">
			<view class="form-main">
				<view class="row">
					<view class='inner-row'>
						<view class="label">
							照片
						</view>
						<view class="value" style="margin: 0 auto;">
							<u-upload
							  ref="uUpload"
							 :header="header"
							 :form-data="body"
							 :action="uploadUrl"
							 :file-list="fileList"
							 @on-change="completedUpload"></u-upload>
						</view>
					</view>
				</view>
				
			</view>
		
			<view class="btn-row">
				<view class="btn" @tap="submit">
					发送
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uNumberBox from '@/uview-ui/components/u-number-box/u-number-box.vue'
	import { debounce } from '@/common/util/util.js'
	import {
		onError,
		imgUploadUrl,
		getOmitInfieldPics,
		omitOutFieldConfirm,
		performOperation
	} from '@/api/guide/index.js'
	export default {
		props: {
			form: {
				type: Object,
				default: () => {
					return {
						flight: 'SC5577',
						standCode: 'p78',
						registration: '6799',
						date: '2020.11.06',
						gate: '66',
						bigNum: 2,
						smallNum: 1,
					}
				}
			}
		},
		components: {
			uNumberBox
		},
		data () {
			return {
				background: {
					'background-color': '#4191EA'
				},
				photos: [],
				action: '',
				fileList: [],
				uploadUrl: '',
				header: {
					Authorization: ''
				},
				body: {
					remark: ''
				},
				operationType: '',
				direction: '',
				guideId: '',
				serviceGuide: {},
				taskId: ''
			}
		},
		onLoad (e) {
			console.log('onload', e)
			if (e.hasOwnProperty('taskId')) {
				this.taskId = e.taskId
			}
			let serviceGuide = uni.getStorageSync('check_omission_serviceGuide')
			if (serviceGuide) {
				this.serviceGuide = serviceGuide
				uni.removeStorageSync('check_omission_serviceGuide')
			}
			this.uploadUrl = imgUploadUrl
			this.header.Authorization = uni.getStorageSync('access_token')
			this.operationType = e.operationType
			this.direction = e.direction
			this.guideId = e.guideId
			this.body = {
				operationType: e.operationType,
				guideId: e.guideId,
				direction: e.direction,
				remark: ''
			}
		},
		mounted () {
			this.getOmitInfieldPics()
		},
		methods: {
			submit: debounce(function () {
				uni.showLoading({
					title: '加载中'
				})
				let confirmForm = {
					guideId: this.guideId,
					operationType: this.operationType,
					picStatus: {},
					remark: '',
					direction: this.direction
				}
				if (this.operationType === 'OMIT_INFIELD_CHECK') {
					omitOutFieldConfirm(confirmForm).then(res => {
						console.log('omitInfieldPicsConfirm-res')
						uni.showToast({
							title: res.message,
							icon: 'none',
							duration: 2000
						})
						uni.hideLoading()
					}).catch(err => {
						onError(err)
					})
				} else if (this.operationType === 'STAND_OUTFIELD_CHECK') {
					performOperation({
						serviceGuide: this.serviceGuide,
						flightTaskId: this.taskId,
						operationType: 'STAND_OUTFIELD_CHECK'
					}).then(res => {
						if (res.status) {
						}
						uni.showToast({
							title: res.message,
							icon: 'none',
							duration: 1000
						})
						uni.hideLoading()
					}).catch(err => {
						onError(err)
					})
				} else {
					uni.hideLoading()
				}
				uni.navigateBack()
			}, 1000),
			
			completedUpload (res) {
				console.log('completedUpload-res', res)
				uni.showToast({
					title: res,
					icon: 'none',
					duration: 2000
				})
			},
			
			getOmitInfieldPics () {
				uni.showLoading({
					title: '加载中'
				})
				if (this.operationType === 'OMIT_INFIELD_CHECK') {
					let getPicForm = {
						guideId: this.guideId,
						operationType: this.operationType,
						direction: this.direction
					}
					getOmitInfieldPics(getPicForm).then(res => {
						console.log('getOmitInfieldPics-res', res)
						if (res.status && res.data && res.data.picUrls) {
							let imgUrls = res.data.picUrls.split(',')
							console.log('imgUrls', imgUrls)
							if (imgUrls && imgUrls.length > 0) {
								this.fileList = imgUrls.map(e => {
									return {
										url: e
									}
								})
							}
						}
						uni.showToast({
							title: res.message,
							icon: 'none',
							duration: 2000
						})
						uni.hideLoading()
					}).catch(err => {
						onError(err)
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.inner-form {
		$fontSize: 40rpx;
		$fontWeight: 540;
		width: 100%;
		height: calc(100vh - 90px);
		margin-bottom: 10rpx;
		.form {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin: 0 auto;
			margin-top: 20rpx;
			border-radius: 19rpx;
			width: calc(100% - 50rpx);
			height: 100%;
			background-color: #ffffff;
			padding-bottom: 15rpx;
			.form-main {
				.row {
					padding: 10rpx 20rpx;
					.label {
						letter-spacing: 2rpx;
						font-family: SourceHanSansSC;
						font-size: $fontSize;
						font-weight: $fontWeight;
						color: #818284;
						padding-bottom: 10rpx;
						border-bottom: 1rpx solid #e6e6e6;
					}
					.value {
						padding-top: 10rpx;
						min-height: calc(100vh - 700rpx);
						color: #bdbdbd;
						.input-form-photo {
							$photoSize: 28vw;
							width: $photoSize;
							height: $photoSize;
							background-color: #eeeeee;
							margin: {
								right: 6rpx;
							}
						}
					}
					.textarea-input {
						border: 1rpx solid #818284;
						padding-top: 5rpx;
						padding-left: 10rpx;
						width: 100%;
					}
					.photos {
						
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

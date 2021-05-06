<template>
	<view class="inner-form">
		<u-navbar
			style="position: fixed;top: 0;z-index: 999;"
			back-icon-color="#ffffff"
		  title="消息"
			title-color="#ffffff"
		 :background="background">
		</u-navbar>
		
		<view class="form" style="overflow-y: auto;margin-top: 134rpx;">
			<view class="form-main">
				<view style="max-height:740rpx;overflow-y:auto;">
					<block v-for="(image, index) in images" :key="index">
						<view class="row">
							<image
								:src="image.url"
								@tap="showImage(image)">
							</image>
							
							<view>
								<u-radio-group
									 style="display: flex;"
									 v-model="image.status"
									:disabled="!sendable"
								  :wrap="true">
									<u-radio
										 style="flex: 0 0 50%;"
										:name="item.name"
										v-for="(item, index) in radios" :key="index"
										@change="radioChange">
										<view style="width: 60rpx;" @tap="changeLabel(item.name)">
											{{item.name}}
										</view>
									</u-radio>
								</u-radio-group>
							</view>
							
						</view>
					</block>
				</view>
				
				<view :style="{'padding-bottom': keyboardHeight + 'rpx'}">
					
					<view class="row message" :style="{'display': 'block'}">
							<view class="label">
								消息
							</view>
							<textarea
								@blur="blurFunc"
								@focus="inputFocusFunc"
								:adjust-position="false"
								class="textarea-input"
								v-model="remark"
								type="text"
								placeholder=""/>
						</view>
							
					<view v-if="sendable" class="btn-row">
						<view class="btn" @tap="submit">
							发送
						</view>
					</view>
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
		omitOutFieldConfirm
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
						smallNum: 1
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
				radios: [{
					name: '在',
					disabled: false
				}, {
					name: '不在',
					disabled: false
				}],
				images: [],
				// images: [{
				// 	index: 0,
				// 	url: `/static/cabin.png`,
				// 	status: '不在'
				// }, {
				// 	index: 1,
				// 	url: `/static/box.png`,
				// 	status: '不在'
				// }],
				guideId: '',
				direction: '',
				remark: '',
				operationType: 'OMIT_OUTFIELD_CHECK',
				sendable: true,
				keyboardHeight: 0
			}
		},
		onLoad (e) {
			console.log('onload', e)
			this.guideId = e.guideId,
			this.direction = e.direction
			if (e.sendable && e.sendable === 'false') {
				this.sendable = false
			}
		},
		mounted () {
			let info = uni.getStorageSync('check_image_storage')
			console.log('info', info)
			if (info) {
				uni.removeStorageSync('check_image_storage')
				// console.log('info', info)
				let imgUrls = info.picUrls.split(',')
				if (imgUrls && imgUrls.length > 0) {
					this.images = []
					for (let i = 0; i < imgUrls.length; i++) {
						let imgUrl = imgUrls[i]
						this.images.push({
							index: i,
							url: imgUrl,
							status: '不在'
						})
					}
					if (info.picStatus) {
						let picStatus = JSON.parse(info.picStatus)
						for (let url in picStatus) {
							let image = this.images.find(e => e.url === url)
							if (image) {
								image.status = picStatus[url] === '0' ? '不在' : '在'
							}
						}
					}
					this.remark = info.remark
					console.log('this.images', this.images)
				}
			} else {
				this.getOmitInfieldPics()
			}
			
			uni.onKeyboardHeightChange(res => {
			  console.log(res.height)
				this.keyboardHeight = res.height + 80
			})
		},
		methods: {
			inputFocusFunc () {
				setTimeout(function () {
					uni.pageScrollTo({
						scrollTop: 9999999,
						duration: 100
					})
				}, 200)
			},
			blurFunc () {
				setTimeout(function () {
					uni.pageScrollTo({
						scrollTop: 0,
						duration: 100
					})
				}, 200)
			},
			submit: debounce(function () {
				uni.showLoading({
					title: '加载中'
				})
				let confirmForm = {
					guideId: this.guideId,
					operationType: this.operationType,
					picStatus: {},
					remark: this.remark,
					direction: this.direction
				}
				
				for (let i = 0 ; i < this.images.length; i++) {
					let url = this.images[i].url
					let status = this.images[i].status === '不在' ? '0' : '1'
					confirmForm.picStatus[`${url}`] = status
				}
				
				omitOutFieldConfirm(confirmForm).then(res => {
					console.log('omitOutFieldConfirm-res', res)
					uni.showToast({
						title: res.message,
						icon: 'none',
						duration: 2000
					})
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
				uni.navigateBack()
			}, 1000),
			
			
			getOmitInfieldPics () {
				uni.showLoading({
					title: '加载中'
				})
				let getPicForm = {
					guideId: this.guideId,
					operationType: 'OMIT_INFIELD_CHECK',
					direction: this.direction
				}
				getOmitInfieldPics(getPicForm).then(res => {
					console.log('getOmitInfieldPics-res', res)
					if (res.status && res.data && res.data.picUrls) {
						let imgUrls = res.data.picUrls.split(',')
						if (imgUrls && imgUrls.length > 0) {
							this.images = []
							for (let i = 0; i < imgUrls.length; i++) {
								let imgUrl = imgUrls[i]
								this.images.push({
									index: i,
									url: imgUrl,
									status: '不在'
								})
							}
							if (res.data.picStatus) {
								let picStatus = JSON.parse(res.data.picStatus)
								for (let url in picStatus) {
									let image = this.images.find(e => e.url === url)
									if (image) {
										image.status = picStatus[url] === '0' ? '不在' : '在'
									}
								}
							}
							
							console.log('this.images', this.images)
						}
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none',
							duration: 2000
						})
						uni.hideLoading()
						uni.navigateBack()
					}
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
			},
			
			showImage (image) {
				uni.previewImage({
					urls: [image.url]
				})
			},
			
			completedUpload (res) {
				console.log('completedUpload-res', res)
				uni.showToast({
					title: res,
					icon: 'none',
					duration: 2000
				})
			},
			
			changeLabel (status) {
				console.log('changeLabel', this.images.map(e => e.status))
			},
			
			radioChange (e) {
				console.log('radioChange-label', this.images.map(e => e.status))
			}
		}
	}
</script>

<style lang="scss" scoped>
	.inner-form {
		$fontSize: 40rpx;
		$fontWeight: 540;
		width: 100%;
		height: calc(100vh - 180rpx);
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
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				height: 100%;
				.message {
					display: block;
					width: 700rpx;
				}
				.row {
					padding: 10rpx 20rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					image {
						height: 67rpx;
						width: 67rpx;
					}
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

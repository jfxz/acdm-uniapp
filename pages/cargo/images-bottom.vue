<template>
	<view class="bottom" v-if="show">
		<template v-if="item.images&&item.images.length!=0">
			<view class="border-line"></view>
			<view @touchstart="changeSwipeStatus" @touchend="changeSwipeStatus" class="images">
				<block v-for="image in item.images" :key="image.name">
					<view class="image-layout" v-if="image.show">
						<image :src="image.uri" @tap="showImage(image)"></image>
						<view class="min-badge-dot" @tap.stop="deleteImage(item, image)">
							<image style="height:25rpx;width:25rpx;" src="@/static/delete_image.png"></image>
						</view>
					</view>
				</block>
			</view>
		</template> 
	</view>
</template>

<script>
	import {getCargoInfo, confirm, abnormal, updateCargoInfo, addFromBatch, deleteImage, onError} from '@/api/cargo/index.js'
	import {mapGetters} from 'vuex'
	export default {
		props: {
			itemOri: {
				type: Object,
				default: () => {}
			}
		},
		data () {
			return {
				item: {},
				show: true
			}
		},
		watch: {
			itemOri: {
				handler(newval) {
					this.item = newval
					if (this.item.images) {
						this.item.images.forEach(e => {
							e.showDelete = true
						})
					}
				},
				deep: true,
				immediate: true
			}
		},
		computed: {
			...mapGetters(['cargoUserForm'])
		},
		methods: {
			changeSwipeStatus () {
				this.$emit('changeSwipeStatus')
			},
			// 预览图片
			showImage (image) {
				uni.previewImage({
					urls: [image.uri]
				})
			},
			deleteImage (item, image) {
				console.log('item.createBy', image.createBy)
				console.log('this.cargoUserForm.username', this.cargoUserForm.username)
				if (image.createBy && image.createBy !== this.cargoUserForm.username) {
					this.$message('不能删除其他人上传的图片')
					return
				}
				this.$loading('删除中')
				let index
				let removedImage = {}
				index = item.images.findIndex(e => e.name === image.name)
				if (index < 0) {
					// 如果找不到该图片
					return
				}
				removedImage = item.images[index]
				if (removedImage.hasOwnProperty('id') && removedImage.id && removedImage.hasOwnProperty('url') && removedImage.url) {
					deleteImage(removedImage).then(res => {
						if (res.status) {
							this.$message(res.message)
							
							if (item.cargoIrregularRecords && item.cargoIrregularRecords.length !== 0) {
								// 如果照片属性不为空，意味着删除之前上传的图片时需要从当前卡片的照片属性中删除它
								// 每个步骤的三张图片共用一个id
								let step = item.cargoIrregularRecords.find(e => e.id === removedImage.id)
								if (step) {
									// 如果当前步骤之前有上传过照片
									let imageArr = step.pictureUrls.split(',')
									if (imageArr.length > 1) {
										// 如果该步骤的照片数量大于1
										let imageIndex = -1
										imageIndex = imageArr.findIndex(e => e === removedImage.url)
										if (imageIndex > -1) {
											imageArr.splice(imageIndex, 1)
											// 删除照片后重新编写该步骤的照片地址。照片地址为多个照片以逗号分割存储在pictureUrls中
											step.pictureUrls = ''
											imageArr.forEach(e => {
												step.pictureUrls += e
											})
										}
									} else {
										// 如果当前步骤之前只上传过一张照片，那么删除该照片后直接在照片属性cargoIrregularRecords中删除该步骤即可
										let stepIndex = -1
										stepIndex = item.cargoIrregularRecords.findIndex(e => e.id === removedImage.id)
										if (stepIndex > -1) {
											item.cargoIrregularRecords.splice(stepIndex, 1)
										}
									}
								}
							}
							// 如果上面的if没执行，说明这个卡片之前都没上传过图片，直接删除本地图片即可。如果执行了。在删除cargoIrregularRecords中的图片之后还要删除本地图片
							item.images.splice(index, 1)
							
							let imageIndex = -1
							imageIndex = item.images2.findIndex(e => e.url === removedImage.url)
							if (imageIndex > -1) {
									item.images2.splice(imageIndex, 1)
							}
							item.selectedPicNums--
							this.$emit('change')
						}
						uni.hideLoading()
					}).catch(err => {
						onError(err)
					})
				} else  {
					// 这里是出库删除照片的代码
					item.images.splice(index, 1)
					
					let imageIndex = -1
					imageIndex = item.images2.findIndex(e => e.url === removedImage.url)
					if (imageIndex > -1) {
							item.images2.splice(imageIndex, 1)
					}
					item.selectedPicNums--
					uni.hideLoading()
				}
			},
			// 显示删除照片的图标
			showDeleteBadge (image) {
				image.showDelete = true
				image.show = false
				this.$nextTick(function(){
					image.show = true
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bottom {
		.border-line {
			height: 1rpx;
			width: 100%;
			border: solid 2rpx #f0f0f0;
		}
		.images {
			overflow-x: auto;
			width: 550rpx;
			display: flex;
			flex-direction: row;
			margin-top: 15rpx;
			margin-bottom: 17rpx;
			.image-layout {
				position: relative;
				display: inline-block;
				line-height: 1;
				vertical-align: middle;
				
				image {
					width: 69rpx;
					height: 69rpx;
					margin-right: 15rpx;
				}
				.min-badge-dot {
					position: absolute;
					top: 0;
					right: 0;
					z-index: 10;
				}
			}
		}
	}
</style>

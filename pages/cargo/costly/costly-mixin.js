const maxPicNums = 9
import { cargoUrl, cargoSvnUrl } from '@/api/cargo/index.js'
export default {
	data () {
		return {
			
		}
	},
	methods: {
		recursiveUpload (item, operationType , idx, end) {
			var that = this
			let url = getApp().globalData.ignoreSvn ? cargoSvnUrl : cargoUrl
			uni.uploadFile({
				url: url + '/api/cargo/specialCargo/uploadImage?cargoId=' + item.id + '&operationType=' + operationType,
				filePath: item.images2[idx].uri,
				name: 'file',
				header: {
					Authorization: uni.getStorageSync('access_token')
				},
				complete: (res) => {
					console.log('upload', res)
					if (res.statusCode === 200) {
						try {
							let jsonObj = JSON.parse(res.data)
							
							let len = item.images.length
							
							item.images.push({
								id: jsonObj.data.id,
								url: jsonObj.data.pictureUrls,
								createBy: this.cargoUserForm.username || '',
								show: true,
								name: 'image' + len,
								showDelete: false,
								uri: item.images2[idx].uri
							})
						} catch (e) {
							console.log(e)
						}
					} else {
						this.$messsage('图片上传失败')
						item.selectedPicNums--
					}
					++idx
					if (idx < end) {
						that.recursiveUpload(item, operationType, idx, end)
					} else {
						console.log('idx>end', item)
					}
				}
			})
		},
		
		uploadImage (item, operationType) {
			var that = this
			let imagesStep = null
			if (item.specialCargoRecords && item.specialCargoRecords.length > 0) {
				imagesStep = item.specialCargoRecords.find(e => e.step === operationType)
			}
			let imageLen = 0
			if (imagesStep) {
				imageLen = imagesStep.pictureUrls.split(",").length
			}
			
			let a = maxPicNums - imageLen - item.selectedPicNums
			if (a < 0 || a === 0) {
				this.$messsage('照片已满')
			} else {
				uni.chooseImage({
					count: a > 0? a : 0,
					success: function(res) {
						console
						item.selectedPicNums += res.tempFilePaths.length
						item.showItem = false
						let len = item.images.length
						item.images2 = []
						for (let i = len; i < res.tempFiles.length + len; i++) {
							item.images2.push({
								show: true,
								name: 'image' + i,
								showDelete: false,
								uri: res.tempFiles[i - len].path
							})
						}
						// 必须改变数据以触发视图更新
						item.showItem = true;
						// 递归上传图片，使异步上传变同步
						that.recursiveUpload(item, operationType, 0, item.images2.length)
					}
				})
			}
		}
	}
}
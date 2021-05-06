
import {
	onError,
	imgUploadUrl,
	getOmitInfieldPics,
	omitOutFieldConfirm
} from '@/api/guide/index.js'
export default {
	data () {
		return {
			
		}
	},
	methods: {
		getOmitInfieldPics () {
			uni.showLoading({
				title: '加载中'
			})
			let getPicForm = {
				guideId: this.guideId,
				operationType: this.operationType,
				direction: this.direction
			}
			getOmitInfieldPics(getPicForm).then(res => {
				console.log('getOmitInfieldPics-res', res)
				if (res.status && res.data.picUrls) {
					let imgUrls = res.data.pictureUrls.split(',')
					if (imgUrls && imgUrls.length > 0) {
						this.images = []
						for (let i = 0; i < imgUrls.length; i++) {
							let imgUrl = imgUrls[i]
							this.images.push({
								index: i,
								url: imgUrls,
								status: '不在'
							})
						}
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
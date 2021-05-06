import {DIC} from '@/common/dic.js'
import { debounce } from '@/common/util/util.js'
export default {
	data () {
		return {
			
		}
	},
	
	methods: {
		// 状态格式化
		formatStatus (status, item) {
			if (status === 'TOWAITINGAREA') {
				return '运往' + (item.firstTransportTargetAddr?item.firstTransportTargetAddr:('' + '待运区'))
			} else if (status === 'TOAIRCRAFT') {
				return '运往' + (item.secondTransportTargetAddr?item.secondTransportTargetAddr:('' + '机位'))
			} else if (status === 'ARRIVEDWAITINGAREA') {
				return '已到达' + (item.firstTransportTargetAddr?item.firstTransportTargetAddr:('' + '待运区'))
			} else if (status === 'ARRIVEDAIRCRAFT') {
				return '已到达' + (item.secondTransportTargetAddr?item.secondTransportTargetAddr:('' + '机位'))
			} else if (status === 'NOTOUTOFSTOCK' && item.reweighStatus === '1') {
				return '已复称'
			} else {
				return DIC.CARGOSTATUS[status]
			}
		},
		open () {
			this.$emit('open')
		},
		// 上传图片
		uploadImage: debounce(function (item) {
			if (item.containerCode.split('/').length > 1) {
				this.$emit('openUploadImageDialog', item)
			} else {
				this.$emit('uploadImage', item)
			}
		}),
		
		// 预览图片
		showImage (item) {
			uni.previewImage({
				urls: [item.uri]
			})
		},
		deleteImage (item, image) {
			let index = item.images.find(v => image.path === v.path)
			item.images.splice(index, 1)
		},
		// 删除照片
		showDeleteBadge (image) {
			image.showDelete = true
		}
	}
}
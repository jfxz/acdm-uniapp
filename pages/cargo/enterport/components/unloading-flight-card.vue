/*
* 界面名称:适用于货运进港的到达待运区、到达货站、交接运往待运区、交接运往货站的列表卡片的右半部分
* 界面功能:
* 其他    :
* 时间    :2020-8-21 11:17:40
* 作者    :gyb
*/
<template>
	<view class="cardRight">
		<view class="top">
			<view class="left">
				<view class="container-number">{{item.iataCarrier + item.flight}}</view>
			</view>
			<view class="right">
				<view class="status">{{formatterFlight(item)}}</view>
			</view>
		</view>
		
		<view class="unloading-flight-row">
			<view class="unloading-flight-item">
				<text class="label">机号:</text>
				<text class="value">{{item.registration?item.registration:'无'}}</text>
			</view>
			<view class="unloading-flight-item">
				<text class="label">机位:</text>
				<text class="value">{{item.stand?item.stand:'无'}}</text>
			</view>
			<view class="unloading-flight-item">
				<text class="label">目的站:</text>
				<text class="value">{{item.destination?item.destination:'无'}}</text>
			</view>
		</view>
		
	
	</view>
</template>

<script>
	import {DIC} from '@/common/dic.js'
  import { validatenull } from '@/common/util/validate.js'
  import {mapGetters} from 'vuex'
	export default {
		props: {
			itemOri: {
				type: Object,
				default: () => {}
			},
      
      statusDic: {
        type: Array,
        default: () => []
      }
		},
		data () {
			return {
				item: {},
				arrived: false
			}
		},
    
    computed: {
      ...mapGetters(['depStatusList', 'remoteDic'])
    },
    
		mounted () {
			this.item = this.itemOri
		},
		methods: {
			formatterFlight (item) {
        let statusList = []
        if (!validatenull(this.statusDic)) {
          statusList = this.statusDic
        } else if (!validatenull(this.depStatusList)) {
          statusList = this.depStatusList
        }
        if (item.flightStatus) {
					let obj = statusList.find(e => e.value === item.flightStatus)
					if (obj) {
						return obj.label
					}
					return item.flightStatus
				}
        return ''
			},
			// 上传图片
			uploadImage (item) {
				this.$emit('uploadImage', item)
			},
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
			},
			// 打开父组件的底部弹出层
			open (item) {
				this.$emit('open', item)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top {
		display: flex;
		justify-content: space-between;
		padding-top: 15rpx;
		margin-bottom: 27rpx;
		.left {
			display: flex;
			align-items: center;
			.container-number {
				font-weight: 900;
				font-family: SourceHanSansSC-Medium;
				font-size: 35rpx;
				letter-spacing: 2rpx;
				color: #262626;;
				margin-right: 18rpx;
			}
		}
		.right {
			.status {
				height: 33rpx;
				font-family: SourceHanSansSC-Medium;
				font-size: 35rpx;
				line-height: 33rpx;
				color: #2773e5;
				font-weight: bold;
			}
		}
	}
	
	.unloading-flight-row {
		display: flex;
		width: 100%;
		margin-bottom: 34rpx;
		.unloading-flight-item {
			margin-right: 34rpx;
			.label {
				height: 28rpx;
				font-family: SourceHanSansSC-Regular;
				font-size: 28rpx;
				line-height: 28rpx;
				color: #8c8c8c;
			}
			.value {
				font-family: Roboto-Regular;
				font-size: 28rpx;
				font-weight: bold;
				letter-spacing: 1rpx;
				color: #595959;
			}
		}
	}
</style>

<template>
	<view class="content">
		
		<!-- html -->
		<html2canvas ref="html2canvas" :domId="domId" @renderFinish="renderFinish">
			<view id="poster">
				<!-- <image class="logo" :src="logoBase64"></image> -->
				<view class="text-area">
					<text class="title">{{title}}</text>
				</view>
			</view>
		</html2canvas>
    <view class="image-class">
      <image :src="filePath"  mode="aspectFit"></image>
    </view>
		
	</view>
</template>

<script>
import { base64ToPath, pathToBase64 } from '@/common/util/image-tools.js';
export default {
	data () {
		return {
			title: 'Html2Canvas-Renderjs 示例',
			domId: '',
			logoBase64: '',
			filePath: ''
		}
	},
	async onLoad () {
		// try{
		// 	const imgInfo = await uni.getImageInfo({
		// 		src: "/static/A-CDM.png"
		// 	});
		// 	this.logoBase64 = await pathToBase64(imgInfo[1].path);
		// }catch(e){
		// }
	},
	mounted () {
		this.domId = '#poster'
	},
	methods: {
		/**
		 * 渲染完毕接收图片
		 * @param {String} filePath
		 */
		renderFinish (filePath) {
			this.filePath = filePath;
			console.log("filePath", filePath)
		}
	}
}
</script>

<style>
  .image-class {
    /* width: 300rpx;
    height: 300rpx; */
  }
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>

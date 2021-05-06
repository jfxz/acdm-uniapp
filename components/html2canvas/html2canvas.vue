/*
*  界面名称: 基于renderjs机制封装的html2canva
*  界面功能: html2canvas 能够实现在用户浏览器端直接对整个或部分页面进行截屏。
            这个html2canvas脚本将当页面渲染成一个Canvas图片，
            通过读取DOM并将不同的样式应用到这些元素上实现。它不需要来自服务器任何渲染，
            整张图片都是在客户端浏览器创建
*  其他      使用说明见底部
*  时间      2021-2-2 17:08:54
*  作者      zql
*/
<template>
	<view>
		<view class="html2canvas" :prop="domId" :change:prop="html2canvas.create">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	import { base64ToPath } from '@/common/util/image-tools.js';
	export default {
		name: 'html2canvas',
		props: {
			domId: {
				type: String,
				required: true
			}
		},
		methods: {
			async renderFinish (base64) {
				try{
					const imgPath = await base64ToPath(base64, '.jpeg');
					this.$emit('renderFinish', imgPath);
				}catch(e){
					//TODO handle the exception
					console.log('html2canvas error', e)
				}
			},
			showLoading () {
				uni.showToast({
					title: "正在生成服务单",
					icon: "none",
					mask: true,
					duration: 100000
				})
			},
			hideLoading () {
				uni.hideToast();
			}
		}
	}
</script>

<script module="html2canvas" lang="renderjs">
import html2canvas from 'html2canvas';
export default {
	methods: {
		async create(domId) {
			try {
				this.$ownerInstance.callMethod('showLoading', true);
				const timeout = setTimeout(async ()=> {
					const shareContent = document.querySelector(domId);
					const canvas = await html2canvas(shareContent,{
						width: shareContent.offsetWidth,//设置canvas尺寸与所截图尺寸相同，防止白边
						height: shareContent.offsetHeight,//防止白边
						logging: true,
						useCORS: true
					});
					const base64 = canvas.toDataURL('image/jpeg', 1);
					this.$ownerInstance.callMethod('renderFinish', base64);
					this.$ownerInstance.callMethod('hideLoading', true);
					clearTimeout(timeout);
				}, 500);
			} catch(error){
				console.log(error)
			}
		}
	}
}
</script>


<style lang="scss">

</style>
<!-- 使用说明 -->
<!-- 
地址：https://ext.dcloud.net.cn/plugin?id=2466
1、请先安装html2canvas，base64-arraybuffer、css-line-break
2、为避免出现跨域(ios)问题，建议将图片转为Base64字符串后使用。
3、该插件最终输出的图片文件为Base64格式，需搭配image-tools将图片保存到临时目录，再次感谢该插件作者！
4、确保在dom完成渲染后，再传入DomId，受限于renderjs的通信机制，目前只能通过这个方式来通知html2canvas执行操作。
5、本插件仅基于renderjs做封装演示，html2canvas官网有更多参数可根据业务场景自由定制 -->
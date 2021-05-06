/*
*  界面名称: 手写签名组件
*  界面功能: 签名、签名颜色选取、笔头粗细选取、重绘
*  其他      
*  时间      2020-12-17 11:15:34
*  作者      zql
 */
<template>
	<view class="contents">
		<canvas
			:class="['canvasExtend', {isLand: isLand, isPortrait: !isLand}]"
			canvas-id="canvasExtend"
			@touchmove="move"
			@touchstart="start($event)"
			@touchend="end"
			@touchcancel="cancel"
			@longtap="tap"
			disable-scroll="true"
			@error="error"
		></canvas>
		<view class="btn-flex">
			<view class="setting">
        <!-- #ifdef H5 -->
        <u-button type="primary" class="overSign" @tap="overSign">完成签名</u-button>
        <!-- #endif -->
				<!-- <u-button type="primary" :ripple="true"  class="colorSet" @tap="colorSet">颜色选取</u-button> -->
				<view class="preview" @tap="colorSet" :style="{'backgroundColor':color}"></view>
				<view class="lineSet">笔画粗细</view>
				<view class="slide">
					<slider :value="value" min="1" max="50" @change="sliderChange" show-value />
				</view>
			</view>
			
			<view class="operation">
				<u-button type="primary" class="clear" @tap="clearClick">重签</u-button>
				<u-button type="primary" class="overSign" @tap="overSign">完成签名</u-button>
			</view>
		</view>
		
		<pickerColor :currentColor="color" :isShow="showPickerColor" :bottom="0"  @callback='getPickerColor'></pickerColor>
	</view>
</template>

<script>

var content = null;
var touchs = [];
var _that;
import pickerColor from "@/components/helang-pickerColor.vue"
export default {
	components: {
		pickerColor
	},
	data () {
		return {
			value: 20,
			color: '#000000',
			showPickerColor: false,
      isLand: true, // 横屏标志
      canvasw: 0,
      canvash: 0,
			signImage: '',
			isEnd: false // 是否签名
		}
	},
  // 销毁页面时，中转到过渡界面 再去跳转，防止横竖屏转化后页面乱掉
  onBackPress () {
    if (!this.isEnd || !this.signImage) {
      getApp().globalData.imgSrc = ''
    }
		uni.redirectTo({
			url: '../ferry/tempJump?route=service'
		})
    return true
	},
  onLoad: function (options) {
    console.log('onLoad')
    // #ifdef APP-PLUS
    this.isLand = true
    // #endif
  },
  /**
   * 生命周期函数--初始化canvas
   */
	onReady () {
		_that = this
    console.log('onReady')
    setTimeout(() => {
      _that.getSystem()
      
      //获得Canvas的上下文
      content = uni.createCanvasContext('canvasExtend')
      //设置线的颜色
      content.setStrokeStyle("#000000")
      //设置线的宽度
      content.setLineWidth(20)
      //设置线两端端点样式更加圆润
      content.setLineCap('round')
      //设置两条线连接处更加圆润
      content.setLineJoin('round')
    }, 500)
	},
	methods: {
    // 画笔粗细
		sliderChange (e) {
			this.value = e.detail.value
			content.setLineWidth(this.value)
		},
    // 颜色选择弹框
		colorSet () {
			this.showPickerColor = true
		},
		getPickerColor (val) {
			console.log(111, val)
			if (val) {
				this.color = val
				content.setStrokeStyle(this.color)
			}
			this.showPickerColor = false
		},
    //获取系统信息
    getSystem () {
      uni.getSystemInfo({
      	success: function (res) {
          console.log(res)
          _that.canvasw = res.windowWidth
          _that.canvash = res.windowHeight
          console.log(_that.canvasw, _that.canvash)
      	}
      })
    },
    
		// 结束签名，上传到阿里云
		overSign () {
			if (this.isEnd) {
				uni.canvasToTempFilePath({
					canvasId: 'canvasExtend',
          fileType: 'png',
          // destWidth: 100,
          // destHeight: 100,
					success: function (res) {
						//打印图片路径
						console.log(res.tempFilePath)
            _that.signImage = res.tempFilePath
            getApp().globalData.imgSrc = _that.signImage
						uni.navigateBack()
            console.log('完成签名')
					}
				})
			} else {
				uni.showToast({
					title: '请先完成签名',
					icon: "none",
					duration: 1500,
					mask: true
				})
			}

		},

		// 画布的触摸移动开始手势响应
		start: function (event) {
			// console.log(event)
			//获取触摸开始的 x,y
			let point = {
				x: event.changedTouches[0].x,
				y: event.changedTouches[0].y
			}
			// console.log(point)
			touchs.push(point);

		},
		// 画布的触摸移动手势响应
		move: function (e) {
			let point = {
				x: e.touches[0].x,
				y: e.touches[0].y
			}
			// console.log(point)
			touchs.push(point)
			if (touchs.length >= 2) {
				this.draw(touchs)
			}
		},

		// 画布的触摸移动结束手势响应
		end: function (e) {
			console.log("触摸结束" + e)
			// 设置为已经签名
			this.isEnd = true
			// 清空轨迹数组
			for (let i = 0; i < touchs.length; i++) {
				touchs.pop()
			}

		},

		// 画布的触摸取消响应
		cancel: function (e) {
			console.log("触摸取消" + e)
		},

		// 画布的长按手势响应
		tap: function (e) {
			console.log("长按手势" + e)
		},

		error: function (e) {
			console.log("画布触摸错误" + e)
		},

		//绘制
		draw: function (touchs) {
			let point1 = touchs[0]
			let point2 = touchs[1]
			touchs.shift()
			content.moveTo(point1.x, point1.y)
			content.lineTo(point2.x, point2.y)
			content.stroke()
			content.draw(true)
		},
		//清除操作
		clearClick: function () {
			// 设置为未签名
			this.isEnd = false
			//清除画布
			console.log(this.canvasw, this.canvash)
			content.clearRect(0, 0, this.canvasw, this.canvash)
			content.draw(true)
		}
	}
}
</script>

<style lang="scss">
 .canvasExtend {
   background-color: #dddddd;
   &.isLand {
     width: 100%;
     height: calc(100vh - 140rpx);
   }
   &.isPortrait {
     width: 100%;
     height: calc(100vh - 160rpx);
   }
   
 }
 .slide {
	 width: 500rpx;
	 position: relative;
	 bottom: 25rpx;
 }
 .preview{
 	width: 60rpx;
 	height: 60rpx;
	margin: 10rpx 0 0 20rpx;
 }
.btn-flex {
	display: flex;
	justify-content: space-between;
	height: 100rpx;
	line-height: 100rpx;
	margin-top: 20rpx;
	width: 100%;
	.lineSet {
		margin-left: 30rpx;
		position: relative;
		bottom: 10rpx;
	}
	.clear {
		margin-right: 30rpx;
	}
	.setting {
		display: flex;
		
	}
}
.contents {
  padding: 20rpx;
	// box-sizing: border-box;
  overflow: auto;
  // position: absolute;
  // height: 100vh;
  // width: 100vw;
}

#signatureImg {
	background-color: #eeeeee;
}

.operation {
	display: flex;
}
</style>

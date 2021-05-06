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
			:class="['firstCanvas', {isLand: isLand, isPortrait: !isLand}]"
			canvas-id="firstCanvas"
			@touchmove="move"
			@touchstart="start($event)"
			@touchend="end"
			@touchcancel="cancel"
			@longtap="tap"
			disable-scroll="true"
			@error="error"
		></canvas>
    <view class="canvas-text">
      签名（必填）
    </view>
    <image class="extend" @tap="extend" src="@/static/service/extend.png" mode="aspectFit"></image>
		<view class="btn-flex">
      <button type="primary" :plain="true" class="clear" @tap="clearClick">重签</button>
      <button type="primary" :plain="true" class="overSign" @tap="overSign">完成签名</button>
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
			value: 10,
			color: '#000000',
			showPickerColor: false,
      isLand: false, // 横屏标志
			signImage: '',
			isEnd: false // 是否签名
		}
	},
  /**
   * 生命周期函数--初始化canvas
   */
	onReady () {
		
	},
	methods: {
    extend () {
      this.$emit('extend')
    },
    show () {
      _that = this
      console.log('onReady')
      setTimeout(() => {
        //获得Canvas的上下文
        content = uni.createCanvasContext('firstCanvas')
        //设置线的颜色
        content.setStrokeStyle("#000000")
        //设置线的宽度
        content.setLineWidth(10)
        //设置线两端端点样式更加圆润
        content.setLineCap('round')
        //设置两条线连接处更加圆润
        content.setLineJoin('round')
      }, 500)
    },
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
			if (val) {
				this.color = val
				content.setStrokeStyle(this.color)
			}
			this.showPickerColor = false
		},
    getSignImage () {
      this.$emit('getSignImage')
    },
		// 结束签名
		overSign () {
      let _that = this
			if (_that.isEnd) {
				uni.canvasToTempFilePath({
					canvasId: 'firstCanvas',
          fileType: 'png',
          // destWidth: 100,
          // destHeight: 100,
					success: function (res) {
						//打印图片路径
						console.log(res.tempFilePath)
            _that.signImage = res.tempFilePath
            getApp().globalData.imgSrc = _that.signImage
            _that.getSignImage()
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
			content.clearRect(0, 0, uni.upx2px(750), uni.upx2px(370))
			content.draw(true)
		}
	}
}
</script>

<style lang="scss">
 .firstCanvas {
   background-color: rgba(209, 233, 254, 0.2);
   z-index: 1;
   &.isLand {
     width: 100%;
     height: calc(100vh - 140rpx);
   }
   &.isPortrait {
     width: 100%;
     height: 370rpx;
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
  margin-top: -30rpx;
	width: 100%;
  padding: 36rpx 0;
  display: flex;
  justify-content: space-between;
  button {
    font-size: 28rpx;
    line-height: 100rpx;
    height: 100rpx;
    border-radius: 48rpx;
    border: solid 1rpx #1b8ffc;
    margin: 0;
    color: #1b8ffc;
    width: 210rpx;
  }
  .clear {
    color: #fa3534;
    border: solid 1rpx #fa3534;
  }
	.lineSet {
		margin-left: 30rpx;
		position: relative;
		bottom: 10rpx;
	}
	.setting {
		display: flex;
	}
}
.contents {
  padding: 0 20rpx;
  margin-top: -10rpx;
  background: #FFFFFF;
	// box-sizing: border-box;
  overflow: auto;
  position: relative;
  // position: absolute;
  // height: 100vh;
  // width: 100vw;
  .extend {
    width: 35rpx;
    height: 35rpx;
    position: absolute;
    top: 20rpx;
    right: 40rpx;
    z-index: 1;
  }
  .canvas-text {
    position: relative;
    bottom: 200rpx;
    text-align: center;
    color: rgba(27, 143, 252, 0.21);
    font-size: 47rpx;
    opacity: 0.5;
    z-index: 0;
  }
}

#signatureImg {
	background-color: #eeeeee;
}
</style>

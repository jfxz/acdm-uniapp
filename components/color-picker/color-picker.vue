<template>
	<view class="tui-datetime-picker">
		<view class="tui-mask" :class="{ 'tui-mask-show': isShow }" @tap="hide"></view>
		<view class="tui-header" :class="{ 'tui-show': isShow }">
			<view class="tui-picker-header" :class="{ 'tui-date-radius': radius }">
				<view class="tui-btn-picker" :style="{ color: cancelColor }" hover-class="tui-opacity" :hover-stay-time="150"
				 @tap="hide">取消</view>
				<view class="tui-btn-picker" :style="{ color: color }" hover-class="tui-opacity" :hover-stay-time="150" @tap="btnFix">确定</view>
			</view>
			<view class="tui-picker-body">
				<picker-view :value="value" @change="change" class="tui-picker-view">
					<picker-view-column>
						<view class="tui-column-item" :class="{ 'tui-font-size_32': !unitTop && type == 7 }" v-for="(item, index) in list"
						 :key="index">
							{{ item.name }}
						</view>
					</picker-view-column>
				</picker-view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'colorPicker',
		props: {
			//1-日期+时间（年月日+时分） 2-日期(年月日) 3-日期(年月) 4-时间（时分） 5-时分秒 6-分秒 7-年月日 时分秒
			type: {
				type: Number,
				default: 1
			},
			//"取消"字体颜色
			cancelColor: {
				type: String,
				default: '#888'
			},
			//"确定"字体颜色
			color: {
				type: String,
				default: '#2CCA78'
			},
			//单位置顶
			unitTop: {
				type: Boolean,
				default: false
			},
			//圆角设置
			radius: {
				type: Boolean,
				default: false
			},
			// 选择列表
			list: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				isShow: false,
				years: [],
				months: [],
				days: [],
				hours: [],
				minutes: [],
				seconds: [],
				year: 0,
				month: 0,
				day: 0,
				hour: 0,
				minute: 0,
				second: 0,
				startDate: '',
				endDate: '',
				value: [0],
				reset: false
			}
		},
		
		methods: {
			show() {
				setTimeout(() => {
					this.isShow = true
				}, 50)
			},
			
			hide() {
				this.isShow = false;
			},
			
			change (e) {
				this.value = e.detail.value[0]
			},
			
			btnFix() {
				setTimeout(() => {
					let result = {
						result: this.value
					} 
					this.$emit('confirm', result);
					this.hide();
				}, 80);
			}
			
		}
	}
</script>

<style scoped>
	.tui-datetime-picker {
		position: relative;
		z-index: 999;
	}

	.tui-picker-view {
		height: 100%;
		box-sizing: border-box;
	}

	.tui-mask {
		position: fixed;
		z-index: 9998;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.6);
		visibility: hidden;
		opacity: 0;
		transition: all 0.3s ease-in-out;
	}

	.tui-mask-show {
		visibility: visible !important;
		opacity: 1 !important;
	}

	.tui-header {
		z-index: 9999;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		transition: all 0.3s ease-in-out;
		transform: translateY(100%);
	}

	.tui-date-header {
		width: 100%;
		height: 52rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #fff;
		font-size: 26rpx;
		line-height: 26rpx;
		color: #555;
		/* #ifdef MP */
		box-shadow: 0 15rpx 10rpx -15rpx #efefef;
		/* #endif */
		/* #ifndef MP */
		box-shadow: 0 15rpx 10rpx -15rpx #888;
		/* #endif */
		position: relative;
		z-index: 2;
	}

	.tui-date-unit {
		flex: 1;
		text-align: center;
	}

	.tui-show {
		transform: translateY(0);
	}

	.tui-picker-header {
		width: 100%;
		height: 90rpx;
		padding: 0 40rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		font-size: 32rpx;
		background-color: #fff;
		position: relative;
	}

	.tui-date-radius {
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		overflow: hidden;
	}

	.tui-picker-header::after {
		content: '';
		position: absolute;
		border-bottom: 1rpx solid #eaeef1;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		bottom: 0;
		right: 0;
		left: 0;
	}

	.tui-picker-body {
		width: 100%;
		height: 520rpx;
		overflow: hidden;
		background-color: #fff;
	}

	.tui-column-item {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 36rpx;
		color: #333;
	}

	.tui-font-size_32 {
		font-size: 32rpx !important;
	}

	.tui-unit-text {
		font-size: 24rpx !important;
		padding-left: 8rpx;
	}

	.tui-btn-picker {
		padding: 16rpx;
		box-sizing: border-box;
		text-align: center;
		text-decoration: none;
	}

	.tui-opacity {
		opacity: 0.5;
	}
</style>

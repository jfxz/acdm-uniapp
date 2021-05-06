<template>
	<view>
		
		<view class="navbar">
			<view class="nav-handle-left">
				<view class="handle-type">
					<image class="my-icon-image" style="height:40rpx;width:20rpx;position:relative;top:-10rpx;" src="@/static/return.png" @tap="returnTrailer"></image>
				</view>
			</view>
			<view class="nav-title">
				<text>出港拖车视图</text>
			</view>
			<view class="nav-handle-right">
			</view>
		</view>
		
		<view class="tabs-layout">
			<my-u-tabs-swiper activeColor="#4191EA" ref="tabs" :list="tabList" :current="tabCurrent" @change="change" :is-scroll="false" swiperWidth="750">
			</my-u-tabs-swiper>
		</view>
		
		<view class="swiper-layout">
			<swiper duration="200" class="swiper-self tabs-height" :current="swiperCurrent" @animationfinish="animationfinish">
				<block v-for="(item, index) in arr" :key="index">
					<swiper-item style="overflow-y:auto;">
						<view v-if="item.show" style="position:relative;left:50%;transform: translate(-50%, 0);width: 100%;background-color: #ffffff;">
							<uni-charts :show="item.show" :max="item.max" :canvas-id="item.id" :chartType="item.chartType" :cWidthOri="cWidth" :cHeight="cHeight" :opts="item.opts" :ref="item.id"/>
						</view>
					</swiper-item>
				</block>
			</swiper>
		</view>
	</view>
</template>

<script>
	import uniCharts from './component.vue';
	// import res from './test.json'
	import { getLine } from '@/api/trailer/index.js'
	var _self;
	function isJSON (str) {
		if (typeof str == 'string') {
			try {
				var obj=JSON.parse(str);
				if(typeof obj == 'object' && obj ){
					return true;
				}else{
					return false;
				}
			} catch(e) {
				console.log('error：'+str+'!!!'+e);
				return false;
			}
		}
	}

	export default {
		data() {
			return {
				textarea: '',
				cWidth:375,
				cHeight:'',
				arr: [],
				
				tabList: [],
				tabCurrent: 0,
				swiperCurrent: 0,
				airportCode: '',
				timeout: null,
				moveFlag: false
			}
		},
		components: {
			uniCharts
		},
		onLoad (e) {
			this.airportCode = e.airportCode
			this.tabList = uni.getStorageSync('trailer-tabList')
			_self = this;
			this.cWidth=uni.upx2px(750);
			this.cHeight=uni.upx2px(500);
			let tabListLen = this.tabList.length
			let categories = []
			let series = []
			for (let i = 0; i < 24; i++) {
				categories.push(i)
				series.push(0)
			}
			this.tabList.forEach((e, index) => {
				this.arr.push({
					opts: {
						categories: categories,
						series: series
					},
					chartType: "line",
					id: index + '',
					name: e.name,
					max: 1
				})
			})
			this.getServerData(0)
		},
		
		// mounted () {
		// 	// 监听横屏竖屏变化事件
		// 	let device = ''
		// 	var that = this
		// 	uni.getSystemInfo({
		// 		success: function (res) {
		// 			device = res.platform
		// 			// this.cWidth = res.windowWidth
		// 		}
		// 	})
		// 	if (device !== 'devtools') {
		// 		uni.onWindowResize((res) => {
		// 			uni.showLoading({
		// 				title: '加载中'
		// 			})
		// 			if (!that.timeout) {
		// 				that.timeout = setTimeout(() => {
		// 					console.log('1111的窗口宽度=' + res.size.windowWidth)
		// 					console.log('1111的窗口高度=' + res.size.windowHeight)
		// 					that.cWidth = res.size.windowWidth
		// 					clearTimeout(that.timeout)
		// 					that.timeout = null
		// 				}, 500)
		// 			}
		// 		})
		// 	}
		// },
		
		methods: {
			change (index) {
				if (this.moveFlag) {
					this.moveFlag = false
					this.tabCurrent = index
					this.swiperCurrent = index
					this.getServerData(index)
				}
			},
			animationfinish ({ detail: { current } }) {
				if (this.moveFlag) {
					this.moveFlag = false
					this.tabCurrent = current
					this.swiperCurrent = current
					this.$refs.tabs.setFinishCurrent(current)
					this.getServerData(current)
				}
			},
			
			getServerData (current) {
				var that = this
				console.log('getServerData', this.cWidth)
				let zone = this.tabList[current].name
				getLine({
					airportCode: this.airportCode,
					zone: zone
				}).then (res => {
					if (res.status) {
						this.arr[current].show = false
						let Line = {
							categories: [],
							series: []
						};
						Line.categories = []
						for (let i = 0; i < 24; i++) {
							let value = i === 23 ? i - 20 : i + 4
							Line.categories.push(value)
						}
						Line.series = [{
							data: Object.values(res.data),
							name: zone
						}]
						this.arr.splice(current, 1 , {
							opts: Line,
							chartType: "line",
							id: current + '',
							name: zone,
							max: Math.max(...Line.series[0].data) || 5
						})
						console.log('this.arr', this.arr)
						this.showLines = true
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none',
							duration: 2000
						})
						console.log('res.status==0', res)
					}
					that.arr[current].show = true
					// setTimeout(() => {
					// 	that.arr[current].show = true
					// }, 2000)
					
					this.moveFlag = true
				}).catch(err => {
					uni.showToast({
						title: err.message,
						icon: 'none',
						duration: 2000
					})
					console.log('err', err)
					this.moveFlag = true
				})
			},
			
			changeData() {
				//这里newdata仅做为演示，实际请先获取后台数据，再调用子组件changeData事件
				let newdata = JSON.parse(_self.textarea);
				//'bcdd'为之前后台获取的第二个图表的id，不是固定不变的
				this.$refs.bcdd[0].changeData('bcdd',newdata)
			},
			returnTrailer () {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	/*样式的width和height一定要与定义的cWidth和cHeight相对应*/
	.qiun-charts {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}

	.charts {
		width: 750upx;
		height: 500upx;
	}
	
	.swiper-layout {
		height: 100%;
		// height: 100vh;
		width: 100%;
		background-color: #f5f5f5;
		// background-color: red;
		.tabs-landscape-height {
			height: calc(100vh - 82rpx);
		}
		.tabs-height {
			height: calc(100vh - 170rpx - var(--status-bar-height));
		}
		.swiper-self {
			// height: calc(100vh - 90px - var(--status-bar-height));
			.tabs-landscape {
				width: 100%;
				height:42rpx;
				display: flex;
				align-items: center;
				background-color: #e6e6e6;
				.text {
					width: 50%;
					text-align: center;
				}
			}
			.text {
				width: 100%;
				text-align: center;
			}
			.scroll-view-landscape {
				 display:grid;
				 grid-template-rows: 42rpx calc(100% - 42rpx);
				 grid-template-columns: 49% 2% 49%;
				.swiper-item-layout {
					display: flex;
					padding: 34rpx 17rpx 27rpx 17rpx;
					margin-bottom: 17rpx;
					background-color: #ffffff;
					height: 206rpx;
					background-color: #ffffff;
					border-radius: 0rpx 0rpx 7rpx 7rpx;
					.icon {
						display: flex;
						align-items: center;
						margin-right: 18rpx;
						.img {
							height: 58rpx;
							width: 58rpx;
						}
					}
					.text-layout {
						width: 100%;
						.top {
							display: flex;
							justify-content: space-between;
							.flight {
								padding-top: 5rpx;
								font-family: Arial-BoldMT;
								font-size: 35rpx;
								font-weight: bold;
								line-height: 20rpx;
								color: #333333;
							}
							.flight-status {
								font-size: 35rpx;
								font-weight: normal;
								line-height: 20rpx;
								color: #00cf70;
							}
						}
						.middle {
							display: flex;
							margin-top: 33rpx;
							.stand {
								display: flex;
								font-family: SourceHanSansSC-Regular;
								font-size: 28rpx;
								letter-spacing: 1rpx;
								color: #a6a6a6;
								.number {
									margin-left: 13rpx;
									font-size: 28rpx;
									font-weight: bold;
									letter-spacing: 1rpx;
									color: #595959;
								}
							}
							.seperation {
								margin-left: 22rpx;
								margin-right: 17rpx;
								width: 2rpx;
								background-color: #e6e6e6;
							}
							.registration {
								display: flex;
								font-size: 28rpx;
								font-weight: normal;
								font-family: SourceHanSansSC-Regular;
								font-stretch: normal;
								letter-spacing: 1rpx;
								color: #a6a6a6;
								.number {
									margin-left: 11rpx;
									font-size: 28rpx;
									font-weight: bold;
									letter-spacing: 1rpx;
									color: #595959;
								}
							}
						}
						.bottom {
							display: flex;
							margin-top: 28rpx;
							.ctot {
								display: flex;
								padding-top: 3rpx;
								font-size: 29rpx;
								font-weight: normal;
								font-stretch: normal;
								letter-spacing: 1rpx;
								color: #a6a6a6;
								.time {
									margin-left: 18rpx;
									font-size: 29rpx;
									font-weight: bold;
									letter-spacing: 1rpx;
									color: #595959;
								}
							}
							.seperation {
								margin-left: 22rpx;
								margin-right: 17rpx;
								width: 2rpx;
								background-color: #e6e6e6;
							}
							.off-block {
								display: flex;
								font-family: SourceHanSansSC-Regular;
								font-size: 29rpx;
								letter-spacing: 1rpx;
								color: #a6a6a6;
								line-height: 120%;
								.time {
									margin-left:12rpx;
									font-size: 29rpx;
									font-weight: bold;
									letter-spacing: 1rpx;
									color: #595959;
								}
							}
						}
					}
				}
			}
			.swiper-item-layout {
				display: flex;
				padding: 34rpx 17rpx 27rpx 17rpx;
				margin-bottom: 17rpx;
				background-color: #ffffff;
				height: 206rpx;
				background-color: #ffffff;
				border-radius: 0rpx 0rpx 7rpx 7rpx;
				.icon {
					display: flex;
					align-items: center;
					margin-right: 18rpx;
					.img {
						height: 58rpx;
						width: 58rpx;
					}
				}
				.text-layout {
					width: 100%;
					.top {
						display: flex;
						justify-content: space-between;
						.flight {
							padding-top: 5rpx;
							font-family: Arial-BoldMT;
							font-size: 35rpx;
							font-weight: bold;
							line-height: 20rpx;
							color: #333333;
						}
						.flight-status {
							font-size: 35rpx;
							font-weight: normal;
							line-height: 20rpx;
							color: #00cf70;
						}
					}
					.middle {
						display: flex;
						margin-top: 33rpx;
						.stand {
							display: flex;
							font-family: SourceHanSansSC-Regular;
							font-size: 28rpx;
							letter-spacing: 1rpx;
							color: #a6a6a6;
							.number {
								margin-left: 13rpx;
								font-size: 28rpx;
								font-weight: bold;
								letter-spacing: 1rpx;
								color: #595959;
							}
						}
						.seperation {
							margin-left: 22rpx;
							margin-right: 17rpx;
							width: 2rpx;
							background-color: #e6e6e6;
						}
						.registration {
							display: flex;
							font-size: 28rpx;
							font-weight: normal;
							font-family: SourceHanSansSC-Regular;
							font-stretch: normal;
							letter-spacing: 1rpx;
							color: #a6a6a6;
							.number {
								margin-left: 11rpx;
								font-size: 28rpx;
								font-weight: bold;
								letter-spacing: 1rpx;
								color: #595959;
							}
						}
					}
					.bottom {
						display: flex;
						margin-top: 28rpx;
						.ctot {
							display: flex;
							padding-top: 3rpx;
							font-size: 29rpx;
							font-weight: normal;
							font-stretch: normal;
							letter-spacing: 1rpx;
							color: #a6a6a6;
							.time {
								margin-left: 18rpx;
								font-size: 29rpx;
								font-weight: bold;
								letter-spacing: 1rpx;
								color: #595959;
							}
						}
						.seperation {
							margin-left: 22rpx;
							margin-right: 17rpx;
							width: 2rpx;
							background-color: #e6e6e6;
						}
						.off-block {
							display: flex;
							font-family: SourceHanSansSC-Regular;
							font-size: 29rpx;
							letter-spacing: 1rpx;
							color: #a6a6a6;
							line-height: 120%;
							.time {
								margin-left:12rpx;
								font-size: 29rpx;
								font-weight: bold;
								letter-spacing: 1rpx;
								color: #595959;
							}
						}
					}
				}
			}
		}
	}
	
	
	.navbar {
		display: flex;
		justify-content: space-between;
		height: calc(var(--status-bar-height) + 92rpx);
		background: #1891ff;
		padding-top: calc(var(--status-bar-height) + 25rpx);
		width: 100%;
		z-index: 10;
		// position: fixed;
		// top: 0;
		text-align: center;
	
		.nav-handle-left {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			width: 30%;
			padding-top: 5rpx;
			padding-left: 35rpx;
	
			.handle-type {
				image {
					width: 45rpx;
					height: 45rpx;
				}
			}
		}
	
		.nav-title {
			width: 40%;
			font-size: 38rpx;
			line-height: 50rpx;
			color: #ffffff;
		}
	
		.nav-handle-right {
			display: flex;
			flex-direction: row-reverse;
			justify-content: space-between;
			width: 30%;
			padding-top: 5rpx;
			padding-right: 35rpx;
	
			.handle-type {
				image {
					width: 38rpx;
					height: 38rpx;
				}
			}
		}
	}
</style>

<template>
	<canvas v-if="canvasId" :id="canvasId" :canvasId="canvasId"
		class="can-style"
	 :style="{'width': (cWidth||375)*pixelRatio +'px',
	 'height':cHeight*pixelRatio+'px'}"
	 @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" @error="error">
	</canvas>
</template>

<script>
	import uCharts from '@/components/u-charts/u-charts.js';
	var canvases = {};
	
	export default {
		props: {
			chartType: {
				required: true,
				type: String,
				default: 'column'
			},
			opts: {
				required: true,
				type: Object,
				default () {
					return null;
				},
			},
			canvasId: {
				type: String,
				default: 'u-canvas',
			},
			cWidthOri: {
				type: Number,
				default: 375,
			},
			cHeight: {
				type: Number,
				default: 250,
			},
			pixelRatio: {
				type: Number,
				default: 1,
			},
			max: {
				type: Number,
				default: 10
			},
			show: {
				type: Boolean,
				default: true
			}
		},
		
		data () {
			return {
				timeout: null,
				cWidth: 305
			}
		},
		
		watch: {
			// cWidth: {
			// 	handler(oldval, newval) {
			// 		console.log('component-newval', newval)
			// 		this.cWidth = newval
			// 		this.init()
			// 	}
			// }
		},
		
		mounted() {
			console.log('mounted')
			var that = this
			// 监听横屏竖屏变化事件
			let device = ''
			uni.getSystemInfo({
				success: function (res) {
					device = res.platform
					that.cWidth = res.windowWidth
					that.init()
				}
			})
			if (device !== 'devtools') {
				uni.onWindowResize((res) => {
					uni.showLoading({
						title: '加载中'
					})
					if (!that.timeout) {
						that.timeout = setTimeout(() => {
							console.log('1111的窗口宽度=' + res.size.windowWidth)
							console.log('1111的窗口高度=' + res.size.windowHeight)
							that.cWidth = res.size.windowWidth
							that.init()
							clearTimeout(that.timeout)
							that.timeout = null
						}, 500)
					}
				})
			}
		},
		
		methods: {
			init() {
				switch (this.chartType) {
					case 'column':
						this.initColumnChart();
						break;
					case 'line':
						this.initLineChart();
						break;
					default:
						break;
				}
			},
			initColumnChart() {
				canvases[this.canvasId] = new uCharts({
					$this: this,
					canvasId: this.canvasId,
					type: 'column',
					legend: true,
					fontSize: 11,
					background: '#FFFFFF',
					pixelRatio: this.pixelRatio,
					animation: true,
					categories: this.opts.categories,
					series: this.opts.series,
					enableScroll: true,
					xAxis: {
						disableGrid: true,
						itemCount: 4,
						scrollShow: true
					},
					yAxis: {
						//disabled:true
					},
					dataLabel: true,
					width: this.cWidth * this.pixelRatio,
					height: this.cHeight * this.pixelRatio,
					extra: {
						column: {
							type: 'group',
						}
					}
				});
			},
			initLineChart() {
				console.log('initLineChart', this.cWidth)
				let splitNumber = this.max > 5 ? 5 : this.max
				canvases[this.canvasId] = new uCharts({
					$this: this,
					canvasId: this.canvasId,
					type: 'line',
					fontSize: 11,
					legend: true,
					dataLabel: false,
					dataPointShape: true,
					background: '#FFFFFF',
					pixelRatio: this.pixelRatio,
					categories: this.opts.categories,
					series: this.opts.series,
					animation: true,
					enableScroll: false,
					xAxis: {
						type: 'grid',
						gridColor: '#CCCCCC',
						gridType: 'dash',
						dashLength: 8,
						itemCount: 4,
						scrollShow: true
					},
					yAxis: {
						gridType: 'dash',
						gridColor: '#CCCCCC',
						dashLength: 8,
						splitNumber: splitNumber,
						min: 0,
						max: this.max,
						format: (val) => {
							return val.toFixed(0) + '次'
						}
					},
					width: this.cWidth * this.pixelRatio,
					height: this.cHeight * this.pixelRatio,
					extra: {
						line: {
							type: 'straight'
						}
					}
				});
			},
			// 这里仅作为示例传入两个参数，cid为canvas-id,newdata为更新的数据，需要更多参数请自行修改
			changeData(cid,newdata) {
				canvases[cid].updateData({
					series: newdata.series,
					categories: newdata.categories
				});
			},
			touchStart(e) {
				canvases[this.canvasId].showToolTip(e, {
					format: function(item, category) {
						return category + ' ' + item.name + ':' + item.data
					}
				});
				canvases[this.canvasId].scrollStart(e);
			},
			touchMove(e) {
				canvases[this.canvasId].scroll(e);
			},
			touchEnd(e) {
				canvases[this.canvasId].scrollEnd(e);
			},
			error(e) {
				console.log(e)
			}
		},
	};
</script>

<style scoped>
	.charts {
		width: 100%;
		height: 100%;
		flex: 1;
		background-color: #FFFFFF;
	}
	.can-style {
		/* position: relative;
		left: 50%; */
	}
</style>

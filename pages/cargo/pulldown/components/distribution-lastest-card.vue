/*
* 界面名称:拉下查询-配载查询
* 界面功能:
* 其他    :
* 时间    :2020-10-19 14:53:21
* 作者    :gyb
*/
<template>
	<view @click.stop="expand">
		<view>
			<view class="top"> 
				<view class="left">
					<view class="container-number">
						<view class="container-number-text">{{item.lastestTask?item.lastestTask.title:''}}</view>
					</view>
				</view>
			</view>
			
			<view class="flight-place">
				<view class="left">
					<view class="flight">
						<view class="place-font" style="font-weight: bold;">{{item.lastestTask?item.lastestTask.desc:''}}</view>
					</view>
				</view>
				<view class="right">
					<image src="@/static/down-arror.png"></image>
				</view>
			</view>
		</view>
		
		<template v-if="expandStatus&&item.tasks&&item.tasks.length!=0">
			<timeline
				 :style="{'height': (180 * item.tasks.length) + 'rpx', 'margin-bottom': '24rpx'}"
				ref="timeline">
			</timeline>
		</template>
		
		
	</view>
</template>

<script>
	import {DIC} from '@/common/dic.js'
	import cardMixin from '@/pages/cargo/card-mixin'
	import timeline from '@/pages/cargo/pulldown/timeline.vue'
	export default {
		mixins: [cardMixin],
		components: {
			timeline
		},
		props: {
			itemOri: {
				type: Object,
				default: () => {}
			},
			
			position: {
				// 如果为false，显示firstTransportTargetAddr，如果为true，显示SecondTransportTargetAddr
				type: Boolean,
				default: false
			},
			abnormal: {
				type: Boolean,
				default: false
			}
		},
		data () {
			return {
				item: {
					
				},
				expandStatus: false
			}
		},
		watch: {
			itemOri: {
				handler(newval) {
					this.item = newval
				},
				deep: true,
				immediate: true
			}
		},
		methods: {
			expand () {
				var that = this
				this.expandStatus = !this.expandStatus
				this.$nextTick(function(){
					if (that.expandStatus) {
						that.$refs.timeline.initTasks(that.item.tasks)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top {
		display: flex;
		justify-content: space-between;
		padding-top: 15rpx;
		margin-bottom: 19rpx;
		.left {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.star-flag {
				height: 39rpx;
				width: 35rpx;
				margin-right: 12rpx;
			}
			.container-number {
				display: flex;
				font-weight: 900;
				font-family: SourceHanSansSC-Medium;
				font-size: 35rpx;
				letter-spacing: 2rpx;
				color: #262626;
				margin-right: 18rpx;
				.container-number-text {
					width: 232rpx;
					white-space:nowrap;
					text-overflow:ellipsis;
					overflow:hidden;
				}
			}
			
		}
		.center {
			display: flex;
			
			
		}
		.right {
			.status-right {
				font-family: SourceHanSansSC-Medium;
				font-size: 28rpx;
				font-weight: 900;
				line-height: 35rpx;
				letter-spacing: 2rpx;
				color: #2773e5;
			}
		}
	}
	
	.flight-place {
		display: flex;
		justify-content: space-between;
		padding-bottom: 17rpx;
		.left {
			display: flex;
		}
		.right {
			image {
				width: 20rpx;
				height: 20rpx;
				position: relative;
				top:50%;
				transform: translate(0, -50%);
			}
		}
		
		.upload-image {
			width: 136rpx;
			height: 49rpx;
			line-height: 44rpx;
			border: solid 1rpx #e5e5e5;
			border-radius: 22rpx;
			
			font-family: SourceHanSansSC-Medium;
			font-size: 26rpx;
			letter-spacing: 1rpx;
			color: #8c8c8c;
			text-align: center;
		}
		.flight {
			display: flex;
			align-items: center;
			.font {
				font-family: SourceHanSansSC-Medium;
				width: 108rpx;
				font-size: 24rpx;
				letter-spacing: 1rpx;
				color: #a6a6a6;
				// margin-right: 13rpx;
			}
			.flight-number {
				font-family: Roboto-Regular;
				font-size: 28rpx;
				letter-spacing: 1rpx;
				color: #a6a6a6;
			}
			.place-font {
				width: calc(100vw - 400rpx);
				font-family: Roboto-Regular;
				font-size: 28rpx;
				letter-spacing: 1rpx;
				font-weight: 900;
				color: #595959;
				white-space:nowrap;
				text-overflow:ellipsis;overflow:hidden;
			}
		}
		
	}
	
	.not-today {
		color: 'red';
	}
	
	.container-status-layout {
		position: relative;
		// top: 0rpx;
		// padding-top: 10rpx;
		.background {
			min-height: 35rpx;
			// min-width: 83rpx;
			white-space:nowrap; 
			background-color: #008ffd;
			border-radius: 6rpx;
			opacity: 0.07;
			font-family: SourceHanSansSC-Medium;
			font-size: 25rpx;
			// letter-spacing: 1rpx;
		}
		.status {
			position: absolute;
			min-height: 35rpx;
			white-space:nowrap;
			top: -2rpx;
			font-family: SourceHanSansSC-Medium;
			font-size: 25rpx;
			// letter-spacing: 1rpx;
			color: #2773e5;
		}
		
		.car-background {
			background-color: #ef5c0b;
			color: #ef5c0b;
			padding: {
				left: 10rpx;
				right: 10rpx;
			}
			
		}
		.car-color {
			color: #ef5c0b;
			left: 50%;
			transform:translate(-50%, 0%);
		}
	}
	
	.abnormal-line-height {
		top: 7rpx;
	}
	
</style>

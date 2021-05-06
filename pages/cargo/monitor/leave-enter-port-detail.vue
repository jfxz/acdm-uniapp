<template>
	<view>
		<view class="nav-bar">
			<view class="back-icon" @tap="goback"></view>
			<view class="title">
				集装器信息
			</view>
			<template v-if="!switchStatus">
				<image
					class="nav-btn"
				 @tap="switchCard"
					src="@/static/monitor-container-info-btn.png">
				</image>
			</template>
			<template v-else>
				<image
					class="nav-btn"
				 @tap="switchCard"
					src="@/static/monitor-container-info-switched-btn.png">
				</image>
			</template>
		</view>
		
		<view class="flight-header-block">
			<image
				class="header-image"
				src="@/static/monitor-flight-header.png"
			></image>
			<view class="flight-info-block">
				<view class="label">
					航班号
				</view>
				<view class="value">
					{{flight}}
				</view>
			</view>
		</view>
		
		<view v-if="!switchStatus" class="list">
			<block v-for="container in list" :key="container.id">
				<view class="container" @tap="checkTimeLine(container)">
					<image
						class="container-icon"
						src="@/static/monitor-container-icon.png">
					</image>
					<view class="container-code">
						{{container.containerCode}}
					</view>
          <template v-if="container.abnormal=='1'">
            <view class="status" style="color: red;">
            	异常
            </view>
          </template>
          <template v-else>
            <view class="status">
            	{{formatStatus(container)}}
            </view>
          </template>
				</view>
			</block>
		</view>
		<view v-if="switchStatus" class="list">
			<block v-for="container in list" :key="container.id">
				<view
					 class="container-history"
					:style="{'padding': container.expand?'38rpx 0 24rpx 0':'0 0 0 0'}"
					@tap="changeExpand(container)">
					
					<template v-if="!container.expand">
						<view class="container-code-block">
							<view class="container-code">
								<image
									style="margin-right:10rpx"
									src="@/static/monitor-container-icon.png">
								</image>
								{{container.containerCode}}
							</view>
							<view class="container-code-block-time">
								{{container.lastestTask?container.lastestTask.operateDate:''}}
							</view>
						</view>
						<view class="status-block">
              <template v-if="container.abnormal=='1'">
                <view class="status-block-status" style="color: red;">
                	异常
                </view>
              </template>
              <template v-else>
                <view class="status-block-status">
                	{{formatStatus(container)}}
                </view>
              </template>
							<!-- <view class="status-block-status">
								{{formatStatus(container)}}
							</view> -->
							<view class="operation">
								{{container.lastestTask?container.lastestTask.desc:''}}
							</view>
						</view>
					</template>
					<template v-else>
						<view class="timeline-layout">
							<view class="vertical-line"></view>
							<block v-for="(task, index) in container.tasks" :key="task.title">
								<view v-if="index==0" class="lastest-block">
									<view class="circle" style="border-color: #3386F1"></view>
									<view class="lastest-block-container-row">
										<image
											class="container-icon"
											style="margin-right: 10rpx;margin-left: 38rpx;"
											src="@/static/monitor-container-icon.png">
										</image>
										<view class="container-code">
											{{container.containerCode}}
										</view>
										<view class="status">
											{{task.title}}
										</view>
									</view>
									<view class="lastest-block-time-operator">
										<view style="margin-right: 67rpx;">
											{{task.operateDate}}
										</view>
										<view>
											{{task.desc}}
										</view>
									</view>
								</view>
								<view v-else>
									<view class="history-block">
										<view class="circle"></view>
										<view class="history-block-top">
											<view class="history-block-top-time">
												{{task.operateDate}}
											</view>
											<view class="status" style="position: relative;">
												{{task.title}}
											</view>
										</view>
										<view class="history-block-bottom">
											{{task.desc}}
										</view>
									</view>
								</view>
							</block>
						</view>
					</template>
					
					<image
						src="/static/down_circle.png"
					 :class="{'arror': true, 'expand': container.expand, 'hide': !container.expand}">
					</image>
				</view>
			</block>
		</view>
		
	</view>
</template>

<script>
	import { debounce } from '@/common/util/util.js'
	import dayjs from '@/common/util/dayjs.min.js'
	import {DIC} from '@/common/dic.js'
	export default {
		data () {
			return {
				flight: '',
				list: [],
				switchStatus: false,
				type: ''
			}
		},
		
		
		
		onLoad (e) {
			this.flight = e.flight
			this.type = e.type
		},
		
		mounted () {
			let list = uni.getStorageSync('monitor-detail-cars')
			if (list) {
				console.log('monitor-detail-cars', list)
				this.list = [...list]
				uni.removeStorageSync('monitor-detail-cars')
			}
		},
		
		methods:{
			changeExpand (container) {
				container.expand=!container.expand
				if (this.type === 'D') {
					container.tasks = this.initTasks(container)
				} else {
					container.tasks = this.initTasks2(container)
				}
				this.$forceUpdate()
			},
			
			formatStatus (item) {
				let status = item.status
				if (status === 'TOWAITINGAREA') {
					return '运往' + (item.firstTransportTargetAddr?item.firstTransportTargetAddr:('' + '待运区'))
				} else if (status === 'TOSTATION') {
					return '运往货站'
				} else if (status === 'ARRIVEDWAITINGAREA') {
					return '到达' + (item.firstTransportTargetAddr?item.firstTransportTargetAddr:('' + '待运区'))
				} else if (status === 'ARRIVEDSTATION') {
					return '到达货站'
				} else {
					return DIC.CARGOSTATUS[status]
				}
			},
			
			switchCard: debounce(function () {
				this.switchStatus = !this.switchStatus
			}),
			
			checkTimeLine (container) {
				if (this.type === 'D') {
					container.tasks = this.initTasks(container)
				} else {
					container.tasks = this.initTasks2(container)
				}
				uni.setStorageSync('timeline', container)
				let flight = this.flight
				uni.navigateTo({
					url: `/pages/cargo/monitor/time-line-page?flight=${flight}`
				})
			},
			
			generateObj (obj) {
				return {
					images: [],
					images2: [],
					selectedPicNums: 0,
					showItem: true,
					selected: false,
					pass: false,
					...obj,
					carNumber: 0,
					boxNumber: 0,
					boardNumber: 0,
					containerTypes: [],
				}
			},
			
			formatTime (time) {
				return dayjs(time).format('HH:mm:ss')
			},
			
			goback: debounce(function () {
				uni.navigateBack()
			}),
			
			initTasks (item) {
				let tasks = []
				if (item.STATIONHANDOVER) {
					let ope = item.STATIONHANDOVER
					tasks.unshift({
						title: '出库',
						desc: ope.operator,
						operateDate: this.formatTime(ope.operateDate)
					})
				}
				if (item.LOCATIONHANDOVER) {
					let ope = item.LOCATIONHANDOVER
					tasks.unshift({
						title: '装卸接收',
						desc: ope.operator,
						operateDate: this.formatTime(ope.operateDate)
					})
				}
				if (item.TOWAITINGAREA_STEVEDORING) {
					let ope = item.TOWAITINGAREA_STEVEDORING
					tasks.unshift({
						title: '装卸运往待运区',
						desc: ope.operator,
						operateDate: this.formatTime(ope.operateDate)
					})
				}
				if (item.TOWAITINGAREA_DRIVER) {
					let ope = item.TOWAITINGAREA_DRIVER
					tasks.unshift({
						title: '运往待运区',
						desc: ope.operator + '驾驶拖车' + item.firstTransportCarCode,
						operateDate: this.formatTime(ope.operateDate)
					})
				}
				if (item.ARRIVEDWAITINGAREA_DRIVER) {
					let ope = item.ARRIVEDWAITINGAREA_DRIVER
					tasks.unshift({
						title: '到达待运区',
						desc: ope.operator,
						operateDate: this.formatTime(ope.operateDate)
					})
				}
				if (item.TOAIRCRAFT_STEVEDORING) {
					let ope = item.TOAIRCRAFT_STEVEDORING
					tasks.unshift({
						title: '交接运往机位',
						desc: ope.operator,
						operateDate: this.formatTime(ope.operateDate)
					})
				}
				if (item.TOAIRCRAFT_DRIVER) {
					let ope = item.TOAIRCRAFT_DRIVER
					tasks.unshift({
						title: '运往机位',
						desc: ope.operator + '驾驶拖车' + item.secondTransportCarCode,
						operateDate: this.formatTime(ope.operateDate)
					})
				}
				if (item.ARRIVEDAIRCRAFT) {
					let ope = item.ARRIVEDAIRCRAFT
					tasks.unshift({
						title: '到达机位',
						desc: ope.operator,
						operateDate: this.formatTime(ope.operateDate)
					})
				}
				if (item.SUBCABIN) {
					let ope = item.SUBCABIN
					tasks.unshift({
						title: '货物分舱',
						desc: ope.operator,
						operateDate: this.formatTime(ope.operateDate)
					})
				}
				if (item.INSTALLEDCONFIRM) {
					let ope = item.INSTALLEDCONFIRM
					tasks.unshift({
						title: '装机确认',
						desc: ope.operator,
						operateDate: this.formatTime(ope.operateDate)
					})
				}
				if (item.INSTALLEDAUDIT) {
					let ope = item.INSTALLEDAUDIT
					tasks.unshift({
						title: '装机稽核',
						desc: ope.operator,
						operateDate: this.formatTime(ope.operateDate)
					})
				}
				
				if (item.HANDLINGCONFIRM) {
					let ope = item.HANDLINGCONFIRM
					tasks.unshift({
						title: '装卸确认',
						desc: ope.operator,
						operateDate: this.formatTime(ope.operateDate)
					})
				}
				return tasks
			},
			
			initTasks2 (item) {
				let tasks = []
				if (item.UNLOADER) {
					let ope = item.UNLOADER
					tasks.unshift({
						title: '卸机',
						desc: ope.operator,
						operateDate: this.formatTime(ope.operateDate)
					})
				}
				if (item.TOSTATION_STEVEDORING) {
					let ope = item.TOSTATION_STEVEDORING
					tasks.unshift({
						title: '装卸运往货站',
						desc: ope.operator,
						operateDate: this.formatTime(ope.operateDate)
					})
				}
				if (item.TOSTATION_DRIVER) {
					let ope = item.TOSTATION_DRIVER
					tasks.unshift({
						title: '运往货站',
						desc: ope.operator + '驾驶拖车' + item.secondTransportCarCode,
						operateDate: this.formatTime(ope.operateDate)
					})
				}
				if (item.ARRIVEDSTATION) {
					let ope = item.ARRIVEDSTATION
					tasks.unshift({
						title: '到达货站',
						desc: ope.operator,
						operateDate: this.formatTime(ope.operateDate)
					})
				}
				if (item.WAREHOUSING) {
					let ope = item.WAREHOUSING
					tasks.unshift({
						title: '货站入库',
						desc: ope.operator,
						operateDate: this.formatTime(ope.operateDate)
					})
				}
				return tasks
			}
		}
	}
</script>

<style lang="scss">
	.nav-bar {
		display: flex;
		background-color: #1891FE;
		align-items: center;
		padding-top: calc(var(--status-bar-height) + 34rpx);
		.back-icon {
			border-top: 4rpx solid #ffffff;
			border-left: 4rpx solid #ffffff;
			height: 30rpx;
			width: 39rpx;
			transform: rotate(315deg);
			position: relative;
			margin-left: 40rpx;
		}
		.nav-btn {
			width: 45rpx;
			height: 35rpx;
			margin-right: 44rpx;
		}
	}
	.title {
		text-align: center;
		width: 100%;
		font-family: SourceHanSansCN-Bold;
		font-size: 38rpx;
		color: #ffffff;
	}
	
	.flight-header-block {
		position: relative;
		.header-image {
			width: 100%;
			height: 177rpx;
		}
		.flight-info-block {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			.label {
				font-family: PingFangSC-Regular;
				font-size: 28rpx;
				color: #ffffff;
				opacity: 0.6;
				margin-bottom: 8rpx;
			}
			.value {
				font-family: SourceHanSansCN-Bold;
				font-size: 38rpx;
				color: #ffffff;
			}
		}
	}
	
	.list {
		margin: 14rpx auto 0 auto;
		width: calc(100vw - 32rpx);
		max-height: calc(100vh - 300rpx);
		overflow-y: auto;
		.container {
			display: flex;
			align-items: center;
			background-color: #ffffff;
			border-radius: 8rpx;
			min-height: 142rpx;
			width: 100%;
			margin-bottom: 14rpx;
			.container-icon {
				margin-left: 38rpx;
				width: 52rpx;
				height: 52rpx;
			}
			.container-code {
				margin-left: 11rpx;
				font-family: SourceHanSansCN-Bold;
				font-size: 35rpx;
				color: #000000;
			}
			.status {
				margin-left: 67rpx;
				font-weight: bold;
				font-family: SourceHanSansCN-Medium;
				font-size: 35rpx;
				color: #333333;
			}
		}
		
		.container-history {
			display: flex;
			position: relative;
			align-items: center;
			background-color: #ffffff;
			border-radius: 8rpx;
			min-height: 142rpx;
			width: 100%;
			margin-bottom: 14rpx;
			margin-left: 0;
			.container-icon {
				margin-left: 38rpx;
				width: 52rpx;
				height: 52rpx;
			}
			.container-code {
				font-family: SourceHanSansCN-Bold;
				font-size: 35rpx;
				color: #000000;
			}
			.status {
				margin-left: 67rpx;
				font-weight: bold;
				font-family: SourceHanSansCN-Medium;
				font-size: 35rpx;
				color: #333333;
			}
			.arror {
				width: 27rpx;
				height: 27rpx;
				position: absolute;
				right: 33rpx;
			}
			.expand {
				transform: rotate(180deg);
				transition: all 0.5s ease-in-out;
			}
			.hide {
				transform: rotate(0deg);
				transition: all 0.5s ease-in-out;
			}
			.status-block {
				margin-left: 67rpx;
				// background-color: red;
				display: block;
				.status-block-status {
					font-weight: bold;
					font-family: SourceHanSansCN-Medium;
					font-size: 35rpx;
					color: #333333;
				}
				.operation {
					font-family: SourceHanSansCN-Regular;
					font-size: 28rpx;
					color: #999999;
					opacity: 0.99;
				}
			}
			
			.container-code-block {
				.container-code {
					display: flex;
					align-items: center;
					image {
						margin-left: 38rpx;
						margin-right: 11rpx;
						width: 52rpx;
						height: 52rpx;
					}
				}
				.container-code-block-time {
					text-align: right;
					font-family: SourceHanSansCN-Regular;
					font-size: 28rpx;
					color: #999999;
					opacity: 0.99;
				}
			}
			
			.timeline-layout {
				position: relative;
				margin-bottom: 12rpx;
				.vertical-line {
					position: absolute;
					top: 37rpx;
					border-left: 1rpx solid #d8d8d8;
					width: 0;
					height: calc(100% - 107rpx);
					left: 328rpx;
				}
				.lastest-block {
					position: relative;
					.lastest-block-container-row {
						width: calc(100vw - 40rpx);
						position: relative;
						display: flex;
						align-items: center;
						margin-bottom: 20rpx;
						image {
							margin-left: 49rpx;
							width: 52rpx;
							height: 52rpx;
						}
						.status {
							margin-left: 0;
							position: absolute;
							left: 356rpx;
						}
					}
					.lastest-block-time-operator {
						position: relative;
						width: 100%;
						display: flex;
						padding-left: 178rpx;
						font-family: SourceHanSansCN-Regular;
						font-size: 28rpx;
						color: #999999;
						opacity: 0.99;
					}
				}
				
				.history-block {
					position: relative;
					margin-top: 40rpx;
					.history-block-top {
						display: flex;
						align-items: center;
						padding-left: 178rpx;
						.history-block-top-time {
							font-family: SourceHanSansCN-Regular;
							font-size: 28rpx;
							color: #999999;
							opacity: 0.99;
						}
					}
					.history-block-bottom {
						margin-top: 13rpx;
						padding-left: 356rpx;
						font-family: SourceHanSansCN-Regular;
						font-size: 28rpx;
						color: #999999;
						opacity: 0.99;
					}
				}
			}
		}
	}
	
		
	.circle {
		position: absolute;
		top: 15rpx;
		left: 328rpx;
		transform: translateX(-50%);
		width: 22rpx;
		height: 22rpx;
		border-radius: 11rpx;
		border: 6rpx solid #d8d8d8;
		background-color: #ffffff;
	}
</style>

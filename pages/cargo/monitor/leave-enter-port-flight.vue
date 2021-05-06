<template>
	<view>
		<view class="nav-bar">
			<view class="back-icon" @tap="goBack"></view>
			<view class="title">
				{{title}}
			</view>
			<image
				class="nav-btn"
			 @tap="changeSearchBarStatus"
				src="@/static/monitor-flight-search.png">
			</image>
		</view>
		
		<uploader-search
			:style="{'padding-top': showSearchBar?'40rpx':'0','background-color':'#1891fe'}"
			ref="uploaderSearch"
		 :auto-show="autoShow"
		 :show-origin="false"
		 @search="search"
		></uploader-search>
		
		<view class="flight-header-block">
			<template v-if="type=='D'">
				<image
					class="header-image"
					src="@/static/monitor-flight-layout-header.png"
				></image>
				<view class="flight-info-block">
					<view class="top-line">
						<view class="top-line-label">
							航班截关
						</view>
						<view class="top-line-label">
							出库
						</view>
						<view class="top-line-label">
							途中
						</view>
						<view class="top-line-label">
							机下
						</view>
					</view>
					
					<view class="sum-line">
						<view class="sum-line-value">
							航班截关
							<view class="sum-line-value-center">
								{{ getSum(closedArr)}}
							</view>
						</view>
						<view class="sum-line-value">
							出库
							<view class="sum-line-value-center">
								{{ getSum(outofStockArr) }}
							</view>
						</view>
						<view class="sum-line-value">
							途中
							<view class="sum-line-value-center">
								{{ getSum(enRouteArr) }}
							</view>
						</view>
						<view class="sum-line-value">
							机下
							<view class="sum-line-value-center">
								{{ getSum(offPlaneArr) }}
							</view>
						</view>
					</view>
					
					<view class="outter-inner-sum-line">
						<view class="outter-inner-sum-line-label">
							国际
						</view>
						<view class="outter-inner-sum-line-block">
							<view class="outter-inner-sum-line-value">
								航班截关
								<view class="outter-inner-sum-line-value-center">
									{{ closedArr[1] }}
								</view>
							</view>
							<view class="outter-inner-sum-line-value">
								出库
								<view class="outter-inner-sum-line-value-center">
									{{ outofStockArr[1] }}
								</view>
							</view>
							<view class="outter-inner-sum-line-value">
								途中
								<view class="outter-inner-sum-line-value-center">
									{{ enRouteArr[1] }}
								</view>
							</view>
							<view class="outter-inner-sum-line-value">
								机下
								<view class="outter-inner-sum-line-value-center">
									{{ offPlaneArr[1] }}
								</view>
							</view>
						</view>
					</view>
					
					<view class="outter-inner-sum-line">
						<view class="outter-inner-sum-line-label">
							国内
						</view>
						<view class="outter-inner-sum-line-block">
							<view class="outter-inner-sum-line-value">
								航班截关
								<view class="outter-inner-sum-line-value-center">
									{{ closedArr[0] }}
								</view>
							</view>
							<view class="outter-inner-sum-line-value">
								出库
								<view class="outter-inner-sum-line-value-center">
									{{ outofStockArr[0] }}
								</view>
							</view>
							<view class="outter-inner-sum-line-value">
								途中
								<view class="outter-inner-sum-line-value-center">
									{{ enRouteArr[0] }}
								</view>
							</view>
							<view class="outter-inner-sum-line-value">
								机下
								<view class="outter-inner-sum-line-value-center">
									{{ offPlaneArr[0] }}
								</view>
							</view>
						</view>
					</view>
				</view>
			</template>
			<template v-else>
				<image
					class="header-image"
					src="@/static/monitor-flight-layout-header.png"
				></image>
				<view class="flight-info-block">
					<view class="top-line" :style="{'padding-right': type=='D'?'0':'55rpx'}">
						<view class="top-line-label">
							待运区
						</view>
						<view class="top-line-label">
							途中
						</view>
						<view class="top-line-label">
							入库
						</view>
					</view>
					
					<view class="sum-line" :style="{'padding-right': type=='D'?'0':'55rpx'}">
						<view class="sum-line-value">
							待运区
							<view class="sum-line-value-center">
								{{ getSum(domWaitArr)}}
							</view>
						</view>
						<view class="sum-line-value">
							途中
							<view class="sum-line-value-center">
								{{ getSum(enRouteArr) }}
							</view>
						</view>
						<view class="sum-line-value">
							入库
							<view class="sum-line-value-center">
								{{ getSum(warehousArr) }}
							</view>
						</view>
					</view>
					
					<view class="outter-inner-sum-line" :style="{'padding-right': type=='D'?'0':'55rpx'}">
						<view class="outter-inner-sum-line-label">
							国际
						</view>
						<view class="outter-inner-sum-line-block">
							<view class="outter-inner-sum-line-value">
								待运区
								<view class="outter-inner-sum-line-value-center">
									{{ domWaitArr[1] }}
								</view>
							</view>
							<view class="outter-inner-sum-line-value">
								途中
								<view class="outter-inner-sum-line-value-center">
									{{ enRouteArr[1] }}
								</view>
							</view>
							<view class="outter-inner-sum-line-value">
								入库
								<view class="outter-inner-sum-line-value-center">
									{{ warehousArr[1] }}
								</view>
							</view>
						</view>
					</view>
					
					<view class="outter-inner-sum-line" :style="{'padding-right': type=='D'?'0':'55rpx'}">
						<view class="outter-inner-sum-line-label">
							国内
						</view>
						<view class="outter-inner-sum-line-block">
							<view class="outter-inner-sum-line-value">
								待运区
								<view class="outter-inner-sum-line-value-center">
									{{ domWaitArr[0] }}
								</view>
							</view>
							<view class="outter-inner-sum-line-value">
								途中
								<view class="outter-inner-sum-line-value-center">
									{{ enRouteArr[0] }}
								</view>
							</view>
							<view class="outter-inner-sum-line-value">
								入库
								<view class="outter-inner-sum-line-value-center">
									{{ warehousArr[0] }}
								</view>
							</view>
						</view>
					</view>
				</view>
			</template>
		</view>
	
		<view class="abnormal-alarm-bar" v-if="abnormalCarNum!=0">
			<image src="@/static/monitor-flight-alarm.png"></image>
			<view>
				今日异常车{{abnormalCarNum}}辆
			</view>
		</view>
		
		<view :class="{'list': true, 'list-show-search': showSearchBar, 'list-hide-search': !showSearchBar}">
			<block v-for="(flightObj, index) in list" :key="index">
				<view class="flight-card" @tap="clickCard(flightObj)">
					<view class="flight-card-top">
						<view class="flight-number-block">
							<view>
								{{flightObj.flight}}
							</view>
							<image src="@/static/monitor-flight-alert.png" v-if="flightObj.abnormalCarNum!=0"></image>
							<view class="alert-num" v-if="flightObj.abnormalCarNum!=0">
								{{flightObj.abnormalCarNum}}
							</view>
						</view>
						
						<view class="status">
							{{formatStatus(flightObj.flightStatus)}}
						</view>
					</view>
					<view class="flight-card-center">
						<view class="left-block">
							<view class="ctot-label">
								{{type=='D'?'CTOT':'预计落地时间'}}
							</view>
							<view class="ctot-value">
								{{type=='D'?flightObj.ctot:flightObj.scheduleTime}}
							</view>
							<view class="stand-code-label">
								机位
							</view>
							<view class="stand-code-value">
								{{flightObj.standCode}}
							</view>
						</view>
						<view v-if="type=='D'" class="right-block">
							<image src="/static/monitor-flight-clock.png"></image>
							<view class="right-block-label">
								截关
							</view>
							<view class="right-block-time">
								{{flightObj.closeTime}}
							</view>
						</view>
					</view>
					<view class="flight-card-bottom" :style="{'max-width': type=='D'?'430rpx':'340rpx'}">
						<view class="flight-card-bottom-label">
							<template v-if="type=='D'">
								截关
								<view class="dot"></view>
								出库
								<view class="dot"></view>
								途中
								<view class="dot"></view>
								机下
							</template>
							<template v-else>
								待运区
								<view class="dot"></view>
								途中
								<view class="dot"></view>
								入库
							</template>
						</view>
						<view class="flight-card-bottom-value">
							<view class="carNum">
								{{flightObj.carNum[0]}}
							</view>
							<view class="dot"></view>
							<view class="carNum">
								{{flightObj.carNum[1]}}
							</view>
							<view class="dot"></view>
							<view class="carNum">
								{{flightObj.carNum[2]}}
							</view>
							<view v-if="type=='D'" class="dot"></view>
							<view v-if="type=='D'" class="carNum">
								{{flightObj.carNum[3]}}
							</view>
						</view>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	import { validatenull } from '@/common/util/validate.js'
	import navBar from '@/pages/cargo/nav-bar.vue'
	import listContent from '@/pages/cargo/list-content.vue'
	import uploaderSearch from '@/pages/cargo/uploader-search.vue'
	import { getAppMonitor, getAppMonitorTop, onError } from '@/api/cargo/index.js'
	import dayjs from '@/common/util/dayjs.min.js'
	import { mapGetters } from 'vuex'
	export default {
		components: {
			navBar,
			listContent,
			uploaderSearch
		},
		data () {
			return {
				title: '出港监控视图',
				showSearchBar: false,
				inputValue: '',
				list: [],
				form: {
					flight: '',
					direction: 'D',
					date: ''
				},
				abnormalCarNum: 0,
				flightStatuses: [],
				autoShow: false,
				closedArr: [],
				enRouteArr: [],
				offPlaneArr: [],
				outofStockArr: [],
				
				domWaitArr: [],
				warehousArr: [],
				type: ''
			}
		},
		
		computed: {
			...mapGetters(['remoteDic', 'depStatusList'])
		},
		
		mounted () {
			this.$refs.uploaderSearch.close()
			this.form.date = dayjs().format('YYYY-MM-DD') + ' 00:00:00'
			this.getFlightStatuses()
		},
		
		onLoad (e) {
			this.type = e.type
			if (this.type === 'A') {
				this.title = '进港监控视图'
				this.form.direction = 'A'
			}
		},
		
		methods: {
			getFlightStatuses () {
				this.$loading()
				console.log('remoteDic', this.remoteDic)
        if (this.remoteDic.BASE_FLIGHT_STATUS) {
          this.flightStatuses = this.remoteDic.BASE_FLIGHT_STATUS
        } else  {
          this.flightStatuses = this.depStatusList.map(e => {
            return {
              statusCode: e.value,
              description: e.label
            }
          })
        }
				
				console.log('this.flightStatuses', this.flightStatuses)
				this.getList(this.form)
			},
			changeSearchBarStatus () {
				this.autoShow = true
				this.$refs.uploaderSearch.changeStatus()
				this.showSearchBar = !this.showSearchBar
			},
			clickCard (e) {
				uni.setStorageSync('monitor-detail-cars', e.cargos)
				let type = this.type
				uni.navigateTo({
					url: `/pages/cargo/monitor/leave-enter-port-detail?type=${type}&flight=${e.flight}`
				})
			},
			
			search (searchForm) {
				this.form.flight = searchForm.flight
				this.form.date = searchForm.flightDate + ' 00:00:00'
				this.getList(this.form)
			},
			
			formatStatus (status) {
                if (!this.flightStatuses) {
                    return status
                }
				let statusName = this.flightStatuses.find(v => v.statusCode === status)
				if (statusName) {
					return statusName.description
				} else {
					return status
				}
			},
			
			getSum (arr) {
				if (validatenull(arr)) {
					return 0
				}
				return arr.reduce((a, b) => a + b)
			},
			
			getList (form) {
				uni.hideLoading()
				this.$loading()
				getAppMonitorTop({
					direction: this.type,
					date: dayjs().format('YYYY-MM-DD') + ' 00:00:00'
				}).then(res => {
					console.log('getAppMonitorTop', res)
					if (res.status) {
						if (this.type === 'D') {
							this.abnormalCarNum = parseInt(res.data.abnormalCarNum)
							this.closedArr = res.data.closedCarNum.split('/').map(e => e = parseInt(e))
							this.offPlaneArr = res.data.offPlaneNum.split('/').map(e => e = parseInt(e))
							this.outofStockArr = res.data.outofStockNum.split('/').map(e => e = parseInt(e))
						} else {
							this.domWaitArr = [parseInt(res.data.domWaitCarNum), 0]
							this.warehousArr = res.data.warehousNum.split('/').map(e => e = parseInt(e))
						}
						this.enRouteArr = res.data.enRouteNum.split('/').map(e => e = parseInt(e))
					}
					getAppMonitor(form).then(res => {
						console.log('getAppMonitor-res', res)
						if (res.status) {
							for (let key in res.data) {
								let e = res.data[key]
								e.cargos.forEach((v, idx) => {
									v.id = idx
								})
								this.list.push({
									flight: key,
									standCode: e.stand,
									closeTime: e.closeTime ? dayjs(e.closeTime).format('HH:mm') : '',
									scheduleTime: e.scheduleTime? dayjs(e.scheduleTime).format('HH:mm') : '',
									cargos: e.cargos,
									flightStatus: e.flightStatus,
									flightStatusName: this.formatStatus(e.flightStatus),
									carNum: e.carNum ? e.carNum.split('/'):[],
									ctot: e.localCtot? dayjs(e.localCtot).format('HH:mm') : '',
									abnormalCarNum: e.abnormalCarNum ? e.abnormalCarNum: 0
								})
							}
							if (this.form.flight !== '') {
								this.list = this.list.filter(e => e.flight.indexOf(this.form.flight) !== -1)
							}
							// this.$refs.listContent.setList(this.list)
						}
						this.$message(res.message)
						uni.hideLoading()
					}).catch(err => {
						onError(err)
					})
					
				}).catch(err => {
					onError(err)
					getAppMonitor(form).then(res => {
						console.log('res', res)
						if (res.status) {
							for (let key in res.data) {
								let e = res.data[key]
								e.cargos.forEach((v, idx) => {
									v.id = idx
								})
								this.list.push({
									flight: key,
									standCode: e.stand,
									closeTime: e.closeTime ? dayjs(e.closeTime).format('HH:mm:ss') : '',
									cargos: e.cargos,
									flightStatus: e.flightStatus,
									flightStatusName: this.formatStatus(e.flightStatus),
									carNum: e.carNum ? e.carNum.split('/'):[],
									ctot: e.localCtot? dayjs(e.localCtot).format('HH:mm:ss') : '',
									abnormalCarNum: e.abnormalCarNum ? e.abnormalCarNum: 0
								})
							}
							if (this.form.flight !== '') {
								this.list = this.list.filter(e => e.flight.indexOf(this.form.flight) !== -1)
							}
							// this.$refs.listContent.setList(this.list)
						}
						this.$message(res.message)
						uni.hideLoading()
					}).catch(err => {
						onError(err)
					})
				})
			},
			
			goBack () {
				uni.navigateBack()
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
			height: 290rpx;
		}
		.flight-info-block {
			position: absolute;
			top: 24rpx;
			padding: 0 39rpx 36rpx 94rpx;
			width: 100%;
			.top-line {
				display: flex;
				justify-content: space-between;
				padding-left: 73rpx;
				.top-line-label {
					font-family: PingFangSC-Medium;
					font-size: 28rpx;
					color: #ffffff;
				}
			}
			.sum-line {
				display: flex;
				justify-content: space-between;
				padding-left: 73rpx;
				margin-top: 23rpx;
				.sum-line-value {
					font-family: PingFangSC-Medium;
					font-size: 28rpx;
					color: rgba($color: #ffffff, $alpha: 0);
					position: relative;
					.sum-line-value-center {
						font-family: SourceHanSansCN-Regular;
						font-size: 38rpx;
						color: #ffffff;
						font-weight: normal;
						position: absolute;
						top: -9rpx;
						left: 50%;
						transform: translateX(-50%);
					}
				}
			}
			.outter-inner-sum-line {
				display: flex;
				margin-top: 26rpx;
				.outter-inner-sum-line-label {
					white-space: nowrap;
					margin-right: 18rpx;
					font-family: PingFangSC-Regular;
					font-size: 28rpx;
					color: #ffffff;
					opacity: 0.8;
				}
				.outter-inner-sum-line-block {
					display: flex;
					justify-content: space-between;
					width: 100%;
					
					.outter-inner-sum-line-value {
						position: relative;
						font-family: PingFangSC-Medium;
						font-size: 28rpx;
						color: rgba($color: #ffffff, $alpha: 0);
						position: relative;
						.outter-inner-sum-line-value-center {
							font-family: SourceHanSansCN-Regular;
							font-size: 31rpx;
							color: #ffffff;
							position: absolute;
							top: 0;
							left: 50%;
							transform: translateX(-50%);
						}
					}
				}
			}
		}
	}
	
	.abnormal-alarm-bar {
		display: flex;
		align-items: center;
		height: 53rpx;
		width: 100%;
		background-color: #FEEBEB;
		// margin-top: 15rpx;
		image {
			margin: 0 19rpx 0 33rpx;
			width: 32rpx;
			height: 29rpx;
		}
		font-family: SourceHanSansCN-Medium;
		font-size: 31rpx;
		color: #f94c4a;
		font-weight: bold;
	}
	
	.list {
		width: calc(100vw - 42rpx);
		height: calc(100vh - 500rpx);
		overflow-y: auto;
		margin: 16rpx auto 0 auto;
		.flight-card {
			min-height: 199rpx;
			background-color: #ffffff;
			border-radius: 6rpx;
			padding: 32rpx 29rpx 30rpx 20rpx;
			margin-bottom: 14rpx;
			.flight-card-top {
				display: flex;
				justify-content: space-between;
				.flight-number-block {
					position: relative;
					display: flex;
					align-items: center;
					font-family: SourceHanSansCN-Bold;
					font-size: 35rpx;
					font-weight: bold;
					color: #000000;
					image {
						margin-left: 31rpx;
						width: 43rpx;
						height: 31rpx;
					}
					.alert-num {
						position: absolute;
						font-family: SourceHanSansCN-Regular;
						font-size: 24rpx;
						color: #ffffff;
						z-index: 400;
						right: 15rpx ;
					}
				}
				.status {
					font-family: SourceHanSansCN-Medium;
					font-size: 35rpx;
					font-weight: bold;
					color: #0091ff;
				}
			}
			.flight-card-center {
				margin-top: 22rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.left-block {
					display: flex;
					align-items: baseline;
					.ctot-label {
						font-family: SourceHanSansCN-Regular;
						font-size: 24rpx;
						color: #999999;
						margin-right: 10rpx;
					}
					.ctot-value {
						min-width: 70rpx;
						font-family: SourceHanSansCN-Regular;
						font-size: 24rpx;
						color: #999999;
						// padding-right: 16rpx;
					}
					.stand-code-label { 
						margin: 0 10rpx 0 16rpx;
						font-family: SourceHanSansCN-Regular;
						font-size: 24rpx;
						color: #999999;
						border-left: 1rpx solid #d8d8d8;
						padding-left: 14rpx;
					}
					.stand-code-value {
						font-family: SourceHanSansCN-Regular;
						font-size: 24rpx;
						color: #999999;
					}
				}
				.right-block {
					display: flex;
					align-items: center;
					image {
						width: 24rpx;
						height: 24rpx;
					}
					.circle {
						width: 24rpx;
						height: 24rpx;
						border-radius: 12rpx;
						background-color: rgba(0, 0, 0, 0.1);
					}
					.right-block-label {
						position: relative;
						top: -2rpx;
						margin-left: 5rpx;
						font-family: SourceHanSansCN-Regular;
						font-size: 21rpx;
						color: rgba(0, 0, 0, 0.5);
					}
					.right-block-time {
						min-width: 69rpx;
						margin-left: 8rpx;
						font-family: SourceHanSansCN-Regular;
						font-size: 28rpx;
						font-weight: bold ;
						color: rgba(0, 0, 0, 0.85);
					}
				}
			}
			.flight-card-bottom {
				margin-top: 21rpx;
				position: relative;
				left: -6rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				// min-width: 401rpx;
				max-width: 430rpx;
				height: 35rpx;
				background-color: #ECF4FA;
				border-radius: 17rpx;
				padding: 5rpx 14rpx;
				.dot {
					width: 6rpx;
					height: 6rpx;
					border-radius: 3rpx;
					background-color: #0091ff;
					margin: 0 6rpx;
				}
				.flight-card-bottom-label {
					display: flex;
					align-items: center;
					font-family: SourceHanSansCN-Regular;
					font-size: 21rpx;
					color: #0091ff;
					opacity: 0.6;
				}
				.flight-card-bottom-value {
					display: flex;
					align-items: center;
					.carNum {
						// position: relative;
						// top: 5rpx;
						// font-family: SourceHanSansCN-Regular;
						font-size: 25rpx;
						font-weight: bold;
						color: #0091ff;
						opacity: 0.9;
					}
					// .dot {
					// 	position: relative;
					// 	top: 3rpx;
					// }
				}
			}
		}
	}
	
	.list-show-search {
		height: calc(100vh - 930rpx);
		transition: all 0.5s ease-in-out;
	}
	
	.list-hide-search {
		height: calc(100vh - 500rpx);
		transition: all 0.5s ease-in-out;
	}
</style>

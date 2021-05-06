<template>
	<view class="card" v-if="refreshCard">
		<view class="steps">
			<uni-steps
				:options="statuses"
				:active="statusIdx">
			</uni-steps>
		</view>
		<view class="row">
			<view class="flight chunk">
				{{flight.iataCarrier + flight.flight}}
			</view>
			<view class="stand chunk">
				<span class="label">机位:</span>
				{{flight.stand}}
			</view>
		</view>
		<view class="row">
			<view class="block" >
				<view class="label">机号:</view>
				<view class="value">{{flight.registration}}</view>
			</view>
			<view class="block">
				<view class="label">{{direction==='D'?'登机口:':'下客点:'}}</view>
				<view class="value">{{serviceGuide? serviceGuide.gate:flight.gate}}</view>
			</view>
			<view class="block">
				<view class="label">日期:</view>
				<view class="value">{{opdate}}</view>
			</view>
		</view>
		
		<view class="row">
			<template v-if="direction=='D'">
				<template v-if="role=='登机口引导单内场客服'">
					<view :class="{'btn': true, 'not-active': !serviceGuide.id}" @tap="sendCar(param)">
						派车
					</view>
					<view class="btn" @tap="infieldGateAssess(param)">
						登机口核对
					</view>
					<view class="btn" @tap="infieldAssessMiss(param)">
						核对遗漏
					</view>
					<view class="btn" @tap="confirmguestAll(param)">
						客齐
					</view>
				</template>
				<template v-else-if="role=='登机口引导单外场客服'">
					<view :class="{'btn': true, 'not-active': !serviceGuide.id}" @tap="outfieldGateAssess(param)">
						登机口核对
					</view>
					<view class="btn" @tap="outfieldStandAssess(param)">
						机下核对
					</view>
					<view class="btn" @tap="outfieldAssessMiss(param)">
						核对遗漏
					</view>
				</template>
			</template>
			<template v-else>
				<template v-if="role=='登机口引导单内场客服'">
					<view :class="{'btn': true, 'not-active': !serviceGuide.id}" @tap="sendCarA(param)">
						派车
					</view>
				</template>
				<template v-else-if="role=='登机口引导单外场客服'">
					<view :class="{'btn': true, 'not-active': !serviceGuide.id}" @tap="outfieldStandAssessA(param)">
						机下核对
					</view>
				</template>
			</template>
		</view>
	</view>
</template>

<script>
	import uniSteps from '@/components/uni-steps/uni-steps.vue'
	import { innerFlightBtns, outterFlightBtns, innerFlightBtnsA, outterFlightBtnsA } from './btns.js'
	import dayjs from '../../common/util/dayjs.min.js'
	import { debounce } from '@/common/util/util.js'
	import {
					performOperation,
					onError,
					innerSendMsgToDriver,
					getOmitInfieldPics
				} from '@/api/guide/index.js'
	export default {
		components: {
			uniSteps
		},
		data () {
			return {
				passengerStatus: [{
					name: '在',
					value: 'in'
				}, {
					name: '不在',
					value: 'notIn'
				}],
				current: 0,
				btns: [],
				param: {},
				role: '登机口引导单内场客服',
				flight: {},
				serviceGuide: {},
				direction: '',
				statuses: [{
					title: '未接收'
				}, {
					title: '已接收'
				}, {
					title: '内场核对'
				}, {
					title: '外场核对'
				}, {
					title: '机下核对'
				}],
				statusIdx: 0,
				refreshCard: true
			}
		},
		computed: {
			opdate () {
				return dayjs(this.flight.opdate).format('YYYY-MM-DD')
			}
		},
		watch: {
			statusIdx: {
				handler(newval) {
					console.log('watch-new', newval)
				}
			}
		},
		methods: {
			// 出港
			// 内场客服
			// 派车
			sendCar: debounce(function (param) {
				if (param.serviceGuide) {
					uni.setStorageSync('flightTaskId', param.flightTaskId)
					uni.setStorageSync('inner_form', param.serviceGuide)
					uni.navigateTo({
						url: `/pages/guide/inner-form?direction=${param.direction}`
					})
				}
			}, 100),
			
			// 登机口内场核对
			infieldGateAssess: debounce(function (param) {
				let serviceGuide = param.serviceGuide
				if (serviceGuide) {
					if (serviceGuide.id) {
						performOperation({
							serviceGuide: serviceGuide,
							flightTaskId: param.flightTaskId,
							operationType: 'GATE_INFIELD_CHECK'
						}).then(res => {
							if (res.status) {
								uni.setStorageSync('lastest_serviceGuide', res.data)
								this.statusIdx = 2
							}
							uni.showToast({
								title: res.message,
								icon: 'none',
								duration: 1000
							})
						}).catch(err => {
							onError(err)
						})
					} else {
						uni.showToast({
							title: '当前引导单未生成，请内场客服先派车',
							icon: 'none',
							duration: 2000
						})
					}
				}
			}, 100),
			
			// 内场核对遗漏
			infieldAssessMiss: debounce(function (param) {
				let guideId = param.guideId
				let operationType = 'OMIT_INFIELD_CHECK'
				if (guideId) {
					uni.navigateTo({
						url: `/pages/guide/check-omission?guideId=${guideId}&operationType=${operationType}&direction=D`
					})
				} else {
					uni.showToast({
						title: '当前引导单未生成，请内场客服先派车',
						icon: 'none',
						duration: 2000
					})
				}
			}, 100),
			
			// 客齐
			confirmguestAll: debounce(function (param) {
				let serviceGuide = param.serviceGuide
				if (serviceGuide) {
					if (serviceGuide.id) {
						performOperation({
							serviceGuide: serviceGuide,
							flightTaskId: param.flightTaskId,
							operationType: 'PASSENGERS_COMPLETE'
						}).then(res => {
							console.log('客齐', res)
							if (res.status) {
								uni.setStorageSync('lastest_serviceGuide', res.data)
							}
							uni.showToast({
								title: res.message,
								icon: 'none',
								duration: 2000
							})
						}).catch(err => {
							onError(err)
						})
					} else {
						uni.showToast({
							title: '当前引导单未生成，请内场客服先派车',
							icon: 'none',
							duration: 2000
						})
					}
				}
			}, 100),
			
			// 外场客服
			// 登机口核对
			outfieldGateAssess: debounce(function (param) {
				let serviceGuide = param.serviceGuide
				if (serviceGuide) {
					if (serviceGuide.id) {
						performOperation({
							serviceGuide: serviceGuide,
							flightTaskId: param.flightTaskId,
							operationType: 'GATE_OUTFIELD_CHECK'
						}).then(res => {
							if (res.status) {
								uni.setStorageSync('lastest_serviceGuide', res.data)
								this.statusIdx = 3
							}
							uni.showToast({
								title: res.message,
								icon: 'none',
								duration: 1000
							})
						}).catch(err => {
							onError(err)
						})
					} else {
						uni.showToast({
							title: '当前引导单未生成，请内场客服先派车',
							icon: 'none',
							duration: 2000
						})
					}
				}
			}, 100),
			
			// 外场核对
			outfieldStandAssess: debounce(function (param) {
				let guideId = param.serviceGuide.id
				let taskId = param.flightTaskId
				let operationType = 'STAND_OUTFIELD_CHECK'
				uni.setStorageSync('check_omission_serviceGuide', param.serviceGuide)
				if (guideId) {
					uni.navigateTo({
						url: `/pages/guide/check-omission?guideId=${guideId}&operationType=${operationType}&direction=D&taskId=${taskId}`
					})
				} else {
					uni.showToast({
						title: '当前引导单未生成，请内场客服先派车',
						icon: 'none',
						duration: 2000
					})
				}
			}, 100),
			
			//核对遗漏
			outfieldAssessMiss: debounce(function (param) {
				let guideId = param.guideId
				if (guideId) {
					let getPicForm = {
						guideId: guideId,
						operationType: 'OMIT_INFIELD_CHECK',
						direction: this.direction
					}
					getOmitInfieldPics(getPicForm).then(res => {
						console.log('getOmitInfieldPics-res', res)
						if (res.status && res.data && res.data.picUrls) {
							uni.navigateTo({
								url: `/pages/guide/outfield-check?guideId=${guideId}&direction=D`
							})
						} else {
							uni.showToast({
								title: res.message,
								icon: 'none',
								duration: 2000
							})
						}
						uni.hideLoading()
					}).catch(err => {
						onError(err)
					})
				} else {
					uni.showToast({
						title: '当前引导单未生成，请内场客服先派车',
						icon: 'none',
						duration: 2000
					})
				}
			}, 100),
			
			
			
			// 进港
			// 内场客服
			// 派车
			sendCarA: debounce(function (param) {
				if (param.serviceGuide) {
					uni.setStorageSync('flightTaskId', param.flightTaskId)
					uni.setStorageSync('inner_form', param.serviceGuide)
					uni.navigateTo({
						url: `/pages/guide/inner-form?direction=${param.direction}`
					})
				}
			}, 100),
			
			// 外场客服
			// 外场核对
			outfieldStandAssessA: debounce(function (param) {
				let guideId = param.serviceGuide.id
				let taskId = param.flightTaskId
				let operationType = 'STAND_OUTFIELD_CHECK'
				uni.setStorageSync('check_omission_serviceGuide', param.serviceGuide)
				if (guideId) {
					uni.navigateTo({
						url: `/pages/guide/check-omission?guideId=${guideId}&operationType=${operationType}&direction=A&taskId=${taskId}`
					})
				} else {
					uni.showToast({
						title: '当前引导单未生成，请内场客服先派车',
						icon: 'none',
						duration: 2000
					})
				}
			}, 100),
			
			init (flight, form, role, task, direction) {
				// 初始化航班
				this.flight = flight
				let flightTaskId = task.id
				this.direction = direction
				if (this.direction === 'A') {
					this.statuses = [{
						title: '未接收'
					}, {
						title: '特车接收'
					}, {
						title: '外场核对'
					}]
				}
				this.role = role
				this.serviceGuide = form
				if (this.serviceGuide.status) {
					if (this.direction === 'D') {
						switch (this.serviceGuide.status) {
							case 'GATE_INFIELD_CHECK':
								this.statusIdx = 2
								break
							case 'GATE_OUTFIELD_CHECK':
								this.statusIdx = 3
								break
							case 'STAND_OUTFIELD_CHECK':
								this.statusIdx = 4
								break
							default:
								this.statusIdx = 0
								break
						}
					} else {
						switch (this.serviceGuide.status) {
							case 'SCHEDULING_ACCEPTANCE':
								this.statusIdx = 1
								break
							case 'STAND_OUTFIELD_CHECK':
								this.statusIdx = 2
								break
							default:
								this.statusIdx = 0
								break
						}
					}
				}
				
				this.param = {
					direction: direction,
					serviceGuide: form,
					flightTaskId: flightTaskId,
					guideId: form.id
				}
				var that = this
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import './uni.scss';
	.chunk {
		width: 33.33%;
	}
	.flight {
		font-size: 42rpx;
		font-weight: bold;
		color: #333333;
	}
	.stand {
		padding-left: 22rpx;
		font-size: 29rpx;
		font-weight: bold;
		color: #333333;
		.label {
			margin-right: 20rpx;
			font-family: SourceHanSansSC;
			font-size: 28rpx;
			font-weight: normal;
			color: #a6a6a6;
		}
	}
	.gate {
		font-family: SourceHanSansSC;
		font-size: 35rpx;
		font-weight: normal;
		color: #0090ff;
	}
	.status {
		text-align: right;
		font-family: SourceHanSansSC;
		font-size: 35rpx;
		font-weight: normal;
		color: #ff9600;
	}
	.row-message {
		padding-left: 20rpx;
		.label {
			margin-top: 10rpx;
			margin-right: 20rpx;
			margin-bottom: 10rpx;
			font-family: SourceHanSansSC;
			font-size: 28rpx;
			font-weight: normal;
			color: #a6a6a6;
		}
		.textarea-input {
			border: 1rpx solid #818284;
			padding-top: 5rpx;
			padding-left: 10rpx;
			width: 100%;
		}
	}
	.not-active {
		background-color: grey;
	}
</style>

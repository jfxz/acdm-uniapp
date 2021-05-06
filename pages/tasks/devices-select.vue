<template>
	<view class="deviceSelect_view" @tap.stop.prevent @touchmove.stop.prevent>
		<view class="head">
			<view class="btn" @tap="close">取消</view>
			<view class="title">任务与设备绑定</view>
			<view class="btn" @tap="submit">确定</view>
		</view>
		<view class="main">
			<scroll-view scroll-y class="tabs">
				<view v-for="(item,index) in deviceTypeList" :key="item.id" class="tab-item" :style="{background: tabIndex === index? '#f0f0f0':''}"
				 @tap.stop="clickTab(item,index)">
					<view>{{item.name}}</view>
				</view>
			</scroll-view>
			<scroll-view scroll-y class="devices">
				<view v-for="item in selectChildren" :key="item.id" class="device-item" @tap="selectDevice(item)">
					<view class="deviceNo-image">
						<view class="deviceNo">{{item.name}}</view>
						<image src="../../static/task-dialog-ok-normal.png" class="task_ok_image" v-if="!item.selStatus"></image>
						<image src="../../static/task-dialog-ok-pressed.png" class="task_ok_image" v-if="item.selStatus"></image>
					</view>
					<view class="deviceType">
						<text>{{item.deviceCode}}</text>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {
		getDevicesList,
		putTaskStatus
	} from '@/api/task/index.js'
	import {
		deepCopy
	} from '@/common/util/util.js'
	import {
		changeBindDevice
	} from '@/api/guide/index.js'
	export default {
		props: {
			task: {
				type: Object,
				default: {}
			},
			// 引导服务单司机
			guideDriver: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				curtask: [], //当前任务
				tabIndex: 0,
				selDevIds: [], // 已选择的设备id
				selDevIdsNew: [], //资质加上设备id
				deviceTypeList: [], //设备父项
				selectChildren: [] //设备子项

			}
		},
		created() {
			console.log('task', this.task)
			this.curtask = this.task
			this.init()
		},
		onLoad() {},
		methods: {
			// 选择左侧设备类型
			clickTab(tab, index) {
				this.tabIndex = index
				this.selectChildren = tab.devices
			},
			// 选择设备
			selectDevice(device) {
				if (this.guideDriver) {
					// 如果是引导服务单司机的任务，只能单选一个设备
					let status = device.selStatus
					this.selectChildren.forEach(e => e.selStatus = false)
					device.selStatus = !status
				} else {
					if (device.selStatus) {
						device.selStatus = false
					} else {
						device.selStatus = true
					}
				}
				this.$forceUpdate()
				// // 判断当前资质下id是否存在，加入还是删除
				let index = this.selDevIdsNew.findIndex(item => (item.split('/')[0] === this.deviceTypeList[this.tabIndex].id &&
					item.split('/')[1] === device.id))
				if (index !== -1) {
					this.selDevIds.splice(index, 1)
					this.selDevIdsNew.splice(index, 1)
				} else {
					let selecteQualificationRes = ''
					selecteQualificationRes = this.deviceTypeList[this.tabIndex].id + '/' + device.id
					if (this.guideDriver) {
						this.selDevIdsNew = [selecteQualificationRes]
						this.selDevIds = [device.id]
					} else {
						this.selDevIdsNew.push(selecteQualificationRes)
						this.selDevIds.push(device.id)
					}
				}
				console.log('已经选择设备', this.selDevIdsNew)
			},
			// 初始化
			init() {
				getDevicesList({
					taskDefId: this.curtask.taskDefId,
					flightTaskId: this.curtask.id
				}).then(res => {
					if (res.status) {
						this.deviceTypeList = deepCopy(res.data.DEVICE)
						console.log('res.data.DEVICE', res.data.DEVICE)
						this.handleData()
						if (this.deviceTypeList.length > 0) {
							this.selectChildren = this.deviceTypeList[0].devices
						} else {
							this.selectChildren = []
						}
						console.log('this.selectChildren', this.selectChildren, this.deviceTypeList)

					}
				})
			},
			//数据初始化处理
			handleData() {
				if (this.curtask.deviceIds) {
					this.selDevIds = this.curtask.deviceIds.split(',')
				}
				if (this.curtask.selecteQualificationRes) {
					this.selDevIdsNew = this.curtask.selecteQualificationRes.split(',')
				}
				console.log('this.deviceTypeList', this.selDevIdsNew)
				this.deviceTypeList.forEach((dev, index) => {
					dev.devices.forEach((res, resIndex) => {
						if (res) {
							this.selDevIdsNew.forEach(item => {
								console.log('selStatus', item.split('/')[1], res.id)
								if (item.split('/')[0] === dev.id && item.split('/')[1] === res.id) {
									res.selStatus = true
								}
							})
						}
					})
				})
				console.log('this.deviceTypeList', this.deviceTypeList)
			},
			// 取消
			close() {
				this.$emit('closeSelect')
			},
			// 初始化数据
			initData() {
				this.deviceTypeList = []
				this.selectChildren = []
				this.tabIndex = 0
				this.selectDeviceIds = []
			},
			// 确认
			submit() {
				let form = deepCopy(this.curtask)
				form.deviceIds = this.selDevIds.join(',')
				form.selecteQualificationRes = this.selDevIdsNew.join(',')
				let changeBindDevice1 = changeBindDevice
				putTaskStatus(form).then(res => {
					if (res.status) {
						this.$message('操作成功')
						this.$emit('flash')
						changeBindDevice1({
							flightTaskId: form.id,
							flightId: form.flightId,
							deviceId: form.deviceIds,
							isBind: '1'
						}).then(res => {
							console.log('changeBindDevice-res', res)
						}).catch(err => {
							onError(err)
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.deviceSelect_view {
		height: 100%;
		overflow-y: hidden;

		.head {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			padding: 35rpx 45rpx;
			font-family: SourceHanSansSC-Regular;
			height: 13%;

			.title {
				font-size: 35rpx;
				color: #333333;
			}

			.btn {
				font-size: 32rpx;
				color: #0090ff;
			}
		}

		.main {
			display: flex;
			flex-direction: row;
			height: 100%;

			.tabs {
				width: 39%;
				height: 87%;

				.tab-item {
					display: flex;
					padding-left: 45rpx;
					align-items: center;
					height: 92rpx;
					font-size: 28rpx;
					font-family: SourceHanSansSC-Regular;
					color: #333333;
				}
			}

			.devices {
				width: 61%;
				height: 87%;
				background: #f0f0f0;

				.device-item {
					padding: 25rpx 45rpx 0 45rpx;

					.deviceNo-image {
						display: flex;
						flex: row;
						justify-content: space-between;
						align-items: center;
						font-family: SourceHanSansSC-Regular;
						font-size: 30rpx;
						color: #333333;
					}

					.deviceType {
						font-family: Roboto-Regular;
						font-size: 28rpx;
						color: #999999;
						margin-top: -5rpx;
					}
				}
			}

			.task_ok_image {
				height: 35rpx;
				width: 35rpx;
			}
		}
	}
</style>

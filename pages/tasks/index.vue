<template>
	<view class="tasks-layout">
		<view class="navbar">
      <image
      	style="
      		height: 47rpx;
      		width: 47rpx;
      		position: absolute;
      		left: 20rpx;"
      	mode="aspectFit"
        src="/static/task-monitor.png"
       @tap="checkGuideFlights">
      </image>
			<text>{{`任务(${tasksAllList.length})`}}</text>
			<!-- <image
				style="
					height: 47rpx;
					width: 47rpx;
					position: absolute;
					right: 20rpx;"
				mode="aspectFit"
			  src="/static/operation-history.png">
			</image> -->
		</view>
	<!-- 	<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" :fixed="false"
		 top="10" :down="downOption" height="100%" bottom="0" class="scroll" :resetText="updateText[tabCurrent]">
		 </mescroll-body> -->
  
		<view class="tasks-list-view" v-if="showif">
			<view class="item" v-for="(taskItem,index) in tasksAllList" :key="taskItem.id">
				<view class="tasks-both">
					<view class="tasks-status">
						<view class="tasks">
							<text class="flight-code" v-if="taskItem.flightDTO">
								{{taskItem.flightDTO.iataCarrier||''}}{{taskItem.flightDTO.flight||''}}
							</text>
						</view>
						<view class="task-content">
							<view class="content">
								<text>{{taskItem.description}}</text>
							</view>
						</view>
						<view class="time-content">
							<text class="time">{{calNeedTime(taskItem)}}</text>
							<text class="time-name">{{'分钟'}}</text>
							<image src="../../static/task-tab-warmming.png" class="warning-image warning-image-show" v-if="handleJudgeWarning(taskItem.tasksCountTime,2,false)"></image>
							<text class="waring-time" v-if="handleJudgeWarning(taskItem.tasksCountTime,2,false)">{{formatCountDownTime(taskItem.tasksCountTime)}}</text>
						</view>
						<view class="flight-task-dialog" @tap="groupChatClick(taskItem)">
							<image src="../../static/flight-task-dialog.png" mode="aspectFit"></image>
						</view>
					</view>
					<view class="status">
						<image src="../../static/over.png" class="finishTab" v-if="taskItem.status==='6'"></image>
						<text v-else>{{tasksStatus[taskItem.status]}}</text>
					</view>
				</view>
				<view class="tasks-device">
					<view class="info">
						<view class="flight-message" v-if="taskItem.flightDTO">
							<image src="../../static/ic_flight.png" mode="aspectFit"></image>
							<text>{{taskItem.flightDTO.aircraftType||''}} / {{taskItem.flightDTO.registration||''}}</text>
						</view>
						<view class="flight-stand" v-if="taskItem.flightDTO">
							<image src="../../static/plane-seat.png" mode="aspectFit"></image>
							<text>{{taskItem.flightDTO.stand||''}}</text>
						</view>
						<view class="flight-gate" v-if="taskItem.flightDTO">
							<image style="width: 30rpx;" src="../../static/gate-guard.png" mode="aspectFit"></image>
							<text>
								{{taskItem.flightDTO.gate}}
							</text>
						</view>
						<view v-if="taskItem.isDriver" class="bind-device" @click="handleBindDevice(taskItem)">
							<text>{{'设备绑定'}}</text>
							<image src="../../static/task-tab-more.png" mode="aspectFit"></image>
						</view>
					</view>
					<view class="devices">
						<view class="device-message" v-for="(deviceItm,index) in taskItem.devices" :key="index">
							<image src="../../static/task-tab-car.png" mode="aspectFit"></image>
							<text style="padding-left: 5rpx;font-size: 30rpx;">{{deviceItm.name}}</text>
							<text v-if="taskItem.isDriver" style="color: #00cf70;font-size: 30rpx;padding-left:15rpx;" @tap="cancelBind(taskItem,deviceItm)">{{'解绑'}}</text>
						</view>
					</view>
				</view>
				<view class="tasks-time">
					<view class="type">
						<view class="name">{{'预计开始'}}</view>
						<view class="time">{{formatterDate(taskItem.scheduleBeginTime)}}
							<view class="clock" style="right: -40rpx;" v-if="handleJudgeWarning(taskItem.startCountTime,2,false)">
								<image src="../../static/task-tab-warmming.png" class="warning-image warning-image-show"></image>
								<text class="waring-time">{{formatCountDownTime(taskItem.startCountTime)}}</text>
							</view>
						</view>
					</view>
					<view class="type">
						<view class="name">{{'预计结束'}}</view>
						<view class="time">{{formatterDate(taskItem.scheduleEndTime)}}</view>
					</view>
					<view class="type">
						<view class="name">{{'实际开始'}}</view>
						<view class="time">{{formatterDate(taskItem.actualBeginTime)}}</view>
					</view>
					<view class="type">
						<view class="name">{{'实际结束'}}</view>
						<view class="time">{{formatterDate(taskItem.actualEndTime)}}</view>
					</view>
				</view>
				<view class="btn-class">
					<scroll-view scroll-x="true" class="btn-content">
						<block v-for="(btn,index) in taskItem.btns" :key="index">
							<view v-if="!btn.cancel" :style="{'margin-left': index===0?'25rpx':'0'}" class="btn" :class="btn.disabled?'disabled':'enabled'"
							 @tap="handleTaskBtn(taskItem,btn,index)">
								<text>{{btn.label}}</text>
								<view class="clock" v-if="(!btn.disabled )&& (index===1 || index === 2||index === 3) && handleJudgeWarning(taskItem.btnCountTime,1,false)">
									<image src="../../static/task-tab-warmming.png" class="warning-image warning-image-show"></image>
									<text class="waring-time">{{formatCountDownTime(taskItem.btnCountTime)}}</text>
								</view>
							</view>
							<view v-if="btn.cancel" class="btn clean" :style="{'margin-left': index===0?'25rpx':'0'}" @tap="handleCancelBtn(taskItem)">
								<!-- <text>取消</text> -->
								<text>回退</text>
							</view>
						</block>
					</scroll-view>
				</view>
				
				<view v-if="taskItem.workItems" class="work-items">
					<block v-for="(workItem, index) in taskItem.workItems" :key="index">
						<template v-if="workItemType(workItem.workItemCode)=='carCheck'">
							<view v-if="workItem.flag" class="work-item">
								<image src="../../static/task-guide-car.png" mode="aspectFit"></image>
								<view class="label" v-if="workItem.carType">
									{{workItem.carType}}
								</view>
								<view class="label" v-if="workItem.carNumber">
									{{workItem.carNumber}}
								</view>
								<view class="status" v-if="workItem.carStatus">
									{{workItem.carStatus?workItem.carStatus:''}}
								</view>
								<view class="status" v-if="workItem.status">
									{{workItem.status?workItem.status:''}}
								</view>
								<view
									class="btn"
									v-if="judgeOut(workItem.workItemCode)&&!workItem.status&&judgeCompleteStand(taskItem, workItem.carStatus)
                  &&!workItem.forbidden"
								 @tap="updateWorkItem(taskItem, workItem)">
									确认
								</view>
							</view>
						</template>
						<template v-else-if="workItemType(workItem.workItemCode)=='gateCheck'">
							<view v-if="workItem.flag" class="work-item">
								<image src="../../static/gate-guard.png" mode="aspectFit"></image>
								<view class="label" v-if="taskItem.flightDTO">
									登机口:{{taskItem.flightDTO.gate}}
								</view>
								<view class="status">
									{{workItem.status}}
								</view>
								<view v-if="!workItem.status&&!workItem.forbidden" class="btn" @tap="updateWorkItem(taskItem, workItem)">
									确认
								</view>
							</view>
						</template>
						<template v-else-if="workItemType(workItem.workItemCode)=='photo'">
							<view v-if="workItem.flag" class="work-item">
								<image src="../../static/task-guide-photo.png" mode="aspectFit"></image>
                <template v-if="workItem.forbidden">
                  <view class="upload-image">
                    机号机型校对
                  </view>
                </template>
                <template v-else>
                  <view class="upload-image" @tap="chooseImage(taskItem, workItem)">
                    机号机型校对
                  </view>
                </template>
							</view>
              <view v-if="(taskItem.status=='5'||taskItem.status=='6') && workItem.flag && workItem.picBase64 && workItem.picBase64.length > 0" class="image-bottom">
              	<block v-for="(image, imageIndex) in workItem.images" :key="imageIndex">
              		<view class="removable-image">
              			<image class="image-show" :src="image.url" mode="aspectFit" @tap="showImage(image)"></image>
              			<view class="min-badge-dot" @tap.stop="removeImage(taskItem, image)">
              				<image class="delete-image" src="@/static/delete_image.png"></image>
              			</view>
              		</view>
              	</block>
              </view>
						</template>
            <template v-else-if="workItemType(workItem.workItemCode)=='callCar'">
              <view class="work-item">
                <image src="../../static/call-car.png"></image>
                <view style="white-space: nowrap;">
                  大摆渡
                </view>
                <view class="number-box">
                  <view class="operator-layout" @tap="setBgNum(taskItem, -1)">
                    <view class="operator">
                      -
                    </view>
                  </view>
                  <view class="number-layout">
                    <view class="number">
                      {{taskItem.bgNum}}
                    </view>
                  </view>
                  <view class="operator-layout" @tap="setBgNum(taskItem, 1)">
                    <view class="operator">
                      +
                    </view>
                  </view>
                </view>
                <view style="white-space: nowrap;">
                  小摆渡
                </view>
                <view class="number-box">
                  <view class="operator-layout" @tap="setSmNum(taskItem, -1)">
                    <view class="operator">
                      -
                    </view>
                  </view>
                  <view class="number-layout">
                    <view class="number">
                      {{taskItem.smNum}}
                    </view>
                  </view>
                  <view class="operator-layout" @tap="setSmNum(taskItem, 1)">
                    <view class="operator">
                      +
                    </view>
                  </view>
                </view>
                <!-- <u-number-box v-model="taskItem.smNum" @change="setSmNum(taskItem)"></u-number-box> -->
                <view class="btn" @tap="sendToDispatcher(taskItem)">
                	确认
                </view>
              </view>
            </template>
            <template v-else-if="workItem.workItemCode=='username'">
              <view class="work-item">
                <view class="work-item-username">
                  <image src="../../static/workitem-head.png"></image>
                  <view style="color: #000000;position:relative;">
                    外场-{{workItem.username}}
                  </view>
                </view>
              </view>
            </template>
            <template v-else-if="workItem.workItemCode=='photos'">
              <view v-if="workItem.images" class="work-items image-bottom">
              	<block v-for="image in workItem.images" :key="image.index">
              		<view class="removable-image">
              			<image class="image-show" :src="image.url" mode="aspectFit" @tap="showImage(image)"></image>
              		</view>
              	</block>
              </view>
            </template>
            <template v-else-if="workItemType(workItem.workItemCode)=='line'">
              <view class="workitem-split-row"></view>
            </template>
            <template v-else>
            	<view v-if="workItem.flag" class="work-item">
            		<image src="../../static/common-guide-icon.png" mode="aspectFit"></image>
            		<view class="upload-image" style="color: #000000;">
            			{{workItem.description}}
            		</view>
                <view v-if="!workItem.status&&!workItem.forbidden" class="btn" @tap="updateWorkItem(taskItem, workItem)">
                	确认
                </view>
                <view v-else class="status">
                	{{workItem.status}}
                </view>
            	</view>
            </template>
					</block>
				</view>
				
				<!-- <view v-if="taskItem.images&&(taskItem.status=='5'||taskItem.status=='6')" class="image-bottom">
					<block v-for="image in taskItem.images" :key="image.index">
						<view class="removable-image">
							<image class="image-show" :src="image.url" mode="aspectFit" @tap="showImage(image)"></image>
							<view class="min-badge-dot" @tap.stop="removeImage(taskItem, image)">
								<image class="delete-image" src="@/static/delete_image.png"></image>
							</view>
						</view>
					</block>
				</view> -->
				
			</view>
		</view>
		<u-popup v-model="show" mode="bottom" height="70%" border-radius="35">
			<deviceSelect ref="deviceSelect" @closeSelect="getClose" @flash="getFlash" :task="curTask" :guide-driver="judgeGuideCar(curTask)" v-if="show"></deviceSelect>
		</u-popup>
		<!-- <view class="noMessage" v-if="loadFlag">
			<text>暂无数据</text>
		</view> -->
		<u-tabbar :list="tabbarList" active-color="#2a4c7e" inactive-color="#8a8396"></u-tabbar>
		<flight-group-chat ref="flightGroupChat"></flight-group-chat>
	</view>
</template>
<!-- status "0"//未分配  "1"//已分配  "2"//接受  "3"//准备   "4"//到位  "5"//执行  "6"//完成 -->
<script>
	import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue"
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js"
	import uniDrawer from "@/components/uni-drawer/uni-drawer.vue"
	import {
		getTaskList,
		getDeviceRes,
		putTaskStatus
	} from '@/api/task/index.js'
	import dayjs from '@/common/util/dayjs.min.js'
	import deviceSelect from "@/pages/tasks/devices-select.vue"
	import {
		mapGetters
	} from 'vuex'
	import {
		deepCopy,
    debounce
	} from '@/common/util/util.js'
	import { validatenull } from '@/common/util/validate.js'
	import {
		onError,
		getRole,
		getUsername,
		changeBindDevice
	} from '@/api/guide/index.js'
	import flightGroupChat from '@/pages/flight/flight-group-chat.vue'
	import {mapActions} from 'vuex'
  import guideMixin from './guide-mixin.js'

	export default {
		mixins: [MescrollMixin, guideMixin], // 使用mixin
		components: {
			deviceSelect,
			MescrollBody,
			flightGroupChat
		},
		data () {
			return {
				show: false,
				tasksAllList: [],
				tasksStatus: ['未分配', '已分配', '已接受', '已准备', '已到位', '进行中', '已完成'],
				options: [{
						type: '预计开始',
						time: '09:24'
					},
					{
						type: '预计结束',
						time: '09:24'
					},
					{
						type: '实际开始',
						time: '09:24'
					},
					{
						type: '实际结束',
						time: '09:24'
					}
				],
				btnOptions: [{
						label: '接受',
						disabled: true,
						cancel: false
					},
					{
						label: '准备',
						disabled: true,
						cancel: false
					},
					{
						label: '到位',
						disabled: true,
						cancel: false
					},
					{
						label: '开始',
						disabled: true,
						cancel: false
					},
					{
						label: '结束',
						disabled: true,
						cancel: false
					}
				],
				object: {
					paddingTop: "10rpx",
				},
				tabbarList: this.$store.state.user.tabbar,
				//倒计时标准时间
				btnPreparationTime: 5,
				curTask: [], //当前任务 
				userAirpotCode: 'ZSAM',
				loadFlag: false,
				timer: null,
				showif: false,
				firstTime: true,
				
				roles: '',
				direction: '',
				username: ''
			}
		},
		computed: {
			...mapGetters(['allUserMsg', 'user']),
			listenTasksMsg () {
				return this.allUserMsg.userTaskMsg
			}
		},
		watch: {
			listenTasksMsg: function (old, newd) {
				if (old !== newd) {
					this.getDataList()
					console.log('监听中老值', old)
					console.log('监听中新值', newd)
					this.$store.dispatch('setSystemTabbar')
				}
			}
		},
		onLoad () {
			this.$loading()
			console.log('进入', this.user)
			this.getDataList()
			
			this.username = getUsername()
			this.role = getRole()
		},
		mounted () {

			console.log(this.$el, 'this.$el')
		},
		onShow () {
			// this.getDataList()
			try {
				getTaskList({
					airportCode: this.user.userAirport[0].icaocode
				}).then(res => {
					if (res.status) {
						let data = res.data
						data.forEach(task => {
              task.isDriver = false
              // task.bgNum = 0
              // task.smNum = 0
							this.handelBtnType(task)
						})
						this.tasksAllList = data
            console.log('tasksAllList', this.tasksAllList)
						this.tasksListSort()
						this.setWarningTime()
						uni.stopPullDownRefresh();
						this.$message('任务列表刷新成功')
            this.setSystemTabbar()
					} else {
						uni.hideLoading()
						this.loadFlag = true
						uni.stopPullDownRefresh();
						this.$message('任务列表刷新失败')
					}
				}).catch(err => {
					uni.hideLoading()
					this.loadFlag = true
					uni.stopPullDownRefresh();
					this.$message('任务列表刷新失败')
				})
			} catch(err) {
				console.log('err', err)
			}
		},
		onHide () {
			clearInterval(this.timer)
		},
		onPullDownRefresh () {
			getTaskList({
				airportCode: this.user.userAirport[0].icaocode
			}).then(res => {
				console.log('onPullDownRefresh', res)
				if (res.status) {
					let data = res.data
					data.forEach(task => {
            let oriTask = this.tasksAllList.find(e => e.id === task.id)
            if (oriTask && oriTask.workItems && oriTask.workItems.find(e => this.workItemType(e.workItemCode) === 'car')) {
              task.isDriver = true
            } else {
              task.isDriver = false
            }
            // task.bgNum = 0
            // task.smNum = 0
						this.handelBtnType(task)
					})
					this.tasksAllList = data
					this.tasksListSort()
					this.setWarningTime()
					uni.stopPullDownRefresh()
					this.$message('任务列表刷新成功')
          this.setSystemTabbar()
				} else {
					uni.hideLoading()
					this.loadFlag = true
					uni.stopPullDownRefresh();
					this.$message('任务列表刷新失败')
				}
			}).catch(err => {
				console.log('err-任务列表刷新失败2', err)
				uni.hideLoading()
				this.loadFlag = true
				uni.stopPullDownRefresh();
				this.$message('任务列表刷新失败2')
			})
		},
		methods: {
			...mapActions(['setSystemTabbar']),
      showImage (image) {
        uni.previewImage({
          urls: [image.url]
        })
      },
			// 获取任务列表
			getDataList () {
				try {
					getTaskList({
						airportCode: this.user.userAirport[0].icaocode
					}).then(res => {
						if (res.status) {
							let data = res.data
							data.forEach(task => {
                let oriTask = this.tasksAllList.find(e => e.id === task.id)
                if (oriTask && oriTask.workItems && oriTask.workItems.find(e => this.workItemType(e.workItemCode) === 'car')) {
                  task.isDriver = true
                } else {
                  task.isDriver = false
                }
                // task.bgNum = 0
                // task.smNum = 0
								this.handelBtnType(task)
							})
							this.tasksAllList = data
							this.tasksListSort()
							this.setWarningTime()
              this.setSystemTabbar()
						} else {
							uni.hideLoading()
							this.loadFlag = true
						}
					}).catch(err => {
						uni.hideLoading()
						this.loadFlag = true
					})
				} catch(err) {
					console.log('getTaskList', err)
				}
				
			},
			end (i){
				// 这里写刷新业务
				setTimeout(()=>{
					// 收回下拉刷新,-1可以为任意值
					uni.$emit("reMsg",-1)
				},2000)
			},
			//任务类别排序
			tasksListSort () {
				let firstList = []
				let secondList = []
				let thirdList = []
				this.tasksAllList.forEach(res => {
					let num = parseInt(res.status)
					if (num > 1 && num < 6) {
						firstList.push(res)
					} else if (num === 0 || num === 1) {
						secondList.push(res)
					} else {
						thirdList.push(res)
					}
				})
				this.tasksAllList = [...firstList, ...secondList, ...thirdList]
			},
			// 处理按钮显示状态
			handelBtnType (task) {
				let btnOptions = [{
						label: '接受',
						disabled: true,
						cancel: false
					},
					{
						label: '准备',
						disabled: true,
						cancel: false
					},
					{
						label: '到位',
						disabled: true,
						cancel: false
					},
					{
						label: '开始',
						disabled: true,
						cancel: false
					},
					{
						label: '结束',
						disabled: true,
						cancel: false
					}
				]
				task.btns = deepCopy(btnOptions)
				let index = parseInt(task.status) - 1
				if (index > -1 && index !== 5) {
					task.btns[index].disabled = false
					if (index > 0) {
						task.btns[index - 1].cancel = true
					}
				}
				this.getAllWorkItem(task)
				this.$forceUpdate()
			},
			// 接受任务按钮点击
			handleTaskBtn: debounce(function (task, btn, index) {
				if (!btn.disabled) {
					let num = parseInt(task.status) + 1
					task.status = String(num)
					
					var direction = ''
					if (task.flightDTO) {
						direction = task.flightDTO.direction
					}
					this.direction = direction
					// 接受时间 
					if (num === 2) {
						task.actualAcceptTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
					}
					// 准备时间
					if (num === 3) {
						task.actualPreparationTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
						if (task.workItems) {
							let workItem = task.workItems.find(e => e.workItemCode === 'DSmallCarToGate' || e.workItemCode === 'DBigCarToGate')
							if (workItem) {
                console.log('zhunb')
								this.updateDeviceUsageLog(task, workItem, 'BEGIN')
							}
						}
					}
					// 到位时间
					if (num === 4) {
						task.actualInPlaceTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
						if (task.workItems) {
							let workItem = task.workItems.find(e => e.workItemCode === 'DSmallCarToGate' || e.workItemCode === 'DBigCarToGate')
							if (workItem) {
								this.updateDeviceUsageLog(task, workItem, 'COMPLETE')
							}
						}
					}
					// 开始时间
					if (num === 5) {
						task.actualBeginTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:00')
						console.log('num-5', this.role)
						if (task.workItems) {
							let workItem = task.workItems.find(e => e.workItemCode === 'DSmallCarToStand' || e.workItemCode === 'DBigCarToStand')
							if (workItem) {
								this.updateDeviceUsageLog(task, workItem, 'BEGIN')
							}
						}
					}
					// 结束时间
					if (num === 6) {
						task.actualEndTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:00')
						task.deviceIds = ''
						task.selecteQualificationRes = ''
						// 底部tabbar只显示未结束的任务数量，任务结束时，重新查询任务数量
						this.setSystemTabbar()
						if (task.workItems) {
							let workItem = task.workItems.find(e => e.workItemCode === 'DSmallCarToStand' || e.workItemCode === 'DBigCarToStand')
							if (workItem) {
								this.updateDeviceUsageLog(task, workItem, 'COMPLETE')
							}
						}
						if (task.workItems) {
							delete task.workItems
						}
					}
					this.handelBtnType(task)
					putTaskStatus(task).then(res => {
						if (res.status) {
							this.$message('操作成功')
							this.getDataList()
						}
					})
				}
			}, 1000),
			// 取消任务按钮
			handleCancelBtn: debounce(function (task) {
				let num = parseInt(task.status)
				//任务状态回退
				task.status = String(num - 1)
				// 取消接受删除时间
				if (num === 2) {
					task.actualAcceptTime = null
				}
				// 取消准备删除时间
				if (num === 3) {
					task.actualPreparationTime = null
				}
				// 取消到位删除时间
				if (num === 4) {
					task.actualInPlaceTime = null
				}
				// 删除开始任务时间
				if (num === 5) {
					task.actualBeginTime = null
				}
				this.handelBtnType(task)
				putTaskStatus(task).then(res => {
					if (res.status) {
						this.$message('操作成功')
						this.getDataList()
					}
				})
			}, 1000),
			//格式化倒计时时间
			formatCountDownTime (time) {
				if (time && time >= 0) {
					return dayjs(time).format('mm:ss')
				} else {
					return '00:00'
				}
			},
			//判断是否显示预警
			handleJudgeWarning (time, limit, min0) {
				if (min0 === true) {
					return time && time <= limit * 60 * 1000 && time >= 0
				} else {
					return time && time <= limit * 60 * 1000
				}
				// return true
			},
			//设置预警时间
			setWarningTime () {
				this.initWarning()
				this.timer = setInterval(() => {
					this.initWarning()
				}, 1000)
			},
			//初始化预警时间
			initWarning () {
				let nowTime = new Date().getTime()
				let shockFlag = false
				let shockArr = []
				let tasks = deepCopy(this.tasksAllList)
				tasks.forEach((item, index) => {
					//判断还未结束
					if (item.status !== '6') {
						item.btnCountTime = ''
						item.startCountTime = ''
						item.tasksCountTime = ''
						if (item.status !== '5') {
							//还未开始
							item.startCountTime = new Date(item.scheduleBeginTime).getTime() - nowTime
							//准备预警
							if (item.status === '2') {
								item.btnCountTime = new Date(item.actualAcceptTime).getTime() + this.btnPreparationTime * 60 * 1000 - nowTime
							}
							//到位预警
							if (item.status === '3') {
								item.btnCountTime = new Date(item.actualPreparationTime).getTime() + this.btnPreparationTime * (60 * 1000) -
									nowTime
							}
							//开始预警
							if (item.status === '4') {
								item.btnCountTime = new Date(item.actualInPlaceTime).getTime() + this.btnPreparationTime * (60 * 1000) -
									nowTime
							}
						} else {
							item.tasksCountTime = new Date(item.actualBeginTime).getTime() + this.calNeedTime(item) * (60 * 1000) -
								nowTime
						}
						// 判断是否要震动
						if (!shockFlag && (this.handleJudgeWarning(item.tasksCountTime, 2, true) || this.handleJudgeWarning(item.startCountTime,
								2, true) || this.handleJudgeWarning(item.btnCountTime, 1, true))) {
							shockFlag = true
						}
						if (item.tasksCountTime || this.handleJudgeWarning(item.startCountTime, 2) || item.btnCountTime) {
							// 当前任务时间是否都为0
							if (item.tasksCountTime <= 0 && item.startCountTime <= 0 && item.btnCountTime <= 0) {
								shockArr.push(false)
							} else {
								shockArr.push(true)
							}
						}
					}
				})
				this.tasksAllList = deepCopy(tasks)
				if (shockArr.some(key => key === true) && shockFlag) {
					this.phoneVibration()
				}
				this.$forceUpdate()
				if (this.firstTime) {
					this.firstTime = false
					this.showif = true
					uni.hideLoading()
				}
			},
			// 绑定设备
			handleBindDevice (data) {
				if (data.status !== '6' && data.status !== '0') {
					// if (data.workItems && data.workItems.find(e => this.workItemType(e.workItemCode) === 'car')) {
					// 	// 如果该任务分配给引导单司机，不能更改绑定设备
					// 	return
					// }
					if (data.workItems) {
						let workItem = data.workItems.find(e => this.workItemType(e.workItemCode) === 'car')
						if (workItem) {
							if (!validatenull(data.deviceIds)) {
								this.$message('司机只能绑定一辆车，请先解绑再绑定车辆')
								return
							}
						}
					}
					this.curTask = data
					this.show = true
				}
			},
			// 获取取消事件
			getClose () {
				this.show = false
			},
			// 获取成功事件
			getFlash () {
				this.show = false
				this.getDataList()
			},
			// 解除设备绑定
			cancelBind (task, device) {
				// if (task.workItems && task.workItems.find(e => this.workItemType(e.workItemCode) === 'car')) {
				// 	// 如果该任务分配给引导单司机，不能更改绑定设备
				// 	return
				// }
				let deviceIdArr = task.deviceIds.split(',')
				let deviceIdResArr = task.selecteQualificationRes.split(',')
				let index = deviceIdArr.findIndex(item => item === device.id)
				deviceIdArr.splice(index, 1)
				deviceIdResArr.splice(index, 1)
				task.deviceIds = deviceIdArr.join(',')
				task.selecteQualificationRes = deviceIdResArr.join(',')
				putTaskStatus(task).then(res => {
					if (res.status) {
						this.$message('解绑成功')
						if (task.workItems) {
              // todo 除了要有车辆工作项目还需要车牌号一致
							let workItem = task.workItems.find(e => e.meta && this.workItemType(e.workItemCode) === 'car' && e.meta.indexOf(device.deviceCode) !== -1)
							if (workItem) {
								// 如果这个是司机任务，解绑的时候要将工作项目中的该车辆解绑
								changeBindDevice({
									flightTaskId: task.id,
									flightId: task.flightId,
									oldDeviceId: device.id,
									isBind: '0'
								}).then(res => {
									console.log('changeBindDevice-res', res)
								}).catch(err => {
									onError(err)
								})
							}
						}
						this.getDataList()
					} else {
						this.$message('解绑失败')
					}
				})
			},
			calNeedTime (task) {
				let needTime = 0
				let begin = new Date(task.scheduleBeginTime).getTime()
				let end = new Date(task.scheduleEndTime).getTime()
				needTime = (end - begin) / 60 / 1000
				return needTime
			},
			// 手机震动
			phoneVibration () {
				uni.vibrateLong({
					success: () => {}
				})
			},
			formatterDate (date) {
				if (date) {
					return date.split(' ')[1].slice(0, 5)
				} else {
					return '--:--'
				}
			},
			
      
			time2Date (time) {
				if (!time) {
					return ''
				}
				return dayjs(time).format('YYYY-MM-DD')
			},
			judgeBeginStatus (status) {
				if (status && status.indexOf('初始化') < 0) {
					return false
				} else {
					return true
				}
			},
			judgeCompleteStatus (status) {
				if (status && status.indexOf('到达') < 0) {
					return true
				} else {
					return false
				}
			},
			groupChatClick (task) {
				if (task.flightDTO) {
					let item = task.flightDTO
					let userId = uni.getStorageSync('user_id')
					let channelName = item.iataCarrier + item.flight + '(' + dayjs(new Date()).format('DMMM') + ')'
					this.$refs.flightGroupChat.open(channelName, userId, item)
				}
			},
			judgeGuideCar (task) {
				if (!task.workItems) {
					return false
				}
				let workItem = task.workItems.find(e => this.workItemType(e.workItemCode) === 'car')
				if (workItem) {
					return true
				}
				return false
			},
			// 判断当前角色是否不是司机
			judgeNotDriver (taskItem) {
				if (!taskItem.workItems) {
					return true
				} else if (!taskItem.workItems.find(e => this.workItemType(e.workItemCode) === 'car')) {
					return true
				}
				return false
			}
		}
	}
</script>
<style lang="scss">
	.tasks-layout {
		width: 100%;
		height: calc(100vh - var(--status-bar-height) - var(--status-bar-height) - 45rpx);

		.navbar {
			height: calc(var(--status-bar-height) + 92rpx);
			padding-top: calc(var(--status-bar-height) + 25rpx);
			width: 100%;
			position: fixed;
			top: 0;
			text-align: center;
			z-index: 10;
			background: #1891ff;

			text {
				font-size: 38rpx;
				line-height: 50rpx;
				color: #ffffff;
			}
		}

		.tasks-list-view {
			margin-top: calc(var(--status-bar-height) + 92rpx);
			width: 100%;
			overflow: auto;
			// height: calc(100vh - var(--status-bar-height) - 92rpx);

			.item {
				margin: 17rpx 18rpx 17rpx 18rpx;
				background: #FFFFFF;

				.tasks-both {
					display: flex;
					flex-direction: row;
					height: 100rpx;
					// border-bottom: 2rpx solid #e5e5e5;
					border-bottom: 2rpx solid #eeeeee;

					.tasks-status {
						display: flex;
						justify-content: flex-start;
						background: #FFFFFF;
						width: 80%;

						.tasks {
							min-width: 25%;
							height: 100%;
							margin-left: 3%;
							line-height: 100rpx;

							.flight-code {
								// font-size: 35rpx;
								font-size: 40rpx;
								color: #333333;
								font-weight: bold;
							}
						}

						.task-content {
							min-width: 10%;
							font-size: 28rpx;
							color: #0090ff;
							display: flex;
							flex-direction: row;
							align-items: center;
							margin-left: 3%;

							.content {
								width: 100%;
							}
						}

						.time-content {
							min-width: 20%;
							line-height: 100rpx;
							margin-left: 1%;
							position: relative;
							white-space: nowrap;

							// text-align: center;
							.time {
								font-weight: bold;
								font-size: 35rpx;
								color: #0090ff;
							}

							.time-name {
								font-size: 28rpx;
								color: #0090ff;
							}

							.warning-image {
								height: 23rpx;
								width: 23rpx;
								position: relative;
								bottom: 20rpx;
								right: 10rpx;
							}

							.waring-time {
								color: #ff8500;
								font-size: 22rpx;
								position: relative;
								right: 10rpx;
								bottom: 20rpx;
							}
						}
						
						.flight-task-dialog {
							margin-left: 20rpx;
							position: relative;
							top: 75%;
							transform: translateY(-50%);
							image {
								position: relative;
								top: 9rpx;
								width: 40rpx;
								height: 40rpx;
							}
						}
					}

					.status {
						width: 20%;
						height: 100%;
						text-align: right;
						// font-size: 38rpx;
						// color: #0090ff;
						margin-right: 4%;
						// font-weight: 600;
						line-height: 100rpx;

						image {
							width: 250rpx;
							height: 150rpx;
							position: relative;
							bottom: 25rpx;
							left: 30rpx;
						}

						text {
							font-size: 35rpx;
							color: #0090ff;
							// font-weight: bold;
						}
					}
				}

				.tasks-device {
					background: #FFFFFF;
					// border-bottom: 2rpx solid #e5e5e5;
					border-bottom: 2rpx solid #eeeeee;
					width: 100%;

					.info {
						display: flex;
						justify-content: center;
						height: 100rpx;
						line-height: 100rpx;

						.flight-message {
							width: 40%;
							text-align: left;
							margin-left: 15rpx;

							text {
								padding-left: 5rpx;
								font-size: 32rpx;
							}

							image {
								width: 40rpx;
								height: 40rpx;
								position: relative;
								top: 8rpx;
							}
						}

						.flight-stand {
							width: 30%;
							text-align: left;

							text {
								padding-left: 5rpx;
								font-size: 32rpx;
							}

							image {
								width: 33rpx;
								height: 22rpx;
							}
						}
						
						.flight-gate {
							display: flex;
							align-items: baseline;
							image {
								width: 40rpx;
								height: 40rpx;
								position: relative;
								top: 8rpx;
							}
							text {
								padding-left: 5rpx;
								font-size: 32rpx;
							}
						}

						.bind-device {
							width: 30%;
							text-align: right;
							color: #06b6ff;
							padding-right: 10rpx;

							text {
								font-size: 32rpx;
							}

							image {
								width: 33rpx;
								height: 23rpx;
							}
						}
					}

					.devices {
						display: flex;
						flex-direction: row;
						flex-wrap: wrap;
						min-height: 5rpx;
						line-height: 85rpx;

						// padding-bottom: 15rpx;
						.device-message {
							padding-left: 20rpx;
							min-width: 49%;

							image {
								width: 33rpx;
								height: 23rpx;
							}
						}
						
						.flight-task-dialog {
							margin-left: 20rpx;
							image {
								position: relative;
								top: 9rpx;
								width: 40rpx;
								height: 40rpx;
							}
						}
					}
				}

				.tasks-time {
					display: flex;
					justify-content: space-around;
					height: 130rpx;
					.type {
						width: 25%;
						// background: red;
						height: 100%;
						position: relative;

						.name {
							text-align: center;
							color: #999999;
							font-size: 25rpx;
							margin-top: 15rpx;
						}

						.time {
							text-align: center;
							color: #333333;
							font-size: 42rpx;
							margin-top: 10rpx;
							position: relative;
						}
					}
				}

				.btn-class {
					padding: 0 0 25rpx 0;
					height: 100rpx;
					border-bottom: 2rpx solid #eeeeee;
					.btn-content {
						white-space: nowrap;
						width: 100%;
					}

					.btn {
						width: 120rpx;
						height: 62rpx;
						border-radius: 31rpx;
						display: inline-block;
						text-align: center;
						line-height: 62rpx;
						margin-right: 80rpx;
						position: relative;
					}

					.enabled {
						color: #ffffff;
						background-image: linear-gradient(0deg, #78aff5 0%, #bc9a7b 0%, #ff8400 0%, #ff9a2e 59%, #ffaf5c 100%), linear-gradient(#ff8400, #ff8400);
						background-blend-mode: normal, normal;
					}

					.disabled {
						color: #ffffff;
						background: #d9d9d9;
					}

					.clean {
						color: #ff8400;
						border: solid 2rpx #ff8400;
					}
				}
				
				.check-row {
					display: flex;
					justify-content: space-between;
					align-items: baseline;
					padding: 30rpx 30rpx 47rpx 30rpx;
					border-top: 1rpx solid #ededed;
					.label {
						font-size: 25rpx;
						color: #a6a6a6;
					}
					.block {
						display: flex;
						align-items: baseline;
						image {
							width: 33rpx;
							height: 27rpx;
							margin-right: 11rpx;
						}
					}
				}
				
				.work-items {
					padding-top: 25rpx;
					.work-item {
						display: flex;
						align-items: center;
						padding-left: 31rpx;
						padding-bottom: 25rpx;
            .work-item-username {
              display: flex;
              align-items: center;
              image {
                width: 33rpx;
                height: 33rpx;
                margin-right: 15rpx;
              }
            }
            .number-box {
              margin: 0 20rpx;
              display: flex;
              justify-content: space-between;
              align-items: center;
              
              .operator-layout {
                position: relative;
                background-color: #f2f3f5;
                width: 30rpx;
                height: 30rpx;
                .operator {
                  position: absolute;
                  left: 50%;
                  top: 50%;
                  transform: translate(-50%, -50%);
                }
              }
              .number-layout {
                position: relative;
                width: 30rpx;
                height: 30rpx;
                .number {
                  position: absolute;
                  left: 50%;
                  top: 50%;
                  transform: translate(-50%, -50%);
                }
              }
            }
            
						image {
							width: 33rpx;
							height: 33rpx;
							margin-right: 15rpx;
						}
						.label {
							display: inline-block;
							white-space: nowrap;
							text-align: center;
							margin-right: 15rpx;
							// min-width: 120rpx;
							font-size: 28rpx;
							color: #333333;
						}
						.status {
							font-size: 28rpx;
							color: #00cf70;
							margin-left: 18rpx;
						}
						.btn {
							min-width: 70rpx;
							font-size: 28rpx;
							color: #ff8400;
							margin-left: 7rpx;
						}
						.upload-image {
							font-size: 28rpx;
							color: #ff8400;
						}
					}
          
          .workitem-split-row {
            width: 100%;
            height: 0rpx;
            border: 1rpx solid #eeeeee;
            margin-bottom: 10rpx;
          }
				}
				
				.image-bottom {
					display: flex;
					padding: 0 31rpx 25rpx 31rpx;
					image {
						width: 85rpx;
						height: 85rpx;
					}
					.removable-image {
						width: 85rpx;
						margin-right: 10rpx;
						position: relative;
						.min-badge-dot {
							position: absolute;
							top: 0rpx;
							right: 3rpx;
							z-index: 300;
							image {
								height:25rpx;
								width:25rpx;
							}
						}
					}
				}

				.clock {
					position: absolute;
					top: 5rpx;
					right: -80rpx;
					height: 60rpx;

					.warning-image {
						height: 23rpx;
						width: 23rpx;
						position: relative;
						bottom: 20rpx;
					}

					.waring-time {
						color: #ff8500;
						font-size: 22rpx;
						position: relative;
						right: 10rpx;
					}
				}


				.warning-image-show {
					-webkit-animation: rock 1s 0s ease-in-out infinite;
					-moz-animation: rock 1s 0s ease-in-out infinite;
					-ms-animation: rock 1s 0s ease-in-out infinite;
					-o-animation: rock 1s 0s ease-in-out infinite;
					animation: rock 1s 0s ease-in-out infinite;

					@-webkit-keyframes rock {
						0% {
							-webkit-transform: rotate(0);
							transform: rotate(0)
						}

						10% {
							-webkit-transform: rotate(-15deg);
							transform: rotate(-15deg)
						}

						20% {
							-webkit-transform: rotate(0);
							transform: rotate(0)
						}

						30% {
							-webkit-transform: rotate(-45deg);
							transform: rotate(-45deg)
						}

						35% {
							-webkit-transform: rotate(-15deg);
							transform: rotate(-15deg)
						}

						40% {
							-webkit-transform: rotate(-45deg);
							transform: rotate(-45deg)
						}

						45% {
							-webkit-transform: rotate(-15deg);
							transform: rotate(-15deg)
						}

						50% {
							-webkit-transform: rotate(0);
							transform: rotate(0)
						}

						100% {
							-webkit-transform: rotate(0);
							transform: rotate(0)
						}
					}

					@keyframes rock {
						0% {
							-webkit-transform: rotate(0);
							transform: rotate(0)
						}

						10% {
							-webkit-transform: rotate(-15deg);
							transform: rotate(-15deg)
						}

						20% {
							-webkit-transform: rotate(0);
							transform: rotate(0)
						}

						30% {
							-webkit-transform: rotate(-45deg);
							transform: rotate(-45deg)
						}

						35% {
							-webkit-transform: rotate(-15deg);
							transform: rotate(-15deg)
						}

						40% {
							-webkit-transform: rotate(-45deg);
							transform: rotate(-45deg)
						}

						45% {
							-webkit-transform: rotate(-15deg);
							transform: rotate(-15deg)
						}

						50% {
							-webkit-transform: rotate(0);
							transform: rotate(0)
						}

						100% {
							-webkit-transform: rotate(0);
							transform: rotate(0)
						}
					}
				}
			}
		}

		.noMessage {
			margin-top: calc((100vh - 150rpx)/2);
			text-align: center;

			text {
				color: #666666;
			}
		}
	}
</style>

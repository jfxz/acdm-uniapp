<template>
	<view class="flight-layout">
		<view class="navbar">
			<view class="nav-handle-left">
				<view class="handle-type">
					<image src="../../static/home2x.png" @tap="openAcdmHome"></image>
				</view>
				<view class="handle-type">
					<!-- <image src="../../static/home_notify-calendar.png" @click="openDrawer"></image> -->
				</view>
				<view class="handle-type"></view>
			</view>
			<view class="nav-title">
				<text v-if="filterFlightList">{{ `${tabList[tabCurrent].name}(${tabList[tabCurrent].num})` }}</text>
				<text v-else>{{ `航班(0)` }}</text>
			</view>
			<view class="nav-handle-right">
				<view class="handle-type"></view>
				<view class="handle-type" v-if="filterStatus">
					<image src="../../static/ic_filter_red.png" @click="openDrawer" style="width: 45rpx;height:48rpx;bottom: 5rpx;position: relative;"></image>
				</view>
				<view class="handle-type" v-if="!filterStatus">
					<image src="../../static/ic_filter.png" @click="openDrawer"></image>
				</view>
				<view class="handle-type">
					<image src="../../static/ic_search.png" @click="searchFlight"></image>
				</view>
			</view>
		</view>
		<view class="sub-section">
			<u-tabs :list="tabList" :current="tabCurrent" @change="tabChange" :isNewLineData="true" height="90" duration="0.1"></u-tabs>
		</view>
		<view class="flight-list">
			<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption" :fixed="false"
			 top="10" :down="downOption" height="100%" bottom="0" class="scroll" :resetText="updateText[tabCurrent]">
				<uni-swipe-action v-if="showPlayList">
					<uni-swipe-action-item :right-options="judgeRightOption(item)" @click="groupChatClick(item, $event)" v-for="(item, index) in showFlightList"
					 :key="index" class="swipe-class">
						<view @click="flightClick(item)" class="item">
							<view class="flight-status">
								<view class="flight">
									<view class="cu-avatar sm round" style="position: relative;bottom:5rpx" :style="{ background: vipTagStyle(item.vipTag) }"
									 v-if="item.vipTag">
										{{ vipTagText(item.vipTag) }}
									</view>
									{{ item.iataCarrier || '' }}{{ item.flight || '' }}
								</view>
								<view class="place">{{ item.flightRouteCn || item.originCn + '-' + item.destinationCn }}</view>
								<view :class="['status', item.flightStatus]">{{ formatStatus(item.flightStatus) }}</view>
							</view>
							<view class="flight-msg">
								<view class="left">
									<image src="../../static/ic_flight.png" mode="aspectFit"></image>
									<text>{{ item.registration }}/{{ item.aircraftType }}</text>
								</view>
								<view class="mid">
									<image src="../../static/plane-seat.png" mode="aspectFit"></image>
									<text v-if="isArr(item)">{{ item.stand || '--' }}/{{ item.gate || '--' }}</text>
									<text v-else>{{ item.stand || '--' }}/{{ item.gate || '--' }}</text>
								</view>
								<view class="right">
									<image src="../../static/ic_clock.png" mode="aspectFit"></image>
									<text v-if="isArr(item)">{{ '预计' }}:{{ formatDate(item.estimateArrTime) }}</text>
									<text v-else>{{ formatDate(item.localAcobt) }}/{{ formatDate(item.localCtot) }}</text>
								</view>
							</view>
							<view class="flight-time">
								<view class="time-type">
									<text class="value-time" v-if="isArr(item)">{{ formatDate(item.scheduleArrTime) }}</text>
									<text class="value-time" v-else>{{ formatDate(item.scheduleDepTime) }}</text>
									<text class="label-time">计划</text>
								</view>
								<view class="time-type" v-if="isArr(item)">
									<text class="value-time">{{ formatDate(item.actualArrTime) }}</text>
									<text class="label-time">实际</text>
								</view>
								<view class="time-type" v-if="isArr(item)"></view>
								<view class="time-type" v-if="!isArr(item) && item.actualDepTime">
									<text class="value-time">{{ formatDate(item.actualDepTime) }}</text>
									<text class="label-time">实际</text>
								</view>
								<view class="time-type" v-if="!isArr(item) && !item.actualDepTime">
									<text class="value-time">{{ formatDate(item.estimateDepTime) }}</text>
									<text class="label-time">预计</text>
								</view>
								<view class="time-type" v-if="!isArr(item)">
									<text class="value-time">{{ formatDate(item.clearanceTarget) }}</text>
									<text class="label-time">放行</text>
								</view>
								<view class="time-type" v-if="!isArr(item)" style="text-align: right;padding-right: 5rpx;">
									<text class="value-time">登机:</text>
									<text class="value-time">{{ formatBoardTime(item) }}</text>
								</view>
							</view>
						</view>
					</uni-swipe-action-item>
				</uni-swipe-action>
			</mescroll-body>
		</view>

		<!-- <work-note ref="workNote"></work-note> -->
		<flight-group-chat ref="flightGroupChat"></flight-group-chat>

		<uni-drawer ref="uniDrawer" mode="right" :width="drawerWidth" titleName="筛选" @change="getOpenStatus">
			<view class="drawerClass">
				<view class="airport-select">
					<view class="airport">
						<text>{{ '航空公司' }}</text>
					</view>
					<view class="search">
						<input class="uni-input" confirm-type="search" placeholder-class="placeholderClass" v-model="filters.flightCode"
						 placeholder="请输入航空公司" />
						<view class="deleteIcon">
							<image src="../../static/delete.png" @tap="deleteMsg" v-show="filters.flightCode"></image>
						</view>
					</view>
				</view>
				<view class="selectButton">
					<!-- 若为福州用户隐藏航站楼选项 -->
					<view class="airport" v-if="airportCode[0].icaocode !== 'ZSFZ'">
						<text>{{ '航站楼' }}</text>
					</view>
					<view class="btnClass" v-if="airportCode[0].icaocode !== 'ZSFZ'">
						<view :class="filters.terminal === item.value ? 'btnSelect' : 'btn'" @tap="clickFilterBtn('terminal', item.value)"
						 v-for="(item, index) in terminalList" :key="index">
							{{ item.label }}
							<image v-show="filters.terminal === item.value" class="select-image" src="../../static/filterSelect.png"></image>
						</view>
					</view>
					<view class="airport">
						<text>{{ '机位' }}</text>
					</view>
					<view class="btnClass">
						<view :class="filters.stand === item.value ? 'btnSelect' : 'btn'" @tap="clickFilterBtn('stand', item.value)"
						 v-for="(item, index) in standList" :key="index">
							{{ item.label }}
							<image v-show="filters.stand === item.value" class="select-image" src="../../static/filterSelect.png"></image>
						</view>
					</view>
					<view class="airport">
						<text>{{ '代理' }}</text>
					</view>
					<view class="btnClass">
						<view :class="filters.agent === item.value ? 'btnSelect' : 'btn'" @tap="clickFilterBtn('agent', item.value)"
						 v-for="(item, index) in agentList" :key="index">
							{{ item.label }}
							<image v-show="filters.agent === item.value" class="select-image" src="../../static/filterSelect.png"></image>
						</view>
					</view>
					<view class="airport">
						<text>{{ '进港状态' }}</text>
					</view>
					<view class="btnClass">
						<view :class="filters.arrStatus === item.value ? 'btnSelect' : 'btn'" @tap="clickFilterBtn('arrStatus', item.value)"
						 v-for="(item, index) in arrStatusList" :key="index">
							{{ item.label }}
							<image v-show="filters.arrStatus === item.value" class="select-image" src="../../static/filterSelect.png"></image>
						</view>
					</view>
					<view class="airport">
						<text>{{ '出港状态' }}</text>
					</view>
					<view class="btnClass">
						<view :class="filters.depStatus === item.value ? 'btnSelect' : 'btn'" @click="clickFilterBtn('depStatus', item.value)"
						 v-for="(item, index) in depStatusList" :key="index">
							{{ item.label }}
							<image v-show="filters.depStatus === item.value" class="select-image" src="../../static/filterSelect.png"></image>
						</view>
					</view>
				</view>
				<view class="bottom">
					<view class="reset">
						<u-button type="primary" @tap="reset" width="135">重置</u-button>
					</view>
					<view class="select">
						<u-button type="primary" @tap="selectFligtData('sel')" width="135">确定</u-button>
					</view>
				</view>
			</view>
		</uni-drawer>
		<u-tabbar :list="tabbarList" active-color="#2a4c7e" inactive-color="#8a8396"></u-tabbar>
	</view>
</template>

<script>
	import {
		getUserAllList
	} from '@/api/imApi/admin.js'
	import eventVue from '../../common/util/eventVue.js'
	import * as flightApi from '@/api/flight/index.js'
	import {
		mapGetters
	} from 'vuex'
	import dayjs from '../../common/util/dayjs.min.js'
	import {
		deepCopy
	} from '../../common/util/util.js'
	import workNote from './work-note.vue'
	import uniDrawer from '@/components/uni-drawer/uni-drawer.vue'
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
	import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js'
	import MescrollBody from '@/components/mescroll-uni/mescroll-body.vue'
	import {
		getActiveList,
		creatGroup
	} from '@/api/imApi/admin.js'
	import {
		USER_TYPE
	} from '@/common/dic'
	import flightGroupChat from './flight-group-chat.vue'
	import {
		debounce
	} from '../../common/util/util.js'
	import stomp from '@/common/util/stomp-client.js'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		components: {
			uniDrawer,
			uniSwipeAction,
			uniSwipeActionItem,
			MescrollBody,
			workNote,
			flightGroupChat
		},
		data() {
			return {
				tabList: [{
						name: '进港',
						num: 0
					},
					{
						name: '出港',
						num: 0
					},
					{
						name: '即将进港',
						num: 0
					},
					{
						name: '即将出港',
						num: 0
					},
					{
						name: '正在保障',
						num: 0
					}
				],
				swipe: [{
					name: '点击创建群聊'
				}],
				tuiTabsHeight: 90,
				itemWidthtab: '25%',
				// 当前选中状态
				filters: {
					flightCode: '',
					terminal: 'all',
					stand: 'all',
					agent: 'all',
					arrStatus: 'all',
					depStatus: 'all'
				},
				//当前确认筛选状态
				flitersNow: {
					flightCode: '',
					terminal: 'all',
					stand: 'all',
					agent: 'all',
					arrStatus: 'all',
					depStatus: 'all'
				},
				//默认值
				flitersDefault: {
					flightCode: '',
					terminal: 'all',
					stand: 'all',
					agent: 'all',
					arrStatus: 'all',
					depStatus: 'all'
				},
				terminalList: [{
						value: 'T3',
						label: 'T3'
					},
					{
						value: 'T4',
						label: 'T4'
					},
					{
						value: 'all',
						label: '所有'
					}
				],
				standList: [{
						value: '0',
						label: '远机位'
					},
					{
						value: '1',
						label: '桥位'
					},
					{
						value: 'all',
						label: '所有'
					}
				], //1桥位 0远机位
				agentList: [{
						value: 'A',
						label: '机场'
					},
					{
						value: 'B',
						label: '厦航'
					},
					{
						value: 'all',
						label: '所有'
					}
				],
				arrStatusList: [{
						value: 'ARR',
						label: '到达'
					},
					{
						value: 'ENR',
						label: '途中'
					},
					{
						value: 'all',
						label: '所有'
					}
				],
				depStatusList: [{
						value: 'BDO',
						label: '登机'
					},
					{
						value: 'DEP',
						label: '起飞'
					},
					{
						value: 'BDC',
						label: '登机结束'
					},
					{
						value: 'BDP',
						label: '允许登机'
					},
					{
						value: 'all',
						label: '全部'
					}
				],
				followList: [],
				airportCode: '', //所属航司
				tabCurrent: 0,
				pageCount: 1, //
				flightList: [], //所有航班类型数据
				flightArrBySelect: [], //筛选后的所有航班类型数据
				filterFlightList: [], //筛选后数据
				showFlightList: [], //页面展示数据
				filterStatus: false,
				airportName: '',
				baseVipCodeList: this.$store.getters.remoteDic.BASE_VIP_CODE,
				baseFlightStatusList: this.$store.getters.remoteDic.BASE_FLIGHT_STATUS,
				tabbarList: this.$store.state.user.tabbar,
				loadFlag: false,
				showPlayList: true,
				showNote: false,
				showUDrawer: false,
				status: 'loadmore',
				duration: 500,
				drawerWidth: 250,
				canReset: true,
				isTabChange: false,
				isSearchChange: false,
				// 下拉刷新的配置(可选)
				updateText: [], //上次更新文本
				downOption: {
					auto: false,
					offset: 50,
					textInOffset: '下拉刷新',
					textLoading: '刷新中',
					textOutOffset: '释放更新',
					use: true
				},
				upOption: {
					auto: false,
					textNoMore: '没有更多了',
					noMoreSize: 7,
					offset: 10,
					textLoading: '正在加载中...',
					page: {
						num: 0,
						size: 30,
						time: null
					},
					toTop: {
						left: 20,
						bottom: 350,
						duration: 0
					},
					empty: {
						use: true,
						icon: null,
						tip: '暂无相关数据',
						btnText: '',
						fixed: true,
						top: '100rpx',
						zIndex: 99
					}
				},
				resertTimeType: ['resetTimeArr', 'resetTimeDep', 'resetTimeWArr', 'resetTimeWDep', 'resetTimeGms'],

				// 是否显示创建群聊的窗口
				newGroupShow: false,
				timer: null,
				timerNotMq: null,
				timerUpdate: null,
				// 创建群聊表单
				groupChatForm: {
					channelName: '',
					channelHeader: '',
					channelDescription: '',
					userId: '',
					// 选择的好友的id列表
					userIdList: [],
					// 选择的好友的名字列表
					userNameList: [],
					userList: []
				},
				current: 0
			}
		},
		onReachBottom() {},
		computed: {
			...mapGetters(['user', 'userInfo', 'flight', 'allUserMsg', 'remoteDic']),
			watchMqMessage() {
				return this.flight.mqMessage.uuid
			},
			watchStompSubscribe() {
				return uni.getStorageSync('fligtInterfaceMq')
			}
		},
		watch: {
			watchMqMessage: function(old, newd) {
				if (old !== newd) {
					this.flightMessageChange()
					console.log('监听中新值', newd)
				}
			},
			watchStompSubscribe: function(old, newd) {
				if (old !== newd) {
					console.log('订阅变化old', old)
					console.log('订阅变化newd', newd)
				}
			}
		},
		onLoad(e) {
			this.airportCode = uni.getStorageSync('userAirport')
			eventVue.$on('reflash', val => {
				if (val === 'flight') {
					this.getALLFlightList('flash')
				}
			})
			//初始清空进/出港接口刷新标志
			this.$store.commit('SET_ISFLIGHTREFRESH', false)
			this.handelUpdateTime('all')
			this.drawerWidth = uni.getSystemInfoSync().windowWidth * 0.8
			this.getALLFlightList()
			setTimeout(res => {
				this.$store.dispatch('setGmsTimeoutTimer')
				this.getFollowList()
			}, 200)
		},
		onShow() {
			console.log('进入flight')
			// #ifdef APP-PLUS
			//判断是否已经订阅航班动态
			if (!uni.getStorageSync('fligtInterfaceMq')) {
				setTimeout(() => {
					stomp.subscribeFanout()
				}, 2000)
			}
			//网络连接错误，请求一次数据
			uni.onSocketError((error) => {
				stomp.closeConnect()
				stomp.connect()
				this.$store.dispatch('setAllFlight').then(res => {
					this.flightList[0] = res[0]
					this.flightList[1] = res[1]
					this.dealResershData()
				}).catch(err => {
					this.flightList[0] = this.flight.arrFlight
					this.flightList[1] = this.flight.depFlight
					this.dealResershData()
				})
			})
			// #endif
			//再次进入判断是否需要mq刷新
			if (this.flight.isFlightRefresh) {
				//清空刷新标志
				this.$store.commit('SET_ISFLIGHTREFRESH', false)
				this.flightMessageChange()
			}
			// #ifdef APP-PLUS
			plus.screen.lockOrientation('portrait-primary')
			// #endif
			clearInterval(this.timer)
			clearInterval(this.timerNotMq)
			clearInterval(this.timerUpdate)
			//有mq推送定时刷新2分钟 进出港接口
			setTimeout(() => {
				this.timer = setInterval(() => {
					this.timerResersh()
					console.log('进港出港定时刷新')
				}, 1000 * 60 * 2)
			}, 100)
			//无mq推送定时刷新30秒 即将进出港 保障
			setTimeout(() => {
				this.timerNotMq = setInterval(() => {
					this.timerResershNoMq()
					console.log('即将进出港/保障定时刷新')
				}, 1000 * 60 * 0.5)
			}, 100)
			this.timerUpdate = setInterval(() => {
				this.handelUpdateTime('all')
			}, 1000 * 10)
		},
		onHide() {
			console.log('隐藏onHide')
			clearInterval(this.timer)
			clearInterval(this.timerNotMq)
			clearInterval(this.timerUpdate)
		},
		beforeDestroy() {
			console.log('隐藏onUnload')
			clearInterval(this.timer)
			clearInterval(this.timerNotMq)
			clearInterval(this.timerUpdate)
		},
		methods: {
			// 统一获取关注航班
			getFollowList() {
				this.$store.dispatch('setFollowList').then(data => {
					console.log('data', data)
					this.followList = data
				})
			},
			// 判断左滑菜单项
			judgeRightOption(item) {
				let options = [{
						text: '航班关注',
						followId: '',
						style: {
							backgroundColor: '#ffc21e'
						}
					},
					{
						text: '进入航班群聊',
						style: {
							backgroundColor: '#26b3ff'
						}
					}
				]
				let matchFollow = this.followList.find(follow => follow.flightId === item.flightId)
				if (matchFollow) {
					options[0].style.backgroundColor = '#eb6262'
					options[0].text = '取消关注'
					options[0].followId = matchFollow.followId
				}
				return options
			},
			// mq监听刷新
			flightMessageChange: debounce(function() {
				//判断是否需要刷新进港航班
				if (this.flight.mqMessage.isArrResersh) {
					//app状态为在线
					if (uni.getStorageSync('appStatus') === 'onShow') {
						console.log('进港排序')
						this.flightChangeType('setArrFlight', 0)
						this.$store.commit('SET_MQMESSAGE', {
							isArr: false,
							isDep: this.flight.mqMessage.isDep,
							isArrResersh: false,
							isDepResersh: this.flight.mqMessage.isDepResersh,
							uuid: this.flight.mqMessage.uuid
						})
					} else {
						//暂存需要刷新状态
						this.$store.commit('SET_ISFLIGHTREFRESH', true)
					}
					//判断是否存在进港数据变更
				} else if (this.flight.mqMessage.isArr) {
					console.log('进港变更')
					this.flightChangeType('getArrflight', 0)
				}
				//判断是否需要刷新出港且app状态为在线
				if (this.flight.mqMessage.isDepResersh) {
					if (uni.getStorageSync('appStatus') === 'onShow') {
						console.log('出港排序')
						this.flightChangeType('setDepFlight', 1)
						this.$store.commit('SET_MQMESSAGE', {
							isArr: this.flight.mqMessage.isArr,
							isDep: false,
							isArrResersh: this.flight.mqMessage.isArrResersh,
							isDepResersh: false,
							uuid: this.flight.mqMessage.uuid
						})
					} else {
						//暂存需要刷新状态
						this.$store.commit('SET_ISFLIGHTREFRESH', true)
					}
					//判断是否存在出港数据变更
				} else if (this.flight.mqMessage.isDep) {
					console.log('出港变更')
					this.flightChangeType('getDepflight', 1)
				}
			}, 1000 * 2),
			//mq数据刷新类型
			flightChangeType(type, index) {
				this.$store.dispatch(type).then(res => {
					this.flightList[index] = res
					this.dealResershData()
				})
			},
			// 获取各种航班信息
			getALLFlightList(flag) {
				console.log('flag', flag)
				if (flag !== 'flash') {
					this.$loading()
				}
				this.$store.dispatch('setAllTypeFlight').then(res => {
					this.flightList[0] = res[0]
					this.flightList[1] = res[1]
					this.flightList[2] = res[2]
					this.flightList[3] = res[3]
					this.flightList[4] = res[4]
					this.filterFlightList = this.flightList[0]
					this.checkDataEmpty(this.filterFlightList)
					this.getSelData()
					uni.hideLoading()
				}).catch(err => {
					console.log('捕获异常flight')
					this.flightList[0] = this.flight.arrFlight
					this.flightList[1] = this.flight.depFlight
					this.flightList[2] = this.flight.willArr
					this.flightList[3] = this.flight.willDep
					this.flightList[4] = this.flight.gmsFlight
					this.filterFlightList = this.flightList[0]
					this.checkDataEmpty(this.filterFlightList)
					this.getSelData()
					uni.hideLoading()
				})
			},
			//获取筛选信息缓存
			getSelData() {
				let selData = uni.getStorageSync('flightListSelData')
				if (selData) {
					this.filters = JSON.parse(selData)
					this.flitersNow = JSON.parse(selData)
					let flag = JSON.stringify(this.conditionFilter())
					if (flag !== '{}' || this.flitersNow.stand !== 'all') {
						console.log(this.conditionFilter(), '有数据')
						this.selectFligtData('sel')
					} else {
						this.tabList.forEach((item, index) => {
							item.num = this.flightList[index].length
						})
					}
				} else {
					this.tabList.forEach((item, index) => {
						item.num = this.flightList[index].length
					})
				}
			},
			//获取各类型航班数量
			getAllFlightNumbers: debounce(function(data) {
				console.log('datadatadata123', data)
				let selData = deepCopy(data)
				if (selData.flightCode === '') {
					selData.flightCode = 'all'
				} else {
					selData.flightCode = selData.flightCode.toUpperCase()
				}
				let selArray = [selData.flightCode, selData.terminal, selData.stand, selData.agent, selData.arrStatus, selData.depStatus]
				let selString = selArray.join('/')
				flightApi.getFlightNumbers({
					airportCode: uni.getStorageSync('userAirport')[0].icaocode || '',
					selData: selString
				}).then(res => {
					if (res.status) {
						this.tabList.forEach((item, index) => {
							//当前tab页不更新数量，防止未刷新接口导致数量不一致
							if (index === 0 && index !== this.tabCurrent) {
								this.tabList[0].num = res.data.arr
							}
							if (index === 1 && index !== this.tabCurrent) {
								this.tabList[1].num = res.data.dep
							}
							if (index === 2 && index !== this.tabCurrent) {
								this.tabList[2].num = res.data.approach
							}
							if (index === 3 && index !== this.tabCurrent) {
								this.tabList[3].num = res.data.depSoon
							}
							if (index === 4 && index !== this.tabCurrent) {
								this.tabList[4].num = res.data.guarantee
							}
						})
						this.$forceUpdate()
					} else {
						this.tabList.forEach((item, index) => {
							item.num = this.flightList[index].length
						})
						this.$forceUpdate()
					}
				})
			}, 500),
			conputeList() {
				this.status = 'loading'
				let diff = this.pageCount * 30
				let divisionList = this.filterFlightList.slice(0, diff)
				this.showFlightList = divisionList
				setTimeout(() => {
					this.showPlayList = true
					uni.hideLoading()
				}, 500)
				if (divisionList < 30) {
					this.status = 'nomore'
				}
			},
			//有mq推送下定时刷新
			timerResersh() {
				if (this.tabCurrent === 0) {
					this.getFlightByTab(0, 'setArrFlight', 'arrFlight')
				}
				if (this.tabCurrent === 1) {
					this.getFlightByTab(1, 'setDepFlight', 'depFlight')
				}
			},
			//无mq推送下定时刷新
			timerResershNoMq() {
				if (this.tabCurrent === 2) {
					this.getFlightByTab(2, 'setWillArr', 'willArr')
				}
				if (this.tabCurrent === 3) {
					this.getFlightByTab(3, 'setWillDep', 'willDep')
				}
				if (this.tabCurrent === 4) {
					this.getFlightByTab(4, 'setGmsFlight', 'gmsFlight')
				}
			},
			//根据当前tab页刷新数据
			getFlightByTab(index, type, source) {
				this.$store.dispatch(type).then(res => {
					this.flightList[index] = res
					this.dealResershData()
				}).catch(e => {
					this.flightList[index] = this.flight[source]
					this.dealResershData()
				})
			},
			dealResershData() {
				// 判断是否有筛选状态，若有进行筛选
				if (uni.getStorageSync('flightSelectStatus') === 'YES' || JSON.stringify(this.conditionFilter()) !== '{}') {
					//判断是否打开抽屉，打开则不渲染，以防自动关闭抽屉
					if (!this.showUDrawer) {
						//不打开进行渲染
						this.filterFlightList = this.flightList[this.tabCurrent]
						this.selectFligtData('resersh')
						this.showFlightList = this.filterFlightList.slice(0, this.pageCount * 30)
						this.$forceUpdate()
					}
				} else {
					//没状态，进行替换
					this.filterFlightList = this.flightList[this.tabCurrent]
					this.showFlightList = this.filterFlightList.slice(0, this.pageCount * 30)
					this.getAllFlightNumbers(this.flitersNow)
					this.$forceUpdate()
				}
			},
			/*下拉刷新的回调*/
			downCallback(page) {
				if (this.tabCurrent === 0) {
					this.$store
						.dispatch('setArrFlight')
						.then(res => {
							this.flightList[0] = res
							this.filterFlightList = this.flightList[0]
							this.downResershDeal('resetTimeArr')
						})
						.catch(e => {
							setTimeout(() => {
								this.mescroll.endSuccess()
								this.$message('刷新失败', 'none', '')
							}, 500)
						})
				}
				if (this.tabCurrent === 1) {
					this.$store
						.dispatch('setDepFlight')
						.then(res => {
							this.flightList[1] = res
							this.filterFlightList = this.flightList[1]
							this.downResershDeal('resetTimeDep')
						})
						.catch(e => {
							setTimeout(() => {
								this.mescroll.endSuccess()
								this.$message('刷新失败', 'none', '')
							}, 500)
						})
				}
				if (this.tabCurrent === 2) {
					this.$store
						.dispatch('setWillArr')
						.then(res => {
							this.flightList[2] = res
							this.filterFlightList = this.flightList[2]
							this.downResershDeal('resetTimeWArr')
							this.$store.dispatch('mapWillArr')
						})
						.catch(e => {
							setTimeout(() => {
								this.mescroll.endSuccess()
								this.$message('刷新失败', 'none', '')
							}, 500)
						})
				}
				if (this.tabCurrent === 3) {
					this.$store
						.dispatch('setWillDep')
						.then(res => {
							this.flightList[3] = res
							this.filterFlightList = this.flightList[3]
							this.downResershDeal('resetTimeWDep')
							this.$store.dispatch('mapWillDep')
						})
						.catch(e => {
							setTimeout(() => {
								this.mescroll.endSuccess()
								this.$message('刷新失败', 'none', '')
							}, 500)
						})
				}
				if (this.tabCurrent === 4) {
					this.$store
						.dispatch('setGmsFlight')
						.then(res => {
							this.flightList[4] = res
							this.filterFlightList = this.flightList[4]
							this.downResershDeal('resetTimeGms')
							this.$store.dispatch('mapWillGms')
						})
						.catch(e => {
							setTimeout(() => {
								this.mescroll.endSuccess()
								this.$message('刷新失败', 'none', '')
							}, 500)
						})
				}
			},
			//下拉刷新相关数据处理
			downResershDeal(type) {
				this.showFlightList = []
				this.selectFligtData('sel')
				this.checkDataEmpty(this.filterFlightList)
				setTimeout(() => {
					this.mescroll.endSuccess()
					this.$message(`${this.tabList[this.tabCurrent].name}航班刷新成功`, 'none', '')
				}, 500)
				setTimeout(() => {
					uni.setStorageSync(type, dayjs(new Date()))
					this.handelUpdateTime()
				}, 800)
			},
			/*上拉加载的回调*/
			upCallback(page) {
				setTimeout(() => {
					let pageNum = page.num // 页码, 默认从1开始
					if (this.isTabChange) pageNum--
					this.pageCount = pageNum + 1
					let pageSize = page.size // 页长, 默认每页10条Math.ceil(7/2)
					let diff = (pageNum + 1) * page.size
					let divisionList = this.filterFlightList.slice(pageNum * 30, diff)
					if (this.showFlightList.length < this.filterFlightList.length) {
						this.showFlightList = [...this.showFlightList, ...divisionList]
					}
					this.mescroll.endBySize(divisionList, this.filterFlightList)
					this.showPlayList = true
				}, 200)
			},
			filtersNowSetOrDelete(type) {
				// 判断为赋值
				if (type === 'set') {
					//判断是否赋新筛选条件
					this.flitersNow = deepCopy(this.filters)
				}
				// 判断为删除
				if (type === 'delete') {
					this.filters = deepCopy(this.flitersDefault)
					this.flitersNow = deepCopy(this.flitersDefault)
					this.filterStatus = false
				}
				this.getAllFlightNumbers(this.flitersNow)
			},
			// 切换tab事件
			tabChange(val) {
				if (val === 2) {
					this.$loading('刷新数据中')
					this.tabCurrent = val
					this.showPlayList = false
					this.$store
						.dispatch('setWillArr')
						.then(res => {
							uni.hideLoading()
							this.flightList[2] = res
							this.filterFlightList = this.flightList[2]
							this.selectFligtData('sel')
							this.$store.dispatch('mapWillArr')
						})
						.catch(e => {
							uni.hideLoading()
							this.tabChangeData(val)
						})
				} else if (val === 3) {
					this.$loading('刷新数据中')
					this.tabCurrent = val
					this.showPlayList = false
					this.$store
						.dispatch('setWillDep')
						.then(res => {
							uni.hideLoading()
							this.flightList[3] = res
							this.filterFlightList = this.flightList[3]
							this.selectFligtData('sel')
							this.$store.dispatch('mapWillDep')
						})
						.catch(e => {
							uni.hideLoading()
							this.tabChangeData(val)
						})
				} else if (val === 4) {
					this.$loading('刷新数据中')
					this.tabCurrent = val
					this.showPlayList = false
					this.$store
						.dispatch('setGmsFlight')
						.then(res => {
							uni.hideLoading()
							this.flightList[4] = res
							this.filterFlightList = this.flightList[4]
							this.selectFligtData('sel')
							this.$store.dispatch('mapWillGms')
						})
						.catch(e => {
							uni.hideLoading()
							this.tabChangeData(val)
						})
				} else {
					this.tabChangeData(val)
				}
			},
			//切换tab数据处理
			tabChangeData(val) {
				console.log('切换tab', val)
				this.$nextTick(() => {
					//没有mq刷新接口，切换请求一次接口
					this.tabCurrent = val
					if (this.flightArrBySelect.length > 0) {
						this.filterFlightList = this.flightArrBySelect[val]
					} else {
						this.filterFlightList = this.flightList[val]
					}
					this.showPlayList = false
					this.selectFligtData('tab')
				})
			},
			// 筛选方式
			selectFligtData(type) {
				let condition = {}
				this.isTabChange = true
				// 打开就关闭抽屉
				if (this.showUDrawer) {
					this.$refs.uniDrawer.close()
				}
				// 切换列表获取当前筛选数据
				condition = this.conditionFilter()
				// 判断是否要再进行筛选
				if (type === 'sel' || type === 'resersh') {
					this.filtersNowSetOrDelete('set')
					// 获取筛选条件
					condition = this.conditionFilter()
					// 对所有类型航班进行筛选
					this.flightArrBySelect = this.selectAllTypeFlight(condition)
					this.filterFlightList = this.flightArrBySelect[this.tabCurrent]
				}

				//更新操作
				if (type === 'sel' || type === 'tab') {
					this.showFlightList = []
					this.pageCount = 1
					setTimeout(() => {
						this.mescroll.resetUpScroll()
						this.mescroll.scrollTo(0, 0)
					}, 300)
				}
				//当前页面tab数量直接显示获取到数目长度，防止调用接口延迟
				this.tabList[this.tabCurrent].num = this.filterFlightList.length
				//记录是否筛选&&筛选按钮高亮显示
				if (JSON.stringify(condition) !== '{}' || this.flitersNow.stand !== 'all') {

					uni.setStorageSync('flightSelectStatus', 'YES')
					this.filterStatus = true
					console.log('filterStatus', condition, this.flitersNow.stand, this.filterStatus)
				} else {
					uni.setStorageSync('flightSelectStatus', 'NO')
					this.flightArrBySelect = []
					this.filterStatus = false
					console.log('filterStatus', this.filterStatus)
				}
				this.$forceUpdate()
				uni.removeStorageSync('flightListSelData')
				uni.setStorageSync('flightListSelData', JSON.stringify(this.flitersNow))
			},
			//所有类型的航班筛选
			selectAllTypeFlight(condition) {
				let flightArr = deepCopy(this.flightList)
				let returnArr = []
				if (this.flitersNow.stand !== 'all') {
					flightArr = this.flightList.map((item, index) => {
						return item.filter((key, index1) => {
							if (key.meta && key.meta.standDetail && key.meta.standDetail.isbridge && key.meta.standDetail.isbridge ===
								this.flitersNow.stand) {
								return key
							}
						})
					})
				}
				//有筛选条件进行筛选
				if (condition) {
					flightArr.forEach((item, index) => {
						let conditionSer = deepCopy(condition)
						//防止进出港状态相互影响，进港航班只筛选进港状态，出港同
						if (index === 0 || index === 2) {
							if (this.flitersNow.arrStatus === 'all') {
								delete conditionSer['flightStatus']
							} else {
								conditionSer['flightStatus'] = this.flitersNow.arrStatus
							}
							returnArr[index] = deepCopy(this.dataFilter(conditionSer, item))
						}
						if (index === 1 || index === 3) {
							if (this.flitersNow.depStatus === 'all') {
								delete conditionSer['flightStatus']
							} else {
								conditionSer['flightStatus'] = this.flitersNow.depStatus
							}
							returnArr[index] = deepCopy(this.dataFilter(conditionSer, item))
						}
						if (index === 4) {
							delete conditionSer['flightStatus']
							//保障航班可能同时拥有进港出港航班 进行特殊筛选
							let data = item.filter(res => {
								if ((this.flitersNow.arrStatus === 'all' && res.direction === 'A') || (this.flitersNow.depStatus === 'all' &&
										res.direction === 'D')) {
									return res
								} else {
									return res.flightStatus === this.flitersNow.depStatus || res.flightStatus === this.flitersNow.arrStatus
								}
							})
							returnArr[index] = deepCopy(this.dataFilter(conditionSer, data))
						}
					})
					return returnArr
				}
			},
			// 筛选过滤器
			dataFilter(condition, data) {
				if (data) {
					return data.filter(item => {
						return Object.keys(condition).every(key => {
							return String(item[key])
								.toUpperCase()
								.includes(
									String(condition[key])
									.toUpperCase()
									.trim()
								)
						})
					})
				} else {
					return ''
				}
			},
			// 筛选条件赋值
			conditionFilter() {
				let condition = {}
				if (this.flitersNow.flightCode !== '') {
					condition['iataCarrier'] = this.flitersNow.flightCode
				}
				if (this.flitersNow.terminal !== 'all' && this.airportCode[0].icaocode !== 'ZSFZ') {
					condition['terminal'] = this.flitersNow.terminal
				}
				if (this.flitersNow.agent !== 'all') {
					condition['generalagent'] = this.flitersNow.agent
				}
				if (this.flitersNow.depStatus !== 'all') {
					condition['flightStatus'] = this.flitersNow.depStatus
				}
				if (this.flitersNow.arrStatus !== 'all') {
					condition['flightStatus'] = this.flitersNow.arrStatus
				}
				return condition
			},
			checkDataEmpty(data) {
				if (data) {
					if (data.length !== 0) {
						this.loadFlag = false
						this.conputeList()
					} else {
						this.loadFlag = true
					}
				} else {
					this.loadFlag = true
				}
			},
			// 点击跳转航班详情JSON.stringify(object)
			flightClick(flight) {
				let msg = {
					flightId: flight.flightId,
					num: this.tabCurrent
				}
				uni.navigateTo({
					url: `/pages/flight/flight-message?flightId=${flight.flightId}`
				})
			},
			// 打开右侧抽屉
			openDrawer() {
				this.$refs['uniDrawer'].open()
			},
			// 打开上下班打卡
			openWorkNote() {
				// this.$refs.workNote.openNoteDialog('second')
			},
			// 跳转到主页
			openAcdmHome() {
				uni.reLaunch({
					url: '../home/index'
				})
			},
			// 跳转到搜索航班
			searchFlight() {
				uni.navigateTo({
					url: `/pages/search/index`
				})
			},
			// 判断是否是进港，返回true false
			isArr(flight) {
				if (flight) {
					return flight.direction === 'A'
				} else {
					return false
				}
			},
			// 右侧抽屉重置
			reset() {
				this.$refs.uniDrawer.close()
				this.filterFlightList = this.flightList[this.tabCurrent]
				//当前页面tab数量直接显示获取到数目长度，防止调用接口延迟
				this.tabList[this.tabCurrent].num = this.filterFlightList.length
				this.pageCount = 1
				this.showFlightList = []
				this.flightArrBySelect = []
				setTimeout(() => {
					this.mescroll.resetUpScroll()
					this.mescroll.scrollTo(0, 0)
				}, 300)
				this.filtersNowSetOrDelete('delete')
				uni.removeStorageSync('flightListSelData')
			},
			// 右侧抽屉 input 清除内容
			deleteMsg() {
				this.filters.flightCode = ''
				// this.search()
			},
			// 获取是否打开抽屉标志
			getOpenStatus(flag) {
				this.showUDrawer = flag
				if (!this.showUDrawer) {
					this.filters = deepCopy(this.flitersNow)
				}
			},
			// 左滑关注或者创建群聊
			groupChatClick(item, e) {
				console.log('item', item)
				console.log('e', e)
				if (e.index) {
					this.groupChatForm.channelName = item.iataCarrier + item.flight + '(' + dayjs(new Date()).format('DMMM') + ')'
					this.$refs.flightGroupChat.open(this.groupChatForm.channelName, this.userInfo.id, item)
				} else {
					if (e.content.followId) {
						this.cancelFollow(e.content.followId)
					} else {
						this.followFlight(item)
					}
				}
			},
			// 关注航班
			followFlight(flight) {
				let isFlightToday = flight.hasOwnProperty('flightByDate') && flight.flightByDate
				if (isFlightToday) {
					this.$message('非当日航班无法关注')
					return
				}
				this.$loading('关注中...')
				// 关注
				flightApi
					.postFollowFlight({
						flightid: flight.id,
						userid: uni.getStorageSync('user_id')
					})
					.then(res => {
						if (res.status) {
							uni.hideLoading()
							this.getFollowList()
							this.$message('已关注')
							// getActiveList(uni.getStorageSync('user_id')).then(res => {
							//   if (res.status && res.data) {
							//     that.$store.dispatch('setActiveList', {
							//       activeFriendList: res.data.activeFriendList,
							//       activePublicChannelList: res.data.activePublicChannelList,
							//       activeSubscriptionInfo: res.data.activeSubscriptionList
							//     })
							//   }
							// })
							uni.setStorageSync('local_key', 'refresh')
						} else {
							uni.hideLoading()
							this.$message('关注失败')
						}
					})
					.catch(err => {
						uni.hideLoading()
						this.$message('关注失败')
					})
			},
			// 取消关注
			cancelFollow(followId) {
				this.$loading('取消中...')
				flightApi
					.deleteFollowFlight(followId)
					.then(res => {
						if (res.status) {
							this.getFollowList()
							setTimeout(() => {
								this.$message('取消关注')
							}, 500)
						} else {
							this.$message('取消失败')
						}
						uni.setStorageSync('local_key', 'refresh')
						uni.hideLoading()
					})
					.catch(err => {
						uni.hideLoading()
						this.$message('取消失败')
					})
			},
			// 筛选框点击
			clickFilterBtn(key, val) {
				this.filters[key] = val
			},
			/*上次更新时间处理*/
			handelUpdateTime(type) {
				let today = dayjs(new Date())
				let lastTime = ''
				let showTime = ''
				if (type === 'all') {
					this.resertTimeType.forEach((item, index) => {
						lastTime = uni.getStorageSync(item)
						showTime = today - lastTime
						this.updateText[index] = this.handleText(showTime, lastTime)
					})
				} else {
					lastTime = uni.getStorageSync(this.resertTimeType[this.tabCurrent])
					showTime = today - lastTime
					this.updateText[this.tabCurrent] = this.handleText(showTime, lastTime)
					this.$forceUpdate()
					console.log('处理后的提示词', this.updateText[this.tabCurrent])
				}
			},
			handleText(showTime, lastTime) {
				let text = ''
				if (lastTime !== '') {
					if (showTime / (1000 * 60 * 60 * 12) >= 1) {
						text = '上次更新于' + parseInt(showTime / (1000 * 60 * 60 * 12)) + '天前'
					} else if (showTime / (1000 * 60 * 60) >= 1) {
						text = '上次更新于' + parseInt(showTime / (1000 * 60 * 60)) + '小时前'
					} else if (showTime / (1000 * 60) >= 1) {
						text = '上次更新于' + parseInt(showTime / (1000 * 60)) + '分钟前'
					} else if (showTime / (1000 * 60) < 1) {
						// this.updateText='上次更新于'+parseInt(showTime/(1000))+'秒前'
						text = '刚刚更新'
					}
				} else {
					text = '尚未更新'
				}
				return text
			},
			// vip图标判断
			vipTagStyle(val) {
				if (val && this.baseVipCodeList) {
					let vip = this.baseVipCodeList.find(item => item.rankcode === val)
					let color = ''
					if (vip) {
						switch (vip.rankcode) {
							case 'C':
								color = '#ffcaca'
								break
							case 'Z':
								color = '#85b3ff'
								break
							case 'A':
								break
							case 'B':
								break
							default:
								break
						}
					}
					return color
				}
				return ''
			},
			// viptag图标内显示的文字
			vipTagText(val) {
				if (val && this.baseVipCodeList) {
					let vip = this.baseVipCodeList.find(item => item.rankcode === val)
					if (vip) {
						return vip.description.substr(0, 1)
					} else {
						return ''
					}
				} else {
					return ''
				}
			},
			formatDate(date) {
				if (date) {
					return dayjs(date).format('HH:mm')
				} else {
					return '--:--'
				}
			},
			formatBoardTime(val) {
				if (val.meta.gateDetail) {
					if (val.meta.gateDetail.actualopen) {
						return dayjs(val.meta.gateDetail.actualopen).format('HH:mm')
					} else if (val.meta.gateDetail.estimateopen) {
						return dayjs(val.meta.gateDetail.estimateopen).format('HH:mm')
					} else if (val.meta.gateDetail.scheduleopen) {
						return dayjs(val.meta.gateDetail.scheduleopen).format('HH:mm')
					} else {
						return '--:--'
					}
				} else {
					return '--:--'
				}
			},
			formatStatus(status) {
				if (status && this.baseFlightStatusList) {
					let match = this.baseFlightStatusList.find(item => item.statusCode === status)
					if (match) {
						return match.description
					} else {
						return '----'
					}
				} else {
					return '----'
				}
			}
		}
	}
</script>
<style lang="scss">
	.flight-layout {
		height: calc(100vh - var(--status-bar-height) - 200rpx);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-size: cover;

		.navbar {
			display: flex;
			justify-content: space-between;
			height: calc(var(--status-bar-height) + 92rpx);
			background: #1891ff;
			padding-top: calc(var(--status-bar-height) + 25rpx);
			width: 100%;
			z-index: 10;
			position: fixed;
			top: 0;
			text-align: center;

			.nav-handle-left {
				display: flex;
				justify-content: space-around;
				width: 30%;
				padding-top: 2rpx;

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
				justify-content: space-around;
				width: 30%;
				padding-top: 5rpx;
				padding-right: 15rpx;

				.handle-type {
					image {
						width: 38rpx;
						height: 38rpx;
					}
				}
			}
		}

		.sub-section {
			width: 100%;
			position: fixed;
			top: 0;
			z-index: 9;
			margin-top: calc(var(--status-bar-height) + 92rpx);
		}

		.flight-list {
			z-index: 5;
			margin-top: calc(var(--status-bar-height) + 178rpx);

			.scroll {
				width: 100%;

				.swipe-class {
					margin: 17rpx 18rpx 17rpx 18rpx;

					.item {
						border-radius: 7rpx;
						background: #ffffff;
						width: 100%;

						.flight-status {
							display: flex;
							justify-content: space-between;
							height: 69rpx;
							line-height: 69rpx;
							border-bottom: 2rpx dashed #e5e5e5;

							.flight {
								padding: 0 25rpx;
								min-width: 32%;
								color: #333333;
								font-size: 42rpx;
								font-weight: bold;
								overflow: hidden;
								white-space: nowrap;
								text-overflow: ellipsis;
							}

							.place {
								color: #595959;
								font-size: 26rpx;
								color: #333333;
								min-width: 30%;
								overflow: hidden;
								white-space: nowrap;
								text-overflow: ellipsis;
							}

							.status {
								color: #c6c6c6;
								$mapStatus: (DLY: #e85656,
									//延误
									RTN: #e85656,
									//返航
									CNL: #576078,
									//取消
									ENR: #1890ff,
									//途中
									ALT: #2f54eb,
									// 备降
									BDP: #faad14,
									//允许登机BDF
									BDF: #0ebf9c,
									//催促登机BDT
									BDT: #0ebf9c,
									//过站登机BDC
									BDO: #0ebf9c,
									//登机CKI
									BDC: #e39832,
									//登机结束DEP
									DEP: #767c96,
									//起飞BDO
									CKI: #d7dfec,
									//正在直机CKC
									CKC: #d7dfec,
									//直机关闭
									BDS: #d7dfec,
									//候机RTN
									ARR: #52c41a); //到达

								@each $wb,
								$value in $mapStatus {
									&.#{$wb} {
										color: $value;
									}
								}

								font-family: SourceHanSansSC-Medium;
								font-size: 35rpx;
								padding: 0 25rpx;
								text-align: right;
								width: 180rpx;
								white-space: nowrap;
							}
						}

						.taskStatus {
							font-size: 35rpx;
							padding: 0 25rpx;
							text-align: right;
							width: 230rpx;
							white-space: nowrap;
							$status: ('1': #1890ff,
								'2': #767c96,
								'3': #389e0d,
								'null': #d48806);

							@each $key,
							$value in $status {
								&.taskStatus-#{$key} {
									color: $value;
								}
							}
						}

						.flight-msg {
							display: flex;
							justify-content: space-between;
							height: 60rpx;
							line-height: 60rpx;
							padding: 0 25rpx;

							>.right {
								text-align: right;
								font-size: 26rpx;
								font-weight: bold;
								color: #333333;
								min-width: 35%;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;

								image {
									width: 33rpx;
									height: 23rpx;
									// position: relative;
									// bottom: 5rpx;
								}
							}

							>.left {
								color: #333333;
								font-size: 29rpx;
								font-weight: bold;
								min-width: 30%;

								text {
									margin-left: 10rpx;
								}

								image {
									width: 33rpx;
									height: 33rpx;
									position: relative;
									top: 5rpx;
								}
							}

							>.mid {
								text {
									margin-left: 10rpx;
								}

								text-align: center;
								min-width: 25%;
								font-size: 29rpx;
								font-weight: bold;
								color: #333333;

								image {
									width: 17rpx;
									height: 19rpx;
									position: relative;
									bottom: 2rpx;
								}
							}
						}

						.flight-time {
							display: flex;
							height: 49rpx;
							line-height: 49rpx;
							justify-content: space-between;
							padding: 0 25rpx;

							.time-type {
								min-width: 25%;
								color: #999999;

								.value-time {
									font-size: 28rpx;
								}

								.label-time {
									font-size: 17rpx;
									position: relative;
									bottom: 10rpx;
									left: 10rpx;
								}
							}

							.mid {
								text-align: center;
							}
						}
					}
				}

				.noMessage {
					padding-top: calc((100vh - 350rpx) / 2);
					text-align: center;

					text {
						color: #666666;
					}
				}
			}
		}

		.drawerClass {
			padding-top: 20px;

			.airport-select {
				display: flex;
				justify-content: space-between;
				// margin-top: 20rpx;
				width: 100%;

				.airport {
					width: 30%;
					height: 86rpx;
					line-height: 86rpx;

					text {
						padding-left: 15rpx;
						font-size: 28rpx;
					}
				}

				.search {
					display: flex;
					justify-content: flex-start;
					width: 70%;
					height: 80rpx;
					line-height: 80rpx;
					margin: 0 17rpx;
					background-color: #f0f0f0;
					// border-radius: 42rpx;

					.searchIcon {
						width: 35rpx;
						height: 35rpx;
						margin-left: 15rpx;
						margin: auto;
					}

					.uni-input {
						margin-left: 15rpx;
						width: 510rpx;
						height: 85rpx;
						// margin-left: 5rpx;
					}

					.placeholderClass {
						line-height: 85rpx;
					}

					.deleteIcon {
						width: 85rpx;
						height: 85rpx;
						line-height: 85rpx;
						text-align: center;

						image {
							width: 50rpx;
							height: 50rpx;
							margin-top: 15rpx;
						}
					}
				}

				.input {
					width: 70%;
					height: 86rpx;

					.select-input {
						padding-left: 10rpx;
						margin-left: 15rpx;
						background: #f5f5f5;
						width: 90%;
						height: 86rpx;
					}
				}
			}

			.selectButton {
				margin: 5rpx 0;

				.airport {
					width: 30%;
					height: 60rpx;
					line-height: 60rpx;

					text {
						padding-left: 15rpx;
						font-size: 28rpx;
					}
				}

				.btnClass {
					display: flex;
					flex-flow: wrap;

					>view {
						font-size: 28rpx;
					}

					.btn {
						margin-left: 15rpx;
						margin-top: 5px;
						margin-bottom: 5px;
						background: #f5f5f5;
						width: 30%;
						height: 75rpx;
						line-height: 75rpx;
						text-align: center;
						position: relative;
					}

					.btnSelect {
						margin-left: 15rpx;
						margin-top: 5px;
						margin-bottom: 5px;
						background: #e5f2ff;
						width: 30%;
						height: 75rpx;
						line-height: 75rpx;
						text-align: center;
						color: #0096ff;
						position: relative;
					}

					.select-image {
						position: absolute;
						width: 30rpx;
						height: 30rpx;
						top: 0;
						right: 0;
					}
				}
			}

			.bottom {
				display: flex;
				justify-content: flex-end;
				margin-top: 50rpx;
				height: 75rpx;
				width: 100%;
				padding-bottom: 50rpx;

				.reset {
					margin-right: 15rpx;
					width: 35%;
					line-height: 75rpx;
				}

				.select {
					margin-right: 15rpx;
					width: 35%;
					line-height: 75rpx;
				}
			}
		}
	}
</style>

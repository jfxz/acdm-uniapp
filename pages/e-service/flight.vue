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
				<view class="handle-type">
				</view>
			</view>
			<view class="nav-title">
				<text v-if="filterFlightList">{{`${tabList[tabCurrent].name}(${tabList[tabCurrent].num})`}}</text>
				<text v-else>{{ `航班(0)`}}</text>
			</view>
			<view class="nav-handle-right">
				<view class="handle-type">
				</view>
				<!-- <view class="handle-type" v-if="filterStatus">
					<image src="../../static/ic_filter_red.png" @click="openDrawer" style="width: 45rpx;height:48rpx;bottom: 5rpx;position: relative;"></image>
				</view>
				<view class="handle-type" v-if="!filterStatus">
					<image src="../../static/ic_filter.png" @click="openDrawer"></image>
				</view> -->
				<!-- <view class="handle-type">
					<image src="../../static/service/serch.png" @click="searchFlight"></image>
				</view> -->
			</view>
		</view>
    <!-- 筛选 -->
    <view class="filter" @tap="openDrawer">
      <image src="@/static/service/filter.png" mode="aspectFit"></image>
    </view>
    
    
		<view class="sub-section">
			<u-subsection button-color="#27538F" bg-color="#1891ff" :height="100" active-color="#fff" inactive-color="#fff" :list="tabList"
			@change="tabChange" :current="tabCurrent">
				<template  v-slot:num="{data}">
					{{data}}
				</template>
			</u-subsection>
		</view>
		<view class="flight-list">
			<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption" :fixed="false"
			 top="10" :down="downOption" height="100%" bottom="0" class="scroll" :resetText="updateText[tabCurrent]">
				<uni-swipe-action v-if="showPlayList">
					<uni-swipe-action-item :right-options="options" @click="groupChatClick(item)" v-for="(item, index) in showFlightList"
					 :key="index" class="swipe-class">
						<view class="item" @click="flightClick(item)">
              <view class="ball left"></view>
              <view class="ball right"></view>
							<view class="flight-status">
								<view class="flight">
									<view class="cu-avatar sm round" style="position: relative;bottom:5rpx" :style="{background:vipTagStyle(item.vipTag)}"
									 v-if="item.vipTag">{{vipTagText(item.vipTag)}}</view>
									{{item.iataCarrier || ''}}{{item.flight || ''}}
								</view>
								<view class="place">
                  <text>{{item.originCn}}</text>
                  <image src="@/static/service/plane.png" mode="aspectFit"></image>
                  <text>{{item.destinationCn}}</text>
                  <!-- <text>{{item.flightRouteCn||item.originCn+'-'+item.destinationCn}}</text> -->
								</view>
                <view class="airline-icon">
                  <image :src="judgeAirline(item)" mode="aspectFit"></image>
                </view>
								
							</view>
							<view class="flight-msg">
								<view class="left">
									<image src="../../static/ic_flight.png" mode="aspectFit"></image>
									<text>{{item.registration}}/{{item.aircraftType}}</text>
								</view>
								<view class="mid">
									<image class="stand-icon" src="../../static/service/stand.png" mode="aspectFit"></image>
                  <text>{{item.stand||'--'}}</text>
                  <image class="gate-icon" src="../../static/service/gate.png" mode="aspectFit"></image>
									<text>{{item.gate||'--'}}</text>
								</view>
								<view class="right">
                  <view :class="['taskStatus', 'taskStatus' + '-' + item.taskConfirmStatus]">
                    {{formatTaskStatus(item.taskConfirmStatus)}}
                  </view>
                  <view class="estime">
                    <text v-if="isArr(item)">{{'预计'}}:{{formatDate(item.estimateArrTime)}}</text>
                    <text v-else>{{formatDate(item.localAcobt)}}/{{formatDate(item.localCtot)}}</text>
                  </view>
									
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
						<text>{{'航空公司'}}</text>
					</view>
					<view class="search">
						<input class="uni-input" confirm-type="search" placeholder-class="placeholderClass" v-model="filters.flightCode"
						 placeholder="请输入航空公司" />
						<view class="deleteIcon">
							<image src="../../static/delete.png" @tap="deleteMsg" v-show="filters.flightCode"></image>
						</view>
					</view>
				</view>
				<view class="airport-select">
					<view class="airport">
						<text>航班号</text>
					</view>
					<view class="search">
						<input class="uni-input" confirm-type="search" placeholder-class="placeholderClass" v-model="filters.flight"
						 placeholder="请输入航班号" />
						<view class="deleteIcon">
							<image src="../../static/delete.png" @tap="deleteMsgFlight" v-show="filters.flight"></image>
						</view>
					</view>
				</view>
				<view class="selectButton">
					<!-- 若为福州用户隐藏航站楼选项 -->
					<view class="airport" v-if="this.user.userAirport[0].icaocode!=='ZSFZ'">
						<text>{{'航站楼'}}</text>
					</view>
					<view class="btnClass" v-if="this.user.userAirport[0].icaocode!=='ZSFZ'">
						<view :class="filters.terminal===item.value? 'btnSelect':'btn'" @tap="clickFilterBtn('terminal',item.value)"
						 v-for="(item,index) in terminalList" :key="index">{{item.label}}
							<image v-show="filters.terminal===item.value" class="select-image" src="../../static/filterSelect.png"></image>
						</view>
					</view>
					<view class="airport">
						<text>{{'机位'}}</text>
					</view>
					<view class="btnClass">
						<view :class="filters.stand===item.value? 'btnSelect':'btn'" @tap="clickFilterBtn('stand',item.value)" v-for="(item,index) in standList"
						 :key="index">{{item.label}}
							<image v-show="filters.stand===item.value" class="select-image" src="../../static/filterSelect.png"></image>
						</view>
					</view>
					<view class="airport">
						<text>{{'代理'}}</text>
					</view>
					<view class="btnClass">
						<view :class="filters.agent===item.value? 'btnSelect':'btn'" @tap="clickFilterBtn('agent',item.value)" v-for="(item,index) in agentList"
						 :key="index">{{item.label}}
							<image v-show="filters.agent===item.value" class="select-image" src="../../static/filterSelect.png"></image>
						</view>
					</view>
					<view class="airport">
						<text>{{'进港状态'}}</text>
					</view>
					<view class="btnClass">
						<view :class="filters.arrStatus===item.value? 'btnSelect':'btn'" @tap="clickFilterBtn('arrStatus',item.value)"
						 v-for="(item,index) in arrStatusList" :key="index">{{item.label}}
							<image v-show="filters.arrStatus===item.value" class="select-image" src="../../static/filterSelect.png"></image>
						</view>
					</view>
					<view class="airport">
						<text>{{'出港状态'}}</text>
					</view>
					<view class="btnClass">
						<view :class="filters.depStatus===item.value? 'btnSelect':'btn'" @click="clickFilterBtn('depStatus',item.value)"
						 v-for="(item,index) in depStatusList" :key="index">{{item.label}}
							<image v-show="filters.depStatus===item.value" class="select-image" src="../../static/filterSelect.png"></image>
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
		<drawer ref="drawer"></drawer>
	</view>
</template>

<script>
  import drawer from './drawer.vue'
  import eService from '../e-service/index.vue'
	import eventVue from '../../common/util/eventVue.js'
	import * as flightApi from "@/api/flight/index.js"
	import {
		mapGetters
	} from 'vuex'
  import moment from 'moment'
	import {
		deepCopy
	} from '../../common/util/util.js'
	import workNote from "../flight/work-note.vue"
	import uniDrawer from "@/components/uni-drawer/uni-drawer.vue"
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js"
	import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue"
	import {
		creatGroup
	} from '@/api/imApi/admin.js'
	import {
		USER_TYPE
	} from '@/common/dic'
	import flightGroupChat from "../flight/flight-group-chat.vue"
	import {
		debounce
	} from '../../common/util/util.js'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		components: {
      drawer,
      eService,
			uniDrawer,
			uniSwipeAction,
			uniSwipeActionItem,
			MescrollBody,
			workNote,
			flightGroupChat
		},
		data () {
			return {
        firstOpen: false,
        currentFlight: {},
				tabList: [{
					name: '进港',
					num: 0
				}, {
					name: '出港',
					num: 0
				}, {
					name: '即将进港',
					num: 0
				}, {
					name: '即将出港',
					num: 0
				}, {
					name: '正在保障',
					num: 0
				}],
				swipe: [{
					name: '点击创建群聊'
				}],
				tuiTabsHeight: 90,
				itemWidthtab: '25%',
				// 当前选中状态
				filters: {
					flightCode: '',
					flight: '',
					terminal: 'all',
					stand: 'all',
					agent: 'all',
					arrStatus: 'all',
					depStatus: 'all'
				},
				//当前确认筛选状态
				flitersNow: {
					flightCode: '',
					flight: '',
					terminal: 'all',
					stand: 'all',
					agent: 'all',
					arrStatus: 'all',
					depStatus: 'all'
				},
				//默认值
				flitersDefault: {
					flightCode: '',
					flight: '',
					terminal: 'all',
					stand: 'all',
					agent: 'all',
					arrStatus: 'all',
					depStatus: 'all'
				},
				terminalList: [{
					value: 'T3',
					label: 'T3'
				}, {
					value: 'T4',
					label: 'T4'
				}, {
					value: 'all',
					label: '所有'
				}],
				standList: [{
					value: '0',
					label: '远机位'
				}, {
					value: '1',
					label: '桥位'
				}, {
					value: 'all',
					label: '所有'
				}], //1桥位 0远机位
				agentList: [{
					value: 'A',
					label: '机场'
				}, {
					value: 'B',
					label: '厦航'
				}, {
					value: 'all',
					label: '所有'
				}],
				arrStatusList: [{
					value: 'ARR',
					label: '到达'
				}, {
					value: 'ENR',
					label: '途中'
				}, {
					value: 'all',
					label: '所有'
				}],
				depStatusList: [{
					value: 'BDO',
					label: '登机'
				}, {
					value: 'DEP',
					label: '起飞'
				}, {
					value: 'BDC',
					label: '登机结束'
				}, {
					value: 'BDP',
					label: '允许登机'
				}, {
					value: 'all',
					label: '全部'
				}],
				options: [{
					text: '进入航班群聊',
					style: {
						backgroundColor: '#26b3ff'
					}
				}],
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
				// tabbarList: this.$store.state.user.tabbar,
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
						tip: "暂无相关数据",
						btnText: "",
						fixed: true,
						top: "100rpx",
						zIndex: 99
					}
				},
				resertTimeType: ['resetTimeArrSign', 'resetTimeDepSign', 'resetTimeWArrSign', 'resetTimeWDepSign', 'resetTimeGmsSign'],

				// 是否显示创建群聊的窗口
				newGroupShow: false,
				timer: null,
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
		onReachBottom () {
			// this.pageCount++
			// this.conputeList()
		},
		computed: {
			...mapGetters(['user', 'userInfo', 'flight', 'allUserMsg', 'remoteDic'])
		},
		watch: {
		},
		onLoad (e) {
      this.firstOpen = true
      this.getALLFlightList()
			this.drawerWidth = uni.getSystemInfoSync().windowWidth * 0.8
		},
		onShow () {
      this.handelUpdateTime('all')
      if (this.firstOpen) {
        this.downCallback()
      } else {
        this.firstOpen = true
      }
      // this.$store.dispatch('setAriport')
      // this.$store.dispatch('setGmsTimeoutTimer')
			// #ifdef APP-PLUS
			plus.screen.lockOrientation('portrait-primary');
			// #endif
			clearInterval(this.timer)
			clearInterval(this.timerUpdate)
      this.timer = setInterval(() => {
        this.downCallback()
        console.log('定时刷新')
      }, 2000 * 60)
		},
		onHide () {
			console.log('隐藏onHide')
			clearInterval(this.timer)
			clearInterval(this.timerUpdate)
		},
		onBackPress () {
			console.log('隐藏onBackPress')
		},
		beforeDestroy () {
			clearInterval(this.timer)
			clearInterval(this.timerUpdate)
			console.log('隐藏onUnload')
		},
		methods: {
      judgeAirline (flight) {
        let airlines = ['AQ', 'F6', 'CZ', 'MF']
        if (airlines.includes(flight.iataCarrier)) {
          return `../../static/service/${flight.iataCarrier}.png`
        }
        return ''
      },
			formatTaskStatus (status) {
				if (status === '1') {
					return '待确认'
				} else if (status === '2') {
					return '受服务方确认'
				} else if (status === '3') {
					return '已完成'
				}
			},
			// mq监听刷新
			flightMessageChange: debounce(function () {
				this.timerResersh()
				console.log('执行刷新')
			}, 1000 * 1),
			// 获取各种航班信息
			getALLFlightList (flag) {
				if (this.firstOpen) {
					this.$loading()
          this.firstOpen = false
				}
				this.$store.dispatch('setAllTypeFlight').then(res => {
					this.$store.dispatch('setFollowList')
					this.flightList[0] = this.flight.arrFlight
					this.flightList[1] = this.flight.depFlight
					this.flightList[2] = this.flight.willArr
					this.flightList[3] = this.flight.willDep
					this.flightList[4] = this.flight.gmsFlight
					this.filterFlightList = this.flightList[0]
					this.checkDataEmpty(this.filterFlightList)
					this.getSelData()
				}).catch(err => {
					uni.hideLoading()
				})
			},
			conputeList () {
				this.status = 'loading'
				let diff = this.pageCount * 30
				let divisionList = this.filterFlightList.slice(0, diff)
				this.showFlightList = divisionList
				setTimeout(() => {
					this.showPlayList = true
					uni.hideLoading()
					// this.$refs.workNote.openNoteDialog('first')
				}, 500)
				if (divisionList < 30) {
					this.status = 'nomore'
				}
			},
			//刷新
			timerResersh () {
				this.$store.dispatch('setAllTypeFlight').then(res => {
					console.log('刷新')
					this.flightList[0] = res[0]
					this.flightList[1] = res[1]
					this.flightList[2] = res[2]
					this.flightList[3] = res[3]
					this.flightList[4] = res[4]
					// 判断是否有筛选状态，若有进行筛选 
					if (JSON.stringify(this.conditionFilter()) !== '{}') {
						//判断是否打开抽屉，打开则不渲染，以防自动关闭抽屉
						if (!this.showUDrawer) { //不打开进行渲染
							this.filterFlightList = this.flightList[this.tabCurrent]
							this.selectFligtData('sel')
							this.showFlightList = this.filterFlightList.slice(0, this.pageCount * 30)
							console.log('1')
							this.$forceUpdate()
						}
					} else { //没状态，进行替换
						this.filterFlightList = this.flightList[this.tabCurrent]
						this.showFlightList = this.filterFlightList.slice(0, this.pageCount * 30)
						this.tabList.forEach((item, index) => {
							item.num = this.flightList[index].length
						})
						// this.getSelData()
						this.$forceUpdate()
						console.log('2')
					}
				})
			},
			/*下拉刷新的回调*/
			downCallback (page) {
        console.log('------------开始刷新--------------')
				if (this.tabCurrent === 0 || this.tabCurrent === 1) {
					flightApi.getFlightList({
						airportCode: this.user.userAirport[0].icaocode,
						direction: this.tabCurrent === 0 ? 'A' : 'D'
					}).then(res => {
            this.showFlightList = []
						this.flightList[this.tabCurrent === 0 ? 0 : 1] = res.data
            console.log(1111111, res)
            console.log(this.tabCurrent)
						this.filterFlightList = this.flightList[this.tabCurrent === 0 ? 0 : 1]
						
						// this.selectFligtData('sel')

						this.checkDataEmpty(this.filterFlightList)
						setTimeout(() => {
							this.mescroll.endSuccess()
							this.$message(`${this.tabList[this.tabCurrent].name}航班刷新成功`, 'none', '')
						}, 500)
						setTimeout(() => {
							if (this.tabCurrent === 0) {
								uni.setStorageSync('resetTimeArrSign', moment(new Date()))
							}
							if (this.tabCurrent === 1) {
								uni.setStorageSync('resetTimeDepSign', moment(new Date()))
							}
							this.handelUpdateTime()
						}, 800)
					}).catch(e => {
						setTimeout(() => {
							this.mescroll.endSuccess()
							this.$message('刷新失败', 'none', '')
						}, 500)
					})
				}
				if (this.tabCurrent === 2) {
					flightApi.getWillArrFlightList({
						airportCode: this.user.userAirport[0].icaocode,
					}).then(res => {
						this.flightList[2] = res.data
						this.filterFlightList = this.flightList[2]
						this.selectFligtData('sel')
						this.showFlightList = []
						this.checkDataEmpty(this.filterFlightList)
						setTimeout(() => {
							this.mescroll.endSuccess()
							this.$message(`${this.tabList[this.tabCurrent].name}航班刷新成功`, 'none', '')
						}, 500)
						setTimeout(() => {
							uni.setStorageSync('resetTimeWArrSign', moment(new Date()))
							this.handelUpdateTime()
						}, 800)
					}).catch(e => {
						setTimeout(() => {
							this.mescroll.endSuccess()
							this.$message('刷新失败', 'none', '')
						}, 500)
					})
				}
				if (this.tabCurrent === 3) {
					flightApi.getWillDepFlightList({
						airportCode: this.user.userAirport[0].icaocode,
					}).then(res => {
						this.flightList[3] = res.data
						this.filterFlightList = this.flightList[3]
						this.selectFligtData('sel')
						this.showFlightList = []
						this.checkDataEmpty(this.filterFlightList)
						setTimeout(() => {
							this.mescroll.endSuccess()
							this.$message(`${this.tabList[this.tabCurrent].name}航班刷新成功`, 'none', '')
						}, 500)
						setTimeout(() => {
							uni.setStorageSync('resetTimeWDepSign', moment(new Date()))
							this.handelUpdateTime()
						}, 800)
					}).catch(e => {
						setTimeout(() => {
							this.mescroll.endSuccess()
							this.$message('刷新失败', 'none', '')
						}, 500)
					})
				}
				if (this.tabCurrent === 4) {
					flightApi.getGmsFlightList({
						airportCode: this.user.userAirport[0].icaocode,
					}).then(res => {
						this.flightList[4] = res.data
						this.filterFlightList = this.flightList[4]
						this.selectFligtData('sel')
						this.showFlightList = []
						this.checkDataEmpty(this.filterFlightList)
						setTimeout(() => {
							this.mescroll.endSuccess()
							this.$message(`${this.tabList[this.tabCurrent].name}航班刷新成功`, 'none', '')
						}, 500)
						setTimeout(() => {
							uni.setStorageSync('resetTimeGmsSign', moment(new Date()))
							this.handelUpdateTime()
						}, 800)
					}).catch(e => {
						setTimeout(() => {
							this.mescroll.endSuccess()
							this.$message('刷新失败', 'none', '')
						}, 500)
					})
				}
			},
			/*上拉加载的回调*/
			upCallback (page) {
				setTimeout(() => {
					let pageNum = page.num; // 页码, 默认从1开始
					if (this.isTabChange) pageNum--
					this.pageCount = pageNum + 1
					let pageSize = page.size; // 页长, 默认每页10条Math.ceil(7/2)
					let diff = (pageNum + 1) * page.size
					let divisionList = this.filterFlightList.slice((pageNum) * 30, diff)
					if (this.showFlightList.length < this.filterFlightList.length) {
						this.showFlightList = [...this.showFlightList, ...divisionList]
					}
					this.mescroll.endBySize(divisionList, this.filterFlightList)
					this.showPlayList = true
				}, 200)
			},
			//获取筛选信息缓存
			getSelData () {
				let selData = this.flitersNow
				if (selData) {
					this.filters = selData
					this.flitersNow = selData
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
			filtersNowSetOrDelete (type) {
				// 判断为赋值
				if (type === 'set') { //判断是否赋新筛选条件
					this.flitersNow = deepCopy(this.filters)
					console.log('this.filters', this.flitersNow)
				}
				// 判断为删除
				if (type === 'delete') {
					this.filters = deepCopy(this.flitersDefault)
					this.flitersNow = deepCopy(this.flitersDefault)
					this.filterStatus = false
					this.tabList.forEach((item, index) => {
						item.num = this.flightList[index].length
					})
				}
			},
			// 切换tab事件
			tabChange (val) {
				this.$nextTick(() => {
					this.tabCurrent = val
					if (this.flightArrBySelect.length > 0) {
						this.filterFlightList = this.flightArrBySelect[val]
					} else {
						this.filterFlightList = this.flightList[val]
					}
          this.downCallback()
					this.showPlayList = false
					this.isTabChange = true
					this.selectFligtData('tab')
				})
			},
			// 筛选方式
			selectFligtData (type) {
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
				//记录是否筛选&&筛选按钮高亮显示
				if (JSON.stringify(condition) !== '{}' || this.flitersNow.stand !== 'all') {
					this.filterStatus = true
				} else {
					this.flightArrBySelect = []
					this.filterStatus = false
				}
				this.$forceUpdate()
			},
			//所有类型的航班筛选
			selectAllTypeFlight (condition) {
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
						console.log('conditionSer', conditionSer)
						//防止进出港状态相互影响，进港航班只筛选进港状态，出港同
						if ((index === 0 || index === 2)) {
							if (this.flitersNow.arrStatus === 'all') {
								delete(conditionSer['flightStatus'])
							} else {
								conditionSer['flightStatus'] = this.flitersNow.arrStatus
							}
							returnArr[index] = deepCopy(this.dataFilter(conditionSer, item))
						}
						if ((index === 1 || index === 3)) {
							if (this.flitersNow.depStatus === 'all') {
								delete(conditionSer['flightStatus'])
							} else {
								conditionSer['flightStatus'] = this.flitersNow.depStatus
							}
							returnArr[index] = deepCopy(this.dataFilter(conditionSer, item))
						}
						if (index === 4) {
							delete(conditionSer['flightStatus'])
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
						this.tabList[index].num = returnArr[index].length
					})
					return returnArr
				}
			},
			// 筛选过滤器
			dataFilter (condition, data) {
				if (data) {
					return data.filter(item => {
						return Object.keys(condition).every(key => {
							return String(item[key]).toUpperCase().includes(
								String(condition[key]).toUpperCase().trim())
						})
					})
				} else {
					return ''
				}
			},
			// 筛选条件赋值
			conditionFilter () {
				let condition = {}
				if (this.flitersNow.flightCode !== '') {
					condition['iataCarrier'] = this.flitersNow.flightCode
				}
				if (this.flitersNow.flight !== '') {
					condition['flight'] = this.flitersNow.flight
				}
				if (this.flitersNow.terminal !== 'all' && this.user.userAirport[0].icaocode !== 'ZSFZ') {
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
				console.log('conditioncondition', condition)
				return condition
			},
			checkDataEmpty (data) {
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
			flightClick (flight) {
        this.currentFlight = flight
        console.log('flight', flight)
        this.$refs.drawer.showModal('flightClick', this.currentFlight)
				// let msg = {
				// 	flightId: flight.flightId,
				// 	num: this.tabCurrent
				// }
				// uni.navigateTo({
				// 	url: `/pages/flight/flight-message?flightId=${flight.flightId}&num=${this.tabCurrent}`
				// })
			},
			// 打开右侧抽屉
			openDrawer () {
				this.$refs['uniDrawer'].open()
			},
			// 打开上下班打卡
			openWorkNote () {
				// this.$refs.workNote.openNoteDialog('second')
			},
			// 跳转到主页
			openAcdmHome () {
				uni.reLaunch({
					url: '../home/index'
				})

			},
			// 判断是否是进港，返回true false
			isArr (flight) {
				if (flight) {
					return flight.direction === 'A'
				} else {
					return false
				}
			},
			// 跳转到搜索航班
			searchFlight () {
				uni.navigateTo({
					url: `/pages/search/index`
				})
			},
			// 右侧抽屉重置
			reset () {
				this.$refs.uniDrawer.close()
				this.filterFlightList = this.flightList[this.tabCurrent]
				this.pageCount = 1
				this.showFlightList = []
				this.flightArrBySelect = []
				setTimeout(() => {
					this.mescroll.resetUpScroll()
					this.mescroll.scrollTo(0, 0)
				}, 300)
				this.filtersNowSetOrDelete('delete')
			},
			// 右侧抽屉 input 清除内容
			deleteMsg () {
				this.filters.flightCode = ''
				// this.search()
			},
			deleteMsgFlight () {
				this.filters.flight = ''
				// this.search()
			},
			// 获取是否打开抽屉标志
			getOpenStatus (flag) {
				this.showUDrawer = flag
				if (!this.showUDrawer) {
					this.filters = deepCopy(this.flitersNow)
				}
			},
			// 左滑创建群聊
			groupChatClick (item) {
				this.groupChatForm.channelName = item.iataCarrier + item.flight + '(' + moment(new Date()).format('DMMM') + ')'
				this.$refs.flightGroupChat.open(this.groupChatForm.channelName, this.userInfo.id, item)
			},
			// 筛选框点击
			clickFilterBtn (key, val) {
				this.filters[key] = val
			},
			/*上次更新时间处理*/
			handelUpdateTime (type) {
				let today = moment(new Date())
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
			handleText (showTime, lastTime) {
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
			vipTagStyle (val) {
				if (val && this.baseVipCodeList) {
					let vip = this.baseVipCodeList.find(item => item.rankcode === val)
					let color = ''
					if (vip) {
						switch (vip.rankcode) {
							case 'C':
								color = '#ffcaca'
								break;
							case 'Z':
								color = '#85b3ff'
								break;
							case 'A':
								break;
							case 'B':
								break;
							default:
								break;
						}
					}
					return color
				}
				return ''
			},
			// viptag图标内显示的文字
			vipTagText (val) {
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
			// 转化时间/日期
			formatDate (date, format = 'HH:mm') {
			  if (date) {
			    return moment(date).format(format)
			  }
			  return ''
			},
			formatBoardTime (val) {
				if (val.meta.gateDetail) {
					if (val.meta.gateDetail.actualopen) {
						return moment(val.meta.gateDetail.actualopen).format('HH:mm')
					} else if (val.meta.gateDetail.estimateopen) {
						return moment(val.meta.gateDetail.estimateopen).format('HH:mm')
					} else if (val.meta.gateDetail.scheduleopen) {
						return moment(val.meta.gateDetail.scheduleopen).format('HH:mm')
					} else {
						return '--:--'
					}
				} else {
					return '--:--'
				}
			},
			formatStatus (status) {
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
    .filter {
      background: #448FF7;
      position: fixed;
      bottom: 20%;
      border-radius: 20rpx 0 0 20rpx;
      right: 0;
      width: 80rpx;
      z-index: 2;
      image {
        width: 65rpx;
        height: 65rpx;
        position: relative;
        left: 10rpx;
        top: 5rpx;
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
      background: #1891ff;
      display: flex;
      justify-content: space-between;
			width: 100%;
			position: fixed;
			top: 0;
			z-index: 9;
			margin-top: calc(var(--status-bar-height) + 92rpx);
      height: 130rpx;
      border-radius: 0 0 20rpx 20rpx;
      .tab-label {
        margin-top: 16rpx;
        font-size: 30rpx;
      }
			.u-subsection {
				width: 100%;
				height: inherit !important;
				.u-item-bg {
					width: 20vw !important;
				}
			}
      .sub-tab {
        width: 20%;
        text-align: center;
        margin: 15rpx;
        color: #FFFFFF;
        &.currentTab {
          background: #27538F;
          border-radius: 10rpx;
        }
      }
		}

		.flight-list {
			z-index: 5;
			margin-top: calc(var(--status-bar-height) + 210rpx);

			.scroll {
				width: 100%;

				.swipe-class {
					margin: 17rpx 18rpx 17rpx 18rpx;

					.item {
            position: relative;
						border-radius: 7rpx;
						background: #FFFFFF;
						width: 100%;
            height: 200rpx;
            .ball {
              width: 30rpx;
              height: 30rpx;
              border-radius: 50%;
              background: #f1f1f1;
              position: absolute;
              top: 50%;
              &.left {
                transform: translate(-50%, -50%);
              }
              &.right {
                right: 0;
                transform: translate(50%, -50%);
              }
            }
						.flight-status {
							display: flex;
							justify-content: space-between;
							height: 100rpx;
							line-height: 100rpx;
							border-bottom: 2rpx dashed #e5e5e5;

							.flight {
								padding: 0 25rpx;
								min-width: 36%;
								color: #333333;
								font-size: 42rpx;
								font-weight: bold;
								overflow: hidden;
								white-space: nowrap;
								text-overflow: ellipsis;
							}

							.place {
								color: #000000;
								font-size: 26rpx;
								color: #333333;
								min-width: 33%;
								// overflow: hidden;
								white-space: nowrap;
								text-overflow: ellipsis;
                text-align: center;
                font-weight: bold;
                image {
                  width: 40rpx;
                  height: 40rpx;
                  margin: 0 10rpx;
                  position: relative;
                  top: 10rpx;
                }
							}
              .airline-icon {
                width: 33.3%;
								opacity: 0.2;
                text-align: right;
                image {
                  height: 90rpx;
                  width: 120rpx;
                }
              }
							.status {
								color: #c6c6c6;
								$mapStatus: (DLY: #e85656, //延误
									RTN:#e85656, //返航
									CNL:#576078, //取消
									ENR: #1890ff, //途中
									ALT:#2f54eb, // 备降
									BDP:#faad14, //允许登机BDF
									BDF:#0ebf9c, //催促登机BDT
									BDT:#0ebf9c, //过站登机BDC
									BDO:#0ebf9c, //登机CKI
									BDC:#e39832, //登机结束DEP
									DEP:#767c96, //起飞BDO
									CKI:#d7dfec, //正在直机CKC
									CKC:#d7dfec, //直机关闭
									BDS:#d7dfec, //候机RTN
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

						.flight-msg {
							display: flex;
							justify-content: space-between;
							height: 100rpx;
							line-height: 100rpx;
							padding: 0 25rpx;

							>.right {
								text-align: right;
								font-weight: bold;
								color: #333333;
                font-size: 28rpx;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
                width: 33.3%;
                .estime {
                  height: 50rpx;
                  line-height: 50rpx;
                  text-align: right;
                }
                .taskStatus {
                	font-size: 30rpx;
                  height: 50rpx;
                  line-height: 70rpx;
                	// padding: 0 25rpx;
                	text-align: right;
                	// width: 230rpx;
                	white-space: nowrap;
                	$status: ('1': red,
                		'2': #f37b1d,
                		'3': green);
                	@each $key,
                	$value in $status {
                		&.taskStatus-#{$key} {
                			color: $value;
                		}
                	}
                }
								image {
									width: 33rpx;
									height: 23rpx;
									// position: relative;
									// bottom: 5rpx;
								}
							}

							>.left {
								color: #333333;
								font-size: 30rpx;
								font-weight: bold;
								min-width: 33.3%;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
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
								min-width: 33.3%;
								font-size: 30rpx;
								font-weight: bold;
								color: #333333;
                .stand-icon {
                  width: 35rpx;
                  height: 35rpx;
                }
                .gate-icon {
                  width: 32rpx;
                  height: 32rpx;
                  margin-left: 20rpx;
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
					padding-top: calc((100vh - 350rpx)/2);
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

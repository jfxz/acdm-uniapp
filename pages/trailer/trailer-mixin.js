import eventVue from '@/common/util/eventVue.js'
import * as flightApi from "@/api/flight/index.js"
import {
	mapGetters
} from 'vuex'
import dayjs from '@/common/util/dayjs.min.js'
import {
	deepCopy
} from '@/common/util/util.js'
import workNote from "@/pages/flight/work-note.vue"
import uniDrawer from "@/components/uni-drawer/uni-drawer.vue"
import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js"
import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue"
import {
	getFlightStatus,
	getIrrCode,
	getVipCode,
} from '@/api/dic/index.js'
import {
	creatGroup
} from '@/api/imApi/admin.js'
import {
	USER_TYPE
} from '@/common/dic'
import flightGroupChat from "@/pages/flight/flight-group-chat.vue"
import {
	debounce
} from '@/common/util/util.js'
import { validatenull } from '@/common/util/validate.js'
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
			tabbarList: this.$store.state.user.tabbar,
			loadFlag: false,
			showPlayList: true,
			showNote: false,
			showUDrawer: false,
			status: 'loadmore',
			duration: 500,
			drawerWidth: 250,
			canReset: true,
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
			resertTimeType: ['resetTimeArr', 'resetTimeDep', 'resetTimeWArr', 'resetTimeWDep', 'resetTimeGms'],

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
	
	computed: {
		...mapGetters(['user', 'userInfo', 'flight', 'allUserMsg']),
		listenmessageFlightId() {
			return this.flight.messageFlightId
		}
	},
	watch: {
		listenmessageFlightId: function(old, newd) {
			if (old !== newd) {
				this.flightMessageChange()
				console.log('监听中老值', old)
				console.log('监听中新值', newd)
			}
		}
	},
	onLoad(e) {
		this.handelUpdateTime('all')
		this.drawerWidth = uni.getSystemInfoSync().windowWidth * 0.8
		this.getALLFlightList()
	},
	
	methods: {
		// mq监听刷新
		flightMessageChange: debounce(function() {
			this.timerResersh()
			console.log('执行刷新')
		}, 1000 * 1),
		// 获取各种航班信息
		getALLFlightList() {
			if (this.flight.arrFlight.length > 0) {
				return
			}
			this.$loading()
			this.$store.dispatch('setAllTypeFlight').then(res => {
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
		//刷新
		timerResersh() {
			this.$store.dispatch('setAllTypeFlight').then(res => {
				console.log('刷新')
				this.flightList[0] = res[0]
				this.flightList[1] = res[1]
				this.flightList[2] = res[2]
				this.flightList[3] = res[3]
				this.flightList[4] = res[4]
				console.log('筛选状态', uni.getStorageSync('flightSelectStatus'))
				// 判断是否有筛选状态，若有进行筛选 
				if (uni.getStorageSync('flightSelectStatus') === 'YES' || JSON.stringify(this.conditionFilter()) !== '{}') {
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
		filtersNowSetOrDelete(type) {
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

		
		// 筛选方式
		selectFligtData(type) {
			let condition = {}
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
				uni.setStorageSync('flightSelectStatus', 'YES')
				this.filterStatus = true
			} else {
				uni.setStorageSync('flightSelectStatus', 'NO')
				this.flightArrBySelect = []
				this.filterStatus = false
			}
			console.log('筛选状态', uni.getStorageSync('flightSelectStatus'))
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
		dataFilter(condition, data) {
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
		conditionFilter() {
			let condition = {}
			if (this.flitersNow.flightCode !== '') {
				condition['iataCarrier'] = this.flitersNow.flightCode
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
		}
	}
}

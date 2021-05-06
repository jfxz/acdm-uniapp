<template>
	<view class="flight-layout">
		<view class="navbar">
			<view class="nav-handle-left">
				<view class="handle-type">
					<image src="../../static/home2x.png" @tap="openAcdmHome"></image>
				</view>
				<view class="handle-type">
				</view>
				<view class="handle-type">
				</view>
			</view>
			<view class="nav-title">
				<text v-if="filterFlightList">{{ `航班关注(${filterFlightList.length})`}}</text>
				<text v-else>{{ `航班关注(0)`}}</text>
			</view>
			<view class="nav-handle-right">
				<view class="handle-type">
					<!-- <image src="../../static/home2x.png" @click="openDrawer"></image> -->
				</view>
				<view class="handle-type">
					<image src="../../static/setting-white.png" @click="setting"></image>
				</view>
				<view class="handle-type">
					<!-- 	<image src="../../static/ic_search.png" @click="openDrawer"></image> -->
					<image src="../../static/ic_filter.png" @click="openDrawer"></image>
				</view>
			</view>
		</view>
		<view class="flight-list">
			<uni-swipe-action>
				<uni-swipe-action-item :right-options="options" @click="groupChatClick(item, $event)" v-for="(item, index) in showFlightList"
				 :key="index" class="swipe-class">
					<view @click="flightClick(item)" class="item">
						<view class="flight-status">
							<view class="flight">
								<view class="cu-avatar sm round" style="position: relative;bottom:5rpx" :style="{background:vipTagStyle(item.vipTag)}"
								 v-if="item.vipTag">{{vipTagText(item.vipTag)}}</view>
								{{item.iataCarrier || ''}}{{item.flight || ''}}
							</view>
							<view class="place">
								{{item.flightRouteCn||item.originCn+'-'+item.destinationCn}}
							</view>
							<view :class="['status', item.flightStatus]">
								{{formatStatus(item.flightStatus)}}
							</view>
						</view>
						<view class="flight-msg">
							<view class="left">
								<image src="../../static/ic_flight.png" mode="aspectFit"></image>
								<text>{{item.registration}}/{{item.aircraftType}}</text>
							</view>
							<view class="mid">
								<image src="../../static/plane-seat.png" mode="aspectFit"></image>
								<text v-if="isArr(item)">{{item.stand||'--'}}/{{item.gate||'--'}}</text>
								<text v-else>{{item.stand||'--'}}/{{item.gate||'--'}}</text>
							</view>
							<view class="right">
								<image src="../../static/ic_clock.png" mode="aspectFit"></image>
								<text v-if="isArr(item)">{{'预计'}}:{{formatDate(item.estimateArrTime)}}</text>
								<text v-else>{{formatDate(item.localAcobt)}}/{{formatDate(item.localCtot)}}</text>
							</view>
						</view>
						<view class="flight-time">
							<view class="time-type">
								<text class="value-time" v-if="isArr(item)">{{formatDate(item.scheduleArrTime)}}</text>
								<text class="value-time" v-else>{{formatDate(item.scheduleDepTime)}}</text>
								<text class="label-time">计划</text>
							</view>
							<view class="time-type" v-if="isArr(item)">
								<text class="value-time">{{formatDate(item.actualArrTime)}}</text>
								<text class="label-time">实际</text>
							</view>
							<view class="time-type" v-if="!isArr(item)&&item.actualDepTime">
								<text class="value-time">{{formatDate(item.actualDepTime)}}</text>
								<text class="label-time">实际</text>
							</view>
							<view class="time-type" v-if="isArr(item)">
							</view>
							<view class="time-type" v-if="!isArr(item)&&!item.actualDepTime">
								<text class="value-time">{{formatDate(item.estimateDepTime)}}</text>
								<text class="label-time">预计</text>
							</view>
							<view class="time-type" v-if="!isArr(item)">
								<text class="value-time">{{formatDate(item.clearanceTarget)}}</text>
								<text class="label-time">放行</text>
							</view>
							<view class="time-type" v-if="!isArr(item)" style="text-align: right;padding-right: 5rpx;">
								<text class="value-time">登机:</text>
								<text class="value-time">{{formatBoardTime(item)}}</text>
							</view>
						</view>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
			<view class="noMessage" v-show="loadFlag">
				<text>暂无数据</text>
			</view>
		</view>
		<uni-drawer ref="uniDrawer" mode="right" :width="drawerWidth">
			<view class="drawerClass">
				<view class="drawerTitle">
					<text> {{'筛选'}}</text>
				</view>
				<view class="airport-select" style="margin-top: 20upx;">
					<view class="airport">
						<text>{{'航空公司'}}</text>
					</view>
					<!-- <view class="input">
						<u-input class="select-input" v-model="filters.flightCode" type="text" clearable height="86" />
					</view> -->
					<view class="search">
						<input class="uni-input" confirm-type="search" v-model="filters.flightCode" placeholder="请输入航空公司" />
						<view class="deleteIcon">
							<image src="../../static/delete.png" @click="deleteMsg" v-show="filters.flightCode"></image>
						</view>
					</view>
				</view>
				<view class="selectButton">
					<view class="airport">
						<text>{{'航站楼'}}</text>
					</view>
					<view class="btnClass">
						<view :class="filters.terminal===item.value? 'btnSelect':'btn'" @click="clickFilterBtn('terminal',item.value)"
						 v-for="(item,index) in terminalList" :key="index">{{item.label}}
							<image v-if="filters.terminal===item.value" class="select-image" src="../../static/filterSelect.png"></image>
						</view>
					</view>
					<view class="airport">
						<text>{{'机位'}}</text>
					</view>
					<view class="btnClass">
						<view :class="filters.stand===item.value? 'btnSelect':'btn'" @click="clickFilterBtn('stand',item.value)" v-for="(item,index) in standList"
						 :key="index">{{item.label}}
							<image v-if="filters.stand===item.value" class="select-image" src="../../static/filterSelect.png"></image>
						</view>
					</view>
					<view class="airport">
						<text>{{'代理'}}</text>
					</view>
					<view class="btnClass">
						<view :class="filters.agent===item.value? 'btnSelect':'btn'" @click="clickFilterBtn('agent',item.value)" v-for="(item,index) in agentList"
						 :key="index">{{item.label}}
							<image v-if="filters.agent===item.value" class="select-image" src="../../static/filterSelect.png"></image>
						</view>
					</view>
					<view class="airport">
						<text>{{'进港状态'}}</text>
					</view>
					<view class="btnClass">
						<view :class="filters.arrStatus===item.value? 'btnSelect':'btn'" @click="clickFilterBtn('arrStatus',item.value)"
						 v-for="(item,index) in arrStatusList" :key="index">{{item.label}}
							<image v-if="filters.arrStatus===item.value" class="select-image" src="../../static/filterSelect.png"></image>
						</view>
					</view>
					<view class="airport">
						<text>{{'出港状态'}}</text>
					</view>
					<view class="btnClass">
						<view :class="filters.depStatus===item.value? 'btnSelect':'btn'" @click="clickFilterBtn('depStatus',item.value)"
						 v-for="(item,index) in depStatusList" :key="index">{{item.label}}
							<image v-if="filters.depStatus===item.value" class="select-image" src="../../static/filterSelect.png"></image>
						</view>
					</view>
				</view>
				<view class="bottom">
					<view class="reset">
						<u-button type="primary" @click="reset" width="135">重置</u-button>
					</view>
					<view class="select">
						<u-button type="primary" @click="select" width="135">确定</u-button>
					</view>
				</view>
			</view>
		</uni-drawer>
		<flight-group-chat ref="flightGroupChat"></flight-group-chat>
		<u-tabbar :list="tabbarList" active-color="#2a4c7e" inactive-color="#8a8396"></u-tabbar>
	</view>
</template>

<script>
	import eventVue from '../../common/util/eventVue.js'
	import * as flightApi from "@/api/flight/index.js"
	import {
		mapGetters
	} from 'vuex'
	import dayjs from '../../common/util/dayjs.min.js'
	import {
		getFlightStatus,
		getIrrCode,
		getVipCode,
	} from '../../api/dic/index.js'
	import uniDrawer from "@/components/uni-drawer/uni-drawer.vue"
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
	import {
		creatGroup
	} from '@/api/imApi/admin.js'
	import {
		USER_TYPE
	} from '@/common/dic'
	import flightGroupChat from "@/pages/flight/flight-group-chat.vue"
	export default {
		components: {
			uniDrawer,
			uniSwipeAction,
			uniSwipeActionItem,
			flightGroupChat
		},
		data () {
			return {
				tabList: [{
					name: '进港'
				}, {
					name: '出港'
				}, {
					name: '即将进港'
				}, {
					name: '即将出港'
				}, {
					name: '正在保障'
				}],
				filters: {
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
					label: '登记'
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
				options: [
          {
          	text: '取消关注',
            followId: '',
          	style: {
          		backgroundColor: '#eb6262'
          	}
          },
          {
            text: '进入航班群聊',
            style: {
              backgroundColor: '#26b3ff'
            }
          }
				],
				tabCurrent: 0,
				pageCount: 1, //
				followFlightList: [], //获取关注航班
				arrPortFlight: [], //进港
				depPortFlight: [], //出港
				willArrPortFlight: [], //即将进港
				willDepFlight: [], //即将出港
				gmsFlight: [], //正在保障
				filterFlightList: [], //筛选后数据
				showFlightList: [], //页面展示数据
				animationData: {},
				flightStatusList: [],
				baseVipCodeList: this.$store.getters.remoteDic.BASE_VIP_CODE,
				baseFlightStatusList: this.$store.getters.remoteDic.BASE_FLIGHT_STATUS,
				userId: this.$store.getters.user.userId,
				userIp: '',
				modal: false,
				currenVersion: '',
				newCurrenVersion: '',
				loadFlag: false,
				isMoreLoad: true,
				tabLoading: false,
				status: 'loadmore',
				duration: 500,
				drawerWidth: 250,
				tabbarList: this.$store.state.user.tabbar,
        followTimer: null,
				// 是否显示创建群聊的窗口
				newGroupShow: false,
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
				}
			}
		},
		onReachBottom () {
			this.pageCount++
			this.conputeList()
		},
		computed: {
			...mapGetters(['user', 'userInfo', 'remoteDic'])
		},
    beforeDestroy () {
      this.followTimer && clearInterval(this.followTimer)
    },
		onLoad (e) {
			eventVue.$on('reflash', (val) => {
				if (val === 'follow') {
					this.getFollowFlight()
				}
			})
      this.followTimer = setInterval(() => {
        this.getFollowFlight()
      }, 60 * 1000)
			this.drawerWidth = uni.getSystemInfoSync().windowWidth * 0.8
			this.getFollowFlight()
		},
		onShow () {
			const value = uni.getStorageSync('local_key')
			console.log('是否存在', value)
			if (value) {
				this.getFollowFlight()
			}
			uni.removeStorageSync('local_key')
		},
    onPullDownRefresh () {
      this.getFollowFlight()
    },
		methods: {
			// 跳转到主页
			openAcdmHome () {
				uni.reLaunch({
					url: '../home/index'
				})
			},
			// 设置
			setting() {
				uni.navigateTo({
					url: './follow-setting'
				})
			},
			conputeList () {
				this.status = 'loading'
				let diff = this.pageCount * 15
				let divisionList = this.filterFlightList.slice((this.pageCount - 1) * 15, diff)
				this.showFlightList = [...this.showFlightList, ...divisionList]
				if (divisionList < 15) {
					this.status = 'nomore'
				}
			},
			getFollowFlight() {
				this.$loading()
				let nowDate = dayjs(new Date()).format('YYYY-MM-DD')
				console.log(uni.getStorageSync('user_id'))
				flightApi.getFollowFlightList({
					userId: uni.getStorageSync('user_id'),
					airportCode: uni.getStorageSync('userAirport')[0].icaocode
				}).then(res => {
					if (res.status) {
						let arr = []
						res.data.content.forEach(item => {
              item.flightList['followId'] = item.id
							arr.push(item.flightList)
						})
						this.followFlightList = arr
						this.filterFlightList = this.followFlightList
						this.showFlightList = []
						this.pageCount = 1
						this.checkDataEmpty(this.filterFlightList)
						uni.hideLoading()
            uni.stopPullDownRefresh()
					} else {
						this.loadFlag = true
						uni.hideLoading()
					}
				}).catch(err => {
					console.log('yichang')
					this.loadFlag = true
					uni.hideLoading()
				})
			},
			openDrawer() {
				this.$refs['uniDrawer'].open()
			},
			// 抽屉重置
			reset () {
				this.$refs['uniDrawer'].close()
				this.filterFlightList = this.followFlightList
				this.pageCount = 1
				this.showFlightList = []
				this.checkDataEmpty(this.filterFlightList)
				this.filters.airportCode = ''
				this.filters.stand = 'all'
				this.filters.agent = 'all'
				this.filters.terminal = 'all'
				this.filters.arrStatus = 'all'
				this.filters.depStatus = 'all'
			},
			// 筛选方式
			select () {
				this.$refs['uniDrawer'].close()
				var condition = {}
				this.showFlightList = []
				this.pageCount = 1
				let followFlighArr = this.followFlightList
				if (this.filters.stand !== 'all') {
					followFlighArr = this.followFlightList.filter((item) => {
						return item.meta.standDetail.isbridge === this.filters.stand
					})
				}
				if (this.filters.flightCode !== '') {
					condition['iataCarrier'] = this.filters.flightCode
				}
				if (this.filters.terminal !== 'all') {
					condition['terminal'] = this.filters.terminal
				}
				if (this.filters.agent !== 'all') {
					condition['generalagent'] = this.filters.agent
				}
				if (this.filters.depStatus !== 'all') {
					condition['flightStatus'] = this.filters.depStatus
				}
				if (this.filters.arrStatus !== 'all') {
					condition['flightStatus'] = this.filters.arrStatus
				}
				this.filterFlightList = this.dataFilter(condition, followFlighArr)
				this.checkDataEmpty(this.filterFlightList)
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 100,
				})
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
			deleteMsg () {
				this.filters.flightCode = ''
				// this.search()
			},
			flightClick (flight) {
				let msg = {
					flightId: flight.flightId,
					num: this.tabCurrent
				}
				uni.navigateTo({
					url: `/pages/flight/flight-message?flightId=${flight.flightId}`
				})
			},
			clickFilterBtn (key, val) {
				this.filters[key] = val
			},
			// 判断是否是出港，返回true false
			isArr (flight) {
				if (flight) {
					return flight.direction === 'A'
				} else {
					return false
				}
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
					}
				} else {
					return '-'
				}
			},
			// 左滑创建群聊
			groupChatClick (item, e) {
        console.log('item', item)
        if (e.index) {
          this.groupChatForm.channelName = item.iataCarrier + item.flight + '(' + dayjs(new Date()).format('DMMM') + ')'
          this.$refs.flightGroupChat.open(this.groupChatForm.channelName, this.userInfo.id, item)
        } else {
          this.cancelFollow(item.followId)
        }
      },
      // 取消关注
      cancelFollow (followId) {
        console.log('followId', followId)
        this.$loading('取消中...')
        flightApi.deleteFollowFlight(followId).then(res => {
        	if (res.status) {
        		this.getFollowFlight()
        		setTimeout(() => {
        			this.$message('取消关注')
        		}, 500)
        	} else {
        		this.$message('取消失败')
        	}
          uni.hideLoading()
        }).catch(err => {
        	uni.hideLoading()
        	this.$message('取消失败')
        })
      },
			formatDate (date) {
				if (date) {
					return dayjs(date).format('H:mm')
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
			},
			formatBoardTime (val) {
				if (val.meta.gateDetail) {
					if (val.meta.gateDetail.actualopen) {
						return dayjs(val.meta.gateDetail.actualopen).format('H:mm')
					} else if (val.meta.gateDetail.estimateopen) {
						return dayjs(val.meta.gateDetail.estimateopen).format('H:mm')
					} else if (val.meta.gateDetail.scheduleopen) {
						return dayjs(val.meta.gateDetail.scheduleopen).format('H:mm')
					} else {
						return '--:--'
					}
				} else {
					return '--:--'
				}
			}
		}
	}
</script>
<style lang="scss">
	.flight-layout {
		height: calc(100vh - var(--status-bar-height) - var(--status-bar-height) - 45rpx);
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
				padding-top: 5rpx;

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

		.flight-list {
			z-index: 5;
			// height: calc(100vh - var(--status-bar-height) - var(--status-bar-height) - 45rpx);
			margin-top: calc(var(--status-bar-height) + 92rpx);
			overflow-y: auto;
			width: 100%;

			.swipe-class {
				margin: 17rpx 18rpx 17rpx 18rpx;

				.item {
					border-radius: 7rpx;
					background: #FFFFFF;
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
				margin-top: calc((100vh - 200rpx)/2);
				text-align: center;

				text {
					color: #666666;
				}
			}
		}

		.drawerClass {

			// overflow-y: auto;
			.drawerTitle {
				height: 92rpx;
				line-height: 92rpx;
				background-color: #f5f5f5;

				text {
					padding-left: 20rpx;
					font-size: 35rpx;
					line-height: 29rpx;
					color: #8c8c8c;
				}
			}

			.airport-select {
				display: flex;
				justify-content: space-between;
				margin-top: 10rpx;
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

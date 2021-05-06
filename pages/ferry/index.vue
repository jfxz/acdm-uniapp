<template>
	<view class="ferry-layout">
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
				<text v-if="filterLinkedFlightSelectList.length>0">{{ `摆渡车视图(${this.filterLinkedFlightSelectList.length})`}}</text>
				<text v-else>{{ `摆渡车视图(0)`}}</text>
			</view>
			<view class="nav-handle-right">
				<view class="handle-type">
				</view>
				<view class="handle-type">
				</view>
				<view class="handle-type" v-if="filterStatus">
					<image src="../../static/ic_filter_red.png" @click="openDrawer" style="width: 45rpx;height:48rpx;bottom: 5rpx;position: relative;"></image>
				</view>
				<view class="handle-type" v-if="!filterStatus">
					<image src="../../static/ic_filter.png" @click="openDrawer"></image>
				</view>
			</view>
		</view>
		<view class="tabbar">
			<view class="tabbar-content" style="width: 3%;">
			</view>
			<view class="tabbar-content" style="width: 10%;">
				{{'进港'}}
			</view>
			<view class="tabbar-content" style="width: 3%;">
			</view>
			<view class="tabbar-content" style="width: 10%;">
				{{'出港'}}
			</view>
			<view class="tabbar-content" style="width: 8%;">
				{{'机型'}}
			</view>
			<view class="tabbar-content" style="width: 8%;">
				{{'机号'}}
			</view>
			<view class="tabbar-content" style="width: 8%;">
				{{'机位'}}
			</view>
			<view class="tabbar-content">
				<view class="tabbar-content-top">
					{{'计划(进)'}}
				</view>
				<view class="tabbar-content-bottom">
					{{'预计(进)'}}
				</view>
			</view>
			<view class="tabbar-content">
				<view class="tabbar-content-top">
					{{'计划(出)'}}
				</view>
				<view class="tabbar-content-bottom">
					{{'实际(出)'}}
				</view>
			</view>
			<view class="tabbar-content">
				{{'登机口'}}
			</view>
			<view class="tabbar-content">
				{{'登机时间'}}
			</view>
			<view class="tabbar-content">
				{{'出港进展'}}
			</view>
		</view>
		<view class="flight-content" v-if="!baseStatus">
			<view class="item" v-for="(item,index) in showList" @tap="flightClick(item)">
				<view class="flight-tag" style="width: 3%;padding-left: 15rpx;">
					<view class="cu-avatar sm round" style="position: relative;top:0rpx;width: 32rpx;height: 32rpx;margin: auto;"
					 :style="{background:vipTagStyle(item.arrVipTag)}" v-if="item.arrVipTag">{{vipTagText(item.arrVipTag)}}</view>
				</view>
				<view class="flight-content-list" style="width: 10%;">
					{{item.arrIataCarrier || ''}}{{item.arrFlight|| ''}}
				</view>
				<view class="flight-tag" style="width: 3%;padding-left: 15rpx;">
					<view class="cu-avatar sm round" style="position: relative;top:0rpx;width: 32rpx;height: 32rpx;margin: auto 0;"
					 :style="{background:vipTagStyle(item.depVipTag)}" v-if="item.depVipTag">{{vipTagText(item.depVipTag)}}</view>
				</view>
				<view class="flight-content-list" style="width: 10%;">
					{{item.depIataCarrier || ''}}{{item.depFlight || ''}}
				</view>
				<view class="flight-content-list" style="width: 8%;">
					{{item.aircraftType}}
				</view>
				<view class="flight-content-list" style="width: 8%;">
					{{item.registration}}
				</view>
				<view class="flight-content-list" style="width: 8%;">
					{{item.stand}}
				</view>
				<view class="flight-content-list">
					<view class="flight-content-top">
						{{formatDate(item.scheduleArrTime)}}
					</view>
					<view class="flight-content-bottom">
						<text style="color: #16AB60;" v-if="item.actualArrTime">{{formatDate(item.actualArrTime)}}</text>
						<text style="color: #007AFF;" v-else>{{formatDate(item.estimateArrTime)||'--'}}</text>
					</view>
				</view>
				<view class="flight-content-list">
					<view class="flight-content-top">
						{{formatDate(item.scheduleDepTime)}}
					</view>
					<view class="flight-content-bottom" style="color: #16AB60;">
						{{formatDate(item.actualDepTime)}}
					</view>
				</view>
				<view class="flight-content-list">
					{{item.gate}}
				</view>
				<view class="flight-content-list">
					{{formatDetail(item.meta)}}
				</view>
				<view class="flight-content-list" :style="statusStyle(item.depFlightStatus)">
					{{formatStatus(item.depFlightStatus)}}
				</view>
				<!-- 	<view class="flight-content-list">
					{{formatStatus(item.depFlightStatus)}}
				</view> -->
			</view>
		</view>

		<view class="base-select" v-if="baseStatus">
			<u-loading mode="flower" size="100" :show="baseStatus"></u-loading>
		</view>
		<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" v-if="showList.length>7&&!baseStatus"></u-loadmore>

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
				<view class="selectButton">
					<view class="airport" v-if="airportCode[0].icaocode!=='ZSFZ'">
						<text>{{'航站楼'}}</text>
					</view>
					<view class="btnClass" v-if="airportCode[0].icaocode!=='ZSFZ'">
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
				</view>
				<view class="bottom">
					<view class="reset">
						<u-button type="primary" @tap="reset" width="135">重置</u-button>
					</view>
					<view class="select">
						<u-button type="primary" @tap="selectFligtData" width="135">确定</u-button>
					</view>
				</view>
			</view>
		</uni-drawer>
	</view>
</template>

<script>
	import {
		deepCopy
	} from '../../common/util/util.js'
	import dayjs from '../../common/util/dayjs.min.js'
	import {
		FLIGHTSTATUS
	} from './statusDic.js'
	import {
		mapGetters
	} from 'vuex'
	import uniDrawer from "@/components/uni-drawer/uni-drawer.vue"
	import {
		getFlightListByLinked
	} from "@/api/flight/index.js"
	import {
		getFlightStatus,
		getIrrCode,
		getVipCode,
	} from '../../api/dic/index.js'
	import {
		debounce
	} from '../../common/util/util.js'
	export default {
		components: {
			uniDrawer
		},
		data() {
			return {
				isFirstMes: false,
				filterStatus: false,
				filterFlightList: false,
				flightLinkedList: [],
				filterLinkedFlightSelectList: [],
				pageCount: 1,
				pageSize: 50,
				showList: [],
				baseStatus: false,
				ferryTimer: null,
				filters: {
					flightCode: '',
					terminal: 'all',
					stand: 'all'
				},
				flitersNow: {
					flightCode: '',
					terminal: 'all',
					stand: 'all'
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
				drawerWidth: 250,
				baseVipCodeList: this.$store.getters.remoteDic.BASE_VIP_CODE,
				baseFlightStatusList: this.$store.getters.remoteDic.BASE_FLIGHT_STATUS,
				showLoadmore: false,
				status: 'loading',
				iconType: 'flower',
				loadText: {
					loading: '努力加载中',
					nomore: '实在没有了'
				}
			}
		},
		computed: {
			...mapGetters(['user', 'allUserMsg', 'flight']),
			listenFerrymessageFlightId() {
				return this.flight.messageFlightId
			}
		},
		// watch: {
		// 	listenFerrymessageFlightId: function(old, newd) {
		// 		if (old !== newd) {
		// 			this.flightMessageChange()
		// 			console.log('监听中老值', old)
		// 			console.log('监听中新值', newd)
		// 		}
		// 	}
		// },
		onLoad() {
			this.airportCode = uni.getStorageSync('userAirport')
			this.$loading()
			this.getFlightList('select')
			this.$store.dispatch('setAllFlight')
		},
		onShow() {
			clearInterval(this.ferryTimer)
			// #ifdef APP-PLUS
			plus.screen.lockOrientation('landscape-primary');
			plus.device.setWakelock(true);
			// #endif
			setTimeout(() => {
				this.ferryTimer = setInterval(() => {
					this.getFlightList('resersh')
					this.$store.dispatch('setAllFlight') //定时同步刷新详情中数据
					console.log('拼接航班定时刷新')
				}, 1000 * 60)
			}, 100)
		},
		onHide() {
			clearInterval(this.ferryTimer)
		},
		onUnload() {
      plus.device.setWakelock(false)
			if (this.ferryTimer) {
				clearInterval(this.ferryTimer);
				this.ferryTimer = null;
			}
			console.log('隐藏onUnload')
		},
		onPullDownRefresh() {
			getFlightListByLinked({
				airportCode: this.airportCode[0].icaocode
			}).then(res => {
				if (res.status) {
					this.flightLinkedList = res.data
					this.filterLinkedFlightSelectList = res.data
					this.getSelectStatus('resersh')
					uni.stopPullDownRefresh();
					this.$message('刷新成功')
				} else {
					uni.stopPullDownRefresh();
					this.$message('刷新失败')
				}
			}).catch(() => {
				uni.stopPullDownRefresh();
				this.$message('刷新失败')
			})
			this.$store.dispatch('setAllFlight') //定时同步刷新详情中数据
		},
		onReachBottom() {
			this.conputeList()
		},
		methods: {
			// mq监听刷新
			flightMessageChange: debounce(function() {
				this.getFlightList('resersh')
				this.$store.dispatch('setAllFlight') //mq刷新同步详情中数据
				console.log('执行拼接航班刷新mq刷新')
			}, 1000 * 1),
			// 获取数据
			getFlightList(type) {
				getFlightListByLinked({
					airportCode: this.airportCode[0].icaocode
				}).then(res => {
					if (res.status) {
						this.flightLinkedList = res.data
						this.filterLinkedFlightSelectList = res.data
						this.getSelectStatus(type)
						setTimeout(() => {
							uni.hideLoading()
							this.showLoadmore = true
						}, 500)
					}
				})
			},
			//初始化筛选
			conputeList() {
				let diff = (this.pageCount + 1) * this.pageSize
				let divisionList = this.filterLinkedFlightSelectList.slice(this.pageCount * this.pageSize, diff)
				this.showList = [...this.showList, ...divisionList]
				this.pageCount++
				if (divisionList < this.pageSize) {
					this.status = 'nomore'
				}
				console.log('进入')
			},
			//获取筛选状态
			getSelectStatus(type) {
				if (uni.getStorageSync('ferryFlightSelectStatus') === 'YES') {
					this.filters = JSON.parse(uni.getStorageSync('ferryflightListSelData'))
					this.selectFligtData(type)
				} else {
					this.showList = this.filterLinkedFlightSelectList.slice(0, this.pageCount * this.pageSize)
				}
			},
			selectFligtData(type) {
				this.flitersNow = deepCopy(this.filters)
				if (type !== 'resersh') {
					this.baseStatus = true
					this.pageCount = 1
					this.showList = []
					setTimeout(() => {
						uni.pageScrollTo({
							scrollTop: 0,
							duration: 10
						});
					}, 100)
				}
				let flightArr = deepCopy(this.flightLinkedList)
				if (this.flitersNow.stand !== 'all') {
					flightArr = this.flightLinkedList.filter((item, index) => {
						if (item.meta && item.meta.standDetail && item.meta.standDetail.isbridge && item.meta.standDetail.isbridge ===
							this.flitersNow.stand) {
							return item
						}
					})
				}
				if (this.flitersNow.terminal !== 'all') {
					flightArr = flightArr.filter((item, index) => {
						if (item.terminal && item.terminal === this.flitersNow.terminal) {
							return item
						}
					})
				}
				if (this.flitersNow.flightCode !== '') {
					let flightCode = this.flitersNow.flightCode.toUpperCase().trim()
					flightArr = flightArr.filter((item, index) => {
						if ((item.arrIataCarrier && item.arrIataCarrier === flightCode) || (item.depIataCarrier && item.depIataCarrier ===
								flightCode)) {
							return item
						}
					})
				}
				this.filterLinkedFlightSelectList = deepCopy(flightArr)
				this.showList = this.filterLinkedFlightSelectList.slice(0, this.pageCount * this.pageSize)
				console.log(type, this.showList.length, this.filterLinkedFlightSelectList.length)
				if (this.filterLinkedFlightSelectList < this.pageSize * this.pageCount) {
					this.status = 'nomore'
				} else {
					this.status = 'loading'
				}
				if (type !== 'resersh') {
					this.selectConditon()
					console.log('标志')
				}
				this.$forceUpdate()
			},
			//筛选条件处理
			selectConditon() {
				//判断是否存在筛选条件
				if (JSON.stringify(this.conditionFilter()) !== '{}') {
					uni.setStorageSync('ferryFlightSelectStatus', 'YES')
					this.filterStatus = true
				} else {
					uni.setStorageSync('ferryFlightSelectStatus', 'NO')
					this.filterStatus = false
				}
				uni.removeStorageSync('ferryflightListSelData')
				uni.setStorageSync('ferryflightListSelData', JSON.stringify(this.flitersNow))
				this.$refs['uniDrawer'].close()
				setTimeout(() => {
					this.baseStatus = false
				}, 500)
			},
			// 筛选条件赋值,判断是否有筛选条件
			conditionFilter() {
				let condition = {}
				if (this.flitersNow.flightCode !== '') {
					condition['iataCarrier'] = this.flitersNow.flightCode
				}
				if (this.flitersNow.terminal !== 'all' && this.airportCode[0].icaocode !== 'ZSFZ') {
					condition['terminal'] = this.flitersNow.terminal
				}
				if (this.flitersNow.stand !== 'all') {
					condition['stand'] = this.flitersNow.stand
				}
				return condition
			},
			//重置
			reset() {
				this.$refs.uniDrawer.close()
				this.$nextTick(res => {
					this.filters.flightCode = ''
					this.filters.terminal = 'all'
					this.filters.stand = 'all'
					this.flitersNow.flightCode = ''
					this.flitersNow.terminal = 'all'
					this.flitersNow.stand = 'all'
					this.selectFligtData()
				})
			},
			//点击航班跳转详情
			flightClick(flight) {
				// this.$loading()
				let flightId = ''
				if (flight.depFlightId) {
					flightId = flight.depFlightId
				} else if (flight.arrFlightId) {
					flightId = flight.arrFlightId
				}
				if (!this.isFirstMes) {
					this.isFirstMes = true
					console.log('First1111')
					uni.navigateTo({
						url: `./tempJump?flightId=${flightId}&route=ferry`
					})
				} else {
					// #ifdef APP-PLUS
					plus.screen.unlockOrientation()
					plus.screen.lockOrientation('portrait-primary')
					// #endif
					setTimeout(() => {
						// uni.navigateTo({
						// 	url: `./ferry-flight-message?flightId=${flightId}`
						// })
						uni.navigateTo({
							url: `../flight/flight-message?flightId=${flightId}`
						})
					}, 100)
				}
			},
			// 返回
			openAcdmHome() {
				uni.reLaunch({
					url: './tempJump'
				})
			},
			// 打开右侧抽屉
			openDrawer() {
				this.$refs['uniDrawer'].open()
			},
			// 关闭筛选清空数据
			getOpenStatus(flag) {
				this.showUDrawer = flag
				if (!this.showUDrawer) {
					this.filters = deepCopy(this.flitersNow)
				}
			},
			// 右侧抽屉 input 清除内容
			deleteMsg() {
				this.filters.flightCode = ''
			},
			// 筛选框点击
			clickFilterBtn(key, val) {
				this.filters[key] = val
			},
			//进港状态样式
			statusStyle(type) {
				if (type) {
					for (let key in FLIGHTSTATUS) {
						if (key === type) {
							return {
								color: FLIGHTSTATUS[key]
							}
						}
					}
					return {
						color: '#c6c6c6'
					}
				} else {
					return {
						color: '#c6c6c6'
					}

				}
			},
			//格式化时间
			formatDate(date) {
				if (date) {
					return dayjs(date).format('HH:mm')
				} else {
					return '--'
				}
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
			// vip图标判断
			vipTagStyle(val) {
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
			formatStatus(status) {
				if (status && this.baseFlightStatusList) {
					let match = this.baseFlightStatusList.find(item => item.statusCode === status)
					if (match) {
						return match.description
					} else {
						return ''
					}
				} else {
					return ''
				}
			},
			formatDetail(val) {
				if (val) {
					if (val.gateDetail) {
						if (val.gateDetail.actualopen) {
							return dayjs(val.gateDetail.actualopen).format('HH:mm')
						} else if (val.gateDetail.estimateopen) {
							return dayjs(val.gateDetail.estimateopen).format('HH:mm')
						} else if (val.gateDetail.scheduleopen) {
							return dayjs(val.gateDetail.scheduleopen).format('HH:mm')
						} else {
							return '--'
						}
					} else {
						return '--'
					}
				} else {
					return '--'
				}
			}
		}
	}
</script>

<style lang="scss">
	.ferry-layout {
		.navbar {
			display: flex;
			justify-content: space-between;
			height: calc(var(--status-bar-height) + 65rpx);
			padding-top: calc(var(--status-bar-height) + 10rpx);
			background: #1891ff;
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

		.tabbar {
			z-index: 10;
			display: flex;
			justify-content: space-between;
			height: 80rpx;
			line-height: 80rpx;
			position: fixed;
			top: 0;
			border-bottom: 1rpx solid #FFFFFF;
			background-color: #13c8ff;
			width: 100%;
			margin-top: calc(var(--status-bar-height) + 65rpx);

			.tabbar-content,
				{
				text-align: center;
				width: 10%;
				color: #ffffff;
				display: flex;
				flex-direction: column;

				.tabbar-content-top,
				.tabbar-content-bottom {
					height: 40rpx;
					line-height: 40rpx;
					width: 100%;
					font-size: 22rpx;
				}
			}
		}

		.flight-content {
			margin-top: calc(var(--status-bar-height) + 140rpx);
			width: 100%;

			.item {
				display: flex;
				justify-content: space-between;
				height: 90rpx;
				line-height: 90rpx;
				border-bottom: 1rpx solid #f1f1f1;
				background-color: #FFFFFF;

				.flight-tag {
					display: flex;
					justify-content: center;
					text-align: center;
					font-size: 25rpx;
					color: #000000;
				}

				.flight-content-list {
					text-align: center;
					width: 10%;
					color: #000000;
					font-size: 25rpx;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;

					.flight-content-top,
					.flight-content-bottom {
						height: 40rpx;
						line-height: 40rpx;
						width: 100%;
						font-size: 22rpx;
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
					width: 66%;
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

		.base-select {
			// background-color: #cdcd4f;
			margin-top: calc((100vh)/2);
			text-align: center;
		}
	}
</style>

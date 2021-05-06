<template>
	<view class="home-layout">
		<view :class="['navbar', {isTablet: isTablet}]">
			<view class="nav-handle-left">
				<view class="handle-type">
					<image src="../../static/my.png" @tap="openMine"></image>
				</view>
				<view class="handle-type"></view>
				<view class="handle-type"></view>
			</view>
			<view class="nav-title">
				<text>{{ '机场运行协同' }}</text>
			</view>
			<view class="nav-handle-right"></view>
		</view>
		<view class="overViewLoadFail" v-if="overViewLoadFail" @tap="getData">加载失败，请点击重新加载</view>
		<view class="home-top" v-if="!overViewLoadFail">
			<view class="plan-title">
				<view class="label">当日计划航班</view>
				<view class="value">
					<text class="sorties-num">{{ overviewData.flightNum || '' }}</text>
					<text class="sorties-label">架</text>
				</view>
			</view>
			<view class="plan-flight">
				<view class="implement-flight">
					<view class="implement-title">已执行航班</view>
					<view class="implement-sorties">
						<text class="num">{{ overviewData.executed || '' }}</text>
						<text class="label">架</text>
					</view>
					<view class="implement-agent">
						<view class="agent-label">机场代理</view>
						<view class="agent-value">{{ overviewData.agentExecuted ? overviewData.agentExecuted + overviewData.internationalAgentExecuted : '' }}</view>
					</view>
				</view>

				<view class="implement-flight">
					<view class="implement-title">未执行航班</view>
					<view class="implement-sorties">
						<text class="num">{{ overviewData.flightNum ? overviewData.flightNum - overviewData.executed - cnlTotal : '' }}</text>
						<text class="label">架</text>
					</view>
					<view class="implement-agent">
						<view class="agent-label">机场代理</view>
						<view class="agent-value">
							{{
                overviewData.agent
                  ? overviewData.agent +
                    overviewData.internationalAgent -
                    overviewData.internationalAgentCnl -
                    overviewData.agentCnl -
                    overviewData.internationalAgentExecuted -
                    overviewData.agentExecuted
                  : ''
              }}
						</view>
					</view>
				</view>

				<view class="implement-flight last">
					<view class="last-row">
						<text class="last-label">进港：</text>
						<text class="last-value">
							{{ overviewData.meta ? overviewData.meta.arrFlight : '' }}
						</text>
						<text class="company">架</text>
					</view>
					<view class="last-row">
						<text class="last-label">出港：</text>
						<text class="last-value">
							{{ overviewData.meta ? overviewData.meta.depFlight : '' }}
						</text>
						<text class="company">架</text>
					</view>
					<view class="last-row">
						<text class="last-label">旅客总人数：</text>
						<text class="last-value">
							{{ overviewData.meta ? overviewData.meta.passenger : '' }}
						</text>
					</view>
				</view>

			</view>
			<view class="paln-overview">
				<view class="overview-title">放行概览</view>
				<view class="overview-contend">
					<view class="item item1">
						<view class="overview-label">日始发起飞正常率</view>
						<view class="overview-value" :style="{ color: judgeColor(computeDayMessage) }">
							<text class="value">{{ computeDayMessage }}</text>
							<text class="percent">%</text>
						</view>
					</view>
					<view class="item item2">
						<view class="overview-label">日放行率</view>
						<view class="overview-value" :style="{ color: judgeColor(computePassRate) }">
							<text class="value">{{ computePassRate }}</text>
							<text class="percent">%</text>
							<image :src="`../../static/${flag}.png`" mode="aspectFit"></image>
						</view>
					</view>
					<view class="item item3">
						<view class="overview-label">日起飞正常率</view>
						<view class="overview-value" :style="{ color: judgeColor(computeDepRate) }">
							<text class="value">{{ computeDepRate }}</text>
							<text class="percent">%</text>
						</view>
					</view>
					<view class="item item1">
						<view class="overview-label">日加权正常率</view>
						<view class="overview-value" :style="{ color: judgeColor(computeDayComprehensiveRate) }">
							<text class="value">{{ computeDayComprehensiveRate }}</text>
							<text class="percent">%</text>
						</view>
					</view>
					<view class="item item2">
						<view class="overview-label">当日放行目标</view>
						<view class="overview-value" style="color: #333333;">
							<text v-if="target.day.mode === 1">
								<text class="value">{{ target.day.num }}</text>
								<text class="percent">架</text>
							</text>
							<text v-if="target.day.mode === 0" style="color: #25c489;"><text class="value">已达成</text></text>
							<text v-if="target.day.mode === 2" style="color: #e72323;"><text class="value" style="font-size: 30rpx;">当日无法达标</text></text>
						</view>
					</view>
					<view class="item item3">
						<view class="overview-label">每日放行目标</view>
						<view class="overview-value" style="color: #333333;">
							<text v-if="target.month.mode === 1">
								<text class="value">{{ target.month.num }}</text>
								<text class="percent">架</text>
							</text>
							<text v-if="target.month.mode === 0" style="color: #25c489;"><text class="value">已达成</text></text>
							<text v-if="target.month.mode === 2" style="color: #e72323;"><text class="value" style="font-size: 30rpx;">当月无法达标</text></text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="home-mid">
			<view class="mid-title">
				<view class="title-label">机场公告</view>
				<view class="title-time">{{ time }}</view>
			</view>
			<view class="loadFail" v-if="loadFail" @tap="getData">加载失败，请点击重新加载</view>
			<swiper v-if="!loadFail" class="mid-contend" :display-multiple-items="2" :autoplay="true" :circular="true" :vertical="true"
			 :interval="2000">
				<swiper-item v-for="(item, index) in flowList" :key="index">{{ conver(item) }}</swiper-item>
			</swiper>
		</view>
		<!-- :style="{height: bottomHeight + 'px'}" -->
		<view class="home-bottom" :style="{ height: bottomHeight + 'px' }">
			<view class="item" v-for="(item, index) in items" @tap="jump(item)" :Key="index">
				<view class="item-img">
					<image :src="item.url" mode="aspectFit"></image>
				</view>
				<!-- //摆渡车图标偏小 适当增大 -->
				<!-- <view class="item-img" v-else>
					<image :src="item.url" mode="aspectFit" style="width: 85rpx;height: 100rpx;"></image>
				</view> -->
				<view class="item-lable">{{ item.label }}</view>
			</view>
		</view>

		<tui-modal :show="iosModal" :custom="true">
			<view class="tui-modal-custom">
				<view class="updata">
					<image src="../../static/fail.png" mode="aspectFit"></image>
					<view class="updata-title">
						{{`更新摘要(${newCurrenVersion})`}}
					</view>
				</view>
				<view class="updata-contend">
					<text class="updateInfo">
						{{buildUpdateDescription}}
					</text>
				</view>
				<view class="updata-btn">
					<u-button type="info" @click="cancel">取消</u-button>
					<u-button type="error" @click="handleClick">立即更新</u-button>
				</view>
			</view>
		</tui-modal>

		<tui-modal :show="modal" @click="handleClick" title="提示" content="当前有新版本,是否立即下载?"></tui-modal>
	</view>
</template>

<script>
	import tuiModal from '@/components/modal.vue'
	import {
		getVersion
	} from '../../api/version/index.js'
	import dayjs from '../../common/util/dayjs.min.js'
	import vpnMix from '@/common/mixin/vpn-login-mixin.js'
	import {
		getArrAndDepFlight
	} from '../../api/home/flight-overview/index.js'
	import {
		getPassRate,
		getEstimateRateOfDay,
		getEstimateRateOfMonth,
		getArrowData,
		getTarget
	} from '../../api/home/normal/index.js'
	import {
		getPermission
	} from '../../api/sign/index.js'
	import {
		getAirportNoticeClose,
		getAirportNoticeOther
	} from '../../api/dic/index.js'
	import stomp from '@/common/util/stomp-client.js'
	export default {
		components: {
			tuiModal
		},
		mixins: [vpnMix], // 使用mixin
		data () {
			return {
        isTablet: false,
				buildUpdateDescription: '',
				modal: false,
				iosModal: false,
				currenVersion: '',
				newCurrenVersion: '',
				bottomHeight: 0,
				flag: 'top',
				overViewLoadFail: false,
				target: {
					day: {
						mode: 1,
						num: 0
					},
					month: {
						mode: 1,
						num: 0
					}
				},
				passData: {},
				cnlTotal: 0,
				overviewData: {},
				loadFail: false,
				airportCode: '',
				timer: null,
				time: '',
				scrollTop: 0,
				items: [{
						label: '行李交接',
						url: '../../static/home-baggage.png',
						jumpUrl: 'flight'
					},
					{
						label: '货物交接',
						url: '../../static/home-goods.png',
						jumpUrl: 'cargo'
					},
					{
						label: '航班保障',
						url: '../../static/home-flight.png',
						jumpUrl: 'flight'
					},
					{
						label: '运行指标',
						url: '../../static/home-run.png',
						jumpUrl: 'acdmHome'
					},
					{
						label: '拖车视图',
						url: '../../static/home-trailer.png',
						jumpUrl: 'trailer'
					},
					{
						label: '引导车视图',
						url: '../../static/guide-car.png',
						jumpUrl: 'guideCar'
					},
					{
						label: '摆渡车视图',
						url: '../../static/ferry-car.png',
						jumpUrl: 'ferry'
					},
					{
						label: '服务签署',
						url: '../../static/service/service-sign.png',
						extra: 'service',
						jumpUrl: 'flight'
					}
				],
				flowList: []
			}
		},
		computed: {
			// 日始发起飞正常率
			computeDayMessage () {
				if (this.passData && this.passData.day_original_takeoff_rate) {
					return Number(Number(this.passData.day_original_takeoff_rate) * 100).toFixed(2)
				}
				return ''
			},
			// 日放行率
			computePassRate () {
				if (this.passData && this.passData.day_release_rate) {
					let day_release_rate = Number(Number(this.passData.day_release_rate) * 100).toFixed(2)
					getApp().globalData.day_release_rate = day_release_rate
					return day_release_rate
				}
				return ''
			},
			// 日起飞正常率
			computeDepRate () {
				if (this.passData && this.passData.day_takeoff_rate) {
					return Number(Number(this.passData.day_takeoff_rate) * 100).toFixed(2)
				}
				return ''
			},
			// 日加权
			computeDayComprehensiveRate () {
				if (this.passData && this.passData.day_complex_rate_rate) {
					return Number(Number(this.passData.day_complex_rate_rate) * 100).toFixed(2)
				}
				return ''
			}
		},
		beforeDestroy () {
			this.timer && clearInterval(this.timer)
		},
		mounted () {
      if (getApp().globalData.isTablet) {
        this.isTablet = true
      }
			var windowsHeight = uni.getSystemInfoSync().windowHeight
			let view = uni
				.createSelectorQuery()
				.in(this)
				.select('.home-bottom')
			view
				.boundingClientRect(data => {
					this.bottomHeight = windowsHeight - data.top - 10
				})
				.exec()
			this.time = dayjs().format('YYYY-MM-DD HH:mm')
			// clearInterval(this.timer)

			// let view = uni.createSelectorQuery().in(this).select(".home-mid")
			// view.boundingClientRect(data => {
			//   console.log(data)
			// 	this.bottomHeight = windowHeight - data.bottom - 25
			// }).exec()
		},
		onLoad (e) {
			uni.setStorageSync('failCount', 0)
			console.log('params', e.params)
			// 如果是登录 则直接调用vpn
			if (e.params === 'launch') {
				this.loginVPN()
			} else {
				this.getData()
				this.timer = setInterval(() => {
					this.getData('time')
				}, 60000)
			}
      if (e.params === 'login') {
      	this.checkVpn()
      }
		},
		onShow () {
			// #ifdef APP-PLUS
			plus.screen.lockOrientation('portrait-primary')
			// #endif
			if (uni.getStorageSync('fligtInterfaceMq')) {
				stomp.unsubscribe()
				console.log('取消订阅机场', uni.getStorageSync('fligtInterfaceMq'))
			}
		},
		methods: {
			cancel () {
				this.modal = false
				this.iosModal = false
				this.$message('您取消了更新')
			},
			judgeColor (value) {
				let target = 80
				if (value < 80) {
					return '#eb6262'
				}
				return '#52c810'
			},
			// 统一获取所有数据
			getData (flag) {
				getPermission().then(res => {
					if (res.status) {
						uni.setStorageSync('serviceAuth', res.data)
					}
				})
				var that = this
				// #ifdef APP-PLUS
				if (flag !== 'time') {
					plus.runtime.getProperty(plus.runtime.appid, function (inf) {
						that.currenVersion = inf.version
						that.judgeVersion()
						console.log('currenVersion', that.currenVersion)
					})
				}
				// #endif
				this.time = dayjs().format('YYYY-MM-DD HH:mm')
				let airportCode = uni.getStorageSync('userAirport')
				this.airportCode = airportCode && airportCode[0] ? airportCode[0].icaocode : ''
				this.getNoticeData(this.airportCode)
				this.getOverview(this.airportCode)
				this.getPass(this.airportCode)
				this.getTargetData(this.airportCode)
			},
			// 获取日和月目标


			// 日放行目标
			getTargetData (airportCode) {
				let para = {
					airportCode: airportCode
				}
				getTarget(para)
					.then(res => {
						if (res.status) {
							this.overViewLoadFail = false
							if (res.data.dayReleaseNormalTarget.flag === 0) {
								this.target.day = {
									mode: 0,
									num: '已达成'
								}
							} else if (res.data.dayReleaseNormalTarget.flag === 1) {
								this.target.day = {
									mode: 1,
									num: res.data.dayReleaseNormalTarget.estNormal
								}
							} else {
								this.target.day = {
									mode: 2,
									num: '当日无法达标'
								}
							}
							// 月放行目标

							if (res.data.monthReleaseNormalTarget.flag === 0) {
								this.target.month = {
									mode: 0,
									num: '已达成'
								}
							} else if (res.data.monthReleaseNormalTarget.flag === 1) {
								this.target.month = {
									mode: 1,
									num: res.data.monthReleaseNormalTarget.estNormal
								}
							} else {
								this.target.month = {
									mode: 2,
									num: '当月无法达标'
								}
							}
						}
					}).catch(() => {
						this.overViewLoadFail = true
					})
			},
			// 获取放行概述数据
			getPass (airportCode) {
				let para = {
					airportCode: airportCode
				}
				getPassRate(para)
					.then(res => {
						if (res.status) {
							// console.log('getPassRate1111111', res.data)
							this.overViewLoadFail = false
							this.passData = res.data
							getArrowData(para)
								.then(res2 => {
									if (res2.status) {
										this.overViewLoadFail = false
										let value = Number((res.data['day_release_rate'] * 100).toFixed(2))
										let forecastPassNormalRate = Number((res.data['forecastPassNormalRate'] * 100).toFixed(2))
										if (forecastPassNormalRate > value) {
											this.flag = 'top'
										} else if (forecastPassNormalRate === value) {
											this.flag = 'equal'
										} else {
											this.flag = 'down'
										}
										console.log('flag', this.flag)
									}
								})
								.catch(() => {
									this.overViewLoadFail = true
								})
						}
					})
					.catch(() => {
						this.overViewLoadFail = true
					})
			},
			// 获取计划航班数据
			getOverview (airportCode) {
				let para = {
					airportCode: airportCode
				}
				getArrAndDepFlight(para)
					.then(res => {
						if (res.status) {
							this.overViewLoadFail = false
							console.log('overviewData', res.data)
							this.overviewData = res.data
							this.cnlTotal = parseInt(this.overviewData.cnlFlightTaskCount) + parseInt(this.overviewData.cnlNoFlightTaskCount)
						}
					})
					.catch(() => {
						this.overViewLoadFail = true
					})
			},
			getNoticeData (airportCode) {
				let ajaxs = [
					new Promise((resolve, reject) => {
						getAirportNoticeClose({
								airportCode: airportCode
							})
							.then(res => {
								resolve(res.data)
							})
							.catch(e => {
								reject(e)
							})
					}),
					new Promise((resolve, reject) => {
						getAirportNoticeOther({
								airportCode: airportCode,
								type: 'other'
							})
							.then(res => {
								resolve(res.data)
							})
							.catch(e => {
								reject(e)
							})
					})
				]
				Promise.all(ajaxs)
					.then(res => {
						this.flowList = res[0].concat(res[1])
						this.loadFail = false
					})
					.catch(() => {
						this.loadFail = true
					})
			},
			initDate (date) {
				let arr = date.split('-')
				return `${arr[0]}年${arr[1]}月${arr[2]}日`
			},
			initTime (time) {
				let h = time.substring(0, 2)
				let m = time.substring(2)
				return h + ':' + m
			},
			conver (msg) {
				let year = this.initDate(msg.date)
				let beginTime = this.initTime(msg.beginTime)
				let endTime = this.initTime(msg.endTime)
				if (msg.type === 'airportClose') {
					if (msg.remark) {
						return `${year}${beginTime}-${endTime}机场由于${msg.remark}关闭`
					}
					return `${year}${beginTime}-${endTime}机场关闭`
				} else {
					return `${year}, ${beginTime}-${endTime}, ${msg.remark}`
				}
			},
			openMine () {
				uni.reLaunch({
					url: `../my/index`
				})
			},
			jump (item) {
				getApp().globalData.serviceFlag = false
				if (item.extra === 'service') {
					// 电子服务单入口判断 进入航司代表或者服务方界面
					let serviceAuth = uni.getStorageSync('serviceAuth')
					if (serviceAuth !== '0') {
						this.$message('当前角色权限不足')
					} else if (serviceAuth === '0') {
						uni.reLaunch({
							url: `../e-service/airline`
						})
					}
					return
				}
				if (item.label === '行李交接') {
					this.$message('暂未开放')
					return
				} else if (item.jumpUrl === 'trailer') {
          // #ifdef APP-PLUS
          plus.screen.unlockOrientation()
          // #endif
					uni.reLaunch({
						url: `../${item.jumpUrl}/index`
					})
					return
				} else if (item.jumpUrl === 'ferry') {
					// #ifdef APP-PLUS
					plus.screen.lockOrientation('landscape-primary')
					// #endif
					setTimeout(() => {
						uni.reLaunch({
							url: `../${item.jumpUrl}/index`
						})
					}, 100)
				} else {
					console.log(item.jumpUrl)
					uni.reLaunch({
						url: `../${item.jumpUrl}/index`
					})
				}
			},
			handleClick (e) {
				if (uni.getSystemInfoSync().platform === 'ios') {
					this.iosModal = false
					plus.runtime.openURL('https://www.pgyer.com/DFVr')
					return
				}
				console.log('index', e.index)
				console.log('this', this)
				let index = e.index
				if (index === 1) {
					uni.navigateTo({
						url: `/pages/login/update?newCurrenVersion=${this.newCurrenVersion}`
					})
				} else {
					this.$message('您取消了更新')
				}
				this.modal = false
			},
			judgeVersion () {
				let appKey = '6bfa7b4a656a9a1c27bc9d6e5024d266'
				if (uni.getSystemInfoSync().platform === 'ios') {
					appKey = 'e96a95104909b65c72696183f3bab89b'
				}
        // let appKey = '3e413f2213686295d7fa378d1e5960e4'
        // if (uni.getSystemInfoSync().platform === 'ios') {
        //   appKey = 'f0078cddc0442a39709990da236ae6a9'
        // }
				let para = {
					_api_key: '85244a596b323908ea22e8a7d46ab1af',
          // _api_key: '10d385b2e31a02249a3ffc11d51027c9',
					appKey: appKey
				}
				getVersion(para).then(res => {
					console.log(33, res)
					this.newCurrenVersion = res.data.buildVersion
					console.log(222, this.newCurrenVersion, this.currenVersion)
					if (this.newCurrenVersion !== this.currenVersion) {
						getApp().globalData.buildUpdateDescription = res.data.buildUpdateDescription
						this.buildUpdateDescription = res.data.buildUpdateDescription
						if (uni.getSystemInfoSync().platform === 'ios') {
							this.iosModal = true
						} else {
							this.modal = true
						}
					}
				})
			},
			getWeather (location) {
				uni.request({
					url: 'http://wthrcdn.etouch.cn/weather_mini?city=' + location,
					success: res => {
						console.log('天气')
						console.log(res.data)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.home-layout {
		padding: 17rpx;
		overflow-x: hidden;

		.updata-btn {
			display: flex;
			justify-content: space-around;
			margin-top: 30rpx;

			.u-btn {
				width: 48%;
			}
		}

		.updata {
			image {
				width: 40rpx;
				height: 40rpx;
			}

			display: flex;
			justify-content: center;

			.updata-title {
				margin-left: 20rpx;
				font-size: 35rpx;
				font-weight: bold;
				line-height: 40rpx;
			}

			margin-bottom: 30rpx;
		}

		.updata-contend {
			display: flex;
			align-items: center;
		}

		.updateInfo {
			font-size: 28upx;
			color: #7E7E83;
			// padding: 0 80upx;
		}

		.navbar {
			display: flex;
			justify-content: space-between;
			height: calc(var(--status-bar-height) + 45px);
			background: #1891ff;
			padding-top: calc(var(--status-bar-height) + 25rpx);
			width: 100%;
			z-index: 10;
			position: fixed;
			top: 0;
			left: 0;
			text-align: center;
      &.isTablet {
        padding-top: calc(var(--status-bar-height) + 10rpx);
      }
			.nav-handle-left {
				display: flex;
				justify-content: space-around;
				width: 30%;
				padding-top: 2rpx;

				.handle-type {
					position: relative;
					bottom: 10rpx;

					image {
						width: 55rpx;
						height: 55rpx;
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
				width: 30%;
			}
		}

		.home-bottom {
			background: #ffffff;
			border-radius: 14rpx;
			// display: grid;
			// grid-template-columns: repeat(3, 33.33%);
			// grid-template-rows:repeat(2, 50%);
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			min-height: 450rpx;

			.item {
				width: 33%;
				text-align: center;

				.item-lable {
					font-size: 25rpx;
					letter-spacing: 1rpx;
					color: #595959;
				}

				.item-img {
					margin-left: 10rpx;

					image {
						width: 69rpx;
						height: 83rpx;
					}
				}
			}
		}

		.home-mid {
			margin: 24rpx 0;
			padding: 30rpx 30rpx;
			background: #ffffff;
			height: 240rpx;
			border-radius: 14rpx;

			.loadFail {
				line-height: 120rpx;
				text-align: center;
			}

			.mid-title {
				display: flex;
				justify-content: space-between;

				.title-label {
					font-size: 29rpx;
					color: #1686ee;
				}

				.title-time {
					font-size: 25rpx;
					color: #a6a6a6;
				}
			}

			.mid-contend {
				font-size: 28rpx;
				letter-spacing: 1rpx;
				color: #595959;
				margin-top: 10rpx;
				height: 150rpx;
			}
		}

		.overViewLoadFail {
			background: #ffffff;
			height: 583rpx;
			margin-top: calc(var(--status-bar-height) + 45px);
			line-height: 583rpx;
			text-align: center;
		}

		.home-top {
			background: #ffffff;
			height: 583rpx;
			border-radius: 14rpx;
			margin-top: calc(var(--status-bar-height) + 45px);

			.paln-overview {
				padding: 10rpx 30rpx;

				.overview-contend {
					display: flex;
					flex-wrap: wrap;
					align-items: center;
					height: 250rpx;

					.overview-value {
						line-height: 80rpx;

						image {
							width: 24rpx;
							height: 28rpx;
							margin-right: -34rpx;
						}

						.value {
							font-size: 32rpx;
							font-weight: bold;
							letter-spacing: 2rpx;
						}

						.percent {
							font-size: 28rpx;
							letter-spacing: 1rpx;
							margin-left: 5rpx;
						}
					}

					.overview-label {
						font-size: 28rpx;
						line-height: 21rpx;
						letter-spacing: 1rpx;
						color: #999999;
					}

					.item {
						&.item1 {
							width: 37%;
							text-align: left;
						}

						&.item2 {
							width: 31%;
							text-align: center;
						}

						&.item3 {
							width: 31%;
							text-align: right;
						}
					}
				}

				.overview-title {
					height: 70rpx;
					font-size: 29rpx;
					font-weight: bold;
					line-height: 70rpx;
					letter-spacing: 1rpx;
					color: #595959;
				}
			}

			.plan-flight {
				display: flex;
				justify-content: flex-start;
				height: 170rpx;
				padding: 8rpx 30rpx;
				border-bottom: solid 1rpx #e5e5e5;

				.implement-flight {
					width: 34%;

					.last-label {
						color: #999999 !important;
						font-size: 24rpx;
					}

					.last-value {
						color: #333333;
						font-size: 26rpx;
						font-weight: bold;
					}

					.last-row {
						line-height: 48rpx;
					}

					.company {
						font-size: 24rpx;
						letter-spacing: 1rpx;
						margin-left: 14px;
					}

					.last {
						width: 32%;
					}

					.implement-agent {
						display: flex;
						justify-content: flex-start;
						line-height: 40rpx;
						margin-top: 10rpx;

						.agent-label {
							font-size: 21rpx;
							letter-spacing: 1rpx;
							color: #ffffff;
							background: #ffc21e;
							position: relative;
							top: -5px;
							border-radius: 10rpx;
							// width: 107rpx;
							padding: 0 10rpx;
							// right: 110%;
						}

						.agent-label::after {
							content: '';
							position: absolute;
							top: 50%;
							left: 100%;
							margin-top: -8rpx;
							border-width: 8rpx;
							border-style: solid;
							border-color: transparent transparent transparent #ffc21e;
						}

						.agent-value {
							font-size: 28rpx;
							letter-spacing: 1rpx;
							color: #f3b40b;
							position: relative;
							left: 20rpx;
							bottom: 10rpx;
						}
					}

					.implement-sorties {
						color: #333333;
						line-height: 40rpx;

						.num {
							font-size: 33rpx;
							font-weight: bold;
							letter-spacing: 2rpx;
						}

						.label {
							font-size: 25rpx;
							letter-spacing: 1rpx;
							margin-left: 15rpx;
						}
					}

					.implement-title {
						line-height: 50rpx;
						font-size: 25rpx;
						letter-spacing: 1rpx;
						color: #999999;
					}
				}
			}

			.plan-title {
				padding: 0 30rpx;
				line-height: 89rpx;
				display: flex;
				justify-content: space-between;
				height: 89rpx;
				background-image: linear-gradient(-90deg, #7296f3 0%, #81c7e3 100%);
				box-shadow: 0rpx 3rpx 6rpx 0rpx rgba(116, 157, 241, 0.36);
				border-radius: 14rpx 14rpx 0 0;

				.label {
					font-size: 29rpx;
					font-weight: bold;
					letter-spacing: 1rpx;
					color: #ffffff;
				}

				.value {
					color: #fefefe;

					.sorties-num {
						font-size: 42rpx;
						font-weight: bold;
						letter-spacing: 2rpx;
					}

					.sorties-label {
						margin-left: 15rpx;
						position: relative;
						bottom: 5rpx;
						font-size: 25rpx;
						font-weight: bold;
						letter-spacing: 1rpx;
					}
				}
			}
		}
	}
</style>

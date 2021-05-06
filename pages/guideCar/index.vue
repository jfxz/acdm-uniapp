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
				<text v-if="filterFlightList">{{ `引导车视图(${filterFlightList.length})`}}</text>
				<text v-else>{{ `引导车视图(0)`}}</text>
			</view>
			<view class="nav-handle-right">
				<view class="handle-type">
				</view>
				<view class="handle-type">
				</view>
				<view class="handle-type">
				</view>
			</view>
		</view>
		<view class="sub-section">
			<!-- <u-tabs :list="tabList" :current="tabCurrent" @change="tabChange" :isNewLineData="true" height="90" duration="0.1"></u-tabs> -->
		</view>
		<view class="flight-list">
			<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption" :fixed="false"
			 top="10" :down="downOption" height="100%" bottom="0" class="scroll" :resetText="updateText">
				<uni-swipe-action v-if="showPlayList">
					<uni-swipe-action-item :right-options="options" @click="groupChatClick(item)" v-for="(item, index) in showFlightList"
					 :key="index" class="swipe-class">
						<view @click="flightClick(item)" class="item">
							<view class="flight-status">
								<view class="flight">
									<view class="cu-avatar sm round" style="position: relative;bottom:5rpx" :style="{background:vipTagStyle(item.vipTag)}"
									 v-if="item.vipTag">{{vipTagText(item.vipTag)}}</view>
									{{item.iataCarrier || ''}}{{item.flight || ''}}
								</view>
								<view class="place">
									<!-- {{item.originCn}}-{{item.destinationCn}} -->
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
									<text v-if="isArr(item)">{{item.stand}}</text>
									<text v-else>{{item.stand}}/{{item.gate}}</text>
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
								<view class="time-type" v-if="isArr(item)">
								</view>
								<view class="time-type" v-if="!isArr(item)&&item.actualDepTime">
									<text class="value-time">{{formatDate(item.actualDepTime)}}</text>
									<text class="label-time">实际</text>
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
			</mescroll-body>
		</view>
		<flight-group-chat ref="flightGroupChat"></flight-group-chat>
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
		deepCopy
	} from '../../common/util/util.js'
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js"
	import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue"
	import {
		getFlightStatus,
		getIrrCode,
		getVipCode,
	} from '../../api/dic/index.js'
	import {
		creatGroup
	} from '@/api/imApi/admin.js'
	import flightGroupChat from "@/pages/flight/flight-group-chat.vue"
	export default {
		mixins: [MescrollMixin], // 使用mixin
		components: {
			uniSwipeAction,
			uniSwipeActionItem,
			MescrollBody,
			flightGroupChat
		},
		data() {
			return {
				tabCurrent: 2,
				pageCount: 1, //
				filterFlightList: [], //筛选后数据
				showFlightList: [], //页面展示数据
				baseVipCodeList: this.$store.getters.remoteDic.BASE_VIP_CODE,
				baseFlightStatusList: this.$store.getters.remoteDic.BASE_FLIGHT_STATUS,
				tabbarList: this.$store.state.user.tabbar,
				loadFlag: false,
				showPlayList: true,
				isTabChange: true,
				// 下拉刷新的配置(可选)
				updateText: '', //上次更新文本
				swipe: [{
					name: '点击创建群聊'
				}],
				options: [{
					text: '进入航班群聊',
					style: {
						backgroundColor: '#26b3ff'
					}
				}],
				downOption: {
					auto: false,
					offset: 50,
					textInOffset: '下拉刷新',
					textLoading: '刷新中',
					textOutOffset: '释放更新',
					use: true
				},
				upOption: {
					use: true,
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
						use: false,
						icon: null,
						tip: "暂无相关数据",
						btnText: "",
						fixed: true,
						top: "100rpx",
						zIndex: 99
					}
				},
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
		},
		onLoad(e) {
			if (e.param === 'home') {
				uni.reLaunch({
					url: '../home/index?param=guide'
				})
			}
			eventVue.$on('reflash', (val) => {
				if (val === 'flight') {
					this.getWillArrFlightList()
				}
			})
			this.handelUpdateTime()
			this.getWillArrFlightList()
			this.$store.dispatch('setAllFlight')
			this.$store.dispatch('setGmsTimeoutTimer')
		},
		onShow() {
			setTimeout(() => {
				this.timer = setInterval(() => {
					this.timerResersh()
					console.log('引导车定时刷新')
				}, 1000 * 60 * 0.5)
			}, 100)
			this.timerUpdate = setInterval(() => {
				this.handelUpdateTime()
			}, 1000 * 10)
		},
		onHide() {
			console.log('隐藏onHide')
			clearInterval(this.timer)
			clearInterval(this.timerUpdate)
		},
		onUnload() {
			clearInterval(this.timer)
			clearInterval(this.timerUpdate)
			console.log('隐藏onUnload')
		},
		methods: {
			// 获取进港航班
			getWillArrFlightList() {
				this.$loading()
				this.$store.dispatch('setWillArr').then(res => {
					this.filterFlightList = res
					this.checkDataEmpty(this.filterFlightList)
					uni.hideLoading()
				}).catch(err => {
					uni.hideLoading()
				})
			},
			conputeList() {
				let divisionList = this.filterFlightList.slice(0, 30)
				this.showFlightList = divisionList
				setTimeout(() => {
					this.showPlayList = true
					uni.hideLoading()
				}, 500)
			},
			//刷新
			timerResersh() {
				this.$store.dispatch('setWillArr').then(res => {
					this.filterFlightList = res
					this.showFlightList = this.filterFlightList.slice(0, this.pageCount * 30)
					this.$forceUpdate()
				}).catch(err => {
					uni.hideLoading()
				})
			},
			/*下拉刷新的回调*/
			downCallback(page) {
				this.$store.dispatch('setWillArr').then(res => {
					this.filterFlightList = res
					this.showFlightList = []
					this.checkDataEmpty(this.filterFlightList)
					setTimeout(() => {
						this.mescroll.endSuccess()
						this.$message(`即将进港航班刷新成功`, 'none', '')
					}, 500)
					setTimeout(() => {
						uni.setStorageSync('resetTimeWArrGuideCar', dayjs(new Date()))
						this.handelUpdateTime()
					}, 800)
				}).catch(e => {
					setTimeout(() => {
						this.mescroll.endSuccess()
						this.$message('刷新失败', 'none', '')
					}, 500)
				})
			},
			/*上拉加载的回调*/
			upCallback(page) {
				setTimeout(() => {
					let pageNum = page.num; // 页码, 默认从1开始
					this.pageCount = pageNum + 1
					let diff = (pageNum) * page.size
					let divisionList = this.filterFlightList.slice((pageNum - 1) * 30, diff)
					if (this.showFlightList.length < this.filterFlightList.length) {
						this.showFlightList = [...this.showFlightList, ...divisionList]
					}
					console.log(divisionList.length, this.filterFlightList.length)
					this.mescroll.endBySize(divisionList.length, this.filterFlightList.length)
					this.showPlayList = true
				}, 200)
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
			// 跳转到主页
			openAcdmHome() {
				uni.reLaunch({
					url: '../home/index'
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
			// 左滑创建群聊
			groupChatClick(item) {
				this.groupChatForm.channelName = item.iataCarrier + item.flight + '(' + dayjs(new Date()).format('DMMM') + ')'
				this.$refs.flightGroupChat.open(this.groupChatForm.channelName, this.userInfo.id, item)
			},
			/*上次更新时间处理*/
			handelUpdateTime() {
				let today = dayjs(new Date())
				let lastTime = ''
				let showTime = ''
				lastTime = uni.getStorageSync('resetTimeWArrGuideCar')
				showTime = today - lastTime
				this.updateText = this.handleText(showTime, lastTime)
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
			margin-top: calc(var(--status-bar-height) + 80rpx);

			.scroll {
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
					padding-top: calc((100vh - 350rpx)/2);
					text-align: center;

					text {
						color: #666666;
					}
				}

			}

		}
	}
</style>

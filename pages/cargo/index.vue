<template>
	<view class="enterance-layout">
		<!-- 导航 -->
		<view class="navbar">
			<view class="nav-handle-left">
				<view class="handle-type">
					<image class="nav-handle-left-image" src="@/static/return.png" @tap="openAcdmHome"></image>
				</view>
			</view>
			<view class="nav-title">
				<text>货物交接</text>
			</view>
			<view class="nav-handle-right">
			</view>
		</view>
		
		<!-- 内容 -->
		<view  class="main-layout">
			<view v-if="list.length!=0" class="leave-port menu">
				<view class="title">
					货物跟踪（出港）
				</view>
				<view class="notice-bar-style" v-if="cargosLeaveMessageList.length!=0" @tap="showLeaveDetails">
					<u-notice-bar mode="horizontal" :list="cargosLeaveMessageList"></u-notice-bar>
				</view>
				<view v-else class="border-line"></view>
				<view class="btns">
					
					<block v-for="(btn, index) in list" :key="btn.funcName">
						<view class="btn-and-line" :style="{'margin-bottom': showBottomLine(btn.funcName)?'136rpx':'76rpx'}">
							<view class="btn" style="width: 100%;" @tap="btn.func">
								<template v-if="index%2!=0">
									<view class="line"></view>
								</template>
								<view class="left">
									<image :src="btn.icon"></image>
								</view>
								<view class="right">
									<view class="top" style="display: flex;align-items: center;">
										<view>
											{{btn.name}}
										</view>
										<view v-if="getNumber(btn.funcName)=='1'" class="number">
											①
										</view>
										<view v-else-if="getNumber(btn.funcName)=='2'" class="number">
											②
										</view>
									</view>
									<view class="bottom">
										{{btn.remark}}
									</view>
								</view>
							</view>
							<view v-if="showBottomLine(btn.funcName)" class="area-line"></view>
						</view>
					</block>
				</view>
			</view>
			
			<view v-if="enterportList.length!=0" class="enter-port menu">
				<view class="title">
					货物跟踪（进港）
				</view>
				<view class="notice-bar-style" v-if="cargosEnterMessageList.length!=0" @tap="showEnterDetails">
					<u-notice-bar mode="horizontal" :list="cargosEnterMessageList"></u-notice-bar>
				</view>
				<view v-else class="border-line"></view>
				<view class="btns">
					
					<block v-for="(btn, index) in enterportList" :key="btn.funcName">
						<view class="btn-and-line" :style="{'margin-bottom': showBottomLine(btn.funcName)?'136rpx':'76rpx'}">
							<view class="btn" style="width: 100%;" @tap="btn.func">
								<template v-if="index%2!=0">
									<view class="line"></view>
								</template>
								<view class="left">
									<image :src="btn.icon"></image>
								</view>
								<view class="right">
									<view class="top" style="display: flex;align-items: center;">
										<view>
											{{btn.name}}
										</view>
										<view v-if="getNumber(btn.funcName)=='1'" class="number">
											①
										</view>
										<view v-else-if="getNumber(btn.funcName)=='2'" class="number">
											②
										</view>
									</view>
									<view class="bottom">{{btn.remark}}</view>
								</view>
							</view>
							<view v-if="showBottomLine(btn.funcName)" class="area-line"></view>
						</view>
						<view v-if="showBottomLine(btn.funcName)" class="area-line"></view>
					</block>
				</view>
			</view>
			
			<view v-if="pulldownList.length!=0" class="enter-port menu">
				<view class="title">
					拉下货物
				</view>
				<view class="notice-bar-style" v-if="cargosPulldownMessageList.length!=0" @tap="showPulldownDetails">
					<u-notice-bar mode="horizontal" :list="cargosPulldownMessageList"></u-notice-bar>
				</view>
				<view v-else class="border-line"></view>
				<view class="btns">
					
					<block v-for="(btn, index) in pulldownList" :key="btn.funcName">
						<view class="btn" @tap="btn.func">
							<template v-if="index%2!=0">
								<view class="line"></view>
							</template>
							<view class="left">
								<image :src="btn.icon"></image>
							</view>
							<view class="right">
								<view class="top">{{btn.name}}</view>
								<view class="bottom">{{btn.remark}}</view>
							</view>
						</view>
					</block>
				</view>
			</view>
			
			<view v-if="monitors.length!=0" class="enter-port menu">
				<view class="title">
					监控视图
				</view>
				<view class="border-line"></view>
				<view class="btns">
					
					<block v-for="(btn, index) in monitors" :key="btn.funcName">
						<view class="btn" @tap="btn.func">
							<template v-if="index%2!=0">
								<view class="line"></view>
							</template>
							<view class="left">
								<image :src="btn.icon"></image>
							</view>
							<view class="right">
								<view class="top">{{btn.name}}</view>
								<view class="bottom">{{btn.remark}}</view>
							</view>
						</view>
					</block>
				</view>
			</view>
			
			<view v-if="costlyList.length!=0" class="enter-port menu">
				<view class="title">
					贵货及危险品
				</view>
				<view class="notice-bar-style" v-if="cargoCostlyMessageList.length!=0" @tap="showCostlyDetails">
					<u-notice-bar mode="horizontal" :list="cargoCostlyMessageList"></u-notice-bar>
				</view>
				<view class="border-line"></view>
				<view class="btns">
					
					<block v-for="(btn, index) in costlyList" :key="btn.funcName">
						<view class="btn" @tap="btn.func">
							<template v-if="index%2!=0">
								<view class="line"></view>
							</template>
							<view class="left">
								<image :src="btn.icon"></image>
							</view>
							<view class="right">
								<view class="top">{{btn.name}}</view>
								<view class="bottom">{{btn.remark}}</view>
							</view>
						</view>
					</block>
				</view>
			</view>
		</view>
		
		<closeoff-remind-dialog
			ref="closeoffRemindDialog">
		</closeoff-remind-dialog>
	</view>
</template>

<script>
	import {CARGO_LEAVE_BTNS, CARGO_ENTER_BTNS, CARGO_ROLES, DIC, CARGO_PULL_DOWN, MONITOR, CARGO_COSTLY} from '@/common/dic.js'
	import {mapActions, mapGetters} from 'vuex'
	import {
		getOperatedHistory,
		getCostlyScrolls,
		getBtnsByUser,
		getCloseoffMessage,
		initCloseoffMsg,
		onError,
    getFlightStatuses
	} from '@/api/cargo/index.js'
	import closeoffRemindDialog from '@/pages/cargo/closeoff-remind-dialog.vue'
	import { deepCopy } from '@/common/util/util.js'
	import { validatenull } from '@/common/util/validate.js'
	export default {
		data () {
			return  {
				// 该用户拥有的角色可以使用的按钮,出港
				list: [],
				// 进港按钮
				enterportList: [],
				// 拉下按钮
				pulldownList: [],
				btnNames: [],
				cargoUserInfo: {},
				cargoRolesInfo: [],
				cargosLeave: [],
				cargosLeaveMessageList: [],
				cargosEnter: [],
				cargosEnterMessageList: [],
				cargosPulldown: [],
				cargosPulldownMessageList: [],
				cargoCostly: [],
				cargoCostlyMessageList: [],
				monitors: [],
				costlyList: [],
				unreadCloseoffMessages: [],
				interval: null
			}
		},
    
    computed: {
      ...mapGetters(['remoteDic'])
    },
		
		components: {
			closeoffRemindDialog
		},
		mounted () {
      if (!this.remoteDic.BASE_FLIGHT_STATUS) {
        this.getFlightStatuses()
      }
			var that = this
			this.cargoRolesInfo = uni.getStorageSync('roles_info')
			this.getBtns()
			// this.getAllbtns()
			
			try {
				let roles = uni.getStorageSync('roles_info')
				console.log('roles', roles)
				let role = null
				if (roles) {
					role = roles.find(e => e.name === '厦门地勤国内货站' || e.name === '国内货站出港货运理货')
				}	
				if (role) {
					this.initCloseoffMsg()
					this.interval = setInterval(function () {
						that.initCloseoffMsg()
					}, 30000)
				}
			} catch (err) {
				console.log('err', err)
			}
		},
		beforeDestroy () {
			clearInterval(this.interval)
		},
		onShow () {
			this.getOperatedHistoryLeave()
			this.getOperatedHistoryEnter()
			this.getOperatedHistoryPulldown()
			this.getCostlyScrolls()
			let userForm = uni.getStorageSync('userForm')
			console.log('setCargoUserForm', userForm)
			if (userForm) {
				this.setCargoUserForm(userForm)
			}
		},
		methods: {
			...mapActions(['setCargoUserForm']),
			openAcdmHome (){
				uni.reLaunch({
					url: '../home/index'
				})
			},
			
			// 出港 装机单搜索
			enterInstallSearchOrder () {
				uni.navigateTo({
					url: `/pages/cargo/leaveport/uploader-install-search`
				})
			},
			
			getAllbtns () {
				this.list = [...CARGO_LEAVE_BTNS]
				this.enterportList = [...CARGO_ENTER_BTNS]
				this.pulldownList = [...CARGO_PULL_DOWN]
				this.monitors = [...MONITOR]
				this.costlyList = [...CARGO_COSTLY]
				console.log('pulldDownList', this.pulldownList)
			},
			
			findBtn (area, label) {
				let btn = null
				switch (area) {
					case '货物跟踪(出港)':
						btn = CARGO_LEAVE_BTNS.find(e => e.label === label)
						if (!this.list.find(e => e.label === label) && btn) {
							this.list.push(btn)
						}
						break;
					case '货物跟踪(进港)':
						btn = CARGO_ENTER_BTNS.find(e => e.label === label)
						if (!this.enterportList.find(e => e.label === label) && btn) {
							this.enterportList.push(btn)
						}
						break;
					case '拉下货物':
						btn = CARGO_PULL_DOWN.find(e => e.label === label)
						if (!this.pulldownList.find(e => e.label === label) && btn) {
							this.pulldownList.push(btn)
						}
						break;
					case '监控视图':
						btn = MONITOR.find(e => e.label === label)
						if (!this.monitors.find(e => e.label === label) && btn) {
							this.monitors.push(btn)
						}
						break;
					case '贵货及危险品':
						btn = CARGO_COSTLY.find(e => e.label === label)
						if (!this.costlyList.find(e => e.label === label) && btn) {
							this.costlyList.push(btn)
						}
						break;
				}
			},
			
			
			// 获取当前用户的所有角色
			getBtns () {
				this.$loading()
				getBtnsByUser().then(res => {
					console.log('getBtnsByUser', res)
					if (res.status && res.data) {
						for (let i in res.data) {
							if (res.data[i] && res.data[i].operationMap) {
								let operationMap = res.data[i].operationMap
								for (let j in operationMap) {
									let parentNode = operationMap[j]
									if (parentNode && parentNode.length !== 0) {
										for (let k in parentNode) {
											let node = parentNode[k]
											this.findBtn(j, node)
										}
									}
								}
							}
						}
						// 按钮排序
						this.list.sort((a, b) => a.index - b.index)
						this.enterportList.sort((a, b) => a.index - b.index)
						this.pulldownList.sort((a, b) => a.index - b.index)
						this.monitors.sort((a, b) => a.index - b.index)
						this.costlyList.sort((a, b) => a.index - b.index)
					}
					this.$message(res.message)
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
			},
			
			getOperatedHistoryLeave () {
				getOperatedHistory({
					direction: 'D'
				}).then(res => {
					console.log('index-d', res)
					if (res.status && !validatenull(res.data)) {
						this.cargosLeave = res.data
						this.cargosLeaveMessageList = this.cargosLeave.map(e => {
							return (e.containerCode + ' ' + this.formatStatus(e.status, e))
						})
					} else {
						this.cargosLeave = []
						this.cargosLeaveMessageList = this.cargosLeave.map(e => {
							return (e.containerCode + ' ' + this.formatStatus(e.status, e))
						})
					}
				})
			},
			
			getUnreadCloseoffMessage () {
				let userId = uni.getStorageSync('user_id')
				if (userId) {
					getCloseoffMessage({
					  userId: userId,
						isRead: 0
					}).then(res => {
						console.log('getCloseoffMessage', res)
						if (res.status) {
							this.unreadCloseoffMessages = res.data
							if (!validatenull(res.data)) {
								this.$refs.closeoffRemindDialog.open(this.unreadCloseoffMessages)
							}
						}
						uni.hideLoading()
					}).catch(err => {
						console.log('getCloseoffMessage-err', err)
					})
				} 
				else {
					console.log('userId不存在')
				}
			},
			
			getCostlyScrolls () {
				getCostlyScrolls({
					type: 'SPECIALCARGO'
				}).then(res => {
					if (res.status && !validatenull(res.data)) {
						this.cargoCostly = res.data
						this.cargoCostlyMessageList = this.cargoCostly.map(e => {
							return (e.containerCode + ' ' + this.formatStatus(e.status, e))
						})
					} else {
						this.cargoCostly = []
						this.cargoCostlyMessageList = this.cargoCostly.map(e => {
							return (e.containerCode + ' ' + this.formatStatus(e.status, e))
						})
					}
				})
			},
			showLeaveDetails () {
				uni.setStorageSync('showLeaveDetails', this.cargosLeave)
				uni.navigateTo({
					url: `/pages/cargo/details?` + `direction=D`
				})
			},
			showEnterDetails () {
				uni.setStorageSync('showEnterDetails', this.cargosEnter)
				uni.navigateTo({
					url: `/pages/cargo/details?` + `direction=A`
				})
			},
			showPulldownDetails () {
				uni.setStorageSync('showPulldownDetails', this.cargosPulldown)
				uni.navigateTo({
					url: `/pages/cargo/details?` + `direction=PULL`
				})
			},
			showCostlyDetails () {
				uni.setStorageSync('showCostlyDetails', this.cargoCostly)
				uni.navigateTo({
					url: `/pages/cargo/details?` + `direction=A&&type=costly`
				})
			},
			getOperatedHistoryEnter () {
				getOperatedHistory({
					direction: 'A'
				}).then(res => {
					console.log('index-a', res)
					if (res.status && !validatenull(res.data)) {
						this.cargosEnter = res.data
						this.cargosEnterMessageList = this.cargosEnter.map(e => {
							return (e.containerCode + ' ' + this.formatStatus(e.status, e))
						})
					} else {
						this.cargosEnter = []
						this.cargosEnterMessageList = this.cargosEnter.map(e => {
							return (e.containerCode + ' ' + this.formatStatus(e.status, e))
						})
					}
				})
			},
			getOperatedHistoryPulldown () {
				getOperatedHistory({
					direction: 'PULL'
				}).then(res => {
					if (res.status && !validatenull(res.data)) {
						this.cargosPulldown = res.data
						this.cargosPulldownMessageList = this.cargosPulldown.map(e => {
							return (e.containerCode + ' ' + this.formatStatus(e.status, e))
						})
					} else {
						this.cargosPulldown = []
						this.cargosPulldownMessageList = this.cargosPulldown.map(e => {
							return (e.containerCode + ' ' + this.formatStatus(e.status, e))
						})
					}
				})
			},
			// 状态格式化
			formatStatus (status, item) {
				if (status === 'TOWAITINGAREA') {
					return '运往' + (item.firstTransportTargetAddr?item.firstTransportTargetAddr:('' + '待运区'))
				} else if (status === 'TOAIRCRAFT') {
					return '运往' + (item.secondTransportTargetAddr?item.secondTransportTargetAddr:('' + '机位'))
				} else if (status === 'ARRIVEDWAITINGAREA') {
					return '已到达' + (item.firstTransportTargetAddr?item.firstTransportTargetAddr:('' + '待运区'))
				} else if (status === 'ARRIVEDAIRCRAFT') {
					return '已到达' + (item.secondTransportTargetAddr?item.secondTransportTargetAddr:('' + '机位'))
				} else {
					return DIC.CARGOSTATUS[status]
				}
			},
			
			showBottomLine (name) {
				// return false
				switch (name) {
					case 'leaveToWaitAreaDriver':
					case 'leaveArriveWatingAreaDriver':
					case 'enterUnloading':
					case 'enterPortToCargoStationStevedoring':
					case 'loadingReceive':
					case 'leaveToWaitArea':
						return true
					default: 
						return false
				}
			},
			
			getNumber (name) {
				// return '0'
				switch (name) {
					case 'loadingReceive':
					case 'leaveToWaitAreaDriver':
					case 'leaveToAircraftDriver':
					case 'enterPortToCargoStationDriver':
					case 'enterUnloading':
						return '1'
					case 'leaveToWaitArea':
					case 'leaveArriveWatingAreaDriver':
					case 'leaveArriveAircraft':
					case 'enterArriveCargoStation':
					case 'enterPortToCargoStationStevedoring':
						return '2'
					default: 
						return '0'
				}
			},
			
			initCloseoffMsg () {
				let userId = uni.getStorageSync('user_id')
				let userName = uni.getStorageSync('user_name')
				if (!userId || !userName) {
					return
				}
				initCloseoffMsg({
				  userId: userId,
					userName: userName
				}).then(res => {
					console.log('initCloseoffMsg-res', res)
					if (res.status) {
						this.getUnreadCloseoffMessage()
					}
					uni.hideLoading()
				}).catch(err => {
					console.log('initCloseoffMsg-err', err)
				})
			},
      
      getFlightStatuses () {
        getFlightStatuses().then(res => {
          console.log('getFlightStatuses-res', res)
          if (res.status && res.data) {
            let list = res.data.map(e => {
              return {
                label: e.description,
                value: e.statusCode
              }
            })
            this.$store.dispatch('setDepStatusList', list)
          }
          uni.hideLoading()
        }).catch(err => {
          onError(err)
        })
      }
		}
	}
</script>

<style lang="scss" scoped>
	.enterance-layout {
		background-color: #ffffff;
		overflow-x: hidden;
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
				flex-direction: row;
				justify-content: space-between;
				width: 30%;
				padding-top: 5rpx;
				padding-left: 35rpx;
		
				.handle-type {
					.nav-handle-left-image {
						height:40rpx;
						width:20rpx;
						position:relative;
						top:-10rpx;
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
				flex-direction: row-reverse;
				justify-content: space-between;
				width: 30%;
				padding-top: 5rpx;
				padding-right: 35rpx;
			}
		}
		.main-layout {
			width: 717rpx;
			height: 100%;
			margin: 0 auto;
			margin-top: calc(var(--status-bar-height) + 100rpx);
			background-color: #ffffff;
			border-radius: 7rpx;
			
			.leave-port {
				
			}
			
			.enter-port {
				
			}
			.menu {
				.title {
					margin: {
						left: 24rpx;
						bottom: 38rpx;
					}
					padding-top: 40rpx;
					font-family: SourceHanSansSC-Medium;
					font-size: 31rpx;
					font-weight: 700;
					letter-spacing: 0rpx;
					color: #333333;
				}
				.border-line {
					margin: {
						left: 18rpx;
						bottom: 51rpx;
					}
					width: 674rpx;
					height: 2rpx;
					border: solid 2rpx #e5e5e5;
				}
				.notice-bar-style {
					margin: {
						bottom: 51rpx;
					}
				}
				.btns {
					margin-left: 20rpx;
					display: flex;
					width: 100%;
					flex-wrap: wrap;
					.btn-and-line {
						width: 50%;
						// display: flex;
						height: 76rpx;
						margin-bottom: 76rpx;
						// margin-bottom: 146rpx;
						.area-line {
							width: 100%;
							height: 2rpx;
							border: solid 2rpx #efefef;
						}
					}
					.btn {
						width: 50%;
						display: flex;
						height: 76rpx;
						margin-bottom: 76rpx;
						.line {
							width: 2rpx;
							height: 81rpx;
							border: solid 2rpx #e5e5e5;
							margin-right: 25rpx;
						}
						.left {
							image {
								width: 76rpx;
								height: 76rpx;
							}
						}
						.right {
							margin-left: 24rpx;
							.top {
								font-family: SourceHanSansSC-Medium;
								font-size: 29rpx;
								font-weight: 700;
								letter-spacing: 0rpx;
								color: #333333;
								margin: 0 0 28rpx 0;
								.number {
									position: relative;
									bottom: 5rpx;
								}
							}
							.bottom {
								font-family: SourceHanSansSC-Regular;
								font-size: 25rpx;
								letter-spacing: 0rpx;
								color: #999999;
							}
						}
					}
				}
			}
		}
	}
	
</style>

<template>
	<view class="search-result-layout">
		<view class="flight-list">
			<uni-swipe-action>
				<uni-swipe-action-item :right-options="judgeRightOption(item)" @click="groupChatClick(item, $event)" v-for="(item, index) in showFlightList"
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
			<view class="noMessage" v-show="loadFlag">
				<text>暂无数据</text>
			</view>
		</view>
		<flight-group-chat ref="flightGroupChat"></flight-group-chat>
	</view>
</template>

<script>
	import * as flightApi from "@/api/flight/index.js"
	import {
		mapGetters
	} from 'vuex'
	import dayjs from '../../common/util/dayjs.min.js'
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
	import flightGroupChat from "@/pages/flight/flight-group-chat.vue"
	export default {
		components: {
			uniSwipeAction,
			uniSwipeActionItem,
			flightGroupChat
		},
		data() {
			return {
				filters: {},
				options: [{
					text: '进入航班群聊',
					style: {
						backgroundColor: '#26b3ff'
					}
				}],
        followList: [],
				tabCurrent: 0,
				arrFlight: [], //进港航班
				depFlight: [], //出港航班
				allFlightByDate: [], //按日期查询航班
				allFlight: [], //所有航班
				showFlightList: [], //页面展示数据
				baseVipCodeList: this.$store.getters.remoteDic.BASE_VIP_CODE,
				baseFlightStatusList: this.$store.getters.remoteDic.BASE_FLIGHT_STATUS,
				userId: this.$store.getters.user.userId,
				loadFlag: false,
				status: 'loadmore',
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
				flightAndLinkList: []
			}
		},
		computed: {
			...mapGetters(['user', 'userInfo'])
		},
		onLoad(obj) {
			this.filters = obj
			this.$loading()
			this.select()
		},
		onShow() {
			// this.getAllFlight()
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
			// 筛选方式
			select() {
				let condition = {}
				let userCnname = this.user.userAirport[0].displaycnname
				let iatacode = this.user.userAirport[0].iatacode
				let icaocode = this.user.userAirport[0].icaocode
				this.showFlightList = []
				//按地方查询
				if (this.filters.originCn && this.filters.destinationCn) {
					this.searchByLocation(condition, userCnname, iatacode, icaocode)
				} else if (this.filters.flight) { //按航班号查询
					this.searchByFlight(condition)
				} else if (this.filters.registration) { //按机号查询
					this.searchByRegistration(condition)
				} else {
					uni.hideLoading()
					this.loadFlag = true
				}
			},
			//按地方查询
			searchByLocation(condition, userCnname, iatacode, icaocode) {
				this.filters.originCn = this.filters.originCn.toUpperCase()
				this.filters.destinationCn = this.filters.destinationCn.toUpperCase()
				//判断进港
				//输入中文(可获取前序存在输入字段路线,例如输入:（西-厦门）==>西安-厦门/西安-郑州-厦门/拉萨-西安-厦门)
				//输入字码(可用三字码四字码查询，不限大小写，例如输入:（pvg/Pvg/PVG/ZSPD-厦门）==>浦东-厦门)
				if ((this.filters.destinationCn === userCnname || this.filters.destinationCn === iatacode || this.filters.destinationCn ===
						icaocode) && this.filters.originCn !== userCnname) {
					this.$store.dispatch('getArrflight').then(res => {
						var isletter = /^[a-zA-Z]+$/.test(this.filters.originCn)
						//判断输入是否全英语验证是中文查询还是字码查询
						if (isletter) {
							this.arrFlight = this.allFlightDealByCode(res)
							this.showFlightList = this.OriDesCodeDataFilter('originCode', this.filters.originCn, this.arrFlight)
						} else {
							this.arrFlight = this.allFlightDeal(res)
							this.showFlightList = this.OriDesDataFilter('originCns', this.filters.originCn, this.arrFlight)
						}
						if (this.showFlightList.length === 0) {
							this.loadFlag = true
						}
						uni.hideLoading()
					}).catch(err => {
						this.loadFlag = true
						uni.hideLoading()
					})
				}
				//判断出港(规则同上)
				if ((this.filters.originCn === userCnname || this.filters.originCn === iatacode || this.filters.originCn ===
						icaocode) && this.filters.destinationCn !== userCnname) {
					this.$store.dispatch('getDepflight').then(res => {
						var isletter = /^[a-zA-Z]+$/.test(this.filters.destinationCn)
						//判断输入是否全英语验证是中文查询还是字码查询
						if (isletter) {
							this.depFlight = this.allFlightDealByCode(res)
							this.showFlightList = this.OriDesCodeDataFilter('destinationCode', this.filters.destinationCn, this.depFlight)
						} else {
							this.depFlight = this.allFlightDeal(res)
							this.showFlightList = this.OriDesDataFilter('destinationCns', this.filters.destinationCn, this.depFlight)
						}
						if (this.showFlightList.length === 0) {
							this.loadFlag = true
						}
						uni.hideLoading()
					}).catch(err => {
						this.loadFlag = true
						uni.hideLoading()
					})
				}
				//出发地、目的地都为所在港口且都为userCnname（例如:厦门-厦门）
				if ((this.filters.destinationCn === userCnname && this.filters.originCn === userCnname)) {
					this.$store.dispatch('getAllflight').then(res => {
						condition['destinationCn'] = userCnname
						condition['originCn'] = userCnname
						this.allFlight = res
						this.showFlightList = this.dataFilter(condition, this.allFlight)
						if (this.showFlightList.length === 0) {
							this.loadFlag = true
						}
						uni.hideLoading()
					}).catch(err => {
						this.loadFlag = true
						uni.hideLoading()
					})
				}
				//出发地、目的地都为所在港口且都为字码（例如:ZSAM-ZSAM）
				if ((this.filters.originCn == iatacode || this.filters.originCn == icaocode) && (this.filters.destinationCn ==
						iatacode || this.filters.destinationCn == icaocode)) {
					this.$store.dispatch('getAllflight').then(res => {
						condition['destinationCn'] = userCnname
						condition['originCn'] = userCnname
						this.allFlight = res
						this.showFlightList = this.dataFilter(condition, this.allFlight)
						if (this.showFlightList.length === 0) {
							this.loadFlag = true
						} else {
							this.loadFlag = false
						}
						uni.hideLoading()
					}).catch(err => {
						this.loadFlag = true
						uni.hideLoading()
					})
				}
				//出发地、目的地都不含所在人航空三字码四字码或者中文名称（即判断不查询无数据状态）
				if (this.filters.originCn !== iatacode && this.filters.originCn !== icaocode && this.filters.originCn !==
					userCnname) {
					if (this.filters.destinationCn !== iatacode && this.filters.destinationCn !== icaocode && this.filters.destinationCn !==
						userCnname) {
						this.loadFlag = true
						uni.hideLoading()
					}
				}
			},
			//按航班号查询
			searchByFlight(condition) {
				//判断是否为当日航班
				if (this.filters.searchDate === dayjs(new Date()).format('YYYY-MM-DD')) {
					this.$store.dispatch('getAllflight').then(res => {
						condition['flight'] = this.filters.flight
						this.allFlight = res
						this.showFlightList = this.iataCarrierDataFilter(condition, this.allFlight)
						if (this.showFlightList.length === 0) {
							this.loadFlag = true
						}
						uni.hideLoading()
					}).catch(err => {
						this.loadFlag = true
						uni.hideLoading()
					})
				} else {
					//非当日航班根据日期请求接口
					let date = dayjs(this.filters.searchDate).valueOf()
					flightApi.getFlightByDate({
						airportCode: this.$store.getters.user.userAirport[0].icaocode,
						opDate: date,
						flight: this.filters.flight
					}).then(res => {
						if (res.status) {
							this.$store.commit('SET_FLIGHTBYDATE', res.data)
							condition['flight'] = this.filters.flight
							this.allFlightByDate = res.data
							this.showFlightList = this.iataCarrierDataFilter(condition, this.allFlightByDate)
							if (this.showFlightList.length === 0) {
								this.loadFlag = true
							}
							uni.hideLoading()
							this.flightAndLinkList = res.data.filter(item => {
								return this.showFlightList.every(key => key.flightId === item.linkedFlightId)
							})
						}
					}).catch(e => {
						this.loadFlag = true
						uni.hideLoading()
					})
				}
			},
			//按机号查询
			searchByRegistration(condition) {
				this.$store.dispatch('getAllflight').then(res => {
					condition['registration'] = this.filters.registration
					this.allFlight = res
					this.showFlightList = this.dataFilter(condition, this.allFlight)
					if (this.showFlightList.length === 0) {
						this.loadFlag = true
					}
					uni.hideLoading()
				}).catch(err => {
					this.loadFlag = true
					uni.hideLoading()
				})
			},
			// 处理数据
			allFlightDeal(data) {
				let baseData = data
				let userCnname = this.user.userAirport[0].displaycnname
				baseData.forEach((res, index) => {
					let route = []
					res.destinationCns = []
					res.originCns = []
					route = res.flightRouteCn.split('-')
					if (route.length > 1) {
						if (route[0] === userCnname) {
							route.shift()
							res['destinationCns'] = route
						} else {
							route.pop()
							res['originCns'] = route
						}
					}
				})
				console.log('baseData', baseData.length)
				return baseData
			},
			// 处理数据三字码四字码
			allFlightDealByCode(data) {
				let baseData = data
				let userCnname = this.user.userAirport[0].displaycnname
				baseData.forEach((res, index) => {
					let route = []
					let code = []
					res.destinationCode = []
					res.originCode = []
					route = res.flightRouteCn.split('-')
					if (route.length > 1) {
						if (route[0] === userCnname) {
							route.shift()
							route.forEach(item => {
								let param = ''
								param = this.$store.getters.remoteDic.BASE_AIRPORT.filter(key => key.displayCNName === item)
								if (param.length > 0) {
									code.push({
										'iataCode': param[0].iataCode,
										'icaoCode': param[0].icaoCode
									})
								}
							})
							res['destinationCode'] = code
						} else {
							route.pop()
							route.forEach(item => {
								let param = ''
								param = this.$store.getters.remoteDic.BASE_AIRPORT.filter(key1 => key1.displayCNName === item)
								if (param.length > 0) {
									code.push({
										'iataCode': param[0].iataCode,
										'icaoCode': param[0].icaoCode
									})
								}
							})
							res['originCode'] = code
						}
					}
				})
				return baseData
			},
			// 筛选过滤器
			dataFilter(condition, data) {
				if (data.length !== 0) {
					return data.filter(item => {
						return Object.keys(condition).every(key => {
							return String(item[key]).toUpperCase() === String(condition[key]).toUpperCase().trim()
						})
					})
				} else {
					return ''
				}
			},
			// 筛选过滤器航班号+航司查询
			iataCarrierDataFilter(condition, data) {
				if (data.length !== 0) {
					return data.filter(item => {
						return Object.keys(condition).every(key => {
							return String(item['iataCarrier'] + item[key]).toUpperCase() === String(condition[key]).toUpperCase().trim() ||
								String(item[key]).toUpperCase() === String(condition[key]).toUpperCase().trim()
						})
					})
				} else {
					return ''
				}
			},
			// 出发地起始地筛选
			OriDesDataFilter(type, condition, data) {
				if (data.length !== 0) {
					return data.filter(item => {
						return item[type].some(key => {
							return key.toUpperCase().includes(condition.toUpperCase().trim())
						})
					})
				} else {
					return ''
				}
			},
			// 三字码四字码查询结果
			OriDesCodeDataFilter(type, condition, data) {
				let returndata = []
				if (data.length !== 0) {
					for (var i = 0; i < data.length; i++) {
						if (data[i][type].length > 0) {
							if (data[i][type].some(key => key.iataCode === condition || key.icaoCode === condition)) {
								returndata.push(data[i])
							}
						}
					}
					return returndata
				} else {
					return ''
				}
			},
			flightClick(flight) {
				if (this.filters.flight && this.filters.searchDate !== dayjs(new Date()).format('YYYY-MM-DD')) {
					console.log(this.filters.searchDate, '123456')
					uni.navigateTo({
						url: `/pages/flight/flight-message?flightId=${flight.flightId}&flightByDate=${dayjs(this.filters.searchDate).valueOf()}`
					})
				} else {
					uni.navigateTo({
						url: `/pages/flight/flight-message?flightId=${flight.flightId}`
					})
				}
			},
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
					}
				} else {
					return '-'
				}
			},
			// 左滑创建群聊
			groupChatClick(item, e) {
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
			formatDate(date) {
				if (date) {
					return dayjs(date).format('H:mm')
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
			},
			formatBoardTime(val) {
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
			},
			// 判断是否是出港，返回true false
			isArr(flight) {
				if (flight) {
					return flight.direction === 'A'
				} else {
					return false
				}
			}
		}
	}
</script>
<style lang="scss">
	.search-result-layout {
		height: calc(100vh);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-size: cover;

		.flight-list {
			z-index: 5;
			height: calc(100vh);
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
				margin-top: calc((100vh - 150rpx)/2);
				text-align: center;

				text {
					color: #666666;
				}
			}
		}
	}
</style>

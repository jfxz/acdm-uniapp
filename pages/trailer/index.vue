<template>
	<view class="trailer-layout">
		<template v-if="!landscape">
			<view class="navbar">
				<view class="nav-handle-left">
					<view class="handle-type">
						<image class="my-icon-image" src="@/static/home2x.png" @tap="openAcdmHome"></image>
					</view>
				</view>
				<view class="nav-title">
					<text>出港拖车视图</text>
				</view>
				<view class="nav-handle-right">
					<image style="height:35rpx;width:35rpx;margin-right:10rpx;" src="@/static/setting-white.png" @click="openAreas"></image>
				</view>
			</view>
			
			<view class="tabs-layout">
				<my-u-tabs-swiper activeColor="#4191EA" ref="tabs" :list="tabList" :current="tabCurrent" @change="change" :is-scroll="false" swiperWidth="750">
				</my-u-tabs-swiper>
			</view>
			
			<view class="swiper-layout">
				<swiper duration="200" class="swiper-self tabs-height" :current="swiperCurrent" @animationfinish="animationfinish">
					<block v-for="(swiperItem, key, idx) in trailerData" :key="key">
						<swiper-item style="overflow-y:auto;">
							<block v-for="(item, index) in swiperItem" :key="index">
								<card
									:right-top="index!=0"
									:right-bottom="index!=(swiperItem.length-1)"
									:item="item"
									:flight-statuses="flightStatuses">
								</card>
							</block>
						</swiper-item>
					</block>
				</swiper>
			</view>
		</template>
		<template v-else>
			<!-- 横屏 -->
			<!-- 自定义导航栏 -->
			
			<view :class="{'nav-bar': !landscape, 'landscape-nav-bar': landscape}">
				<view class="nav-handle-left">
					<view class="handle-type">
						<image class="my-icon-image" src="@/static/home2x.png" @tap="openAcdmHome"></image>
						<!-- <image class="my-icon-image" style="margin-left: 60rpx;" src="@/static/line-chart.png" @tap="openGraph"></image> -->
					</view>
				</view>
				<view class="nav-title">
					<text>出港拖车视图</text>
				</view>
				<view class="nav-handle-right">
					<image style="height:35rpx;width:35rpx;margin-right:10rpx;" src="@/static/setting-white.png" @click="openAreas"></image>
				</view>
			</view>
			
			<view class="swiper-layout">
				<swiper
				  duration="200"
					class="swiper-self tabs-landscape-height"
				 :current="swiperCurrent"
				 @animationfinish="animationfinishLandscape">
					<block v-for="(swiperItem, key, idx) in trailerData" :key="key">
						<swiper-item>
							<view style="display: flex;margin-bottom: 10rpx;">
								<view class="text">{{tabList[idx][0].name}}</view>
								<view></view>
								<template v-if="swiperItem.length!=1">
									<view class="text">{{tabList[idx][1].name}}</view>
								</template>
								<template v-else>
									<view class="text">{{''}}</view>
								</template>
							</view>
							
							<view class="land-scape-between">
								<template v-if="swiperItem.length>1">
									<view style="position:relative;width:50%;">
										<block v-for="(item, index) in swiperItem[0]" :key="index">
											<card
												:right-top="index!=0"
												:right-bottom="index!=(swiperItem[0].length-1)"
												:item="item"
												:flight-statuses="flightStatuses">
											</card>
										</block>
									</view>
									<view style="position:relative;width:49%;">
										<block v-for="(item, index) in swiperItem[1]" :key="index">
											<card
												:right-top="index!=0"
												:right-bottom="index!=(swiperItem[1].length-1)"
												:item="item"
												:flight-statuses="flightStatuses">
											</card>
										</block>
									</view>
								</template>
								<template v-else>
									<view style="position:relative;width:49%;">
										<block v-for="(item, index) in swiperItem[0]" :key="index">
											<card
												:right-top="index!=0"
												:right-bottom="index!=(swiperItem[0].length-1)"
												:item="item"
												:flight-statuses="flightStatuses">
											</card>
										</block>
									</view>
									<view style="position:relative;width: 50%;">
										<view style="height:100%;width:100%;"></view>
									</view>
								</template>
							</view>
						</swiper-item>
					</block>
				</swiper>
			</view>
		</template>
		
		<view v-if="showAreas" class="cu-modal" :class="showAreas==true?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end" style="min-height:30rpx;height:70rpx;background-color: #F8F8F8;">
					<view class="action" @tap="hideAreas">
						<text class="cuIcon-close text-red" style="position:absolute;right:-1rpx;"></text>
					</view>
				</view>
				<view style="padding-bottom:60rpx;">
					<template v-if="showAreasList">
						<block v-for="(item, index) in areas" :key="item.id">
							<view class="modal-form-item">
								<template v-if="!item.selected">
									<view class="modal-form-item-unconfirm">
										<image @click="selectArea(item)" style="width:34rpx;height:34rpx;" src="@/static/rect.png"></image>
									</view>
								</template>
								<template v-else>
									<view class="modal-form-item-confirm">
										<image @click="cancelArea(item)" style="width:36rpx;height:36rpx;" src="@/static/selected.png"></image>
									</view>
								</template>
								<view class="modal-form-item-label">
									<view>{{item.name}}</view>
								</view>
							</view>
						</block>
					</template>
					<view style="float:right;">
						<button @click="selectAreasBtn" style="background-color: #007AFF;color:#ffffff;width: 140rpx;height:55rpx;line-height:55rpx;40rpx;margin-bottom: 20rpx;margin-right: 20rpx;">确定</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import myUTabsSwiper from '@/components/my-u-tabs-swiper/my-u-tabs-swiper.vue'
	import dayjs from '@/common/util/dayjs.min.js'
	import dragSorts from '@/components/drag-sorts/index.vue'
	import {getTrailerView,
					getAreaManage,
					getVipTags
					} from  '@/api/trailer/index.js'
	import card from './card.vue'
	import { throttle } from '@/common/util/util.js'
	import trailerMixin from './trailer-mixin.js'
	import { mapGetters } from 'vuex'
	
	export default {
		mixins: [trailerMixin],
		components: {
			dragSorts,
			myUTabsSwiper,
			card
		},
		data() {
			return {
				// 是否横屏
				landscape: false,
				// tab页码
				tabCurrent: 0,
				// swiper页码
				swiperCurrent: 0,
				// 列表
				list: [{
          label: '标题1'
        },
        {
          label: '标题2'
        },
        {
          label: '标题3'
        }],
				// 顶部滑动栏列表
				tabList: [],
				trailerData: {},
				// 获取拖车出港视图所需的数据
				trailerForm: {
					airportCode: '',
					zone: ''
				},
				areas: [],
				showAreas: false,
				showAreasList: true,
				// 防抖计时器
				timeout: null,
				// 状态栏高度
				statusBarHeight: 0,
				// 所有航班状态
				flightStatuses: [],
				maxHeight: 0,
				vipTags: [],
				ldHeight: 0,
				airportCode: '',
				interval: null,
				throttleTimer: null,
				tabBefore: null,
				swiperBefore: null,
				
				baseFlightStatusList: this.$store.getters.remoteDic.BASE_FLIGHT_STATUS,
				baseVipCodeList: this.$store.getters.remoteDic.BASE_VIP_CODE,
				resertTimeType: ['resetTimeArr', 'resetTimeDep', 'resetTimeWArr', 'resetTimeWDep', 'resetTimeGms'],
				updateText: [], //上次更新文本
				flightList: [], //所有航班类型数据
				filterFlightList: [] //筛选后数据
			}
		},
		
		computed: {
			...mapGetters(['remoteDic'])
		},
		
		beforeDestroy () {
			clearInterval(this.interval)
		},
		mounted () {
			// this.versionModal.open()
			this.getFlightStatuses()
			uni.showLoading({
				title: '加载中'
			})
			var that = this
			this.interval =  setInterval(function () {
				that.intervalReFresh()
			}, 60000)
			this.airportCode = uni.getStorageSync('userAirport')[0].icaocode
			this.trailerForm.airportCode = this.airportCode
				getVipTags({
					airportCode: this.airportCode,
					pageSize: 100,
					pageNumber: 0
				}).then(res => {
					console.log('getVipTags', res)
					if (res.status) {
						this.vipTags = res.data.content
						getAreaManage({'airportCode': this.airportCode}).then(res => {
							console.log('getTrailerAreaManage', res)
							if (res.status) {
								this.areas = res.data.content
								this.areas.forEach(e => {
									e.selected = true
								})
								let arr = this.areas
								this.trailerForm.zone = ''
								for (let i in arr) {
									this.trailerForm.zone += arr[i].name + ','
								}
								this.trailerForm.zone = this.trailerForm.zone.slice(0, this.trailerForm.zone.length - 1)
								this.tabList = []
								this.trailerData = []
								that.getListNoBtn()
							}
						})
					}
				})
			// 监听横屏竖屏变化事件
			let device = ''
			uni.getSystemInfo({
				success: function (res) {
					device = res.platform
					this.windowWidth = res.windowWidth
				}
			})
			if (device !== 'devtools') {
				uni.onWindowResize((res) => {
					this.tabBefore = this.tabCurrent
					this.swiperBefore = this.swiperCurrent
					console.log('this.swiperBefore', this.swiperBefore)
					uni.showLoading({
						title: '加载中'
					})
					console.log('监控')
					if (!that.timeout) {
						that.timeout = setTimeout(() => {
							console.log('变化后的窗口宽度=' + res.size.windowWidth)
							console.log('变化后的窗口高度=' + res.size.windowHeight)
							if (res.size.windowWidth > res.size.windowHeight) {
								// 开启全屏模式，隐藏状态栏
								// #ifdef APP-PLUS
								plus.navigator.setFullscreen(true)
								// #endif
								
								that.ldHeight = res.size.windowHeight
								that.landscape = true
							} else {
								// 关闭全屏模式，显示状态栏
								// #ifdef APP-PLUS
								plus.navigator.setFullscreen(false)
								// #endif
								
								that.landscape = false
							}
							this.tabList = []
							this.trailerData = []
							that.getListNoBtn(that.trailerForm)
							
							clearTimeout(that.timeout)
							that.timeout = null
						}, 500)
					}
				})
			}
		},
		methods: {
			openAcdmHome (){
				uni.reLaunch({
					url: '../home/index'
				})
			},
			// animationfinishLandscape ({ detail: { current } }) {
			// 	this.swiperCurrent = current
			// },
			// 定时刷新
			intervalReFresh () {
				this.getListInterval()
			},
			selectAreasBtn () {
				uni.showLoading({
					title: '加载中'
				})
				let arr = this.areas.filter(e => e.selected === true)
				this.trailerForm.zone = ''
				for (let i in arr) {
					this.trailerForm.zone += arr[i].name + ','
				}
				this.trailerForm.zone = this.trailerForm.zone.slice(0, this.trailerForm.zone.length - 1)
				this.tabList = []
				this.trailerData = []
				this.getListNoBtn(this.trailerForm)
				this.showAreas = false
			},
			selectArea (item) {
				item.selected = true
				this.showAreasList = false
				this.showAreasList = true
			},
			cancelArea (item) {
				item.selected = false
				this.showAreasList = false
				this.showAreasList = true
			},
			hideAreas () {
				this.showAreas = false
			},
			openAreas () {
				this.showAreas = true
			},
			openDragSorts () {
				this.$refs.dragSorts.onUpdateCurrentList(list)
			},
			
			// 根据机场获取所有区域（默认为zsam）
			getTrailerAreaManage () {
				getAreaManage({'airportCode': this.airportCode}).then(res => {
					console.log('getTrailerAreaManage', res)
					if (res.status) {
						this.areas = res.data.content
						this.areas.forEach(e => {
							e.selected = true
						})
						let arr = this.areas
						this.trailerForm.zone = ''
						for (let i in arr) {
							this.trailerForm.zone += arr[i].name + ','
						}
						this.trailerForm.zone = this.trailerForm.zone.slice(0, this.trailerForm.zone.length - 1)
					}
				})
			},
			
			getListInterval () {
				let swiperCurrentName = this.tabList[this.swiperCurrent].name
				let swiperCurrent = this.swiperCurrent
				this.trailerForm.airportCode = this.airportCode
				getTrailerView(this.trailerForm).then(res1 => {
					if (res1.status) {
						let arrRes = []
						for (let i in res1.data) {
							for (let j = 0; j < res1.data[i].length; j++) {
								if (j + 1 < res1.data[i].length && res1.data[i][j + 1].localCtot && res1.data[i][j].localCtot && j < res1.data[i].length - 1) {
                  let start = this.formatTime2(res1.data[i][j + 1].localCtot)
                  let end = this.formatTime2(res1.data[i][j].localCtot)
                  res1.data[i][j].timespan = (start - end) / 60000
								} else {
									res1.data[i][j].timespan = null
								}
							}
							arrRes.push({
								key: i,
								arr: res1.data[i],
								len: res1.data[i].length
							})
						}
						arrRes.sort((a, b) => b.len - a.len)
						let res = {
							data: {}
						}
						for (let i = 0; i < arrRes.length; i++) {
							let key = arrRes[i].key
							res.data[`${key}`] = arrRes[i].arr
						}
						
						for (let i in res.data) {
							for (let j in res.data[i]) {
								res.data[i][j].word = this.formatVipTag(res.data[i][j])
							}
						}
						
						// let tabList = Object.keys(res.data)
						if(!this.landscape) {
							// 竖屏
							
							for (let i = 0; i < this.tabList.length; i++) {
								let name = this.tabList[i].name
								if (swiperCurrentName === name) {
									// let data = res.data[`${name}`]
									this.trailerData.push(res.data[`${name}`])
								} else {
									this.trailerData.push(res.data[`${name}`])
								}
							}
							this.$forceUpdate()
						} else {
							// 如果是横屏，那么一个tab显示两个tab名
							// 处理tab，使其一页可以显示两个标签
							let i = 0
							while (i < tabList.length) {
								if ((i + 1) < tabList.length) {
									this.tabList.push([{
										name: tabList[i]
									}, {
										name: tabList[i + 1]
									}])
									i += 2
								} else {
									this.tabList.push([{
										name: tabList[i]
									}])
									i++
								}
							}
							// 处理trailerData，使其一页可以显示两个swiper
							for (let i = 0; i < this.tabList.length; i++) {
								let arr
								if (this.tabList[i].length > 1) {
									arr = [[], []]
									let name0 = this.tabList[i][0].name
									let name1 = this.tabList[i][1].name
									arr[0] = res.data[`${name0}`]
									arr[1] = res.data[`${name1}`]
								} else {
									arr = [[]]
									let name0 = this.tabList[i][0].name
									arr[0] = res.data[`${name0}`]
								}
								this.trailerData[i] = arr
							}
						}
						this.$forceUpdate()
					} else {
						uni.showToast({
							title: '无数据',
							icon: 'none',
							duration: 1000
						})
					}
				})
				uni.hideLoading()
			},
			
			getListNoBtn () {
				this.trailerForm.airportCode = this.airportCode
				getTrailerView(this.trailerForm).then(res1 => {
					if (res1.status) {
						let arrRes = []
						try {
							for (let i in res1.data) {
								for (let j = 0; j < res1.data[i].length; j++) {
									if (j + 1 < res1.data[i].length && res1.data[i][j + 1].localCtot && res1.data[i][j].localCtot && j < res1.data[i].length - 1) {
										let start = this.formatTime2(res1.data[i][j + 1].localCtot)
										let end = this.formatTime2(res1.data[i][j].localCtot)
										res1.data[i][j].timespan = (start - end) / 60000
                    console.log('start-end', start, end, res1.data[i][j].timespan)
									} else {
										res1.data[i][j].timespan = null
									}
								}
								arrRes.push({
									key: i,
									arr: res1.data[i],
									len: res1.data[i].length
								})
							}
						} catch(err) {
							console.log('getTrailerView-catch-err', err)
						}
						
						arrRes.sort((a, b) => b.len - a.len)
						let res = {...res1}
						res.data = {}
						for (let i = 0; i < arrRes.length; i++) {
							let key = arrRes[i].key
							res.data[`${key}`] = arrRes[i].arr
						}
						
						for (let i in res.data) {
							for (let j in res.data[i]) {
								res.data[i][j].word = this.formatVipTag(res.data[i][j])
							}
						}
						
						let tabList = Object.keys(res.data)
						if(!this.landscape) {
							// 竖屏
							for (let i in tabList) {
								this.tabList.push({
									name: tabList[i]
								})
							}
							for (let i = 0; i < this.tabList.length; i++) {
								let name = this.tabList[i].name
								this.trailerData.push(res.data[`${name}`])
							}
							this.tabCurrent = this.swiperBefore * 2
							this.swiperCurrent = this.swiperBefore * 2
							console.log('a-tabCurrent', this.tabCurrent)
							console.log('a-before', this.swiperBefore)
							console.log('a-swiperCurrent', this.swiperCurrent)
						} else {
							// 如果是横屏，那么一个tab显示两个tab名
							// 处理tab，使其一页可以显示两个标签
							let i = 0
							while (i < tabList.length) {
								if ((i + 1) < tabList.length) {
									this.tabList.push([{
										name: tabList[i]
									}, {
										name: tabList[i + 1]
									}])
									i += 2
								} else {
									this.tabList.push([{
										name: tabList[i]
									}])
									i++
								}
							}
							// 处理trailerData，使其一页可以显示两个swiper
							for (let i = 0; i < this.tabList.length; i++) {
								let arr
								if (this.tabList[i].length > 1) {
									arr = [[], []]
									let name0 = this.tabList[i][0].name
									let name1 = this.tabList[i][1].name
									arr[0] = res.data[`${name0}`]
									arr[1] = res.data[`${name1}`]
								} else {
									arr = [[]]
									let name0 = this.tabList[i][0].name
									arr[0] = res.data[`${name0}`]
								}
								this.trailerData[i] = arr
							}
							this.tabCurrent = this.tabBefore
							this.swiperCurrent = parseInt(this.tabBefore / 2)
						}
						this.$forceUpdate()
					} else {
						uni.showToast({
							title: '无数据',
							icon: 'none',
							duration: 1000
						})
					}
					uni.hideLoading()
				}).catch(err => {
					uni.showToast({
						title: err.error || err.errmsg,
						icon: 'none',
						duration: 2000
					})
					uni.hideLoading()
				})
				
			},
			
			formatVipTag (item) {
				if (!item.vipTag || item.vipTag === '') {
					return null
				}
				let tag = item.vipTag
				let obj = this.vipTags.find(e => e.rankcode === tag)
				if (obj) {
					let word = null
					if (obj.description) {
						word = obj.description.substr(0, 1)
					}
					if (obj.rankcode === 'Z') {
						item.color = '#468CFF'
					} else if (obj.rankcode === 'C') {
						item.color = '#FF8686'
					} else {
						item.color = '#01CB95'
					}
					return word
				}
				return null
			},
			
			formatTime (val) {
				try {
					if (val) {
						if (typeof val !== 'number') {
							try {
								val = val.substr(0, 19).replace(/T/, ' ')
								val = dayjs(val).add(8, 'hour')
							} catch (e) {
								console.log(e)
							}
						}
						let day1 = dayjs(val).format('HH:mm')
						return day1
					} else {
						return ''
					}
				} catch (e) {
					console.log(e)
				}
			},
      
      formatTime2 (val) {
      	try {
      		if (val) {
      			if (typeof val !== 'number') {
      				try {
      					val = val.substr(0, 19).replace(/T/, ' ')
      					val = dayjs(val).add(8, 'hour')
      				} catch (e) {
      					console.log(e)
      				}
      			}
      			let day1 = dayjs(dayjs(val).format('YYYY-MM-DD HH:mm')).valueOf()
      			return day1
      		} else {
      			return ''
      		}
      	} catch (e) {
      		console.log(e)
      	}
      },
      
			formatStatus (status) {
				let statusName = this.flightStatuses.find(v => v.statusCode === status)
				if (statusName) {
					return statusName.description
				} else {
					return ''
				}
			},
			// tab栏切换
			change (index) {
				this.swiperCurrent = index
			},
			transition ({ detail: { dx } }) {
				// this.$refs.tabs.setDx(dx)
			},
			animationfinish ({ detail: { current } }) {
				this.tabCurrent = current
				this.swiperCurrent = current
				this.$refs.tabs.setFinishCurrent(current)
			},
			animationfinishLandscape ({ detail: { current } }) {
				this.swiperCurrent = current
				this.tabCurrent = current
			},
			moveLeft () {
				--this.swiperCurrent
			},
			moveRight () {
				++this.swiperCurrent
			},
			getVipTags() {
				console.log('uni.get', uni.getStorageSync('userAirport'))
				getVipTags({
					airportCode: this.airportCode,
					pageSize: 100,
					pageNumber: 0
				}).then(res => {
					console.log('getVipTags', res)
					if (res.status) {
						this.vipTags = res.data.content
					}
				})
			},
			// 获取所有航班状态
			getFlightStatuses () {
				this.flightStatuses = this.remoteDic.BASE_FLIGHT_STATUS
				console.log('getFlightStatus', this.flightStatuses)
				this.tabList = []
				this.trailerData = []
			},
			
			openGraph () {
				let airportCode = this.airportCode
				uni.navigateTo({
					url: `/pages/trailer/graph?airportCode=${airportCode}`
				})
				uni.setStorageSync('trailer-tabList', this.tabList)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.swiper-top {
		padding-top: calc(var(--status-bar-height) + 892rpx);
	}
	
	.landscape-nav-bar {
		display: flex;
		justify-content: space-between;
		height: 82rpx;
		background: #1891ff;
		padding-top: 20rpx;
		width: 100%;
		z-index: 10;
		// position: fixed;
		// top: 0;
		text-align: center;
	
		.nav-handle-left {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			width: 30%;
			padding-top: 5rpx;
			padding-left: 35rpx;
	
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
			flex-direction: row-reverse;
			justify-content: space-between;
			width: 30%;
			padding-top: 5rpx;
			padding-right: 35rpx;
	
			.handle-type {
				image {
					width: 38rpx;
					height: 38rpx;
				}
			}
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
		// position: fixed;
		// top: 0;
		text-align: center;
	
		.nav-handle-left {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			width: 30%;
			padding-top: 5rpx;
			padding-left: 35rpx;
	
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
			flex-direction: row-reverse;
			justify-content: space-between;
			width: 30%;
			padding-top: 5rpx;
			padding-right: 35rpx;
	
			.handle-type {
				image {
					width: 38rpx;
					height: 38rpx;
				}
			}
		}
	}

	

	.swiper-item-layout {
		display: flex;
		padding: 34rpx 17rpx 27rpx 17rpx;
		margin-bottom: 17rpx;
		background-color: #ffffff;
		height: 206rpx;
		background-color: #ffffff;
		border-radius: 0rpx 0rpx 7rpx 7rpx;
		.icon {
			display: flex;
			align-items: center;
			margin-right: 18rpx;
			.img {
				height: 58rpx;
				width: 58rpx;
			}
		}
		.text-layout {
			width: 100%;
			.top {
				display: flex;
				justify-content: space-between;
				.flight {
					padding-top: 5rpx;
					font-family: Arial-BoldMT;
					font-size: 35rpx;
					font-weight: bold;
					line-height: 20rpx;
					color: #333333;
				}
				.flight-status {
					font-size: 35rpx;
					font-weight: normal;
					line-height: 20rpx;
					color: #00cf70;
				}
			}
			.middle {
				display: flex;
				margin-top: 33rpx;
				.stand {
					display: flex;
					font-family: SourceHanSansSC-Regular;
					font-size: 28rpx;
					letter-spacing: 1rpx;
					color: #a6a6a6;
					.number {
						margin-left: 13rpx;
						font-size: 28rpx;
						font-weight: bold;
						letter-spacing: 1rpx;
						color: #595959;
					}
				}
				.seperation {
					margin-left: 22rpx;
					margin-right: 17rpx;
					width: 2rpx;
					background-color: #e6e6e6;
				}
				.registration {
					display: flex;
					font-size: 28rpx;
					font-weight: normal;
					font-family: SourceHanSansSC-Regular;
					font-stretch: normal;
					letter-spacing: 1rpx;
					color: #a6a6a6;
					.number {
						margin-left: 11rpx;
						font-size: 28rpx;
						font-weight: bold;
						letter-spacing: 1rpx;
						color: #595959;
					}
				}
			}
			.bottom {
				display: flex;
				margin-top: 28rpx;
				.ctot {
					display: flex;
					padding-top: 3rpx;
					font-size: 29rpx;
					font-weight: normal;
					font-stretch: normal;
					letter-spacing: 1rpx;
					color: #a6a6a6;
					.time {
						margin-left: 18rpx;
						font-size: 29rpx;
						font-weight: bold;
						letter-spacing: 1rpx;
						color: #595959;
					}
				}
				.seperation {
					margin-left: 22rpx;
					margin-right: 17rpx;
					width: 2rpx;
					background-color: #e6e6e6;
				}
				.off-block {
					display: flex;
					font-family: SourceHanSansSC-Regular;
					font-size: 29rpx;
					letter-spacing: 1rpx;
					color: #a6a6a6;
					line-height: 120%;
					.time {
						margin-left:12rpx;
						font-size: 29rpx;
						font-weight: bold;
						letter-spacing: 1rpx;
						color: #595959;
					}
				}
			}
		}
	}
	
	
	.swiper-layout {
		height: 100%;
		// height: 100vh;
		width: 100%;
		background-color: #f5f5f5;
		// background-color: red;
		.tabs-landscape-height {
			height: calc(100vh - 82rpx);
		}
		.tabs-height {
			height: calc(100vh - 170rpx - var(--status-bar-height));
		}
		.swiper-self {
			// height: calc(100vh - 90px - var(--status-bar-height));
			.tabs-landscape {
				width: 100%;
				height:42rpx;
				display: flex;
				align-items: center;
				background-color: #e6e6e6;
				.text {
					width: 50%;
					text-align: center;
				}
			}
			.text {
				width: 100%;
				text-align: center;
			}
			.scroll-view-landscape {
				 display:grid;
				 grid-template-rows: 42rpx calc(100% - 42rpx);
				 grid-template-columns: 49% 2% 49%;
				.swiper-item-layout {
					display: flex;
					padding: 34rpx 17rpx 27rpx 17rpx;
					margin-bottom: 17rpx;
					background-color: #ffffff;
					height: 206rpx;
					background-color: #ffffff;
					border-radius: 0rpx 0rpx 7rpx 7rpx;
					.icon {
						display: flex;
						align-items: center;
						margin-right: 18rpx;
						.img {
							height: 58rpx;
							width: 58rpx;
						}
					}
					.text-layout {
						width: 100%;
						.top {
							display: flex;
							justify-content: space-between;
							.flight {
								padding-top: 5rpx;
								font-family: Arial-BoldMT;
								font-size: 35rpx;
								font-weight: bold;
								line-height: 20rpx;
								color: #333333;
							}
							.flight-status {
								font-size: 35rpx;
								font-weight: normal;
								line-height: 20rpx;
								color: #00cf70;
							}
						}
						.middle {
							display: flex;
							margin-top: 33rpx;
							.stand {
								display: flex;
								font-family: SourceHanSansSC-Regular;
								font-size: 28rpx;
								letter-spacing: 1rpx;
								color: #a6a6a6;
								.number {
									margin-left: 13rpx;
									font-size: 28rpx;
									font-weight: bold;
									letter-spacing: 1rpx;
									color: #595959;
								}
							}
							.seperation {
								margin-left: 22rpx;
								margin-right: 17rpx;
								width: 2rpx;
								background-color: #e6e6e6;
							}
							.registration {
								display: flex;
								font-size: 28rpx;
								font-weight: normal;
								font-family: SourceHanSansSC-Regular;
								font-stretch: normal;
								letter-spacing: 1rpx;
								color: #a6a6a6;
								.number {
									margin-left: 11rpx;
									font-size: 28rpx;
									font-weight: bold;
									letter-spacing: 1rpx;
									color: #595959;
								}
							}
						}
						.bottom {
							display: flex;
							margin-top: 28rpx;
							.ctot {
								display: flex;
								padding-top: 3rpx;
								font-size: 29rpx;
								font-weight: normal;
								font-stretch: normal;
								letter-spacing: 1rpx;
								color: #a6a6a6;
								.time {
									margin-left: 18rpx;
									font-size: 29rpx;
									font-weight: bold;
									letter-spacing: 1rpx;
									color: #595959;
								}
							}
							.seperation {
								margin-left: 22rpx;
								margin-right: 17rpx;
								width: 2rpx;
								background-color: #e6e6e6;
							}
							.off-block {
								display: flex;
								font-family: SourceHanSansSC-Regular;
								font-size: 29rpx;
								letter-spacing: 1rpx;
								color: #a6a6a6;
								line-height: 120%;
								.time {
									margin-left:12rpx;
									font-size: 29rpx;
									font-weight: bold;
									letter-spacing: 1rpx;
									color: #595959;
								}
							}
						}
					}
				}
			}
			.swiper-item-layout {
				display: flex;
				padding: 34rpx 17rpx 27rpx 17rpx;
				margin-bottom: 17rpx;
				background-color: #ffffff;
				height: 206rpx;
				background-color: #ffffff;
				border-radius: 0rpx 0rpx 7rpx 7rpx;
				.icon {
					display: flex;
					align-items: center;
					margin-right: 18rpx;
					.img {
						height: 58rpx;
						width: 58rpx;
					}
				}
				.text-layout {
					width: 100%;
					.top {
						display: flex;
						justify-content: space-between;
						.flight {
							padding-top: 5rpx;
							font-family: Arial-BoldMT;
							font-size: 35rpx;
							font-weight: bold;
							line-height: 20rpx;
							color: #333333;
						}
						.flight-status {
							font-size: 35rpx;
							font-weight: normal;
							line-height: 20rpx;
							color: #00cf70;
						}
					}
					.middle {
						display: flex;
						margin-top: 33rpx;
						.stand {
							display: flex;
							font-family: SourceHanSansSC-Regular;
							font-size: 28rpx;
							letter-spacing: 1rpx;
							color: #a6a6a6;
							.number {
								margin-left: 13rpx;
								font-size: 28rpx;
								font-weight: bold;
								letter-spacing: 1rpx;
								color: #595959;
							}
						}
						.seperation {
							margin-left: 22rpx;
							margin-right: 17rpx;
							width: 2rpx;
							background-color: #e6e6e6;
						}
						.registration {
							display: flex;
							font-size: 28rpx;
							font-weight: normal;
							font-family: SourceHanSansSC-Regular;
							font-stretch: normal;
							letter-spacing: 1rpx;
							color: #a6a6a6;
							.number {
								margin-left: 11rpx;
								font-size: 28rpx;
								font-weight: bold;
								letter-spacing: 1rpx;
								color: #595959;
							}
						}
					}
					.bottom {
						display: flex;
						margin-top: 28rpx;
						.ctot {
							display: flex;
							padding-top: 3rpx;
							font-size: 29rpx;
							font-weight: normal;
							font-stretch: normal;
							letter-spacing: 1rpx;
							color: #a6a6a6;
							.time {
								margin-left: 18rpx;
								font-size: 29rpx;
								font-weight: bold;
								letter-spacing: 1rpx;
								color: #595959;
							}
						}
						.seperation {
							margin-left: 22rpx;
							margin-right: 17rpx;
							width: 2rpx;
							background-color: #e6e6e6;
						}
						.off-block {
							display: flex;
							font-family: SourceHanSansSC-Regular;
							font-size: 29rpx;
							letter-spacing: 1rpx;
							color: #a6a6a6;
							line-height: 120%;
							.time {
								margin-left:12rpx;
								font-size: 29rpx;
								font-weight: bold;
								letter-spacing: 1rpx;
								color: #595959;
							}
						}
					}
				}
			}
		}
	}
	
	.nav-landscape-center {
		display: flex;
		justify-content: center;
		width: 100%;
	}
	.modal-form-item {
		display: flex;
		justify-content: center;
		margin-bottom: 10rpx;
		.modal-form-item-label {
			min-width: 400rpx;
			text-align: left;
			padding-left: 10rpx;
			line-height: 1.3;
		}
		.modal-form-item-unconfirm {
			text-align: right;
			// color: red;
			padding-right: 30rpx;
		}
		.modal-form-item-confirm {
			text-align: right;
			padding-right: 30rpx;
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
	
		// font-family: SourceHanSansSC-Medium;
		font-size: 35rpx;
		font-weight: normal;
		line-height: 20rpx;
	}
	
	.text {
		width: 50%;
		text-align: center;
	}
	.img-font {
		height: 58rpx !important;
		width: 58rpx !important;
		color:#ffffff !important;
		line-height: 58rpx !important;
		border-radius: 50% !important;
		text-align: center;
	}
	.land-scape-between {
		display: flex !important;
		// width: 100vw !important;
		justify-content: space-between !important;
		overflow:auto !important;
		height: calc(100vh - 130rpx);
	}
</style>

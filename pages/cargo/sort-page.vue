/*
* 界面名称: 选择页面
* 界面功能:
* 其他    :
* 时间    :2020-8-15 09:57:40
* 作者    :gyb
*/
<template>
	<view>
		<!-- 导航栏 -->
		<nav-bar
			 title="选择"
			:show-input-flag="false"
			:content-not-null="true">
		</nav-bar>
		
		<!-- 内容 -->
		<template v-if="operationType=='STATIONHANDOVER'||operationType=='PULL_CONFIRM'">
			<list-content
				 ref="listContent"
				:not-id="notId"
				:show-bottom-info="operationType=='STATIONHANDOVER'"
				:content-not-null="list.length!=0"
				:show-search-bar="false"
				@updateCargoInfo="updateCargoInfoNoToast"
				@noSelectedWarn="noSelectedWarn"
				@changeBottomSelectAll="changeBottomSelectAll">
				<template v-slot:cardIcon>
					<image style="width:54rpx;height:54rpx;" src="@/static/flight-cargo.png"></image>
				</template>
				<template v-slot:cardRight="scope">
					<container-card
						:sort="true"
						:item-ori="scope.item"
						:show-upload="false">
					</container-card>
				</template>
			</list-content>
		</template>
		<template v-else-if="operationType!='UNLOADER'&&type=='costly'">
			<list-content
				 ref="listContent"
				:not-id="notId"
				:content-not-null="list.length!=0"
				:show-search-bar="false"
				@updateCargoInfo="updateCargoInfoNoToast"
				@noSelectedWarn="judgeAllSelected">
				<template v-slot:cardIcon>
					<image style="width:54rpx;height:54rpx;" src="@/static/flight-cargo.png"></image>
				</template>
				<template v-slot:cardRight="scope">
					<costly-transfer-card
						:show-upload="false"
						:item="scope.item">
					</costly-transfer-card>
				</template>
			</list-content>
		</template>
		<template v-else-if="type=='costly'">
			<list-content
				 ref="listContent"
				:not-id="notId"
				:content-not-null="list.length!=0"
				:show-search-bar="false"
				@updateCargoInfo="updateCargoInfoNoToast"
				@noSelectedWarn="judgeAllSelected"
				>
				<template v-slot:cardIcon>
					<image style="width:54rpx;height:54rpx;" src="@/static/flight-cargo.png"></image>
				</template>
				<template v-slot:cardRight="scope">
					<costly-search-card
						:item="scope.item">
					</costly-search-card>
				</template>
			</list-content>
		</template>
		<template v-else-if="type!='costly'&&direction=='D'">
			<list-content
				 ref="listContent"
				:not-id="notId"
				:content-not-null="list.length!=0"
				:show-search-bar="false"
				@noSelectedWarn="noSelectedWarn"
				@changeBottomSelectAll="changeBottomSelectAll"
				@updateCargoInfo="updateCargoInfoNoToast">
				<template v-slot:cardIcon>
					<image style="width:54rpx;height:54rpx;" src="@/static/flight-cargo.png"></image>
				</template>
				
				<template v-slot:cardRight="scope">
					<to-waiting-area-card
						:show-upload="false"
						:item-ori="scope.item"
						@openBottomPopup="openBottomPopup">
					</to-waiting-area-card>
				</template>
			</list-content>
		</template>
		<template v-else-if="type!='costly'&&direction=='A'">
			<list-content
				 ref="listContent"
				:not-id="notId"
				:show-search-bar="false"
				:content-not-null="list.length!=0"
				@noSelectedWarn="noSelectedWarn"
				@changeBottomSelectAll="changeBottomSelectAll"
				@updateCargoInfo="updateCargoInfoNoToast">
				<template v-slot:cardIcon>
					<image style="width:54rpx;height:54rpx;" src="@/static/flight-cargo.png"></image>
				</template>
				<template v-slot:cardRight="scope">
					<transfer-card
						:arror="true"
						:show-upload="false"
						:item-ori="scope.item"
						@showBottomPopup="showBottomPopup"
						@openBottomPopup="openBottomPopup"
						@changeSwipeStatus="changeSwipeStatus"
						@openUploadImageDialog="openUploadImageDialog">
					</transfer-card>
				</template>
			</list-content>
		</template>
		<template v-else-if="direction=='PULL'">
			<list-content
				 ref="listContent"
				:not-id="notId"
				:show-search-bar="showSearchBar"
				:content-not-null="list.length!=0"
				@noSelectedWarn="judgeAllSelected"
				@updateCargoInfo="updateCargoInfoNoToast">
				<template v-slot:cardIcon>
					<image style="width:54rpx;height:54rpx;" src="@/static/flight-cargo.png"></image>
				</template>
				<template v-slot:cardRight="scope">
					<transfer-pulldown-card
						:arror="true"
						:show-upload="false"
						:item-ori="scope.item"
						@showBottomPopup="showBottomPopup"
						@openBottomPopup="openBottomPopup"
						@changeSwipeStatus="changeSwipeStatus"
						@openUploadImageDialog="openUploadImageDialog">
					</transfer-pulldown-card>
				</template>
			</list-content>
		</template>
		<template v-else-if="direction=='PULLSEARCH'">
			<swiper class="mySwiper" duration="200" @transition="transition">
				<swiper-item class="mySwiperItem">
					<list-content
						 ref="listContent"
						:not-id="notId"
						:showRight="showRight"
						:show-search-bar="showSearchBar"
						:content-not-null="list.length!=0"
						@clickCard="clickCard"
						@noSelectedWarn="judgeAllSelected"
						@updateCargoInfo="updateCargoInfoNoToast">
						<template v-slot:cardIcon>
							<image style="width:54rpx;height:54rpx;" src="@/static/cabin.png"></image>
						</template>
						<template v-slot:cardRight="scope">
							<distribution-cargo-card
							  :loader-list="true"
								:item-ori="scope.item"
								:show-right="showRight">
							</distribution-cargo-card>
						</template>
					</list-content>
				</swiper-item>
			</swiper>
			
		</template>
		
		<view v-if="operationType=='STATIONHANDOVER'" style="height: 70rpx;width: 100%;"></view>
		
		
		<!-- 底部操作栏 -->
		<bottom-bar
			 btn="确认选择"
			 v-if="operationType!='PULLDOWNTRANSFERSEARCH'"
			:content-not-null="list.length!=0"
			:show-search-bar="showBottomSearchBar"
			@confirm="confirm"
			@resetInputValue="resetInputValue"
			@inputGetCargoInfo="inputGetCargoInfoByFlight">
			<template v-slot:top>
				<view v-if="operationType=='STATIONHANDOVER'" class="page-bottom">
					<span class="font">
						车数:{{carSum}}
					</span>
					<span class="font">
						IFLI车数:{{IFLInumber}}
					</span>
					<span class="font">
						已截关:{{closeOffSum}}
					</span>
					<span class="font">
						已出库:{{outOfStockSum}}
					</span>
					<span class="font">
						未出库:{{notOutOfStockSum}}
					</span>
				</view>
			</template>
			<template v-slot:left>
				<bottom-bar-left-selectall
					 ref="bottomSelect"
					@selectAll="selectAll"
					@cancelSelectAll="cancelSelectAll">
				</bottom-bar-left-selectall>
			</template>
			<template v-slot:right>
				<view
					v-show="refreshFlag"
					style="margin-right: 11rpx;"
				 :class="[btnCanPress?'btn-blue':'btn-blue-light']"
				 @tap="confirm">
					 确认选择
				</view>
			</template>
		</bottom-bar>
		
		<bottom-popup-to-place
			 btn="完成修改"
			 title="选择待运区"
			 ref="bottomPopupToPlace"
			:locations-ori="locations"
			@confirm="updateWaitArea">
		</bottom-popup-to-place>
	</view>
</template>

<script>
	
	import {DIC} from '@/common/dic.js'
	import {mapActions, mapGetters} from 'vuex'
	import { debounce } from '@/common/util/util.js'
	import navBar from '@/pages/cargo/nav-input-bar.vue'
	import bottomBar from '@/pages/cargo/bottom-bar.vue'
	import cargoMixin from '@/pages/cargo/cargo-mixin.js'
	import listContent from '@/pages/cargo/list-content.vue'
	import bottomPopupToPlace from '@/pages/cargo/bottom-popup-to-place.vue'
	import transferCard from '@/pages/cargo/enterport/components/transfer-card'
	import costlySearchCard from '@/pages/cargo/costly/components/search-card.vue'
	import bottomBarLeftSelectall from '@/pages/cargo/bottom-bar-left-selectall.vue'
	import containerCard from '@/pages/cargo/leaveport/components/container-card.vue'
	import costlyTransferCard from '@/pages/cargo/costly/components/transfer-card.vue'
	import transferPulldownCard from '@/pages/cargo/pulldown/components/transfer-card.vue'
	import toWaitingAreaCard from '@/pages/cargo/leaveport/components/to-waiting-area-card.vue'
	import distributionCargoCard from '@/pages/cargo/pulldown/components/distribution-cargo-card.vue'
	import {
		getSortedData,
		getCostlySort,
		selectCostlyList,
		getShipmentAreas,
	  selectFlightList,
		getPullConfirmSort,
		getIFLInumber,
		onError
	} from '@/api/cargo/index.js'
	export default {
		mixins: [cargoMixin],
	  components: {
			navBar,
			bottomBar,
			listContent,
			transferCard,
			containerCard,
			costlySearchCard,
			toWaitingAreaCard,
			costlyTransferCard,
			bottomPopupToPlace,
			transferPulldownCard,
			distributionCargoCard,
			bottomBarLeftSelectall
		},
		data () {
			return {
				// 按下确认选择后要重定向的页面
				pageName: '',
				// D/A/PULL
				direction: '',
				// 是货站出库或者其他
				operationType: '',
				// 是否是从操作记录点进去的界面进来的
				history: false,
				listBackup: [],
				// 列表不是通过id排序的
				notId: false,
				refreshFlag: true,
				carSum: 0,
				closeOffSum: 0,
				outOfStockSum: 0,
				notOutOfStockSum: 0,
				IFLInumber: null,
				showRight: true,
				refreshRight: true,
				timer: null,
				type: '',
				locations: [],
				flightId: ''
			}
		},
		computed: {
			...mapGetters(['operationHistoryList', 'backFlag'])
		},
		onLoad (e) {
			console.log('sort-page-onload', e)
			this.getShipmentAreas()
			if (e.hasOwnProperty('history') && e.history === 'true') {
				this.history = true
			}
			this.type = e.hasOwnProperty('type') ? e.type: ''
			this.direction = e.direction
			this.pageName = e.pageName
			this.operationType = e.operationType
			this.closeOffSum = e.closeOffSum
			this.outOfStockSum = 0
			this.notOutOfStockSum = 0
			// 如果是从出港-货站出库的选择进入该页面
			if (e.operationType === 'STATIONHANDOVER') {
				this.notId = true
				this.list = uni.getStorageSync('out-stock-sort-car')
				console.log('out-stock-sort-car', this.list)
				this.$loading()
				getIFLInumber({
					flightNo: this.list[0].flight,
				  flightId: this.list[0].flightId
				}).then(res => {
					console.log('getIFLInumber', res)
					if (res.status) {
						this.IFLInumber = res.data
						this.$forceUpdate()
					}
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
				this.carSum = this.list.length
				this.list.forEach(v => {
					if (this.judgeOutOfStock(v, 'OUTOFSTOCK')) {
						this.outOfStockSum++
					} else {
						this.notOutOfStockSum++
					}
				})
				this.list.sort((a, b) => {
					if (a.status === 'NOTRECLAIMED') {
						return 1
					}else if (a.status === 'OUTOFSTOCK' && b.status === 'RECLAIMED') {
						return 1
					}
					return -1
				})
				this.list.sort((a, b) => {
					return parseInt(b.abnormal) - parseInt(a.abnormal)
				})
				let selectedContainersOri = uni.getStorageSync('sorted_list')
				let selectedContainers =  selectedContainersOri ? selectedContainersOri : []
				var that = this
				this.$nextTick(function(){
					that.$refs.listContent.setList(this.list)
					let displayList = that.$refs.listContent.getDisplayList()
					displayList.forEach(k => {
						if (selectedContainers.find(v => v.containerCode === k.containerCode)) {
							k.selected = true
						}
					})
					// 让所有卡片都显示出选择框
					that.$refs.listContent.showSelectFlagNoChange()
					// 不用generateObj
					that.$refs.listContent.setListNoChange(displayList)
				})
			} else if (e.operationType === 'PULL_CONFIRM') {
				// 如果是从拉下-拉下确认进来
				console.log('PULL_CONFIRM-onload', e)
				this.notId = true
				getPullConfirmSort({
					flight: e.flight,
					direction: e.direction
				}).then(res => {
					console.log('getPullConfirmSort', res)
					if (res.status) {
						this.list = res.data
						let selectedContainers = uni.getStorageSync('sorted_list')
						var that = this
						this.$nextTick(function(){
							that.$refs.listContent.setList(this.list)
							let displayList = that.$refs.listContent.getDisplayList()
							displayList.forEach(k => {
								if (selectedContainers.find(v => v.containerCode === k.containerCode)) {
									k.selected = true
								}
							})
							that.$refs.listContent.showSelectFlagNoChange()
							that.$refs.listContent.setListNoChange(displayList)
						})
					}
				})
			} else if (e.type === 'costly') {
				console.log('getCostlySort-onload', e)
				this.notId = true
				var that = this
				if (e.operationType !== 'TOSTATION_STEVEDORING') {
					let flight = uni.getStorageSync('costly_unload_box_flight')
					if (!flight) {
						return 
					}
					getCostlySort(flight).then(res => {
						console.log('getCostlySort', res)
						if (res.status) {
							this.list = res.data
							let selectedContainers = uni.getStorageSync('sorted_list')
							
							this.$nextTick(function(){
								this.$refs.listContent.setList(this.list)
								let displayList = that.$refs.listContent.getDisplayList()
								displayList.forEach(k => {
									if (selectedContainers.find(v => v.containerCode === k.containerCode)) {
										k.selected = true
									}
								})
								that.$refs.listContent.showSelectFlagNoChange()
								that.$refs.listContent.setListNoChange(displayList)
							})
						}
					})
				} else {
					selectCostlyList({
						operationType: 'TOSTATION_STEVEDORING',
						direction: 'A'
					}).then(res => {
						console.log('getCostlySort-TOSTATION_STEVEDORING', res)
						if (res.status) {
							this.list = res.data
							let selectedContainers = uni.getStorageSync('sorted_list')
							
							this.$nextTick(function(){
								this.$refs.listContent.setCostlyList(this.list)
								let displayList = that.$refs.listContent.getDisplayList()
								displayList.forEach(k => {
									if (selectedContainers.find(v => v.containerCode === k.containerCode)) {
										k.selected = true
									}
								})
								that.$refs.listContent.showSelectFlagNoChange()
								that.$refs.listContent.setCostlyListNoChange(displayList)
								that.judgeAllSelected()
							})
						}
					})
				}
			} else if (e.operationType === 'PULLDOWNTRANSFERSEARCH') {
				this.notId = true
				this.list = uni.getStorageSync('pulldown-transfer-search-car')
				this.list.sort((a, b) => {
					return parseInt(b.abnormal) - parseInt(a.abnormal)
				})
				let selectedContainers = uni.getStorageSync('sorted_list')
				var that = this
				this.$nextTick(function(){
					that.$refs.listContent.setList(this.list)
					let displayList = that.$refs.listContent.getDisplayList()
					displayList.forEach(k => {
						if (selectedContainers.find(v => v.containerCode === k.containerCode)) {
							k.selected = true
						}
					})
					that.$refs.listContent.setListNoChange(displayList)
				})
			} else if (e.direction === 'PULL') {
				getSortedData(e).then(res => {
					console.log('getSortedData', res)
					if (res.status) {
						let selectedContainers = uni.getStorageSync('sorted_list')
						this.list = res.data
						this.listBackup = res.data
						this.$refs.listContent.setList(this.list)
						var that = this
						this.$nextTick(function(){
							let displayList = this.$refs.listContent.getDisplayList()
							displayList.forEach(k => {
								if (selectedContainers.find(v => v.containerCode === k.containerCode)) {
									k.selected = true
								}
							})
							that.$refs.listContent.showSelectFlagNoChange()
							that.$refs.listContent.setListNoChange(displayList)
						})
					}
				})
			} else {
				selectFlightList({
					operationType: e.operationType,
					direction: e.direction
				}).then(res => {
					console.log('selectFlightList', res)
					if (res.status) {
						let selectedContainers = uni.getStorageSync('sorted_list')
						this.list = res.data
						this.listBackup = res.data
						this.$refs.listContent.setList(this.list)
						var that = this
						this.$nextTick(function(){
							let displayList = that.$refs.listContent.getDisplayList()
							displayList.forEach(k => {
								if (selectedContainers.find(v => v.containerCode === k.containerCode)) {
									k.selected = true
								}
							})
							that.$refs.listContent.showSelectFlagNoChange()
							that.$refs.listContent.setListNoChange(displayList)
						})
					}
				})
			}
		},
		
		mounted () {
			this.timer = debounce(function (event) {
				this.$loading()
				if (event.detail.dx < 0) {
					this.showRight = true
				} else {
					this.showRight = false
					if (this.pageName === 'pulldown-transfer-search') {
						this.initContainerTimelines()
					} else {
						this.initWarehouseContainerTimelines()
					}
				}				
				this.refreshRight = false
				this.$nextTick(function(){
					this.refreshRight = true
					uni.hideLoading()
				})
			}, 100)
		},
		
		methods:{
			...mapActions(['setBackFlag']),
			openBottomPopup () {
				console.log('openBottomPopup')
			},
			
			showBottomPopup () {
				console.log('showBottomPopup')
			},
			
			getShipmentAreas () {
				getShipmentAreas().then(res => {
					// console.log('getShipmentAreas', res)
					if (res.status) {
						this.locations = res.data
						this.locations.forEach(e => {
							e.name = e.code
							e.selected = false
						})
					}
				})
			},
			
			
			// 通过集装器号得到货物信息
			
			// 确认选择
			confirm () {
				if (!this.btnCanPress) {
					return
				}
				let list = this.$refs.listContent.getSelectionsNoMerge()
				uni.setStorageSync('sort-list', list)
				this.setBackFlag(true)
				if (this.operationType === 'STATIONHANDOVER') {
					uni.navigateBack({
						delta: 2
					})
				} else {
					uni.navigateBack()
				}
			},
			uploadImageBefore (e) {
				this.uploadImage(e, this.operationType)
			},
			showSelectFlag () {
				this.uni.navigateTo({
					url: ``
				})
			},
			inputGetCargoInfoByFlight (flight) {
				if (flight === '') {
					this.list = this.listBackup
					this.$refs.listContent.setList(this.list)
					return
				}
				flight = flight.toUpperCase()
				this.list = this.list.filter(e => e.flight === flight)
				this.$refs.listContent.setList(this.list)
			},
			selectAll () {
				this.$refs.listContent.selectAll()
				this.btnCanPress = true
			},
			judgeAllSelected () {
				let num = this.$refs.listContent.getNumOfNotSelected()
				this.btnCanPress = true
				if (num === 0) {
					this.$refs.bottomSelect.changeSelectAllFlag(true)
				} else {
					if (num === this.list.length) {
						this.$refs.bottomSelect.changeSelectAllFlag(false)
					}
				}
			},
			judgeOutOfStock (item, status) {
				let arrivedCondition = status
				let arrivedIndex = DIC.CARGOSTATUSD.findIndex(e => e === arrivedCondition)
				if (arrivedIndex > -1) {
					let itemIndex = DIC.CARGOSTATUSD.findIndex(e => e === item.status)
					if (itemIndex > -1) {
						if (itemIndex < arrivedIndex) {
							return false
						} else {
							return true
						}
					}
				}
			},
			// 取消全选
			cancelSelectAll () {
				this.$refs.listContent.cancelSelectAll()
				this.btnCanPress = false
			},
			
			clickCard (item) {
				let tasks = this.pageName === 'pulldown-transfer-search' ? this.initTasks(item) : this.initWarehouseTasks(item)
				uni.setStorageSync('timeline', tasks)
				uni.navigateTo({
					url: `/pages/cargo/pulldown/timeline-page`
				})
			},
			noSelectedWarn (flag) {
				// 如果一个也没选择
				if (!flag) {
					this.btnCanPress = false
				} else {
					this.btnCanPress = true
				}
			},
			
			changeBottomSelectAll (flag) {
				this.$refs.bottomSelect.changeSelectAllFlag(flag)
			}
		}
	}
</script>


<style lang="scss" scoped>
	.btn-blue {
		width: 206rpx;
		height: 69rpx;
		background-color: #008ffd;
		border-radius: 35rpx;
		
		line-height: 69rpx;
		text-align: center;
		font-family: SourceHanSansSC-Regular;
		font-size: 33rpx;
		letter-spacing: 2rpx;
		color: #ffffff;
	}
	
	.btn-blue-light {
		opacity: 0.3;
		width: 206rpx;
		height: 69rpx;
		background-color: #008ffd;
		border-radius: 35rpx;
		
		line-height: 69rpx;
		text-align: center;
		font-family: SourceHanSansSC-Regular;
		font-size: 33rpx;
		letter-spacing: 2rpx;
		color: #ffffff;
	}
	
	.page-bottom {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		position: fixed;
		bottom: 100rpx;
		width: 100vw;
		padding: 12rpx 0;
		background-color: #fff;
		.font {
			margin-right: 10rpx;
			font-weight: 900;
			font-size: 35rpx;
		}
	}
	
	
	.mySwiper {
		height: calc(100vh - 44px);
	}
	.mySwiperItem {
		padding:0 15rpx;
		display: flex;
	}
</style>

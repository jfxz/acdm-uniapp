<template>
	<view>
		<!-- 导航栏 -->
		<nav-bar
			 title="操作记录"
			:content-not-null="true"
			:input-value="inputValue"
			:clear-after-input="false"
			:show-search-bar="showSearchBar"
			:load-receive="true"
			@inputGetCargoInfo="inputGetCargoInfo"
			@resetInputValue="resetSearch">
			<template v-slot:right>
				<view slot="right" class="nav-bar-right">
					<image v-if="type!='costly'&&direction!='PULL'"
					  src="/static/operation-history-search.png"
					 @tap="search">
					</image>
				</view>
			</template>
		</nav-bar>
		
		<view class="content" :style="{'margin-top': showSearchBar?'140rpx': '0'}" v-if="list.length>0">
			<block v-for="item in list" :key="item.id">
				<view class="list-item" @tap="showDetails(item)">
					<view class="left">
						<image src="@/static/operation-history-icon.png"></image>
						<view>{{item.code}}</view>
					</view>
					<view class="right">
						<image src="@/static/right-arror.png"></image>
						<view>{{formatter(item.operateTime)}}</view>
					</view>
				</view>
				<view v-if="item.showCargos" class="list-item-cargos">
					<!-- <block v-for="(cargo, index) in item.cargos" :key="index">
						<container-card
							:item-ori="cargo">
						</container-card>
					</block> -->
					<view class="list-item-cargos-btns">
						<view class="list-item-cargos-btns-right">
							<image src="@/static/scan-cargo-blue.png" @click="scanCode(item)"></image>
							<image
							  src="@/static/input-cargo-blue.png"
							  style="width:30rpx;height:43rpx;"
							 @tap="changeSearchBarStatus(item)">
							</image>
							<image src="@/static/sort-cargo-blue.png" @tap="showSelectFlag(item)"></image>
						</view>
					</view>
					<view class="search" v-if="item.showSearchBar">
						<view class="search-input">
							<input
								confirm-type="search"
								style="width: 92%;"
								v-model="item.inputValueInner"
							 :placeholder="placeHolder"
							 @input="changeInputValue(item)"
							 @confirm="inputSearch(item)"/>
							<image
								v-if="item.inputValueInner!=''"
								style="height:40rpx;width:40rpx;"
								src="@/static/input-delete-grey.png"
							 @tap="resetInputValue(item)">
							</image>
						</view>
						<view class="btn" @tap="inputSearch(item)">确定</view>
					</view>
					<uni-swipe-action
						style="margin-top: 20rpx;">
						<uni-swipe-action-item
							 v-for="(cargo, index) in item.cargos"
							:disabled="swiperStatus"
							:right-options="swipeOptions"
							:key="cargo.id"
							@click="removeCard($event, index, cargo)">
							<view class="item">
								<view class="item-padding-middle" style="padding-top: 15rpx;">
									<template v-if="cargo.containerType=='0'">
										<image style="height:54rpx;width:54rpx;" src="@/static/box.png"></image>
									</template>
									<template v-else-if="cargo.containerType=='1'">
										<image style="height:54rpx;width:54rpx;" src="@/static/board.png"></image>
									</template>
									<template v-else>
										<image style="height:54rpx;width:54rpx;" src="@/static/container.png"></image>
									</template>
								</view>
								
								<view class="item-padding-right">
									<template v-if="pageName=='out-stock'">
										<container-card
											:item-ori="cargo"
											:show-upload="false">
										</container-card>
									</template>
									<template v-else-if="type=='costly'">
										<costly-transfer-card
											:item="cargo"
											:show-upload="false">
										</costly-transfer-card>
									</template>
									<template v-else-if="direction=='PULL'">
										<pull-transfer-card
											:item-ori="cargo"
											:show-upload="false">
										</pull-transfer-card>
									</template>
									<template v-else-if="direction=='D'&&(pageName=='to-waiting-area-stevedoring'||pageName=='to-aircraft-stevedoring')">
										<to-waiting-area-card
											:item-ori="cargo"
											:operationHistory="true"
											:show-upload="false"
											@changeSwipeStatus="changeSwipeStatus">
										</to-waiting-area-card>
									</template>
									<template v-else-if="direction=='A'&&(pageName=='to-waiting-area-stevedoring'||pageName=='to-cargo-station-stevedoring')">
										<transfer-card
											:operation-history="true"
											:first="pageName=='to-waiting-area-stevedoring'"
											:show-upload="false"
											:item-ori="cargo">
										</transfer-card>
									</template>
								</view>
							</view>
						</uni-swipe-action-item>
					</uni-swipe-action>
				</view>
				<view class="border-line"></view>
			</block>
		</view>
		<u-loadmore style="padding-bottom: 30rpx;" :status="loadStatus" @loadmore="getBatchOrder"/>
		<u-modal
			 v-model="showModal"
			:content="modalContent"
			:show-cancel-button="true"
			@confirm="modalConfirm">
		</u-modal>
	</view>
</template>

<script>
	import navBar from '@/pages/cargo/nav-bar.vue'
	import containerCard from '@/pages/cargo/leaveport/components/container-card.vue'
	import toWaitingAreaCard from '@/pages/cargo/leaveport/components/to-waiting-area-card.vue'
	import transferCard from '@/pages/cargo/enterport/components/transfer-card.vue'
	import costlyTransferCard from '@/pages/cargo/costly/components/transfer-card.vue'
	import pullTransferCard from '@/pages/cargo/pulldown/components/transfer-card.vue'
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
	import {
		getCargoInfo,
	  getBatchOrder,
		getBatchOrderInfo,
		getPulldownBatchOrder,
		getPulldownBatchOrderInfo,
		getCostlyHistoryBatchs,
		getCostlyHistoryCargoInfo,
		searchOperationHistory,
		removeFromBatch,
		removePulldownFromBatch,
		removeCostlyFromBatch,
		removeUnloaderContainer,
		addFromBatch,
		addPulldownFromBatch,
		addCostlyFromBatch,
		onError
	} from '@/api/cargo/index.js'
	import {mapActions, mapGetters} from 'vuex'
	import { validatenull } from '@/common/util/validate.js'
	import { debounce } from '@/common/util/util.js'
	export default {
		components: {
			navBar,
			containerCard,
			uniSwipeAction,
			uniSwipeActionItem,
			toWaitingAreaCard,
			transferCard,
			costlyTransferCard,
			pullTransferCard
		},
		props: {
			
		},
		data () {
			return {
				// 获取历史批次单
				getBatchOrderForm: {
					type: '',
					direction: 'D',
					operationType: '',
					pageNumber: 0,
					pageSize: 50
				},
				// 获取操作过的历史批次单包含的货物信息
				getBatchOrderInfoForm: {
					batchOrderId: '',
					operationType: ''
				},
				list: [],
				// 记载情况。可选值：loadmore,loading,nomore
				loadStatus: 'loadmore',
				// 进港还是出港 enterport、leaveport
				direction: '',
				// 是从哪一个步骤进入操作记录的
				operationType: '',
				// 要跳转的页面的名字
				pageName: '',
				inputValue: '',
				showSearchBar: false,
				firstFlag: true,
				swipeOptions: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				showModal: false,
				modalContent: '',
				removedCard: {},
				placeHolder: '请输入集装器号',
				inputValueInner: '',
				type: '',
				flight: '',
				swiperStatus: false,
				currentBatchId: ''
			}
		},
		computed: {
			...mapGetters(['operationHistoryList', 'backFlag'])
		},
		onShow () {
			this.getBatchOrderForm.pageNumber = 0
			this.list = []
			this.firstFlag = true
			if (this.getBatchOrderForm.direction !== 'PULL'&&this.getBatchOrderForm.type !== 'costly') {
				this.getBatchOrder()
			} else if (this.getBatchOrderForm.type === 'costly') {
				this.getCostlyBatchOrder()
			} else {
				this.getPulldownBatchOrder()
			}
		},
		onLoad (e) {
			this.getBatchOrderForm.operationType = e.operationType
			this.getBatchOrderInfoForm.operationType = e.operationType
			this.operationType = e.operationType
			this.pageName = e.pageName
			this.direction = e.direction
			this.getBatchOrderForm.direction = e.direction
			this.getBatchOrderForm.type = e.type
			this.type = e.type
			this.portDirection = e.portDirection
			this.flight = e.flight
		},
		onReachBottom () {
			if (this.inputValue === '') {
				this.getBatchOrder()
			}
		},
		methods: {
			...mapActions(['setOperationHistoryList', 'setBackFlag']),
			// 是否禁止卡片左滑删除
			changeSwipeStatus () {
				this.swipeStatus = !this.swipeStatus
			},
			resetInputValue (item) {
				item.inputValueInner = ''
				this.$forceUpdate()
			},
			changeInputValue: debounce(function (batch) {
				this.$forceUpdate()
			}, 100),
			inputSearch (batch) {
				this.addFromBatch(batch)
			},
			addFromBatch (batch, uld) {
				let containerCode = uld? uld : batch.inputValueInner
				console.log('addFromBatch-code', containerCode)
				console.log('addFromBatch-Batch', batch)
				var addForm = {
					uld: containerCode,
					batchOrderId: batch.id,
					operationType: this.operationType,
					direction: this.direction
				}
				this.$loading()
				let addBatch = null
				if (this.type === 'costly') {
					addBatch = addCostlyFromBatch
				} else if (this.direction === 'PULL') {
					addBatch = addPulldownFromBatch
				} else {
					addBatch = addFromBatch
				}
				console.log('addForm', addForm)
				addBatch(addForm).then(res => {
					console.log('addFormBatchRes', res)
					if (res.status) {
						this.scanSound()
						uni.vibrateLong()
						let list = res.data.map(e => {
							return {
								...this.generateObj(e),
								batchOrderId: batch.id,
								showSelectFlag: false
							}
						})
						batch.cargos = [...list]
						console.log('batch.cargos', batch.cargos.map(e => e.batchOrderId))
						this.$forceUpdate()
					}
					this.$message(res.message)
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
				batch.inputValueInner = ''
				this.$forceUpdate()
			},
			refreshBatch (batch) {
				let idx = this.list.findIndex(e => e.id === batch.id)
				if (idx > -1) {
					this.list.splice(idx, 1, batch)
				}
			},
			generateObj (obj) {
				return {
					images: [],
					images2: [],
					selectedPicNums: 0,
					showItem: true,
					selected: false,
					pass: false,
					...obj,
					carNumber: 0,
					boxNumber: 0,
					boardNumber: 0,
					containerTypes: []
				}
			},
			resetSearch () {
				this.firstFlag = true
				this.inputValue = ''
				this.getBatchOrderForm.pageNumber = 0
				this.list = []
				this.$loading()
				if (this.getBatchOrderForm.direction !== 'PULL'&&this.getBatchOrderForm.type !== 'costly') {
					this.getBatchOrder()
				} else if (this.getBatchOrderForm.type === 'costly') {
					this.getCostlyBatchOrder()
				} else {
					this.getPulldownBatchOrder()
				}
			},
			inputGetCargoInfo (inputValue) {
				this.loadStatus = 'loading'
				let reg = new RegExp('[a-zA-Z]', 'g')
				let result = reg.test(inputValue)
				if (!result) {
					// 如果输入值不包含字母
					inputValue = 'CAR' + inputValue + 'GN'
				} else {
					inputValue = inputValue.toUpperCase()
				}
				this.inputValue = inputValue
				console.log('inputvALUE', inputValue)
				searchOperationHistory({
				  uld: inputValue,
					operationType: this.getBatchOrderInfoForm.operationType
				}).then(res => {
					console.log('searchOperationHistory', res)
					if (res.status && res.data) {
						this.list = res.data
						if (this.list && this.list.length > 0) {
							this.getBatchOrderInfo({
								batchOrderId: this.list[0].id,
								operationType: this.operationType
							})
						}
					}
					this.$message(res.message)
					this.loadStatus = 'nomore'
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
			},
			search () {
				this.showSearchBar = !this.showSearchBar
			},
			// 格式化时间
			formatter (time) {
				let timeAfter = ''
				if (time) {
					timeAfter = time.substr(11, 16)
				}
				return timeAfter
			},
			initList () {
				this.list.forEach(e => {
					e.showCargos = false
					e.showSearchBar = false
					e.inputValueInner = ''
					e.cargos = []
				})
			},
			getBatchOrder () {
				var that = this
				this.loadStatus = 'loading'
				getBatchOrder(this.getBatchOrderForm).then(res => {
					console.log('getBatchOrder', res)
					if (res.data.content.length === 0) {
						this.loadStatus = 'nomore'
					} else {
						this.list = [...this.list, ...res.data.content]
						this.initList()
						if (this.firstFlag) {
							let addList = uni.getStorageSync('sort-list')
							if (addList) {
								uni.removeStorageSync('sort-list')
								console.log('zhege', this.currentBatchId)
								let promiseArr = []
								addList.forEach(e => {
									let addForm = {
										uld: e.containerCode,
										batchOrderId: this.currentBatchId,
										operationType: this.operationType,
										direction: this.direction
									}
									let promise = function () {
										return addFromBatch(addForm).then(res => {
											console.log('addFormBatchRes', res)
											that.$message(res.message)
											uni.hideLoading()
										}).catch(err => {
											onError(err)
										})
									}
									promiseArr.push(promise)
								})
								let begin = new Date().getTime()
								let result = Promise.allSettled(promiseArr.map(e => e()))
								result.then(res => {
									console.log('resulttttttttt-ar', res)
									that.currentBatchId = ''
									this.getBatchOrderInfo({
										batchOrderId: this.list[0].id,
										operationType: this.operationType
									})
								})
							} else {
								this.getBatchOrderInfo({
									batchOrderId: this.list[0].id,
									operationType: this.operationType
								})
							}
							this.firstFlag = false
						}
						this.loadStatus = 'loadmore'
						this.getBatchOrderForm.pageNumber++
					}
				})
			},
			getCostlyBatchOrder () {
				var that = this
				this.loadStatus = 'loading'
				getCostlyHistoryBatchs(this.getBatchOrderForm).then(res => {
					console.log('getBatchOrder', res)
					if (res.data.content.length === 0) {
						this.loadStatus = 'nomore'
					} else {
						this.list = [...this.list, ...res.data.content]
						this.initList()
						if (this.firstFlag) {
							let addList = uni.getStorageSync('sort-list')
							if (addList) {
								uni.removeStorageSync('sort-list')
								console.log('zhege', this.currentBatchId)
								let promiseArr = []
								addList.forEach(e => {
									let addForm = {
										uld: e.containerCode,
										batchOrderId: this.currentBatchId,
										operationType: this.operationType,
										direction: this.direction
									}
									let promise = function () {
										return addCostlyFromBatch(addForm).then(res => {
											console.log('addFormBatchRes', res)
											that.$message(res.message)
											uni.hideLoading()
										}).catch(err => {
											onError(err)
										})
									}
									promiseArr.push(promise)
								})
								let begin = new Date().getTime()
								let result = Promise.allSettled(promiseArr.map(e => e()))
								result.then(res => {
									that.currentBatchId = ''
									this.getCostlyBatchOrderInfo({
										batchOrderId: this.list[0].id,
										operationType: this.operationType
									})
								})
							} else {
								this.getCostlyBatchOrderInfo({
									batchOrderId: this.list[0].id,
									operationType: this.operationType
								})
							}
							this.firstFlag = false
						}
						this.loadStatus = 'loadmore'
						this.getBatchOrderForm.pageNumber++
					}
				})
			},
			// 拉下货物获得历史批次单
			getPulldownBatchOrder () {
				var that = this
				this.loadStatus = 'loading'
				getPulldownBatchOrder(this.getBatchOrderForm).then(res => {
					console.log('getBatchOrder', res)
					if (res.data.content.length === 0) {
						this.loadStatus = 'nomore'
					} else {
						this.list = [...this.list, ...res.data.content]
						this.initList()
						if (this.firstFlag) {
							let addList = uni.getStorageSync('sort-list')
							if (addList) {
								uni.removeStorageSync('sort-list')
								console.log('zhege', this.currentBatchId)
								let promiseArr = []
								addList.forEach(e => {
									let addForm = {
										uld: e.containerCode,
										batchOrderId: this.currentBatchId,
										operationType: this.operationType,
										direction: this.direction
									}
									let promise = function () {
										return addPulldownFromBatch(addForm).then(res => {
											console.log('addFormBatchRes', res)
											that.$message(res.message)
											uni.hideLoading()
										}).catch(err => {
											onError(err)
										})
									}
									promiseArr.push(promise)
								})
								let begin = new Date().getTime()
								let result = Promise.allSettled(promiseArr.map(e => e()))
								result.then(res => {
									that.currentBatchId = ''
									this.getPulldownBatchOrderInfo({
										batchOrderId: this.list[0].id,
										operationType: this.operationType
									})
								})
							} else {
								this.getPulldownBatchOrderInfo({
									batchOrderId: this.list[0].id,
									operationType: this.operationType
								})
							}
							this.firstFlag = false
						}
						this.loadStatus = 'loadmore'
						this.getBatchOrderForm.pageNumber++
					}
				})
			},
			getBatchOrderInfo (form, flag = false) {
				this.$loading()
				getBatchOrderInfo(form).then(res => {
					console.log('getBatchOrderInfo', res)
					if (res.status) {
						if (validatenull(res.data)) {
							if (flag) {
								this.$message('该操作记录数据为空')
							}
						} else {
							let index = this.list.findIndex(e => e.id === form.batchOrderId)
							console.log('index', index)
							let batch = this.list[index]
							batch.cargos = res.data
							batch.cargos.forEach(e => {
								e.batchOrderId = batch.id
								e.showSelectFlag = false
							})
							batch.showCargos = true
							if (index > -1) {
								this.list.splice(index, 1, batch)
							}
						}
					}
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
			},
			
			getPulldownBatchOrderInfo (form) {
				console.log('getPulldownBatchOrderInfo-form', form)
				this.$loading()
				getPulldownBatchOrderInfo(form).then(res => {
					console.log('getBatchOrderInfo', res)
					if (res.status) {
						if (validatenull(res.data)) {
							this.$message('该操作记录数据为空')
						} else {
							let index = this.list.findIndex(e => e.id === form.batchOrderId)
							console.log('index', index)
							let batch = this.list[index]
							batch.cargos = res.data
							batch.cargos.forEach(e => {
								e.batchOrderId = batch.id
								e.showSelectFlag = false
							})
							batch.showCargos = true
							if (index > -1) {
								this.list.splice(index, 1, batch)
							}
							this.$forceUpdate()
						}
					}
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
			},
			
			getCostlyBatchOrderInfo (form) {
				this.$loading()
				getCostlyHistoryCargoInfo(form).then(res => {
					console.log('getCostlyHistoryBatchs', res)
					if (res.status) {
						if (validatenull(res.data)) {
							this.$message('该操作记录数据为空')
						} else {
							let index = this.list.findIndex(e => e.id === form.batchOrderId)
							console.log('index', index)
							let batch = this.list[index]
							batch.cargos = res.data
							batch.cargos.forEach(e => {
								e.batchOrderId = batch.id
								e.showSelectFlag = false
							})
							batch.showCargos = true
							if (index > -1) {
								this.list.splice(index, 1, batch)
							}
						}
					}
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
			},
			
			showDetails (row) {
				if (row.showCargos) {
					row.showCargos = false
					let index = this.list.findIndex(e => e.id === row.id)
					if (index > -1) {
						this.list.splice(index, 1, row)
					}
					return
				}
				let {id: batchOrderId, operationType} = {...row}
				this.getBatchOrderInfoForm = {
					batchOrderId,
					operationType
				}
				if (this.getBatchOrderForm.direction === 'PULL') {
					this.getPulldownBatchOrderInfo(this.getBatchOrderInfoForm)
				} else if (this.getBatchOrderForm.type === 'costly') {
					this.getCostlyBatchOrderInfo(this.getBatchOrderInfoForm)
				} else {
					this.getBatchOrderInfo(this.getBatchOrderInfoForm, true)
				}
			},
			
			modalConfirm () {
				// 删除该元素
				let list = []
				let removeStorageFlag = false
				if (this.operationType === 'TOSTATION_STEVEDORING') {
					// 进港 交接运往货站
					list = uni.getStorageSync('arrivedEnterStation')
				} else if (this.direction === 'A' && this.operationType === 'TOWAITINGAREA_STEVEDORING') {
					// 进港 交接运往待运区
					list = uni.getStorageSync('arrivedEnterWaitingArea')
				} else if (this.direction === 'D' && this.operationType === 'TOWAITINGAREA_STEVEDORING') {
					// 出港 交接运往待运区
					list = uni.getStorageSync('arrivedLeaveWaitingArea')
				} else if (this.operationType === 'TOAIRCRAFT_STEVEDORING') {
					// 进港 交接运往机位
					list = uni.getStorageSync('arrivedLeaveAircraft')
				} 
				
				let batch = this.list.find(e => e.id === this.removedCard.batchOrderId)
				let cargos = []
				if (batch) {
					cargos = batch.cargos
					if (list && list.length !== 0) {
						let result = list.find(e => cargos.find(v => v.containerCode === e.containerCode))
						if (result) {
							// 说明同一个步骤的拖车司机缓存的数据正是当前操作的历史批次
							removeStorageFlag = true
						}
					}
				}
				if (this.removedCard.id) {
					let removeFromBatch1 = null
					if (this.costly) {
						removeFromBatch1 = removeCostlyFromBatch
					} else {
						removeFromBatch1 = this.direction === 'PULL' ? removePulldownFromBatch : removeFromBatch
					}
					let removeForm = {
						direction: this.direction,
						operationType: this.operationType,
						batchOrderId: this.removedCard.batchOrderId,
						id: this.removedCard.id,
						uld: this.removedCard.containerCode
					}
					console.log('removeForm', removeForm)
					removeFromBatch1(removeForm).then(res => {
						if (res.status) {
							let index = this.list.findIndex(e => e.id === this.removedCard.batchOrderId)
							if (index > -1) {
								this.list.splice(index, 1)
								if (removeStorageFlag) {
									if (this.operationType === 'TOSTATION_STEVEDORING') {
										// 进港 交接运往货站
										uni.removeStorageSync('arrivedEnterStation')
									} else if (this.direction === 'A' && this.operationType === 'TOWAITINGAREA_STEVEDORING') {
										// 进港 交接运往待运区
										uni.removeStorageSync('arrivedEnterWaitingArea')
									} else if (this.direction === 'D' && this.operationType === 'TOWAITINGAREA_STEVEDORING') {
										// 出港 交接运往待运区
										uni.removeStorageSync('arrivedLeaveWaitingArea')
									} else if (this.operationType === 'TOAIRCRAFT_STEVEDORING') {
										// 进港 交接运往机位
										uni.removeStorageSync('arrivedLeaveAircraft')
									}
								}
							}
						}
						this.$message(res.message)
					})
				}
			},
			
			scanSound () {
				const innerAudioContext = uni.createInnerAudioContext()
				innerAudioContext.autoplay = true
				innerAudioContext.src = 'static/' + 'scan-sound' + '.mp3'
				innerAudioContext.onPlay(() => {
				  console.log('开始播放')
				})
			},
			
			removeCard (content, index, cargo) {
				console.log('removeCard', content, index, cargo)
				let removedCard = cargo
				this.removedCard = {...removedCard}
				let list = []
				let removeStorageFlag = false
				if (this.operationType === 'TOSTATION_STEVEDORING') {
					// 进港 交接运往货站
					list = uni.getStorageSync('arrivedEnterStation')
				} else if (this.direction === 'A' && this.operationType === 'TOWAITINGAREA_STEVEDORING') {
					// 进港 交接运往待运区
					list = uni.getStorageSync('arrivedEnterWaitingArea')
				} else if (this.direction === 'D' && this.operationType === 'TOWAITINGAREA_STEVEDORING') {
					// 出港 交接运往待运区
					list = uni.getStorageSync('arrivedLeaveWaitingArea')
				} else if (this.operationType === 'TOAIRCRAFT_STEVEDORING') {
					// 进港 交接运往机位
					list = uni.getStorageSync('arrivedLeaveAircraft')
				} 
				
				let batch = this.list.find(e => e.id === removedCard.batchOrderId)
				let cargos = []
				if (batch) {
					cargos = batch.cargos
					if (list && list.length !== 0) {
						let result = list.find(e => cargos.find(v => v.containerCode === e.containerCode))
						if (result) {
							// 说明同一个步骤的拖车司机缓存的数据正是当前操作的历史批次
							removeStorageFlag = true
						}
					}
				}
				
				if (cargos.length === 1) {
					this.showModal = true
					this.modalContent = '删除最后一条后将删除该批次'
				} else {
					// 删除该元素
					// 如果被删除的元素id不为空
					
					if (removedCard.id) {
						let removeFromBatch1 = null
						if (this.costly) {
							removeFromBatch1 = removeCostlyFromBatch
						} else {
							removeFromBatch1 = this.direction === 'PULL' ? removePulldownFromBatch : removeFromBatch
						}
						let removeForm = {
							direction: this.direction,
							operationType: this.operationType,
							batchOrderId: removedCard.batchOrderId,
							id: removedCard.id,
							uld: removedCard.containerCode
						}
						console.log('removeForm', removeForm)
						removeFromBatch1(removeForm).then(res => {
							console.log('delete-res', res)
							if (res.status) {
								let index = this.list.findIndex(e => e.id === removedCard.batchOrderId)
								if (index > -1) {
									let cargoIdx = this.list[index].cargos.findIndex(e => e.containerCode === removedCard.containerCode)
									if (cargoIdx > -1) {
										this.list[index].cargos.splice(cargoIdx, 1)
										this.$forceUpdate()
										if (removeStorageFlag) {
											if (this.operationType === 'TOSTATION_STEVEDORING') {
												// 进港 交接运往货站
												uni.setStorageSync('arrivedEnterStation', this.list[index].cargos)
											} else if (this.direction === 'A' && this.operationType === 'TOWAITINGAREA_STEVEDORING') {
												// 进港 交接运往待运区
												uni.setStorageSync('arrivedEnterWaitingArea', this.list[index].cargos)
											} else if (this.direction === 'D' && this.operationType === 'TOWAITINGAREA_STEVEDORING') {
												// 出港 交接运往待运区
												uni.setStorageSync('arrivedLeaveWaitingArea', this.list[index].cargos)
											} else if (this.operationType === 'TOAIRCRAFT_STEVEDORING') {
												// 进港 交接运往机位
												uni.setStorageSync('arrivedLeaveAircraft', this.list[index].cargos)
											}
										}
									}
								}
							}
							this.$message(res.message)
						})
					}
				}
			},
			
			scanCode: debounce(function (item) {
				var that = this
				uni.scanCode({
					scanType: ['barCode', 'qrCode'],
					onlyFromCamera: false,
					success: function (res) {
						console.log('scancode' + res)
						that.$loading()
						console.log('条码类型：' + res.scanType)
						console.log('条码内容：' + res.result)
						let arr = res.result.split('#')
						let uld = ''
						if (arr.length > 1) {
							uld = arr[0].slice(5)
						} else {
							uld = arr[0]
						}
						that.addFromBatch(item, uld)
					}
				})
			}, 300),
			
			changeSearchBarStatus: debounce(function (item) {
				item.showSearchBar = !item.showSearchBar
				// 刷新
				this.$forceUpdate()
			}, 100),
			
			showSelectFlag: debounce(function (item) {
				this.currentBatchId = item.id
				console.log('showSelectFlaghh', item)
				let operationType = this.operationType
				let direction = this.direction
				let pageName = this.pageName
				let portDirection = this.portDirection
				let flight = this.flight
				let type = this.type
				if (this.operationType === 'STATIONHANDOVER') {
					uni.setStorageSync('sorted_list', item.cargos)
					uni.navigateTo({
						url: `/pages/cargo/leaveport/out-stock-sort`
					})
				} else {
					uni.navigateTo({
						url: `/pages/cargo/sort-page?operationType=${operationType}&direction=${direction}&pageName=${pageName}&portDirection=${portDirection}&flight=${flight}&type=${type}&history=true`
					})
				}
			}, 300)
		}
	}
</script>

<style lang="scss" scoped>
	$imageSize: 30rpx;
	.nav-bar-right {
		image {
			width: 40rpx;
			height: 40rpx;
		}
		width: calc(100% - 180rpx);
		display: flex;
		flex-direction: row-reverse;
	}
	.content {
		.list-item-cargos {
			width: 100%;
			background-color: #fff;
		}
		.list-item {
			padding: {
				top: 30rpx;
				bottom: 30rpx;
				left: 30rpx;
			}
			background-color: #ffffff;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.left {
				display: flex;
				align-items: center;
				image {
					width: $imageSize;
					height: $imageSize;
				}
			}
			.right {
				display: flex;
				align-items: center;
				flex-direction: row-reverse;
				image {
					width: $imageSize;
					height: $imageSize;
					margin-right: 30rpx;
					margin-left: 30rpx;
				}
			}
		}
		.border-line {
			width: 100%;
			height: 1rpx;
			color: #f9f9f9
		}
	}
	
	.item {
		display: flex;
		align-items: center;
		width: calc(100vw - 40rpx);
		background-color: #ffffff;
		padding: 21rpx 13rpx 0 22rpx;
		.item-padding-left {
			margin-right: 10rpx;
			.select {
				height: 35rpx;
				width: 35rpx;
			}
		}
		.item-padding-middle {
			align-self: flex-start;
			margin-right: 17rpx;
			image {
				height: 54rpx;
				width: 54rpx;
			}
		}
		.item-padding-right {
			width: 100%;
		}
	}
	.list-item-cargos-btns {
		display: flex;
		flex-direction: row-reverse;
		.list-item-cargos-btns-right {
			display: flex;
			margin-right: 20rpx;
			image {
				width: 42rpx;
				height: 42rpx;
				margin-left: 20rpx;
			}
		}
	}
	
	.search {
		display: flex;
		height: 85rpx;
		margin: 33rpx 20rpx 30rpx 20rpx;
		.search-input {
			width: calc(100vw - 196rpx);
			background-color: #e9e9e9;
			font-size: 30rpx;
			color: #A8ABB8;
			display: flex;
			align-items: center;
			padding-left: 33rpx;
		}
		.btn {
			width: 157rpx;
			background-color: #18BD52;
			text-align: center;
			line-height: 85rpx;
			font-size: 32rpx;
			font-family: SourceHanSansSC-Regular;
			font-size: 32rpx;
			letter-spacing: 2rpx;
			color: #fefefe;
		}
	}
</style>

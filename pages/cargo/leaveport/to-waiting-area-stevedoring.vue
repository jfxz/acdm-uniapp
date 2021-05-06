/*
* 界面名称:交接运往待运区（装卸押运）
* 界面功能:
* 其他    :
* 时间    :2020-8-15 09:57:40
* 作者    :gyb
*/
<template>
	<view>
		<!-- 导航栏 -->
		<nav-bar
			 title="交接运往待运区"
			:content-not-null="list.length!=0"
			:show-search-bar="showSearchBar"
			:input-value="inputValue"
			:show-operation-history="showOperationHistory"
			:showSort="true"
			:operation-obj="operationObj"
			@scanCode="scanCode"
			@resetInputValue="resetInputValue"
			@inputGetCargoInfo="inputGetCargoInfoDebounce"
			@changeSearchBarStatus="changeSearchBarStatus"
			@showSelectFlag="showSelectFlag"
			@openOperaionHistory="openOperaionHistory">
		</nav-bar>
		
		<!-- 内容 -->
		<list-content
			 ref="listContent"
			 to-place="waitingArea"
			 direction="D"
			 operation-type="TOWAITINGAREA_STEVEDORING"
			:merge-flag="true"
			:content-not-null="list.length!=0"
			:show-search-bar="showSearchBar"
			:history="history"
			:remove-flag="true"
			:batch-order-id="batchOrderId"
			@updateCargoInfo="updateCargoInfoNoToast"
			@updateList="updateList">
			<template v-slot:cardIcon>
				<image style="width:54rpx;height:54rpx;" src="@/static/flight-cargo.png"></image>
			</template>
			<template v-slot:cardRight="scope">
				<to-waiting-area-card
					:item-ori="scope.item"
					@uploadImage="uploadImageBefore"
					@openBottomPopup="openBottomPopup"
					@showBottomPopup="showBottomPopup"
					@changeSwipeStatus="changeSwipeStatus"
					@openUploadImageDialog="openUploadImageDialog">
				</to-waiting-area-card>
			</template>
		</list-content>
		
		<!-- 底部操作栏 -->
		<bottom-bar
			 btn="确认交接"
			:content-not-null="list.length!=0"
			:show-search-bar="showBottomSearchBar"
			@inputGetCargoInfo="inputGetCargoInfo"
			@resetInputValue="resetInputValue"
			@confirm="confirm">
			<!-- 左侧操作选项-->
			<template v-slot:left>
				<bottom-bar-left-scan
					:show-sort="true"
					@changeSearchBarStatus="changeBottomSearchBarStatus"
					@scanCode="scanCode"
					@showSelectFlag="showSelectFlag">
				</bottom-bar-left-scan>
			</template>
			<template v-if="!showOperationHistory" v-slot:right>
				<view></view>
			</template>
		</bottom-bar>
		
		<bottom-popup-to-place
			 ref="bottomPopupToPlace"
			 title="选择待运区"
			 btn="完成修改"
			:locations-ori="locations"
			@confirm="updateWaitArea">
		</bottom-popup-to-place>
		
		<bottom-popup-details
			 ref="bottomPopupDetails"
			 title="集装器">
		</bottom-popup-details>
		
		<upload-image-dialog
			 ref="uploadImageDialog"
			@uploadImage="uploadImageBefore"
			@refresh="refresh">
		</upload-image-dialog>
		
		<not-received-containers
			topTitle="集装器需直接运往机位"
			middleText="集装器需直接运往机位"
			confirmText="确认"
			ref="notReceivedContainers">
		</not-received-containers>
		
		<cargo-remind-dialog
			ref="cargoRemindDialog">
		</cargo-remind-dialog>
	</view>
</template>

<script>
	import navBar from '@/pages/cargo/nav-bar.vue'
	import listContent from '@/pages/cargo/list-content.vue'
	import bottomBar from '@/pages/cargo/bottom-bar.vue'
	import toWaitingAreaCard from '@/pages/cargo/leaveport/components/to-waiting-area-card.vue'
	import bottomBarLeftScan from '@/pages/cargo/bottom-bar-left-scan.vue'
	import bottomPopupToPlace from '@/pages/cargo/bottom-popup-to-place.vue'
	import bottomPopupDetails from '@/pages/cargo/bottom-popup-details.vue'
	import uploadImageDialog from '@/pages/cargo/upload-image-dialog.vue'
	import notReceivedContainers from '@/pages/cargo/leaveport/components/not-received-containers.vue'
	import cargoMixin from '@/pages/cargo/cargo-mixin.js'
	import { validatenull } from '@/common/util/validate.js'
	import {
		getCargoInfo,
		confirm,
		updateCargoInfo,
		addFromBatch,
		updateStandCode,
		onError
	} from '@/api/cargo/index.js'
	import cargoRemindDialog from '@/pages/cargo/cargo-remind-dialog.vue'
	import { debounce } from '@/common/util/util.js'
	export default {
		mixins: [cargoMixin],
	  components: {
			navBar,
			listContent,
			bottomBar,
			toWaitingAreaCard,
			bottomBarLeftScan,
			bottomPopupToPlace,
			bottomPopupDetails,
			uploadImageDialog,
			notReceivedContainers,
			cargoRemindDialog
		},
		data () {
			return {
				cargoInfoForm: {
					// 集装器编码
					uld: '',
					// 方向 出港为D
					direction: 'D',
					// 操作类型 TOWAITINGAREA_STEVEDORING
					operationType: 'TOWAITINGAREA_STEVEDORING'
				},
				// 确认出库需要提交的表单信息
				confirmForm: {
					// 货物信息
					cargos: [],
					// 方向
					direction: 'D',
					// 操作类型
					operationType: 'TOWAITINGAREA_STEVEDORING'
				},
				showOperationHistory: true,
				operationObj: {
					pageName: 'to-waiting-area-stevedoring',
					operationType: 'TOWAITINGAREA_STEVEDORING',
					direction: 'D'
				},
				batchOrderId: '',
				interval: null
			}
		},
		onBackPress () {
			if (!this.showOperationHistory) {
				return
			}
			if (!this.completedLeaveToWaitingArea) {
				console.log('onBackPress-alength', this.list.length)
				uni.setStorageSync('completedLeaveToWaitingArea', this.list)
			}
		},
		mounted () {
			this.cargoRemind('LOCATIONHANDOVER', '装卸接收')
			this.getShipmentAreas()
			var that = this
			this.interval = setInterval(function () {
				that.refreshStandCodeAll()
			}, 30000)
		},
		onShow () {
			// 如果是从选择页面返回的
			if (this.backFlag) {
				let list = uni.getStorageSync('sort-list')
				if (list) {
					list = list.filter(e => !this.list.find(v => v.containerCode === e.containerCode))
					list.forEach(e => {
						this.cargoInfoForm.uld = e.containerCode
						this.getCargoInfo()
					})
					uni.removeStorageSync('sort-list')
				}
				this.setBackFlag(false)
			}
		},
		onLoad (e) {
			if (e.hasOwnProperty('history') && e.history === 'true') {
				// 如果是从操作记录界面进入该页面
				this.history = true
				this.batchOrderId = e.batchOrderId
				this.showOperationHistory = false
				let storage = uni.getStorageSync('cargo-history')
				if (storage) {
					// 加载该批次的集装器
					this.list = [...storage]
					this.$nextTick(function(){
						this.$refs.listContent.setList(this.list)
					})
					uni.removeStorageSync('cargo-history')
				}
			} else {
				if (!this.completedLeaveToWaitingArea) {
					console.log('hasdfasdfasdf')
					// uni.removeStorageSync('completedLeaveToWaitingArea')
					
					let list = uni.getStorageSync('completedLeaveToWaitingArea')
					if (list) {
						console.log('onload-alength', list.length)
						this.list = [...list]
						var that = this
						this.$nextTick(function(){
							if (this.nextTickTime < 1) {
								that.refreshStandCodeForOneTime()
								that.nextTickTime++
							}
						})
					}
				}
			}
		},
		beforeDestroy () {
			clearInterval(this.interval)
		},
		methods:{
			// 在一开始加载缓存时，等把缓存的所有集装器都更新机位，然后再获取最新的集装器信息。
			refreshStandCodeForOneTime () {
				let arr = []
				let arrList = []
				var that = this
				for (let i = 0; i < this.list.length; i++){
					let e = this.list[i]
					let func = function () {
						return updateStandCode(e).then(res => {
							console.log('updateStandCode', res)
							if (res.status) {
								e.standCode = res.data.standCode
								arrList.push(e)
							}
						}).catch(err => {
							onError(err)
						})
					}
					arr.push(func)
				}
				let result = Promise.allSettled(arr.map(e => e()))
				result.then(res => {
					console.log('result-arr', res, arrList)
					this.refresh()
				})
			},
			refreshStandCodeAll () {
				let arr = []
				let arrList = []
				var that = this
				for (let i = 0; i < this.list.length; i++){
					let e = this.list[i]
					let func = function () {
						return updateStandCode(e).then(res => {
							console.log('updateStandCode', res)
							if (res.status) {
								e.standCode = res.data.standCode
								arrList.push(e)
							}
						}).catch(err => {
							onError(err)
						})
					}
					arr.push(func)
				}
				let result = Promise.allSettled(arr.map(e => e()))
				result.then(res => {
					console.log('result-arr', res, arrList)
					if (res && !res.find(e => e.status !== 'fulfilled')) {
						this.list = [...arrList]
						this.$refs.listContent.setList(this.list)
					}
				})
			},
			// 点击确认出库打开底部弹出层(出库、选择待运区)
			openBottomPopup (item) {
				this.selectedItem = item
				let locations = [...this.locations]
				locations.push({
					name: item.standCode,
					selected: false
				})
				this.$refs.bottomPopupToPlace.open(item, locations)
			},
			// 列表组件删除集装器后要同步改变主页面的列表数据，同时更改缓存的列表数据
			updateList (list) {
				this.list = list
				uni.setStorageSync('completedLeaveToWaitingArea', this.list)
			},
			// 通过集装器号得到货物信息
			getCargoInfo () {
				this.cargoInfoForm.uld = this.cargoInfoForm.uld.toUpperCase()
				var that = this
				if (!this.showOperationHistory) {
					// 如果是在操作记录中操作
					var addForm = {
						uld: this.cargoInfoForm.uld,
						batchOrderId: this.batchOrderId,
						operationType: 'TOWAITINGAREA_STEVEDORING',
						direction: 'D'
					}
					this.$loading()
					addFromBatch(addForm).then(res => {
						if (res.status) {
							this.scanSound()
							uni.vibrateLong()
							this.list = res.data
							this.list.forEach(e => {
								let obj = this.generateObj(e)
								if (obj.hasOwnProperty('containerType') && obj.containerType) {
									if (obj.containerType === '0') {
										obj.boxNumber++
									} else if (obj.containerType === '1') {
										obj.boardNumber++
									} else if (obj.containerType === '2') {
										obj.carNumber++
									}
								}
							})
							this.setOperationHistoryList(this.list)
							this.$refs.listContent.setList(this.list)
						}
						this.$message(res.message)
						uni.hideLoading()
					}).catch(err => {
						onError(err)
					})
				} else {
					this.$loading()
					getCargoInfo(this.cargoInfoForm).then(res => {
						console.log('getCargoInfo', res)
						if(res.status && !validatenull(res.data)) {
							this.scanSound()
							uni.vibrateLong()
							this.setCompletedLeaveToWaitingArea(false)
							this.list.push(res.data[0])
							console.log('getCargoInfo-alength', this.list.length)
							this.$refs.listContent.setList(this.list)
						}
						this.$message(res.message)
						uni.hideLoading()
					}).catch(err => {
						onError(err)
					})
				}
			},
			// 完成出库
			confirm: debounce(function () {
				this.initConfirmFormCargos()
				let arr = this.confirmForm.cargos.filter(e => e.isTransportToStandDirectly === '1').map(e => e.containerCode + ',')
				if (arr.length !== 0) {
					this.showNotReceived(arr)
				} else {
					this.confirmBtn()
				}
			}),
			
			confirmBtn () {
				this.$loading()
				confirm(this.confirmForm).then(res => {
					console.log('res', res)
					this.$message(res.message)
					this.setCompletedLeaveToWaitingArea(true)
					uni.removeStorageSync('completedLeaveToWaitingArea')
					uni.hideLoading()
					setTimeout(function () {
						uni.navigateBack()
					}, 1000)
				}).catch(err => {
					onError(err)
				})
			},
			
			uploadImageBefore (e) {
				this.uploadImage(e, 'TOWAITINGAREA_STEVEDORING')
			},
			showSelectFlag () {
				uni.setStorageSync('sorted_list', this.list)
				let url = `/pages/cargo/sort-page?operationType=TOWAITINGAREA_STEVEDORING&direction=D&pageName=to-waiting-area-stevedoring&portDirection=leaveport`
				if (!this.history) {
					uni.navigateTo({
						url: url
					})
				} else {
					uni.navigateTo({
						url: url + `&history=true`
					})
				}
			},
			openOperaionHistory () {
				let operationObj = this.operationObj
				uni.navigateTo({
					url: `/pages/cargo/operation-history?operationType=${operationObj.operationType}&direction=${operationObj.direction}`
							+ `&pageName=${operationObj.pageName}`
				})
			},
			
			showNotReceived (notReceiveds) {
				var that = this
				let strlen = notReceiveds[notReceiveds.length - 1].length
				notReceiveds[notReceiveds.length - 1] = notReceiveds[notReceiveds.length - 1].substr(0, strlen - 1)
				this.$refs.notReceivedContainers.setList(notReceiveds)
				this.$refs.notReceivedContainers.setFlag(true)
			}
		}
	}
</script>


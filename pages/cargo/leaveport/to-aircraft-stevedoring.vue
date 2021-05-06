/*
* 界面名称:交接运往机位（装卸押运）
* 界面功能:
* 其他    :
* 时间    :2020-8-15 09:57:40
* 作者    :gyb
*/
<template>
	<view>
		<!-- 导航栏 -->
		<nav-bar
			 title="交接运往机位"
			:content-not-null="list.length!=0"
			:show-search-bar="showSearchBar"
			:input-value="inputValue"
			:show-operation-history="showOperationHistory"
			:showSort="true"
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
			:merge-flag="true"
			 to-place="aircraftArea"
			:content-not-null="list.length!=0"
			:show-search-bar="showSearchBar"
			:history="history"
			 direction="D"
			 operation-type="TOAIRCRAFT_STEVEDORING"
			:remove-flag="true"
			:batch-order-id="batchOrderId"
			@updateCargoInfo="updateCargoInfoNoToast"
			@updateList="updateList">
			<template v-slot:cardIcon>
				<image style="width:54rpx;height:54rpx;" src="@/static/flight-cargo.png"></image>
			</template>
			<template v-slot:cardRight="scope">
				<to-waiting-area-card
				   modifyText="更新"
					:to-aircraft="true"
					:item-ori="scope.item"
					@uploadImage="uploadImageBefore"
					@openBottomPopup="updateStandCode(scope.item)"
					@showBottomPopup="showBottomPopup"
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
					@changeSearchBarStatus="changeBottomSearchBarStatus"
					@scanCode="scanCode"
					:show-sort="true"
					@showSelectFlag="showSelectFlag">
				</bottom-bar-left-scan>
			</template>
			<template v-if="!showOperationHistory" v-slot:right>
				<view></view>
			</template>
		</bottom-bar>
		
		<bottom-popup-details
			 ref="bottomPopupDetails"
			 title="集装器">
		</bottom-popup-details>
		
		<upload-image-dialog
			ref="uploadImageDialog"
			@uploadImage="uploadImageBefore"
			@refresh="refresh">
		</upload-image-dialog>
		
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
	import bottomPopupDetails from '@/pages/cargo/bottom-popup-details.vue'
	import uploadImageDialog from '@/pages/cargo/upload-image-dialog.vue'
	import {
		getCargoInfo,
		confirm,
		updateCargoInfo,
		addFromBatch,
		updateStandCode,
		onError
	} from '@/api/cargo/index.js'
	import { validatenull } from '@/common/util/validate.js'
	import { debounce } from '@/common/util/util.js'
	import {DIC} from '@/common/dic.js'
	import cargoMixin from '@/pages/cargo/cargo-mixin.js'
	import cargoRemindDialog from '@/pages/cargo/cargo-remind-dialog.vue'
	export default {
		mixins: [cargoMixin],
	  components: {
			navBar,
			listContent,
			bottomBar,
			toWaitingAreaCard,
			bottomBarLeftScan,
			bottomPopupDetails,
			uploadImageDialog,
			cargoRemindDialog
		},
		data () {
			return {
				// 通过集装器号获取货物信息的接口需要提交的表单信息
				cargoInfoForm: {
					// 集装器编码
					uld: '',
					// 方向 出港为D
					direction: 'D',
					// 操作类型 TOAIRCRAFT_STEVEDORING
					operationType: 'TOAIRCRAFT_STEVEDORING'
				},
				// 确认出库需要提交的表单信息
				confirmForm: {
					// 货物信息
					cargos: [],
					// 方向
					direction: 'D',
					// 操作类型
					operationType: 'TOAIRCRAFT_STEVEDORING'
				},
				showOperationHistory: true,
				operationObj: {
					pageName: 'to-aircraft-stevedoring',
					operationType: 'TOAIRCRAFT_STEVEDORING',
					direction: 'D'
				},
				batchOrderId: '',
				interval: null
			}
		},
		onShow () {
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
		
		mounted () {
			this.cargoRemind('ARRIVEDWAITINGAREA_DRIVER', '到达待运区')
			var that = this
			this.interval = setInterval(function () {
				that.refreshStandCodeAll()
			}, 30000)
		},
		
		beforeDestroy () {
			clearInterval(this.interval)
		},
		
		onBackPress () {
			if (!this.showOperationHistory) {
				return
			}
			if (!this.completedLeaveToAircraft) {
				uni.setStorageSync('completedLeaveToAircraft', this.list)
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
			} else if (!this.completedLeaveToAircraft) {
				let list = uni.getStorageSync('completedLeaveToAircraft')
				if (list) {
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
			// 刷新所有机位
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
			openBottomPopup (item) {
				
			},
			updateList (list) {
				this.list = list
				uni.setStorageSync('completedLeaveToAircraft', this.list)
			},
			// 通过集装器号得到货物信息
			getCargoInfo () {
				this.cargoInfoForm.uld = this.cargoInfoForm.uld.toUpperCase()
				if (!this.showOperationHistory) {
					// 如果是在操作记录中操作
					var addForm = {
						uld: this.cargoInfoForm.uld,
						batchOrderId: this.batchOrderId,
						operationType: 'TOAIRCRAFT_STEVEDORING',
						direction: 'D'
					}
					addFromBatch(addForm).then(res => {
						console.log('addFormBatchRes', res)
						if (res.status) {
							this.scanSound()
							uni.vibrateLong()
							this.list = res.data
							this.list.forEach(e => {
								let newObj = e
								let obj = this.generateObj(newObj)
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
							this.$refs.listContent.refresh()
						} else {
							this.$message(res.message)
						}
						uni.hideLoading()
					})
				} else {
					getCargoInfo(this.cargoInfoForm).then(res => {
						console.log('getCargoInfo', res)
						if(res.status && !validatenull(res.data)) {
							this.scanSound()
							uni.vibrateLong()
							this.setCompletedLeaveToAircraft(false)
							this.list.push(res.data[0])
							this.$refs.listContent.setList(this.list)
						} else {
							this.$message(res.message)
						}
						uni.hideLoading()
					}).catch(err => {
						onError(err)
					})
				}
			},
			
			
			// 完成出库
			confirm: debounce(function () {
				this.confirmBtn()
			}),
			
			uploadImageBefore (e) {
				this.uploadImage(e, 'TOAIRCRAFT_STEVEDORING')
			},
			
			showSelectFlag () {
				uni.setStorageSync('sorted_list', this.list)
				if (!this.history) {
					uni.navigateTo({
						url: `/pages/cargo/sort-page?operationType=TOAIRCRAFT_STEVEDORING&direction=D&pageName=to-aircraft-stevedoring&portDirection=leaveport`
					})
				} else {
					uni.navigateTo({
						url: `/pages/cargo/sort-page?operationType=TOAIRCRAFT_STEVEDORING&direction=D&pageName=to-aircraft-stevedoring&portDirection=leaveport&history=true`
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
			
			confirmBtn () {
				this.initConfirmFormCargos()
				this.$loading()
				console.log('this.confirmForm', this.confirmForm)
				confirm(this.confirmForm).then(res => {
					console.log('confirmbtnres', res)
					this.$message(res.message)
					this.setCompletedLeaveToAircraft(true)
					uni.removeStorageSync('completedLeaveToAircraft')
					uni.hideLoading()
					setTimeout(function () {
						uni.navigateBack()
					}, 1000)
				}).catch(err => {
					onError(err)
				})
			}
		}
	}
</script>


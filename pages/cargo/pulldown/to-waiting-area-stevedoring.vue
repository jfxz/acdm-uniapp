/*
* 界面名称:交接运往待运区(装卸接收)
* 界面功能:
* 其他    :
* 时间    :2020-10-16 15:05:04
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
			@scanCode="scanCode"
			@resetInputValue="resetInputValue"
			@inputGetCargoInfo="inputGetCargoInfo"
			@changeSearchBarStatus="changeSearchBarStatus"
			@showSelectFlag="showSelectFlag"
			@openOperaionHistory="openOperaionHistory">
		</nav-bar>
		
		<!-- 内容 -->
		<list-content
			 ref="listContent"
			:content-not-null="list.length!=0"
			:show-search-bar="showSearchBar"
			:history="history"
			 direction="PULL"
			 operation-type="TOWAITINGAREA_STEVEDORING"
			:remove-flag="true"
			:batch-order-id="batchOrderId"
			@updateCargoInfo="updateCargoInfoNoToast"
			@updateList="updateList">
			<template v-slot:cardRight="scope">
				<transfer-card
					:item-ori="scope.item"
					@uploadImage="uploadImageBefore">
				</transfer-card>
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
					@scanCode="scanCode"
					@changeSearchBarStatus="changeBottomSearchBarStatus"
					:show-sort="true"
					@showSelectFlag="showSelectFlag">
				</bottom-bar-left-scan>
			</template>
			<template v-if="!showOperationHistory" v-slot:right>
				<view></view>
			</template>
		</bottom-bar>
	</view>
</template>

<script>
	import navBar from '@/pages/cargo/nav-bar.vue'
	import listContent from '@/pages/cargo/list-content.vue'
	import bottomBar from '@/pages/cargo/bottom-bar.vue'
	import bottomBarLeftScan from '@/pages/cargo/bottom-bar-left-scan.vue'
	import transferCard from '@/pages/cargo/pulldown/components/transfer-card.vue'
	import {
		getPulldownCargoInfo,
		pulldownConfirm,
		updateCargoInfo,
		addPulldownFromBatch,
		onError
	} from '@/api/cargo/index.js'
	import cargoMixin from '@/pages/cargo/cargo-mixin.js'
	export default {
		mixins: [cargoMixin],
		components: {
			navBar,
			listContent,
			bottomBar,
			bottomBarLeftScan,
			transferCard
		},
		data () {
			return {
				// 通过集装器号获取货物信息的接口需要提交的表单信息
				cargoInfoForm: {
					// 集装器编码
					uld: '',
					// 方向 出港为D
					direction: 'PULL',
					// 操作类型 ARRIVEDWAITINGAREA_DRIVER
					operationType: 'TOWAITINGAREA_STEVEDORING'
				},
				// 确认出库需要提交的表单信息
				confirmForm: {
					// 货物信息
					cargos: [],
					// 方向
					direction: 'PULL',
					// 操作类型
					operationType: 'TOWAITINGAREA_STEVEDORING'
				},
				showOperationHistory: true,
				operationObj: {
					pageName: 'to-waiting-area-stevedoring',
					operationType: 'TOWAITINGAREA_STEVEDORING',
					direction: 'PULL'
				},
				batchOrderId: ''
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
		onBackPress () {
			if (!this.showOperationHistory) {
				return
			}
			if (!this.completedPulldownToWaitingArea) {
				uni.setStorageSync('completedPulldownToWaitingArea', this.list)
			}
		},
		onLoad (e) {
			if (e.hasOwnProperty('history') && e.history === 'true') {
				this.history = true
				this.batchOrderId = e.batchOrderId
				this.showOperationHistory = false
				let storage = uni.getStorageSync('cargo-history')
				if (storage) {
					this.setOperationHistoryList(storage)
					this.list = this.operationHistoryList
					this.$nextTick(function(){
						this.$refs.listContent.setList(this.list)
					})
					uni.removeStorageSync('cargo-history')
				}
			} else {
				if (!this.completedPulldownToWaitingArea) {
					let list = uni.getStorageSync('completedPulldownToWaitingArea')
					if (list) {
						this.list = [...list]
						var that = this
						this.$nextTick(function(){
							if (this.nextTickTime < 1) {
								that.refresh()
								that.nextTickTime++
							}
						})
					}
				}
			}
		},
		methods:{
			updateList (list) {
				this.list = list
				uni.setStorageSync('completedPulldownToWaitingArea', this.list)
			},
			// 通过集装器号得到货物信息
			getCargoInfo () {
				this.cargoInfoForm.uld = this.cargoInfoForm.uld.toUpperCase()
				if (!this.showOperationHistory) {
					// 如果是在操作记录中操作
					var addForm = {
						uld: this.cargoInfoForm.uld,
						batchOrderId: this.batchOrderId,
						operationType: 'TOWAITINGAREA_STEVEDORING',
						direction: 'PULL'
					}
					addPulldownFromBatch(addForm).then(res => {
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
					getPulldownCargoInfo(this.cargoInfoForm).then(res => {
						console.log('getCargoInfo', res)
						if(res.status) {
							this.scanSound()
							uni.vibrateLong()
							this.setCompletedPulldownToWaitingArea(false)
							this.list.push(res.data[0])
							this.$refs.listContent.setList([])
							this.$refs.listContent.setList(this.list)
							this.$refs.listContent.refresh()
						} else {
							this.$message(res.message)
						}
						uni.hideLoading()
					}).catch(err => {
						onError(err)
						uni.hideLoading()
					})
				}
			},
			
			// 完成出库
			confirm () {
				this.initConfirmFormCargos()
				this.confirmBtn()
			},
			
			uploadImageBefore (e) {
				this.uploadImage(e, 'TOWAITINGAREA_STEVEDORING')
			},
			
			showSelectFlag () {
				uni.setStorageSync('sorted_list', this.list)
				if (!this.history) {
					uni.navigateTo({
						url: `/pages/cargo/sort-page?operationType=TOWAITINGAREA_STEVEDORING&direction=PULL&pageName=to-waiting-area-stevedoring&portDirection=PULL`
					})
				} else {
					uni.navigateTo({
						url: `/pages/cargo/sort-page?operationType=TOWAITINGAREA_STEVEDORING&direction=PULL&pageName=to-waiting-area-stevedoring&portDirection=PULL&history=true`
					})
				}
			},
			
			confirmBtn () {
				this.$loading()
				pulldownConfirm(this.confirmForm).then(res => {
					console.log('pulldownConfirm-res', res)
					this.$message(res.message)
					this.setCompletedPulldownToWaitingArea(true)
					uni.removeStorageSync('completedPulldownToWaitingArea')
					setTimeout(function () {
						uni.navigateBack()
					}, 3000)
					uni.hideLoading()
				}).catch(err => {
					onError(err)
					uni.hideLoading()
				})
			}
		}
	}
</script>


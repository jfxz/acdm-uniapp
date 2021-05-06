/*
* 界面名称:卸机-板箱列表
* 界面功能:
* 其他    :
* 时间    :2020-8-22 12:34:11
* 作者    :gyb
*/
<template>
	<view>
		<!-- 导航栏 -->
		<nav-bar
			 title="贵货及危险品确认"
			:content-not-null="list.length!=0"
			:show-search-bar="showSearchBar"
			:input-value="inputValue"
			:operation-obj="operationObj"
			:showSort="true"
			:candidates="candidates"
			@scanCode="scanCode"
			@inputSearch="inputSearch"
			@resetInputValue="resetInputValue"
			@inputGetCargoInfo="inputGetCargoInfo"
			@changeSearchBarStatus="changeSearchBarStatus"
			@showSelectFlag="showSelectFlag">
		</nav-bar>
		
		<!-- 内容 -->
		<list-content
			 ref="listContent"
			:remove-flag="true"
			:content-not-null="list.length!=0"
			:show-search-bar="showSearchBar"
			:not-id="true"
			:unloading-flag="true"
			@updateList="updateList"
			@uploadImage="uploadImage"
			@clickCard="modifyRemark"
			>
			<template v-slot:top>
				<flight-info-card
					:item-ori="flight">
				</flight-info-card>
			</template>
			<template v-slot:cardRight="scope">
				<transfer-card
					:item="scope.item"
					@uploadImage="uploadImageBefore">
				</transfer-card>
			</template>
		</list-content>
		
		<bottom-bar
			 btn="确认"
			:content-not-null="list.length!=0"
			:show-search-bar="showBottomSearchBar"
			@inputGetCargoInfo="inputGetCargoInfo"
			@resetInputValue="resetInputValue"
			@confirm="openBottomPopup">
			<!-- 左侧操作选项-->
			<template v-slot:left>
				<bottom-bar-left-scan
					:show-sort="true"
					@showSelectFlag="showSelectFlag"
					@changeSearchBarStatus="changeBottomSearchBarStatus"
					@scanCode="scanCode">
				</bottom-bar-left-scan>
			</template>
			<template v-if="!showOperationHistory" v-slot:right>
				<view></view>
			</template>
		</bottom-bar>
	</view>
</template>

<script>
	import navBar from '@/pages/cargo/nav-combox-bar.vue'
	import listContent from '@/pages/cargo/list-content.vue'
	import bottomBar from '@/pages/cargo/bottom-bar.vue'
	import bottomBarLeftScan from '@/pages/cargo/bottom-bar-left-scan.vue'
	import unloadingPlateBoxCard from '@/pages/cargo/enterport/components/unloading-plate-box-card.vue'
	import unloadingPlateBoxModal from '@/pages/cargo/enterport/components/unloading-plate-box-modal.vue'
	import flightInfoCard from '@/pages/cargo/costly/components/flight-info-card.vue'
	import dayjs from '@/common/util/dayjs.min.js'
	import {confirmCostly, getCostlyUnloadCargoInfo, getCostlySearChs, onError} from '@/api/cargo/index.js'
	import cargoMixin from '../cargo-mixin.js'
	import costlyMixin from './costly-mixin.js'
	import {DIC} from '@/common/dic.js'
	import transferCard from './components/transfer-card.vue'
	import { debounce } from '@/common/util/util.js'
	// 最大照片选择数量
	const maxPicNums = 3
	export default {
		mixins: [cargoMixin, costlyMixin],
		components: {
			navBar,
			listContent,
			bottomBar,
			bottomBarLeftScan,
			unloadingPlateBoxModal,
			flightInfoCard,
			transferCard
		},
		data () {
			return {
				// 通过集装器号获取货物信息的接口需要提交的表单信息
				cargoInfoForm: {
					// 集装器编码
					uld: '',
					// 方向 出港为
					direction: 'A',
					// 操作类型 A
					operationType: 'UNLOADER'
				},
				// 确认下拉确认需要提交的表单信息
				confirmForm: {
					// 货物信息
					cargos: [],
					// 方向
					direction: 'A',
					// 操作类型
					operationType: 'UNLOADER'
				},
				// 航班列表传过来的点击的航班信息
				flightInfo: {},
				operationObj: {
					pageName: 'unloading-plate-box',
					operationType: 'UNLOADER',
					direction: 'A'
				},
				showOperationHistory: true,
				// 批次单号，从onLoad传过来
				batchOrderId: '',
				history: false,
				candidates: [],
				timer: null,
				candidateCargos: []
			}
		},
		
		onLoad (e) {
			var that = this
			this.$loading()
			this.flightInfo = uni.getStorageSync('unloading_flight_info')
			let obj = this.flightInfo[0]
			uni.setStorageSync('costly_unload_box_flight', obj)
			this.list = []
			if (this.flightInfo) {
				console.log('this.flightInfo', obj)
				this.getUnloadingList(obj)
			}
			// 如果该页面是从操作记录页面进入的
			if (e.hasOwnProperty('history') && e.history === 'true') {
				this.history = true
				this.batchOrderId = e.batchOrderId
				this.showOperationHistory = false
				let storage = uni.getStorageSync('cargo-history')
				if (storage) {
					this.list = [...storage]
					this.$nextTick(function(){
						this.$refs.listContent.setCostlyList(this.list)
					})
					uni.removeStorageSync('cargo-history')
				}
			}
		},
		
		mounted () {
			this.timer = debounce(function (item) {
				this.candidates = []
				this.candidateCargos = []
				getCostlySearChs({
					flight: [this.flight],
					uld: item
				}).then(res => {
					console.log('getCostlySearChs', res)
					if (res.status) {
						this.candidates = res.data.map(e => e.containerCode)
						this.candidateCargos = res.data
					}
				})
			}, 300)
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
			let item = uni.getStorageSync('back-costly-remark')
			if (item) {
				let idx = this.list.findIndex(e => e.containerCode === item.containerCode)
				this.list.splice(idx, 1, item)
				this.$refs.listContent.setCostlyList(this.list)
				uni.removeStorageSync('back-costly-remark')
			}
		},
		
		
		onBackPress () {
			uni.removeStorageSync('costly_unload_box_flight')
			if (!this.completedCostlyUnloading) {
				let lists = uni.getStorageSync('completedCostlyUnloading')
				if (lists) {
					let list = lists.find(e => e.flight === this.flight.flight)
					if (!list) {
						lists.push({
							flight: this.flight.flight,
							list: this.list
						})
					} else {
						list.list = this.list
					}
					uni.setStorageSync('completedCostlyUnloading', lists)
				} else {
					lists = [{
						flight: this.flight.flight,
						list: this.list
					}]
					uni.setStorageSync('completedCostlyUnloading', lists)
				}
				console.log('back-list', lists)
			}
		},
		
		methods:{
			inputSearch (item) {
				this.timer(item)
			},
			modifyRemark (item) {
				console.log('modifyRemark')
				uni.setStorageSync('costly-remark-item', item)
				uni.navigateTo({
					url: `/pages/cargo/costly/costly-input-remark`,
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			openBottomPopup (item) {
				this.confirm('')
			},
			confirm (name) {
				this.initConfirmFormCargos()
				this.confirmBtn()
			},
			confirmBtn () {
				this.$loading()
				confirmCostly(this.confirmForm).then(res => {
					console.log('confirmBtn', res)
					if (res.status) {
						for (let i = 0; i < this.confirmForm.cargos.length; i++) {
							let e = this.confirmForm.cargos[i]
							// 查找的目的是为了获得id用于上传图片。扫码后得到的集装器id为空，不能上传图片。
							let exit = res.data.find(v => v.containerCode === e.containerCode)
							if (exit && e.images2.length > 0) {
								e.id = exit.id
								// 用递归上传该集装器本次选择的图片，以达到同步上传的目的
								if (item && !item.id && item.images3 && item.images3.length > 0) {
									e.images2 = [...e.images3]
									this.recursiveUpload(e, 'UNLOADER', 0, e.images3.length)
								}
							}
						}
					}
					this.$message(res.message)
					this.list = []
					this.$refs.listContent.setCostlyList([])
					// 下拉确认成功/失败，清掉缓存
					this.setCompletedCostlyUnloading(true)
					uni.removeStorageSync('completedCostlyUnloading')
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
			},
			initUnloadingList (res) {
				this.list = []
				this.flight = this.flightInfo[0]
				if (!this.completedCostlyUnloading) {
					let storage = uni.getStorageSync('completedCostlyUnloading')
					let completedUnloadingObj = null
					if (storage) {
						console.log('storage', storage)
						completedUnloadingObj = storage.find(e => e.flight ===  this.flight.flight)
					}
					if (completedUnloadingObj) {
						let list = completedUnloadingObj.list
						if (list) {
							console.log('completedUnloadingObj.list', list)
							list.forEach(e => {
								let exit = this.list.find(v => {
									if (this.getNumber(v.containerCode) === this.getNumber(e.containerCode)) {
										return true
									} else {
										return false
									}
								})
								if (!exit) {
									this.list.push(e)
								}
							})
						}
					}
					var that = this
					this.$nextTick(function(){
						if (that.nextTickTime < 1) {
							that.refresh()
							that.nextTickTime++
						}
					})
				}
				uni.hideLoading()
			},
			
			getUnloadingList (obj) {
				this.initUnloadingList()
			},
			updateList (list1) {
				this.list = list1
				console.log('updateList-this.list', this.list)
				let lists = uni.getStorageSync('completedCostlyUnloading')
				if (lists) {
					let list = lists.find(e => e.flight === this.flight.flight)
					if (!list) {
						lists.push({
							flight: this.flight.iataCarrier + this.flight.flight,
							list: this.list
						})
					} else {
						list.list = this.list
					}
					uni.setStorageSync('completedCostlyUnloading', lists)
				} else {
					lists = [{
						flight: this.flight.iataCarrier + this.flight.flight,
						list: this.list
					}]
					uni.setStorageSync('completedCostlyUnloading', lists)
				}
			},
			
			inputGetCargoInfo (e) {
				this.notAuto = true
				if (e && e !== '') {
					this.inputValue = e
				} else {
					return
				}
				this.cargoInfoForm.uld = this.inputValue
				this.$loading()
				e = e.toUpperCase()
				if (this.$refs.listContent.getList().find(v => this.getNumber(v.containerCode) === this.getNumber(e))) {
					this.$message('不可重复输入')
				} else {
					this.getCargoInfo()
				}
			},
			
			updateCargoInfo (e) {
				let obj ={...e}
				updateCargoInfo(e).then(res => {
					console.log('updateCargoInfo', res)
					if (res.status) {
						let item = {...obj, ...res.data}
						if (item && item.images2.length > 0) {
							this.recursiveUpload(item, 'NOTUNLOADER', 0, item.images2.length)
						}
						this.list.push(item)
						this.list.sort((a, b) => {
							let bIdx = DIC.CARGOSTATUSA.findIndex(e => e === b.status)
							let aIdx = DIC.CARGOSTATUSA.findIndex(e => e === a.status)
							bIdx = bIdx ? bIdx: -1
							aIdx = aIdx ? aIdx: -1
							if (bIdx > aIdx) {
								return 1
							} else {
								return -1
							}
						})
						this.$refs.listContent.setCostlyList(this.list)
						this.$refs.listContent.refresh()
					} else {
						this.$message(res.message)
					}
					this.setCompletedPulldownConfirm(true)
					uni.removeStorageSync('completedCostlyUnloading')
					this.$refs.popup.close()
				}).catch(err => {
					onError(err)
				})
			},
			
			getCargoInfo () {
				this.cargoInfoForm.uld = this.cargoInfoForm.uld.toUpperCase()
				
				let container = this.candidateCargos.find(e => this.getNumber(e.containerCode) === this.getNumber(this.cargoInfoForm.uld))
				if (container) {
					this.scanSound()
					uni.vibrateLong()
					this.setCompletedPulldownConfirm(false)
					this.list = this.$refs.listContent.getDisplayList()
					this.list.unshift(container)
					var that = this
					this.$refs.listContent.setCostlyList(this.list)
					uni.hideLoading()
				} else {
					getCostlyUnloadCargoInfo({
						flight: this.flightInfo,
						uld: this.cargoInfoForm.uld
					}).then(res => {
						console.log('unloading', res)
						if (res.status) {
							this.scanSound()
							uni.vibrateLong()
							this.setCompletedPulldownConfirm(false)
							this.list = this.$refs.listContent.getDisplayList()
							this.list.unshift(res.data[0])
							var that = this
							// this.list.sort((a, b) => {
							// 	let bIdx = DIC.CARGOSTATUSA.findIndex(e => e === b.status)
							// 	let aIdx = DIC.CARGOSTATUSA.findIndex(e => e === a.status)
							// 	bIdx = bIdx ? bIdx: -1
							// 	aIdx = aIdx ? aIdx: -1
							// 	if (bIdx > aIdx) {
							// 		return 1
							// 	} else {
							// 		return -1
							// 	}
							// })
							this.$refs.listContent.setCostlyList(this.list)
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
			
			checkInfo (e) {
				this.$refs.dialog.open(e)
			},
			
			uploadImageBefore (e) {
				this.uploadImage(e, 'NOTUNLOADER')
			},
			
			showSelectFlag () {
				uni.setStorageSync('sorted_list', this.list)
				let flight = this.flight
				let url = `/pages/cargo/sort-page?operationType=UNLOADER&direction=A&pageName=unloading&portDirection=A&flight=${flight.iataCarrier + flight.flight}&type=costly`
				if (!this.history) {
					uni.navigateTo({
						url: url
					})
				} else {
					uni.navigateTo({
						url: url + `?history=true`
					})
				}
			},
			
			// 进入操作记录页面
			openOperaionHistory () {
				let operationObj = this.operationObj
				uni.navigateTo({
					url: `/pages/cargo/operation-history?operationType=${operationObj.operationType}&direction=${operationObj.direction}`
							+ `&pageName=${operationObj.pageName}` + `&type=costly`
				})
			},
			
			uploadImage (item, operationType) {
				const maxPicNums = 9
				var that = this
				let a = maxPicNums - item.selectedPicNums
				if (a === 0) {
					this.$message('照片已满')
				} else {
					uni.chooseImage({
						count: a > 0? a : 0,
						success: function(res) {
							item.selectedPicNums += res.tempFilePaths.length
							item.showItem = false
							let len = item.images.length
							item.images2 = []
							for (let i = len; i < res.tempFiles.length + len; i++) {
								let obj = {
									show: true,
									name: 'image' + i,
									showDelete: false,
									uri: res.tempFiles[i - len].path
								}
								if (!item.id){
									item.images.push(obj)
								}
								item.images2.push(obj)
							}
							// 必须改变数据以触发视图更新
							item.showItem = true
							that.$refs.listContent.refresh()
							if (item.hasOwnProperty('id') && item.id && item.images2.length > 0) {
								that.recursiveUpload(item, operationType, 0, item.images2.length)
							} else {
								if (!item.images3) {
									item.images3 = []
								}
								item.images3 = [...item.images3, ...item.images2]
							}
						}
					})
				}
			}
		}
	}
</script>


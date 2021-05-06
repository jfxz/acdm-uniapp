/*
* 界面名称:确认到达待运区（拖车司机)
* 界面功能:
* 其他    :
* 时间    :2020-8-15 11:43:41
* 作者    :gyb
*/
<template>
	<view>
		<!-- 导航栏 -->
		<nav-bar
			 title="到达待运区确认"
			:content-not-null="list.length!=0"
			:show-search-bar="showSearchBar"
			:input-value="inputValue"
			:jump-from-driver.sync="fromDriver"
			@scanCode="scanCode"
			@resetInputValue="resetInputValue"
			@inputGetCargoInfo="inputGetCargoInfoDebounce"
			@changeSearchBarStatus="changeSearchBarStatus">
		</nav-bar>
		
		<!-- 内容 -->
		<list-content
			 ref="listContent"
			 direction="D"
			:merge-flag="true"
			:to-place="'waitingArea'"
			:content-not-null="list.length!=0"
			:show-search-bar="showSearchBar"
			:cant-select-status="arrivedCondition"
			@completedArrived="completedArrived"
			@noSelectedWarn="noSelectedWarn"
			@changeBottomSelectAll="changeBottomSelectAll">
			<template v-slot:cardIcon>
				<image style="width:54rpx;height:54rpx;" src="@/static/flight-cargo.png"></image>
			</template>
			<template v-slot:cardRight="scope">
				<to-waiting-area-card
					 arrived-condition="ARRIVEDWAITINGAREA"
					:arrived-waiting-area-driver="true"
					:item-ori="scope.item"
					@confirmRight="confirmRight"
					@uploadImage="uploadImageBefore"
					@openBottomPopup="openBottomPopup"
					@showBottomPopup="showBottomPopup"
					@openUploadImageDialog="openUploadImageDialog">
				</to-waiting-area-card>
			</template>
		</list-content>
		
		<!-- 底部操作栏 -->
		<bottom-bar
			 btn="到达"
			:content-not-null="list.length!=0"
			:btn-can-press="btnCanPress"
			@inputGetCargoInfo="inputGetCargoInfo"
			@resetInputValue="resetInputValue"
			@confirm="openConfirmDialog">
			<template v-slot:left>
				<bottom-bar-left-selectall
					ref="bottomSelect"
					@selectAll="selectAll"
					@cancelSelectAll="cancelSelectAll">
				</bottom-bar-left-selectall>
			</template>
			<template v-slot:right>
				<view v-show="refreshFlag" :class="[btnCanPress?'btn':'btn-light']" style="margin-right: 11rpx;" @tap="openConfirmDialog">到达</view>
			</template>
		</bottom-bar>
		
		<bottom-popup-to-place
			 ref="bottomPopupToPlace"
			 title="选择待运区"
			 btn="完成修改"
			:locations-ori="locations"
			@confirm="updateWaitArea">
		</bottom-popup-to-place>
		
		<!-- 内容 -->
		<not-received-containers
			ref="notReceivedContainers">
		</not-received-containers>
		
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
		
		<confirm-modal
			ref="confirmModal"
			@confirm="confirm">
		</confirm-modal>
	</view>
</template>

<script>
	import navBar from '@/pages/cargo/nav-bar.vue'
	import listContent from '@/pages/cargo/list-content.vue'
	import toWaitingAreaCard from '@/pages/cargo/leaveport/components/to-waiting-area-card.vue'
	import bottomBar from '@/pages/cargo/bottom-bar.vue'
	import bottomBarLeftSelectall from '@/pages/cargo/bottom-bar-left-selectall.vue'
	import bottomPopupToPlace from '@/pages/cargo/bottom-popup-to-place.vue'
	import notReceivedContainers from '@/pages/cargo/leaveport/components/not-received-containers.vue'
	import bottomPopupDetails from '@/pages/cargo/bottom-popup-details.vue'
	import uploadImageDialog from '@/pages/cargo/upload-image-dialog.vue'
	import {
		getCargoInfo,
		confirm,
		onError,
		updateStandCode
	} from '@/api/cargo/index.js'
	import { validatenull } from '@/common/util/validate.js'
	import { debounce } from '@/common/util/util.js'
	import {DIC} from '@/common/dic.js'
	import cargoMixin from '@/pages/cargo/cargo-mixin.js'
	import cargoRemindDialog from '@/pages/cargo/cargo-remind-dialog.vue'
	import confirmModal from '@/pages/cargo/leaveport/components/installed-audit-modal.vue'
	export default {
		mixins: [cargoMixin],
	  components: {
			navBar,
			listContent,
			toWaitingAreaCard,
			bottomBar,
			bottomBarLeftSelectall,
			bottomPopupToPlace,
			notReceivedContainers,
			bottomPopupDetails,
			uploadImageDialog,
			cargoRemindDialog,
			confirmModal
		},
		data () {
			return {
				// 通过集装器号获取货物信息的接口需要提交的表单信息
				cargoInfoForm: {
					// 集装器编码
					uld: '',
					// 方向 出港为D
					direction: 'D',
					// 操作类型 ARRIVEDWAITINGAREA_DRIVER
					operationType: 'ARRIVEDWAITINGAREA_DRIVER'
				},
				// 确认出库需要提交的表单信息
				confirmForm: {
					// 货物信息
					cargos: [],
					// 方向
					direction: 'D',
					// 操作类型
					operationType: 'ARRIVEDWAITINGAREA_DRIVER'
				},
				fromDriver: false,
				refreshFlag: true,
				interval: null
			}
		},
		mounted () {
			this.cargoRemind('TOWAITINGAREA_DRIVER', '交接运往待运区司机')
			this.arrivedCondition = 'ARRIVEDWAITINGAREA'
			var that = this
			this.getShipmentAreas()
			this.refreshStandCodeAll()
			this.interval = setInterval(function () {
				that.refreshStandCodeAll()
			}, 30000)
			
		},
		
		beforeDestroy () {
			clearInterval(this.interval)
		},
		onBackPress (options) {
			if (!this.completedLeaveArrivedWaitingArea) {
				uni.setStorageSync('completedLeaveArrivedWaitingArea', this.list)
			}
		},
		onLoad (e) {
			if (e.uld) {
				// 如果是司机确认运输单后跳转到该页面
				this.fromDriver = true
				this.cargoInfoForm.uld = e.uld
				this.getCargoInfo()
			} else if (!this.completedLeaveArrivedWaitingArea) {
				let list = uni.getStorageSync('completedLeaveArrivedWaitingArea')
				if (list) {
					this.list = [...list]
					this.$nextTick(function(){
						if (this.nextTickTime < 1) {
							// 刷新，只重新扫一个集装器，获得一批集装器
							this.refresh2()
							this.nextTickTime++
						}
					})
				}
			}
		},
		methods:{
			refreshStandCodeAll () {
				let arr = []
				let arrList = []
				var that = this
				let displayList = this.$refs.listContent.getDisplayList()
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
						this.list.forEach(e => {
							let de = displayList.find(v => v.id === e.id)
							e.showSelectFlag = de.showSelectFlag
							e.selected = de.selected
						})
						this.$refs.listContent.setList(this.list)
					}
				})
			},
			openBottomPopup (item) {
				this.selectedItem = item
				let locations = [...this.locations]
				locations.push({
					name: item.standCode,
					selected: false
				})
				this.$refs.bottomPopupToPlace.open(item, locations)
			},
			// 通过集装器号得到货物信息
			getCargoInfo () {
				var that = this
				this.cargoInfoForm.uld = this.cargoInfoForm.uld.toUpperCase()
				getCargoInfo(this.cargoInfoForm).then(res => {
					console.log('getCargoInfo', res)
					if (res.status && !validatenull(res.data)) {
						this.scanSound()
						uni.vibrateLong()
						this.list = res.data
						this.list.forEach(e => {
							e.showSelectFlag = true
							e.selected = true
						})
						this.$refs.listContent.setList(this.list)
						this.setCompletedLeaveArrivedWaitingArea(false)
						var that = this
						this.selectAll()
						this.$refs.listContent.judgeAllArrived()
						setTimeout(function () {
							that.$refs.bottomSelect.changeSelectAllFlag(true)
						}, 100)
					} else {
						this.$message(res.message)
					}
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
			},
			
			openConfirmDialog: debounce(function () {
				if (!this.btnCanPress) {
					return
				}
				let arr = this.$refs.listContent.getDisplayList()
				let notSelecteds = arr.filter(e => !e.selected)
				if (notSelecteds.length > 0) {
					let msg = notSelecteds.map(e => e.containerCode).toString()
					this.$refs.confirmModal.open(`集装器${msg}尚未选中，是否确认`)
				} else {
					this.confirm()
				}
			}),
			
			// 完成出库
			confirm () {
				if (!this.btnCanPress) {
					// 如果不可选
					return
				}
				this.initConfirmFormCargos()
				if (this.confirmForm.cargos.length > 0) {
					this.confirmBtn()
				}
			},
			
			confirmRight (item) {
				this.confirmForm.cargos = this.$refs.listContent.getList().filter(e => (e.flight === item.flight && e.registration === item.registration))
				this.confirmBtn()
			},
			
			confirmBtn () {
				this.$loading()
				confirm(this.confirmForm).then(res => {
					console.log('confirmBtn', res)
					if (res.status && !validatenull(res.data)) {
						// 选择一部分集装器到达成功后刷新列表
						this.refresh2()
						var that = this
						setTimeout(function(){
							that.$refs.listContent.judgeAllArrived()
						}, 100)
					}
					this.$message(res.message)
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
			},
			
			uploadImageBefore (e) {
				this.uploadImage(e, 'ARRIVEDWAITINGAREA_DRIVER')
			},
			completedArrived (flag = true) {
				var that = this
				if (!flag) {
					that.refreshFlag = false
					this.$nextTick(function(){
						this.btnCanPress = true
						this.refreshFlag = true
					})
					return
				}
				this.setCompletedLeaveArrivedWaitingArea(true)
				
				this.refreshFlag = false
				this.$nextTick(function(){
					this.btnCanPress = false
					this.refreshFlag = true
				})
				uni.removeStorageSync('completedLeaveArrivedWaitingArea')
			},
			
			selectAll () {
				this.$refs.listContent.selectAll()
				if (this.$refs.listContent.judgeAtLeastSelected('ARRIVEDWAITINGAREA')) {
					this.btnCanPress = true
				} else {
					this.btnCanPress = false
				}
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
	
	.btn {
		width: 137rpx;
		height: 69rpx;
		border-radius: 35rpx;
		margin-right: 11rpx;
		border: solid 1rpx #2675e5;
		text-align: center;
		line-height: 63rpx;
		font-family: SourceHanSansSC-Regular;
		font-size: 33rpx;
		letter-spacing: 2rpx;
		color: #008ffd;
	}
	
	.btn-light {
		opacity: 0.3;
		width: 137rpx;
		height: 69rpx;
		border-radius: 35rpx;
		margin-right: 11rpx;
		border: solid 1rpx #2675e5;
		text-align: center;
		line-height: 63rpx;
		font-family: SourceHanSansSC-Regular;
		font-size: 33rpx;
		letter-spacing: 2rpx;
		color: #008ffd;
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
</style>

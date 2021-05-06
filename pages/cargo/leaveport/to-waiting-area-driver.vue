/*
* 界面名称:交接运往待运区（拖车司机）
* 界面功能:
* 其他    :
* 时间    :2020-8-15 11:29:14
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
			:is-driver="true"
			@scanCode="scanCode"
			@resetInputValue="resetInputValue"
			@inputGetCargoInfo="inputGetCargoInfoDebounce"
			@changeSearchBarStatus="changeSearchBarStatus"
			@deleteList="deleteList">
		</nav-bar>
		
		<!-- 内容 -->
		<list-content
			 ref="listContent"
			:merge-flag="true"
			:to-place="'waitingArea'"
			:content-not-null="list.length!=0"
			:show-search-bar="showSearchBar">
			<template v-slot:cardIcon>
				<image style="width:54rpx;height:54rpx;" src="@/static/flight-cargo.png"></image>
			</template>
			<template v-slot:cardRight="scope">
				<to-waiting-area-card
					:item-ori="scope.item"
					@uploadImage="uploadImageBefore"
					@openBottomPopup="openBottomPopup"
					@showBottomPopup="showBottomPopup"
					@openUploadImageDialog="openUploadImageDialog"
					>
				</to-waiting-area-card>
			</template>
		</list-content>
		
		<!-- 底部操作栏 -->
		<bottom-bar
			 btn="确认运输单"
			:content-not-null="list.length!=0"
			@inputGetCargoInfo="inputGetCargoInfo"
			@resetInputValue="resetInputValue"
			@confirm="openPopupInput">
		</bottom-bar>
		
		<bottom-popup-to-place
			 ref="bottomPopupToPlace"
			 title="选择待运区"
			 btn="完成修改"
			:locations-ori="locations"
			@confirm="updateWaitArea">
		</bottom-popup-to-place>
		
		<bottom-popup-input
			 ref="bottomPopupInput"
			@scanCode="scanCode"
			@confirm="confirm">
		</bottom-popup-input>
		
		<bottom-popup-details
			 ref="bottomPopupDetails"
			 title="集装器"
			>
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
	import bottomPopupToPlace from '@/pages/cargo/bottom-popup-to-place.vue'
	import bottomPopupInput from '@/pages/cargo/bottom-popup-input.vue'
	import bottomPopupDetails from '@/pages/cargo/bottom-popup-details.vue'
	import uploadImageDialog from '@/pages/cargo/upload-image-dialog.vue'
	import {getCargoInfo, confirm, onError, updateStandCode} from '@/api/cargo/index.js'
	import { validatenull } from '@/common/util/validate.js'
	import cargoMixin from '@/pages/cargo/cargo-mixin.js'
	import { debounce } from '@/common/util/util.js'
	import cargoRemindDialog from '@/pages/cargo/cargo-remind-dialog.vue'
	export default {
		mixins: [cargoMixin],
	  components: {
			navBar,
			listContent,
			bottomBar,
			toWaitingAreaCard,
			bottomBarLeftScan,
			bottomPopupToPlace,
			bottomPopupInput,
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
					// 操作类型 TOWAITINGAREA_DRIVER
					operationType: 'TOWAITINGAREA_DRIVER'
				},
				// 确认出库需要提交的表单信息
				confirmForm: {
					// 货物信息
					cargos: [],
					// 方向
					direction: 'D',
					// 操作类型
					operationType: 'TOWAITINGAREA_DRIVER'
				},
				interval: null
			}
		},
		mounted () {
			this.cargoRemind('TOWAITINGAREA_STEVEDORING', '交接运往待运区装卸')
			this.getShipmentAreas()
			this.refreshStandCodeAll()
			var that = this
			this.interval = setInterval(function () {
				that.refreshStandCodeAll()
			}, 30000)
		},
		beforeDestroy () {
			clearInterval(this.interval)
		},
		onShow () {
			if (!this.arrivedLeaveWaitingArea) {
				let list = uni.getStorageSync('arrivedLeaveWaitingArea')
				if (list) {
					this.list = [...list]
					var that = this
					this.$nextTick(function(){
						if (this.nextTickTime < 1) {
							that.refresh2()
							that.nextTickTime++
						}
					})
				}
				uni.removeStorageSync('arrivedLeaveWaitingArea')
			}
		},
		onBackPress () {
			if (!this.arrivedLeaveWaitingArea) {
				uni.setStorageSync('arrivedLeaveWaitingArea', this.list)
			}
		},
		methods:{
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
				this.cargoInfoForm.uld = this.cargoInfoForm.uld.toUpperCase()
				getCargoInfo(this.cargoInfoForm).then(res => {
					console.log('getCargoInfo', res)
					if(res.status && !validatenull(res.data)) {
						this.scanSound()
						uni.vibrateLong()
						this.setArrivedLeaveWaitingArea(false)
						this.list = []
						res.data.forEach(e => {
							this.list.push(e)
						})
						this.$refs.listContent.setList(this.list)
					}
					this.$message(res.message)
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
			},
			
			
			// 完成出库
			confirm: debounce(function (driverNumber) {
				this.initConfirmFormCargos()
				this.confirmForm.cargos.forEach(e => e.firstTransportCarCode = driverNumber)
				this.confirmBtn()
			}),
			
			confirmBtn () {
				this.$loading()
				confirm(this.confirmForm).then(res => {
					console.log('confirmBtn', res)
					if (res.status) {
						this.setArrivedLeaveWaitingArea(true)
						uni.navigateTo({
							url: `/pages/cargo/leaveport/arrive-waiting-area-driver?uld=` + this.confirmForm.cargos[0].containerCode.split('/')[0]
						})
					} else {
						this.$message(res.message)
					}
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
			},
			
			uploadImageBefore (e) {
				this.uploadImage(e, 'TOWAITINGAREA_DRIVER')
			}
		}
	}
</script>


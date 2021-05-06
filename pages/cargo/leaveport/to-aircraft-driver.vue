/*
* 界面名称:交接运往机位（拖车司机）
* 界面功能:
* 其他    :
* 时间    :2020-8-15 11:29:14
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
			:is-driver="true"
			@deleteList="deleteList"
			@scanCode="scanCode"
			@resetInputValue="resetInputValue"
			@inputGetCargoInfo="inputGetCargoInfoDebounce"
			@changeSearchBarStatus="changeSearchBarStatus"
			@showSelectFlag="showSelectFlag">
		</nav-bar>
		
		<!-- 内容 -->
		<list-content
			 ref="listContent"
			:merge-flag="true"
			:to-place="'aircraftArea'"
			:content-not-null="list.length!=0"
			:show-search-bar="showSearchBar"
			>
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
			 btn="确认运输单"
			:content-not-null="list.length!=0"
			@inputGetCargoInfo="inputGetCargoInfo"
			@resetInputValue="resetInputValue"
			@confirm="openPopupInput">
		</bottom-bar>
		
		<bottom-popup-input
			 ref="bottomPopupInput"
			@scanCode="scanCode"
			@confirm="confirm">
		</bottom-popup-input>
		
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
					// 操作类型 TOAIRCRAFT_DRIVER
					operationType: 'TOAIRCRAFT_DRIVER'
				},
				// 确认出库需要提交的表单信息
				confirmForm: {
					// 货物信息
					cargos: [],
					// 方向
					direction: 'D',
					// 操作类型
					operationType: 'TOAIRCRAFT_DRIVER'
				},
				interval: null
			}
		},
		onBackPress () {
			if (!this.arrivedLeaveAircraft) {
				uni.setStorageSync('arrivedLeaveAircraft', this.list)
			}
		},
		
		onShow () {
			if (!this.arrivedLeaveAircraft) {
				let list = uni.getStorageSync('arrivedLeaveAircraft')
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
				uni.removeStorageSync('arrivedLeaveAircraft')
			}
		},
		
		mounted () {
			this.cargoRemind('TOAIRCRAFT_STEVEDORING', '交接运往机位装卸')
			var that = this
			this.refreshStandCodeAll()
			this.interval = setInterval(function () {
				that.refreshStandCodeAll()
			}, 30000)
		},
		beforeDestroy () {
			clearInterval(this.interval)
		},
		methods:{
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
			// 通过集装器号得到货物信息
			getCargoInfo () {
				this.cargoInfoForm.uld = this.cargoInfoForm.uld.toUpperCase()
				getCargoInfo(this.cargoInfoForm).then(res => {
					if(res.status && !validatenull(res.data)) {
						this.scanSound()
						uni.vibrateLong()
						this.setArrivedLeaveAircraft(false)
						this.list = []
						res.data.forEach(e => {
							this.list.push(e)
						})
						this.$refs.listContent.setList(this.list)
					} else {
						this.$message(res.message)
					}
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
			},
			// 完成出库
			confirm: debounce(function (driverNumber) {
				this.initConfirmFormCargos()
				this.confirmForm.cargos.forEach(e => e.secondTransportCarCode = driverNumber)
				this.confirmBtn()
			}),
			uploadImageBefore (e) {
				this.uploadImage(e, 'TOAIRCRAFT_DRIVER')
			},
			confirmBtn () {
				this.$loading()
				confirm(this.confirmForm).then(res => {
					console.log('confirmBtn', res)
					if (res.status) {
						this.setArrivedLeaveAircraft(true)
						uni.hideLoading()
						uni.navigateTo({
							url: `/pages/cargo/leaveport/arrive-aircraft?uld=` + this.confirmForm.cargos[0].containerCode.split('/')[0]
						})
					} else {
						this.$message(res.message)
						uni.hideLoading()
						setTimeout(function () {
							uni.navigateBack()
						}, 2500)
					}
				}).catch(err => {
					onError(err)
				})
			},
		}
	}
</script>


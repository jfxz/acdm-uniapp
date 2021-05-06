/*
* 界面名称:交接运往货站(拖车司机)
* 界面功能:
* 其他    :
* 时间    :2020-8-22 17:33:50
* 作者    :gyb
*/
<template>
	<view>
		<!-- 导航栏 -->
		<nav-bar
			 title="交接运往货站"
			:content-not-null="list.length!=0"
			:show-search-bar="showSearchBar"
			:input-value="inputValue"
			:is-driver="true"
			@deleteList="deleteList"
			@scanCode="scanCode"
			@resetInputValue="resetInputValue"
			@inputGetCargoInfo="inputGetCargoInfoDebounce"
			@changeSearchBarStatus="changeSearchBarStatus">
		</nav-bar>
		
		<!-- 内容 -->
		<list-content
			 ref="listContent"
			:to-place="'cargoStation'"
			:content-not-null="list.length!=0"
			:show-search-bar="showSearchBar"
			:merge-flag="true">
			<template v-slot:cardRight="scope">
				<transfer-card
					:first="false"
					:item-ori="scope.item"
					:arror="true"
					@uploadImage="uploadImageBefore"
					@openBottomPopup="openBottomPopup"
					@showBottomPopup="showBottomPopup"
					@openUploadImageDialog="openUploadImageDialog">
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
			@confirm="openPopupInput">
			<!-- 左侧操作选项-->
			<template v-slot:left>
				<bottom-bar-left-scan
					@scanCode="scanCode"
					@changeSearchBarStatus="changeBottomSearchBarStatus">
				</bottom-bar-left-scan>
			</template>
		</bottom-bar>
		
		<bottom-popup-details
			 ref="bottomPopupDetails"
			 title="板/箱/散装车">
		</bottom-popup-details>
		
		<bottom-popup-input
			 ref="bottomPopupInput"
			@scanCode="scanCode"
			@confirm="confirm">
		</bottom-popup-input>
		
		
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
	import bottomBarLeftSelectall from '@/pages/cargo/bottom-bar-left-selectall.vue'
	import transferCard from '@/pages/cargo/enterport/components/transfer-card'
	import bottomPopupDetails from '@/pages/cargo/enterport/components/bottom-popup-details.vue'
	import bottomPopupInput from '@/pages/cargo/bottom-popup-input.vue'
	import bottomBarLeftScan from '@/pages/cargo/bottom-bar-left-scan.vue'
	import uploadImageDialog from '@/pages/cargo/upload-image-dialog.vue'
	import {getCargoInfo, confirm, onError} from '@/api/cargo/index.js'
	import { validatenull } from '@/common/util/validate.js'
	import cargoMixin from '../cargo-mixin.js'
	import { debounce } from '@/common/util/util.js'
	import cargoRemindDialog from '@/pages/cargo/cargo-remind-dialog.vue'
	export default {
		mixins: [cargoMixin],
		components: {
			navBar,
			listContent,
			bottomBar,
			bottomBarLeftSelectall,
			transferCard,
			bottomPopupDetails,
			bottomPopupInput,
			bottomBarLeftScan,
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
					direction: 'A',
					// 操作类型 TOSTATION_DRIVER
					operationType: 'TOSTATION_DRIVER'
				},
				// 确认出库需要提交的表单信息
				confirmForm: {
					// 货物信息
					cargos: [],
					// 方向
					direction: 'A',
					// 操作类型
					operationType: 'TOSTATION_DRIVER'
				}
			}
		},
		mounted () {
			this.cargoRemind('TOSTATION_STEVEDORING', '交接运往货站装卸')
		},
		onShow () {
			if (!this.arrivedEnterStation) {
				let list = uni.getStorageSync('arrivedEnterStation')
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
				uni.removeStorageSync('arrivedEnterStation')
			}
		},
		onBackPress () {
			if (!this.arrivedEnterStation) {
				uni.setStorageSync('arrivedEnterStation', this.list)
			}
		},
		methods:{
			// 通过集装器号得到货物信息
			getCargoInfo () {
				this.cargoInfoForm.uld = this.cargoInfoForm.uld.toUpperCase()
				getCargoInfo(this.cargoInfoForm).then(res => {
					console.log('getCargoInfo', res)
					if(res.status && !validatenull(res.data)) {
						this.scanSound()
						uni.vibrateLong()
						this.setArrivedEnterStation(false)
						this.list = res.data
						this.$refs.listContent.setList(this.list)
					} else {
						this.$message(res.message)
					}
					uni.hideLoading()
				}).catch(err => {
					onError(err)
					uni.hideLoading()
				})
			},
			
			// 完成出库
			confirm: debounce(function (driverNumber) {
				this.initConfirmFormCargos()
				this.confirmForm.cargos.forEach(e => e.secondTransportCarCode = driverNumber)
				this.confirmBtn()
			}),
			uploadImageBefore (e) {
				this.uploadImage(e, 'TOSTATION_DRIVER')
			},
			
			confirmBtn () {
				this.$loading()
				confirm(this.confirmForm).then(res => {
					console.log('confirmBtn', res)
					if (res.status) {
						this.$refs.listContent.setList(res.data)
						this.setArrivedEnterStation(true)
						uni.navigateTo({
							url: `/pages/cargo/enterport/arrive-cargo-station?uld=` + this.confirmForm.cargos[0].containerCode.split('/')[0]
						})
					}
					this.$message(res.message)
					uni.hideLoading()
				}).catch(err => {
					onError(err)
					uni.hideLoading()
				})
			}
		}
	}
</script>


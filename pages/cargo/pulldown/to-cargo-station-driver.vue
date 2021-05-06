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
			@scanCode="scanCode"
			@resetInputValue="resetInputValue"
			@inputGetCargoInfo="inputGetCargoInfo"
			@changeSearchBarStatus="changeSearchBarStatus">
		</nav-bar>
		
		<!-- 内容 -->
		<list-content
			 ref="listContent"
			:content-not-null="list.length!=0"
			:show-search-bar="showSearchBar">
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
			@confirm="openPopupInput">
			<!-- 左侧操作选项-->
			<template v-slot:left>
				<bottom-bar-left-scan
					@scanCode="scanCode"
					@changeSearchBarStatus="changeBottomSearchBarStatus">
				</bottom-bar-left-scan>
			</template>
		</bottom-bar>
		
		<bottom-popup-input
			 ref="bottomPopupInput"
			@scanCode="scanCode"
			@confirm="confirm">
		</bottom-popup-input>
	</view>
</template>

<script>
	import navBar from '@/pages/cargo/nav-bar.vue'
	import listContent from '@/pages/cargo/list-content.vue'
	import bottomBar from '@/pages/cargo/bottom-bar.vue'
	import transferCard from '@/pages/cargo/pulldown/components/transfer-card'
	import bottomPopupInput from '@/pages/cargo/bottom-popup-input.vue'
	import bottomBarLeftScan from '@/pages/cargo/bottom-bar-left-scan.vue'
	import {getPulldownCargoInfo, pulldownConfirm, onError} from '@/api/cargo/index.js'
	import cargoMixin from '../cargo-mixin.js'
	export default {
		mixins: [cargoMixin],
		components: {
			navBar,
			listContent,
			bottomBar,
			transferCard,
			bottomPopupInput,
			bottomBarLeftScan
		},
		data () {
			return {
				// 通过集装器号获取货物信息的接口需要提交的表单信息
				cargoInfoForm: {
					// 集装器编码
					uld: '',
					// 方向 出港为PULL
					direction: 'PULL',
					// 操作类型 TOSTATION_DRIVER
					operationType: 'TOSTATION_DRIVER'
				},
				// 确认出库需要提交的表单信息
				confirmForm: {
					// 货物信息
					cargos: [],
					// 方向
					direction: 'PULL',
					// 操作类型
					operationType: 'TOSTATION_DRIVER'
				}
			}
		},
		onShow () {
			if (!this.arrivedPulldownStation) {
				let list = uni.getStorageSync('arrivedPulldownStation')
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
				uni.removeStorageSync('arrivedPulldownStation')
			}
		},
		onBackPress () {
			if (!this.arrivedPulldownStation) {
				uni.setStorageSync('arrivedPulldownStation', this.list)
			}
		},
		methods:{
			// 通过集装器号得到货物信息
			getCargoInfo () {
				this.cargoInfoForm.uld = this.cargoInfoForm.uld.toUpperCase()
				getPulldownCargoInfo(this.cargoInfoForm).then(res => {
					console.log('getCargoInfo', res)
					if(res.status) {
						this.scanSound()
						uni.vibrateLong()
						this.setArrivedPulldownStation(false)
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
			confirm (driverNumber) {
				this.initConfirmFormCargos()
				this.confirmForm.cargos.forEach(e => e.secondTransportCarCode = driverNumber)
				this.confirmBtn()
			},
			uploadImageBefore (e) {
				this.uploadImage(e, 'TOSTATION_DRIVER')
			},
			
			confirmBtn () {
				this.$loading()
				pulldownConfirm(this.confirmForm).then(res => {
					console.log('confirmBtn', res)
					if (res.status) {
						this.confirmForm.cargos.forEach(e => {
							e.status = operationType
						})
						this.$refs.listContent.setListNoChange(this.confirmForm.cargos)
						this.setArrivedPulldownStation(true)
						uni.navigateTo({
							url: `/pages/cargo/pulldown/arrive-cargo-station?uld=` + this.confirmForm.cargos[0].containerCode.split('/')[0]
						})
					} else {
						this.$message(res.message)
					}
					uni.hideLoading()
				}).catch(err => {
					onError(err)
					uni.hideLoading()
				})
			}
		}
	}
</script>


/*
* 界面名称:到达待运区交接
* 界面功能:
* 其他    :
* 时间    :2020-8-20 17:02:26
* 作者    :gyb
*/ 
<template>
	<view>
		<!-- 导航栏 -->
		<nav-bar
			 title="到达待运区交接"
			:content-not-null="list.length!=0"
			:show-search-bar="showSearchBar"
			:input-value="inputValue"
			@scanCode="scanCode"
			@resetInputValue="resetInputValue"
			@inputGetCargoInfo="inputGetCargoInfoDebounce"
			@changeSearchBarStatus="changeSearchBarStatus">
		</nav-bar>
		
		<!-- 内容 -->
		<list-content
			 ref="listContent"
			 direction="A"
			:to-place="'waitingArea'"
			:merge-flag="true"
			:content-not-null="list.length!=0"
			:show-search-bar="showSearchBar"
			:cant-select-status="arrivedCondition"
			@noSelectedWarn="noSelectedWarn"
			@changeBottomSelectAll="changeBottomSelectAll"
			@completedArrived="completedArrived">
			<template v-slot:cardRight="scope">
				<transfer-card
					:item-ori="scope.item"
					:to-arrive-ori="toArrive"
					:arrived-condition="arrivedCondition"
					@uploadImage="uploadImageBefore"
					@confirmRight="confirmRight"
					@openBottomPopup="openBottomPopup"
					@showBottomPopup="showBottomPopup"
					@getList="getList"
					@openUploadImageDialog="openUploadImageDialog">
				</transfer-card>
			</template>
		</list-content>
		
		<!-- 底部操作栏 -->
		<bottom-bar
			 btn="到达"
			:content-not-null="list.length!=0"
			:btn-can-press="btnCanPress"
			@inputGetCargoInfo="inputGetCargoInfo"
			@resetInputValue="resetInputValue"
			@confirm="confirm">
			<!-- 左侧操作选项-->
			<template v-slot:left>
				<bottom-bar-left-selectall
					ref="bottomSelect"
					@selectAll="selectAll"
					@cancelSelectAll="cancelSelectAll">
				</bottom-bar-left-selectall>
			</template>
			<template v-slot:right>
				<view v-show="refreshFlag" :class="[btnCanPress?'btn':'btn-light']" style="margin-right: 11rpx;" @tap="confirm">到达</view>
			</template>
		</bottom-bar>
		
		<bottom-popup-details
			 ref="bottomPopupDetails"
			 title="板/箱/散装车">
		</bottom-popup-details>
	</view>
</template>

<script>
	import navBar from '@/pages/cargo/nav-bar.vue'
	import listContent from '@/pages/cargo/list-content.vue'
	import bottomBar from '@/pages/cargo/bottom-bar.vue'
	import bottomBarLeftSelectall from '@/pages/cargo/bottom-bar-left-selectall.vue'
	import transferCard from '@/pages/cargo/enterport/components/transfer-card'
	import bottomPopupDetails from '@/pages/cargo/enterport/components/bottom-popup-details.vue'
	import {DIC} from '@/common/dic.js'
	import { getCargoInfo, confirm, onError } from '@/api/cargo/index.js'
	import { debounce } from '@/common/util/util.js'
	import cargoMixin from '@/pages/cargo/cargo-mixin.js'
	export default {
		mixins: [cargoMixin],
		components: {
			navBar,
			listContent,
			bottomBar,
			bottomBarLeftSelectall,
			transferCard,
			bottomPopupDetails
		},
		data () {
			return {
				// 通过集装器号获取货物信息的接口需要提交的表单信息
				cargoInfoForm: {
					// 集装器编码
					uld: '',
					// 方向 出港为D
					direction: 'A',
					// 操作类型 ARRIVEDWAITINGAREA_DRIVER
					operationType: 'ARRIVEDWAITINGAREA_STEVEDORING'
				},
				// 确认出库需要提交的表单信息
				confirmForm: {
					// 货物信息
					cargos: [],
					// 方向
					direction: 'A',
					// 操作类型
					operationType: 'ARRIVEDWAITINGAREA_STEVEDORING'
				},
				refreshFlag: true
			}
		},
		
		onLoad (e) {
			this.toArrive = true
			this.arrivedCondition = 'ARRIVEDWAITINGAREA'
			if (e.uld) {
				this.fromDriver = true
				this.cargoInfoForm.uld = e.uld
				this.getCargoInfo()
			} else if (!this.completedEnterArrivedWaitingArea) {
				let list = uni.getStorageSync('completedEnterArrivedWaitingArea')
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
			}
		},
		
		mounted () {
			var that = this
			this.$nextTick(function(){
				setTimeout(function(){
					try {
						that.$refs.bottomSelect.selectAll()
					} catch (err) {
						console.log('err', err)
					}
				}, 100)
			})
		},
		
		onBackPress () {
			if (!this.completedEnterArrivedWaitingArea) {
				uni.setStorageSync('completedEnterArrivedWaitingArea', this.list)
			}
		},
		methods:{
			// 通过集装器号得到货物信息
			getCargoInfo () {
				var that = this
				this.cargoInfoForm.uld = this.cargoInfoForm.uld.toUpperCase()
				getCargoInfo(this.cargoInfoForm).then(res => {
					console.log('getCargoInfo', res)
					if(res.status) {
						this.scanSound()
						uni.vibrateLong()
						this.setCompletedEnterArrivedWaitingArea(false)
						this.list = res.data
						this.$refs.listContent.setList(this.list)
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
					uni.hideLoading()
				})
			},
			
			confirm: debounce(function () {
				if (!this.btnCanPress) {
					// 如果不可选
					return
				}
				this.initConfirmFormCargos()
				if (this.confirmForm.cargos.length > 0) {
					this.confirmBtn()
				}
			}),
			
			confirmRight: debounce(function (item) {
				this.confirmForm.cargos = this.$refs.listContent.getList().filter(e => (e.flight === item.flight && e.registration === item.registration))
				confirm(this.confirmForm).then(res => {
					console.log('confirmBtn', res)
					if (res.status) {
						this.confirmForm.cargos.forEach(e => {
							e.status = this.arrivedCondition
							e.selected = false
						})
						if (!this.$refs.listContent.judgeAtLeastSelected()) {
							// 如果有一个都没有选择
							this.btnCanPress = false
						}
						this.$refs.listContent.setList([])
						this.$refs.listContent.unshiftToListWithChange(this.confirmForm.cargos)
						this.$refs.listContent.refresh()
						var that = this
						this.$nextTick(function(){
							that.$refs.listContent.judgeAllArrived()
						})
						this.$message('成功到达')
						// 如果列表所有卡片都是已到达状态
						if (!this.$refs.listContent.getList().find(e => e.status !== this.arrivedCondition)) {
							this.btnCanPress = false
						}
					} else {
						this.$message(res.message)
					}
				}).catch(err => {
					onError(err)
				})
			}),
			
			confirmBtn () {
				var that = this
				this.$loading()
				confirm(this.confirmForm).then(res => {
					console.log('confirmBtn', res)
					if (res.status) {
						this.refresh2()
						this.$nextTick(function(){
							setTimeout(function(){
								that.$refs.listContent.judgeAllArrived()
							}, 100)
						})
					}
					this.$message(res.message)
					uni.hideLoading()
				}).catch(err => {
					onError(err)
					uni.hideLoading()
				})
			},
			
			uploadImageBefore (e) {
				this.uploadImage(e, 'ARRIVEDWAITINGAREA_DRIVER')
			},
			
			getList () {
				let list = this.$refs.listContent.getDisplayList()
			},
			completedArrived () {
				this.setCompletedEnterArrivedWaitingArea(true)
				var that = this
				this.refreshFlag = false
				this.$nextTick(function(){
					setTimeout(function () {
						that.btnCanPress = false
						that.refreshFlag = true
					}, 300)
				})
				uni.removeStorageSync('completedEnterArrivedWaitingArea')
			}
		}
	}
</script>

<style lang="scss" scoped>
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
</style>

/*
* 界面名称:到达机位交接
* 界面功能:
* 其他    :
* 时间    :2020-8-15 09:57:40
* 作者    :gyb
*/
<template>
	<view>
		<!-- 导航栏 -->
		<nav-bar
			 title="到达机位交接"
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
			 to-place="aircraftArea"
			 cant-select-status="ARRIVEDAIRCRAFT"
			:merge-flag="true"
			:content-not-null="list.length!=0"
			:show-search-bar="showSearchBar"
			@completedArrived="completedArrived"
			@noSelectedWarn="noSelectedWarn"
			@changeBottomSelectAll="changeBottomSelectAll">
			<template v-slot:cardIcon>
				<image style="width:54rpx;height:54rpx;" src="@/static/container.png"></image>
			</template>
			<template v-slot:cardRight="scope">
				<to-waiting-area-card
					 modifyText="更新"
					 arrived-condition="ARRIVEDAIRCRAFT"
					:toAircraft="true"
					:arrived-waiting-area-driver="true"
					:item-ori="scope.item"
					@confirmRight="confirmRight"
					@uploadImage="uploadImageBefore"
					@showBottomPopup="showBottomPopup"
					@openBottomPopup="updateStandCode(scope.item)"
					@openUploadImageDialog="openUploadImageDialog">
				</to-waiting-area-card>
			</template>
		</list-content>
		
		<!-- 底部操作栏 -->
		<bottom-bar
			 btn="确认"
			:content-not-null="list.length!=0"
			:btn-can-press="btnCanPress"
			:show-search-bar="false"
			@inputGetCargoInfo="inputGetCargoInfo"
			@resetInputValue="resetInputValue"
			@confirm="openConfirmDialog">
			<!-- 左侧操作选项-->
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
	import flightInfoCard from '@/pages/cargo/flight-info-card.vue'
	import notReceivedContainers from '@/pages/cargo/leaveport/components/not-received-containers.vue'
	import bottomBar from '@/pages/cargo/bottom-bar.vue'
	import containerWeightNopassCard from '@/pages/cargo/leaveport/components/container-weight-nopass-card.vue'
	import toWaitingAreaCard from '@/pages/cargo/leaveport/components/to-waiting-area-card.vue'
	import bottomBarLeftScan from '@/pages/cargo/bottom-bar-left-scan.vue'
	import bottomBarLeftSelectall from '@/pages/cargo/bottom-bar-left-selectall.vue'
	import {DIC} from '@/common/dic.js'
	import {
		getCargoInfo,
		onError,
		confirm,
		updateStandCode
	} from '@/api/cargo/index.js'
	import { validatenull } from '@/common/util/validate.js'
	import cargoMixin from '@/pages/cargo/cargo-mixin.js'
	import bottomPopupDetails from '@/pages/cargo/bottom-popup-details.vue'
	import uploadImageDialog from '@/pages/cargo/upload-image-dialog.vue'
	import { debounce } from '@/common/util/util.js'
	import cargoRemindDialog from '@/pages/cargo/cargo-remind-dialog.vue'
	import confirmModal from '@/pages/cargo/leaveport/components/installed-audit-modal.vue'
	export default {
		mixins: [cargoMixin],
	  components: {
			navBar,
			listContent,
			flightInfoCard,
			notReceivedContainers,
			bottomBar,
			containerWeightNopassCard,
			bottomBarLeftScan,
			bottomBarLeftSelectall,
			toWaitingAreaCard,
			bottomPopupDetails,
			uploadImageDialog,
			cargoRemindDialog,
			confirmModal
		},
		data () {
			return {
				displayList: [],
				// 通过集装器号获取货物信息的接口需要提交的表单信息
				cargoInfoForm: {
					// 集装器编码
					uld: '',
					// 方向 出港为D
					direction: 'D',
					// 操作类型 ARRIVEDAIRCRAFT
					operationType: 'ARRIVEDAIRCRAFT'
				},
				// 确认出库需要提交的表单信息
				confirmForm: {
					// 货物信息
					cargos: [],
					// 方向
					direction: 'D',
					// 操作类型
					operationType: 'ARRIVEDAIRCRAFT'
				},
				refreshFlag: true,
				btnCanPress: true,
				fromDriver: false,
				interval: null
			}
		},
		
		mounted () {
			this.cargoRemind('TOAIRCRAFT_DRIVER', '交接运往机位司机')
			var that = this
			this.interval = setInterval(function () {
				that.refreshStandCodeAll()
			}, 30000)
		},
		
		beforeDestroy () {
			clearInterval(this.interval)
		},
		
		onBackPress () {
			if (!this.completedLeaveArrivedAircraft) {
				uni.setStorageSync('completedLeaveArrivedAircraft', this.list)
			}
		},
		
		onLoad (e) {
			if (e.uld) {
				// 如果是司机确认运输单后跳转到该页面
				this.fromDriver = true
				this.cargoInfoForm.uld = e.uld
				this.getCargoInfo()
			} else if (!this.completedLeaveArrivedAircraft) {
				let list = uni.getStorageSync('completedLeaveArrivedAircraft')
				if (list) {
					this.list = [...list]
					var that = this
					this.$nextTick(function(){
						if (that.nextTickTime < 1) {
							// 刷新，只重新扫一个集装器，获得一批集装器
							that.refresh2()
							that.nextTickTime++
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
			scanCode () {
				this.scanCodeNoCheckRepeat()
			},
			// 通过输入框获取信息
			inputGetCargoInfo (e) {
				if (e) {
					this.inputValue = e
				}
				this.cargoInfoForm.uld = this.inputValue
				this.$loading()
				this.getCargoInfo()
			},
			// 通过集装器号得到货物信息
			getCargoInfo () {
				var that = this
				this.cargoInfoForm.uld = this.cargoInfoForm.uld.toUpperCase()
				getCargoInfo(this.cargoInfoForm).then(res => {
					console.log('getCargoInfo', res.data)
					if(res.status && !validatenull(res.data)) {
						this.scanSound()
						uni.vibrateLong()
						this.list = res.data
						this.$refs.listContent.setList(this.list)
						
						this.setCompletedLeaveArrivedAircraft(false)
						that.selectAll()
						this.$refs.listContent.judgeAllArrived()
						setTimeout(function () {
							that.$refs.bottomSelect.changeSelectAllFlag(true)
						}, 100)
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
				let list = this.$refs.listContent.getList()
				if (list) {
					list = list.filter(e => (e.flight === item.flight && e.registration === item.registration))
					this.confirmForm.cargos = list
					this.confirmBtn()
				}
			},
			
			confirmBtn () {
				this.$loading()
				confirm(this.confirmForm).then(res => {
					console.log('confirmBtn', res)
					if (res.status && !validatenull(res.data)) {
						// 选择一部分集装器到达成功后刷新列表
						this.refresh2()
						var that = this
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
				})
			},
			
			goBack () {
				this.$message('交接成功')
				if (this.fromDriver) {
					setTimeout(function () {
						uni.navigateBack({
						 delta: 2
						})
					}, 1000)
				} else {
					setTimeout(function () {
						uni.navigateBack()
					}, 1000)
				}
			},
			
			uploadImageBefore (e) {
				this.uploadImage(e, 'ARRIVEDAIRCRAFT')
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
				this.setCompletedLeaveArrivedAircraft(true)
				this.refreshFlag = false
				this.$nextTick(function(){
					setTimeout(function () {
						that.btnCanPress = false
						that.refreshFlag = true
					}, 300)
				})
				uni.removeStorageSync('completedLeaveArrivedAircraft')
			},
			selectAll () {
				this.$refs.listContent.selectAll()
				if (this.$refs.listContent.judgeAtLeastSelected('ARRIVEDAIRCRAFT')) {
					this.btnCanPress = true
				} else {
					this.btnCanPress = false
				}
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

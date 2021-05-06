/*
* 界面名称:装机稽核
* 界面功能:
* 其他    :
* 时间    :2020-8-15 09:57:40
* 作者    :gyb
*/
<template>
	<view>
		<!-- 导航栏 -->
		<nav-bar
       ref="navBar"
			 title="装机稽核"
			:content-not-null="list.length!=0"
			:show-search-bar="showSearchBar"
			:input-value="inputValue"
			:show-search-flight-btn="true"
			:placeHolder="placeHolder"
      :focus="focus"
      :isInstalledAudit="true"
      @inputSearch="inputSearch"
			@scanCode="scanCode"
			@resetInputValue="resetInputValue"
			@inputGetCargoInfo="inputGetCargoInfoDebounce"
			@changeSearchBarStatus="changeSearchBarStatus"
			@searchFlight="searchFlight">
		</nav-bar>
		
		<!-- 内容 -->
		<list-content
			:not-id="true"
			 ref="listContent"
			:content-not-null="list.length!=0"
			:installed-audit="true"
			:show-search-bar="showSearchBar"
      :is-installed-audit="true">
			<template v-slot:top>
				<flight-info-card
					:join="false"
          :is-installed-audit="true"
					:item-ori="flight">
				</flight-info-card>
			</template>
			<template v-slot:cardIcon>
				<image style="width:54rpx;height:54rpx;" src="@/static/container.png"></image>
			</template>
			<template v-slot:cardRight="scope">
				<container-weight-card
					:audit="true"
					:item-ori="scope.item"
					@uploadImage="uploadImageBefore"
                    @soloAudit="soloAudit">
				</container-weight-card>
			</template>
		</list-content>
		
		<!-- 底部操作栏 -->
		<bottom-bar
			:content-not-null="list.length!=0"
			@inputGetCargoInfo="inputGetCargoInfo"
			@resetInputValue="resetInputValue"
			:show-search-bar="showBottomSearchBar">
			<!-- 左侧操作选项-->
			<template v-slot:left>
				<bottom-bar-left-scan
					@changeSearchBarStatus="changeBottomSearchBarStatus"
					@scanCode="scanCode">
				</bottom-bar-left-scan>
			</template>
			
			<template v-slot:right>
				<view v-show="refreshFlag" :class="[btnCanPress?'btn':'btn-light']" @tap="showAuditChangeDialog">装载变化</view>
				<view class="btn-blue" @tap="showConfirmModal">完成</view>
			</template>
		</bottom-bar>
		
		<installed-audit-dialog
			ref="installedAuditDialog"
			@confirm="confirm">
		</installed-audit-dialog>
		
		<input-cabin-dialog
			ref="inputCabinDialog">
		</input-cabin-dialog>
		
		<cargo-remind-dialog
			ref="cargoRemindDialog">
		</cargo-remind-dialog>
		
		<installed-audit-modal
			ref="installedAuditModal"
			@confirm="confirm2">
		</installed-audit-modal>
		
		<confirm-modal
			ref="confirmModal">
		</confirm-modal>
		
		<flight-selection-dialog
			ref="flightSelectionDialog"
			@selectFlight="selectFlight">
		</flight-selection-dialog>
	</view>
</template>

<script>
	import dayjs from '@/common/util/dayjs.min.js'
	import navBar from '@/pages/cargo/nav-bar.vue'
	import listContent from '@/pages/cargo/list-content.vue'
	import flightInfoCard from '@/pages/cargo/flight-info-card.vue'
	import bottomBar from '@/pages/cargo/bottom-bar.vue'
	import containerWeightCard from '@/pages/cargo/leaveport/components/container-weight-card.vue'
	import bottomBarLeftScan from '@/pages/cargo/bottom-bar-left-scan.vue'
	import installedAuditDialog from '@/pages/cargo/leaveport/components/installed-audit-dialog.vue'
	import inputCabinDialog from '@/pages/cargo/leaveport/components/input-cabin-dialog.vue'
	import {
    confirm,
		completeAudit,
		getCargoInfo,
		onError,
		getAuditChange,
		getFlightInfo,
		getStandCodeByFlight
	} from '@/api/cargo/index.js'
	import { validatenull } from '@/common/util/validate.js'
	import { debounce } from '@/common/util/util.js'
	import cargoMixin from '@/pages/cargo/cargo-mixin.js'
	import cargoRemindDialog from '@/pages/cargo/cargo-remind-dialog.vue'
	import installedAuditModal from '@/pages/cargo/leaveport/components/installed-audit-modal.vue'
	import confirmModal from '@/pages/cargo/leaveport/components/installed-audit-modal.vue'
	import flightSelectionDialog from '@/pages/cargo/flight-selection-dialog'
	import searchFlightMixin from './search-flight-mixin.js'
	export default {
		mixins: [cargoMixin, searchFlightMixin],
	  components: {
			navBar,
			listContent,
			flightInfoCard,
			bottomBar,
			containerWeightCard,
			bottomBarLeftScan,
			installedAuditDialog,
			inputCabinDialog,
			cargoRemindDialog,
			installedAuditModal,
			confirmModal,
			flightSelectionDialog
		},
		data () {
			return {
        focus: false,
        showSearchBar: true,
				// 通过集装器号获取货物信息的接口需要提交的表单信息
				cargoInfoForm: {
					// 集装器编码
					uld: '',
					// 方向 出港为D
					direction: 'D',
					// 操作类型 INSTALLEDAUDIT
          // TODO
					operationType: 'INSTALLEDCONFIRM'
				},
				// 确认出库需要提交的表单信息
				confirmForm: {
					// 货物信息
					cargos: [],
					// 方向
					direction: 'D',
					// 操作类型
					operationType: 'INSTALLEDAUDIT'
				},
				confirmFlag: '',
				// 已扫描的集装器
				checkedList: [],
				btnCanPress: false,
				refreshFlag: true,
				flightBackup: '',
        timer: null
			}
		},
		mounted () {
			this.cargoRemind('INSTALLEDCONFIRM', '装机确认')
      this.initAutoSearch()
			let roleInfo = uni.getStorageSync('roles_info')
			if (roleInfo) {
				if (roleInfo.find(e => e.name.match(/配载/g))) {
					this.confirmFlag = 'STOWAGE_CONFIRM'
				} else if (roleInfo.find(e => e.name.match(/装卸/g))) {
					this.confirmFlag = 'HANDLING_CONFIRM'
				}
			}
		},
		methods:{
			inputGetCargoInfo (e) {
				this.notAuto = true
				if (e && e !== '') {
					this.inputValue = e.toUpperCase()
				} else {
					return
				}
				this.cargoInfoForm.uld = this.inputValue
				// this.$loading()
				this.getCargoInfo()
			},
			
			// 初始化列表
			initList (res, flag = true) {
				if (!flag) {
					getFlightInfo({
						flight: this.flightBackup,
						origin: 'XMN',
						flightDate: dayjs().format('YYYY-MM-DD') + ' 00:00:00'
					}).then(res => {
						console.log('getFlightInfo-res', res)
						if (res.status && res.data) {
							this.flight = {...this.flight, ...res.data}
							let reg = new RegExp(/\d+/g)
							let flightNumber = reg.exec(this.flightBackup)
							flightNumber = flightNumber ? flightNumber[0] : ''
							if (validatenull(flightNumber)) {
								return
							}
							getStandCodeByFlight({
							  flight: flightNumber
							}).then(res => {
								console.log('getStandCodeByFlight-res', res)
								if (res.status && res.data) {
									this.flight = {...this.flight, standCode: res.data.stand}
								}
								uni.hideLoading()
							}).catch(err => {
								onError(err)
							})
						}
					}).catch(err => {
						onError(err)
					})
				} else {
					if (flag && !res.data.find(e => this.getNumber(e.containerCode) === this.getNumber(this.cargoInfoForm.uld))) {
						let cargoNumber = this.cargoInfoForm.uld
						this.$refs.confirmModal.open(`集装器${cargoNumber}没有在装机单上`)
					}
				}
				if (this.flight.flight !== res.data[0].flight) {
					// 如果不是同一个航班，清空已扫描的集装器
					this.flight = res.data[0]
					this.checkedList = [] 
				}
				let list = res.data
				list.forEach(e => {
					e.checked = false
				})
				// 当前查询的集装器标记为黄色
				let checkedContainerIdx = list.findIndex(e => this.getNumber(e.containerCode) === this.getNumber(this.cargoInfoForm.uld))
				if (checkedContainerIdx > -1) {
					let checkedContainer = list[checkedContainerIdx]
					if (!this.checkedList.find(e => e.containerCode === checkedContainer.containerCode)) {
						this.checkedList.unshift(checkedContainer)
					} else {
						let idx = this.checkedList.findIndex(e => e.containerCode === checkedContainer.containerCode)
						this.checkedList.splice(idx, 1)
						this.checkedList.unshift(checkedContainer)
					}
					this.checkedList.forEach(e => {
						e.checked = true
					})
					// 让当前扫的集装器位于第一个
					list = list.filter(e => !this.checkedList.find(v => v.containerCode === e.containerCode))
					list = [...this.checkedList, ...list]
				}
				this.list = [...list]
				this.$refs.listContent.setList(this.list)
				let inputCabinContainer = this.list.find(e => this.getNumber(e.containerCode) === this.getNumber(this.cargoInfoForm.uld))
				if (inputCabinContainer) {
					this.$refs.inputCabinDialog.open(inputCabinContainer)
				}
				getAuditChange({
					flight: this.flight.flight,
					flightDate: dayjs().format('YYYY-MM-DD') + ' 00:00:00',
					origin: this.flight.origin
				}).then(res => {
					if (res.status && !validatenull(res.data)) {
						this.refreshFlag = false
            setTimeout(function () {
              that.btnCanPress = true
              that.refreshFlag = true
            }, 300)
					}
				}).catch(err => {
					onError(err)
				})
			},
			
			
			// 通过集装器号得到货物信息
			getCargoInfo: debounce(function () {
				this.$loading()
				var that = this
				console.log(this.cargoInfoForm.uld)
				this.cargoInfoForm.uld = this.cargoInfoForm.uld.toUpperCase()
				getCargoInfo(this.cargoInfoForm).then(res => {
					console.log('getCargoInfo', res)
					if (res.status && !validatenull(res.data)) {
						this.scanSound()
						uni.vibrateLong()
						this.initList(res)
					}
					this.$message(res.message)
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
			}),
			
			confirm2: debounce(function () {
				this.confirmForm.operationType = 'INSTALLEDAUDIT'
				this.initConfirmFormCargos()
				this.confirmBtn()
			}),
            
      soloAudit (item) {
          console.log('soloAudit', item)
          this.confirmForm.operationType = 'INSTALLEDAUDIT'
          this.confirmForm.cargos = [item]
          this.confirmBtn()
      },
      
      confirmBtn () {
        this.$loading()
        confirm(this.confirmForm).then(res => {
          console.log('confirmBtn', res)
          if (res.status) {
            this.list.forEach(e => {
              let exit = this.confirmForm.cargos.find(v => v.containerCode === e.containerCode)
              if (exit) {
                e.status = exit.status
              }
            })
            this.$refs.listContent.setList(this.list)
          }
         this.$message(res.message)
         
        }).catch(err => {
          onError(err)
        })
      },
            
			// 完成装载变化确认
			confirm: debounce(function () {
				this.confirmForm.operationType = 'INSTALLEDAUDIT'
				this.$loading()
				completeAudit({
					confirmFlag: this.confirmFlag,
					flight: this.flight.flight,
					flightDate: dayjs().format('YYYY-MM-DD') + ' 00:00:00',
					origin: this.flight.origin
				}).then(res => {
					console.log('confirmBtn', res)
					uni.hideLoading()
					if (res.status && res.data) {
						try {
							this.$message(res.data.message)
						} catch (err) {
							this.$message(res.message)
							console.log('err', err)
						}
						if (res.data.status && res.data.status === '1') {
							this.confirm2()
						}
            setTimeout(function () {
            	uni.navigateBack()
            }, 3000)
					} else {
						this.$message(res.message)
					}
				}).catch(err => {
					onError(err)
				})
			}),
			showConfirmModal () {
				let container = this.list.find(e => e.status !== 'INSTALLING' && e.status !== 'COMPLETED')
				if (!container) {
					// this.confirm2()
					this.$refs.installedAuditModal.open(`是否确认稽核`)
					return
				}
				let containers = this.list.filter(e => e.status !== 'INSTALLING' && e.status !== 'COMPLETED')
				if (containers) {
					let message = containers.map(e => e.containerCode).toString()
					this.$refs.installedAuditModal.open(`${message}未装机,是否确认完成`)
				}
			},
			
			showAuditChangeDialog () {
				let flight = {
					flight: this.flight.flight,
					flightDate: dayjs().format('YYYY-MM-DD') + ' 00:00:00',
					origin: this.flight.origin
				}
				this.$refs.installedAuditDialog.open(flight)
			},
			
			uploadImageBefore (e) {
				this.uploadImage(e, 'INSTALLEDAUDIT')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.btn-blue {
		width: 177rpx;
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
		width: 177rpx;
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
		width: 177rpx;
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
		width: 177rpx;
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

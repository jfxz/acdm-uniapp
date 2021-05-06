/*
* 界面名称:装机确认
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
			 title="装机确认"
			:content-not-null="list.length!=0"
			:show-search-bar="showSearchBar"
			:input-value="inputValue"
      :focus="focus"
      @inputSearch="inputSearch"
			@scanCode="scanCode"
			@resetInputValue="resetInputValue"
			@inputGetCargoInfo="inputGetCargoInfoDebounce"
			@changeSearchBarStatus="changeSearchBarStatus">
		</nav-bar>
		
		<!-- 内容 -->
		<list-content
			 ref="listContent"
			:installed-audit="true"
			:content-not-null="list.length!=0"
			:show-search-bar="showSearchBar">
			<template v-slot:cardIcon>
				<image style="width:54rpx;height:54rpx;" src="@/static/cabin.png"></image>
			</template>
			<template v-slot:cardRight="scope">
				<cabin-card
					:installed-confirm="true"
					:item-ori="scope.item"
					@uploadImage="uploadImageBefore"
					@voice="openCabinDialog">
				</cabin-card>
			</template>
		</list-content>
		
		<!-- 底部操作栏 -->
		<bottom-bar
			 btn="确认"
			:content-not-null="list.length!=0"
			:show-search-bar="showBottomSearchBar"
			@inputGetCargoInfo="inputGetCargoInfo"
			@resetInputValue="resetInputValue"
			@confirm="confirm">
			<!-- 左侧操作选项-->
			<template v-slot:left>
				<bottom-bar-left-scan
					@changeSearchBarStatus="changeBottomSearchBarStatus"
					@scanCode="scanCode">
				</bottom-bar-left-scan>
			</template>
		</bottom-bar>
		
		<!-- 内容 -->
		<not-received-containers
			ref="notReceivedContainers">
		</not-received-containers>
		
		<input-confirm-cabin-dialog
			@refresh="refresh"
			ref="inputCabinDialog">
		</input-confirm-cabin-dialog>
		
		<cargo-remind-dialog
			ref="cargoRemindDialog">
		</cargo-remind-dialog>
	</view>
</template>

<script>
	import navBar from '@/pages/cargo/nav-bar.vue'
	import listContent from '@/pages/cargo/list-content.vue'
	import flightInfoCard from '@/pages/cargo/flight-info-card.vue'
	import notReceivedContainers from '@/pages/cargo/leaveport/components/not-received-containers.vue'
	import bottomBar from '@/pages/cargo/bottom-bar.vue'
	import cabinCard from '@/pages/cargo/leaveport/components/cabin-card.vue'
	import bottomBarLeftScan from '@/pages/cargo/bottom-bar-left-scan.vue'
	import inputConfirmCabinDialog from '@/pages/cargo/leaveport/components/input-confirm-cabin-dialog'
	import { getCargoInfo, confirm, onError} from '@/api/cargo/index.js'
	import { validatenull } from '@/common/util/validate.js'
	import cargoMixin from '@/pages/cargo/cargo-mixin.js'
	import {DIC} from '@/common/dic.js'
	import { debounce } from '@/common/util/util.js'
	import cargoRemindDialog from '@/pages/cargo/cargo-remind-dialog.vue'
	export default {
		mixins: [cargoMixin],
	  components: {
			navBar,
			listContent,
			flightInfoCard,
			notReceivedContainers,
			bottomBar,
			cabinCard,
			bottomBarLeftScan,
			inputConfirmCabinDialog,
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
					// 操作类型 INSTALLEDCONFIRM
					operationType: 'INSTALLEDCONFIRM'
				},
				// 确认出库需要提交的表单信息
				confirmForm: {
					// 货物信息
					cargos: [],
					// 方向
					direction: 'D',
					// 操作类型
					operationType: 'INSTALLEDCONFIRM'
				}
			}
		},
		mounted () {
      this.initAutoSearch()
			this.cargoRemind('SUBCABIN', '货物分舱')
		},
		methods:{
			refresh () {
				let list = [...this.list]
				this.list = []
				console.log('refresh-alength', this.list.length)
				list.forEach(e => {
					this.cargoInfoForm.uld = e.containerCode
					this.getCargoInfo(false)
				})
			},
			voice (cargoHold) {
				const innerAudioContext = uni.createInnerAudioContext()
				innerAudioContext.autoplay = true
				innerAudioContext.src = 'static/' + cargoHold + '.mp3'
				innerAudioContext.onPlay(() => {
				  console.log('开始播放')
				})
				innerAudioContext.onError((res) => {
				  console.log(res)
				})
			},
			openCabinDialog (cargoHold, item) {
				this.voice(cargoHold)
				this.$refs.inputCabinDialog.open(item)
			},
			// 通过集装器号得到货物信息
			getCargoInfo: debounce(function (flag = true) {
				this.cargoInfoForm.uld = this.cargoInfoForm.uld.toUpperCase()
				getCargoInfo(this.cargoInfoForm).then(res => {
					console.log('getCargoInfo', res)
					if (res.status && !validatenull(res.data)) {
						this.scanSound()
						uni.vibrateLong()
						if (this.flight.flight !== res.data[0].flight) {
							// 如果不是同一个航班，清空已扫描的集装器
							this.flight = res.data[0]
						}
						
						let cargoHoldNow = ''
						if (res.data[0].cargoHold) {
							cargoHoldNow = parseInt(res.data[0].cargoHold.match(/\d+/g)[0]) + 'H'
							this.voice(cargoHoldNow)
						}
						let repeat = this.list.find(v => v.containerCode === res.data[0].containerCode)
						if (!repeat) {
							let obj = this.generateObj(res.data[0])
							if (this.judgeInstalled(obj.status)) {
								obj.checked = true
							} else {
								obj.checked = false
							}
							this.list.unshift(obj)
							this.$refs.listContent.setList(this.list)
						}
						let container = this.list.find(e => this.getNumber(e.containerCode) === this.getNumber(this.cargoInfoForm.uld))
						if (container && flag) {
							this.$refs.inputCabinDialog.open(container)
						}
					}
					this.$message(res.message)
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
			}, 500),
			
			// 判断是否已经装机确认过
			judgeInstalled (status) {
				let arrivedIndex = DIC.CARGOSTATUSD.findIndex(e => e === 'INSTALLING')
				if (arrivedIndex > -1) {
					let statusIndex = DIC.CARGOSTATUSD.findIndex(e => e === status)
					if (statusIndex > -1) {
						if (statusIndex < arrivedIndex) {
							return false
						} else {
							return true
						}
					}
				}
				return false
			},
			
			initConfirmFormCargos (status) {
				this.selectListFlag = this.$refs.listContent.judgeSelectListFlag()
				let list = []
				if (!this.selectListFlag) {
					list = this.$refs.listContent.getList()
					this.confirmForm.cargos = list
				} else {
					list = this.$refs.listContent.getSelections()
					this.confirmForm.cargos = list
				}
			},
			// 完成出库
			confirm: debounce(function () {
				this.confirmForm.operationType = 'INSTALLEDCONFIRM'
				this.initConfirmFormCargos()
				this.confirmBtn()
			}),
			
			uploadImageBefore (e) {
				this.uploadImage(e, 'INSTALLEDCONFIRM')
			},
			
			confirmBtn () {
				this.$loading()
				confirm(this.confirmForm).then(res => {
					console.log('confirmBtn', res)
					this.$message(res.message)
					setTimeout(function () {
						uni.navigateBack()
					}, 1000) 
				}).catch(err => {
					onError(err)
				})
			}
		}
	}
</script>


/*
* 界面名称:货物分舱
* 界面功能:
* 其他    :
* 时间    :2020-8-15 09:57:40
* 作者    :gyb
*/
<template>
	<view>
		<!-- 导航栏 -->
		<nav-bar
			 title="货物分舱"
			:content-not-null="list.length!=0"
			:show-search-bar="showSearchBar"
			:input-value="inputValue"
			:show-search-flight-btn="true"
			:placeHolder="placeHolder"
			@scanCode="scanCode"
			@resetInputValue="resetInputValue"
			@inputGetCargoInfo="inputGetCargoInfoDebounce"
			@changeSearchBarStatus="changeSearchBarStatus"
			@searchFlight="searchFlight">
		</nav-bar>
		
		<!-- 内容 -->
		<list-content
			 ref="listContent"
			:not-id="true"
			:content-not-null="list.length!=0"
			:show-search-bar="showSearchBar"
			:show-split-line="true">
			<template v-slot:top>
				<flight-info-card
					:join="false"
					:item-ori="flight">
				</flight-info-card>
			</template>
			<template v-slot:cardIcon>
				<image style="width:54rpx;height:54rpx;" src="@/static/cabin.png"></image>
			</template>
			<template v-slot:cardRight="scope">
				<cabin-card
					:sub-cabin="true"
					:item-ori="scope.item"
					@uploadImage="uploadImageBefore">
				</cabin-card>
			</template>
		</list-content>
		
		<!-- 底部操作栏 -->
		<bottom-bar
			 btn="返回"
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
		
		<cargo-remind-dialog
			ref="cargoRemindDialog">
		</cargo-remind-dialog>
		
		<flight-selection-dialog
			ref="flightSelectionDialog"
			@selectFlight="selectFlight">
		</flight-selection-dialog>
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
	import {
		getCargoInfo,
		confirm,
		updateCargoInfo,
		onError,
		getFlightInfo,
		getStandCodeByFlight
	} from '@/api/cargo/index.js'
	import { validatenull } from '@/common/util/validate.js'
	import cargoMixin from '@/pages/cargo/cargo-mixin.js'
	import cargoRemindDialog from '@/pages/cargo/cargo-remind-dialog.vue'
	import flightSelectionDialog from '@/pages/cargo/flight-selection-dialog'
	import searchFlightMixin from './search-flight-mixin.js'
	import dayjs from '@/common/util/dayjs.min.js'
	export default {
		mixins: [cargoMixin, searchFlightMixin],
	  components: {
			navBar,
			listContent,
			flightInfoCard,
			notReceivedContainers,
			bottomBar,
			cabinCard,
			bottomBarLeftScan,
			cargoRemindDialog,
			flightSelectionDialog
		},
		data () {
			return {
				// 通过集装器号获取货物信息的接口需要提交的表单信息
				cargoInfoForm: {
					// 集装器编码
					uld: '',
					// 方向 出港为D
					direction: 'D',
					// 操作类型 SUBCABIN
					operationType: 'SUBCABIN'
				},
				// 确认出库需要提交的表单信息
				confirmForm: {
					// 货物信息
					cargos: [],
					// 方向
					direction: 'D',
					// 操作类型
					operationType: 'SUBCABIN'
				},
				interval: null,
				flightBackup: ''
			}
		},
		
		mounted () {
			var that = this
			this.cargoRemind('ARRIVEDAIRCRAFT', '到达机位交接')
			this.interval = setInterval(function () {
        if (that.list.length > 0) {
          if (that.placeHolder === '请输入航班号') {
          	that.searchFlight(that.flightBackup, false)
          } else {
          	that.refresh2()
          }
        }
			}, 30000)
		},
		
		beforeDestroy () {
			clearInterval(this.interval)
		},
		
		methods:{
			initList (res, flag = true) {
				if (flag) {
					this.flight = this.getFlightInfo(res.data[0])
				} else {
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
				}
				this.list = res.data
				this.list.forEach(e => {
					e.cabinNum = parseInt(e.cargoHold)
					e.splitLine = false
				})
				let index = 0
				let cabins = this.list.filter(e => {
					let arr = e.cargoHold ? e.cargoHold.match(/[a-zA-Z]/g) : []
					if (arr) {
						// 如果舱位中带字母
						if (arr.length > 1 || arr[0] !== 'H') {
							return false
						} else {
							return true
						}
					} else {
						// 如果舱位中不带字母
						if (e.cabinNum > 0 && e.cabinNum < 6) {
							return true
						}
					}
					return false
				})
				// 字符串直接比大小，1h小于2h，以此类推，升序排列
				cabins.sort((a, b) => {
					if (a.cabinNum - b.cabinNum > 0) {
						return 1
					} else if (a.cabinNum === b.cabinNum) {
						if (a.weight - b.weight > 0) {
							return -1
						} else {
							return 1
						}
					} else {
						return -1
					}
				})
				// 不包含舱位
				let list = this.list.filter(e => {
					let arr = e.cargoHold ? e.cargoHold.match(/[a-zA-Z]/g) : []
					if (arr) {
						// 如果舱位中带字母
						if (arr.length > 1 || arr[0] !== 'H') {
							return true
						} else {
							return false
						}
					} else {
						// 如果舱位中不带字母
						if (e.cabinNum > 0 && e.cabinNum < 6) {
							return false
						} else {
							return true
						}
					}
					return false
				})
				list.sort((a, b) => {
					if (a.cabinNum - b.cabinNum > 0) {
						return 1
					} else if (a.cabinNum === b.cabinNum) {
						if (a.weight - b.weight > 0) {
							return -1
						} else {
							return 1
						}
					} else {
						return -1
					}
				})
				this.list = [...list, ...cabins]
				// 画分割线
				for (let i = 1; i < this.list.length; i++) {
					let b = this.list[i]
					let a = this.list[i -1]
					if (a.cargoHold.indexOf('H') === -1 && b.cargoHold.indexOf('H') === -1) {
						if ((a.cargoHold - 0) % 1 === 0 && (b.cargoHold - 0) % 1 === 0) {
							// 如果都是整数
							if (a.cargoHold !== b.cargoHold) {
								a.splitLine = true
							}
						} else {
							if (Math.floor(a.cabinNum / 10) !== Math.floor(b.cabinNum / 10)) {
								a.splitLine = true
							}
						}
					} else if ((a.cargoHold.indexOf('H') === -1 && b.cargoHold.indexOf('H') !== -1) || (a.cargoHold.indexOf('H') !== -1 && b.cargoHold.indexOf('H') === -1)) {
						a.splitLine = true
					} else if (a.cargoHold.indexOf('H') !== -1 && b.cargoHold.indexOf('H') !== -1){
						if (a.cabinNum !== b.cabinNum) {
							a.splitLine = true
						}
					}
				}
				this.$refs.listContent.setList(this.list)
			},
			
			// 通过集装器号得到货物信息
			getCargoInfo () {
				this.cargoInfoForm.uld = this.cargoInfoForm.uld.toUpperCase()
				getCargoInfo(this.cargoInfoForm).then(res => {
					console.log('getCargoInfo', res)
					if(res.status && !validatenull(res.data)) {
						this.scanSound()
						uni.vibrateLong()
						this.initList(res)
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
			confirm () {
				uni.navigateBack()
			},
			
			uploadImageBefore (e) {
				this.uploadImage(e, 'SUBCABIN')
			}
		}
	}
</script>

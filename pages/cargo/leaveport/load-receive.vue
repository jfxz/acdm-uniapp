/*
* 界面名称:装卸接收
* 界面功能:
* 其他    :
* 时间    :2020-8-15 09:48:15
* 作者    :gyb
*/
<template>
	<view>
		<!-- 导航栏 -->
		<nav-bar
			 title="装卸接收"
			:input-value="inputValue"
			:show-search-bar="showSearchBar"
			:content-not-null="list.length!=0"
			@scanCode="scanCode"
			@resetInputValue="resetInputValue"
			@inputGetCargoInfo="inputGetCargoInfoDebounce"
			@changeSearchBarStatus="changeSearchBarStatus">
		</nav-bar>
		
		<!-- 内容 -->
		<list-content
			 ref="listContent"
			 operationType="LOCATIONHANDOVER"
			:remove-flag="true"
			:restore="true"
			:show-search-bar="showSearchBar"
			:content-not-null="list.length!=0"
			@updateList="updateList">
			<template v-slot:cardRight="scope">
				<container-card
					:item-ori="scope.item"
					@uploadImage="uploadImageBefore">
				</container-card>
			</template>
		</list-content>
		
		<!-- 底部操作栏 -->
		<bottom-bar
			 btn="确认接收"
			:content-not-null="list.length!=0"
			:show-search-bar="showBottomSearchBar"
			@confirm="confirm"
			@resetInputValue="resetInputValue"
			@inputGetCargoInfo="inputGetCargoInfo">
			<!-- 左侧操作选项-->
			<template v-slot:left>
				<bottom-bar-left-scan
					@scanCode="scanCode"
					@changeSearchBarStatus="changeBottomSearchBarStatus">
				</bottom-bar-left-scan>
			</template>
		</bottom-bar>
		
		<not-received-containers
			ref="notReceivedContainers">
		</not-received-containers>
		
		<cargo-remind-dialog
			ref="cargoRemindDialog">
		</cargo-remind-dialog>
		
	</view>
</template>

<script>
	import navBar from '@/pages/cargo/nav-bar.vue'
	import listContent from '@/pages/cargo/list-content.vue'
	import containerCard from '@/pages/cargo/leaveport/components/container-card.vue'
	import bottomBar from '@/pages/cargo/bottom-bar.vue'
	import bottomBarLeftScan from '@/pages/cargo/bottom-bar-left-scan.vue'
	import notReceivedContainers from '@/pages/cargo/leaveport/components/not-received-containers.vue'
	import cargoMixin from '@/pages/cargo/cargo-mixin.js'
	import {DIC} from '@/common/dic.js'
	import {
		onError,
		getCargoInfo
	} from '@/api/cargo/index.js'
	import { validatenull } from '@/common/util/validate.js'
	import cargoRemindDialog from '@/pages/cargo/cargo-remind-dialog.vue'
	export default {
		mixins: [cargoMixin],
	  components: {
			navBar,
			listContent,
			containerCard,
			bottomBar,
			bottomBarLeftScan,
			notReceivedContainers,
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
					// 操作类型 LOCATIONHANDOVER
					operationType: 'LOCATIONHANDOVER'
				},
				// 确认出库需要提交的表单信息
				confirmForm: {
					// 货物信息
					cargos: [],
					// 方向
					direction: 'D',
					// 操作类型
					operationType: 'LOCATIONHANDOVER'
				},
				message: ''
			}
		},
		
		mounted () {
			this.cargoRemind('STATIONHANDOVER', '货站出库')
		},
		
		methods:{
			// 通过集装器号得到货物信息
			getCargoInfo () {
				this.cargoInfoForm.uld = this.cargoInfoForm.uld.toUpperCase()
				this.$loading()
				getCargoInfo(this.cargoInfoForm).then(res => {
					console.log('getCargoInfo', res)
					if(res.status && !validatenull(res.data)) {
						this.scanSound()
						uni.vibrateLong()
						this.receiveds = res.data.filter(e => this.judgeStatus(e, 'RECEIVED'))
						this.list = res.data
						this.$refs.listContent.setList(this.list)
					}
					this.message = res.message
					this.$message(res.message)
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
			},
			
			scanCode () {
				this.scanCodeNoCheckRepeat()
			},
			
			
			// 返回
			confirm () {
				if (this.receiveds.length !== this.list.length) {
					let notReceiveds = this.list.filter(e => !this.receiveds.find(v => v.id === e.id)).map(v => v.containerCode + '、')
					let strlen = notReceiveds[notReceiveds.length - 1].length
					notReceiveds[notReceiveds.length - 1] = notReceiveds[notReceiveds.length - 1].substr(0, strlen - 1)
					this.$refs.notReceivedContainers.setList(notReceiveds)
					this.$refs.notReceivedContainers.setFlag(true)
				} else {
					this.$message(this.message)
					setTimeout(function () {
						uni.navigateBack()
					}, 1000)
				}
			},
			
			inputGetCargoInfo (e) {
				if (e) {
					this.inputValue = e
				}
				this.cargoInfoForm.uld = this.inputValue
				this.$loading()
				this.getCargoInfo()
			},
			
			uploadImageBefore (e) {
				this.uploadImage(e, 'LOCATIONHANDOVER')
			},
			
			judgeStatus (item, status) {
				let arrivedCondition = status
				let arrivedIndex = DIC.CARGOSTATUSD.findIndex(e => e === arrivedCondition)
				if (arrivedIndex > -1) {
					let itemIndex = DIC.CARGOSTATUSD.findIndex(e => e === item.status)
					if (itemIndex > -1) {
						if (itemIndex < arrivedIndex) {
							return false
						} else {
							return true
						}
					}
				}
			}
		}
	}
</script>

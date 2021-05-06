<template>
	<view>
		<!-- 导航栏 -->
		<nav-bar
			 title="国际转国内"
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
			:show-search-bar="showSearchBar"
			:content-not-null="list.length!=0">
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
	import bottomBar from '@/pages/cargo/bottom-bar.vue'
	import cargoMixin from '@/pages/cargo/cargo-mixin.js'
	import listContent from '@/pages/cargo/list-content.vue'
	import containerCard from '@/pages/cargo/leaveport/components/container-card.vue'
	import bottomBarLeftScan from '@/pages/cargo/bottom-bar-left-scan.vue'
	import notReceivedContainers from '@/pages/cargo/leaveport/components/not-received-containers.vue'
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
			bottomBar,
			listContent,
			containerCard,
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
					// 操作类型 LOCATIONHANDOVER_INTTODOM
					operationType: 'LOCATIONHANDOVER_INTTODOM'
				},
				// 确认出库需要提交的表单信息
				confirmForm: {
					// 货物信息
					cargos: [],
					// 方向
					direction: 'D',
					// 操作类型
					operationType: 'LOCATIONHANDOVER_INTTODOM'
				}
			}
		},
		
		mounted () {
			this.cargoRemind('STATIONHANDOVER', '货站出库')
		},
		
		methods:{
			// 通过集装器号得到货物信息
			getCargoInfo () {
				this.$loading()
				this.cargoInfoForm.uld = this.cargoInfoForm.uld.toUpperCase()
				getCargoInfo(this.cargoInfoForm).then(res => {
					console.log('getCargoInfo', res)
					if (res.status && !validatenull(res.data)) {
						this.scanSound()
						uni.vibrateLong()
						this.receiveds.push(res.data[0])
						this.list = res.data
						this.$refs.listContent.setList(this.list)
					}
					this.$message(res.message)
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
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
					this.$message('全部接收成功')
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
				if (this.receiveds.find(v => this.getNumber(v.containerCode) === this.getNumber(e))) {
					this.$message('不可重复接收')
				} else {
					this.getCargoInfo()
				}
			},
			uploadImageBefore (e) {
				this.uploadImage(e, 'LOCATIONHANDOVER_INTTODOM')
			}
		}
	}
</script>

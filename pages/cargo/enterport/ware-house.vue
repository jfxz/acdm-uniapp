/*
* 界面名称:货站入库
* 界面功能:
* 其他    :
* 时间    :2020-8-22 18:01:48
* 作者    :gyb
*/
<template>
	<view>
		<!-- 导航栏 -->
		<nav-bar
			 title="货站入库"
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
			:content-not-null="list.length!=0"
			:show-search-bar="showSearchBar"
			:cant-select-status="arrivedCondition"
			@noSelectedWarn="noSelectedWarn"
			@changeBottomSelectAll="changeBottomSelectAll"
			@completedArrived="completedArrived">
			<template v-slot:cardRight="scope">
				<transfer-card
					:first="false"
					:item-ori="scope.item"
					:arror="true"
					:to-arrive-ori="toArrive"
					:arrived-condition="arrivedCondition"
					arrived-text="入库"
					@confirmRight="confirmRight"
					@uploadImage="uploadImageBefore"
					@openBottomPopup="openBottomPopup"
					@showBottomPopup="showBottomPopup"
					@openUploadImageDialog="openUploadImageDialog">
				</transfer-card>
			</template>
		</list-content>
		
		<!-- 底部操作栏 -->
		<bottom-bar
			 btn="入库"
			:content-not-null="list.length!=0"
			:btn-can-press="btnCanPress"
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
				<view v-show="refreshFlag" :class="[btnCanPress?'btn':'btn-light']" style="margin-right: 11rpx;" @tap="openConfirmDialog">入库</view>
			</template>
		</bottom-bar>
		
		<bottom-popup-details
			 ref="bottomPopupDetails"
			 title="板/箱/散装车">
		</bottom-popup-details>
		
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
	import bottomBar from '@/pages/cargo/bottom-bar.vue'
	import transferCard from '@/pages/cargo/enterport/components/transfer-card.vue'
	import bottomPopupDetails from '@/pages/cargo/enterport/components/bottom-popup-details.vue'
	import bottomBarLeftSelectall from '@/pages/cargo/bottom-bar-left-selectall.vue'
	import {getCargoInfo, confirm, onError} from '@/api/cargo/index.js'
	import { validatenull } from '@/common/util/validate.js'
	import { debounce } from '@/common/util/util.js'
	import cargoMixin from '@/pages/cargo/cargo-mixin.js'
	import cargoRemindDialog from '@/pages/cargo/cargo-remind-dialog.vue'
	import confirmModal from '@/pages/cargo/leaveport/components/installed-audit-modal.vue'
	export default {
		mixins: [cargoMixin],
		components: {
			navBar,
			listContent,
			bottomBar,
			transferCard,
			bottomPopupDetails,
			bottomBarLeftSelectall,
			cargoRemindDialog,
			confirmModal
		},
		data () {
			return {
				// 通过集装器号获取货物信息的接口需要提交的表单信息
				cargoInfoForm: {
					// 集装器编码
					uld: '',
					// 方向 出港为D
					direction: 'A',
					// 操作类型 WAREHOUSING
					operationType: 'WAREHOUSING'
				},
				// 确认出库需要提交的表单信息
				confirmForm: {
					// 货物信息
					cargos: [],
					// 方向
					direction: 'A',
					// 操作类型
					operationType: 'WAREHOUSING'
				},
				refreshFlag: true,
				checkedList: []
			}
		},
		onLoad (e) {
			this.toArrive = true
			this.arrivedCondition = 'WAREHOUSED'
			let list = uni.getStorageSync('completedWareHoused')
			if (list) {
				this.list = [...list]
				this.$nextTick(function(){
					this.selectAll()
					if (this.list.length > 0) {
						this.$refs.bottomSelect.changeSelectAllFlag(true)
					}
					this.refresh2()
				})
			}
		},
		onBackPress () {
			if (!this.completedWareHoused) {
				uni.setStorageSync('completedWareHoused', this.list)
			}
		},
		mounted () {
			this.cargoRemind('ARRIVEDSTATION', '到达货站装卸')
			var that = this
			this.$nextTick(function(){
				setTimeout(function(){
					if (that.list.length > 0) {
						that.$refs.bottomSelect.selectAll()
					}
				}, 300)
			})
		},
		methods:{
			// 通过集装器号得到货物信息
			getCargoInfo () {
				this.cargoInfoForm.uld = this.cargoInfoForm.uld.toUpperCase()
				getCargoInfo(this.cargoInfoForm).then(res => {
					console.log('getCargoInfo', res)
					if (res.status && !validatenull(res.data)) {
						this.scanSound()
						uni.vibrateLong()
						this.setCompletedWareHoused(false)
						this.list = res.data
						this.$refs.listContent.setList(this.list)
						var that = this
						setTimeout(function(){
							that.$refs.bottomSelect.selectAll()
							that.$refs.listContent.judgeAllArrived()
						}, 300)
					} else {
						this.$message(res.message)
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
				} else {
					this.$message('货物状态不可交接')
				}
			},
			
			confirmBtn () {
				var that = this
				this.$loading()
				confirm(this.confirmForm).then(res => {
					console.log('confirmBtn', res)
					if (res.status) {
						this.checkedList = [...res.data, ...this.checkedList]
						this.list.forEach(e => {
							if (this.checkedList.find(v => v.id === e.id)) {
								e.status = 'WAREHOUSED'
							}
						})
						this.$refs.listContent.setList(this.list)
						setTimeout(function(){
							that.$refs.bottomSelect.selectAll()
							that.$refs.listContent.judgeAllArrived()
						}, 300)
					}
					this.$message(res.message)
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
			},
			
			refresh2 () {
				let list = [...this.list]
				this.list = []
				let container = list.find(e => e.status !== 'WAREHOUSED')
				if (container) {
					this.cargoInfoForm.uld = container.containerCode
					this.getCargoInfo()
				} else {
					this.list = [...list]
				}
			},
			
			confirmRight: debounce(function (item) {
				this.confirmForm.cargos = this.$refs.listContent.getList().filter(e => e.id === item.id)
				this.confirmBtn()
			}),
			
			uploadImageBefore (e) {
				this.uploadImage(e, 'WAREHOUSING')
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
				this.setCompletedWareHoused(true)
				this.refreshFlag = false
				this.$nextTick(function(){
					setTimeout(function () {
						that.btnCanPress = false
						that.refreshFlag = true
					}, 300)
				})
				uni.removeStorageSync('completedWareHoused')
			},
			selectAll () {
				this.$refs.listContent.selectAll()
				if (this.$refs.listContent.judgeAtLeastSelected('WAREHOUSED')) {
					this.btnCanPress = true
				} else {
					this.btnCanPress = false
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.btn-blue {
		width: 206rpx;
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
	
	.btn-blue-light {
		opacity: 0.3;
		width: 206rpx;
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

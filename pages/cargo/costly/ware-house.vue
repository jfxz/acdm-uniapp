/*
* 界面名称:货站入库
* 界面功能:
* 其他    :
* 时间    :2020-11-2 17:23:31
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
			@inputGetCargoInfo="inputGetCargoInfo"
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
					:item="scope.item"
					@uploadImage="uploadImageBefore">
				</transfer-card>
			</template>
		</list-content>
		
		<!-- 底部操作栏 -->
		<bottom-bar
			 btn="入库"
			:content-not-null="list.length!=0"
			:btn-can-press="btnCanPress"
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
				<view v-show="refreshFlag" :class="[btnCanPress?'btn':'btn-light']" style="margin-right: 11rpx;" @tap="confirm">入库</view>
			</template>
		</bottom-bar>
	</view>
</template>

<script>
	import navBar from '@/pages/cargo/nav-bar.vue'
	import listContent from '@/pages/cargo/list-content.vue'
	import bottomBar from '@/pages/cargo/bottom-bar.vue'
	import transferCard from '@/pages/cargo/costly/components/transfer-card.vue'
	import bottomBarLeftSelectall from '@/pages/cargo/bottom-bar-left-selectall.vue'
	import {getCostlyCargoInfo, confirmCostly, onError} from '@/api/cargo/index.js'
	import cargoMixin from '@/pages/cargo/cargo-mixin.js'
	import costlyMixin from './costly-mixin.js'
	export default {
		mixins: [cargoMixin, costlyMixin],
		components: {
			navBar,
			listContent,
			bottomBar,
			transferCard,
			bottomBarLeftSelectall
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
				refreshFlag: true
			}
		},
		onLoad (e) {
			this.toArrive = true
			this.arrivedCondition = 'WAREHOUSED'
			
		},
		
		methods:{
			inputGetCargoInfo (e) {
				this.notAuto = true
				if (e && e !== '') {
					this.inputValue = e
				} else {
					return
				}
				this.cargoInfoForm.uld = this.inputValue
				this.$loading()
				this.getCargoInfo()
			},
			// 通过集装器号得到货物信息
			getCargoInfo () {
				this.cargoInfoForm.uld = this.cargoInfoForm.uld.toUpperCase()
				getCostlyCargoInfo(this.cargoInfoForm).then(res => {
					console.log('getCargoInfo', res)
					if(res.status) {
						this.scanSound()
						uni.vibrateLong()
						this.setCompletedCostlyWareHouse(false)
						this.list = res.data
						this.$refs.listContent.setCostlyList(this.list)
						var that = this
						this.$nextTick(function(){
							setTimeout(function(){
								that.$refs.bottomSelect.selectAll()
							}, 300)
						})
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
				this.$loading()
				confirmCostly(this.confirmForm).then(res => {
					console.log('confirmBtn', res)
					if (res.status) {
						let listBackup = [...this.list]
						let list = res.data
						this.list = [...res.data, ...listBackup.filter(v => !list.find(e => e.containerCode === v.containerCode))]
						this.$refs.listContent.setCostlyList(this.list)
						var that = this
						this.$nextTick(function(){
							setTimeout(function(){
								that.$refs.listContent.judgeAllArrived()
								that.$refs.bottomSelect.selectAll()
								that.$refs.listContent.refresh()
							}, 100)
						})
					} else {
						this.$message(res.message)
					}
					uni.hideLoading()
				}).catch(err => {
					onError(err)
					uni.hideLoading()
				})
			},
			
			confirmRight (item) {
				this.confirmForm.cargos = this.$refs.listContent.getList().filter(e => e.id === item.id)
				confirmCostly(this.confirmForm).then(res => {
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
						this.list.splice(this.list.findIndex(e => e.id === this.confirmForm.cargos[0].id), 1)
						this.list.push(this.confirmForm.cargos[0])
						this.$refs.listContent.setCostlyList(this.list)
						this.$refs.listContent.refresh()
						var that = this
						this.$nextTick(function(){
							that.$refs.bottomSelect.selectAll()
							that.$refs.listContent.judgeAllArrived()
						})
						this.$message( '成功到达')
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
			},
			
			uploadImageBefore (e) {
				this.uploadImage(e, 'WAREHOUSING')
			},
			
			completedArrived () {
				this.setCompletedCostlyWareHouse(true)
				var that = this
				this.refreshFlag = false
				this.$nextTick(function(){
					setTimeout(function () {
						that.btnCanPress = false
						that.refreshFlag = true
					}, 300)
				})
				uni.removeStorageSync('completedCostlyWareHouse')
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

/*
* 界面名称:货站入库
* 界面功能:
* 其他    :
* 时间    :2020-10-19 15:01:19
* 作者    :gyb
*/
<template>
	<view>
		<!-- 导航栏 -->
		<nav-bar
			 title="到达货站"
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
			 direction="PULL"
			:content-not-null="list.length!=0"
			:show-search-bar="showSearchBar"
			:cant-select-status="arrivedCondition"
			@noSelectedWarn="noSelectedWarn"
			@changeBottomSelectAll="changeBottomSelectAll"
			@completedArrived="completedArrived">
			<template v-slot:top>
				<flight-info-card
					:merge="true"
					:item-ori="flight">
				</flight-info-card>
			</template>
			<template v-slot:cardRight="scope">
				<container-card
					:item-ori="scope.item"
					:warehouse="true"
					@uploadImage="uploadImageBefore">
				</container-card>
			</template>
		</list-content>
		
		<!-- 底部操作栏 -->
		<bottom-bar
			 btn="入库"
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
				<view v-show="refreshFlag" :class="[btnCanPress?'btn':'btn-light']" style="margin-right: 11rpx;" @tap="confirm">入库</view>
			</template>
		</bottom-bar>
	</view>
</template>

<script>
	import navBar from '@/pages/cargo/nav-bar.vue'
	import listContent from '@/pages/cargo/list-content.vue'
	import bottomBar from '@/pages/cargo/bottom-bar.vue'
	import containerCard from '@/pages/cargo/pulldown/components/container-card.vue'
	import bottomBarLeftSelectall from '@/pages/cargo/bottom-bar-left-selectall.vue'
	import {getPulldownCargoInfo, pulldownConfirm, onError} from '@/api/cargo/index.js'
	import cargoMixin from '@/pages/cargo/cargo-mixin.js'
	import flightInfoCard from '@/pages/cargo/pulldown/components/flight-info-card.vue'
	import { debounce } from '@/common/util/util.js'
	export default {
		mixins: [cargoMixin],
		components: {
			navBar,
			listContent,
			bottomBar,
			containerCard,
			bottomBarLeftSelectall,
			flightInfoCard
		},
		data () {
			return {
				// 通过集装器号获取货物信息的接口需要提交的表单信息
				cargoInfoForm: {
					// 集装器编码
					uld: '',
					// 方向 出港为PULL
					direction: 'PULL',
					// 操作类型 WAREHOUSING
					operationType: 'WAREHOUSING'
				},
				// 确认出库需要提交的表单信息
				confirmForm: {
					// 货物信息
					cargos: [],
					// 方向
					direction: 'PULL',
					// 操作类型
					operationType: 'WAREHOUSING'
				},
				refreshFlag: true,
				flight: {}
			}
		},
		onLoad (e) {
			this.toArrive = true
			this.arrivedCondition = 'WAREHOUSED'
			var that = this
			if (e.uld) {
				this.fromDriver = true
				this.cargoInfoForm.uld = e.uld
				this.getCargoInfo()
			} else if (!this.completedPulldownWareHouse) {
				let list = uni.getStorageSync('completedPulldownWareHouse')
				if (list) {
					this.list = [...list]
					this.$nextTick(function(){
						this.refresh2()
						this.selectAll()
						this.$refs.bottomSelect.changeSelectAllFlag(true)
					})
				}
			}
		},
		onBackPress () {
			if (!this.completedPulldownWareHouse) {
				uni.setStorageSync('completedPulldownWareHouse', this.list)
			}
		},
		mounted () {
			var that = this
			this.$nextTick(function(){
				setTimeout(function(){
					that.$refs.bottomSelect.selectAll()
				}, 300)
			})
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
			scanCode () {
				this.scanCodeNoCheckRepeat()
			},
			// 通过集装器号得到货物信息
			getCargoInfo () {
				this.cargoInfoForm.uld = this.cargoInfoForm.uld.toUpperCase()
				getPulldownCargoInfo(this.cargoInfoForm).then(res => {
					console.log('getCargoInfo', res)
					if(res.status) {
						this.scanSound()
						uni.vibrateLong()
						this.setCompletedPulldownWareHouse(false)
						this.list = res.data
						let newObj = res.data[0]
						this.flight = {
							flight: newObj.flight,
							standCode: newObj.standCode,
							opDate: newObj.opDate
						}
						this.$refs.listContent.setList(this.list)
						var that = this
						this.$nextTick(function(){
							setTimeout(function(){
								that.$refs.bottomSelect.selectAll()
								that.$refs.listContent.refresh()
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
			confirm: debounce(function () {
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
			}),
			
			confirmBtn () {
				this.$loading()
				pulldownConfirm(this.confirmForm).then(res => {
					console.log('confirmBtn', res)
					if (res.status) {
						let listBackup = [...this.list]
						let list = res.data
						this.list = [...res.data, ...listBackup.filter(v => !list.find(e => e.containerCode === v.containerCode))]
						this.$refs.listContent.setList(this.list)
						var that = this
						this.$nextTick(function(){
							setTimeout(function(){
								that.$refs.listContent.judgeAllArrived()
								that.$refs.bottomSelect.selectAll()
								that.$refs.listContent.refresh()
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
				this.uploadImage(e, 'WAREHOUSING')
			},
			
			completedArrived () {
				this.setCompletedPulldownWareHouse(true)
				var that = this
				this.refreshFlag = false
				this.$nextTick(function(){
					setTimeout(function () {
						that.btnCanPress = false
						that.refreshFlag = true
					}, 300)
				})
				uni.removeStorageSync('completedPulldownWareHouse')
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

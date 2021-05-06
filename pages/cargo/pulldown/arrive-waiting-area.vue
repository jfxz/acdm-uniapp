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
			<template v-slot:cardRight="scope">
				<transfer-card
					:item-ori="scope.item"
					@uploadImage="uploadImageBefore">
				</transfer-card>
			</template>
		</list-content>
		
		<!-- 底部操作栏 -->
		<bottom-bar
			 btn="接收"
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
				<view v-show="refreshFlag" :class="[btnCanPress?'btn':'btn-light']" style="margin-right: 11rpx;" @tap="confirm">接收</view>
			</template>
		</bottom-bar>
	</view>
</template>

<script>
	import navBar from '@/pages/cargo/nav-bar.vue'
	import listContent from '@/pages/cargo/list-content.vue'
	import bottomBar from '@/pages/cargo/bottom-bar.vue'
	import bottomBarLeftSelectall from '@/pages/cargo/bottom-bar-left-selectall.vue'
	import transferCard from '@/pages/cargo/pulldown/components/transfer-card'
	import {DIC} from '@/common/dic.js'
	import {
		getPulldownCargoInfo,
		pulldownConfirm,
		onError
	} from '@/api/cargo/index.js'
	import { validatenull } from '@/common/util/validate.js'
	import cargoMixin from '@/pages/cargo/cargo-mixin.js'
	import { debounce } from '@/common/util/util.js'
	export default {
		mixins: [cargoMixin],
		components: {
			navBar,
			listContent,
			bottomBar,
			bottomBarLeftSelectall,
			transferCard
		},
		data () {
			return {
				// 通过集装器号获取货物信息的接口需要提交的表单信息
				cargoInfoForm: {
					// 集装器编码
					uld: '',
					// 方向 出港为PULL
					direction: 'PULL',
					// 操作类型 ARRIVEDWAITINGAREA_DRIVER
					operationType: 'ARRIVEDWAITINGAREA_STEVEDORING'
				},
				// 确认出库需要提交的表单信息
				confirmForm: {
					// 货物信息
					cargos: [],
					// 方向
					direction: 'PULL',
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
			} else if (!this.completedPulldownWaitingArea) {
				let list = uni.getStorageSync('completedPulldownWaitingArea')
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
					that.$refs.bottomSelect.selectAll()
				}, 100)
			})
		},
		
		onBackPress () {
			if (!this.completedPulldownWaitingArea) {
				uni.setStorageSync('completedPulldownWaitingArea', this.list)
			}
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
					if(res.status && !validatenull(res.data)) {
						this.scanSound()
						uni.vibrateLong()
						this.setCompletedPulldownWaitingArea(false)
						this.list = res.data
						this.$refs.listContent.setList(this.list)
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
			
			confirmBtn () {
				var that = this
				this.$loading()
				pulldownConfirm(this.confirmForm).then(res => {
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
				})
			},
			
			uploadImageBefore (e) {
				this.uploadImage(e, 'ARRIVEDWAITINGAREA_DRIVER')
			},
			
			completedArrived () {
				this.setCompletedPulldownWaitingArea(true)
				var that = this
				this.refreshFlag = false
				this.$nextTick(function(){
					setTimeout(function () {
						that.btnCanPress = false
						that.refreshFlag = true
					}, 300)
				})
				uni.removeStorageSync('completedPulldownWaitingArea')
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
		font-size: 33rpx;
		letter-spacing: 2rpx;
		color: #008ffd;
	}
</style>

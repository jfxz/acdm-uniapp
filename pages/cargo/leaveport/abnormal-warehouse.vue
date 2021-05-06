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
			 title="异常入库"
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
			 direction="D"
			:remove-flag="true"
			:content-not-null="list.length!=0"
			:show-search-bar="showSearchBar"
			@updateList="updateList">
			<template v-slot:cardRight="scope">
				<to-waiting-area-card
					:show-position="false"
					:item-ori="scope.item">
				</to-waiting-area-card>
			</template>
		</list-content>
		
		<!-- 底部操作栏 -->
		<bottom-bar
			 btn="异常入库"
			:content-not-null="list.length!=0"
			@confirm="confirm">
		</bottom-bar>
	</view>
</template>

<script>
	import navBar from '@/pages/cargo/nav-bar.vue'
	import listContent from '@/pages/cargo/list-content.vue'
	import bottomBar from '@/pages/cargo/bottom-bar.vue'
	import {getCargoInfo, confirm, onError, removeContainer} from '@/api/cargo/index.js'
	import { validatenull } from '@/common/util/validate.js'
	import { debounce } from '@/common/util/util.js'
	import cargoMixin from '@/pages/cargo/cargo-mixin.js'
	import toWaitingAreaCard from '@/pages/cargo/leaveport/components/to-waiting-area-card.vue'
	export default {
		mixins: [cargoMixin],
		components: {
			navBar,
			listContent,
			bottomBar,
			toWaitingAreaCard
		},
		data () {
			return {
				// 通过集装器号获取货物信息的接口需要提交的表单信息
				cargoInfoForm: {
					// 集装器编码
					uld: '',
					// 方向 出港为D
					direction: 'D',
					// 操作类型 ABNORMALWAREHOUSE
					operationType: 'ABNORMALWAREHOUSE'
				},
				// 确认出库需要提交的表单信息
				confirmForm: {
					// 货物信息
					cargos: [],
					// 方向
					direction: 'D',
					// 操作类型
					operationType: 'ABNORMALWAREHOUSE'
				}
			}
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
						this.list = [...res.data, ...this.list]
						this.$refs.listContent.setList(this.list)
					} else {
						this.$message(res.message)
					}
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
			},
			
			// 完成出库
			confirm: debounce(function () {
				this.initConfirmFormCargos()
				if (this.confirmForm.cargos.length > 0) {
					this.confirmBtn()
				} else {
					this.$message('货物状态不可交接')
				}
			}),
			
			confirmBtn () {
				this.$loading()
				var that = this
				let arr = []
				for (let i = 0; i < this.confirmForm.cargos.length; i++) {
					let func = function () {
						return removeContainer({
							id: that.confirmForm.cargos[i].id
						}).then(res => {
							console.log('removeUnloaderContainer', res)
							that.$message(res.message)
							uni.hideLoading()
						}).catch(err => {
							onError(err)
						})
					}
					arr.push(func)
				}
				let result = Promise.allSettled(arr.map(e => e()))
				result.then(res => {
					console.log('result-res', res)
					if (res) {
						that.list = []
						that.$refs.listContent.setList(that.list)
					}
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
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

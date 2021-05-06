/*
* 界面名称:卸机-板箱列表
* 界面功能:
* 其他    :
* 时间    :2020-8-22 12:34:11
* 作者    :gyb
*/
<template>
	<view>
		<!-- 导航栏 -->
		<nav-bar
       ref="navBar"
			 title="卸机"
			:content-not-null="list.length!=0"
			:show-search-bar="showSearchBar"
			:input-value="inputValue"
			:show-operation-history="showOperationHistory"
      :focus="focus"
      @inputSearch="inputSearch"
			@scanCode="scanCode"
			@resetInputValue="resetInputValue"
			@openOperaionHistory="openOperaionHistory"
			@inputGetCargoInfo="inputGetCargoInfoDebounce"
			@changeSearchBarStatus="changeSearchBarStatus">
		</nav-bar>
		
		<!-- 内容 -->
		<list-content
			 ref="listContent"
			:content-not-null="list.length!=0"
			:dont-show-none-list="true"
			:show-search-bar="showSearchBar"
			:not-id="true"
			:remove-flag="true"
			:unloading-flag="true"
			:remove-unloader="true"
			@updateList="updateList"
			@clickCard="checkInfo"
			@uploadImage="uploadImage">
			<template v-slot:top>
				<flight-info-card
					:item-ori="flight">
				</flight-info-card>
			</template>
			<template v-slot:cardRight="scope">
				<unloading-plate-box-card
					@uploadImage="uploadImageBefore"
					:item-ori="scope.item">
				</unloading-plate-box-card>
			</template>
		</list-content>
		
		<bottom-bar
			 btn="确认交接"
			:content-not-null="list.length!=0"
			:show-search-bar="showBottomSearchBar"
			@inputGetCargoInfo="inputGetCargoInfo"
			@resetInputValue="resetInputValue"
			@confirm="confirm">
			<!-- 左侧操作选项-->
			<template v-slot:left>
				<bottom-bar-left-scan
					:show-sort="false"
					@scanCode="scanCode"
					@changeSearchBarStatus="changeBottomSearchBarStatus">
				</bottom-bar-left-scan>
			</template>
		</bottom-bar>
		
		<unloading-plate-box-modal
			 ref="dialog"
			 title="信息确认"
			 @changeStatus="changeStatus">
		</unloading-plate-box-modal>
	</view>
</template>

<script>
	import navBar from '@/pages/cargo/nav-bar.vue'
	import listContent from '@/pages/cargo/list-content.vue'
	import bottomBar from '@/pages/cargo/bottom-bar.vue'
	import bottomBarLeftScan from '@/pages/cargo/bottom-bar-left-scan.vue'
	import unloadingPlateBoxCard from '@/pages/cargo/enterport/components/unloading-plate-box-card.vue'
	import unloadingPlateBoxModal from '@/pages/cargo/enterport/components/unloading-plate-box-modal.vue'
	import flightInfoCard from '@/pages/cargo/flight-info-card.vue'
	import dayjs from '@/common/util/dayjs.min.js'
	import {
		onError,
		confirm,
		updateCargoInfo,
		unloadingInfo,
		getUnloadingList,
		cargoUrl,
		cargoSvnUrl
	} from '@/api/cargo/index.js'
	import { validatenull } from '@/common/util/validate.js'
	import cargoMixin from '../cargo-mixin.js'
	import {DIC} from '@/common/dic.js'
	import { debounce } from '@/common/util/util.js'
	// 最大照片选择数量
	const maxPicNums = 3
	export default {
		mixins: [cargoMixin],
		components: {
			navBar,
			listContent,
			bottomBar,
			unloadingPlateBoxCard,
			unloadingPlateBoxModal,
			flightInfoCard,
			bottomBarLeftScan
		},
		data () {
			return {
				// 通过集装器号获取货物信息的接口需要提交的表单信息
				cargoInfoForm: {
					// 集装器编码
					uld: '',
					// 方向 为进港
					direction: 'A'
				},
				// 航班列表传过来的点击的航班信息
				flightInfo: {},
				showOperationHistory: false
			}
		},
		
		onLoad (e) {
			var that = this
			this.flightInfo = uni.getStorageSync('unloading_flight_info')
			let obj = this.flightInfo[0]
			this.list = []
			if (this.flightInfo) {
				console.log('this.flightInfo', obj)
				this.getUnloadingList(obj)
			}
		},
    
    mounted () {
      this.initAutoSearch()
    },
		
		onBackPress () {
			if (!this.completedUnloading) {
				let lists = uni.getStorageSync('completedUnloading')
				if (lists) {
					let list = lists.find(e => e.flight === this.flight.iataCarrier + this.flight.flight)
					if (!list) {
						lists.push({
							flight: this.flight.iataCarrier + this.flight.flight,
							list: this.list
						})
					} else {
						list.list = this.list
					}
					uni.setStorageSync('completedUnloading', lists)
				} else {
					lists = [{
						flight: this.flight.iataCarrier + this.flight.flight,
						list: this.list
					}]
					uni.setStorageSync('completedUnloading', lists)
				}
				console.log('back-list', lists)
			}
		},
		
		methods:{
			initUnloadingList (res) {
				this.list = res.status ? res.data : []
				// this.flight = this.flightInfo[0]
				if (!this.completedUnloading) {
					let storage = uni.getStorageSync('completedUnloading')
					let completedUnloadingObj = null
					if (storage) {
						completedUnloadingObj = storage.find(e => e.flight === this.flight.iataCarrier + this.flight.flight)
					}
					if (completedUnloadingObj) {
						let list = completedUnloadingObj.list
						if (list) {
							list.forEach(e => {
								let exit = this.list.find(v => {
									if (this.getNumber(v.containerCode) === this.getNumber(e.containerCode)) {
										return true
									} else {
										return false
									}
								})
								if (!exit) {
									this.list.push(e)
								}
							})
						}
					}
					var that = this
					this.$nextTick(function(){
						if (that.nextTickTime < 1) {
							that.refresh()
							that.nextTickTime++
						}
					})
				}
				uni.hideLoading()
			},
			
			getUnloadingList (obj) {
				this.$loading()
				var that = this
				console.log(that.flightInfo)
				this.flight = this.flightInfo[0]
				getUnloadingList(obj).then(res => {
					console.log('res',res)
					that.initUnloadingList(res)
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
			},
			updateList (list1) {
				this.list = list1
				console.log('updateList-this.list', this.list)
				let lists = uni.getStorageSync('completedUnloading')
				if (lists) {
					let list = lists.find(e => e.flight === this.flight.iataCarrier + this.flight.flight)
					if (!list) {
						lists.push({
							flight: this.flight.iataCarrier + this.flight.flight,
							list: this.list
						})
					} else {
						list.list = this.list
					}
					uni.setStorageSync('completedUnloading', lists)
				} else {
					lists = [{
						flight: this.flight.iataCarrier + this.flight.flight,
						list: this.list
					}]
					uni.setStorageSync('completedUnloading', lists)
				}
			},
			confirm: debounce(function () {
				let list = this.$refs.listContent.getDisplayList()
				this.$loading()
				confirm({
					cargos: list,
					direction: 'A',
					operationType: 'UNLOADER'
				}).then(res => {
					console.log('updateCargoInfo', res, this.flight)
					if (res.status && !validatenull(res.data)) {
						for (let i = 0; i < list.length; i++) {
							let e = list[i]
							// 查找的目的是为了获得id用于上传图片。扫码后得到的集装器id为空，不能上传图片。
							let exit = res.data.find(v => v.containerCode === e.containerCode)
							if (!e.id && exit && e.images3 && e.images3.length > 0) {
								e.id = exit.id
								e.images2 = [...e.images3]
								// 用递归上传该集装器本次选择的图片，以达到同步上传的目的
								this.recursiveUpload2(e, 'UNLOADER', 0, e.images2.length)
							}
						}
						list.forEach(e => {
							let obj = res.data.find(v => v.containerCode === e.containerCode)
							e.status = obj.status
							e.id = obj.id
						})
						this.list = list
						console.log('before-list', this.list)
						this.$refs.listContent.setListWithImage(this.list)
						
						this.setCompletedUnloading(true)
						let arr = uni.getStorageSync('completedUnloading')
							if (arr) {
								let idx = arr.findIndex(e => e.flight === this.flight.iataCarrier + this.flight.flight)
								if (idx > -1) {
									arr.splice(idx, 1)
								}
								uni.setStorageSync('completedUnloading', arr)
							}
						// setTimeout(function () {
						// 	uni.navigateBack()
						// }, 2500)
					}
          uni.hideLoading()
          this.$message(res.message)
				}).catch(err => {
					onError(err)
					console.log('err', err)
				})
			}),
			
			updateCargoInfo (e) {
				let obj ={...e}
				confirm({
					cargos: [e],
					direction: 'A',
					operationType: 'UNLOADER'
				}).then(res => {
					console.log('updateCargoInfo', res)
					if (res.status) {
						let item = Object.assign(obj, res.data[0])
						console.log('item-before', obj.status, res.data.status, item.status)
						if (item && item.images3 && item.images3.length > 0) {
							// this.recursiveUpload(item, 'NOTUNLOADER', 0, item.images2.length)
							item.images2 = [...item.images3]
							this.recursiveUpload2(item, 'UNLOADER', 0, item.images2.length)
						}
						
						let index = -1
						for (let i = 0; i < this.list.length; i++) {
							let v = this.list[i]
							if (v.containerCode === e.containerCode) {
								index = i
								break
							}
						}
						if (index > -1) {
							this.list.splice(index, 1)
						}
						this.list.unshift(item)
						console.log('before-list', this.list)
						this.$refs.listContent.setListWithImage(this.list)
					}
					this.$message(res.message)
					if (!this.list.find(e => e.status === 'NOTUNLOADER')) {
						// 全部都卸机完毕了
						this.setCompletedUnloading(true)
						let arr = uni.getStorageSync('completedUnloading')
						if (arr) {
							let idx = arr.findIndex(e => e.flight === this.flight.iataCarrier + this.flight.flight)
							if (idx > -1) {
								arr.splice(idx, 1)
							}
							uni.setStorageSync('completedUnloading', arr)
						}
					}
				}).catch(err => {
					onError(err)
					console.log('err', err)
				})
			},
			
			changeStatus: debounce(function (k) {
				let index = -1
				let obj = {}
				let displayList = this.$refs.listContent.getDisplayList()
				for (let i = 0; i < displayList.length; i++) {
					let e = displayList[i]
					if (e.containerCode === k) {
						index = i
						obj = {...e}
						break
					}
				}
			  this.updateCargoInfo(obj)
			}),
			
			getCargoInfo: debounce(function () {
				// 卸机查询的时候，uld只能为CAR开头，数字3到4位。
				this.cargoInfoForm.uld = this.cargoInfoForm.uld.toUpperCase()
				let reg = /[a-zA-Z]+/g
				let result = reg.test(this.cargoInfoForm.uld)
				console.log('result', result)
				if (result) {
					// 如果带字母
					if (this.cargoInfoForm.uld.indexOf('CAR') !== 0) {
						// 如果不是以car或CAR开头，都过滤掉
						this.$message('请输入3到4位纯数字或以CAR开头，3到4位数字的集装器号', 'none', 'center', 3000)
						uni.hideLoading()
						return
					} else {
						let number = this.cargoInfoForm.uld.match(/[0-9]+/g)
						if (number) {
							number = parseInt(number)
							if (parseInt(number / 10000) !== 0) {
								// 数字超过四位
								this.$message('请输入3到4位纯数字或以CAR开头，3到4位数字的集装器号', 'none', 'center', 3000)
								uni.hideLoading()
								return
							}
						} else {
							this.$message('请输入3到4位纯数字或以CAR开头，3到4位数字的集装器号', 'none', 'center', 3000)
							uni.hideLoading()
							return
						}
					}
				} else {
					// 如果是纯数字
					let number = parseInt(this.cargoInfoForm.uld)
					if (parseInt(number / 10000) !== 0) {
						// 数字超过四位
						this.$message('请输入3到4位纯数字或以CAR开头，3到4位数字的集装器号', 'none', 'center', 3000)
						uni.hideLoading()
						return
					}
				}
				this.cargoInfoForm.uld = this.cargoInfoForm.uld.toUpperCase()
				console.log('this.flightInfo', this.flightInfo, this.cargoInfoForm.uld)
				unloadingInfo({
					flight: this.flightInfo,
					uld: this.cargoInfoForm.uld
				}).then(res => {
					console.log('unloading', res)
					if (res.status && !validatenull(res.data)) {
						let container = res.data[0]
						if (container.flight !== this.flight.iataCarrier + this.flight.flight) {
							this.$message(`集装器${container.containerCode}属于${container.flight},不可加入当前航班`)
						} else {
							this.scanSound()
							uni.vibrateLong()
							this.setCompletedUnloading(false)
							// this.flight = this.getFlightInfo(res.data[0])
							console.log('this.flight', this.flight)
							this.list = this.$refs.listContent.getDisplayList()
							
							var that = this
							this.list.sort((a, b) => {
								let bIdx = DIC.CARGOSTATUSA.findIndex(e => e === b.status)
								let aIdx = DIC.CARGOSTATUSA.findIndex(e => e === a.status)
								return aIdx - bIdx
							})
							this.list.unshift(res.data[0])
							this.$refs.listContent.setListWithImage(this.list)
						}
					}
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
			}, 500),
			
			checkInfo (e) {
				this.$refs.dialog.open(e)
			},
			
			uploadImageBefore (e) {
				this.uploadImage(e, 'UNLOADER')
			},
			
			recursiveUpload2 (item, operationType , idx, end) {
				var that = this
				console.log('recursiveUpload-item', item)
				let url = getApp().globalData.ignoreSvn ? cargoSvnUrl : cargoUrl
				uni.uploadFile({
					url: url + '/api/cargo/cargo/abnormal?cargoId=' + item.id + '&operationType=' + operationType,
					filePath: item.images2[idx].uri,
					name: 'file',
					header: {
						Authorization: uni.getStorageSync('access_token')
					},
					complete: (res) => {
						console.log('upload', res)
						if (res.statusCode === 200) {
							try {
								let jsonObj = JSON.parse(res.data)
								
								let len = item.images.length
								// item.images.push({
								// 	id: jsonObj.data.id,
								// 	url: jsonObj.data.pictureUrls,
								// 	createBy: this.cargoUserForm.username || '',
								// 	show: true,
								// 	name: 'image' + len,
								// 	showDelete: false,
								// 	uri: item.images2[idx].uri
								// })
							} catch (e) {
								console.log(e)
							}
						} else {
							this.$message('图片上传失败')
							item.selectedPicNums--
						}
						++idx
						if (idx < end) {
							that.recursiveUpload2(item, operationType, idx, end)
						}
					}
				})
			},
			
			uploadImage (item, operationType) {
				const maxPicNums = 3
				var that = this
				let a = maxPicNums - item.selectedPicNums
				if (a === 0) {
					this.$message('照片已满')
				} else {
					uni.chooseImage({
						count: a > 0? a : 0,
						success: function(res) {
							item.selectedPicNums += res.tempFilePaths.length
							item.showItem = false
							let len = item.images.length
							item.images2 = []
							for (let i = len; i < res.tempFiles.length + len; i++) {
								let obj = {
									show: true,
									name: 'image' + i,
									showDelete: false,
									uri: res.tempFiles[i - len].path
								}
								if (!item.id) {
									item.images.push(obj)
								}
								item.images2.push(obj)
							}
							// 必须改变数据以触发视图更新
							item.showItem = true
							that.$refs.listContent.refresh()
							console.log('sssssss', that.$refs.listContent.getDisplayList())
							if (item.hasOwnProperty('id') && item.id && item.images2.length > 0) {
								that.recursiveUpload(item, operationType, 0, item.images2.length)
							} else {
								if (!item.images3) {
									item.images3 = []
								}
								item.images3 = [...item.images3, ...item.images2]
							}
						}
					})
				}
			}
		}
	}
</script>


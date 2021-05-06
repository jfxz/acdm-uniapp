/*
* 界面名称:货站出库
* 界面功能:
* 其他    :
* 时间    :2020-8-14 16:59:59
* 作者    :gyb
*/
<template>
	<view>
		<!-- 导航栏 -->
		<nav-bar
			 title="货站出库"
			 ref="navBar"
			:show-sort="true"
			:input-value="inputValue"
			:out-stock="true"
			:operation-obj="operationObj"
			:show-search-bar="showSearchBar"
			:content-not-null="list.length!=0"
			:show-operation-history="showOperationHistory"
			:focus="true"
			@inputSearch="inputSearch"
			@scanCode="scanCode"
			@showSelectFlag="showSelectFlag"
			@resetInputValue="resetInputValue"
			@inputGetCargoInfo="inputGetCargoInfoDebounce"
			@openOperaionHistory="openOperaionHistory"
			@changeSearchBarStatus="changeSearchBarStatus">
		</nav-bar>
		
		<!-- 内容 -->
		<list-content
			 direction="D"
			 ref="listContent"
			 operation-type="STATIONHANDOVER"
			:restore="true"
			:not-id="true"
			:history="history"
			:remove-flag="true"
			:batch-order-id="batchOrderId"
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
			 btn="确认出库"
			:content-not-null="list.length!=0"
			:show-search-bar="showBottomSearchBar"
			@confirm="openBottomPopup"
			@resetInputValue="resetInputValue"
			@inputGetCargoInfo="inputGetCargoInfo">
			<!-- 左侧操作选项-->
			<template v-slot:left>
				<bottom-bar-left-scan
					:show-sort="true"
					@scanCode="scanCode"
					@showSelectFlag="showSelectFlag"
					@changeSearchBarStatus="changeBottomSearchBarStatus">
				</bottom-bar-left-scan>
			</template>
			<template v-if="!showOperationHistory" v-slot:right>
				<view></view>
			</template>
		</bottom-bar>
		
		<bottom-popup-to-place
			 btn="完成出库"
			 title="选择库区"
			 ref="bottomPopupToPlace"
			:locations-ori="locations"
			@confirm="confirm">
		</bottom-popup-to-place>
		
		<confirm-modal
			title="新版本提醒"
			ref="confirmModal"
		 @check="remindCheck">
		</confirm-modal>
	</view>
</template>

<script>
	import dayjs from '@/common/util/dayjs.min.js'
	import navBar from '@/pages/cargo/nav-bar.vue'
	import bottomBar from '@/pages/cargo/bottom-bar.vue'
	import cargoMixin from '@/pages/cargo/cargo-mixin.js'
	import listContent from '@/pages/cargo/list-content.vue'
	import bottomBarLeftScan from '@/pages/cargo/bottom-bar-left-scan.vue'
	import bottomPopupToPlace from '@/pages/cargo/bottom-popup-to-place.vue'
	import containerCard from '@/pages/cargo/leaveport/components/container-card.vue'
	import {
		onError,
		confirm,
		addFromBatch,
		getCargoInfo,
		getUserDepart,
		getCloseoffVersionRemind,
		getCloseoffData
	} from '@/api/cargo/index.js'
	import { validatenull } from '@/common/util/validate.js'
	import { debounce } from '@/common/util/util.js'
	import confirmModal from '@/pages/cargo/leaveport/components/closeoff-remind-modal.vue'
	import {mapGetters} from 'vuex'
	export default {
		mixins: [cargoMixin],
	  components: {
			navBar,
			bottomBar,
			listContent,
			containerCard,
			bottomBarLeftScan,
			bottomPopupToPlace,
			confirmModal
		},
		data () {
			return {
				// 出库选择列表
				locations: [{
					id: '1',
					name: '原消防前待运区',
					selected: false
				}, {
					id: '2',
					name: '22待运区',
					selected: false
				}, {
					id: '3',
					name: '货站雨棚下',
					selected: false
				}],
				// 通过集装器号获取货物信息的接口需要提交的表单信息
				cargoInfoForm: {
					// 集装器编码
					uld: '',
					// 方向 出港为D
					direction: 'D',
					// 操作类型 STATIONHANDOVER
					operationType: 'STATIONHANDOVER'
				},
				// 确认出库需要提交的表单信息
				confirmForm: {
					// 货物信息
					cargos: [],
					// 方向
					direction: 'D',
					// 操作类型
					operationType: 'STATIONHANDOVER'
				},
				// 页面转向操作记录页面时需要提交的信息
				operationObj: {
					pageName: 'out-stock',
					operationType: 'STATIONHANDOVER',
					direction: 'D'
				},
				// 批次单号，从onLoad传过来
				batchOrderId: '',
				// 是否显示导航栏底部栏的查看操作记录按钮
				showOperationHistory: true,
				// 当前用户属于国际货站还是国内货站，如果属于国内货站则不需要选择库区
				innerStation: false,
				closeOffList: [],
				interval: null,
			}
		},
		
		computed: {
			...mapGetters(['newVersionMsg', 'oriCloseOffList'])
		},
		
		watch: {
			newVersionMsg: {
				handler(newval) {
					this.getCloseoffVersionRemind()
				}
			}
		},
		
		onShow () {
			// 如果是从选择页面返回的
			if (this.backFlag) {
				let list = uni.getStorageSync('sort-list')
        
				if (list) {
          console.log('选择', list, this.list)
					list = list.filter(e => !this.list.find(v => v.containerCode === e.containerCode))
					list.forEach(e => {
            console.log('选择hhhhh')
						this.cargoInfoForm.uld = e.containerCode
						this.getCargoInfo()
					})
					uni.removeStorageSync('sort-list')
				}
				this.setBackFlag(false)
			}
		},
		
		mounted () {
      var that = this
			this.$store.dispatch('setOriCloseOffList', [])
			this.getCloseoffData()
			this.interval = setInterval(function () {
				that.getCloseoffData()
			}, 20000)
      this.initAutoSearch()
		},
		
		beforeDestroy () {
			clearInterval(this.interval)
		},
		
		onLoad (e) {
			let userForm = uni.getStorageSync('userForm')
			if (userForm) {
				let userName = userForm.username
				this.$loading()
				getUserDepart({
					username: userName
				}).then(res => {
					if (res.status) {
						let e = res.data.content[0]
						if (e.department && e.department.indexOf('国内货站') !== -1) {
							this.innerStation = true
						}
 					}
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
			}
			
			// 如果该页面是从操作记录页面进入的
			if (e.fromCloseOff) {
				this.cargoInfoForm.uld = e.uld
				this.getCargoInfo()
			}
			else if (e.hasOwnProperty('history') && e.history === 'true') {
				this.history = true
				this.batchOrderId = e.batchOrderId
				this.showOperationHistory = false
				let storage = uni.getStorageSync('cargo-history')
				if (storage) {
					this.list = [...storage]
					this.$nextTick(function(){
						this.$refs.listContent.setList(this.list)
					})
					uni.removeStorageSync('cargo-history')
				}
			} else if (!this.completedOutStock) {
				// 如果还没有确认出库，缓存已经扫码的集装器
				let list = uni.getStorageSync('completedOutStock')
				if (list) {
					this.list = [...list]
					var that = this
					this.$nextTick(function(){
						if (this.nextTickTime < 1) {
							that.refresh()
							that.nextTickTime++
						}
					})
				}
			}
		},
		
		// 退出该页面时
		onBackPress () {
			// 如果是从操作记录进入的货站出库页面，直接回退，不做任何处理
			if (!this.showOperationHistory) {
				return
			}
			if (!this.completedOutStock) {
				uni.setStorageSync('completedOutStock', this.list)
			}
		},
		methods:{
			openBottomPopup (item) {
				if (this.innerStation) {
					this.confirm()
				} else {
					this.$refs.bottomPopupToPlace.open(item, this.locations, 'STATIONHANDOVER')
				}
			},
			updateList (list) {
				this.list = list
				uni.setStorageSync('completedOutStock', this.list)
			},
			showSelectFlag () {
				uni.setStorageSync('sorted_list', this.list)
				let url = `/pages/cargo/leaveport/out-stock-sort`
				if (!this.history) {
					uni.navigateTo({
						url: url
					})
				} else {
					uni.navigateTo({
						url: url + `?history=true`
					})
				}
			},
			// 通过集装器号得到货物信息
			getCargoInfo () {
				this.cargoInfoForm.uld = this.cargoInfoForm.uld.toUpperCase()
				this.$loading()
				// 如果是在操作记录中操作
				if (!this.showOperationHistory) {
					var addForm = {
						uld: this.cargoInfoForm.uld,
						batchOrderId: this.batchOrderId,
						operationType: 'STATIONHANDOVER',
						direction: 'D'
					}
					this.$loading()
					addFromBatch(addForm).then(res => {
						console.log('addFormBatchRes', res)
						if (res.status) {
							this.scanSound()
							uni.vibrateLong()
							this.list = res.data
							this.list.forEach(e => {
								let obj = this.generateObj(e)
								if (obj.hasOwnProperty('containerType') && obj.containerType) {
									if (obj.containerType === '0') {
										obj.boxNumber++
									} else if (obj.containerType === '1') {
										obj.boardNumber++
									} else if (obj.containerType === '2') {
										obj.carNumber++
									}
								}
							})
							this.setOperationHistoryList(this.list)
							this.$refs.listContent.setList(this.list)
						}
						this.$message(res.message)
						uni.hideLoading()
					}).catch(err => {
						onError(err)
					})
				} else {
					this.$loading()
					// 如果是从货运首页进入页面
					console.log('this.cargoInfoForm', this.cargoInfoForm)
					getCargoInfo(this.cargoInfoForm).then(res => {
						console.log('getCargoInfo', res)
						if (res.status && !validatenull(res.data)) {
							this.scanSound()
							uni.vibrateLong()
							// 出库未完成，允许缓存当前数据
							this.setCompletedOutStock(false)
							let obj = this.generateObj(res.data[0])
							let today = dayjs().format('YYYY-MM-DD') + ' 00:00:00'
							if (obj.opDate) {
								if (today === obj.opDate) {
									obj.notToday = false
								} else {
									obj.notToday = true
								}
							}
							this.list.unshift(obj)
							this.$refs.listContent.unshiftToList([obj])
							// 刷新，防止数据视图不同步
							this.$refs.listContent.refresh()
						}
						this.$message(res.message)
						uni.hideLoading()
					}).catch(err => {
						onError(err)
					})
				}
			},
      
      getCargoInfoDebounce: debounce(function () {
        this.getCargoInfo()
      }, 500),
      
      inputSearch: debounce(function (e) {
        var that = this
      	console.log('out-stock-input-search', e)
      	this.cargoInfoForm.uld = e
      	let exit = false
      	try {
      		let listContentList = this.$refs.listContent.getList()
      		for (let i = 0; i < listContentList.length; i++) {
      			let v = listContentList[i]
      			if (this.getNumber(v.containerCode) === this.getNumber(this.cargoInfoForm.uld)) {
      				exit = true
      				break
      			}
      		}
      	} catch (err) {
      		console.log('err', err)
      	}
      	
      	
      	if (exit) {
      		this.$message('不可重复输入')
      	} else {
          this.getCargoInfoDebounce()
      	}
      	this.inputValue = ''
      	setTimeout(function () {
          that.$refs.navBar.resetInputValue()
        }, 100)
      }, 800),
			
			// 完成出库
			confirm: debounce(function (name) {
				// 返回值为确认未成功的集装器号。函数将可以用的集装器号存进this.confirmForm.cargos中
				this.initConfirmFormCargos()
				this.confirmForm.cargos.forEach(e => e.deliveryLocation = name)
				this.confirmBtn()
			}),
			
			uploadImageBefore (e) {
				this.uploadImage(e, 'STATIONHANDOVER')
			},
			
			uploadImage (item, operationType) {
				const MAXPICNUM = 3
				var that = this
				let imageLen = 0
				// 如果之前有上传过图片，计算该步骤是否上传过图片。如果上传过图片，得到该步骤上传的图片数
				if (item.cargoIrregularRecords) {
					let imagesStep = item.cargoIrregularRecords.find(e => e.step === operationType)
					if (imagesStep) {
						imageLen = imagesStep.pictureUrls.split("http").length - 1
					}
				}
				// 该步骤还可以上传的图片数目=最大数目-之前上传过的数目-本次上传过的数目
				let rest = MAXPICNUM - imageLen - item.selectedPicNums
				if (rest < 0 || rest === 0) {
					this.$message('照片已满')
				} else {
					uni.chooseImage({
						count: rest > 0? rest : 0,
						success: function (res) {
							item.selectedPicNums += res.tempFilePaths.length
							item.showItem = false
							let len = item.images.length
							for (let i = len; i < res.tempFiles.length + len; i++) {
								let obj = {
									// 以文件名作为key值循环渲染
									name: 'image' + i,
									// 是否显示图片删除图标
									showDelete: false,
									// 图片本地地址
									uri: res.tempFiles[i - len].path,
									// 图片显示与否
									show: true
								}
								// 包括了以前上传的图片和这次上传的图片，展示用
								if (!item.id) {
									item.images.push(obj)
								}
								// 只包含这次上传的图片。上传用。
								item.images2.push(obj)
							}
							// 必须改变数据以触发视图更新
							item.showItem = true
							that.$refs.listContent.refresh()
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
			},
			
			// 出库成功后上传照片
			confirmBtn () {
				this.$loading()
				confirm(this.confirmForm).then(res => {
					console.log('confirmBtn', res)
					if (res.status && !validatenull(res.data)) {
						for (let i = 0; i < this.confirmForm.cargos.length; i++) {
							let e = this.confirmForm.cargos[i]
							// 查找的目的是为了获得id用于上传图片。扫码后得到的集装器id为空，不能上传图片。
							let exit = res.data.find(v => v.containerCode === e.containerCode)
							if (!e.id && exit && e.images3 && e.images3.length > 0) {
								e.id = exit.id
								e.images2 = [...e.images3]
								// 用递归上传该集装器本次选择的图片，以达到同步上传的目的
								this.recursiveUpload(e, 'STATIONHANDOVER', 0, e.images2.length)
							}
						}
					}
					this.$message(res.message)
					this.list = []
					this.$refs.listContent.setList([])
					// 出库成功/失败，清掉缓存
					this.setCompletedOutStock(true)
					uni.removeStorageSync('completedOutStock')
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
			},
			// 进入操作记录页面
			openOperaionHistory () {
				let operationObj = this.operationObj
				uni.navigateTo({
					url: `/pages/cargo/operation-history?operationType=${operationObj.operationType}&direction=${operationObj.direction}`
							+ `&pageName=${operationObj.pageName}`
				})
			},
			
			getCloseoffVersionRemind () {
				if (!validatenull(this.newVersionMsg) && !validatenull(this.closeOffList)) {
					// this.$refs.confirmModal.open(this.newVersionMsg)
				}
			},
			
			remindCheck (flight) {
				let flightObj = this.closeOffList.find(e => e.flight === flight)
				if (!flightObj) {
					this.$message('出库截关无此航班')
					return
				}
				let arr = flightObj.arr
				let flightId = ''
				if (!validatenull(arr)) {
					uni.setStorageSync('closeoff_car', arr)
					flightId = arr[0].flightId
					uni.navigateTo({
						url: `/pages/cargo/leaveport/out-stock-closeoff-containers?flight=${flight}&flightId=${flightId}`
					})
				} else {
					this.$message('该航班无集装器数据')
				}
			},
			
			getCloseoffData() {
				getCloseoffData().then(res => {
					console.log('getCloseoffData-res', res)
					if (res.status && res.data) {
						this.closeOffList = []
						let index = 0
						for (let key in res.data) {
							let arr = [...res.data[key]]
							let closeoffTimeObj = arr.find(e => e.closeOffTime)
							let obj = {
								id: index++,
								flight: key,
								flightId: arr.length > 0 ? arr[0].flightId: '',
								opDate: '',
								status: '',
								number: arr ? arr.length : 0,
								abnormal: false,
								closeOffSum: arr.length,
								closeoffTime: closeoffTimeObj ? closeoffTimeObj.closeOffTime : 0,
								scheduleDepTime: closeoffTimeObj ? closeoffTimeObj.scheduleDepTime : undefined,
								abNumber: 0,
								arr: arr
							}
							if (arr[0].opDate) {
								obj.opDate = arr[0].opDate.substr(0, 10)
							}
							this.closeOffList.push(obj)
						}
						
						try {
							if (this.closeOffList[0].closeoffTime) {
								this.closeOffList.sort((a, b) => b.closeoffTime - a.closeoffTime)
								this.closeOffList = this.closeOffList.slice(0, 7)
							}
						} catch (err) {
							console.log('err', err)
						}
						
						try {
							if (!this.closeOffList[0].closeoffTime && this.closeOffList[0].scheduleDepTime) {
								this.closeOffList.sort((a, b) => b.scheduleDepTime - a.scheduleDepTime)
							}
						} catch (err) {
							console.log('err', err)
						}
						this.$store.dispatch('setOriCloseOffList', this.closeOffList)
						this.getCloseoffVersionRemind()
					}
				}).catch(err => {
					onError(err)
				})
			}
		}
	}
</script>

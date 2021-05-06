import {DIC} from '@/common/dic.js'
import {mapGetters, mapActions} from 'vuex'
import { debounce } from '@/common/util/util.js'
import dayjs from '@/common/util/dayjs.min.js'
import {
	getFormlistRemark,
	getVersions,
	confirm,
	updateCargoInfo,
	getShipmentAreas,
	updateStandCode,
	getDetailsOnOperation,
	onError,
	cargoUrl,
	cargoSvnUrl,
	cargoRemind
} from '@/api/cargo/index.js'
import { validatenull } from '@/common/util/validate.js'
// 最大照片选择数量
const maxPicNums = 3
export default {
	data () {
		return {
			// 列表内容
			list: [],
			// 是否显示搜索框
			showSearchBar: false,
			// 是否显示底部搜索框
			showBottomSearchBar: false,
			// 输入框值
			inputValue: '',
			selectedItem: {},
			// 航班信息
			flight: {
				// 航班号
				flight: '',
				// 机号
				registration: '',
				// 机位
				standCode: '',
				// 目的站
				destination: ''
			},
			// 待运区列表
			locations: [],
			// 是否全选
			selectAllFlag: false,
			// 是否出现了选择框
			selectListFlag: false,
			// 已接受的货物
			receiveds: [],
			// 是否准备到达
			toArrive: false,
			// 按钮文字
			btnText: '确认交接',
			// 拖车号
			driverNumber: '',
			// 底部栏最右边按钮是否可以按下
			btnCanPress: false,
			// 到达按钮可以点击与否的条件，为状态
			arrivedCondition: '',
			// 是否显示操作记录
			history: false,
			scrollHeight: 0,
			fromDriver: false,
			// 不能确认的集装箱
			notConfirmedList: [],
			nextTickTime: 0,
			notAuto: false,
			leftVersion: '',
			rightVersion: '',
			leftVersionList: [],
			rightVersionList: [],
			// 全部版本（只有版本名）
			versions: [],
			// 全部版本（带集装器详细信息）
			versionLists: [],
			showModal: true,
			// 当前版本名
			currentVersion: '',
			showUploaderSearch: false,
      timer: null,
      focus: false
		}
	},
	computed: {
		...mapGetters([
		'cargoUserForm',
		'arrivedLeaveWaitingArea',
		'arrivedLeaveAircraft',
		'arrivedEnterWaitingArea',
		'arrivedEnterStation',
		'completedLeaveToWaitingArea',
		'completedLeaveToAircraft',
		'completedEnterToStation',
		'completedLeaveArrivedWaitingArea',
		'completedLeaveArrivedAircraft',
		'completedEnterArrivedWaitingArea',
		'completedOutStock',
		'completedUnloading',
		'completedWareHoused',
		'completedEnterArrivedStation',
		'completedEnterToWaitingArea',
		'operationHistoryList',
		'backFlag',
		'scanBack',
		'code',
		'completedPulldownConfirm',
		'completedPulldownToWaitingArea',
		'completedPulldownWaitingArea',
		'completedPulldownToStation',
		'arrivedPulldownStation',
		'completedPulldownArrivedStation',
		'completedPulldownWareHouse',
		'completedCostlyUnloading',
		'completedCostlyToStation',
		'completedCostlyArrivedStation',
		'completedCostlyWareHouse'])
	},
	
	onPageScroll (e) {
		if (e.scrollTop > this.scrollHeight) {
			if (this.showSearchBar) {
				this.closeSearchBarStatus()
			}
			if (this.showBottomSearchBar) {
				this.closeBottomSearchBarStatus()
			}
		}
		this.scrollHeight = e.scrollTop
	},
	methods: {
		...mapActions([
		'setArrivedLeaveWaitingArea',
		'setArrivedLeaveAircraft',
		'setArrivedEnterWaitingArea',
		'setArrivedEnterStation',
		'setCompletedUnloading',
		'setCompletedEnterArrivedWaitingArea',
		'setCompletedEnterArrivedStation',
		'setCompletedWareHoused',
		'setCompletedLeaveToWaitingArea',
		'setCompletedLeaveToAircraft',
		'setCompletedEnterToStation',
		'setCompletedLeaveArrivedWaitingArea',
		'setCompletedLeaveArrivedAircraft',
		'setCompletedOutStock',
		'setCompletedEnterToWaitingArea',
		'setOperationHistoryList',
		'setBackFlag',
		'setScanBack',
		'setCode',
		'setCompletedPulldownConfirm',
		'setCompletedPulldownToWaitingArea',
		'setCompletedPulldownWaitingArea',
		'setCompletedPulldownToStation',
		'setArrivedPulldownStation',
		'setCompletedPulldownArrivedStation',
		'setCompletedPulldownWareHouse',
		'setCompletedCostlyUnloading',
		'setCompletedCostlyToStation',
		'setCompletedCostlyArrivedStation',
		'setCompletedCostlyWareHouse'
		]),
		
		// 用来提醒在上个步骤一共有多少集装器停留超过半小时,operationType为上个步骤的步骤码，nodeName为上个步骤的中文名
		cargoRemind (operationType, nodeName) {
			this.$loading()
			cargoRemind({
			  operationType: operationType
			}).then(res => {
				console.log('cargoRemind', res)
				if (res.status && !validatenull(res.data)) {
					let message = res.data.map(e => e.containerCode).toString()
					message = `${message}在${nodeName}停留超过半小时`
					try {
						this.$refs.cargoRemindDialog.open(message)
					} catch (err) {
						console.log('err', err)
					}
					// this.$message(message)
				}
				uni.hideLoading()
			}).catch(err => {
				// onError(err)
				console.log('onError', err)
				uni.hideLoading()
			})
		},
		
		getNumber (str) {
			let arr = str.match(/\d+/g)
			if (arr && arr.length > 0) {
				let s = parseInt(arr[0]) + ''
				return s
			} else {
				return ''
			}
		},
		
		deleteList () {
			this.list = []
			this.$refs.listContent.setList(this.list)
		},
		
		// 通过集装器id判断这个货物在哪个步骤何时被何人操作
		getDetailsOnOperation (list, direction, operationType) {
			return getDetailsOnOperation({
				cargos: list,
				direction: direction,
				operationType: operationType
			}).then(res => {
				console.log('getDetailsOnOperation', res)
				if (res.status) {
				}
			}).catch (err => {
				onError(err)
			})
		},
	
		
		scanSound () {
			const innerAudioContext = uni.createInnerAudioContext()
			innerAudioContext.autoplay = true
			innerAudioContext.src = 'static/' + 'scan-sound' + '.mp3'
			innerAudioContext.onPlay(() => {
			  console.log('开始播放')
			})
		},
		getShipmentAreas () {
			getShipmentAreas().then(res => {
				if (res.status) {
					this.locations = res.data
					this.locations.forEach(e => {
						e.name = e.code
						e.selected = false
					})
				}
			})
		},
		generateObj (obj) {
			return {
				images: [],
				images2: [],
				selectedPicNums: 0,
				showItem: true,
				selected: false,
				pass: false,
				...obj,
				carNumber: 0,
				boxNumber: 0,
				boardNumber: 0,
				containerTypes: []
			}
		},
		// 关闭或显示顶部搜索框
		changeSearchBarStatus () {
			this.showSearchBar = !this.showSearchBar
		},
		// 关闭顶部搜索框
		closeSearchBarStatus () {
			this.showSearchBar = false
		},
		// 关闭或显示底部搜索框
		changeBottomSearchBarStatus () {
			this.showBottomSearchBar = !this.showBottomSearchBar
		},
		// 关闭底部搜索框
		closeBottomSearchBarStatus () {
			this.showBottomSearchBar = false
		},
		// 清空输入框
		resetInputValue () {
			this.inputValue = ''
		},
		
		scanCode () {
			this.notAuto = true
			var that = this
			uni.scanCode({
				scanType: ['barCode', 'qrCode'],
				onlyFromCamera: false,
				success: function (res) {
					console.log('scancode' + res)
					that.$loading()
					console.log('条码类型：' + res.scanType)
					console.log('条码内容：' + res.result)
					let arr = res.result.split('#')
					if (arr.length > 1) {
						that.cargoInfoForm.uld = arr[0].slice(5)
					} else {
						that.cargoInfoForm.uld = arr[0]
					}
					
					if (that.list.find(v => that.getNumber(v.containerCode) === that.getNumber(that.cargoInfoForm.uld))) {
						that.$message('不可重复接收')
					} else {
						that.getCargoInfo()
					}
				}
			})
		},
		// 不考虑重复的扫码
		scanCodeNoCheckRepeat () {
			this.notAuto = true
			var that = this
			uni.scanCode({
				scanType: ['barCode', 'qrCode'],
				onlyFromCamera: false,
				success: function (res) {
					console.log('scancode' + res)
					that.$loading()
					console.log('条码类型：' + res.scanType)
					console.log('条码内容：' + res.result)
					let arr = res.result.split('#')
					if (arr.length > 1) {
						that.cargoInfoForm.uld = arr[0].slice(5)
					} else {
						that.cargoInfoForm.uld = arr[0]
					}
					that.getCargoInfo()
				}
			})
		},
		
		// 通过输入框获取信息
		inputGetCargoInfo (e) {
			this.notAuto = true
			if (e && e !== '') {
				this.inputValue = e.toUpperCase()
			} else {
				return
			}
			this.cargoInfoForm.uld = this.inputValue
			this.$loading()
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
				this.getCargoInfo()
			}
		},
		
		// 递归上传，异步上传改同步上传
		recursiveUpload (item, operationType , idx, end) {
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
							
							item.images.push({
								id: jsonObj.data.id,
								url: jsonObj.data.pictureUrls,
								createBy: this.cargoUserForm.username || '',
								show: true,
								name: 'image' + len,
								showDelete: false,
								uri: item.images2[idx].uri
							})
						} catch (e) {
							console.log(e)
						}
					} else {
						this.$message('图片上传失败')
						item.selectedPicNums--
					}
					++idx
					if (idx < end) {
						that.recursiveUpload(item, operationType, idx, end)
					}
				}
			})
		},
		// 上传图片
		uploadImage (item, operationType) {
			var that = this
			let imagesStep = null
			if (item.cargoIrregularRecords && item.cargoIrregularRecords.length > 0) {
				imagesStep = item.cargoIrregularRecords.find(e => e.step === operationType)
			}
			let imageLen = 0
			if (imagesStep) {
				imageLen = imagesStep.pictureUrls.split(",").length
			}
			
			let a = maxPicNums - imageLen - item.selectedPicNums
			if (a < 0 || a === 0) {
				this.$message('照片已满')
			} else {
				uni.chooseImage({
					count: a > 0? a : 0,
					success: function(res) {
						console
						item.selectedPicNums += res.tempFilePaths.length
						item.showItem = false
						let len = item.images.length
						item.images2 = []
						for (let i = len; i < res.tempFiles.length + len; i++) {
							
							item.images2.push({
								show: true,
								name: 'image' + i,
								showDelete: false,
								uri: res.tempFiles[i - len].path
							})
						}
						// 必须改变数据以触发视图更新
						item.showItem = true;
						// 递归上传图片，使异步上传变同步
						that.recursiveUpload(item, operationType, 0, item.images2.length)
					}
				})
			}
		},
		updateCargoInfoNoToast (e) {
			console.log('updateCargoInfoNoToast')
			updateCargoInfo(e).then(res => {
				if (res.status) {
				} else {
					this.$message(res.message)
				}
				this.$refs.popup.close()
			}).catch(err => {
				this.$message(err)
			})
		},
		updateCargoInfo (e) {
			updateCargoInfo(e).then(res => {
				if (res.status) {
					this.$message('修改待运区成功')
				} else {
					this.$message(res.message)
				}
				this.$refs.popup.close()
			}).catch(err => {
				this.$message(err)
			})
		},
		// 点击确认出库打开底部弹出层(出库、选择待运区)
		openBottomPopup (item) {
			this.selectedItem = item
			this.$refs.bottomPopupToPlace.open(item, this.locations)
		},
		// 点击关闭底部弹出层
		closeBottom () {
			this.$refs.bottomPopupToPlace.close()
		},
		// 打开底部弹出层（输入拖车号）
		openPopupInput () {
			if (!this.toArrive) {
				this.$refs.bottomPopupInput.open()
			} else {
				this.confirm()
			}
		},
		cancelPopupInput () {
			this.$refs.bottomPopupInput.close()
		},
		
		// 改变待运区选择状态
		changeSelectStatus (item) {
			if (item.selected) {
				item.selected = false
			} else {
				this.locations.forEach(e => e.selected = false)
				item.selected = true
			}
		},
		confirmBtn () {
			this.$loading()
			confirm(this.confirmForm).then(res => {
				console.log('confirmBtn', res)
			 this.$message(res.message)
			 setTimeout(function () {
				uni.navigateBack()
			 }, 3000)
			}).catch(err => {
				onError(err)
			})
		},
		selectAll () {
			this.$refs.listContent.selectAll()
			if (this.$refs.listContent.judgeAtLeastSelected()) {
				this.btnCanPress = true
			} else {
				this.btnCanPress = false
			}
		},
		// 取消全选
		cancelSelectAll () {
			this.$refs.listContent.cancelSelectAll()
			this.btnCanPress = false
		},
		// 打开下详细信息弹出层
		showBottomPopup (e) {
			console.log('cargo-mixins-showBottomPopup', e)
			this.$refs.bottomPopupDetails.open(e)
		},
		// 修改待运区
		updateWaitArea (name) {
			let changedLocation = name
			this.list.forEach(e => {
				if (e.flight === this.selectedItem.flight && e.registration === this.selectedItem.registration) {
					e.firstTransportTargetAddr = changedLocation
					this.updateCargoInfo(e)
				}
			})
			this.$refs.listContent.setList(this.list)
			this.$refs.listContent.refresh()
		},
		// 判断有没有出现选择框，将要提交的列表写到表单中
		initConfirmFormCargos (status) {
			this.selectListFlag = this.$refs.listContent.judgeSelectListFlag()
			let list = []
			if (!this.selectListFlag) {
				list = this.$refs.listContent.getList()
			} else {
				list = this.$refs.listContent.getSelections()
			}
			this.confirmForm.cargos = list
		},
		
		initConfirmFormCargosPush (status) {
			this.selectListFlag = this.$refs.listContent.judgeSelectListFlag()
			let list = []
			if (!this.selectListFlag) {
				list = this.$refs.listContent.getList()
				let arr = list
				this.confirmForm.cargos = [...this.confirmForm.cargos, ...arr]
			} else {
				list = this.$refs.listContent.getSelections()
				this.confirmForm.cargos = list
			}
			return list.filter(e => e.status !== status)
		},
		getFlightInfo (e) {
			return {
				flight: e.flight,
				registration: e.registration,
				standCode: e.standCode,
				destination: e.destination
			}
		},
		// 列表出现选择框或者隐藏选择框
		showSelectFlag () {
			this.$refs.listContent.showSelectFlag()
		},
		noSelectedWarn (flag) {
			// 如果一个也没选择
			if (!flag) {
				this.btnCanPress = false
			} else {
				this.btnCanPress = true
			}
		},
		
		changeBottomSelectAll (flag) {
			this.$refs.bottomSelect.changeSelectAllFlag(flag)
		},
		// 显示目前还有多少集装箱未到达
		showNotReceived () {
			var that = this
			let notReceiveds = []
			let list = this.$refs.listContent.getList()
			if (list.find(e => e.status !== this.arrivedCondition)) {
				// 如果有未到达的
				notReceiveds = list.filter(e => e.status !== this.arrivedCondition).map(v => v.containerCode + '、')
				let strlen = notReceiveds[notReceiveds.length - 1].length
				notReceiveds[notReceiveds.length - 1] = notReceiveds[notReceiveds.length - 1].substr(0, strlen - 1)
				this.$refs.notReceivedContainers.setList(notReceiveds)
				this.$refs.notReceivedContainers.setFlag(true)
			} else {
				this.$message('已全部确认到达')
				setTimeout(function () {
					if (that.fromDriver) {
						uni.navigateBack({
						 delta: 2
						})
					} else {
						uni.navigateBack()
					}
				}, 1000)
			}
			
		},
		
		updateList (list) {
			this.list = list
		},
		
		confirmRight (item) {
			this.confirmForm.cargos = this.$refs.listContent.getList().filter(e => (e.flight === item.flight && e.registration === item.registration))
			confirm(this.confirmForm).then(res => {
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
					this.$refs.listContent.setList([])
					this.$refs.listContent.unshiftToListWithChange(this.confirmForm.cargos)
					this.$refs.listContent.refresh()
					var that = this
					this.$nextTick(function(){
						that.$refs.bottomSelect.selectAll()
					})
					this.$message('成功到达')
					// 如果列表所有卡片都是已到达状态
					if (!this.$refs.listContent.getList().find(e => e.status !== this.arrivedCondition)) {
						this.btnCanPress = false
					}
				} else {
					this.$message(res.message)
				}
			}).catch(err => {
				this.$message(err)
			})
		},
		
		// 多车重合的时候上传图片打开的对话框
		openUploadImageDialog (item) {
			let list = this.list.filter(e => e.flight === item.flight && e.registration === item.registration)
			let map = list.map(e => {
				e = this.generateObj(e)
				if (e.hasOwnProperty('containerType') && e.containerType) {
					if (e.containerType === '0') {
						e.boxNumber++
					} else if (e.containerType === '1') {
						e.boardNumber++
					} else if (e.containerType === '2') {
						e.carNumber++
					}
				}
				let index = 0
				if (e.cargoIrregularRecords && e.cargoIrregularRecords.length > 0) {
					e.cargoIrregularRecords.forEach((k) => {
						if (k.pictureUrls) {
							let arr = k.pictureUrls.split(',')
							arr.forEach(v => {
								e.images.push({
									id: k.id,
									name: 'image' + index++,
									uri: v,
									url: v,
									show: true
								})
							})
						}
					})
				}
				return e
			})
			this.$refs.uploadImageDialog.open(map)
		},
		
		// 刷新
		refresh () {
			
			let list = [...this.list]
			this.list = []
			console.log('refresh-alength', this.list.length)
			list.forEach(e => {
				this.cargoInfoForm.uld = e.containerCode
				this.getCargoInfo()
			})
		},
		
		// 适用于扫一个货物，出现一整个批次的刷新
		refresh2 () {
			let list = [...this.list]
			this.list = []
			if (list.length > 0 && list[0] && list[0].hasOwnProperty('containerCode') && list[0].containerCode) {
				this.cargoInfoForm.uld = list[0].containerCode
				this.getCargoInfo()
			} else {
				this.list = [...list]
			}
		},
		
		// 是否禁止卡片左滑删除
		changeSwipeStatus () {
			this.$refs.listContent.changeSwipeStatus()
		},
		
		// 更新机位
		updateStandCode (item) {
			updateStandCode(item).then(res => {
				console.log('updateStandCode', res)
				if (res.status) {
					item.standCode = res.data.standCode
					this.$message('更新机位成功')
				}
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
		
		transition (event) {
			this.timer(event)
		},
		initTasks (item) {
			let tasks = []
			if (item.pullConfirmOperator) {
				tasks.unshift({
					title: '拉下',
					desc: item.pullConfirmOperator,
					time: dayjs(item.pullConfirmTime).format('YYYY-MM-DD HH:mm:ss')
				})
			} 
			if (item.firstTransportDriverName) {
				tasks.unshift({
					title: '运往待运区',
					desc: item.firstTransportDriverName  + '驾驶拖车' + item.firstTransportTargetAddr,
					time: dayjs(item.firstTransportTime).format('YYYY-MM-DD HH:mm:ss')
				})
			} 
			if (item.toStationDockOperator) {
				tasks.unshift({
					title: '装卸运往货站',
					desc: item.toStationDockOperator,
					time: dayjs(item.toStationDockTime).format('YYYY-MM-DD HH:mm:ss')
				})
			} 
			if (item.secondTransportDriverName) {
				tasks.unshift({
					title: '运往货站',
					desc: item.secondTransportDriverName + '驾驶拖车' + item.secondTransportCarCode,
					time: dayjs(item.secondTransportTime).format('YYYY-MM-DD HH:mm:ss')
				})
			} 
			if (item.arriveStationOperator) {
				tasks.unshift({
					title: '到达货站',
					desc: item.arriveStationOperator,
					time: dayjs(item.secondTransportArriveTime).format('YYYY-MM-DD HH:mm:ss')
				})
			}
			return tasks
		},
		
		initWarehouseTasks (item) {
			let tasks = []
			if (item.pullConfirmOperator) {
				tasks.unshift({
					title: '拉下',
					desc: item.pullConfirmOperator,
					time: dayjs(item.pullConfirmTime).format('YYYY-MM-DD HH:mm:ss')
				})
			} 
			if (item.firstTransportDriverName) {
				tasks.unshift({
					title: '装卸运往待运区',
					desc: item.firstTransportDriverName + '驾驶拖车' + item.firstTransportTargetAddr,
					time: dayjs(item.firstTransportTime).format('YYYY-MM-DD HH:mm:ss')
				})
			} 
			if (item.toStationDockOperator) {
				tasks.unshift({
					title: '装卸运往货站',
					desc: item.toStationDockOperator,
					time: dayjs(item.toStationDockTime).format('YYYY-MM-DD HH:mm:ss')
				})
			}
			if (item.arriveStationOperator) {
				tasks.unshift({
					title: '到达货站',
					desc: item.arriveStationOperator,
					time: dayjs(item.secondTransportArriveTime).format('YYYY-MM-DD HH:mm:ss')
				})
			}
			return tasks
		},
		
		initContainerTimelines () {
			this.list.forEach(e => {
				e.tasks = this.initTasks(e)
				console.log(e.containerCode, e.tasks)
				e.lastestTask = e.tasks[0]
			})
			this.$refs.listContent.setList(this.list)
			console.log('initContainerTimelines', this.list)
		},
		initWarehouseContainerTimelines () {
			this.list.forEach(e => {
				e.tasks = this.initWarehouseTasks(e)
				e.lastestTask = e.tasks[0]
			})
			this.$refs.listContent.setList(this.list)
			console.log('initContainerTimelines', this.list)
		},
		
		changeVersion (version) {
			this.currentVersion = version
			console.log('changeVersion', version)
			let versionName = version.match(/\d+/g)[0]
			let versionList = this.versionLists.find (e => e.versionName === versionName)
			if (versionList) {
				this.initList({
					data: versionList.list
				})
			}
		},
		
		getVersions (searchForm) {
			console.log('mixin-versions', searchForm)
			this.$loading()
			this.getFormlistRemark(searchForm.flight)
			getVersions(searchForm).then(res => {
				console.log('getVersions', res)
				if (res.status && JSON.stringify(res.data) !== "{}") {
					this.title = searchForm.flight
					this.showUploaderSearch = true
					this.versions = []
					this.versionLists = []
					let max = 0
					for (let key in res.data) {
						let intKey = parseInt(key)
						if (max < intKey) {
							max = intKey
						}
						this.versions.push('第' + key + '版')
						this.versionLists.push({
							versionName: key,
							list: res.data[key]
						})
					}
					this.currentVersion = '第' + max + '版'
					this.changeVersion(this.currentVersion)
				}
				if (!res.data || JSON.stringify(res.data) == "{}") {
					this.list = []
					this.leftVersion = ''
					this.rightVersion = ''
					this.leftVersionList = []
					this.rightVersionList = []
					
					// 全部版本（只有版本名）
					this.versions = []
					// 全部版本（带集装器详细信息）
					this.versionLists = []
					this.currentVersion = ''
					this.$refs.listContent.setList(this.list)
					this.title = this.getTitle()
					this.$message('数据为空')
					this.$refs.loaderTop.clearList()
				}
				this.$message(res.message)
				uni.hideLoading()
			}).catch(err => {
				onError(err)
			})
		},
		
		changeComparisonVersion (leftVersion, rightVersion) {
			console.log('cargo-mixin', leftVersion, rightVersion)
			// 必须同时选择两个版本才能比对版本
			if (leftVersion !== '' && rightVersion !== '') {
				uni.setStorageSync('leftVersionList', this.versionLists.find(v => v.versionName === leftVersion.match(/\d+/g)[0]))
				uni.setStorageSync('rightVersionList', this.versionLists.find(v => v.versionName === rightVersion.match(/\d+/g)[0]))
				uni.navigateTo({
					url: `/pages/cargo/landscape-comparison`
				})
			}
		},
		
		initList (res) {
			this.list = []
			for (let key in res.data) {
				this.list = [...this.list, ...res.data[key]]
			}
			this.list.forEach(e => {
				e.cabinNum = parseInt(e.cabin)
				e.splitLine = false
			})
			let index = 0
			let cabins = this.list.filter(e => {
				let arr = e.cabin.match(/[a-zA-Z]/g)
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
				if (a.cabinNum !== b.cabinNum) {
					return a.cabinNum - b.cabinNum
				} else {
					if (a.weight - b.weight > 0) {
						return -1
					} else {
						return 1
					}
				}
			})
			// 不包含舱位
			let list = this.list.filter(e => {
				let arr = e.cabin.match(/[a-zA-Z]/g)
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
				b.containerCode = i
				if (a.cabin.indexOf('H') === -1 && b.cabin.indexOf('H') === -1) {
					if ((a.cabin - 0) % 1 === 0 && (b.cabin - 0) % 1 === 0) {
						// 如果都是整数
						if (a.cabin !== b.cabin) {
							a.splitLine = true
						}
					} else {
						if (Math.floor(a.cabinNum / 10) !== Math.floor(b.cabinNum / 10)) {
							a.splitLine = true
						}
					}
				} else if ((a.cabin.indexOf('H') === -1 && b.cabin.indexOf('H') !== -1) || (a.cabin.indexOf('H') !== -1 && b.cabin.indexOf('H') === -1)) {
					a.splitLine = true
				} else if (a.cabin.indexOf('H') !== -1 && b.cabin.indexOf('H') !== -1){
					if (a.cabinNum !== b.cabinNum) {
						a.splitLine = true
					}
				}
			}
			this.list[0].containerCode = 0
			this.$nextTick(function(){
				this.$refs.loaderTop.init(res.data)
			})
			this.$refs.listContent.setList(this.list)
		},
		
		getFormlistRemark (flight) {
			getFormlistRemark({
				flight: flight
			}).then(res => {
				console.log('getFormlistRemark', res)
				if (res.status) {
					this.$nextTick(function(){
						this.$refs.loaderTop.initRemark(res.data.result)
					})
				}
			})
		},
		comparison () {
			this.$refs.versionComparisonModal.open(this.versions)
		},
		openVersionModal () {
			this.$refs.versionModal.open(this.versions, this.currentVersion)
		},
		refreshBtn () {
			this.getVersions(this.searchFormCopy)
		},
    
    getCargoInfoDebounce: debounce(function () {
      this.getCargoInfo()
    }, 500),
    
    inputGetCargoInfoDebounce: debounce(function () {
      this.inputGetCargoInfo()
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
        // this.getCargoInfoDebounce()
            this.inputGetCargoInfoDebounce()
    	}
    	this.inputValue = ''
    	setTimeout(function () {
        that.$refs.navBar.resetInputValue()
      }, 100)
    }, 800),
    
    initAutoSearch () {
      this.showSearchBar = true
      this.focus = true
      var that = this
      this.timer = debounce(function () {
        console.log('timerrrrrrrrrrrrrrrrrrrrrrrrrrrr')
        this.$loading()
        that.getCargoInfo()
      }, 100)
    }
	}
}
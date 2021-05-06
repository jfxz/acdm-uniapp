<template>
	<view :class="{'search-bar-margin-top': showSearchBar}">
		<!-- 如果内容为空 -->
		<template v-if="!contentNotNull">
			<view class="content-null">
				<view class="list-null-word">
					<view v-if="unloadingFlag && !showSearchBar" class="unloading-dont-show-search-bar-top">
						<slot name="top">
						</slot>
					</view>
					<view v-else-if="unloadingFlag && showSearchBar" class="unloading-show-search-bar-top">
						<slot name="top">
						</slot>
					</view>
					<!-- <view v-if="unloadingFlag && !showSearchBar" style="width: 100%;height:200rpx;"></view> -->
					<image v-if="!dontShowNoneList" style="margin-top: 60rpx;" src="@/static/null-list.png"></image>
					<view v-if="!dontShowNoneList">
						请扫描或输入集装器号
					</view>
				</view>
			</view>
			<view v-if="dontShowNoneList">
				<view style="height:650rpx;width: 100%;"></view>
			</view>
		</template>
		
		<!-- 如果内容不为空 -->
		<template v-else>
			<view v-if="showList"  class="list">
				<view :class="{playlist: true, 'searchbar-height': showSearchBar, 'show-bottom-info': showBottomInfo}">
					<view :style="{'margin-bottom': isInstalledAudit ? '140rpx' : '10rpx'}">
						<slot name="top">
						</slot>
					</view>
					
					<!-- 如果要加载的列表项没有id -->
					<template v-if="notId">
						<template v-if="removeFlag">
							<uni-swipe-action>
								<uni-swipe-action-item
								  :disabled="swipeStatus"
									 style="margin-top: 20rpx;"
									 v-for="(item, index) in displayList"
									:right-options="swipeOptions"
									:key="item.containerCode"
									@click="removeCard($event, index)">
									<view v-show="item.showItem" class="item" style="margin-top: 0;" @tap="clickCard(item)">
										<!-- 选择框 -->
										<view v-if="selectListFlag" class="item-padding-left">
											<template v-if="item.selected">
												<image class="select" src="@/static/select-green.png"></image>
											</template>
											<template v-else>
												<image class="select" src="@/static/circel-not-selected.png"></image>
											</template>
										</view>
										
										<view class="item-padding-middle" style="padding-top: 15rpx;">
											<slot name="cardIcon" :item="item">
												<template v-if="item.containerType=='0'">
													<image style="height:54rpx;width:54rpx;" src="@/static/box.png"></image>
												</template>
												<template v-else-if="item.containerType=='1'">
													<image style="height:54rpx;width:54rpx;" src="@/static/board.png"></image>
												</template>
												<template v-else>
													<image style="height:54rpx;width:54rpx;" src="@/static/container.png"></image>
												</template>
											</slot>
										</view>
										
										<view class="item-padding-right">
											<slot name="cardRight" :item="item">
											</slot>
										</view>
									</view>
								</uni-swipe-action-item>
							</uni-swipe-action>
						</template>
						<template v-else>
							<block v-for="(item, index) in displayList" :key="index">
								<!-- 卡片 -->
								<view :style="cabinColor(item)" v-show="item.showItem" class="item" @tap="clickCard(item)">
									<!-- 选择框 -->
									<view v-if="selectListFlag" class="item-padding-left">
										<template v-if="item.selected">
											<image class="select" src="@/static/select-green.png"></image>
										</template>
										<template v-else>
											<image class="select" src="@/static/circel-not-selected.png"></image>
										</template>
									</view>
									
									<view class="item-padding-middle" style="padding-top: 15rpx;">
										<slot name="cardIcon" :item="item">
											<template v-if="item.containerType&&item.containerType=='0'">
												<image style="height:54rpx;width:54rpx;" src="@/static/box.png"></image>
											</template>
											<template v-else-if="item.containerType&&item.containerType=='1'">
												<image style="height:54rpx;width:54rpx;" src="@/static/board.png"></image>
											</template>
											<template v-else>
												<image style="height:54rpx;width:54rpx;" src="@/static/container.png"></image>
											</template>
										</slot>
									</view>
									
									<view :class="{'item-padding-right': true}">
										<slot name="cardRight" :item="item">
										</slot>
									</view>
								</view>
								
								<view v-if="item.hasOwnProperty('expandStatus')&&item.expandStatus">
									<block v-for="(row, index) in item.operations" :key="index">
										<view class="expanded" >
											<span>司机名:{{row.dirverName}}</span>
											<span>车数:{{row.num}}车</span>
											<span>交接人:{{row.operator}}</span>
										</view>
									</block>
								</view>
								<view v-if="showSplitLine&&item.splitLine" class="split-line"></view>
							</block>
						</template>
					</template>
					<template v-else>
						<template v-if="removeFlag">
							<uni-swipe-action>
								<uni-swipe-action-item
									 style="margin-top: 20rpx;"
									 v-for="(item, index) in displayList"
									:disabled="swipeStatus"
									:right-options="swipeOptions"
									:key="item.id"
									@click="removeCard($event, index)">
									<view v-show="item.showItem" class="item" style="margin-top: 0;" @click="changeSelectCardStatus(item)">
										<!-- 选择框 -->
										<view v-if="selectListFlag" class="item-padding-left">
											<template v-if="item.selected">
												<image class="select" src="@/static/select-green.png"></image>
											</template>
											<template v-else>
												<image class="select" src="@/static/circel-not-selected.png"></image>
											</template>
										</view>
										
										<view class="item-padding-middle" style="padding-top: 15rpx;">
											<slot name="cardIcon" :item="item">
												<template v-if="item.containerType=='0'">
													<image style="height:54rpx;width:54rpx;" src="@/static/box.png"></image>
												</template>
												<template v-else-if="item.containerType=='1'">
													<image style="height:54rpx;width:54rpx;" src="@/static/board.png"></image>
												</template>
												<template v-else>
													<image style="height:54rpx;width:54rpx;" src="@/static/container.png"></image>
												</template>
											</slot>
										</view>
										
										<view class="item-padding-right">
											<slot name="cardRight" :item="item">
											</slot>
										</view>
									</view>
								</uni-swipe-action-item>
							</uni-swipe-action>
						</template>
						<template v-else>
							<block v-for="item in displayList" :key="item.id">
								<!-- 卡片 -->
								<view
								     v-show="item.showItem"
									  :class="{'item': true}"
										:style="cabinColorWithId(item)"
										@tap="clickCard(item)">
									<!-- 选择框 -->
									<view v-if="selectListFlag" class="item-padding-left">
										<template v-if="item.selected">
											<image class="select" src="@/static/select-green.png"></image>
										</template>
										<template v-else>
											<image class="select" src="@/static/circel-not-selected.png"></image>
										</template>
									</view>
									
									<view class="item-padding-middle" style="padding-top: 15rpx;">
										<slot name="cardIcon" :item="item">
											<template v-if="item.containerType=='0'">
												<image style="height:54rpx;width:54rpx;" src="@/static/box.png"></image>
											</template>
											<template v-else-if="item.containerType=='1'">
												<image style="height:54rpx;width:54rpx;" src="@/static/board.png"></image>
											</template>
											<template v-else>
												<image style="height:54rpx;width:54rpx;" src="@/static/container.png"></image>
											</template>
										</slot>
									</view>
									<view class="item-padding-right">
										<slot name="cardRight" :item="item">
										</slot>
									</view>
								</view>
							</block>
						</template>
					</template>
					
				</view>
			</view>
		</template>
		
		<u-modal
			 v-model="showModal"
			:content="modalContent"
			:show-cancel-button="true"
			@confirm="modalConfirm">
		</u-modal>
		
		<remove-dialog
		 ref="removeDialog"
		@removeContainer="removeContainer">
		</remove-dialog>
	</view>
</template>

<script>
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
	import removeDialog from '@/pages/cargo/remove-dialog.vue'
	import {DIC} from '@/common/dic.js'
	import {
		removeFromBatch,
		removePulldownFromBatch,
		removeCostlyFromBatch,
		removeUnloaderContainer,
		reStoreContainer
	} from '@/api/cargo/index.js'
	export default {
		props: {
			// 内容为空是为false,内容不为空时为true
			contentNotNull: {
				type: Boolean,
				default: false
			},
			// 搜索框是否有显示，不显示为false
			showSearchBar: {
				type: Boolean,
				default: false
			},
			// 是否将航班号和机号相同的集装箱合并起来
			mergeFlag: {
				type: Boolean,
				default: false
			},
			// 有两个值 waitingArea或aircraftArea
			toPlace: {
				type: String,
				default: ''
			},
			// 不可以选择的卡片的状态
			cantSelectStatus: {
				type: String,
				default: ''
			},
			// 是否可以减车
			removeFlag: {
				type: Boolean,
				default: false
			},
			// 如果是从操作记录进入，那么这个就是进入的批次单号
			batchOrderId: {
				type: String,
				default: ''
			},
			// 当前是出港还是进港，出港为D，进港为A
			direction: {
				type: String,
				default: ''
			},
			// 当前所处步骤
			operationType: {
				type: String,
				default: ''
			},
			// 是否是从操作记录进来的
			history: {
				type: Boolean,
				default: false
			},
			notId: {
				type: Boolean,
				default: false
			},
			unloadingFlag: {
				type: Boolean,
				default: false
			},
			// 是否不显示空列表时的图片
			dontShowNoneList: {
				type: Boolean,
				default: false
			},
			// 是否显示分割线
			showSplitLine: {
				type: Boolean,
				default: false
			},
			// 当前步骤是否是拉下确认
			pulldownConfirmFlag: {
				type: Boolean,
				default: false
			},
			showRight: {
				type: Boolean,
				default: true
			},
			monitor: {
				type: Boolean,
				default: false
			},
			costly: {
				type: Boolean,
				default: false
			},
			notLoader: {
				type: Boolean,
				default: true
			},
			// 当前列表组件是否被装机稽核使用
			installedAudit: {
				type: Boolean,
				default: false
			},
			// 是否是在进港的已操作历史单中使用删除
			removeUnloader: {
				type: Boolean,
				default: false
			},
			showBottomInfo: {
				type: Boolean,
				default: false
			},
			// 删除集装器可以还原到上一个步骤
			restore: {
				type: Boolean,
				default: false
			},
      isInstalledAudit: {
        type: Boolean,
        default: false
      }
		},
		components: {
			uniSwipeAction,
			uniSwipeActionItem,
			removeDialog
		},
		data () {
			return {
				// 是否显示列表。当数据视图不同步的时候用来刷新视图
				showList: true,
				// 保存原列表数据
				list: [],
				// 渲染在视图上的列表
				displayList: [],
				// 是否显示列表的选择框
				selectListFlag: false,
				// 刷新列表用
				showListFlag: true,
				swipeOptions: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				// 是否显示提示框
				showModal: false,
				// 提示框内容
				modalContent: '',
				removedCard: {},
				statusBarHeight: 0,
				listContentLayout: {
					'margin-top': -this.statusBarHeight + 'px'
				},
				swipeStatus: false
			}
		},
		mounted () {
			let res = uni.getSystemInfoSync()
			this.statusBarHeight = res.statusBarHeight
		},
		methods: {
			// 舱位的底色
			cabinColor (item) {
					
				if (this.monitor) {
					return {
						'margin-top': '10rpx'
					}
				}
				
				if (this.notLoader && !this.installedAudit) {
					return {
						'background-color': '#ffffff'
					}
				} else if (!this.notLoader && !this.installedAudit) {
					let arr = item.cabin.match(/[a-zA-Z]/g)
					if (arr) {
						// 如果舱位中带字母
						if (arr.length > 1 || arr[0] !== 'H') {
							return {
								'background-color': '#ffffff'
							}
						}
					} else if (item.cabinNum < 0 || item.cabinNum > 5) {
						return {
							'background-color': '#ffffff'
						}
					}
					switch (item.cabinNum) {
						case  1:
						case '1':
							return {
								'background-color': '#ffffff'
							}
						case 2:
						case '2':
							return {
								'background-color': 'rgba(250,173,20,0.2)'
							}
						case 3:
						case '3':
							return {
								'background-color': 'rgba(24,144,255,0.2)'
							}
						case 4:
						case '4':
							return {
								'background-color': 'rgba(255,182,193,0.2)'
							}
						case 5:
						case '5':
							return {
								'background-color': 'rgba(147,112,219,0.2)'
							}
						default:
							return {
								'background-color': '#ffffff'
							}
					}
				} else if (this.installedAudit) {
					// 当前列表组件被装机稽核使用
					if (item.hasOwnProperty('checked') && item.checked) {
						return {
							'background-color': 'rgba(255,255,0,0.2)'
						}
					} else {
						return {
							'background-color': '#ffffff'
						}
					}
				}
			},
			
			cabinColorWithId (item) {
				if (this.installedAudit) {
					// 当前列表组件被装机稽核使用
					if (item.hasOwnProperty('checked') && item.checked) {
						return {
							'margin-top': '10rpx',
							'background-color': 'rgba(255,255,0,0.2)'
						}
					} else {
						return {
							'background-color': '#fff'
						}
					}
				} else {
					return {}
				}
			},
			showSelectFlag () {
				this.selectListFlag = !this.selectListFlag
				this.displayList.forEach(e => e.selected = false)
			},
			// 让所有卡片都显示出选择框
			showSelectFlagNoChange () {
				this.selectListFlag = true
				this.displayList.forEach(e => e.showSelectFlag = true)
			},
			unshiftToList (arr) {
				this.list = [...arr, ...this.list]
				this.setListNoChange(this.list)
			},
			
			pushToList (arr) {
				this.list = [...this.list, ...arr]
				this.setListNoChange(this.list)
			},
			
			unshiftToListWithChange (arr) {
				this.list = [...arr, ...this.list]
				this.setList(this.list)
			},
			
			refresh () {
				this.showList = false
				// console.log('refresh', this.displayList)
				var that = this
				this.$nextTick(function(){
					that.showList = true
					uni.hideLoading()
				})
			},
			
			// 不用generateObj
			setListNoChange (list) {
				this.displayList = []
				var that = this
				let index = 0
				if (!this.mergeFlag) {
					list.forEach(e => {
						let obj = e
						if (obj.containerTypes.length === 0) {
							obj.containerTypes.push({
								containerCode: obj.containerCode,
								containerType: obj.containerType
							})
						}
						if (e.hasOwnProperty('cargoIrregularRecords') && e.cargoIrregularRecords && e.cargoIrregularRecords.length > 0) {
							e.cargoIrregularRecords.forEach((k) => {
								if (k.pictureUrls) {
									let arr = k.pictureUrls.split(',')
									arr.forEach(v => {
										obj.images.push({
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
						this.displayList.push(obj)
					})
				} else {
					list.forEach(e => {
						let obj = {...e}
						if (obj.containerTypes.length === 0) {
							obj.containerTypes.push({
								containerCode: obj.containerCode,
								containerType: obj.containerType
							})
						}
						let exit = this.displayList.find(v => (v.flight === e.flight) && (v.registration === e.registration))
						if (exit) {
							// 如果在list中发现了同一航班和同一机号的集装器
							exit.containerCode += '/' + e.containerCode
							exit.carNumber += obj.carNumber
							exit.boxNumber += obj.boxNumber
							exit.boardNumber += obj.boardNumber
							exit.containerTypes.push({
								containerCode: obj.containerCode,
								containerType: obj.containerType
							})
							exit.images = [...exit.images, ...obj.images]
							if (this.toPlace === 'waitingArea') {
								e.firstTransportTargetAddr = exit.firstTransportTargetAddr
								this.updateCargoInfo(e)
							} else if (this.toPlace === 'aircraftArea'){
								e.secondTransportTargetAddr = exit.secondTransportTargetAddr
								this.updateCargoInfo(e)
							} else if (this.toPlace === 'cargoStation'){
								e.secondTransportTargetAddr = exit.secondTransportTargetAddr
								this.updateCargoInfo(e)
							}
						} else {
							obj.showItem = false
							obj.showItem = true
							that.displayList.push(obj)
						}
					})
					this.displayList.forEach(e => {
						e.showItem = false
					})
					setTimeout(function () {
						that.displayList.forEach(e => {
							e.showItem = true
						})
					},1)
				}
				this.refresh()
			},
			
			setCostlyListNoChange (list) {
				this.displayList = []
				var that = this
				let index = 0
				if (!this.mergeFlag) {
					list.forEach(e => {
						let obj = e
						this.displayList.push(obj)
					})
				}
				this.refresh()
			},
			
			setList (list) {
				this.list = [...list]
				this.displayList = []
				var that = this
				let index = 0
				if (!this.mergeFlag) {
					this.list.forEach((e, idx, arr1) => {
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
						obj.containerTypes.push({
							containerCode: obj.containerCode,
							containerType: obj.containerType
						})
						if (e.hasOwnProperty('cargoIrregularRecords') && e.cargoIrregularRecords && e.cargoIrregularRecords.length > 0) {
							e.cargoIrregularRecords.forEach((k) => {
								if (k.pictureUrls) {
									let arr = k.pictureUrls.split(',')
									arr.forEach(v => {
										obj.images.push({
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
						this.displayList.push(obj)
						arr1[idx] = {...obj}
					})
				} else {
					this.list.forEach((e, idx, arr1) => {
						let obj = this.generateObj(e)
						if (obj.hasOwnProperty('containerType') && obj.containerType) {
							if (obj.containerType === '0') {
								obj.boxNumber++
							} else if (obj.containerType === '1') {
								obj.boardNumber++
							} else if (obj.containerType === '2') {
								obj.carNumber++
							}
							obj.containerTypes.push({
								containerCode: obj.containerCode,
								containerType: obj.containerType
							})
						}
						if (e.cargoIrregularRecords && e.cargoIrregularRecords.length > 0) {
							e.cargoIrregularRecords.forEach((k) => {
								let arr = k.pictureUrls.split(',')
								arr.forEach(v => {
									obj.images.push({
										id: k.id,
										name: 'image' + index++,
										uri: v,
										url: v,
										show: true
									})
								})
							})
						}
						arr1[idx] = {...obj}
						let exit = this.displayList.find(v => (v.flight === e.flight) && (v.registration === e.registration))
						if (exit) {
							// 如果在list中发现了同一航班和同一机号的集装器
							exit.containerCode += '/' + e.containerCode
							exit.carNumber += obj.carNumber
							exit.boxNumber += obj.boxNumber
							exit.boardNumber += obj.boardNumber
							if (obj.hasOwnProperty('containerType') && obj.containerType) {
								exit.containerTypes.push({
									containerCode: obj.containerCode,
									containerType: obj.containerType
								})
							}
							exit.images = [...exit.images, ...obj.images]
							if (this.toPlace === 'waitingArea') {
								e.firstTransportTargetAddr = exit.firstTransportTargetAddr
								this.updateCargoInfo(e)
							} else if (this.toPlace === 'aircraftArea'){
								e.secondTransportTargetAddr = exit.secondTransportTargetAddr
								this.updateCargoInfo(e)
							} else if (this.toPlace === 'cargoStation'){
								e.secondTransportTargetAddr = exit.secondTransportTargetAddr
								this.updateCargoInfo(e)
							}
						} else {
							obj.showItem = false
							obj.showItem = true
							that.displayList.push(obj)
						}
					})
					this.displayList.forEach(e => {
						e.showItem = false
					})
					setTimeout(function () {
						that.displayList.forEach(e => {
							e.showItem = true
						})
					},1)
				}
				this.refresh()
			},
			
			setCostlyList (list) {
				this.list = [...list]
				this.displayList = []
				var that = this
				let index = 0
				this.list.forEach((e, idx, arr1) => {
					let obj = this.generateObj2(e)
					if (e.hasOwnProperty('specialCargoRecords') && e.specialCargoRecords && e.specialCargoRecords.length > 0) {
						e.specialCargoRecords.forEach((k) => {
							if (k.pictureUrls) {
								let arr = k.pictureUrls.split(',')
								arr.forEach(v => {
									obj.images.push({
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
					this.displayList.push(obj)
					arr1[idx] = {...obj}
				})
				this.refresh()
			},
			
			setMonitorList (list) {
				this.list = [...list]
				this.displayList = []
				var that = this
				let index = 0
				if (!this.mergeFlag) {
					this.list.forEach((e) => {
						e.showItem = true
						this.displayList.push(e)
					})
				}
				this.refresh()
			},
			
			setListWithImage (list) {
				this.list = [...list]
				this.displayList = []
				var that = this
				let index = 0
				if (!this.mergeFlag) {
					this.list.forEach((e, idx, arr1) => {
						let obj = this.generateObj2(e)
						obj.containerTypes.push({
							containerCode: obj.containerCode,
							containerType: obj.containerType
						})
						if (e.cargoIrregularRecords && e.cargoIrregularRecords.length > 0) {
							e.cargoIrregularRecords.forEach((k) => {
								if (k.pictureUrls) {
									let arr = k.pictureUrls.split(',')
									arr.forEach(v => {
										obj.images.push({
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
						this.displayList.push(obj)
						arr1[idx] = {...obj}
					})
				} else {
					this.list.forEach((e, idx, arr1) => {
						let obj = this.generateObj2(e)
						e.cargoIrregularRecords.forEach((k) => {
							let arr = k.pictureUrls.split(',')
							arr.forEach(v => {
								obj.images.push({
									id: k.id,
									name: 'image' + index++,
									uri: v,
									url: v,
									show: true
								})
							})
						})
						obj.containerTypes.push({
							containerCode: obj.containerCode,
							containerType: obj.containerType
						})
						arr1[idx] = {...obj}
						let exit = this.displayList.find(v => (v.flight === e.flight) && (v.registration === e.registration))
						if (exit) {
							// 如果在list中发现了同一航班和同一机号的集装器
							exit.containerCode += '/' + e.containerCode
							exit.carNumber += obj.carNumber
							exit.boxNumber += obj.boxNumber
							exit.boardNumber += obj.boardNumber
							exit.containerTypes.push({
								containerCode: obj.containerCode,
								containerType: obj.containerType
							})
							exit.images = [...exit.images, ...obj.images]
							if (this.toPlace === 'waitingArea') {
								e.firstTransportTargetAddr = exit.firstTransportTargetAddr
								this.updateCargoInfo(e)
							} else if (this.toPlace === 'aircraftArea'){
								e.secondTransportTargetAddr = exit.secondTransportTargetAddr
								this.updateCargoInfo(e)
							} else if (this.toPlace === 'cargoStation'){
								e.secondTransportTargetAddr = exit.secondTransportTargetAddr
								this.updateCargoInfo(e)
							}
						} else {
							obj.showItem = false
							obj.showItem = true
							that.displayList.push(obj)
						}
					})
					this.displayList.forEach(e => {
						e.showItem = false
					})
					setTimeout(function () {
						that.displayList.forEach(e => {
							e.showItem = true
						})
					},1)
				}
				console.log('setListWithImage', this.displayList)
				this.refresh()
			},
			
			updateCargoInfo (e) {
				this.$emit('updateCargoInfo', e)
			},
			
			changeSelectCardStatus (item) {
				if (this.selectListFlag) {
					if (item.selected) {
						item.selected = false
						this.$emit('noSelectedWarn', this.judgeAtLeastSelected())
						this.$emit('changeBottomSelectAll', this.judgeSelectAll())
					} else {
						item.selected = true
						this.$emit('noSelectedWarn', this.judgeAtLeastSelected())
						this.$emit('changeBottomSelectAll', this.judgeSelectAll())
						// if (this.cantSelectStatus === '' || !this.judgeArrived(item)) {
						// 	item.selected = true
						// 	this.$emit('noSelectedWarn', true)
						// 	this.$emit('changeBottomSelectAll', this.judgeSelectAll())
						// }
					}
				}
			},
			
			// 如果当前状态在到达状态之前则未到达，否则就是已到达
			judgeArrived (item) {
				let arrivedCondition = this.cantSelectStatus
				if (this.direction === 'D') {
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
				} else {
					let arrivedIndex = DIC.CARGOSTATUSA.findIndex(e => e === arrivedCondition)
					if (arrivedIndex > -1) {
						let itemIndex = DIC.CARGOSTATUSA.findIndex(e => e === item.status)
						if (itemIndex > -1) {
							if (itemIndex < arrivedIndex) {
								return false
							} else {
								return true
							}
						}
					}
				}
			},
			
			judgeAllArrived () {
				let arr = this.displayList.filter(e => !this.judgeArrived(e))
				if (arr.length === 0) {
					this.$emit('completedArrived', true)
				} else {
					this.$emit('completedArrived', false)
				}
			},
			
			selectAll () {
				var that = this
				this.selectListFlag = true
				this.displayList.forEach(e => {
					e.showSelectFlag = true
					e.selected = true
				})
				this.showList = false
				this.$nextTick(function(){
					that.showList = true
				})
			},
			
			// 按状态全选
			selectAllByStatus (status) {
				var that = this
				this.selectListFlag = true
				this.displayList.forEach(e => {
					e.showSelectFlag = true
					if (!this.judgeArrived(e)) {
						e.selected = true
					}
				})
				this.showList = false
				setTimeout(function () {
					that.showList = true
				})
				this.$forceUpdate()
			},
			cancelSelectAll () {
				this.selectListFlag = true
				this.displayList.forEach(e => {
					e.selected = false
					e.showSelectFlag = true
				})
				this.showList = false
				this.showList = true
			},
			
			generateObj (obj) {
				return {
					images2: [],
					selectedPicNums: 0,
					showItem: true,
					selected: false,
					pass: false,
					...obj,
					carNumber: 0,
					boxNumber: 0,
					boardNumber: 0,
					containerTypes: [],
					images: [],
					images3:[],
					showSelectFlag: false
				}
			},
			
			generateObj2 (obj) {
				return {
					images2: [],
					selectedPicNums: 0,
					carNumber: 1,
					showItem: true,
					selected: false,
					pass: false,
					images: [],
					images3:[],
					...obj,
					carNumber: 0,
					boxNumber: 0,
					boardNumber: 0,
					containerTypes: [],
					showSelectFlag: false
				}
			},
			
			// 判断是否出现选择框
			judgeSelectListFlag () {
				return this.selectListFlag
			},
			// 判断是否有选中至少一个卡片
			judgeAtLeastSelected (status) {
				if (!status) {
					if (this.displayList.find(e => e.selected === true)) {
						// 如果至少有一个，就返回true
						return true
					} else {
						// 如果一个也没选中，就返回false
						return false
					}
				} else {
					let arr = this.displayList.filter(e => !this.judgeArrived(e))
					if (arr.length === 0) {
						return false
					} else {
						if (this.displayList.find(e => e.selected === true)) {
							// 如果至少有一个，就返回true
							return true
						} else {
							// 如果一个也没选中，就返回false
							return false
						}
					}
				}
			},
			
			// 判断是否尽可能全选了
			judgeSelectAll () {
				// 可以选择的卡片
				// let arr = this.displayList.filter(e => !this.judgeArrived(e))
				let arr = this.displayList.filter(e =>  !e.selected)
				if (arr.length < 1) {
					// 已经没有可以选择的卡片了
					return true
				} else {
					return false
				}
				return false
				// if (arr.length < 0) {
				// 	// 已经没有可以选择的卡片了
				// 	return false
				// } else {
				// 	if (!arr.find(e => e.selected === true)) {
				// 		// 如果没有一个选项被选
				// 		return false
				// 	} else if (!arr.find(e => e.selected !== true)){
				// 		// 如果全选了
				// 		return true
				// 	}
				// }
				// return false
			},
			
			getNumOfNotSelected () {
				this.list.forEach(e => e.selected = false)
				this.displayList.forEach(e => {
					if (e.selected === true) {
						this.list.forEach((v, idx, arr) => {
							if (e.flight === v.flight && e.registration === v.registration) {
								arr[idx].selected1 = true
							}
						})
					}
				})
				return this.list.filter(v => v.selected1 !== true).length
			},
			
			// 获取选中的行
			getSelections () {
				this.displayList.forEach(e => {
					if (e.selected === true) {
						if (this.mergeFlag) {
							this.list.forEach((v, idx, arr) => {
								if (e.flight === v.flight && e.registration === v.registration) {
									arr[idx].selected1 = true
								}
							})
						} else {
							this.list.forEach((v, idx, arr) => {
								if (e.containerCode === v.containerCode) {
									arr[idx].selected1 = true
								}
							})
						}
					}
				})
				return this.list.filter(v => v.selected1 === true)
			},
			// getSelections () {
			// 	this.displayList.forEach(e => {
			// 		if (e.selected === true) {
			// 			if (this.mergeFlag) {
			// 				this.list.forEach((v, idx, arr) => {
			// 					if (e.flight === v.flight && e.registration === v.registration) {
			// 						arr[idx].selected = true
			// 					}
			// 				})
			// 			} else {
			// 				this.list.forEach((v, idx, arr) => {
			// 					if (e.containerCode === v.containerCode) {
			// 						arr[idx].selected = true
			// 					}
			// 				})
			// 			}
			// 		}
			// 	})
			// 	return this.list.filter(v => v.selected === true)
			// },
			
			getSelectionsNoMerge () {
				let list = this.displayList.filter(e => e.selected === true)
				return list
			},
			
			getList () {
				return this.list
			},
			
			getDisplayList () {
				return this.displayList
			},
			
			// 上传图片
			uploadImage (item) {
				this.$emit('uploadImage', item)
			},
			
			pushToFlightList (list) {
				this.list = [...this.list, ...list]
				list.forEach((e, idx, arr1) => {
					let obj = this.generateObj(e)
					this.displayList.push(obj)
				})
			},
			
      setOutStockFlightList (list) {
        var that = this
        this.displayList = []
        this.showList = false
        this.$forceUpdate()
        this.list = [...list]
        this.displayList = list.map(e => {
          return {
            ...this.generateObj(e)
          }
        })
        setTimeout(function () {
          that.showList = true
          that.$forceUpdate()
        }, 300)
        this.$forceUpdate()
      },
      
			setFlightList (list) {
				this.list = [...list]
				this.displayList = []
				var that = this
				let index = 0
				if (!this.mergeFlag) {
					this.list.forEach((e, idx, arr1) => {
						let obj = this.generateObj(e)
						this.displayList.push(obj)
						arr1[idx] = {...obj}
					})
				} else {
					this.list.forEach((e, idx, arr1) => {
						let obj = this.generateObj(e)
						arr1[idx] = {...obj}
						let exit = this.displayList.find(v => (v.flight === e.flight) && (v.registration === e.registration))
						if (exit) {
							// 如果在list中发现了同一航班和同一机号的集装器
							exit.containerCode += '/' + e.containerCode
							exit.carNumber += obj.carNumber
							exit.boxNumber += obj.boxNumber
							exit.boardNumber += obj.boardNumber
							exit.images = [...exit.images, ...obj.images]
							if (this.toPlace === 'waitingArea') {
								e.firstTransportTargetAddr = exit.firstTransportTargetAddr
								this.updateCargoInfo(e)
							} else if (this.toPlace === 'aircraftArea'){
								e.secondTransportTargetAddr = exit.secondTransportTargetAddr
								this.updateCargoInfo(e)
							} else if (this.toPlace === 'cargoStation'){
								e.secondTransportTargetAddr = exit.secondTransportTargetAddr
								this.updateCargoInfo(e)
							}
						} else {
							obj.showItem = false
							var that = this
							obj.showItem = true
							that.displayList.push(obj)
						}
					})
					this.displayList.forEach(e => {
						e.showItem = false
					})
					setTimeout(function () {
						that.displayList.forEach(e => {
							e.showItem = true
						})
					},1)
				}
        this.$forceUpdate()
				setTimeout(function () {
					uni.hideLoading()
				}, 500)
			},
			
			
			removeContainer (item) {
				this.removedCard = {...item}
				if (!this.history) {
					let index = -1
					for (let i = 0; i < this.list.length; i++) {
						let e = this.list[i]
						if (e.id === item.id) {
							index = i
							break
						}
					}
					if (index > -1) {
						this.list.splice(index, 1)
						// 更新父组件List
						this.$emit('updateList', this.list)
						this.setList(this.list)
						this.$refs.removeDialog.removeRow(item)
					}
				} else {
					let list = []
					let removeStorageFlag = false
					if (this.operationType === 'TOSTATION_STEVEDORING') {
						// 进港 交接运往货站
						list = uni.getStorageSync('arrivedEnterStation')
					} else if (this.direction === 'A' && this.operationType === 'TOWAITINGAREA_STEVEDORING') {
						// 进港 交接运往待运区
						list = uni.getStorageSync('arrivedEnterWaitingArea')
					} else if (this.direction === 'D' && this.operationType === 'TOWAITINGAREA_STEVEDORING') {
						// 出港 交接运往待运区
						list = uni.getStorageSync('arrivedLeaveWaitingArea')
					} else if (this.operationType === 'TOAIRCRAFT_STEVEDORING') {
						// 进港 交接运往机位
						list = uni.getStorageSync('arrivedLeaveAircraft')
					} 
					
					if (list && list.length !== 0) {
						for (let i = 0; i < this.list.length; i++) {
							if (list.find(e => e.containerCode === this.list[i].containerCode)) {
								// 说明同一个步骤的拖车司机缓存的数据正是当前操作的历史批次
								removeStorageFlag = true
								break
							}
						}
					}
					
					console.log('remove-container-obj', {
						direction: this.direction,
						operationType: this.operationType,
						batchOrderId: this.batchOrderId,
						id: this.removedCard.id
					})
					let removeFromBatch1 = null
					if (this.costly) {
						removeFromBatch1 = removeCostlyFromBatch
					} else {
						removeFromBatch1 = this.direction === 'PULL' ? removePulldownFromBatch : removeFromBatch
					}
					removeFromBatch1({
						direction: this.direction,
						operationType: this.operationType,
						batchOrderId: this.batchOrderId,
						id: this.removedCard.id,
						uld: this.removedCard.containerCode
					}).then(res => {
						console.log('removeContainer', res)
						if (res.status) {
							let index = -1
							for (let i = 0; i < this.list.length; i++) {
								let e = this.list[i]
								if (e.id === this.removedCard.id) {
									index = i
									break
								}
							}
							this.list.splice(index, 1)
							this.$emit('updateList', this.list)
							this.setList(this.list)
							this.$refs.removeDialog.removeRow(item)
							if (removeStorageFlag) {
								if (this.operationType === 'TOSTATION_STEVEDORING') {
									// 进港 交接运往货站
									uni.setStorageSync('arrivedEnterStation', this.list)
								} else if (this.direction === 'A' && this.operationType === 'TOWAITINGAREA_STEVEDORING') {
									// 进港 交接运往待运区
									uni.setStorageSync('arrivedEnterWaitingArea', this.list)
								} else if (this.direction === 'D' && this.operationType === 'TOWAITINGAREA_STEVEDORING') {
									// 出港 交接运往待运区
									uni.setStorageSync('arrivedLeaveWaitingArea', this.list)
								} else if (this.operationType === 'TOAIRCRAFT_STEVEDORING') {
									// 进港 交接运往机位
									uni.setStorageSync('arrivedLeaveAircraft', this.list)
								}
							}
						} else {
							this.$message(res.message)
						}
					})
				}
			},
			
			clickCard (e) {
				if (e.hasOwnProperty('expandStatus')) {
					if (!e.expandStatus) {
						e.expandStatus = true
					} else {
						e.expandStatus = false
					}
					this.$emit('clickCard', e)
				} else if (this.selectListFlag) {
					this.changeSelectCardStatus(e)
				} else {
					this.$emit('clickCard', e)
				}
			},
			removeCard (content, index) {
				this.removedCard = this.displayList[index]
				if (this.removeUnloader && this.removedCard.status === 'UNLOADER') {
					let idx = this.list.findIndex(e => e.id === this.removedCard.id)
					
					if (idx > -1) {
						console.log('只有一个', this.list[idx])
						removeUnloaderContainer({
						  id: this.list[idx].id
						}).then(res => {
							console.log('removeUnloaderContainer', res)
							this.$message(res.message)
							uni.hideLoading()
						}).catch(err => {
							onError(err)
						})
						this.list.splice(idx, 1)
						// 更新父组件List
						console.log('this.list', this.list)
						this.$emit('updateList', this.list)
						this.setList(this.list)
					}
					return
				}
				
				// 如果是出港-货站出库/装卸接收需要删除集装器还原到上一步的状态
				if (this.restore && (this.removedCard.status === 'OUTOFSTOCK' || this.removedCard.status === 'RECEIVED')) {
					let idx = this.list.findIndex(e => e.id === this.removedCard.id)
					
					if (idx > -1) {
						console.log('只有一个', this.list[idx])
						reStoreContainer({
						  cargoId: this.list[idx].id,
							operationType: this.operationType
						}).then(res => {
							console.log('reStoreContainer', res)
							if (res.status) {
								this.list.splice(idx, 1)
								// 更新父组件List
								console.log('this.list', this.list)
								this.$emit('updateList', this.list)
								this.setList(this.list)
							}
							this.$message(res.message)
							uni.hideLoading()
						}).catch(err => {
							onError(err)
						})
					}
					return
				}
				
				// 如果不是从操作记录进入的
				if (!this.history) {
					// 如果要删除的多于一个
					let arr = this.list.filter(e => e.flight === this.removedCard.flight && e.registration === this.removedCard.registration)
					if (this.mergeFlag && arr.length > 1) {
						console.log('openRemoveDialog-0127', arr)
						this.$refs.removeDialog.open(arr)
						return
					}
					
					// 如果要删除的只有一个
					let idx = this.list.findIndex(e => e.containerCode === this.removedCard.containerCode)
					if (idx > -1) {
						console.log('只有一个', this.list[idx])
						this.list.splice(idx, 1)
						// 更新父组件List
						console.log('this.list', this.list)
						this.$emit('updateList', this.list)
						this.setList(this.list)
					}
					return
				}
				
				let list = []
				let removeStorageFlag = false
				if (this.operationType === 'TOSTATION_STEVEDORING') {
					// 进港 交接运往货站
					list = uni.getStorageSync('arrivedEnterStation')
				} else if (this.direction === 'A' && this.operationType === 'TOWAITINGAREA_STEVEDORING') {
					// 进港 交接运往待运区
					list = uni.getStorageSync('arrivedEnterWaitingArea')
				} else if (this.direction === 'D' && this.operationType === 'TOWAITINGAREA_STEVEDORING') {
					// 出港 交接运往待运区
					list = uni.getStorageSync('arrivedLeaveWaitingArea')
				} else if (this.operationType === 'TOAIRCRAFT_STEVEDORING') {
					// 进港 交接运往机位
					list = uni.getStorageSync('arrivedLeaveAircraft')
				} 
				
				if (list && list.length !== 0) {
					for (let i = 0; i < this.list.length; i++) {
						if (list.find(e => e.containerCode === this.list[i].containerCode)) {
							// 说明同一个步骤的拖车司机缓存的数据正是当前操作的历史批次
							removeStorageFlag = true
							break
						}
					}
				}
				
				if (this.list.length === 1) {
					this.showModal = true
					this.modalContent = '删除最后一条后将删除该批次'
				} else {
					// 删除该元素
					// 如果被删除的元素id不为空
					let arr = this.list.filter(e => e.flight === this.removedCard.flight && e.registration === this.removedCard.registration)
					if (this.mergeFlag && arr.length > 1) {
						this.$refs.removeDialog.open(arr)
						return
					}
					
					if (this.removedCard.id) {
						let removeFromBatch1 = null
						if (this.costly) {
							removeFromBatch1 = removeCostlyFromBatch
						} else {
							removeFromBatch1 = this.direction === 'PULL' ? removePulldownFromBatch : removeFromBatch
						}
						removeFromBatch1({
							direction: this.direction,
							operationType: this.operationType,
							batchOrderId: this.batchOrderId,
							id: this.removedCard.id,
							uld: this.removedCard.containerCode
						}).then(res => {
							console.log('delete-res', res)
							if (res.status) {
								let index = -1
								for (let i = 0; i < this.list.length; i++) {
									let e = this.list[i]
									if (e.id === this.removedCard.id) {
										index = i
										break
									}
								}
								this.list.splice(index, 1)
								this.$emit('updateList', this.list)
								this.setList(this.list)
								if (removeStorageFlag) {
									if (this.operationType === 'TOSTATION_STEVEDORING') {
										// 进港 交接运往货站
										uni.setStorageSync('arrivedEnterStation', this.list)
									} else if (this.direction === 'A' && this.operationType === 'TOWAITINGAREA_STEVEDORING') {
										// 进港 交接运往待运区
										uni.setStorageSync('arrivedEnterWaitingArea', this.list)
									} else if (this.direction === 'D' && this.operationType === 'TOWAITINGAREA_STEVEDORING') {
										// 出港 交接运往待运区
										uni.setStorageSync('arrivedLeaveWaitingArea', this.list)
									} else if (this.operationType === 'TOAIRCRAFT_STEVEDORING') {
										// 进港 交接运往机位
										uni.setStorageSync('arrivedLeaveAircraft', this.list)
									}
								}
							} else {
								this.$message(res.message)
							}
						})
					}
				}
			},
			// 点击提示框的确定按钮后触发的事件
			modalConfirm () {
				// 删除该元素
				let list = []
				let removeStorageFlag = false
				if (this.operationType === 'TOSTATION_STEVEDORING') {
					// 进港 交接运往货站
					list = uni.getStorageSync('arrivedEnterStation')
				} else if (this.direction === 'A' && this.operationType === 'TOWAITINGAREA_STEVEDORING') {
					// 进港 交接运往待运区
					list = uni.getStorageSync('arrivedEnterWaitingArea')
				} else if (this.direction === 'D' && this.operationType === 'TOWAITINGAREA_STEVEDORING') {
					// 出港 交接运往待运区
					list = uni.getStorageSync('arrivedLeaveWaitingArea')
				} else if (this.operationType === 'TOAIRCRAFT_STEVEDORING') {
					// 进港 交接运往机位
					list = uni.getStorageSync('arrivedLeaveAircraft')
				} 
				
				if (list && list.length !== 0) {
					for (let i = 0; i < this.list.length; i++) {
						if (list.find(e => e.containerCode === this.list[i].containerCode)) {
							// 说明同一个步骤的拖车司机缓存的数据正是当前操作的历史批次
							removeStorageFlag = true
							break
						}
					}
				}
				if (this.removedCard.id) {
					let removeFromBatch1 = null
					if (this.costly) {
						removeFromBatch1 = removeCostlyFromBatch
					} else {
						removeFromBatch1 = this.direction === 'PULL' ? removePulldownFromBatch : removeFromBatch
					}
					removeFromBatch1({
						direction: this.direction,
						operationType: this.operationType,
						batchOrderId: this.batchOrderId,
						id: this.removedCard.id,
						uld: this.removedCard.containerCode
					}).then(res => {
						if (res.status) {
							let index = -1
							for (let i = 0; i < this.list.length; i++) {
								let e = this.list[i]
								if (e.id === this.removedCard.id) {
									index = i
									break
								}
							}
							this.list.splice(index, 1)
							this.setList(this.list)
							if (removeStorageFlag) {
								if (this.operationType === 'TOSTATION_STEVEDORING') {
									// 进港 交接运往货站
									uni.setStorageSync('arrivedEnterStation', this.list)
								} else if (this.direction === 'A' && this.operationType === 'TOWAITINGAREA_STEVEDORING') {
									// 进港 交接运往待运区
									uni.setStorageSync('arrivedEnterWaitingArea', this.list)
								} else if (this.direction === 'D' && this.operationType === 'TOWAITINGAREA_STEVEDORING') {
									// 出港 交接运往待运区
									uni.setStorageSync('arrivedLeaveWaitingArea', this.list)
								} else if (this.operationType === 'TOAIRCRAFT_STEVEDORING') {
									// 进港 交接运往机位
									uni.setStorageSync('arrivedLeaveAircraft', this.list)
								}
							}
							uni.navigateBack()
						}
					})
				}
			},
			changeSwipeStatus () {
				this.swipeStatus = !this.swipeStatus
			},
			
			changeStatus (flight) {
				let index = flight.id
				let flightNumber = flight.flight
				let status = flight.status
				let number = flight.number
				this.list.find(e => {
					if (e.flight === flightNumber) {
						return e
					}
				}).status = status
				this.displayList.find(e => e.flight === flightNumber).status = status
				this.list.find(e => e.flight === flightNumber).number = number
				this.displayList.find(e => e.flight === flightNumber).number = number
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search-bar-margin-top {
		margin-top: calc(var(--status-bar-height) + 85rpx);
	}
	.content-null {
	 	display: flex;
	 	width: 100%;
	 	height: 60vh;
	 	justify-content: center;
	 	align-items: center;
	 	.list-null-word {
	 		display: flex;
	 		flex-direction: column;
	 		align-items: center;
	 		
	 		margin: 0 auto;
	 		font-family: SourceHanSansSC-Regular;
	 		font-size: 28rpx;
	 		letter-spacing: 1rpx;
	 		color: #a6a6a6;
	 		
	 		image {
	 			width: 145rpx;
	 			height: 95rpx;
	 		}
	 	}
	}
	
	.list {
		width: 100vw;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-bottom: 120rpx;
		
		.searchbar-height {
			padding-top: 10rpx;
			overflow-y: auto;
		}
		
		.unloading-height {
			padding-top: 230rpx;
		}
		.playlist {
			min-height: 500rpx;
			overflow-y: auto;
      overflow-x: hidden;
		}
		.show-bottom-info {
			padding-bottom: 100rpx;
		}
		.item-show-right {
			width: 300rpx !important;
		}
		.item {
			margin-top: 10rpx;
			display: flex;
			align-items: center;
			width: calc(100vw - 40rpx);
			margin-top: 22rpx;
			background-color: #ffffff;
			padding: 21rpx 13rpx 0 10rpx;
			.item-padding-left {
				margin-right: 10rpx;
				.select {
					height: 35rpx;
					width: 35rpx;
				}
			}
			.item-padding-middle {
				align-self: flex-start;
				margin-right: 17rpx;
				image {
					height: 54rpx;
					width: 54rpx;
				}
			}
			.item-padding-right {
				width: 100%;
			}
		}
	}
	
	.split-line {
		width: 100%;
		height: 10rpx;
		background-color: #4191EA;
		margin-top: 10rpx;
	}
	.upload-image {
			width: 46rpx;
			height: 90rpx;
			line-height: 44rpx;
			border: solid 1rpx #e5e5e5;
			border-radius: 22rpx;
			font-family: SourceHanSansSC-Regular;
			font-size: 26rpx;
			letter-spacing: 1rpx;
			color: #8c8c8c;
			text-align: center;
		}
	.expanded {
		padding-top: 20rpx;
		padding-bottom: 20rpx;
		border-top: 2rpx solid black;
		background-color: #ffffff;
		display: flex;
		justify-content: space-around;
		span {
			margin-right: 15rpx;
		}
	}
	.abnormal-red {
		background-color: red;
	}
	.unloading-dont-show-search-bar-top {
		position: fixed;
		top: calc(var(--status-bar-height) + 208rpx) ;
	}
	.unloading-show-search-bar-top {
		position: fixed;
		top: calc(var(--status-bar-height) + 283rpx) ;
	}
</style>

<template>
	<view :class="{'search-bar-margin-top': showSearchBar}">
		<!-- 如果内容为空 -->
		<template v-if="!contentNotNull">
			<view v-if="!dontShowNoneList" class="content-null">
				<view class="list-null-word">
					<view v-if="unloadingFlag && !showSearchBar" style="position: fixed; top: 250rpx;">
						<slot name="top">
						</slot>
					</view>
					<view v-else-if="unloadingFlag && showSearchBar" style="position: fixed; top: 330rpx;">
						<slot name="top">
						</slot>
					</view>
					<view v-if="unloadingFlag && !showSearchBar" style="width: 100%;height:200rpx;"></view>
					<image style="margin-top: 60rpx;" src="@/static/null-list.png"></image>
					<view>
						请扫描或输入集装器号
					</view>
				</view>
			</view>
			<view v-else>
				<view style="height:650rpx;width: 100%;"></view>
			</view>
		</template>
		
		<!-- 如果内容不为空 -->
		<template v-else>
			<view v-if="showList"  class="list">
				<view :class="{playlist: true, 'searchbar-height': showSearchBar}">
					<view style="margin-bottom:10rpx;">
						<slot name="top">
						</slot>
					</view>
					
					<template v-if="notId">
						<template v-if="!removeFlag">
							<block v-for="(item, index) in displayList" :key="index">
								<!-- 卡片 -->
								<template v-if="item.type=='empty'">
									<view class="item">
										<!-- 选择框 -->
										<view :class="{'item-padding-right': true}">
											<empty-card></empty-card>
										</view>
									</view>
								</template>
								<template v-else>
									<view :style="cabinColor(item)" v-show="item.showItem" class="item">
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
								</template>
							</block>
						</template>
					</template>
				</view>
			</view>
		</template>
		
		<!-- <u-modal
			 v-model="showModal"
			:content="modalContent"
			:show-cancel-button="true"
			@confirm="modalConfirm">
		</u-modal> -->
	</view>
</template>

<script>
	import {DIC} from '@/common/dic.js'
	import emptyCard from '@/pages/cargo/leaveport/components/cabin-empty-card-load.vue'
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
			// 是否可以减车
			removeFlag: {
				type: Boolean,
				default: false
			},
			// 当前是出港还是进港，出港为D，进港为A
			direction: {
				type: String,
				default: ''
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
			notLoader: {
				type: Boolean,
				default: true
			}
		},
		components: {
			emptyCard
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
				// 是否显示提示框
				showModal: false,
				// 提示框内容
				modalContent: '',
				statusBarHeight: 0
			}
		},
		mounted () {
			let res = uni.getSystemInfoSync()
			this.statusBarHeight = res.statusBarHeight
		},
		methods: {
			cabinColor (item) {
				if (this.notLoader) {
					return {
						'background-color': '#ffffff'
					}
				}
				if (item.change) {
					if (item.changeBefore) {
						return {
							'background-color': 'rgba(232,86,86,0.2)'
						}
					} else if (item.changeAfter) {
						return {
							'background-color': 'rgba(82,196,26,0.2)'
						}
					}
				}
				return {
					'background-color': '#ffffff'
				}
			},
			
			refresh () {
				this.showList = false
				var that = this
				this.$nextTick(function(){
					that.showList = true
					console.log('refresh', this.displayList)
					uni.hideLoading()
				})
			},
			setList (list) {
				this.list = [...list]
				this.displayList = []
				var that = this
				let index = 0
				if (!this.mergeFlag) {
					console.log('notMergeFlag', this.list)
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
			updateCargoInfo (e) {
				this.$emit('updateCargoInfo', e)
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
					showSelectFlag: false
				}
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
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-bottom: 120rpx;
		width: 100%;
		.searchbar-height {
			padding-top: 10rpx;
			overflow-y: auto;
		}
		.playlist {
			width: 100%;
			min-height: 400rpx;
			overflow-y: auto;
		}
		.item {
			margin-top: 10rpx;
			display: flex;
			align-items: center;
			width: 100%;
			height: 166rpx;
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
</style>

<template>
	<view>
		<!-- 如果没有内容 -->
		<template v-if="!contentNotNull">
			<u-navbar class="navbar"
			 :background="navBackground"
			 :border-bottom="false"
			 back-icon-color="#ffffff"
			 back-icon-size="50">
				<view class="title">
					{{title}}
				</view>
			</u-navbar>
		</template>
		<!-- 如果有内容 -->
		<template v-else>
			<u-navbar class="navbar"
			:height="60"
			back-icon-size="50"
			 :background="navBackground"
			 :border-bottom="false"
			 back-icon-color="#ffffff">
				<view class="title">
					<view>
						{{title}}
						<span v-if="flightInfo.executionDate">
							/{{flightInfo.executionDate}}
						</span>
					</view>
					<view v-if="flightInfo.aircraftType&&flightInfo.registration" style="font-size: 30rpx;">
						
						{{flightInfo.aircraftType}}/{{flightInfo.registration}}/{{depTime}}
					</view>
				</view>
				<slot name="right">
					<view slot="right" v-if="history">
						<view class="operation-list">
							
							<template v-if="isDriver">
								<view :class="{'item': true, distance: isDriver, 'right': !isDriver}" style="margin-left: 20rpx;">
									<image style="width:43rpx;height:42rpx;" src="@/static/waste-bin.png" @tap="deleteList"></image>
								</view>
							</template>
							
							<template v-if="showOperationHistory">
								<view :class="{'item': true, 'right': showOperationHistory}" @tap="openOperaionHistory">
									<image style="width:43rpx;height:42rpx;" src="@/static/operation-history.png"></image>
								</view>
							</template>
							
							<template v-if="showSort">
								<view :class="{'item': true, distance: showOperationHistory, 'right': !showOperationHistory}">
									<image style="width:43rpx;height:42rpx;" src="@/static/sort-cargo-sm.png" @tap="showSelectFlag"></image>
								</view>
							</template>
							
							<view :class="{'item': true, distance: showOperationHistory||showSort, 'right': !showOperationHistory&&!showSort}">
								<image style="width:30rpx;height:44rpx;" src="@/static/input-cargo-sm.png" @tap="changeSearchBarStatus"></image>
							</view>
							
							<template v-if="isComparison">
								<view :class="{'item': true, distance: isDriver, 'right': !isDriver}" style="margin-left: 20rpx;">
									<image style="width:44rpx;height:44rpx;" src="@/static/comparison.png" @tap="comparison"></image>
								</view>
							</template>
							
							<template v-if="isComparison">
								<view :class="{'item': true, distance: isDriver}" style="margin-left: 20rpx;">
									<image style="width:44rpx;height:44rpx;" src="@/static/refresh.png" @tap="getVersions"></image>
								</view>
							</template>
							
							<view v-if="showScan" class="item distance">
								<image style="width:42rpx;height:42rpx;" src="@/static/scan-cargo-sm.png" @tap="scanCode"></image>
							</view>
						</view>
					</view>
				</slot>
				
			</u-navbar>
		</template>
		
		<!-- 如果无内容 -->
		<template v-if="!contentNotNull">
			<!-- 不显示搜索框 -->
			<template v-if="!showSearchBar">
				<view class="operation" style="margin-top: -1rpx;padding-top:1rpx"  v-if="history">
					<view class="item left">
						<image style="width:51rpx;height:53rpx;" src="@/static/scan-cargo-lg.png" @tap="scanCode"></image>
						<view class="font">扫一扫</view>
					</view>
					
					<view :class="{'item': true, 'right': !showOperationHistory&&!showSort}">
						<image style="width:37rpx;height:53rpx;" src="@/static/input-cargo-lg.png" @tap="changeSearchBarStatus"></image>
						<view class="font">输入</view>
					</view>
					
					<template v-if="showSort">
						<view :class="{'item': true, 'right': !showOperationHistory}">
							<image style="width:54rpx;height:53rpx;" src="@/static/sort-cargo-lg.png" @tap="showSelectFlag"></image>
							<view class="font">选择</view>
						</view>
					</template>
					
					<template v-if="showOperationHistory">
						<view :class="{'item': true, 'right': showOperationHistory}" @tap="openOperaionHistory">
							<image style="width:54rpx;height:53rpx;" src="@/static/operation-history.png"></image>
							<view class="font">操作记录</view>
						</view>
					</template>
				</view>
			</template>
			<!-- 显示搜索框 -->
			<template v-else>
				<view class="operation-search" style="margin-top: -1rpx;padding-top:1rpx">
					<view class="operation-above-search" v-if="history">
						<template v-if="showOperationHistory">
							<view :class="{'item': true, 'right': showOperationHistory}" @tap="openOperaionHistory">
								<image style="width:43rpx;height:42rpx;" src="@/static/operation-history.png"></image>
							</view>
						</template>
						
						<template v-if="showSort">
							<view :class="{'item': true, distance: showOperationHistory, 'right': !showOperationHistory}">
								<image style="width:43rpx;height:42rpx;" src="@/static/sort-cargo-sm.png" @tap="showSelectFlag"></image>
							</view>
						</template>
						
						<view :class="{'item': true, distance: showOperationHistory||showSort, 'right': !showOperationHistory&&!showSort}">
							<image style="width:30rpx;height:44rpx;" src="@/static/input-cargo-sm.png" @tap="changeSearchBarStatus"></image>
						</view>
						
						<view v-if="showScan" class="item distance">
							<image style="width:42rpx;height:42rpx;" src="@/static/scan-cargo-sm.png" @tap="scanCode"></image>
						</view>
					</view>
					
					<view class="search" v-if="history">
						<view class="search-input">
							<input @input="inputSearch" confirm-type="search" @confirm="inputGetCargoInfo" style="width: 92%;" :placeholder="placeHolder" v-model="inputValueInner"/>
							<image v-if="inputValueInner!=''"  style="height:40rpx;width:40rpx;" src="@/static/input-delete-grey.png" @tap="resetInputValue"></image>
						</view>
						<view class="btn" @tap="inputGetCargoInfo">确定</view>
					</view>
				</view>
			</template>
		</template>
		
		<!-- 有内容 -->
		<template v-else>
			<template v-if="showSearchBar&&history">
				<view class="operation" :style="operationMarginTop">
					<view class="search">
						<view class="search-input">
							<input @input="inputSearch" confirm-type="search" @confirm="inputGetCargoInfo" style="width: 92%;" :placeholder="placeHolder" v-model="inputValueInner"/>
							<image v-if="inputValueInner!=''"  style="height:40rpx;width:40rpx;" src="@/static/input-delete-grey.png" @tap="resetInputValue"></image>
						</view>
						<view class="btn" @tap="inputGetCargoInfo">确定</view>
					</view>
				</view>
			</template>
		</template>
	</view>
</template>

<script>
	import { debounce } from '@/common/util/util.js'
	export default {
		props: {
			placeHolder: {
				type: String,
				default: '请输入集装器号'
			},
			// 标题
			title: {
				type: String,
				default: ''
			},
			// 有内容为true，无内容为false
			contentNotNull: {
				type: Boolean,
				default: false
			},
			// 是否显示搜索栏
			showSearchBar: {
				type: Boolean,
				default: false,
			},
			// 搜索框输入值
			inputValue: {
				type: String,
				default: ''
			},
			// 是否显示操作记录
			showOperationHistory: {
				type: Boolean,
				default: false
			},
			// 操作记录跳转时传递的变量
			operationObj: {
				type: Object,
				default: () => {
					return {
						pageName: '',
						direction: '',
						operationType: ''
					}
				}
			},
			showSort: {
				type: Boolean,
				default: false
			},
			// 是否显示导航栏右边的按钮
			history: {
				type: Boolean,
				default: true
			},
			// 是否是从拖车司机过来的
			fromDriver: {
				type: Boolean,
				default: false
			},
			// 显示扫码
			showScan: {
				type: Boolean,
				default: true
			},
			// 是司机
			isDriver: {
				type: Boolean,
				default: false
			},
			isComparison: {
				type: Boolean,
				default: false
			},
			flightInfo: {
				type: Object,
				default: () => {}
			}
		},
		data () {
			return {
				navBackground: {
					'background': '#4191EA'
				},
				inputValueInner: '',
				statusBarHeight: 0,
				operationMarginTop: {},
				timer: null
			}
		},
		computed: {
			depTime () {
				if (this.flightInfo.depTime) {
					return this.flightInfo.depTime.substr(0, 2) + ':' + this.flightInfo.depTime.substr(2, 2)
				} else {
					return ''
				}
				
			}
		},
		mounted () {
			this.inputValueInner = this.inputValue
			let res = uni.getSystemInfoSync()
			this.statusBarHeight = res.statusBarHeight
			if (this.fromDriver) {
				this.operationMarginTop = {
					'top': 0
				}
			} else {
				this.operationMarginTop = {
					'top': this.statusBarHeight + 29 + 'px'
				}
			}
			this.timer = debounce(function (item) {
				this.$emit('inputGetCargoInfo', this.inputValueInner)
			}, 300)
		},
		methods: {
			inputSearch(item) {
				this.$emit('inputSearch', item.detail.value)
			},
			// 隐藏/显示 搜索栏
			changeSearchBarStatus () {
				this.$emit('changeSearchBarStatus')
			},
			// 扫码
			scanCode () {
				this.$emit('scanCode')
			},
			// 清空搜索栏内容
			resetInputValue () {
				this.inputValueInner = ''
				this.$emit('resetInputValue')
			},
			// 按下搜索栏确定按钮录入集装器
			inputGetCargoInfo () {
				this.timer()
			},
			// 显示列表的选择框
			showSelectFlag () {
				this.$emit('showSelectFlag')
			},
			// 打开操作历史
			openOperaionHistory () {
				this.$emit('openOperaionHistory')
			},
			deleteList () {
				this.$emit('deleteList')
			},
			comparison () {
				this.$emit('comparison')
			},
			getVersions () {
				this.$emit('getVersions')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.navbar {
		.title {
			font-family: SourceHanSansSC-Medium;
			font-size: 38rpx;
			letter-spacing: 2rpx;
			color: #ffffff;
		}
	}
	
	// 列表不为空时的导航栏右侧样式
	.operation-list {
		display: flex;
		flex-direction: row-reverse;
		align-items: center;
		
		.item {
			image {
				height: 42rpx;
				width: 42rpx;
			}
		}
		.distance {
			margin-right: 50rpx;
		}
		
		.right {
			margin-right: 33rpx;
		}
		image {
			width: 28rpx;
			height: 28rpx;
		}
	}
	
	.operation {
		position: fixed;
		width: 100%;
		z-index: 90;
		top: calc(var(--status-bar-height) + 44px);
		display: flex;
		justify-content: space-between;
		background-color:#4191EA;
		padding-top: 0rpx;
		padding-bottom: 19rpx;
		.item {
			text-align: center;
			image {
				height: 50rpx;
				width: 50rpx;
			}
			.font {
				color: #ffffff;
				font-family: SourceHanSansSC-Regular;
				font-size: 32rpx;
			}
		}
		.left {
			margin-left: 97rpx;
		}
		.right {
			margin-right: 101rpx;
		}
	}
	
	.operation-search {
		position: fixed;
		width: 100%;
		z-index: 90;
		top: calc(var(--status-bar-height) + 44px);
		
		background-color:#4191EA;
		width: 100%;
	}
	
	// 有搜索框时的操作栏的样式
	.operation-above-search {
		display: flex;
		flex-direction: row-reverse;
		margin-bottom: 26rpx;
		.item {
			image {
				height: 42rpx;
				width: 42rpx;
			}
		}
		.distance {
			margin-right: 50rpx;
		}
		
		.right {
			margin-right: 36rpx;
		}
	}
	
	.search {
		display: flex;
		height: 85rpx;
		margin: 33rpx 20rpx 30rpx 20rpx;
		.search-input {
			width: calc(100vw - 196rpx);
			background-color: #e9e9e9;
			font-size: 30rpx;
			color: #A8ABB8;
			display: flex;
			align-items: center;
			padding-left: 33rpx;
		}
		.btn {
			width: 157rpx;
			background-color: #18BD52;
			text-align: center;
			line-height: 85rpx;
			font-size: 32rpx;
			font-family: SourceHanSansSC-Regular;
			font-size: 32rpx;
			letter-spacing: 2rpx;
			color: #fefefe;
		}
	}
</style>

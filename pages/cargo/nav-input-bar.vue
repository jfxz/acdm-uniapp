<template>
	<view>
		<u-navbar class="navbar"
		back-icon-size="50"
		 :background="navBackground"
		 :border-bottom="false"
		 back-icon-color="#ffffff">
			<view class="title">
				{{title}}
			</view>
			<view slot="right">
				<view v-if="showInputFlag" :class="{'item': true}" style="margin-right: 33rpx;">
					<image style="width:30rpx;height:44rpx;" src="@/static/input-cargo-sm.png" @tap="changeSearchBarStatus"></image>
				</view>
			</view>
		</u-navbar>
		
		
		<template v-if="showSearchBar">
			<view class="operation" :style="operationMarginTop">
				<view class="search">
					<view class="search-input">
						<input confirm-type="search" @confirm="inputGetCargoInfo" style="width: 92%;" :placeholder="placeHolder" v-model="inputValueInner"/>
						<image v-if="inputValueInner!=''"  style="height:40rpx;width:40rpx;" src="@/static/input-delete-grey.png" @tap="resetInputValue"></image>
					</view>
					<view class="btn" @tap="inputGetCargoInfo">确定</view>
				</view>
			</view>
		</template>
	</view>
</template>

<script>
	export default {
		props: {
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
			placeHolder: {
				type: String,
				default: '请输入航班号'
			},
			showInputFlag: {
				type: Boolean,
				default: true
			}
		},
		data () {
			return {
				navBackground: {
					'background': '#4191EA'
				},
				inputValueInner: '',
				statusBarHeight: 0,
				operationMarginTop: {}
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
		},
		methods: {
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
				this.$emit('inputGetCargoInfo', this.inputValueInner)
				this.resetInputValue()
			},
			// 显示列表的选择框
			showSelectFlag () {
				this.$emit('showSelectFlag')
			},
			// 打开操作历史
			openOperaionHistory () {
				this.$emit('openOperaionHistory')
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

<template>
	<view v-if="contentNotNull">
		<view v-if="showSearchBar" class="search" :style="{bottom: keyboardHeight + 'px'}">
			<view class="search-input">
				<input :adjust-position="false" confirm-type="search" @confirm="inputGetCargoInfo" style="width: 92%;" placeholder="请输入集装器号" v-model="inputValueInner"/>
				<image v-if="inputValueInner!=''"  style="height:40rpx;width:40rpx;" src="@/static/input-delete-grey.png" @tap="resetInputValue"></image>
			</view>
			<view class="btn" @tap="inputGetCargoInfo">确定</view>
		</view>
		
		<slot name="top">
			
		</slot>
		
		<view class="bottom-bar">
			<view class="left">
				
				<slot name="left">
				</slot>
				
			</view>
			
			<view class="right" >
				<slot name="right">
					<view :class="[btnCanPress?'btn-blue':'btn-blue-light']" @click="confirm">
						{{btn}}
					</view>
				</slot>
			</view>
		</view>
	</view>
</template>

<script>
	import { debounce } from '@/common/util/util.js'
	export default {
		props: {
			// 列表不为空，如果列表不为空,为true;如果列表为空,为false
			contentNotNull: {
				type: Boolean,
				default: false
			},
			btn: {
				type: String,
				default: ''
			},
			// 是否可以点击按钮
			btnCanPress: {
				type: Boolean,
				default: true
			},
			showSearchBar: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				// 是否全选,默认不全选
				selectAllFlag: false,
				inputValueInner: '',
				keyboardHeight: 52,
				timer: null,
				refreshFlag: true
			}
		},
		mounted () {
			this.timer = debounce(function () {
				this.$emit('confirm')
			}, 1000)
			uni.onKeyboardHeightChange(res => {
				if (res.height === 0) {
					this.keyboardHeight = 52
				} else {
					this.keyboardHeight = res.height
				}
			})
		},
		watch: {
			btnCanPress: {
				handler(newval) {
					this.refreshFlag = false
					var that = this
					setTimeout(function () {
						that. refreshFlag = true
					}, 200)
				},
				immediate: true
			}
		},
		methods: {
			confirm: debounce(function () {
				if (this.btnCanPress) {
					this.$emit('confirm')
				}
			}, 300),
			
			inputGetCargoInfo:  debounce(function () {
				this.$emit('inputGetCargoInfo', this.inputValueInner)
			}, 300),
			
			resetInputValue () {
				this.inputValueInner = ''
				this.$emit('resetInputValue')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search {
		background-color: #ffffff;
		width: 100vw;
		position: fixed;
		bottom: 106rpx;
		display: flex;
		height: 132rpx;
		padding: 25rpx 34rpx 22rpx 34rpx;
		.search-input {
			background-color: #ffffff;
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
	
	.bottom-bar {
		width: 100vw;
		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #ffffff;
		padding: 19rpx 33rpx 18rpx 33rpx;
		// 左边的操作样式
		.left {
		}
		// 右边的按钮样式
		.right {
			display: flex;
		}
	}
	
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

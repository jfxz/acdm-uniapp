<template>
	<view class="operation-list" @tap="changeSelectAll">
		<text class="select-font">全选</text>
		<template v-if="selectAllFlag">
			<image class="select-icon" src="@/static/select-green.png"></image>
		</template>
		<template v-else>
			<image class="select-icon" src="@/static/circel-not-selected.png"></image>
		</template>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				selectAllFlag: false
			}
		},
		methods: {
			// 全选
			selectAll () {
				this.selectAllFlag = true
				this.$emit('selectAll')
			},
			
			cancelSelectAll () {
				this.selectAllFlag = false
				this.$emit('cancelSelectAll')
			},
			
			changeSelectAll () {
				this.selectAllFlag = !this.selectAllFlag
				if (this.selectAllFlag) {
					this.$emit('selectAll')
				} else {
					this.$emit('cancelSelectAll')
				}
			},
			
			changeSelectAllFlag (flag) {
				console.log('changeSelectAllFlag-flag', flag)
				this.selectAllFlag = flag
			}
		}
	}
</script>

<style lang="scss" scoped>
.operation-list {
	display: flex;
	flex-direction: row-reverse;
	align-items: center;
	image {
		width: 28rpx;
		height: 28rpx;
	}
}

// 选择文字样式
.select-font {
	font-family: SourceHanSansSC-Regular;
	font-size: 29rpx;
	line-height: 29rpx;
	letter-spacing: 1rpx;
	color: #8c8c8c;
}
// 选择图标样式
.select-icon {
	margin-right: 17rpx;
	width: 35rpx;
	height: 35rpx;
}
</style>

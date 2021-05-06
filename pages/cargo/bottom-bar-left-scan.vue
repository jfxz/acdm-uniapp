<template>
	<view class="operation-list">
		<template v-if="showSort">
			<view class="item large">
				<image src="@/static/sort-cargo-blue.png" @tap="showSelectFlag"></image>
			</view>
		</template>
		
		<view class="item distance">
			<image src="@/static/input-cargo-blue.png" style="width:30rpx;height:43rpx;" @tap="changeSearchBarStatus"></image>
		</view>
		
		<view class="item distance">
			<image src="@/static/scan-cargo-blue.png" @click="scanCode"></image>
		</view>
	</view>
</template>

<script>
	import { debounce } from '@/common/util/util.js'
	export default {
		props: {
			showSort: {
				type: Boolean,
				default: false
			}
		},
		data () {
			return {
				
			}
		},
		methods: {
			changeSearchBarStatus: debounce(function () {
				this.$emit('changeSearchBarStatus')
			}, 300),
			scanCode: debounce(function () {
				this.$emit('scanCode')
			}, 300),
			// 打开操作历史
			showSelectFlag: debounce(function () {
				this.$emit('showSelectFlag')
			}, 300)
		}
	}
</script>

<style lang="scss" scoped>
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
</style>

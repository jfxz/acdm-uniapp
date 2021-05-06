/*
* 界面名称:卸机-查询
* 界面功能:
* 其他    :
* 时间    :2020-11-3 11:55:51
* 作者    :gyb
*/
<template>
	<view class="costly-search-card">
		<view class="top">
			<view class="containerCode">{{item.containerCode}}</view>
		</view>
		<view class="bottom">
			<view>舱位:{{item.cabin}}</view>
			<view>重量:{{item.cargoWeight}}</view>
			<view>货物类别:{{item.type}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			item: {
				type: Object,
				default: () => {}
			}
		},
		data () {
			return {
			}
		}
	}
</script>

<style lang="scss" scoped>
	.costly-search-card {
		font-weight: 900;
		font-family: SourceHanSansSC-Medium;
		.top {
			height: 48rpx;
			margin-bottom: 20rpx;
			.containerCode {
				font-size: 40rpx !important;
				color: #262626;
			}
		}
		.bottom {
			height: 48rpx;
			display: flex;
			justify-content: space-between;
			padding-right: 10rpx;
		}
	}
</style>

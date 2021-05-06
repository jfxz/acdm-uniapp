/*
* 界面名称:拉下查询-装卸-航班列表
* 界面功能:
* 其他    :
* 时间    :2020-10-26 14:17:05
* 作者    :gyb
*/
<template>
	<view class="cardRight">
		<view class="top">
			<view class="left">
				<view class="container-number">{{item.flight}}</view>
				<view class="car-num">{{item.arr ? item.arr.length : 0}}车</view>
			</view>
			<view class="right">
			</view>
		</view>
		
		<view class="unloading-flight-row">
			<view class="unloading-flight-item">
				<text class="label">日期:</text>
				<text class="value">{{item.opDate?item.opDate.substr(0, 10):'无'}}</text>
			</view>
			<view class="unloading-flight-item">
				<text class="label">机号:</text>
				<text class="value">{{item.registration?item.registration:'无'}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {DIC} from '@/common/dic.js'
	export default {
		props: {
			itemOri: {
				type: Object,
				default: () => {}
			}
		},
		data () {
			return {
				item: {},
				arrived: false,
				depStatusList: [{
					value: 'DEP',
					label: '起飞'
				}, {
					value: 'CNL',
					label: '取消'
				}, {
					value: 'BDP',
					label: '允许登机'
				}, {
					value: 'BDS',
					label: '候机'
				}, {
					value: 'ENR',
					label: '途中'
				}, {
					value: 'RTN',
					label: '返航'
				}, {
					value: 'CKC',
					label: '值机关闭'
				}, {
					value: 'DLY',
					label: '延误'
				}, {
					value: 'BDC',
					label: '登机结束'
				}, {
					value: 'ARR',
					label: '到达'
				}, {
					value: 'ALT',
					label: '备降'
				}, {
					value: 'CKI',
					label: '正在值机'
				}, {
					value: 'ARN',
					label: '到达'
				}, {
					value: 'ALT',
					label: '登机'
				}, {
					value: 'ALT',
					label: '过站登机'
				}, {
					value: 'BDF',
					label: '催促登机'
				}]
			}
		},
		mounted () {
			this.item = this.itemOri
		},
		methods: {
			formatterFlight (item) {
				if (item.flightStatus) {
					let obj = this.depStatusList.find(e => e.value === item.flightStatus)
					if (obj) {
						return obj.label
					}
					return ''
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top {
		display: flex;
		justify-content: space-between;
		padding-top: 15rpx;
		margin-bottom: 27rpx;
		.left {
			display: flex;
			align-items: center;
			font-family: SourceHanSansSC-Medium;
			font-size: 35rpx;
			height: 35rpx;
			.container-number {
				line-height: 35rpx; 
				font-weight: 900;
				letter-spacing: 2rpx;
				color: #262626;;
				margin-right: 18rpx;
			}
			.car-num {
				line-height: 35rpx;
				font-weight: 900;
				letter-spacing: 2rpx;
				color: #262626;;
				margin-left: 10rpx;
			}
			
		}
		.right {
		}
	}
	
	.unloading-flight-row {
		display: flex;
		width: 100%;
		margin-bottom: 34rpx;
		.unloading-flight-item {
			margin-right: 34rpx;
			.label {
				height: 28rpx;
				font-family: SourceHanSansSC-Regular;
				font-size: 28rpx;
				line-height: 28rpx;
				letter-spacing: 1rpx;
				color: #8c8c8c;
			}
			.value {
				font-family: Roboto-Regular;
				font-size: 28rpx;
				font-weight: 900;
				letter-spacing: 1rpx;
				color: #595959;
			}
		}
	}
</style>

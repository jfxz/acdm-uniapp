/*
* 界面名称:底部弹出层，用来出库、选择待运区
* 界面功能:
* 其他    :
* 时间    :2020-8-22 10:05:22
* 作者    :gyb
*/
<template>
	<uni-popup ref="popup" type="bottom">
		<view class="popup-bottom">
			<view class="top-bar">
				<view class="cancel-btn" @tap="close">取消</view>
				<view class="title" style="font-weight:bold;">{{title}}</view>
				<view class="fix-right" @tap="clear">清空</view>
			</view>
			
			<view v-show="showLocations" class="list">
				<block v-for="item in locations" :key="item.id">
					<view class="item" @tap="changeSelectStatus(item)" style="margin-top: 55rpx;">
						<view class="name" style="font-weight: bold;">
							{{item.name}}
						</view>
						<template v-if="item.selected">
							<image class="select" src="@/static/select-green.png"></image>
						</template>
						<template v-else>
							<image class="select" src="@/static/circel-not-selected.png"></image>
						</template>
					</view>
				</block>
			</view>
			
			<view class="confirm-btn" @tap="confirm">{{btn}}</view>
		</view>
	</uni-popup>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	export default {
		props: {
			// 弹出框标题
			title: {
				type: String,
				default: ''
			},
			// 按钮名字
			btn: {
				type: String,
				default: ''
			}
		},
		components: {
			uniPopup,
			uniPopupMessage,
			uniPopupDialog
		},
		data () {
			return {
				// 待选列表
				locations: [],
				selectedItem: {},
				// 刷新列表用
				showLocations: true
			}
		},
		methods: {
			// 返回选中的地方的名字
			confirm () {
				let location = this.locations.find(v => v.selected === true)
				let name = ''
				if (location) {
					name = location.name
				}
				this.$emit('confirm', name)
				this.close()
			},
			// 点击确认出库打开底部弹出层
			open (item, locations, operationType) {
				this.locations = [...locations]
				this.locations.forEach(e => e.selected = false)
				if (!operationType) {
					let location = this.locations.find(e => e.name === item.firstTransportTargetAddr)
					if (location) {
						location.selected = true
					}
				}
				this.$refs.popup.open()
			},
			// 出库选择
			openSort (item, locations, operationType) {
				this.locations = [...locations]
				this.locations.forEach(e => e.selected = false)
				if (item.status === 'NOTRECLAIMED') {
					item.statusName = '未复称'
				} else if (item.status === 'RECLAIMED') {
					item.statusName = '已复称'
				} else if (item.status === 'OUTOFSTOCK') {
					item.statusName = '已出库'
				}
				let location = this.locations.find(e => e.name === item.statusName)
				if (location) {
					location.selected = true
				}
				this.$refs.popup.open()
			},
			// 点击关闭底部弹出层
			close () {
				this.$refs.popup.close()
			},
			clear () {
				this.locations.forEach(e => {
					e.selected = false
				})
				this.refresh()
			},
			// 改变库位选择状态
			changeSelectStatus (item) {
				if (item.selected) {
					item.selected = false
				} else {
					this.locations.forEach(e => e.selected = false)
					item.selected = true
				}
				this.refresh()
			},
			
			refresh () {
				this.showLocations = false
				var that = this
				setTimeout(function () {
					that.showLocations = true
				}, 1)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.popup-bottom {
		width: 100%;
		background-color: #ffffff;
		padding: 52rpx 32rpx 52rpx 32rpx;
		border-radius: 35rpx 35rpx 0rpx 0rpx;
		.top-bar {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.cancel-btn {
				font-family: SourceHanSansSC-Regular;
				font-size: 32rpx;
				letter-spacing: 2rpx;
				color: #a6a6a6;
			}
			.title {
				font-family: SourceHanSansSC-Regular;
				font-size: 38rpx;
				letter-spacing: 2rpx;
				color: #333333;
			}
			.fix-right {
				font-family: SourceHanSansSC-Regular;
				font-size: 32rpx;
				letter-spacing: 2rpx;
				color: #a6a6a6;
			}
		}
		.list {
			.item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.name {
					font-family: SourceHanSansSC-Regular;
					font-size: 32rpx;
					letter-spacing: 2rpx;
					color: #333333;
				}
				.select {
					width: 35rpx;
					height: 35rpx;
				}
			}
		}
		.confirm-btn {
			width: 683rpx;
			height: 86rpx;
			background-color: #008ffd;
			border-radius: 43rpx;
			margin-top: 72rpx;
			
			font-family: SourceHanSansSC-Regular;
			font-size: 35rpx;
			text-align: center;
			line-height: 86rpx;
			letter-spacing: 2rpx;
			color: #ffffff;
		}
	}
</style>

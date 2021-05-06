<template>
	<view class="enterance-layout">
		<!-- 导航 -->
		<view class="navbar">
			<view class="nav-handle-left">
				<view class="handle-type">
					<image class="my-icon-image" style="height:40rpx;width:20rpx;position:relative;top:-10rpx;" src="@/static/return.png" @tap="openAcdmHome"></image>
				</view>
			</view>
			<view class="nav-title">
				<text>空集装器需求</text>
			</view>
			<view class="nav-handle-right">
			</view>
		</view>
		
		<!-- 内容 -->
		<view class="main-layout">
			<view class="leave-port menu">
				<view class="title">
					空集装器需求
				</view>
					
				<view class="btns">
					<block v-for="(btn, index) in list" :key="btn.funcName">
						<view class="btn" @tap="btn.func">
							<template v-if="index%2!=0">
								<view class="line"></view>
							</template>
							<view class="left">
								<image style="width: 76rpx;height: 76rpx;" :src="btn.icon"></image>
							</view>
							<view class="right">
								<view class="top">{{btn.name}}</view>
								<view class="bottom">{{btn.remark}}</view>
							</view>
						</view>
					</block>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data () {
			return  {
				// 该用户拥有的角色可以使用的按钮,出港
				list: []
			}
		},
		mounted () {
			this.getAllbtns()
		},
		methods: {
			openAcdmHome (){
				uni.reLaunch({
					url: '../home/index'
				})
			},
			
			getAllbtns () {
				this.list = [{
					index: 0,
					name: '航司空集装器',
					label: '航司空集装器',
					remark: '航司空集装器',
					icon: '/static/out-stock.png',
					funcName: 'airline',
					func: function () {
						uni.navigateTo({
							url: `/pages/emptyContainer/airline`
						})
					}
				},
				{
					index: 1,
					name: '货站空集装器',
					label: '货站空集装器',
					remark: '货站空集装器',
					icon: '/static/load-receive.png',
					funcName: 'warehouse',
					func: function () {
						uni.navigateTo({
							url: `/pages/emptyContainer/warehouse`
						})
					}
				},
				{
					index: 1,
					name: '空集装板盘点确认',
					label: '空集装板盘点确认',
					remark: '空集装板盘点确认',
					icon: '/static/load-receive.png',
					funcName: 'check',
					func: function () {
						uni.navigateTo({
							url: `/pages/emptyContainer/check`
						})
					}
				}]
			}
		}
	}
</script>

<style lang="scss" scoped>
	.enterance-layout {
		background-color: #ffffff;
		overflow-x: hidden;
		.navbar {
			display: flex;
			justify-content: space-between;
			height: calc(var(--status-bar-height) + 92rpx);
			background: #1891ff;
			padding-top: calc(var(--status-bar-height) + 25rpx);
			width: 100%;
			z-index: 10;
			position: fixed;
			top: 0;
			text-align: center;
		
			.nav-handle-left {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				width: 30%;
				padding-top: 5rpx;
				padding-left: 35rpx;
		
				.handle-type {
					image {
						width: 45rpx;
						height: 45rpx;
					}
				}
			}
		
			.nav-title {
				width: 40%;
				font-size: 38rpx;
				line-height: 50rpx;
				color: #ffffff;
			}
		
			.nav-handle-right {
				display: flex;
				flex-direction: row-reverse;
				justify-content: space-between;
				width: 30%;
				padding-top: 5rpx;
				padding-right: 35rpx;
		
				.handle-type {
					image {
						width: 38rpx;
						height: 38rpx;
					}
				}
			}
		}
		.main-layout {
			width: 717rpx;
			height: 100%;
			margin: 0 auto;
			margin-top: calc(var(--status-bar-height) + 100rpx);
			background-color: #ffffff;
			border-radius: 7rpx;
			
			.leave-port {
				
			}
			
			.enter-port {
				
			}
			.menu {
				.title {
					margin: {
						left: 24rpx;
						bottom: 38rpx;
					}
					padding-top: 40rpx;
					font-family: SourceHanSansSC-Medium;
					font-size: 31rpx;
					font-weight: 700;
					letter-spacing: 0rpx;
					color: #333333;
				}
				.border-line {
					margin: {
						left: 18rpx;
						bottom: 51rpx;
					}
					width: 674rpx;
					height: 2rpx;
					border: solid 2rpx #e5e5e5;
				}
				.notice-bar-style {
					margin: {
						bottom: 51rpx;
					}
				}
				.btns {
					margin-left: 20rpx;
					display: flex;
					width: 100%;
					flex-wrap: wrap;
					.btn {
						width: 50%;
						display: flex;
						height: 76rpx;
						margin-bottom: 76rpx;
						.line {
							width: 2rpx;
							height: 81rpx;
							border: solid 2rpx #e5e5e5;
							margin-right: 25rpx;
						}
						.left {
							image {
								width: 76rpx;
								height: 76rpx;
							}
						}
						.right {
							margin-left: 24rpx;
							.top {
								font-family: SourceHanSansSC-Medium;
								font-size: 29rpx;
								font-weight: 700;
								letter-spacing: 0rpx;
								color: #333333;
								margin: 0 0 28rpx 0;
							}
							.bottom {
								font-family: SourceHanSansSC-Regular;
								font-size: 25rpx;
								letter-spacing: 0rpx;
								color: #999999;
							}
						}
					}
				}
			}
		}
	}
</style>

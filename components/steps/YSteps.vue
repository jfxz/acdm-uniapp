<template>
	<view class="steps">
		<view
			v-for="(step, index) in stepList"
			:key="'stepsItem' + index"
      		:class="['steps-item', step.isActive ? 'steps-item-active' : '', step.isFinished ? 'steps-item-finished' : '']">
			<view class="steps-item-left">
				<text class="steps-item-left-date">{{ step.date }}<br><text class="steps-item-left-time">{{ step.time }}</text></text>
			</view>
			<view class="steps-item-index">
				<view :class="['line', index != 0 ? '' : 'line-transparent']"></view>
				<!-- <view v-if="!step.isActive && step.isFinished" class="index index-success"><icon type="success_no_circle" size="16" /></view> -->
				<view class="index">{{ step.index ? step.index : index + 1 }}</view>
				<view :class="['line', index != stepList.length - 1 ? '' : 'line-transparent']"></view>
			</view>
			<view class="steps-item-right">
				<view class="right-info-item">
					<view>{{ step.info }}</view>
					<view v-if="step.isShowSlot">
						<slot></slot>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'YSteps',
		props: {
			stepList: {
				type: Array,
				default: () => []
			}
		},
    mounted() {
      console.log('stepList', this.stepList)
    }
	}
</script>

<style lang="scss" scoped>
	$normolColor: #009688;
	$activeColor: #ff3838;
	$finishedColor: #4DB6AC;
	$normolBgColor: #80CBC4;
	$activeBgColor: #F8BBD0;
	$finishedBgColor: #B2DFDB;
	.steps {
		display: flex;
		flex-direction: column;
		.steps-item {
			display: flex;
			.steps-item-left {
				display: flex;
				align-items: center;
				color: $normolColor;
				.steps-item-left-date {
					font-size: 30rpx;
					padding-top: 32rpx;
					line-height: 40rpx;
				}
				.steps-item-left-time {
					font-size: 26rpx;
				}
			}
			.steps-item-index {
				padding: 0 20rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				.line {
					flex: 1;
					width: 5rpx;
					background-color: $normolBgColor;
				}
				.line-transparent {
					background-color: transparent;
				}
				.index {
					width: 50rpx;
					height: 50rpx;
					font-size: 25rpx;
					font-weight: 900;
					text-align: center;
					line-height: 50rpx;
					border-radius: 50rpx;
					color: $normolColor;
					background-color: $normolBgColor;
				}
				/deep/ .index-success {
					display: flex;
					justify-content: center;
					align-items: center;
					.uni-icon-success_no_circle {
						color: $normolColor;
					}
				}
			}
			.steps-item-right {
				display: flex;
				flex-direction: column;
				padding: 20rpx 0;
				color: $normolColor;
				.right-info-item {
					display: flex;
					flex-direction: column;
					justify-content: center;
					padding: 30rpx;
					text {
						font-size: 30rpx;
						font-weight: 600;
						line-height: 30rpx;
					}
				}
			}
		}
		.steps-item-finished {
			.steps-item-left {
				color: $finishedColor;
			}
			.steps-item-index {
				.index {
					color: $finishedColor;
					background-color: $finishedBgColor;
				}
			}
			.steps-item-right {
				color: $finishedColor;
			}
		}
		.steps-item-active {
			.steps-item-left {
				color: $activeColor;
			}
			.steps-item-index {
				.index {
					color: $activeColor;
					background-color: $activeBgColor;
				}
			}
			.steps-item-right {
				color: $activeColor;
			}
		}
	}
</style>

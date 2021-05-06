<template>
	<view class="timeline">
		<u-time-line>
			<block v-for="(task, index) in tasks" :key="index">
				<u-time-line-item nodeTop="2">
					<!-- 此处自定义了左边内容，用一个图标替代 -->
					<template v-slot:node>
						<template v-if="index==0">
							<view :class="{'u-node': true, 'lastest': index==0}">
								<u-icon name="file-text-fill" color="#fff" :size="24"></u-icon>
							</view>
						</template>
						<template v-else-if="task.title.indexOf('装卸')!=-1">
							<view :class="{'u-node': true, 'lastest': index==0}">
								<u-icon name="car-fill" color="#fff" :size="24"></u-icon>
							</view>
						</template>
						<template v-else>
							<view :class="{'u-node': true, 'lastest': index==0}">
								<u-icon name="pushpin-fill" color="#fff" :size="24"></u-icon>
							</view>
						</template>
					</template>
					<template v-slot:content>
						<view>
							<view class="u-order-title">{{task.title}}</view>
							<view class="u-order-desc">{{task.desc}}</view>
							<view class="u-order-time">{{task.time}}</view>
						</view>
					</template>
				</u-time-line-item>
			</block>
		</u-time-line>
	</view>
</template>

<script>
	export default {
		data () {
			return {
				tasks: []
			}
		},
		onShow () {
			let tasks = uni.getStorageSync('timeline')
			if (tasks) {
				this.initTasks(tasks)
				uni.removeStorageSync('timeline')
			}
		},
		methods: {
			initTasks (tasks) {
				this.tasks = tasks
			}
		}
	}
</script>

<style lang="scss" scoped>
	.timeline {
		// background-color: #ffffff;
		height: 100%;
		padding: {
			left: 40rpx;
			right: 5rpx;
			top: 30rpx;
		}
	}
	
	.u-node {
			width: 44rpx;
			height: 44rpx;
			border-radius: 100rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			background: #d0d0d0;
		}
		
		.u-order-title {
			color: #333333;
			font-weight: bold;
			font-size: 32rpx;
		}
		
		.u-order-desc {
			color: rgb(150, 150, 150);
			font-size: 28rpx;
			margin-bottom: 6rpx;
		}
		
		.u-order-time {
			color: rgb(200, 200, 200);
			font-size: 26rpx;
		}
		.lastest {
			background: #19be6b;
		}
</style>

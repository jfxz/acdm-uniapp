<template>
	<view v-if="showWorkNote">
		<view class="cpt-mask" @tap.stop="closeNoteDialog"></view>
		<view class="work-note-layout">
			<image src="../../static/home_dialog_background@3x.png" class="dialog_background"></image>
			<view class="work-note-info">
				<view class="workTime">
					<view class="workText">
						<image class="workIcon" src="../../static/home-dialog-work.png"></image>
						<view class="text">上班打卡时间</view>
					</view>
					<view class="time">{{formatWorkTime(employeeInfo.inWorkTime)}}</view>
					<view class="status">
						<text v-if="clockStatus === 'beforWork'">未打卡</text>
						<text v-else style="color: #36d659;">打卡成功</text></view>
				</view>
				<view class="workTime">
					<view class="workText">
						<image class="workIcon" src="../../static/home-dialog-work.png"></image>
						<view class="text">下班打卡时间</view>
					</view>
					<view class="time">{{formatWorkTime(employeeInfo.afterWorkTime)}}</view>
					<view class="status">
						<text v-if="clockStatus === 'inWork' || clockStatus === 'beforWork'">未打卡</text>
						<text v-else style="color: #36d659;">打卡成功</text>
					</view>
				</view>
				<view class="workBtn" @tap="changeWork" v-if="clockStatus !== 'afterWork'">
					<text v-if="clockStatus === 'beforWork'">上班打卡</text>
					<text v-if="clockStatus === 'inWork'">下班打卡</text>
				</view>
				<view class="afterWorkBtn" v-else>
					<text>打卡完成</text>
				</view>
			</view>
			<view class="closeBtn" @tap.stop="closeNoteDialog">
				<image src="../../static/delete.png" class="close-btn_mage" @tap.stop="closeNoteDialog"></image>
			</view>
		</view>
	</view>

</template>

<script>
	import {
		putAfterWork,
		putInWork,
		getresEmployeeInfo
	} from "@/api/task/index.js"
	import dayjs from '@/common/util/dayjs.min.js'
	export default {
		data() {
			return {
				showWorkNote: false, // 显示上下班打卡界面
				employeeInfo: {
					inWorkTime: '',
					afterWork: '',
					inWork: '',
				},
				defaultEm:{
					inWorkTime: '',
					afterWork: '',
					inWork: '',
				},
				clockStatus: 'beforWork'
			}
		},
		mounted() {
			if (!uni.getStorageSync('ClockInMsg')) {
				console.log('进去进去进去')
				uni.setStorageSync('ClockInMsg', JSON.stringify(this.employeeInfo))
			}
			// this.handleDate()
			// uni.removeStorageSync('ClockInMsg')
			// console.log('uni.setStorageSync', uni.getStorageSync('ClockInMsg'))
		},
		methods: {
			// 获取员工信息
			getEmployeeInfo() {
				return new Promise(result => {
					getresEmployeeInfo().then(res => {
						if (res.status) {
							this.employeeInfo = res.data
							result()
						}
					})
				})
			},
			// 上下班打卡
			changeWork() {
				if (this.clockStatus === 'beforWork') {
					this.employeeInfo.inWorkTime = new Date().getTime()
					this.handleClockStatus()
					uni.setStorageSync('ClockInMsg', JSON.stringify(this.employeeInfo))
					this.$message('操作成功')
				} else if (this.clockStatus === 'inWork') {
					this.employeeInfo.afterWorkTime = new Date().getTime()
					this.handleClockStatus()
					uni.setStorageSync('ClockInMsg', JSON.stringify(this.employeeInfo))
					this.$message('操作成功')
				}
			},
			// 判断上班打卡状态
			handleClockStatus() {
				// 人员状态为下班时判断是今日未上班还是已下班
				if (this.employeeInfo.afterWorkTime) {
					this.clockStatus = 'afterWork'
				} else {
					if (this.employeeInfo.inWorkTime) {
						this.clockStatus = 'inWork'
					} else {
						this.clockStatus = 'beforWork'
					}
				}
			},
			// 格式化工作时间
			formatWorkTime(val) {
				if (val) {
					return dayjs(val).format('HH:mm:ss')
				}
				return '--:--'
			},
			// 关闭打卡弹窗
			closeNoteDialog() {
				this.showWorkNote = false
			},
			// 开启打卡弹窗
			openNoteDialog(time) {
				if (time === 'first') {
					let lastUseDate = uni.getStorageSync('last_use_date')
					let today = dayjs(new Date()).format('YYYY-MM-DD')
					if (lastUseDate && lastUseDate === today) {
						this.showWorkNote = false
					} else {
						uni.setStorageSync('ClockInMsg', JSON.stringify(this.defaultEm))
						this.employeeInfo = JSON.parse(uni.getStorageSync('ClockInMsg'))
						this.handleClockStatus()
						setTimeout(()=>{
							this.showWorkNote = true
						},300)
						uni.removeStorageSync('last_use_date')
						uni.setStorageSync('last_use_date', today)
					}
				} else {
					this.employeeInfo = JSON.parse(uni.getStorageSync('ClockInMsg'))
					this.handleClockStatus()
					console.log(this.employeeInfo, 'this.employeeInfo')
					this.showWorkNote = true
				}
			}
		}
	}
</script>

<style lang="scss">
	.cpt-mask {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #000000;
		opacity: 0.5;
		z-index: 1000;
	}

	.work-note-layout {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		position: fixed;
		top: 230rpx;
		left: 70rpx;
		right: 70rpx;
		z-index: 1001;

		.dialog_background {
			height: 800rpx;
			z-index: -1;
			border-style: solid;
			border-color: #e7e7e7;
			border-radius: 6px;
		}

		.work-note-info {
			margin-top: -300rpx;
			z-index: 1;
			padding: 0 44rpx;

			.workTime {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				padding-bottom: 35rpx;
			}

			.workText {
				display: flex;
				flex-direction: row;
				align-items: center;

				.text {
					margin-left: 10rpx;
					font-size: 29rpx;
					color: #333333;
				}
			}

			.workIcon {
				width: 30rpx;
				height: 25rpx;
			}

			.time {
				font-size: 29rpx;
				color: #333333;
				width: 12%;
				padding-top: 5rpx;
			}

			.status {
				font-size: 29rpx;
				color: #bfbfbf;
				width: 22%;
			}

			.workBtn {
				height: 83rpx;
				font-size: 35rpx;
				color: #fefefe;
				line-height: 83rpx;
				text-align: center;
				background-image: linear-gradient(90deg, #0090ff 0%, #06b5ff 100%);
				box-shadow: 3rpx 3rpx 8rpx 0rpx rgba(1, 145, 255, 0.53);
				border-radius: 42rpx;
			}

			.afterWorkBtn {
				height: 83rpx;
				font-size: 35rpx;
				color: #fefefe;
				line-height: 83rpx;
				text-align: center;
				border-radius: 42rpx;
				background: #999999;
			}
		}

		.closeBtn {
			display: flex;
			flex-direction: row;
			justify-content: center;
			margin-top: 75rpx;

			.close-btn_mage {
				width: 100rpx;
				height: 100rpx;
			}
		}
	}
</style>

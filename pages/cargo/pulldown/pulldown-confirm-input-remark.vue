/*
* 界面名称:拉下货物确认-备注信息输入
* 界面功能:
* 其他    :
* 时间    :2020-10-14 15:19:32
* 作者    :gyb
*/
<template>
	<view class="input-remark-layout">
		<nav-bar
			 title="返回"
			:content-not-null="true"
			:show-search-bar="false">
			<template v-slot:right>
				<view></view>
			</template>
		</nav-bar>
		<view class="row">
			<view class="label">
				航班号
			</view>
			<view class="value" style="height: 126rpx;">
				<view class="flight">{{form.flight}}</view>
			</view>
		</view>
		
		<view class="border-line"></view>
		
		<view class="row">
			<view class="label">
				日期
			</view>
			<view class="value" style="height: 126rpx;">
				<view class="input-row date" @tap="showDatePicker=true">{{form.opDate?form.opDate.substr(0, 10):''}}</view>
			</view>
		</view>
		<view class="border-line"></view>
		
		<view class="row">
			<view class="label">
				集装器号
			</view>
			<view class="value" style="height: 126rpx;">
				<view class="container-code">{{form.containerCode}}</view>
			</view>
		</view>
		<view class="border-line"></view>
		
		<view class="row">
			<view class="label">
				重量
			</view>
			<view class="value" style="height: 126rpx;">
				<input confirm-type="done" class="weight" v-model="form.cargoWeight"/>
			</view>
		</view>
		<view class="border-line"></view>
		
		<view class="row" @tap="showTypePicker=true">
			<view class="label">
				拉下类型
			</view>
			<view class="value" style="height: 126rpx;">
				<view class="input-row pull-type">{{form.pullType}}</view>
				<image src="@/static/down-arror.png" style=""></image>
			</view>
		</view>
		<view class="border-line"></view>
		
		<view class="row" @tap="showReasonPicker=true">
			<view class="label">
				拉下原因
			</view>
			<view class="value" style="height: 126rpx;">
				<view class="input-row pull-reason">{{form.pullReason}}</view>
				<image src="@/static/down-arror.png"></image>
			</view>
		</view>
		<view class="border-line"></view>
		
		<view class="row">
			<view class="label">
				备注
			</view>
			<view class="value">
				<textarea class="remark" v-model="form.remark"/>
			</view>
		</view>
		<view class="border-line"></view>
		
		<view class="bottom">
			<view class="btn" @tap="submit">
				确定
			</view>
			<view class="btn" style="background-color: #b5afaf;" @tap="back">
				取消
			</view>
		</view>
		
		<u-picker :default-time="defaultTime" mode="time" v-model="showDatePicker" :params="dateParams" @confirm="setDate"></u-picker>
		<u-picker mode="selector" v-model="showTypePicker" :range="types" @confirm="setType"></u-picker>
		<u-picker mode="selector" v-model="showReasonPicker" :range="reasons" @confirm="setReason"></u-picker>
	</view>
</template>

<script>
	import navBar from '@/pages/cargo/nav-bar.vue'
	import uPicker from '@/pages/cargo/pulldown/components/u-picker.vue'
	import uniCombox from "@/components/uni-combox-new/uni-combox"
	import {
		updatePulldownCargoInfo,
		getPulldownReasons,
		onError
	} from '@/api/cargo/index.js'
	import { debounce } from '@/common/util/util.js'
	export default {
		components: {
			navBar,
			uPicker,
			uniCombox
		},
		data () {
			return {
				showDatePicker: false,
				showTypePicker: false,
				showReasonPicker: false,
				defaultTime: '',
				dateParams: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false
				},
				form: {},
				types: ['全部拉下', '部分拉下'],
				reasons: [],
				fontColor: 'black'
			}
		},
		onLoad () {
			this.form = uni.getStorageSync('pulldown-confirm-remark-item')
			uni.removeStorageSync('pulldown-confirm-remark-item')
			this.getPulldownReasons()
		},
		methods: {
			// 获取所有拉下原因
			getPulldownReasons () {
				getPulldownReasons().then(res => {
					console.log('getPulldownReasons', res)
					if (res.status) {
						this.reasons = res.data.map(v => v.pullReason)
					}
				})
			},
			// 清空搜索栏内容
			resetInputValue (label) {
				this.form[`${label}`] = ''
			},
			setDate (e) {
				this.form.opDate = e.year + '-' + e.month + '-' + e.day
			},
			setType (e) {
				this.form.pullType = this.types[e[0]]
			},
			setReason (e) {
				this.form.pullReason = this.reasons[e[0]]
			},
			
			// 获得下拉原因
			getReasons () {
				this.reasons = []
			},
			
			// 提交表单
			submit: debounce(function () {
				if (this.form.status === 'NOTPULLDOWN') {
					uni.setStorageSync('back-pulldown-confirm-remark', this.form)
					this.$message('修改备注成功')
					uni.navigateBack()
				} else {
					updatePulldownCargoInfo(this.form).then(res => {
						console.log('updatePulldownCargoInfo-res', res)
						if (res.status) {
							this.$message('修改备注成功')
							uni.setStorageSync('back-pulldown-confirm-remark', this.form)
						}
						uni.navigateBack()
					}).catch(err => {
						onError(err)
						uni.navigateBack()
					})
				}
			}),
			
			// 取消
			back: debounce(function () {
				uni.navigateBack()
			})
		}
	}
</script>

<style lang="scss" scoped>
	.input-remark-layout {
		background-color: #ffffff;
		height: 100vh;
		.row {
			display: flex;
			align-items: center;
			justify-content: space-between;
			.label {
				display: flex;
				flex-direction: column;
				justify-content: center;
				font-weight: 900;
				min-width: 200rpx;
				text-align: center;
				font-weight: 64rpx;
			}
			.value {
				display: flex;
				width: 100%;
				padding-right: 30rpx;
				.flight {
					width: 100%;
					color:black;
					padding-left: 10rpx;
					text-align: center;
					font-size:32rpx;
					line-height: 126rpx;
				}
				.input-row {
					width: 100%;
					height: 56rpx;
					font-family: Roboto-Regular;
					font-size: 33rpx;
					line-height: 56rpx;
					letter-spacing: 2rpx;
					color: #A8ABB8;
					text-align: center;
				}
				.date {
					color: black;
					position: relative;
					top: 50%;
					transform: translate(0, -50%);
				}
				.container-code {
					width: 100%;
					color:black;
					padding-left: 10rpx;
					text-align: center;
					font-size:32rpx;
					line-height: 126rpx;
				}
				.weight {
					width: 100%;
					color:black;
					padding-left: 10rpx;
					text-align: center;
					position: relative;
					top:50%;
					transform: translate(0, -50%);
				}
				.pull-type {
					color: black;
					width: 100%;
					text-align: center;
					position: relative;
					top:25%;
				}
				.pull-reason {
					color: black;
					text-align: center;
					position: relative;
					top:25%;
				}
				image {
					width: 40rpx;
					height: 40rpx;
					position: relative;
					top:50%;
					transform: translate(0, -50%);
				}
				.remark {
					width: 100%;
					height: 200rpx;
					border:2rpx solid #ffffff;
					margin-left: 24rpx;
					padding: 20rpx;
				}
			}
		}
		
		.bottom {
			position: fixed;
			bottom: 30rpx;
			display: flex;
			width: 100vw;
			margin-top: 60rpx;
			flex-direction: row-reverse;
			.btn {
				background-color: #4191EA;
				color: #ffffff;
				font-size: 32rpx;
				margin-right: 30rpx;
				border-radius: 10rpx;
				padding: 10rpx 20rpx;
			}
		}
	}
	
	.border-line {
		width: 100%;
		height: 1px;
		background-color: #cec7c7;
	}
</style>

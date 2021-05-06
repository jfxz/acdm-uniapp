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
				<input type="number" confirm-type="done" class="num" v-model="form.cargoWeight"/>
			</view>
		</view>
		<view class="border-line"></view>
		
		<view class="row">
			<view class="label">
				件数
			</view>
			<view class="value" style="height: 126rpx;">
				<input type="number" confirm-type="done" class="num" v-model="form.num"/>
			</view>
		</view>
		<view class="border-line"></view>
		
		
		<view class="row" @tap="showTypePicker=true">
			<view class="label">
				外包装
			</view>
			<view class="value" style="height: 126rpx;">
				<view class="input-row select-class">{{form.outerPacking}}</view>
				<image src="@/static/down-arror.png" class="down-arror"></image>
			</view>
		</view>
		<view class="border-line"></view>
		
		<view class="row" @tap="showSpecialTypePicker=true">
			<view class="label">
				类别
			</view>
			<view class="value" style="height: 126rpx;">
				<view class="input-row select-class">{{form.specialType}}</view>
				<image src="@/static/down-arror.png" class="down-arror"></image>
			</view>
		</view>
		<view class="border-line"></view>
		
		<view class="row">
			<view class="label">
				始发站
			</view>
			<view class="value" style="height: 126rpx;">
				<view class="place">{{form.origin}}</view>
			</view>
		</view>
		<view class="border-line"></view>
		
		<view class="row">
			<view class="label">
				目的站
			</view>
			<view class="value" style="height: 126rpx;">
				<view class="place">{{form.destination}}</view>
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
		<u-picker mode="selector" v-model="showSpecialTypePicker" :range="specialTypes" @confirm="setSpecialType"></u-picker>
	</view>
</template>

<script>
	import navBar from '@/pages/cargo/nav-bar.vue'
	import uPicker from '@/pages/cargo/pulldown/components/u-picker.vue'
	import uniCombox from "@/components/uni-combox-new/uni-combox"
	import {updatePulldownCargoInfo, getPulldownReasons, onError} from '@/api/cargo/index.js'
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
				showSpecialTypePicker: false,
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
				types: ['木箱', '硬纸箱', '金属箱', '金属桶', '帆布袋'],
				specialTypes: ['贵货', '危险品'],
				reasons: [],
				fontColor: 'black'
			}
		},
		onLoad () {
			this.form = uni.getStorageSync('costly-remark-item')
			uni.removeStorageSync('costly-remark-item')
		},
		methods: {
			// 清空搜索栏内容
			resetInputValue (label) {
				console.log('before', label, this.form[`${label}`])
				this.form[`${label}`] = ''
				console.log('after', this.form[`${label}`])
			},
			setDate (e) {
				this.form.opDate = e.year + '-' + e.month + '-' + e.day
			},
			setType (e) {
				this.form.outerPacking = this.types[e[0]]
			},
			setSpecialType (e) {
				this.form.specialType = this.specialTypes[e[0]]
			},
			setReason (e) {
				this.form.pullReason = this.reasons[e[0]]
			},
			
			// 获得下拉原因
			getReasons () {
				this.reasons = []
			},
			
			// 提交表单
			submit () {
				if (this.form.status === 'NOTUNLOADER') {
					uni.setStorageSync('back-costly-remark', this.form)
					this.$message('修改备注成功')
					uni.navigateBack()
				} else {
					updatePulldownCargoInfo(this.form).then(res => {
						console.log('back-costly-remark', res)
						if (res.status) {
							this.$message('修改备注成功')
							uni.setStorageSync('back-costly-remark', this.form)
						}
						uni.navigateBack()
					}).catch(err => {
						onError(err)
					})
				}
				//通过请求提交表单，成功后返回主页面，重新获取数据。
				
			},
			
			// 取消
			back () {
				uni.navigateBack()
			}
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
			.select-value {
				margin-top: 30rpx;
				margin-bottom: 30rpx;
				// border: 2rpx solid #BBBBBB;
				margin-right: 50rpx;
				margin-left: 19rpx;
				padding:10rpx;
			}
			.value {
				display: flex;
				width: 100%;
				padding-right: 30rpx;
				.search {
					// border:2rpx solid #A8ABB8;
					background-color: #ffffff;
					height: 64rpx;
					margin: 33rpx 20rpx 30rpx 20rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					.search-input {
						line-height: 64rpx;
						width: 100%;
						// background-color: #e9e9e9;
						background-color: #ffffff;
						font-size: 30rpx;
						color: #A8ABB8;
						display: flex;
						align-items: center;
						padding-left: 0rpx;
					}
				}
				.container-code {
					width: 100%;
					color:black;
					padding-left: 10rpx;
					text-align: center;
					font-size:32rpx;
					line-height: 126rpx;
				}
				.num {
					width: 100%;
					color:black;
					padding-left: 10rpx;
					text-align: center;
					position: relative;
					top:50%;
					transform: translate(0, -50%);
				}
				.select-class {
					color: black;
					width: 100%;
					text-align: center;
					position: relative;
					top:25%;
					left:20rpx;
				}
				.down-arror {
					width: 40rpx;
					height: 40rpx;
					position: relative;
					top:50%;
					transform: translate(0, -50%);
				}
				.place {
					width: 100%;
					color:black;
					padding-left: 10rpx;
					text-align: center;
					font-size:32rpx;
					line-height: 126rpx;
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
	.border-line {
		width: 100%;
		height: 1px;
		background-color: #cec7c7;
	}
</style>

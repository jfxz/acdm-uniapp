<template>
	<view class="cu-modal" :class="showModal==true?'show':''">
		<view class="cu-dialog" style="max-width:620rpx;border: 15upx;">
			<view class="action" @tap="showModal=false">
				<image src="@/static/close-popup.png"
					class="action-image"></image>
			</view>
			<view class="title">
				装卸舱位录入
			</view>
			<view class="modal-dialog-layout">
				<view class="top">
					<view>
						<view class="container-code">{{currentContainer.containerCode}}</view>
						<view>集装器号</view>
					</view>
					<view>
						<view class="container-code">{{currentContainer.cargoWeight || 0}}</view>
						<view>重量</view>
					</view>
					<view>
						<view class="container-code">{{currentContainer.flight}}</view>
						<view>航班号</view>
					</view>
				</view>
				<view class="middle">
					<view style="margin-left: 20rpx;">舱位选择</view>
					<view style="display: flex;justify-content: center;width: 100%;">
						<view class="btns">
							<block v-for="item in cargoHolds" :key="item.name">
								<view :class="{'btn': !item.active, 'btn-selected': item.active}" @tap="checkCargoHolds(item)">
									{{item.name}}
								</view>
							</block>
						</view>
					</view>
				</view>
				<view v-if="showWarn" class="bottom">
					<image style="height:28rpx;width:28rpx;" src="@/static/exclamation-mark.png"></image>
					<view>舱位不一致，请确认后重新选择</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { debounce } from '@/common/util/util.js'
	import { validatenull } from '@/common/util/validate.js'
	import {updateCargoInfo, onError} from '@/api/cargo/index.js'
	export default {
		data () {
			return {
				showModal: false,
				item: {},
				cargoHolds: [{
					name: '1H',
					active: false
				},{
					name: '2H',
					active: false
				},{
					name: '3H',
					active: false
				},{
					name: '4H',
					active: false
				},{
					name: '5H',
					active: false
				}],
				currentContainer: {},
				showWarn: false,
				btnable: true,
				auditedInfo: null,
				userName: ''
			}
		},
		methods: {
			open (item) {
				this.userName = uni.getStorageSync('user_name')
				this.showWarn = false
				this.currentContainer = item
				this.cargoHolds.forEach(e => {
					e.active = false
				})
				if (item.secondCabin) {
					try {
						let obj = JSON.parse(this.currentContainer.meta)
						if (obj && !validatenull(obj) && !validatenull(obj.installedAuditSecond)) {
							this.btnable = false
							this.auditedInfo = obj
						}
					} catch (err) {
						console.log('open-err', err)
					}
				}
				this.showModal = true
			},
			
			updateCargoInfo (obj) {
				updateCargoInfo(obj).then(res => {
					console.log('updateCargoInfo-res', res)
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
			},
			
			// 获得第一个数字的第一位数
			getNumber (str) {
				let arr = str.match(/\d+/g)
				if (arr && arr.length > 0) {
					let s = parseInt(arr[0]) + ''
					return s[0]
				} else {
					return ''
				}
			},
			// 检查舱位是否一致
			
			checkCargoHolds2: debounce(function (item) {
				this.cargoHolds.forEach(e => {
					e.active = false
				})
				item.active = true
				let cargoHoldNow = ''
				if (this.currentContainer.cargoHold) {
					cargoHoldNow = this.getNumber(this.currentContainer.cargoHold)
				}
				let itemCabin = item.name.match(/\d+/g)[0]
				if (this.currentContainer.cargoHold &&(itemCabin === cargoHoldNow)) {
					this.showWarn = false
					this.$message('舱位一致')
					this.showModal = false
				} else {
					uni.vibrateLong()
					this.showWarn = true
					this.voice(cargoHoldNow)
				}
			}),
			checkCargoHolds: debounce(function (item) {
				var that = this
				if (!this.btnable) {
					let auditedInfo = this.auditedInfo
					let first = auditedInfo.installedAuditFirst
					let second = auditedInfo.installedAuditSecond
					this.$message(`${first.cargoHold}舱已被${first.operator}确认过,${second.cargoHold}舱已被${second.operator}确认过`)
					return
				}
				var obj = {}
				this.cargoHolds.forEach(e => {
					e.active = false
				})
				item.active = true
				let selectedCabinObj = null
				let selectedSecondObj = null
				let cargoHoldNow = ''
				if (this.currentContainer.cargoHold) {
					cargoHoldNow = this.getNumber(this.currentContainer.cargoHold)
				}
				// 第二舱位
				let cargoHoldNow2 = ''
				if (this.currentContainer.secondCabin) {
					cargoHoldNow2 = this.getNumber(this.currentContainer.secondCabin)
				}
				let itemCabin = item.name.match(/\d+/g)[0]
				// 没有第二舱位
				if (!this.currentContainer.secondCabin) {
					if (this.currentContainer.cargoHold &&(itemCabin === cargoHoldNow)) {
						this.showWarn = false
						this.$message('舱位一致')
						this.showModal = false
					} else {
						uni.vibrateLong()
						this.showWarn = true
						this.voice(cargoHoldNow)
					}
					return
				}
				
				// 有第二舱位
				try {
					obj = JSON.parse(this.currentContainer.meta)
					// 装机确认已经确认的舱位实体
				} catch (err) {
					console.log('selectedCabin-err', err)
				}
				console.log('obj',obj)
				if (obj) {
					selectedCabinObj = obj.installedAuditFirst
					selectedSecondObj = obj.installedAuditSecond
				}
				if (selectedCabinObj && selectedSecondObj) {
					if (itemCabin === cargoHoldNow) {
						this.$message(`${itemCabin}舱已被${selectedCabinObj.operator}确认过`)
					} else if (itemCabin === cargoHoldNow2) {
						this.$message(`${itemCabin}舱已被${selectedSecondObj.operator}确认过`)
					}
					this.showWarn = true
				} else if (!validatenull(selectedCabinObj)) {
					// 如果这个集装器的舱位已经被选中了。
					if (this.currentContainer.cargoHold === selectedCabinObj.cargoHold) {
						if (itemCabin === cargoHoldNow) {
							this.$message(`${itemCabin}舱已被${selectedCabinObj.operator}确认过`)
							this.showWarn = true
						} else if (itemCabin === cargoHoldNow2){
							this.$message('舱位一致')
							let obj2 = {
								...obj,
								installedAuditSecond: {
									cargoHold: this.currentContainer.secondCabin,
									operator: this.userName
								}
							}
							this.currentContainer.meta = JSON.stringify(obj2)
							this.showWarn = false
							this.showModal = false
							updateCargoInfo(this.currentContainer)
							return
						} else {
							uni.vibrateLong()
							this.showWarn = true
							this.voice(cargoHoldNow)
							setTimeout(function () {
								that.voice(cargoHoldNow2)
							}, 500)
						}
					} else {
						// 如果这个集装器已经被选中了。
						if (this.currentContainer.secondCabin === selectedCabinObj.cargoHold) {
							if (itemCabin === cargoHoldNow2) {
								this.$message(`${itemCabin}舱已被${selectedCabinObj.operator}确认过`)
								this.showWarn = true
							} else if (itemCabin === cargoHoldNow){
								this.$message('舱位一致')
								let obj2 = {
									...obj,
									installedAuditSecond: {
										cargoHold: this.currentContainer.cargoHold,
										operator: this.userName
									}
								}
								this.currentContainer.meta = JSON.stringify(obj2)
								this.showWarn = false
								this.showModal = false
								updateCargoInfo(this.currentContainer)
								return
							} else {
								uni.vibrateLong()
								this.showWarn = true
								this.voice(cargoHoldNow)
								setTimeout(function () {
									that.voice(cargoHoldNow2)
								}, 500)
							}
						}
					}
				} else {
					if (this.currentContainer.cargoHold &&(itemCabin === cargoHoldNow)) {
						let obj2 = {
							...obj,
							installedAuditFirst: {
								cargoHold: this.currentContainer.cargoHold,
								operator: this.userName
							}
						}
						this.currentContainer.meta = JSON.stringify(obj2)
						this.showWarn = false
						this.$message('舱位一致')
						this.showModal = false
						updateCargoInfo(this.currentContainer)
					} else if (this.currentContainer.secondCabin &&(itemCabin === cargoHoldNow2)) {
						let obj2 = {
							...obj,
							installedAuditFirst: {
								cargoHold: this.currentContainer.secondCabin,
								operator: this.userName
							}
						}
						this.currentContainer.meta = JSON.stringify(obj2)
						this.showWarn = false
						this.$message('舱位一致')
						this.showModal = false
						updateCargoInfo(this.currentContainer)
					} else {
						uni.vibrateLong()
						this.showWarn = true
						this.voice(cargoHoldNow)
						setTimeout(function () {
							that.voice(cargoHoldNow2)
						}, 500)
					}
				}
			}),
			voice (cargoHold) {
				const innerAudioContext = uni.createInnerAudioContext()
				innerAudioContext.autoplay = true
				innerAudioContext.src = 'static/' + cargoHold + 'H.mp3'
				innerAudioContext.onPlay(() => {
				  console.log('开始播放')
				})
				innerAudioContext.onError((res) => {
				  console.log(res)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.action {
		.action-image {
			height:61rpx;
			width:61rpx;
			position:absolute;
			right:0rpx;
			z-index:99999;
		}
	}
	.title {
		background-color:#2675E5;
		height:163rpx;
		width:100%;
		font-family: SourceHanSansSC-Medium;
		font-size: 35rpx;
		color: #ffffff;
		text-align:center;
		line-height:176rpx;
	}
	.modal-dialog-layout {
		padding-bottom: 101rpx;
		padding-left: 33rpx;
		padding-right: 35rpx;
		.top {
			display: flex;
			width: 100%;
			justify-content: space-between;
			align-items: center;
			font-family: Roboto-Regular;
			font-size: 25rpx;
			line-height: 25rpx;
			letter-spacing: 1rpx;
			color: #8c8c8c;
			.container-code {
				margin-top: 70rpx;
				margin-bottom: 22rpx;
				font-family: Roboto-Bold;
				font-size: 38rpx;
				font-weight: 900;
				line-height: 38rpx;
				letter-spacing: 2rpx;
				color: #1d7eea;
			}
		}
		.middle {
			margin-top: 35rpx;
			font-family: SourceHanSansSC-Regular;
			font-size: 25rpx;
			letter-spacing: 1rpx;
			color: #a6a6a6;
			text-align: left;
			.btns {
				max-width: 516rpx;
				margin-top: 19rpx;
				margin-bottom: 9rpx;
				display: flex;
				flex-wrap: wrap;
				.btn {
					margin-bottom: 26rpx;
					margin-right: 25rpx;
					width: 146rpx;
					height: 50rpx;
					border-radius: 25rpx;
					border: solid 1rpx #d9d9d9;
					text-align: center;
					font-family: Roboto-Regular;
					font-size: 29rpx;
					letter-spacing: 1rpx;
					color: #595959;
				}
				
				.btn-selected {
					margin-bottom: 26rpx;
					margin-right: 25rpx;
					width: 146rpx;
					height: 50rpx;
					border-radius: 25rpx;
					border: solid 1rpx #d9d9d9;
					text-align: center;
					background-color: #6ec815;
					
					font-family: Roboto-Regular;
					font-size: 29rpx;
					letter-spacing: 1rpx;
					color: #ffffff;
				}
			}
		}
		.bottom {
			font-family: SourceHanSansSC-Regular;
			font-size: 29rpx;
			letter-spacing: 1rpx;
			color: #f30e0e;
			display: flex;
			align-items: center;
		}
	}
</style>

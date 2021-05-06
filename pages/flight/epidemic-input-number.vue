<template>
	<view class="epidemic-input-number-layout">
		<view class="flight-code">{{this.flight.iataCarrier + this.flight.flight}}</view>
		<view class="input-container">
			<scroll-view scroll-y="true" class="scroll-Y">
				<view class="input-part">
					<view class="title-name">{{'总人数'}}</view>
					<view class="input-content">
						<u-input v-model="sendData.total" :type="inputType" :border="border" placeholder="" />
					</view>
				</view>
				<view class="input-part">
					<view class="title-name">{{'大陆人数'}}</view>
					<view class="input-content">
						<u-input v-model="sendData.mainland" :type="inputType" :border="border" placeholder="" />
					</view>
				</view>
				<view class="input-part">
					<view class="title-name">{{'港澳台人数'}}</view>
					<view class="input-content">
						<u-input v-model="sendData.hkMoTaiwan" :type="inputType" :border="border" placeholder="" />
					</view>
				</view>
				<view class="input-part">
					<view class="title-name">{{'其他国籍'}}</view>
					<view class="input-content">
						<u-input v-model="sendData.otherNationality" :type="inputType" :border="border" placeholder="" />
					</view>
				</view>
				<view class="input-part">
					<view class="title-name">{{'发热就医'}}</view>
					<view class="input-content">
						<u-input v-model="sendData.feverTreat" :type="inputType" :border="border" placeholder="" />
					</view>
				</view>
				<view class="input-part">
					<view class="title-name">{{'放行人数'}}</view>
					<view class="input-content">
						<u-input v-model="sendData.release" :type="inputType" :border="border" placeholder="" />
					</view>
				</view>
				<view class="input-part">
					<view class="title-name">{{'送分流点人数'}}</view>
					<view class="input-content">
						<u-input v-model="sendData.sendDiversionPoint" :type="inputType" :border="border" placeholder="" />
					</view>
				</view>
				<view class="input-part">
					<view class="title-name">{{'当日转机(未出候机楼)'}}</view>
					<view class="input-content">
						<u-input v-model="sendData.dayTransfer" :type="inputType" :border="border" placeholder="" />
					</view>
				</view>
				<view class="input-part">
					<view class="title-name">{{'次日转机'}}</view>
					<view class="input-content">
						<u-input v-model="sendData.nextDayTransfer" :type="inputType" :border="border" placeholder="" />
					</view>
				</view>
				<view class="input-part">
					<view class="title-name">{{'现场排查确诊人数'}}</view>
					<view class="input-content">
						<u-input v-model="sendData.siteTroubleshootDiagnose" :type="inputType" :border="border" placeholder="" />
					</view>
				</view>
				<view class="input-part">
					<view class="title-name">{{'送酒店人数'}}</view>
					<view class="input-content">
						<u-input v-model="sendData.sendHotel" :type="inputType" :border="border" placeholder="" />
					</view>
				</view>
				<view class="input-part">
					<view class="title-name">{{'密接留观'}}</view>
					<view class="input-content">
						<u-input v-model="sendData.closeObservation" :type="inputType" :border="border" placeholder="" />
					</view>
				</view>
				<view class="input-part">
					<view class="title-name">{{'酒店分流'}}</view>
					<view class="input-content">
						<u-input v-model="sendData.hotelDiversion" :type="inputType" :border="border" placeholder="" />
					</view>
				</view>
				<view class="input-part">
					<view class="title-name">{{'次日以后转机'}}</view>
					<view class="input-content">
						<u-input v-model="sendData.afterNextDayTransfer" :type="inputType" :border="border" placeholder="" />
					</view>
				</view>
				<view class="input-part">
					<view class="title-name">{{'密切接触旅客'}}</view>
					<view class="input-content">
						<u-input v-model="sendData.closeContact" :type="inputType" :border="border" placeholder="" />
					</view>
				</view>
				<view class="input-part" v-if="flight.flightNature==='D'">
					<view class="title-name">{{'现场采样人数'}}</view>
					<view class="input-content">
						<u-input v-model="sendData.siteCollection" :type="inputType" :border="border" placeholder="" />
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="btn-container">
			<view class="btn">
				<u-button type="primary" style="height: 75rpx;" @click="reset">重置</u-button>
			</view>
			<view class="btn">
				<u-button type="success" style="height: 75rpx;" @click="summitCheck">提交</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import * as flightApi from "@/api/flight/index.js"
	export default {
		data() {
			return {
				flight: '',
				value: '',
				inputType: 'number',
				border: true,
				peopleNumber: '',
				sendData: {
					total: '', //总数
					mainland: '', //大陆人数
					hkMoTaiwan: '', //港澳台人数
					otherNationality: '', //其他国籍
					feverTreat: '', //发热就医人数
					release: '', //放行人数
					sendDiversionPoint: '', //送分流点人数
					dayTransfer: '', //当日转机
					nextDayTransfer: '', //次日转机人数
					siteTroubleshootDiagnose: '', //现场排查确诊人数
					sendHotel: '', //送酒店人数
					closeObservation: '', //密接留观人数
					hotelDiversion: '', //酒店分流人数
					afterNextDayTransfer: '', //次日以后转机人数
					closeContact: '', //密切接触旅客人数
					siteCollection: '', //现场采样人数
					flightId: '' //航班id
				},
				defaultData: {
					mainland: '', //大陆人数
					hkMoTaiwan: '', //港澳台人数
					otherNationality: '', //其他国籍
					feverTreat: '', //发热就医人数
					release: '', //放行人数
					sendDiversionPoint: '', //送分流点人数
					dayTransfer: '', //当日转机
					nextDayTransfer: '', //次日转机人数
					siteTroubleshootDiagnose: '', //现场排查确诊人数
					sendHotel: '', //送酒店人数
					closeObservation: '', //密接留观人数
					hotelDiversion: '', //酒店分流人数
					afterNextDayTransfer: '', //次日以后转机人数
					closeContact: '', //密切接触旅客人数
					siteCollection: '', //现场采样人数
				},
				isEdit: false
			}
		},
		onLoad(e) {
			this.flight = JSON.parse(e.flight)
			this.sendData.flightId = this.flight.id
			this.getList()
			console.log('data121212', e, this.flight)
		},
		methods: {
			getList() {
				flightApi.getEpidemicNumber({
					flightId: this.flight.id
				}).then(res => {
					if (res.status) {
						if (res.data) {
							this.sendData = res.data
							this.isEdit = true
						}
					} else {
						this.$message(res.message)
					}
				})
			},
			//提交
			summit() {
				//编辑
				if (this.isEdit) {
					flightApi.editEpidemicNumber(this.sendData).then(res => {
						this.$message(res.message)
					})
				} else { //新增
					flightApi.addEpidemicNumber(this.sendData).then(res => {
						if (res.status) {
							this.isEdit = true
						}
						this.$message(res.message)
					})
				}
			},
			//提交校验
			summitCheck() {
				let warnTips = []
				let handleNum = 0
				let nationalityNum = 0
				let index = 0
				for (let obj in this.defaultData) {
					if (obj === 'mainland' || obj === 'hkMoTaiwan' || obj === 'otherNationality') {
						handleNum = handleNum + Number(this.sendData[obj])
					} else {
						nationalityNum = nationalityNum + Number(this.sendData[obj])
					}
				}
				if (handleNum !== Number(this.sendData.total)) {
					warnTips[index] = '总人数与国籍人数不相等'
					index++
				}
				if (nationalityNum !== Number(this.sendData.total)) {
					warnTips[index] = '总人数与处置情况人数不相等'
				}
				if (warnTips.length > 0) {
					//航班属性为d 国内
					uni.showModal({
						title: '提示',
						content: warnTips.join() + '是否提交?',
						success: (res) => {
							if (res.confirm) {
								this.summit()
								console.log('用户点击确定');
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					})
				} else {
					this.summit()
				}
			},
			//重置
			reset() {
				this.sendData.total = ''
				this.sendData.mainland = ''
				this.sendData.hkMoTaiwan = ''
				this.sendData.otherNationality = ''
				this.sendData.feverTreat = ''
				this.sendData.release = ''
				this.sendData.sendDiversionPoint = ''
				this.sendData.nextDayTransfer = ''
				this.sendData.siteTroubleshootDiagnose = ''
				this.sendData.sendHotel = ''
				this.sendData.closeObservation = ''
				this.sendData.hotelDiversion = ''
				this.sendData.afterNextDayTransfer = ''
				this.sendData.closeContact = ''
				this.sendData.dayTransfer = ''
				this.sendData.siteCollection = ''
			}
		}
	}
</script>

<style lang="scss">
	.epidemic-input-number-layout {
		width: 100%;

		.flight-code {
			height: 100rpx;
			line-height: 100rpx;
			text-align: center;
			font-weight: 700;
			font-size: 45rpx;
		}

		.input-container {
			margin-top: 2rpx;

			.scroll-Y {
				width: 100%;
				height: calc(100vh - 250rpx);

				.input-part {
					width: 100%;
					height: 70rpx;
					line-height: 70rpx;
					display: flex;
					justify-content: flex-start;
					font-size: 30rpx;
					margin-bottom: 25rpx;

					.title-name {
						font-weight: bold;
						line-height: 40rpx;
						margin: auto 0;
						padding: 0rpx 30rpx;
						width: 30%;
					}

					.input-content {
						height: 100rpx;
						width: 65%;
					}
				}
			}
		}

		.btn-container {
			height: 120rpx;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			padding-right: 20rpx;

			.btn {
				width: 150rpx;
				margin-right: 35rpx;
			}

		}
	}
</style>

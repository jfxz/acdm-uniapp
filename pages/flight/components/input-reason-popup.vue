/*
* 界面名称:航班详情保障节点，接电源输入原因弹窗
* 界面功能:1.选择原因 2.输入原因 。两者都存在,原因优先取输入原因
* 其他 :
* 时间 :2021-04-28
* 作者 :wlf
*/
<template>
	<view class="popup-container">
		<u-popup v-model="showed" mode="center" width="90%" height="400rpx" :mask-close-able="false">
			<view class="reason-popup">
				<u-form :model="form" ref="uForm">
					<u-form-item>
						<text style="padding-right: 20rpx;">选择原因</text>
						<u-input v-model="form.selectReason" type="select" :border="border" @click="showSheet = true" placeholder="请选择原因" />
					</u-form-item>
					<u-form-item>
						<text style="padding-right: 20rpx;">输入原因</text>
						<u-input v-model="form.inputReason" type="text" :border="border" placeholder="请输入原因" />
					</u-form-item>
					<u-form-item>
						<u-button @click="submitReason('cancel')" style="width:45%" type="primary">取消</u-button>
						<u-button @click="submitReason('submit')" style="width:45%" type="primary" :disabled="buttonLoading" :loading="buttonLoading">提交</u-button>
					</u-form-item>
				</u-form>
			</view>
		</u-popup>
		<u-select v-model="showSheet" mode="single-column" :list="reasonList" @confirm="confirm" @cancel="cancel" cancel-text="清空"
		 :default-value="selectIndex"></u-select>
	</view>
</template>

<script>
	import * as flightApi from "@/api/flight/index.js"
	export default {
		props: {
			selectReasonList: {
				type: Object,
				default: () => {}
			},
			callback: Function
		},
		data() {
			return {
				showed: false,
				showSheet: false,
				border: true,
				reasonList: [],
				form: {
					selectReason: '',
					inputReason: ''
				},
				optData: '', //传入当前节点项
				buttonLoading: false, //按钮加载
				selectIndex: [0] //默认选中
			}
		},
		mounted() {
			//初始化下拉选择列表
			if (this.selectReasonList && this.selectReasonList.BRIDGE_NON_USEREASON) {
				this.reasonList = []
				this.selectReasonList.BRIDGE_NON_USEREASON.forEach((item, index) => {
					this.reasonList.push({
						value: item.remark,
						label: item.remark
					})
				})
			}
		},
		methods: {
			init(item) {
				this.form.selectReason = ''
				this.form.inputReason = ''
				this.buttonLoading = false
				this.showed = true
				this.optData = item
				if (item.remark) {
					//防止下拉数据源异常
					if (this.reasonList && this.reasonList.length > 0) {
						//如果获取到的备注为下拉选项某一项则为绑定下拉选择
						//如果获取到的备注不为下拉选项某一项则为绑定输入框
						let isSelectIndex = this.reasonList.findIndex(key => key.value === item.remark)
						console.log('isSelectIndex',isSelectIndex)
						if (isSelectIndex !== -1) {
							this.selectIndex = [isSelectIndex]
							this.form.selectReason = item.remark
						} else {
							this.selectIndex = [0]
							this.form.inputReason = item.remark
						}
					}
				}
			},
			// 确认回调
			confirm(param) {
				this.form.selectReason = param[0].value
			},
			// 取消回调
			cancel(param) {
				this.form.selectReason = ''
			},
			//提交
			submitReason(type) {
				if (type === 'cancel') {
					this.showed = false
				}
				if (type === 'submit') {
					this.buttonLoading = true
					let data = {
						remark: '',
						activityId: this.optData.id
					}
					//判断原因的值 有输入选择输入原因，没有输入选选择原因
					if (this.form.inputReason) {
						data.remark = this.form.inputReason
					} else if (this.form.selectReason) {
						data.remark = this.form.selectReason
					} else {
						data.remark = ''
					}
					flightApi.postGmsOperate(data).then(res => {
						if (res.status) {
							this.$message('提交成功')
							this.callback && this.callback()
							setTimeout(() => {
								this.showed = false
								this.buttonLoading = false
							}, 500)
						} else {
							this.$message(res.message)
						}
					}).catch(err => {
						this.buttonLoading = false
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	.popup-container {
		width: 100%;
		height: 100%;

		.reason-popup {
			height: 100%;
			width: 100%;
			padding: 20rpx 25rpx;

			.u-select__body {
				height: 800rpx;
			}
		}
	}
</style>

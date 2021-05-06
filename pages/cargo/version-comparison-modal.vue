<template>
	<view class="cu-modal" :class="showModal==true?'show':''">
		<view class="cu-dialog" style="max-width:582rpx;border-radius: 21upx;">
			
			<view class="modal-dialog-layout-change">
				<view class="top">
					<view class="font">{{title}}</view>
				</view>
				<view class="middle">
					<u-checkbox-group
						:label-disabled="true"
						max="2"
					  :wrap="true">
						<u-checkbox
							:label-disabled="false"
							style="padding-left: 30rpx;margin-bottom: 20rpx;"
							@change="checkboxChange" 
							v-for="(item, index) in list" :key="index"
							v-model="item.checked"
							:name="item.name">
							<view class="row">
								{{item.name}}
							</view>
							
						</u-checkbox>
					</u-checkbox-group>
				</view>
				<view class="btns">
					<view class="cancel" @tap="close">取消</view>
					<view class="confirm" @tap="confirm">确定</view>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: '选择历史装机单版本'
			}
		},
		data () {
			return {
				showModal: false,
				list: [],
				currentCheck: '',
				leftVersion: '',
				rightVersion: ''
			}
		},
		methods: {
			open (list) {
				this.list = []
				this.leftVersion = ''
				this.rightVersion = ''
				for (let versionName of list) {
					this.list.push({
						name: versionName,
						disabled: false
					})
				}
				if (this.list.length > 0) {
					this.currentCheck = this.list[0].name
					this.showModal = true
				}
			},
			checkboxChange (e) {
				if (e.value) {
					console.log('checkboxChange', e.name)
				}
			},
			close () {
				this.showModal = false
			},
			confirm () {
				for (let i = 0; i < this.list.length; i++) {
					let e = this.list[i]
					if (e.checked === true) {
						if (this.leftVersion === '') {
							this.leftVersion = e.name
						} else {
							this.rightVersion = e.name
							break
						}
					}
				}
				if (this.leftVersion !=='' && this.rightVersion !== '') {
					console.log('modal-', this.leftVersion, this.rightVersion)
					this.$emit('change', this.leftVersion, this.rightVersion)
				} else {
					this.$message('请选择两个版本进行比对')
				}
				
				this.showModal = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.modal-dialog-layout-change {
		padding-bottom: 43rpx;
		padding-left: 67rpx;
		padding-right: 67rpx;
		.top {
			padding-top: 30rpx;
			.font {
				font-family: SourceHanSansSC-Medium;
				font-size: 35rpx;
				letter-spacing: 2rpx;
				font-weight: bold;
				color: #262626;
			}
		}
		.middle {
			margin-top: 39rpx;
			margin-bottom: 29rpx;
			.row {
				text-align: left;
				min-width: 400rpx;
				padding:{
					left: 20rpx;
				}
			}
			.line {
				width: 580rpx;
				height: 1rpx;
				border: solid 1rpx #e5e5e5;
				margin-bottom: 24rpx;
			}
		}
		.btns  {
			display: flex;
			width: 100%;
			justify-content: center;
			.cancel {
				width: 206rpx;
				height: 69rpx;
				line-height: 63rpx;
				border-radius: 35rpx;
				border: solid 1rpx #2675e5;
				
				font-family: SourceHanSansSC-Regular;
				font-size: 33rpx;
				letter-spacing: 2rpx;
				color: #008ffd;
				margin-right: 39rpx;
			}
			.confirm {
				width: 206rpx;
				height: 69rpx;
				line-height: 63rpx;
				background-color: #008ffd;
				border-radius: 35rpx;
				
				font-family: SourceHanSansSC-Regular;
				font-size: 33rpx;
				letter-spacing: 2rpx;
				color: #ffffff;
			}
		}
	}
</style>

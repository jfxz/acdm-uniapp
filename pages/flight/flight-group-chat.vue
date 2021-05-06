<template>
	<tui-modal :show="newGroupShow" @cancel="hideNewGroupShow" :custom="true" fadeIn>
		<view class="tui-modal-custom">
			<view class="tui-prompt-title">创建群聊</view>
			<view class="modal-form-item">
				<view class="modal-form-item-label">
					<view>群名称</view>
				</view>
				<input placeholder="请输入群名称" class="tui-modal-input" v-model="groupChatForm.channelName"/>
			</view>
			<view class="modal-form-item">
				<view class="modal-form-item-label">
					<view>小标题</view>
				</view>
				<input placeholder="请输入群小标题" class="tui-modal-input" v-model="groupChatForm.channelHeader"/>
			</view>
			<view class="modal-form-item">
				<view class="modal-form-item-label">
					<view>群描述</view>
				</view>
				<input placeholder="请为此群输入一段描述" class="tui-modal-input" v-model="groupChatForm.channelDescription"/>
			</view>
			<view class="modal-form-item">
				<view class="modal-form-item-label">
					<view>好友</view>
				</view>
				<view class="tui-modal-input" style="min-height:42rpx;" @click="selectFirends">
					{{groupChatForm.userNameList.length>0?groupChatForm.userNameList:''}}
				</view>
			</view>
			<button height="72rpx" :size="28" @click="creatGroupByFlight">立即提交</button>
		</view>
	</tui-modal>
</template>

<script>
	import tuiModal from '@/components/thorui/modal/modal.vue'
	import {USER_TYPE} from '@/common/dic'
	import {creatGroupByFlight} from '@/api/imApi/admin.js'
	import {mapGetters} from 'vuex'
	export default{
		components:{
			tuiModal
		},
		data(){
			return{
				newGroupShow: false,
				userId:'',
				// 创建群聊表单
				groupChatForm: {
					channelName: '',
					channelHeader: '',
					channelDescription: '',
					userId: '',
					// 选择的好友的id列表
					userIdList: [],
					// 选择的好友的名字列表
					userNameList: [],
					userList: []
				}
			}
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		methods: {
			open(val1,val2, flight){ //跳转传参
				console.log('flight', flight)
				// return
				this.groupChatForm.channelName = val1
				this.userId=val2
				this.creatGroupByFlight(flight)
				// this.handleCreatGroup()
				// this.newGroupShow=true
				console.log('测试测试',val1,val2)
			},
			// 关闭创建群聊对话框
			hideNewGroupShow () {
				this.newGroupShow = false
			},
			// 选择好友页面结束后设置好友数据
			setNewUser(val) {
				this.groupChatForm.userNameList = val.userNameList.join(',')
				this.groupChatForm.userIdList = val.userIdList
				this.groupChatForm.selectUser = val.userList // 用于第二次编辑时初始化的数据
				this.$store.dispatch('cleanSelectFirend')
			},
			selectFirends () {
				if (this.groupChatForm.userIdList.length > 0) {
					this.$store.dispatch('setSelectFirend', this.groupChatForm.selectUser)
				}
				uni.navigateTo({
					url: '../message/selectFriend?backFlag=true'
				})
			},
			
			// 根据航班信息创建群聊
			creatGroupByFlight (flight) {
				let form = this.groupChatForm
				let obj = {
					airportCode: flight.airportCode,
					opdate: flight.opdate
				}
				if (flight.direction === 'A') {
					obj.arrFlight = flight.flight
					obj.arrCarrier = flight.iataCarrier
				} else {
					obj.depFlight = flight.flight
					obj.depCarrier = flight.iataCarrier
				}
				creatGroupByFlight(obj).then(res => {
					console.log('creatGroupByFlight', res)
					if (res.status) {
						uni.showToast({
							title: '聊天群创建成功',
							duration: 1000,
							icon: 'none'
						})
						// 更新通讯录
						this.$store.dispatch('setMessageList')
						
						// this.$message('聊天群创建成功')
						this.newGroupShow = false
						// 创建成功后直接跳转聊天
						let item = {
							unReadMsg: 0
						}
						let newGroupInfo = res.data
						let channelId = newGroupInfo.id
						uni.setStorageSync('newGroupInfo', res.data)
						uni.showLoading({
							title: '加载中'
						})
						uni.navigateTo({
							url: '../message/groupChat?type=' + USER_TYPE.GROUP + '&createGroupChat=' + 'true'
						})
					} else {
						this.$message('聊天群创建失败')
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.tui-modal-custom {
		text-align: center;
		.tui-prompt-title {
			padding-bottom: 20rpx;
			font-size: 34rpx;
		}
		.modal-form-item {
			display: flex;
			.tui-modal-input {
				width: 80%;
				border-bottom: 1rpx solid #e6e6e6;
				margin: 30rpx auto 50rpx;
				font-size: 32rpx;
			}
			.modal-form-item-label {
				margin-rigth: 15rpx;
				position: relative;
				width: 100rpx;
			}
			.modal-form-item-label>view {
				position: absolute;
				top: 25%;
			}
		}
	}
</style>

<template>
	<view>
		<nav-bar
			 title="出库截关"
			:show-scan="false"
			:content-not-null="true"
			:input-value="inputValue"
			:place-holder="'请输入航班号'"
			:show-search-bar="showSearchBar"
			:show-close-off="true"
			:unreadMsgNum="unreadMsgNum"
			:clear-after-input="false"
			:show-refresh-btn="true"
			:show-close-off-scan-btn="true"
			@closeoffScan="scanCode"
			@refreshList="getCloseoffData"
			@jumptest="jumptest"
			@openMessages="openMessages"
			@inputGetCargoInfo="getFlights"
			@resetInputValue="resetInputValue"
			@changeSearchBarStatus="changeSearchBarStatus">
		</nav-bar>
		
		<list-content
			 ref="listContent"
			:dont-show-none-list="true"
			:show-search-bar="showSearchBar"
			:content-not-null="list.length!=0"
			@clickCard="clickCard"
			@updateList="updateList"
			@updateCargoInfo="updateCargoInfoNoToast">
			<template v-slot:cardIcon>
				<image style="width:54rpx;height:54rpx;" src="@/static/flight-cargo.png"></image>
			</template>
			<template v-slot:cardRight="scope">
				<flight-card
					:item-ori="scope.item">
				</flight-card>
			</template>
		</list-content>
		
		<bottom-popup-to-place
			 btn="修改"
			 title="选择状态"
			 ref="bottomPopupToPlace"
			:locations-ori="statuses"
			@confirm="changeFlightStatus">
		</bottom-popup-to-place>
		
		<flight-sort-modal
			ref="flightSortModal">
		</flight-sort-modal>
		
		<confirm-modal
			title="新版本提醒"
			ref="confirmModal"
		 @check="remindCheck">
		</confirm-modal>
	</view>
</template>

<script>
	import navBar from '@/pages/cargo/nav-bar.vue'
	import listContent from '@/pages/cargo/list-content.vue'
	import dayjs from '@/common/util/dayjs.min.js'
	import cargoMixin from '@/pages/cargo/cargo-mixin.js'
	import flightCard from '@/pages/cargo/leaveport/components/closeoff-card'
	import bottomPopupToPlace from '@/pages/cargo/bottom-popup-to-place.vue'
	import { DIC } from '@/common/dic.js'
	import flightSortModal from '@/pages/cargo/leaveport/components/flight-sort-modal.vue'
	import {
		onError,
		getCloseoffData,
		getCloseoffMessage,
		getCloseoffVersionRemind
	} from '@/api/cargo/index.js'
	import confirmModal from '@/pages/cargo/leaveport/components/closeoff-remind-modal.vue'
	import {mapGetters} from 'vuex'
	import { validatenull } from '@/common/util/validate.js'
	export default {
		mixins: [cargoMixin],
		components: {
			navBar,
			listContent,
			flightCard,
			bottomPopupToPlace,
			flightSortModal,
			confirmModal
		},
		data() {
			return {
				// 接收所有集装器信息
				containers: [],
				// 航班列表
				list: [],
				// 状态列表
				statuses: [{
					id: '0',
					title: '未复称',
					name: '未复称',
					selected: false
				}, {
					id: '1',
					title: '已复称',
					name: '已复称',
					selected: false
				}, {
					id: '2',
					title: '已出库',
					name: '已出库',
					selected: false
				}],
				// 被修改的航班
				selectedFlight: {},
				menuStatus: true,
				page: {
					pageNumber: 1,
					pageSize: 1000
				},
				searchBackUp: [],
				inputNotNull: false,
				unreadMsgNum: 0
			}
		},
		onLoad (e) {
			if (e.hasOwnProperty('history') && e.history === 'true') {
				this.history = true
			}
		},
		mounted () {
      this.$loading()
			this.getCloseoffData()
			this.getCloseoffVersionRemind()
		},
		computed: {
			...mapGetters(['newVersionMsg', 'oriCloseOffList'])
		},
		
		watch: {
			newVersionMsg: {
				handler(newval) {
					this.getCloseoffVersionRemind()
				}
			},
			oriCloseOffList: {
				handler (newval) {
					this.getCloseoffData()
				},
				deep: true
			}
		},
		
		methods: {
			// 获取未读的截关异常消息数目
			getMessageNumber () {
				let userId = uni.getStorageSync('user_id')
				getCloseoffMessage({
				  userId: userId,
					isRead: 0
				}).then(res => {
					console.log('getMessageNumber-res', res)
					if (res.status) {
						this.unreadMsgNum = res.data.length
					}
					if (this.oriCloseOffList.length !== 0) {
						setTimeout(function () {
							uni.hideLoading()
						}, 4000)
					}
				}).catch(err => {
					onError(err)
				})
			},
			// 模糊搜索航班
			getFlights (e) {
				this.page.pageNumber = 1
				if (e === '') {
					this.inputNotNull = false
					this.list = this.listBackUp.slice()
					this.$refs.listContent.setFlightList(this.list)
					this.searchBackUp = []
				} else {
					this.inputNotNull = true
					e = e.toUpperCase()
					this.searchBackUp = this.listBackUp.filter(function (v) {
						if (v.flight) {
							return v.flight.indexOf(e) !== -1
						}
						return false
					})
					this.list = this.searchBackUp.slice(0, this.page.pageSize)
					this.$refs.listContent.setFlightList(this.list)
				}
			},
			getCloseoffData() {
				// this.$loading()
				if (this.oriCloseOffList.length !== 0) {
					this.list = this.oriCloseOffList
					this.listBackUp = [...this.list]
          // this.$refs.listContent.setOutStockFlightList([])
					this.$refs.listContent.setOutStockFlightList(this.list)
          setTimeout(function () {
          	uni.hideLoading()
          }, 2000)
				}
			},
			
			compareStatus (a, b) {
				let aIdx = DIC.CARGOSTATUSD.findIndex(e => e === a.status)
				let bIdx = DIC.CARGOSTATUSD.findIndex(e => e === b.status)
				if (aIdx < bIdx) {
					return false
				} else {
					return true
				}
			},
			
			clickCard (e) {
				console.log('clickCard', e)
				let containers = e.arr
				containers.sort((a, b) => this.compareStatus(a, b))
				let flight = e.flight
				let flightId = e.flightId
				uni.setStorageSync('closeoff_car', containers)
				let url = `/pages/cargo/leaveport/out-stock-closeoff-containers?flight=${flight}&flightId=${flightId}`
				if (e.closeoffTime) {
					let closeoffTime = e.closeoffTime
					url += `&closeoffTime=${closeoffTime}`
				}
				if (e.scheduleDepTime) {
					let scheduleDepTime = e.scheduleDepTime
					url += `&scheduleDepTime=${scheduleDepTime}`
				}
        if (e.closeOperateTime) {
        	let closeOperateTime = e.closeOperateTime
        	url += `&closeOperateTime=${closeOperateTime}`
        }
				uni.navigateTo({
					url: url
				})
			},
			
			jumptest () {
				uni.navigateTo({
					url: `/pages/cargo/leaveport/out-stock-closeoff-containers`
				})
			},
			
			changeFlightStatus (status) {
				if (status === '未复称') {
					this.selectedFlight.status = 'NOTRECLAIMED'
				} else if (status === '已复称') {
					this.selectedFlight.status = 'RECLAIMED'
				} else if (status === '已出库') {
					this.selectedFlight.status = 'OUTOFSTOCK'
				}
				// console.log('this.selectedFlight', this.selectedFlight)
				this.selectedFlight.number = this.selectedFlight.arr.filter(v => v.status === this.selectedFlight.status).length
				this.$refs.listContent.changeStatus(this.selectedFlight)
			},
			openStatusList (e) {
				let id = e.id
				this.selectedFlight = this.list.find(e => e.id === id)
				this.changeFlightStatus(e.status)
			},
			openMessages () {
				uni.navigateTo({
					url: `/pages/cargo/leaveport/out-stock-closeoff-bell-page`
				})
			},
			getCloseoffVersionRemind () {
				if (!validatenull(this.newVersionMsg)) {
					// this.$refs.confirmModal.open(this.newVersionMsg)
				}
			},
			remindCheck (flight) {
				let flightObj = this.list.find(e => e.flight === flight)
				if (!flightObj) {
					this.$message('出库截关无此航班')
					return
				}
				let arr = flightObj.arr
				let flightId = ''
				if (!validatenull(arr)) {
					uni.setStorageSync('closeoff_car', arr)
					flightId = arr[0].flightId
					uni.navigateTo({
						url: `/pages/cargo/leaveport/out-stock-closeoff-containers?flight=${flight}&flightId=${flightId}`
					})
				} else {
					this.$message('该航班无集装器数据')
				}
			},
			
			scanCode () {
				var that = this
				var uld = ''
				uni.scanCode({
					scanType: ['barCode', 'qrCode'],
					onlyFromCamera: false,
					success: function (res) {
						console.log('scancode' + res)
						that.$loading()
						console.log('条码类型：' + res.scanType)
						console.log('条码内容：' + res.result)
						let arr = res.result.split('#')
						if (arr.length > 1) {
							uld = arr[0].slice(5)
						} else {
							uld = arr[0]
						}
						uni.navigateTo({
							url: `/pages/cargo/leaveport/out-stock?fromCloseOff=true&uld=${uld}`
						})
					}
				})
			},
		}
	}
</script>
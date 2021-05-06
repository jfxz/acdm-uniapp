<template>
	<view>
		<nav-bar
			 title="选择"
			:show-scan="false"
			:content-not-null="true"
			:input-value="inputValue"
			:place-holder="'请输入航班号'"
			:show-search-bar="showSearchBar"
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
					:item-ori="scope.item"
					@clickStatus="openStatusList">
				</flight-card>
			</template>
		</list-content>
		
		<u-loadmore bg-color="#F1F1F1" style="padding-bottom: 30rpx;" :status="loadStatus" @loadmore="loadList"/>
		
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
	</view>
</template>

<script>
	import navBar from '@/pages/cargo/nav-bar.vue'
	import listContent from '@/pages/cargo/list-content.vue'
	import dayjs from '@/common/util/dayjs.min.js'
	import cargoMixin from '@/pages/cargo/cargo-mixin.js'
	import flightCard from '@/pages/cargo/leaveport/components/flight-card.vue'
	import bottomPopupToPlace from '@/pages/cargo/bottom-popup-to-place.vue'
	import { DIC } from '@/common/dic.js'
	import flightSortModal from '@/pages/cargo/leaveport/components/flight-sort-modal.vue'
	import {
		onError,
		getOutStockSelection
	} from '@/api/cargo/index.js'
	export default {
		mixins: [cargoMixin],
		components: {
			navBar,
			listContent,
			flightCard,
			bottomPopupToPlace,
			flightSortModal
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
					pageSize: 15
				},
				loadStatus: 'loadmore',
				searchBackUp: [],
				inputNotNull: false
			}
		},
		onReachBottom () {
			this.loadList()
		},
		onLoad (e) {
			if (e.hasOwnProperty('history') && e.history === 'true') {
				this.history = true
			}
		},
		mounted () {
			this.$loading()
			this.getOutStockSelection()
		},
		methods: {
			// 模糊搜索航班
			getFlights (e) {
				this.page.pageNumber = 1
				if (e === '') {
					this.inputNotNull = false
					this.list = this.listBackUp.slice(0, this.page.pageSize)
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
			getOutStockSelection() {
				this.loadStatus = 'loading'
				let today = dayjs().format('YYYY-MM-DD')
				let tomo = dayjs().add(1, 'day').format('YYYY-MM-DD')
				getOutStockSelection().then(res => {
					// console.log('getOutStockSelection', res)
					if (res.status) {
						if (res.data.length === 0) {
							this.loadStatus = 'nomore'
						}
						let index = 0
						if (res.data.hasOwnProperty('noCloseOff') && res.data.noCloseOff) {
							for (let key in res.data.noCloseOff) {
								let arr = [...res.data.noCloseOff[key]]
								let obj = {
									id: index++,
									flight: key,
									opDate: '',
									status: 'RECLAIMED',
									number: arr? arr.filter(e => e.status === 'RECLAIMED').length : 0,
									abnormal: false,
									abNumber: 0,
									closeOffSum: 0,
									arr: arr
								}
								if (arr[0].opDate) {
									obj.opDate = arr[0].opDate.substr(0, 10)
								}
								if (arr.find(e => e.abnormal === '1')) {
									obj.abnormal = true
									obj.abNumber = arr.filter(e => e.abnormal === '1').length
								}
								if (arr.find(e => e.ifliAbnormal && e.ifliAbnormal === '1')) {
									obj.ifliAbnormal = true
									obj.ifliNumber = arr.filter(e => e.ifliAbnormal === '1').length
								}
								this.list.push(obj)
							}
						}
						if (res.data.hasOwnProperty('closeOff') && res.data.closeOff) {
							for (let key in res.data.closeOff) {
								let arr = [...res.data.closeOff[key]]
								let obj = {
									id: index++,
									flight: key,
									opDate: '',
									status: 'RECLAIMED',
									number: arr ? arr.filter(e => e.status === 'RECLAIMED').length : 0,
									abnormal: false,
									closeOffSum: arr.length,
									abNumber: 0,
									arr: arr
								}
								if (arr[0].opDate) {
									obj.opDate = arr[0].opDate.substr(0, 10)
								}
								if (arr.find(e => e.abnormal === '1')) {
									obj.abnormal = true
									obj.abNumber = arr.filter(e => e.abnormal === '1').length
								}
								if (arr.find(e => e.ifliAbnormal && e.ifliAbnormal === '1')) {
									obj.ifliAbnormal = true
									obj.ifliNumber = arr.filter(e => e.ifliAbnormal === '1').length
								}
								this.list.push(obj)
							}
						}
						
						this.list.sort((a, b) => b.number - a.number)
						this.listBackUp = [...this.list]
						this.list = this.list.slice(0, this.page.pageSize)
						this.$refs.listContent.setFlightList(this.list)
						this.loadStatus = 'loadmore'
						let arr = []
						let arrIfli = []
						arr = this.listBackUp.filter(e => e.abnormal)
						arrIfli = this.listBackUp.filter(e => e.ifliAbnormal)
						if (arr.length > 0 || arrIfli.length > 0) {
							this.$refs.flightSortModal.open(arr, arrIfli)
							uni.vibrateLong()
						}
					} else {
						this.loadStatus = 'nomore'
					}
					
					this.$message(res.message)
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
			},
			
			loadList () {
				if (this.inputNotNull) {
					this.loadStatus = 'loading'
					this.page.pageNumber++
					let start = (this.page.pageNumber - 1) * this.page.pageSize
					let end = start + this.page.pageSize
					this.list = this.list.concat(this.searchBackUp.slice(start, end))
					this.$refs.listContent.setFlightList(this.list)
					if (!(this.list.length < this.searchBackUp.length)) {
						this.loadStatus = 'nomore'
					} else {
						this.loadStatus = 'loadmore'
					}
				} else {
					this.loadStatus = 'loading'
					let list = this.listBackUp.slice(this.page.pageNumber * this.page.pageSize, (1 + this.page.pageNumber) * this.page.pageSize)
					this.list = this.list.concat(list)
					this.$refs.listContent.pushToFlightList(list)
					this.page.pageNumber++
					if (!(this.list.length < this.listBackUp.length)) {
						this.loadStatus = 'nomore'
					} else {
						this.loadStatus = 'loadmore'
					}
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
				let containers = e.arr
				containers.sort((a, b) => this.compareStatus(a, b))
				uni.setStorageSync('out-stock-sort-car', containers)
				uni.navigateTo({
					url: `/pages/cargo/sort-page?operationType=STATIONHANDOVER&direction=D&pageName=out-stock&portDirection=leaveport&closeOffSum=${e.closeOffSum}`
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
			}
		}
	}
</script>
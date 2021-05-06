/*
* 界面名称:拉下确认-选择-航班列表
* 界面功能:
* 其他    :
* 时间    :2020-10-19 15:05:09
* 作者    :gyb
*/
<template>
	<view>
		<nav-bar
			 title="选择"
			:place-holder="'请输入航班号'"
			:content-not-null="true"
			:show-search-bar="showSearchBar"
			:input-value="inputValue"
			:show-scan="false"
			@resetInputValue="resetInputValue"
			@inputGetCargoInfo="getFlights"
			@changeSearchBarStatus="changeSearchBarStatus">
		</nav-bar>
		
		<list-content
			 ref="listContent"
			:content-not-null="list.length!=0"
			:show-search-bar="showSearchBar"
			:dont-show-none-list="true"
			@updateCargoInfo="updateCargoInfoNoToast"
			@updateList="updateList"
			@clickCard="clickCard">
			<template v-slot:cardIcon>
				<image style="width:54rpx;height:54rpx;" src="@/static/flight-cargo.png"></image>
			</template>
			<template v-slot:cardRight="scope">
				<unloading-flight-card
					:item-ori="scope.item">
				</unloading-flight-card>
			</template>
		</list-content>
		
		<u-loadmore bg-color="#F1F1F1" style="padding-bottom: 30rpx;" :status="loadStatus" @loadmore="loadList"/>
	</view>
</template>

<script>
	import navBar from '@/pages/cargo/nav-bar.vue'
	import listContent from '@/pages/cargo/list-content.vue'
	import {getPulldownConfirmSelection, onError} from '@/api/cargo/index.js'
	import dayjs from '@/common/util/dayjs.min.js'
	import cargoMixin from '@/pages/cargo/cargo-mixin.js'
	import flightCard from '@/pages/cargo/leaveport/components/flight-card.vue'
	import {DIC} from '@/common/dic.js'
	import unloadingFlightCard from '@/pages/cargo/pulldown/components/unloading-flight-card.vue'
	export default {
		mixins: [cargoMixin],
		components: {
			navBar,
			listContent,
			flightCard,
			unloadingFlightCard
		},
		data() {
			return {
				// 接收所有集装器信息
				containers: [],
				// 航班列表
				list: [],
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
			console.log('onreachbotoom')
			this.loadList()
		},
		onLoad (e) {
			if (e.hasOwnProperty('history') && e.history === 'true') {
				this.history = true
			}
		},
		mounted () {
			this.$loading()
			this.getPulldownConfirmSelection()
		},
		methods: {
			getPulldownConfirmSelection () {
				getPulldownConfirmSelection().then(res => {
					console.log('getPulldownConfirmSelection', res)
					if (res.status) {
						if (res.data.length === 0) {
							this.loadStatus = 'nomore'
						}
						let index = 0
						for (let key in res.data) {
							let arr = [...res.data[key]]
							let obj = {
								id: index++,
								flight: key,
								opDate: '',
								status: 'RECLAIMED',
								number: arr.filter(e => e.status === 'RECLAIMED').length,
								abnormal: false,
								abNumber: 0,
								arr: arr
							}
							if (arr[0].opDate) {
								obj.opDate = arr[0].opDate.substr(0, 10)
							}
							this.list.push(obj)
						}
						this.list.sort((a, b) => b.number - a.number)
						this.listBackUp = [...this.list]
						this.list = this.list.slice(0, this.page.pageSize)
						this.$refs.listContent.setFlightList(this.list)
						this.loadStatus = 'loadmore'
					}
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
			},
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
				let aIdx = DIC.PULLDOWNSTATUS.findIndex(e => e === a.status)
				let bIdx = DIC.PULLDOWNSTATUS.findIndex(e => e === b.status)
				if (aIdx < bIdx) {
					return 1
				} else {
					return -1
				}
			},
			
			clickCard (e) {
				let containers = e.arr
				containers.sort((a, b) => this.compareStatus(a, b))
				uni.setStorageSync('pulldown-confirm-sort-car', containers)
				uni.navigateTo({
					url: `/pages/cargo/sort-page?operationType=PULL_CONFIRM&direction=PULL&pageName=pulldown-confirm&portDirection=PULL`
				})
			}
		}
	}
</script>

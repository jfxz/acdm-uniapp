/*
* 界面名称:卸机
* 界面功能:
* 其他    :
* 时间    :2020-8-22 12:34:11
* 作者    :gyb
*/
<template>
	<view>
		<!-- 导航栏 -->
		<nav-bar
			 title="卸机"
			:content-not-null="true"
			:show-search-bar="showSearchBar"
			:input-value="inputValue"
			@scanCode="scanCode"
			@resetInputValue="resetInputValue"
			@inputGetCargoInfo="getFlights"
			@changeSearchBarStatus="changeSearchBarStatus">
		</nav-bar>
		
		<!-- 内容 -->
		<view :class="{'search-bar-margin-top': showSearchBar}">
			<!-- 如果内容为空 -->
			<template v-if="list.length==0">
				<view class="content-null">
					<view class="list-null-word">
						<image src="@/static/null-list.png"></image>
						<view>
							无航班信息
						</view>
					</view>
				</view>
			</template>
			
			<!-- 如果内容不为空 -->
			<template v-else>
				<view v-show="showList"  class="list">
					<view :class="{playlist: true, 'searchbar-height': showSearchBar}">
						<view style="margin-bottom:10rpx;">
							<slot name="top">
							</slot>
						</view>
						
						<block v-for="item in list" :key="item.id">
							<!-- 卡片 -->
							<view class="item" style="margin-top: 10rpx;" @tap="checkPlateBox(item)">
								<view class="item-padding-middle" style="padding-top: 15rpx;">
									<image src="@/static/flight-cargo.png"></image>
								</view>
								<view class="item-padding-right">
									<unloading-flight-card :statusDic="statusDic" :item-ori="item"></unloading-flight-card>
								</view>
							</view>
						</block>
						
					</view>
				</view>
			</template>
		</view>
	</view>
</template>

<script>
	import navBar from '@/pages/cargo/nav-input-bar.vue'
	import listContent from '@/pages/cargo/list-content.vue'
	import flightInfoCard from '@/pages/cargo/flight-info-card.vue'
	import bottomBar from '@/pages/cargo/bottom-bar.vue'
	import bottomBarLeftSelectall from '@/pages/cargo/bottom-bar-left-selectall.vue'
	import unloadingFlightCard from '@/pages/cargo/enterport/components/unloading-flight-card.vue'
	import {onError, selectFlightList, unloadingInfo, getUnloaderList} from '@/api/cargo/index.js'
	import { validatenull } from '@/common/util/validate.js'
	import { debounce } from '@/common/util/util.js'
	import cargoMixin from '../cargo-mixin.js'
  import {mapGetters} from 'vuex'
	export default {
		mixins: [cargoMixin],
		components: {
			navBar,
			listContent,
			flightInfoCard,
			bottomBar,
			bottomBarLeftSelectall,
			unloadingFlightCard
		},
		data () {
			return {
				selectFlightForm: {
					direction: 'A',
					operationType: 'UNLOADER',
					airportCode: 'ZSAM',
					pageNumber: 0,
					pageSize: 50
				},
				unloadingInfoForm: {
					flight: '',
					uld: ''
				},
				// 用来保存接口返回的航班列表，前端分页
				flightList: [],
				// 刷新列表用
				showList: true,
				displayList: [],
				// 是否航班列表全部加载完毕
				endFlag: false,
				// 记载情况。可选值：loadmore,loading,nomore
				loadStatus: 'loadmore',
        statusDic: []
			}
		},
    computed: {
      ...mapGetters(['remoteDic'])
    },
		mounted () {
      if (this.remoteDic && this.remoteDic.BASE_FLIGHT_STATUS) {
        this.statusDic = this.remoteDic.BASE_FLIGHT_STATUS.map(e => {
          return {
            value: e.statusCode,
            label: e.description
          }
        })
      } else {
        this.statusDic = this.depStatusList
      }
			this.selectFlightList()
		},
		onReachBottom () {
			this.loadmore()
		},
		methods:{
			generateObj (obj) {
				return {
					images: [],
					images2: [],
					images3: [],
					selectedPicNums: 0,
					showItem: true,
					selected: false,
					pass: false,
					...obj,
					carNumber: 0,
					boxNumber: 0,
					boardNumber: 0,
					containerTypes: [],
				}
			},
			setFlightList (list) {
				var that = this
				this.showList = false
				this.list = []
				var that = this
				list.forEach((e, idx, arr1) => {
					let obj = this.generateObj(e)
					this.list.push(obj)
				})
				setTimeout(function () {
					that.showList = true
					uni.hideLoading()
				}, 500)
			},
			
			checkPlateBox: debounce(function (item) {
				uni.setStorageSync('unloading_flight_info', [item])
				uni.navigateTo({
					url: `/pages/cargo/enterport/unloading-plate-box`
				})
			}),
			selectFlightList () {
				this.$loading()
				this.loadStatus = 'loading'
				selectFlightList(this.selectFlightForm).then(res => {
					if (res.status) {
						this.flightList = res.data
						this.flightList.sort(this.sortFlightStatus)
						this.list = res.data.slice(0, this.selectFlightForm.pageSize)
						this.selectFlightForm.pageNumber++
						this.loadStatus = 'loadmore'
						this.$nextTick(function(){
							uni.hideLoading()
						})
					}
				}).catch(err => {
					onError(err)
					console.log('err-selectFlightList', err)
				})
			},
      
      // 按照到达、途中、无状态的顺序排序
      sortFlightStatus (a, b) {
        // 如果a、b都没有航班状态/a有航班状态，但b没有，则维持现状
        if (!b.flightStatus) {
          return -1
        } else if (!a.flightStatus && b.flightStatus) {
          return 1
        }
        if (b.flightStatus === 'ARR') {
          return 1
        }
        return -1
      },
      
			// 模糊搜索航班
			getFlights (e) {
				if (e === '') {
					this.selectFlightForm.pageNumber = 0
					this.selectFlightList()
				} else {
					e = e.toUpperCase()
					let flights = this.flightList.filter(v => v.flight && (v.iataCarrier + v.flight).toUpperCase().indexOf(e) > -1)
					this.setFlightList(flights)
				}
			},
			
			loadmore () {
				if (!this.endFlag) {
					this.loadStatus = 'loading'
					let start = this.selectFlightForm.pageNumber * this.selectFlightForm.pageSize
					let end = start + this.selectFlightForm.pageSize
					if (end < this.flightList.length) {
						this.selectFlightForm.pageNumber++
						this.loadStatus = 'loadmore'
					} else {
						end = this.flightList.length - 1
						this.endFlag = true
						this.loadStatus = 'nomore'
					}
					this.list = [...this.list, ...this.flightList.slice(start, end)]
				}
			},
			unloadingInfo () {
				unloadingInfo(this.unloadingInfoForm).then(res => {
					console.log('unloadingInfo', res)
				})
			},
			getUnloaderList () {
				getUnloaderList(this.unloaderListForm).then(res => {
					console.log('getUnloaderList', res)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search-bar-margin-top {
		margin-top: calc(var(--status-bar-height) + 85rpx);
	}
	
	// 列表为空时的页面的文字的样式
	.content-null {
	 	display: flex;
	 	width: 100%;
	 	height: 60vh;
	 	justify-content: center;
	 	align-items: center;
	 	.list-null-word {
	 		display: flex;
	 		flex-direction: column;
	 		align-items: center;
	 		margin: 0 auto;
	 		font-family: SourceHanSansSC-Regular;
	 		font-size: 28rpx;
	 		letter-spacing: 1rpx;
	 		color: #a6a6a6;
	 		image {
	 			width: 145rpx;
	 			height: 95rpx;
	 		}
	 	}
	}
	
	// 列表样式
	.list {
		display: flex;
		flex-direction: column;
		align-items: center;
		
		.searchbar-height {
			overflow-y: auto;
		}
		.playlist {
		}
		.item {
			display: flex;
			align-items: center;
			width: calc(100vw - 40rpx);
			margin-top: 22rpx;
			background-color: #ffffff;
			padding: 21rpx 13rpx 0 30rpx;
			.item-padding-left {
				margin-right: 20rpx;
				.select {
					height: 35rpx;
					width: 35rpx;
				}
			}
			.item-padding-middle {
				align-self: flex-start;
				margin-right: 17rpx;
				image {
					height: 54rpx;
					width: 54rpx;
				}
			}
			.item-padding-right {
				width: 100%;
			}
		}
	}
</style>

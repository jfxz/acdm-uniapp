/*
* 界面名称:装卸Z5站坪监控视图
* 界面功能:
* 其他    :
* 时间    :2020-10-23 09:20:55
* 作者    :gyb
*/
<template>
	<view>
		<nav-bar
			:title="title"
			:content-not-null="true"
			:show-search-bar="showSearchBar"
			:input-value="inputValue"
			:show-scan="false"
			@changeSearchBarStatus="changeSearchBarStatus">
		</nav-bar>
		
		<uploader-search
			ref="uploaderSearch"
		 :auto-show="autoShow"
		 :show-origin="false"
		 @search="search"
		></uploader-search>
		
		<view class="switch-btn">
			<view class="text">
				只显示异常车数
			</view>
			<view>
				<switch
					color="#62E4A6"
					:checked="checkFlag"
					@change="changeCheckFlag"></switch>
			</view>
		</view>
		<!-- <view class="tooltip">
			当前显示截关前一小时内航班
		</view> -->
		
		
		
		<refresh
			:scroll-height="scrollHeight"
			@interrupt="interrupt"
			@pushToInterrupt="to"
			@backToInterrupt="back"
			@finished="finished" >
			<template slot="top">
				<view :style="'z-index:-188;position: absolute;bottom: 0px;height: ' + 40 + 'px;line-height:' + 40 + 'px;width: 100%;text-align: center;'">
					<u-loading mode="circle"></u-loading>
				</view>
			</template>
			<template slot="content">
				<view class="flights-page">
					<block v-for="item in list" :key="item.id">
						<flight-car-card
							:flight-obj="item"
						></flight-car-card>
					</block>
				</view>
			</template>
		</refresh>
		
	</view>
</template>

<script>
	import navBar from '@/pages/cargo/nav-bar.vue'
	import listContent from '@/pages/cargo/list-content.vue'
	import uploaderSearch from '@/pages/cargo/uploader-search.vue'
	import { getStationFlat, onError } from '@/api/cargo/index.js'
	import dayjs from '@/common/util/dayjs.min.js'
	import flightCarCard from '@/pages/cargo/monitor/flight-car-card.vue'
	import refresh from '@/pages/cargo/monitor/components/refresh.vue'
	import { validatenull } from '@/common/util/validate.js'
	import { deepCopy } from '@/common/util/util.js'
	export default {
		components: {
			navBar,
			listContent,
			uploaderSearch,
			flightCarCard,
			refresh
		},
		data () {
			return {
				title: '装卸Z5站坪监控视图',
				showSearchBar: false,
				inputValue: '',
				list: [],
				form: {
					flight: '',
					date: ''
				},
				checkFlag: false,
				showLoading: false,
				autoShow: false,
				tip: '',
				scrollHeight: 0
			}
		},
		
		mounted () {
			// this.changeSearchBarStatus()
			this.form.date = dayjs().format('YYYY-MM-DD') + ' 00:00:00'
			this.getList(this.form)
			let res = uni.getSystemInfoSync()
			console.log('mounted', res)
			this.scrollHeight = res.screenHeight - res.statusBarHeight - 44 - 54 - 30
		},
		
		onPullDownRefresh () {
			this.showLoading = true
		},
		
		methods: {
			changeCheckFlag (param) {
				let value = param.detail.value
				this.checkFlag = value
				this.list.forEach(e => {
					e.operations.forEach(v => {
						if (v.backup) {
							if (value) {
								let arr = v.backup.filter(k => k.abnormal === value)
								if (arr.length === 0) {
									v.showContainer = false
									v.containerCars = arr
								}
							} else {
								v.containerCars = v.backup
							}
						}
					})
				})
				this.$forceUpdate()
			},
			
			changeSearchBarStatus () {
				this.autoShow = true
				this.$refs.uploaderSearch.changeStatus()
			},
			
			search (searchForm) {
				this.form.flight = searchForm.flight
				this.form.date = searchForm.flightDate + ' 00:00:00'
				this.getList(this.form)
			},
			
			getList (form) {
				this.$loading()
				getStationFlat(form).then(res => {
					console.log('getStationFlat', res)
					if (res.status) {
						this.list = []
						let index = 0
						for (let key in res.data) {
							let e = res.data[key]
							e.abnormalCar.forEach((v, idx) => {
								v.id = idx
							})
							let obj = {
								...e,
								id: index++,
								flight: key,
								standCode: e.stand,
								closeOffNum: 0,
								abnormalNum: 0,
								showOperations: false
							}
							obj.operations.forEach(e => {
								e.showContainer = false
								e.containerCars = []
								if (!validatenull(obj.normalCar)) {
									e.containerCars = obj.normalCar.filter(v => v.driverName === e.driverName).map(v => {return {...v, abnormal: false}})
									
								}
								if (!validatenull(obj.abnormalCar)) {
									let abnormalCarArr = obj.abnormalCar.filter(v => v.driverName === e.driverName).map(v => {return {...v, abnormal: true}})
									e.containerCars = [...abnormalCarArr, ...e.containerCars]
									obj.abnormalNum += abnormalCarArr.length
								}
								e.backup = e.containerCars
								obj.closeOffNum += e.containerCars.length
							})
							this.list.push(obj)
						}
						this.list.sort((a, b) => {
							let diff = b.abnormalNum - a.abnormalNum
							if (diff === 0) {
								return b.closeOffNum - a.closeOffNum
							} else {
								return diff
							}
						})
						if (this.form.flight !== '') {
							this.list = this.list.filter(e => e.flight.indexOf(this.form.flight) !== -1)
						}
						this.$refs.uploaderSearch.close()
					} else {
						this.$message(res.message)
					}
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
			},
			
			interrupt (e) {
				var that = this
				setTimeout(()=>{
					that.getList(that.form)
					e()
				}, 1000)
				
			},
			to (){
			},
			back (){
			},
			finished () {
			}
		}
	}
</script>

<style lang="scss">
	.switch-btn {
		position: relative;
		z-index: 99;
		background-color: #fff;
		padding: 29rpx 24rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.text {
			font-family: PingFangSC-Medium;
			font-size: 28rpx;
			color: #333333;
			font-weight: bold;
		}
	}
	.tooltip {
		width: 100vw;
		padding: 6rpx 0;
		text-align: center;
		background-color: #FFF6DF;
		font-family: PingFangSC-Regular;
		font-size: 24rpx;
		color: #F5B964;
	}
	.flights-page {
		margin-top: 18rpx;
	}
	.loading-row {
		display: flex;
		justify-content: center;
		padding-bottom: 20rpx;
	}
</style>

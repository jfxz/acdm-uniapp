/*
* 界面名称:拉下查询(配载查询)
* 界面功能:
* 其他    :
* 时间    :2020-10-19 11:17:34
* 作者    :gyb
*/
<template>
	<view>
		<!-- 导航 -->
		<nav-bar
			:title="title"
			:content-not-null="true"
			:show-search-bar="showSearchBar"
			:input-value="inputValue"
			:show-scan="false"
			@resetInputValue="resetInputValue"
			@inputGetCargoInfo="inputGetCargoInfo"
			@changeSearchBarStatus="changeSearchBarStatus">
		</nav-bar>
		
		<uploader-search
			style="margin-bottom: 40rpx;"
			ref="uploaderSearch"
		 :show-origin="false"
		 @search="search"
		></uploader-search>
		
		<!-- 内容 -->
		<list-content
			 ref="listContent"
			:show-split-line="true"
			:not-id="true"
			:content-not-null="list.length!=0"
			:show-search-bar="showSearchBar"
			:dont-show-none-list="true"
			@clickCard="clickCard">
			<template v-slot:cardIcon>
				<image style="width:54rpx;height:54rpx;" src="@/static/flight-cargo.png"></image>
			</template>
			<template v-slot:cardRight="scope">
				<search-transfer-flight-card
					:item-ori="scope.item">
				</search-transfer-flight-card>
			</template>
		</list-content>
		
		<uni-drawer ref="drawer" mode="right">
			<view style="padding:30rpx;">
				<view>抽屉式导航</view>
			</view>
		</uni-drawer>
	</view>
</template>

<script>
	import navBar from '@/pages/cargo/nav-bar.vue'
	import listContent from '@/pages/cargo/list-content.vue'
	import searchTransferFlightCard from '@/pages/cargo/pulldown/components/search-transfer-flight-card.vue'
	import uploaderSearch from '@/pages/cargo/uploader-search.vue'
	import uniDrawer from "@/components/uni-drawer/uni-drawer.vue"
	import { getPulldownSearchView, onError } from '@/api/cargo/index.js'
	import cargoMixin from '@/pages/cargo/cargo-mixin.js'
	import dayjs from '@/common/util/dayjs.min.js'
	import {DIC} from '@/common/dic.js'
	import { validatenull } from '@/common/util/validate.js'
	export default {
		mixins: [cargoMixin],
		components: {
			navBar,
			listContent,
			uploaderSearch,
			uniDrawer,
			searchTransferFlightCard
		},
		data () {
			return {
				title: '拉下查询',
				// 航班列表
				list: [],
				// 集装器列表
				containers: []
			}
		},
		onBackPress () {
			if (!this.$refs.uploaderSearch.getStatus()) {
				this.$refs.uploaderSearch.changeStatus()
				this.list = []
				this.$refs.listContent.setList(this.list)
				this.title= '拉下查询'
				return true
			} else {
				return false
			}
			return true
		},
		methods: {
			clickCard (e) {
				let containers = e.arr
				containers.sort((a, b) => this.compareStatus(a, b))
				uni.setStorageSync('pulldown-transfer-search-car', containers)
				uni.navigateTo({
					url: `/pages/cargo/sort-page?operationType=PULLDOWNTRANSFERSEARCH&direction=PULLSEARCH&pageName=pulldown-warehouse-search&portDirection=PULLSEARCH`
				})
			},
			compareStatus (a, b) {
				let aIdx = DIC.PULLDOWNSTATUS.findIndex(e => e === a.status)
				let bIdx = DIC.PULLDOWNSTATUS.findIndex(e => e === b.status)
				if (aIdx < bIdx) {
					return false
				} else {
					return true
				}
			},
			
			uploadImageBefore () {
				// 不要删除，重定义函数
			},
			changeSearchBarStatus () {
				this.$refs.uploaderSearch.changeStatus()
			},
			search (searchForm1) {
				let searchForm = {}
				searchForm.flight = searchForm1.flight
				searchForm.opDate = dayjs(searchForm1.flightDate + ' 00:00:00').valueOf()
				// searchForm.flight = 'MU5598'
				// searchForm.opDate = dayjs('2020-10-20' + ' 00:00:00').valueOf()
				this.$loading()
				console.log('searchForm', searchForm)
				getPulldownSearchView(searchForm).then(res => {
					console.log('getPulldownSearchView', res)
					if (res.status && !validatenull(res.data)) {
						this.title = searchForm.flight
						this.list = []
						let idx = 0
						this.containers = []
						for (let key in res.data) {
							let e = res.data[key]
							if (e.length > 0) {
								this.list.push({
									flight: key,
									registration: e[0].registration,
									opDate: e[0].opDate,
									index: idx++,
									arr: e
								})
							} else {
								this.list.push({
									flight: key,
									registration: '',
									opDate: '',
									index: idx++,
									arr: []
								})
							}
							this.containers = [...this.containers, ...res.data[key]]
						}
						this.$refs.listContent.setList(this.list)
					} else {
						this.title = '拉下查询'
						this.list = []
						this.$refs.listContent.setList(this.list)
						this.$message('查询结果为空')
					}
					uni.hideLoading()
				}).catch(err => {
					onError(err)
					uni.hideLoading()
				})
			}
		}
	}
</script>

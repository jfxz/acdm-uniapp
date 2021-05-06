/*
* 界面名称:装机单查询
* 界面功能:
* 其他    :
* 时间    :2020-8-26 14:17:34
* 作者    :gyb
*/
<template>
	<view>
		<!-- 导航 -->
		<nav-bar
			:title="title"
			:flight-info="flightInfo"
			:content-not-null="true"
			:show-search-bar="showSearchBar"
			:show-scan="false"
			:is-comparison="true"
			@changeSearchBarStatus="changeSearchBarStatus"
			@getVersions="refreshBtn"
			@comparison="comparison">
		</nav-bar>
		
		<uploader-search
			style="margin-bottom: 40rpx;"
			ref="uploaderSearch"
		 :show-origin="false"
		 @search="search">
		</uploader-search>
		
		<view
			class="version"
			v-show="showUploaderSearch"
			@tap="openVersionModal">
			<image src="/static/down-arror.png"></image>
			<view class="version-name">{{currentVersion}}</view>
		</view>
		
		<loader-top
			v-if="list.length!=0"
			ref="loaderTop">
		</loader-top>
		
		<!-- 内容 -->
		<list-content
			 ref="listContent"
			:show-split-line="true"
			:not-id="true"
			:not-loader="false"
			:content-not-null="list.length!=0"
			:show-search-bar="showSearchBar"
			:dont-show-none-list="true">
			<template v-slot:cardIcon>
				<image style="width:54rpx;height:54rpx;" src="@/static/cabin.png"></image>
			</template>
			<template v-slot:cardRight="scope">
				<cabin-card
				  :loader-list="true"
					:item-ori="scope.item">
				</cabin-card>
			</template>
		</list-content>
		
		<flight-selection-dialog
			ref="flightSelectionDialog"
			@selectFlight="selectFlight">
		</flight-selection-dialog>
		
		<version-modal
		 ref="versionModal"
		 @change="changeVersion">
		</version-modal>
			
		<version-comparison-modal
		 ref="versionComparisonModal"
		 @change="changeComparisonVersion">
		</version-comparison-modal>
	</view>
</template>

<script>
	import navBar from '@/pages/cargo/nav-bar-loader.vue'
	import listContent from '@/pages/cargo/list-content.vue'
	import cabinCard from '@/pages/cargo/leaveport/components/cabin-card-load.vue'
	import uploaderSearch from '@/pages/cargo/uploader-search.vue'
	import cargoMixin from '@/pages/cargo/cargo-mixin.js'
	import loaderTop from '@/pages/cargo/loader-top.vue'
	import flightSelectionDialog from '@/pages/cargo/flight-selection-dialog'
	import versionModal from '@/pages/cargo/version-modal.vue'
	import versionComparisonModal from '@/pages/cargo/version-comparison-modal.vue'
	import {
		getFlightInfo,
		getFormList,
		getFlights,
		onError,
		validatenull,
		getFilteredFlight
	} from '@/api/cargo/index.js'
	export default {
		mixins: [cargoMixin],
		components: {
			navBar,
			listContent,
			cabinCard,
			uploaderSearch,
			loaderTop,
			flightSelectionDialog,
			versionModal,
			versionComparisonModal
		},
		data () {
			return {
				title: '装机单查询',
				flights: [],
				searchForm: {},
				searchFormCopy: {},
				flightInfo: {}
			}
		},
		watch: {
			list: {
				handler (newval, oldval) {
					if (newval.length === 0) {
						this.showUploaderSearch = false
					}
				},
				deep: true
			}
		},
		
		onBackPress () {
			let transitionFlag = uni.getStorageSync('transition_flag')
			if (transitionFlag && transitionFlag === 'true') {
				uni.removeStorageSync('transition_flag')
				return false
			}
			if (!this.$refs.uploaderSearch.getStatus()) {
				this.list = []
				this.$refs.uploaderSearch.changeStatus()
				this.$refs.listContent.setList(this.list)
				this.title= '装机单查询'
				this.flightInfo = {}
				return true
			} else {
				return false
			}
			return true
		},
		methods: {
			search (searchForm1) {
				this.$loading()
				let searchForm = {...searchForm1}
				searchForm.flight = searchForm.flight.match(/\d+/g) ? searchForm.flight.match(/\d+/g)[0] : ''
				searchForm.origin = 'XMN'
				searchForm.flightDate = searchForm1.flightDate + ' 00:00:00'
				this.searchForm = {...searchForm}
        console.log('before-search', searchForm)
				getFlights(searchForm).then(res => {
					console.log('getFlights-res', res) 
					if (res.status && !validatenull(res.data)) {
						this.flights = [...new Set(res.data)]
						if (this.flights.length === 1) {
							// let word = this.flights[0].match(/[a-zA-Z0-9]+/g)
							if (this.flights[0].indexOf('9C') === 0 || this.flights[0].indexOf('AQ') === 0) {
								let testFlight = this.flights[0]
								uni.hideLoading()
								this.$message(`航司${testFlight}被过滤，不可查询`)
								return
							} else {
								uni.hideLoading()
								searchForm.flight = this.flights[0]
								this.searchIndetail(searchForm)
							}
							
						} else if (this.flights.length > 1){
							this.$refs.flightSelectionDialog.open(this.flights)
							uni.hideLoading()
						} else {
							this.$message('无此航班')
							this.$refs.uploaderSearch.changeStatus()
							uni.hideLoading()
						}
					} else {
						this.$message(res.message)
						this.$refs.uploaderSearch.changeStatus()
						uni.hideLoading()
					}
				}).catch(err => {
					onError(err)
				})
			},
			
			changeSearchBarStatus () {
				this.$refs.uploaderSearch.changeStatus()
			},
			
			selectFlight (flight) {
				if (flight.indexOf('9C') === 0 || flight.indexOf('AQ') === 0) {
					uni.hideLoading()
					this.$message(`航司${flight}被过滤，不可查询`)
				} else {
					uni.hideLoading()
					this.searchForm.flight = flight
					this.searchIndetail(this.searchForm)
				}
			},
			
			getTitle () {
				this.flightInfo = {}
				return '装机单查询'
			},
			
			searchIndetail (searchForm) {
				this.$loading()
				this.searchFormCopy = searchForm
        console.log('before-formList', searchForm)
				getFlightInfo(searchForm).then(res => {
					console.log('getFlightInfo-res', res)
					if (res.status && res.data) {
						this.flightInfo = res.data
					}
				}).catch(err => {
					onError(err)
				})
        
				getFormList(searchForm).then(res => {
					console.log('getFormList', res)
					if (res.status && !validatenull(res.data)) {
						if (res.data.REMARK) {
							try {
								this.$refs.loaderTop.addInfo(res.data.REMARK)
							} catch (err) {
								console.log('err', err)
							}
						}
						this.$message(res.message)
						this.getVersions(searchForm)
					} else {
						this.title = '装机单查询'
						this.flightInfo = {}
						this.list = []
						try {
							// this.$nextTick(function(){
							// 	this.$refs.loaderTop.init({})
							// })
						} catch (err) {
							console.log('err', err)
						}
						this.$refs.uploaderSearch.changeStatus()
						this.$refs.listContent.setList(this.list)
						this.$message(res.message)
						uni.hideLoading()
					}
				}).catch(err => {
					onError(err)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.version {
		display: flex;
		flex-direction: row-reverse;
		width: 100vw;
		padding-right: 20rpx;
		$imageSize: 35rpx;
		image {
			width: $imageSize;
			height: $imageSize;
		}
		.version-name {
			margin-right: 20rpx;
		}
	}
	.uploader-search {
		margin-bottom: 40rpx;
	}
</style>
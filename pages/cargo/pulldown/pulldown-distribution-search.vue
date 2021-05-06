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
		 @search="search">
		</uploader-search>
		
		<!-- 内容 -->
		<swiper class="mySwiper" duration="200" @transition="transition">
			<swiper-item class="mySwiperItem">
				<list-content
					 ref="listContent"
					:show-split-line="true"
					:not-id="true"
					:content-not-null="list.length!=0"
					:show-search-bar="showSearchBar"
					:dont-show-none-list="true"
					:show-right="showRight"
					@clickCard="clickCard">
					<template v-slot:cardIcon>
						<image style="width:54rpx;height:54rpx;" src="@/static/cabin.png"></image>
					</template>
					<template v-slot:cardRight="scope">
						<distribution-card
							:show-right="showRight"
							:item-ori="scope.item">
						</distribution-card>
					</template>
				</list-content>
			</swiper-item>
		</swiper>
		
		<uni-drawer ref="drawer" mode="right">
			<view style="padding:30rpx;">
				<timeline></timeline>
			</view>
		</uni-drawer>
	</view>
</template>

<script>
	import navBar from '@/pages/cargo/nav-bar.vue'
	import listContent from '@/pages/cargo/list-content.vue'
	import distributionCard from '@/pages/cargo/pulldown/components/distribution-card.vue'
	import uploaderSearch from '@/pages/cargo/uploader-search.vue'
	import uniDrawer from "@/components/uni-drawer/uni-drawer.vue"
	import { getPulldownSearchView, onError } from '@/api/cargo/index.js'
	import cargoMixin from '@/pages/cargo/cargo-mixin.js'
	import dayjs from '@/common/util/dayjs.min.js'
	import timeline from '@/pages/cargo/pulldown/timeline.vue'
	import { debounce } from '@/common/util/util.js'
	import { validatenull } from '@/common/util/validate.js'
	export default {
		mixins: [cargoMixin],
		components: {
			navBar,
			listContent,
			distributionCard,
			uploaderSearch,
			uniDrawer,
			timeline
		},
		data () {
			return {
				title: '拉下查询',
				list: [],
				showRight: true,
				refreshRight: true,
				timer: null
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
		mounted () {
			this.timer = debounce(function (event) {
				this.$loading()
				if (event.detail.dx < 0) {
					this.showRight = true
				} else {
					this.showRight = false
					this.initContainerTimelines()
				}				
				this.refreshRight = false
				this.$nextTick(function(){
					this.refreshRight = true
					uni.hideLoading()
				})
			}, 100)
		},
		methods: {
			clickCard (item) {
				let tasks = this.initTasks(item)
				uni.setStorageSync('timeline', tasks)
				uni.navigateTo({
					url: `/pages/cargo/pulldown/timeline-page`
				})
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
						for (let key in res.data) {
							this.list = [...this.list, ...res.data[key]]
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
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.mySwiper {
		height: calc(100vh - 44px);
		.mySwiperItem {
			padding:0 15rpx;
			display: flex;
			overflow-y: auto;
		}
	}
</style>

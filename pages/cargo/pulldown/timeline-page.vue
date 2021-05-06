/*
* 界面名称:时间线页面
* 界面功能:
* 其他    :
* 时间    :2020-10-28 10:07:38
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
			@showSelectFlag="showSelectFlag"
			@scanCode="scanCode"
			@resetInputValue="resetInputValue"
			@inputGetCargoInfo="inputGetCargoInfo"
			@changeSearchBarStatus="changeSearchBarStatus">
			<template v-slot:right>
				<view></view>
			</template>
		</nav-bar>
		
		<timeline
			style="background-color: #ffffff;"
			ref="timeline">
		</timeline>
	</view>
</template>

<script>
	import navBar from '@/pages/cargo/nav-bar.vue'
	import listContent from '@/pages/cargo/list-content.vue'
	import flightInfoCard from '@/pages/cargo/flight-info-card.vue'
	import distributionCard from '@/pages/cargo/pulldown/components/distribution-card.vue'
	import distributionLastestCard from '@/pages/cargo/pulldown/components/distribution-lastest-card.vue'
	import uploaderSearch from '@/pages/cargo/uploader-search.vue'
	import uniDrawer from "@/components/uni-drawer/uni-drawer.vue"
	import cargoMixin from '@/pages/cargo/cargo-mixin.js'
	import loaderTop from '@/pages/cargo/loader-top.vue'
	import dayjs from '@/common/util/dayjs.min.js'
	import timeline from '@/pages/cargo/pulldown/timeline.vue'
	import { debounce } from '@/common/util/util.js'
	export default {
		mixins: [cargoMixin],
		components: {
			navBar,
			listContent,
			flightInfoCard,
			distributionCard,
			uploaderSearch,
			loaderTop,
			uniDrawer,
			timeline,
			distributionLastestCard
		},
		data () {
			return {
				title: '时间线',
				list: [],
				showRight: true,
				refreshRight: true,
				timer: null
			}
		},
		
		mounted () {
			let tasks = uni.getStorageSync('timeline')
			if (tasks) {
				this.$refs.timeline.initTasks(tasks)
				uni.removeStorageSync('timeline')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.mySwiper {
		height: calc(100vh - 44px);
	}
	.mySwiperItem {
		padding:0 15rpx;
		display: flex;
	}
	.lastest {
		// background-color: #ffffff;
		height: 153rpx;
		padding: {
			top: 3rpx;
			left: 5rpx;
			bottom:10rpx;
		}
	}
	.right-half {
		width: calc(100vw - 330rpx);
		height: 100%;
		overflow-y: auto;
		margin-top: 21rpx;
		margin-left: 1rpx;
	}
</style>

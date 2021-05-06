<template>
	<view>
		<nav-bar
			:title="title"
			:show-sort="true"
			:content-not-null="true">
			<template v-slot:right>
			</template>
		</nav-bar>
		
		<list-content
			 ref="listContent"
			:not-id="true"
			:content-not-null="list.length!=0"
			:show-search-bar="false">
			<template v-slot:cardIcon>
				<image style="width:54rpx;height:54rpx;" src="@/static/flight-cargo.png"></image>
			</template>
			<template v-slot:cardRight="scope">
				<container-card
					:sort="true"
					:item-ori="scope.item"
					:show-upload="false">
				</container-card>
			</template>
		</list-content>
	</view>
</template>

<script>
	import navBar from '@/pages/cargo/leaveport/components/nav-closeoff-bar.vue'
	import listContent from '@/pages/cargo/list-content.vue'
	import containerCard from '@/pages/cargo/leaveport/components/container-card.vue'
	import bottomBar from '@/pages/cargo/bottom-bar.vue'
	import { closeoffLock, closeoffUnlock, onError, getCloseoffVersions } from '@/api/cargo/index.js'
	export default {
		data () {
			return {
				list: [],
				title: '出库截关'
			}
		},
		components: {
			navBar,
			listContent,
			containerCard
		},
		mounted () {
			let list = uni.getStorageSync('closeoff_versionlist')
			if (list) {
				uni.removeStorageSync('closeoff_versionlist')
				this.list = list
				this.$refs.listContent.setList(this.list)
			}
		},
		onLoad (e) {
			this.title = e.versionName ? e.versionName : this.title
		}
	}
</script>

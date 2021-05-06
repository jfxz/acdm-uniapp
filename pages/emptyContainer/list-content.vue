<template>
	<view class="list" v-if="showList">
		<view v-for="(card, index) in list" :key="index">
			<slot name="card" :card="card">
			</slot>
		</view>
	</view>
</template>

<script>
	export default {
		data () {
			return {
				list: [],
				showList: true
			}
		},
		
		methods: {
			initList (list) {
				this.list = list
				console.log('this.list', this.list)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list {
		margin: 0 17rpx;
		margin-top: 10rpx;
		// background-color: red;
		height: calc(100vh - 108rpx);
	}
</style>

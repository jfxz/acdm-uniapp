<template>
	<view style="width: 100vw;height: 100vh;background-color: #ffffff;"></view>
</template>

<script>
	export default {
		data () {
			return {
				
			}
		},
		onShow () {
			uni.setStorageSync('transition_flag', 'true')
			uni.navigateBack({
				delta: 1
			})
		}
	}
</script>

<style>
</style>
